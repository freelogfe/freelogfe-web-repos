import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, StorageHomePageModelState } from '@/models/connect';
import Task from './Task';
import {
  ChangeAction,
  CreateObjectAction,
  FetchBucketsAction,
  FetchObjectsAction,
  FetchSpaceStatisticAction,
} from '@/models/storageHomePage';
import * as AHooks from 'ahooks';
// import fConfirmModal from '@/components/fConfirmModal';
// import FLoadingTip from '@/components/FLoadingTip';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';

export interface FUploadTasksPanelProps {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
}

function FUploadTasksPanel({ dispatch, storageHomePage }: FUploadTasksPanelProps) {

  const successUids = React.useRef<string[]>([]);
  const failedUids = React.useRef<string[]>([]);

  const { run } = AHooks.useDebounceFn(() => {
      dispatch<FetchObjectsAction>({
        type: 'storageHomePage/fetchObjects',
        payload: 'insert',
      });
      dispatch<FetchSpaceStatisticAction>({
        type: 'storageHomePage/fetchSpaceStatistic',
      });
      dispatch<FetchBucketsAction>({
        type: 'storageHomePage/fetchBuckets',
      });
    }, {
      wait: 300,
    },
  );

  const { run: run1 } = AHooks.useDebounceFn(async () => {
    // console.log(successUids, failedUids, 'successUids!Q@#$@#$@!#$@#$#$');
    await dispatch<ChangeAction>({
      type: 'storageHomePage/change',
      payload: {
        uploadTaskQueue: storageHomePage.uploadTaskQueue.map<StorageHomePageModelState['uploadTaskQueue'][number]>((utq) => {
          // console.log(utq.uid, uid, 'f.file.uid !== uid');
          if (successUids.current.includes(utq.uid)) {
            return {
              ...utq,
              state: 'success',
            };
          }
          if (failedUids.current.includes(utq.uid)) {
            return {
              ...utq,
              state: 'failed',
            };
          }
          return utq;
        }),
      },
    });
    successUids.current = [];
    failedUids.current = [];
  }, {
    wait: 300,
  });

  function closeAll() {
    dispatch<ChangeAction>({
      type: 'storageHomePage/change',
      payload: {
        uploadPanelVisible: false,
      },
    });

    setTimeout(() => {
      dispatch<ChangeAction>({
        type: 'storageHomePage/change',
        payload: {
          uploadTaskQueue: [],
        },
      });
    });
  }

  if (!storageHomePage.uploadPanelVisible && storageHomePage.uploadTaskQueue.length === 0) {
    return null;
  }

  return (<div
    className={styles.UploadingTasks}
    // style={{display: !storage.uploadPanelVisible ? 'none' : 'block'}}
  >
    <div className={styles.title}>
      <FComponentsLib.FContentText text={'任务列表'} />
      <Space size={20}>
        <FComponentsLib.FTextBtn
          onClick={() => {
            dispatch<ChangeAction>({
              type: 'storageHomePage/change',
              payload: {
                uploadPanelOpen: !storageHomePage.uploadPanelOpen,
              },
            });
          }}
          type='default'
        >
          {
            storageHomePage.uploadPanelOpen
              ? (<FComponentsLib.FIcons.FDown style={{ fontSize: 12 }} />)
              : (<FComponentsLib.FIcons.FUp style={{ fontSize: 12 }} />)
          }
        </FComponentsLib.FTextBtn>
        <FComponentsLib.FTextBtn
          onClick={async () => {
            const isExits: boolean = storageHomePage.uploadTaskQueue.some((i) => {
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

    <div className={styles.body} style={{ display: storageHomePage.uploadPanelOpen ? 'block' : 'none' }}>
      {
        storageHomePage.uploadTaskQueue.some((utq) => {
          return utq.state === 'success';
        }) && (<div
          className={styles.successCount}>有{storageHomePage.uploadTaskQueue.filter((utq) => {
          return utq.state === 'success';
        }).length}个文件上传成功
        </div>)
      }

      {
        storageHomePage.uploadTaskQueue.map((f, index, uploadTaskQueue) => {
          // console.log(f, 'fffffFFFFFFF2390ueoifjasdf');
          return (<Task
            key={f.uid}
            task={f}
            bucketName={storageHomePage.activatedBucket}
            onSucceed={async ({ objectName, sha1, uid }) => {
              // console.log(objectName, '2309jasdf;lkfjasd;lfkjsadf');
              successUids.current = [
                ...successUids.current,
                uid,
              ];
              await dispatch<CreateObjectAction>({
                type: 'storageHomePage/createObject',
                payload: {
                  objectName,
                  sha1,
                },
              });

              run();
              run1();
            }}
            onFail={({ objectName, uid }) => {
              failedUids.current = [
                ...failedUids.current,
                uid,
              ];
              run1();
            }}
          />);
        })
      }
    </div>

  </div>);
}

export default connect(({ storageHomePage }: ConnectState) => ({
  storageHomePage: storageHomePage,
}))(FUploadTasksPanel);
