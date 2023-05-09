import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import Task from './Task';
import * as AHooks from 'ahooks';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';
import { RcFile } from 'antd/lib/upload/interface';
import fMessage from '@/components/fMessage';
import { useGetState } from '@/utils/hooks';

export interface FStorageUploadTasksPanelProps {
  bucketName: string;
  availableStorageSize: number;

  onSuccess?(): void;
}

interface FStorageUploadTasksPanelStates {
  uploadTaskQueue: {
    uid: string;
    file: RcFile
    name: string;
    state: 'loading' | 'success' | 'failed';
  }[];
  uploadPanelVisible: boolean;
  uploadPanelOpen: boolean;
}

const initStates: FStorageUploadTasksPanelStates = {
  uploadTaskQueue: [],
  uploadPanelVisible: false,
  uploadPanelOpen: false,
};

interface TasksPanel {
  addTask(files: RcFile[]): void;
}

let storageUploadTasksPanel: TasksPanel | null = null;

function FStorageUploadTasksPanel({ bucketName, availableStorageSize, onSuccess }: FStorageUploadTasksPanelProps) {
  const availableStorage = React.useRef<number>(availableStorageSize);

  const [uploadTaskQueue, set_uploadTaskQueue, get_uploadTaskQueue] = useGetState<FStorageUploadTasksPanelStates['uploadTaskQueue']>(initStates['uploadTaskQueue']);
  const [uploadPanelVisible, set_uploadPanelVisible] = React.useState<FStorageUploadTasksPanelStates['uploadPanelVisible']>(initStates['uploadPanelVisible']);
  const [uploadPanelOpen, set_uploadPanelOpen] = React.useState<FStorageUploadTasksPanelStates['uploadPanelOpen']>(initStates['uploadPanelOpen']);

  AHooks.useMount(() => {
    const panel = {
      addTask,
    };
    storageUploadTasksPanel = panel;
  });

  AHooks.useUnmount(() => {
    storageUploadTasksPanel = null;
  });

  React.useEffect(() => {
    availableStorage.current = availableStorageSize;
  }, [availableStorageSize]);

  const { run } = AHooks.useDebounceFn(() => {
      onSuccess && onSuccess();
    }, {
      wait: 300,
    },
  );

  function addTask(files: RcFile[]) {
    // console.log(files, 'filesfilesfilesfiles#######');
    for (const file of files) {
      if (file.size > 200 * 1024 * 1024) {
        fMessage('单个文件不能大于 200 M', 'warning');
        return;
      }
    }


    const totalSize: number = files.map((f) => f.size).reduce((p, c) => p + c, 0);
    // console.log(availableStorageSize, totalSize, 'use');
    if (availableStorage.current < totalSize) {
      fMessage(FI18n.i18nNext.t('uploadobject_alarm_storage_full'), 'error');
      return;
    }

    const taskQueue: FStorageUploadTasksPanelStates['uploadTaskQueue'] = files.map<FStorageUploadTasksPanelStates['uploadTaskQueue'][0]>((f) => {
      return {
        uid: f.uid,
        name: f.name.replace(/[\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#]/g, '_'),
        file: f,
        state: 'loading',
      };
    });

    set_uploadPanelVisible(true);
    set_uploadPanelOpen(true);
    set_uploadTaskQueue([
      ...taskQueue,
      ...get_uploadTaskQueue(),
    ]);
  }

  function closeAll() {
    set_uploadPanelVisible(false);
    set_uploadTaskQueue([]);
  }

  if (!uploadPanelVisible && uploadTaskQueue.length === 0) {
    return null;
  }

  return (<div className={styles.UploadingTasks}>
    <div className={styles.title}>
      <FComponentsLib.FContentText text={'任务列表'} />
      <Space size={20}>
        <FComponentsLib.FTextBtn
          onClick={() => {
            set_uploadPanelOpen(!uploadPanelOpen);
          }}
          type='default'
        >
          {
            uploadPanelOpen
              ? (<FComponentsLib.FIcons.FDown style={{ fontSize: 12 }} />)
              : (<FComponentsLib.FIcons.FUp style={{ fontSize: 12 }} />)
          }
        </FComponentsLib.FTextBtn>
        <FComponentsLib.FTextBtn
          onClick={async () => {
            // console.log('####38dshlkfjhsdlkjl');
            const isExits: boolean = get_uploadTaskQueue().some((i) => {
              return i.state !== 'success';
            });
            if (isExits) {
              const bool: boolean = await fPromiseModalConfirm({
                title: '提示',
                description: FI18n.i18nNext.t('bucket_msg_cancel_all_uploading_task'),
                cancelText: FI18n.i18nNext.t('bucket_btn_countinue_upload'),
                okText: FI18n.i18nNext.t('bucket_btn_cancel_upload'),
              });
              if (bool) {
                closeAll();
              }
              return;
            }
            closeAll();
          }}
          type='default'
        ><FComponentsLib.FIcons.FClose style={{ fontSize: 12 }} /></FComponentsLib.FTextBtn>
      </Space>
    </div>

    <div className={styles.body} style={{ display: uploadPanelOpen ? 'block' : 'none' }}>
      {
        uploadTaskQueue.some((utq) => {
          return utq.state === 'success';
        }) && (<div
          className={styles.successCount}>有{uploadTaskQueue.filter((utq) => {
          return utq.state === 'success';
        }).length}个文件上传成功
        </div>)
      }

      {
        uploadTaskQueue.map((f, index, uploadTaskQueue) => {
          return (<Task
            key={f.uid}
            task={f}
            bucketName={bucketName}
            onSucceed={async ({ objectName, sha1, uid }) => {

              set_uploadTaskQueue(get_uploadTaskQueue().map((t) => {
                if (t.uid !== uid) {
                  return t;
                }
                return {
                  ...t,
                  state: 'success',
                };
              }));

              const params: Parameters<typeof FServiceAPI.Storage.createObject>[0] = {
                bucketName: bucketName,
                // .replace(new RegExp(/\\|\/|:|\*|\?|"|<|>|\||@|#|\$|\s/, 'g'), '_')
                objectName: objectName,
                sha1: sha1,
              };
              await FServiceAPI.Storage.createObject(params);

              run();
            }}
            onFail={({ objectName, uid }) => {
              set_uploadTaskQueue(get_uploadTaskQueue().map((t) => {
                if (t.uid !== uid) {
                  return t;
                }
                return {
                  ...t,
                  state: 'failed',
                };
              }));
            }}
          />);
        })
      }
    </div>

  </div>);
}

export default FStorageUploadTasksPanel;

export async function getStorageUploadTasksPanel(): Promise<TasksPanel> {
  while (true) {
    if (storageUploadTasksPanel) {
      return storageUploadTasksPanel;
    }
    await FUtil.Tool.promiseSleep(300);
  }
}
