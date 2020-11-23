import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FTextButton} from '@/components/FButton';
import {DownOutlined, UpOutlined, CloseOutlined} from '@ant-design/icons';
import {Space} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageHomePageModelState} from '@/models/connect';
import Task from '@/pages/storage/containers/FUploadTasksPanel/Task';
import {ChangeAction, CreateObjectAction} from '@/models/storageHomePage';

export interface FUploadTasksPanelProps {
  dispatch: Dispatch;
  storage: StorageHomePageModelState;
}

function FUploadTasksPanel({dispatch, storage}: FUploadTasksPanelProps) {

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
          info={f}
          allObjectNames={storage.objectList.map<string>((ol) => ol.name)}
          // file={f.file}
          // name={f.name}
          onSuccess={({objectName, sha1}) => {
            dispatch<CreateObjectAction>({
              type: 'storageHomePage/createObject',
              payload: {
                objectName,
                sha1,
              },
            });
            dispatch<ChangeAction>({
              type: 'storageHomePage/change',
              payload: {
                // uploadTaskQueue: storage.uploadTaskQueue.map<StorageHomePageModelState['uploadTaskQueue'][number]>((utq) => {
                // if (f.file.uid)
                // })
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
