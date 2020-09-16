import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FTextButton} from '@/components/FButton';
import {DownOutlined, UpOutlined, CloseOutlined} from '@ant-design/icons';
import {Space} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageHomePageModelState} from '@/models/connect';
import {RcFile} from "antd/lib/upload/interface";
import Task from "@/pages/storage/containers/FUploadTasksPanel/Task";

interface FUploadTasksPanelProps {
  dispatch: Dispatch;
  storage: StorageHomePageModelState;
  files: RcFile[];
  hidden?: boolean;
}

function FUploadTasksPanel({dispatch, storage, files, hidden = false}: FUploadTasksPanelProps) {

  const [open, setOpen] = React.useState<boolean>(true);

  return (<div className={styles.UploadingTasks} style={{display: hidden ? 'none' : 'block'}}>
    <div className={styles.title}>
      <FContentText text={'任务列表'}/>
      <Space size={20}>
        <FTextButton onClick={() => setOpen(!open)}>
          {open ? <DownOutlined style={{fontSize: 12}}/> : <UpOutlined style={{fontSize: 12}}/>}
        </FTextButton>
        <FTextButton><CloseOutlined style={{fontSize: 12}}/></FTextButton>
      </Space>
    </div>
    <div className={styles.body} style={{display: open ? 'block' : 'none'}}>
      {
        files.map((f) => (<Task
          key={f.uid}
          file={f}
          onSuccess={({fileName, sha1}) => {

          }}
        />))
      }
    </div>

  </div>);
}


export default connect(({storageHomePage}: ConnectState) => ({
  storage: storageHomePage,
}))(FUploadTasksPanel);
