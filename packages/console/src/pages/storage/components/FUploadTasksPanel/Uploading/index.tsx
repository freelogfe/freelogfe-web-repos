import * as React from 'react';
import styles from './index.less';
import {Progress, Space} from "antd";
import {FContentText} from '@/components/FText';
import {FTextButton} from '@/components/FButton';
import {CloseOutlined} from '@ant-design/icons';

interface UploadingProps {

}

function Uploading({}: UploadingProps) {
  return (<div className={styles.Uploading}>
    <Space
      className={styles.status}
      size={10}
    >
      <FContentText text={'45%'}/>
      <div style={{width: 100}}>
        <Progress type={'line'} percent={30} showInfo={false}/>
      </div>
    </Space>
    <div className={styles.action}>
      <FTextButton>
        <CloseOutlined/>
      </FTextButton>
    </div>
  </div>);
}

export default Uploading;
