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

  return (<div
    className={styles.UploadingTasks}
    style={{display: !storage.uploadPanelVisible ? 'none' : 'block'}}
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
        <FTextButton><CloseOutlined style={{fontSize: 12}}/></FTextButton>
      </Space>
    </div>
    <div className={styles.body} style={{display: open ? 'block' : 'none'}}>
      {
        storage.uploadTaskQueue.map((f) => (<Task
          key={f.file.uid}
          file={f.file}
          name={f.name}
          onSuccess={({objectName, sha1}) => {
            dispatch<CreateObjectAction>({
              type: 'storageHomePage/createObject',
              payload: {
                objectName,
                sha1,
              },
            })
          }}
        />))
      }
    </div>
  </div>);
}

export default connect(({storageHomePage}: ConnectState) => ({
  storage: storageHomePage,
}))(FUploadTasksPanel);
