import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FTextButton} from '@/components/FButton';
import {DownOutlined, CloseOutlined} from '@ant-design/icons';
import {Row, Space} from "antd";
import Uploading from "./Uploading";
import UploadSuccess from "./UploadSuccess";
import UploadCancel from "./UploadCancel";
import UploadSameName from "./UploadSameName";
import UploadFailed from "./UploadFailed";

interface FUploadTasksPanelProps {

}

function FUploadTasksPanel({}: FUploadTasksPanelProps) {

  const [open, setOpen] = React.useState<boolean>(false);

  return (<div className={styles.UploadingTasks}>
    <div className={styles.title}>
      <FContentText text={'任务列表'}/>
      <Space size={20}>
        <FTextButton onClick={() => setOpen(!open)}><DownOutlined style={{fontSize: 12}}/></FTextButton>
        <FTextButton><CloseOutlined style={{fontSize: 12}}/></FTextButton>
      </Space>
    </div>
    {
      open && (<>
        <div className={styles.body}>
          <div className={styles.taskItem}>
            <div className={styles.taskInfo}>
              <FContentText text={'这里是文件名称'} singleRow={true}/>
              <div style={{height: 2}}/>
              <FContentText text={'5 M'}/>
            </div>
            <Uploading/>
          </div>
          <div className={styles.taskItem}>
            <div className={styles.taskInfo}>
              <FContentText text={'这里是文件名称'} singleRow={true}/>
              <div style={{height: 2}}/>
              <FContentText text={'5 M'}/>
            </div>
            <UploadSuccess/>
          </div>
          <div className={styles.taskItem}>
            <div className={styles.taskInfo}>
              <FContentText text={'这里是文件名称'} singleRow={true}/>
              <div style={{height: 2}}/>
              <FContentText text={'5 M'}/>
            </div>
            <UploadCancel/>
          </div>
          <div className={styles.taskItem}>
            <div className={styles.taskInfo}>
              <FContentText text={'这里是文件名称'} singleRow={true}/>
              <div style={{height: 2}}/>
              <FContentText text={'5 M'}/>
            </div>
            <UploadSameName/>
          </div>
          <div className={styles.taskItem}>
            <div className={styles.taskInfo}>
              <FContentText text={'这里是文件名称'} singleRow={true}/>
              <div style={{height: 2}}/>
              <FContentText text={'5 M'}/>
            </div>
            <UploadFailed/>
          </div>
        </div>
        <div className={styles.footer}>
          <Space size={15}>
            <span>共7条</span>
            <FTextButton>1</FTextButton>
            <a>2</a>
          </Space>
        </div>
      </>)
    }

  </div>);
}

export default FUploadTasksPanel;
