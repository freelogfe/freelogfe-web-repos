import * as React from 'react';
import styles from './index.less';
import {Progress, Space} from "antd";
import {FContentText} from '@/components/FText';
import {FTextButton} from '@/components/FButton';
import {CloseOutlined} from '@ant-design/icons';
import {Canceler} from "axios";

interface UploadingProps {
  progress: number;

  cancel?(): void
}

function Uploading({progress, cancel}: UploadingProps) {
  return (<div className={styles.Uploading}>
    <Space
      className={styles.status}
      size={10}
    >
      <FContentText text={progress + '%'}/>
      <div style={{width: 100}}>
        <Progress type={'line'} percent={progress} showInfo={false}/>
      </div>
    </Space>
    <div className={styles.action}>
      <FTextButton onClick={() => cancel && cancel()}>
        <CloseOutlined/>
      </FTextButton>
    </div>
  </div>);
}

export default Uploading;
