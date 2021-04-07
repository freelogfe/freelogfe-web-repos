import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FTextButton} from '@/components/FButton';
import {DownOutlined, UpOutlined, CloseOutlined} from '@ant-design/icons';
import {Modal, Space} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageHomePageModelState} from '@/models/connect';
import Task from '@/pages/storage/containers/FUploadTasksPanel/Task';
import {
  ChangeAction,
  CreateObjectAction, FetchBucketsAction,
  FetchObjectsAction,
  FetchSpaceStatisticAction
} from '@/models/storageHomePage';
import * as ahooks from 'ahooks';
import {i18nMessage} from "@/utils/i18n";
import fConfirmModal from "@/components/fConfirmModal";

export interface FUploadTasksPanelProps {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
}

let successUids: string[] = [];

function FUploadTasksPanel({dispatch, storageHomePage}: FUploadTasksPanelProps) {

  const {run} = ahooks.useDebounceFn(
    () => {
      // console.log(successUids, 'successUids!Q@#$@#$@!#$@#$#$');
      dispatch<ChangeAction>({
        type: 'storageHomePage/change',
        payload: {
          uploadTaskQueue: storageHomePage.uploadTaskQueue.map<StorageHomePageModelState['uploadTaskQueue'][number]>((utq) => {
            // console.log(utq.uid, uid, 'f.file.uid !== uid');
            if (!successUids.includes(utq.uid)) {
              return utq;
            }
            return {
              ...utq,
              state: 1,
            };
          }),
        }
      });
      successUids = [];
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
    },
    {
      wait: 300,
    },
  );

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

  if (!storageHomePage.uploadPanelVisible) {
    return null;
  }

  return (<div
    className={styles.UploadingTasks}
    // style={{display: !storage.uploadPanelVisible ? 'none' : 'block'}}
  >
    <div className={styles.title}>
      <FContentText text={'任务列表'}/>
      <Space size={20}>
        <FTextButton onClick={() => {
          dispatch<ChangeAction>({
            type: 'storageHomePage/change',
            payload: {
              uploadPanelOpen: !storageHomePage.uploadPanelOpen,
            }
          });
        }}>
          {storageHomePage.uploadPanelOpen ? <DownOutlined style={{fontSize: 12}}/> : <UpOutlined style={{fontSize: 12}}/>}
        </FTextButton>
        <FTextButton onClick={() => {
          const exits: undefined | StorageHomePageModelState['uploadTaskQueue'][number] = storageHomePage.uploadTaskQueue.find((i) => i.state !== 1);
          if (exits) {
            fConfirmModal({
              message: i18nMessage('cancel_all_uploading_task'),
              onOk() {
                closeAll();
              },
            });
            return;
          }
          closeAll();
        }}><CloseOutlined style={{fontSize: 12}}/></FTextButton>
      </Space>
    </div>
    <div className={styles.successCount}>有{storageHomePage.uploadTaskQueue.filter((utq) => utq.state === 1).length}个文件上传成功</div>
    <div className={styles.body} style={{display: storageHomePage.uploadPanelOpen ? 'block' : 'none'}}>
      {
        storageHomePage.uploadTaskQueue.map((f, index, uploadTaskQueue) => {
          // console.log(f, 'fffffFFFFFFF2390ueoifjasdf');
          return (<Task
            key={f.uid}
            file={f}
            bucketName={storageHomePage.activatedBucket}
            onSucceed={async ({objectName, sha1, uid}) => {
              // console.log(objectName, '2309jasdf;lkfjasd;lfkjsadf');
              successUids = [
                ...successUids,
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
            }}
            onFail={({objectName, uid}) => {
              dispatch<ChangeAction>({
                type: 'storageHomePage/change',
                payload: {
                  uploadTaskQueue: storageHomePage.uploadTaskQueue.map<StorageHomePageModelState['uploadTaskQueue'][number]>((utq) => {
                    if (f.file.uid !== uid) {
                      return utq;
                    }
                    return {
                      ...utq,
                      state: -1,
                    };
                  }),
                }
              });
            }}
          />);
        })
      }
    </div>
  </div>);
}

export default connect(({storageHomePage}: ConnectState) => ({
  storageHomePage: storageHomePage,
}))(FUploadTasksPanel);
