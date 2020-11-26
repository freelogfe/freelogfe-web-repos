import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FTextButton} from '@/components/FButton';
import {DownOutlined, UpOutlined, CloseOutlined} from '@ant-design/icons';
import {Space} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageHomePageModelState} from '@/models/connect';
import Task from '@/pages/storage/containers/FUploadTasksPanel/Task';
import {
  ChangeAction,
  CreateObjectAction, FetchBucketsAction,
  FetchObjectsAction,
  FetchSpaceStatisticAction
} from '@/models/storageHomePage';
import * as ahooks from "ahooks";

export interface FUploadTasksPanelProps {
  dispatch: Dispatch;
  storage: StorageHomePageModelState;
}

function FUploadTasksPanel({dispatch, storage}: FUploadTasksPanelProps) {

  const {run} = ahooks.useDebounceFn(
    () => {
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

  if (!storage.uploadPanelVisible) {
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
              uploadPanelOpen: !storage.uploadPanelOpen,
            }
          });
        }}>
          {storage.uploadPanelOpen ? <DownOutlined style={{fontSize: 12}}/> : <UpOutlined style={{fontSize: 12}}/>}
        </FTextButton>
        <FTextButton onClick={() => {
          closeAll();
        }}><CloseOutlined style={{fontSize: 12}}/></FTextButton>
      </Space>
    </div>
    <div className={styles.body} style={{display: storage.uploadPanelOpen ? 'block' : 'none'}}>
      {
        storage.uploadTaskQueue.map((f) => (<Task
          key={f.uid}
          file={f}
          bucketName={storage.activatedBucket}
          onSucceed={async ({objectName, sha1, uid}) => {
            // console.log('!!!!!!######09jop23efwl;k');
            dispatch<ChangeAction>({
              type: 'storageHomePage/change',
              payload: {
                uploadTaskQueue: storage.uploadTaskQueue.map<StorageHomePageModelState['uploadTaskQueue'][number]>((utq) => {
                  if (f.file.uid !== uid) {
                    return utq;
                  }
                  return {
                    ...utq,
                    state: 1,
                  };
                }),
              }
            });
            await dispatch<CreateObjectAction>({
              type: 'storageHomePage/createObject',
              payload: {
                objectName,
                sha1,
              },
            });
            // console.log('######!!!!!!asdfdsafasdf');
            run();
          }}
          onFail={({objectName, uid}) => {
            dispatch<ChangeAction>({
              type: 'storageHomePage/change',
              payload: {
                uploadTaskQueue: storage.uploadTaskQueue.map<StorageHomePageModelState['uploadTaskQueue'][number]>((utq) => {
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
        />))
      }
    </div>
  </div>);
}

export default connect(({storageHomePage}: ConnectState) => ({
  storage: storageHomePage,
}))(FUploadTasksPanel);
