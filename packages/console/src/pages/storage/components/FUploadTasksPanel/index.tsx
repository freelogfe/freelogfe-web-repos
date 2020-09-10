import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FTextButton} from '@/components/FButton';
import {DownOutlined, CloseOutlined} from '@ant-design/icons';
import {Space} from "antd";

interface FUploadTasksPanelProps {

}

function FUploadTasksPanel({}: FUploadTasksPanelProps) {
  return (<div className={styles.UploadingTasks}>
    <div className={styles.title}>
      <FContentText text={'任务列表'}/>
      <Space size={20}>
        <FTextButton><DownOutlined style={{fontSize: 12}}/></FTextButton>
        <FTextButton><CloseOutlined style={{fontSize: 12}}/></FTextButton>
      </Space>
    </div>
  </div>);
}

export default FUploadTasksPanel;
