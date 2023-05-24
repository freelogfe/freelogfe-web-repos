import * as React from 'react';
import styles from './index.less';
import { Progress, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import FComponentsLib from '@freelog/components-lib';

interface UploadingProps {
  progress: number;

  cancel?(): void;
}

function Uploading({ progress, cancel }: UploadingProps) {
  // console.log(progress, 'progress*(&(*&(*&*(&*(');
  return (<div className={styles.Uploading}>
    <Space
      className={styles.status}
      size={10}
    >
      <FComponentsLib.FContentText text={progress + '%'} />
      <div style={{ width: 100 }}>
        <Progress type={'line'} percent={progress} showInfo={false} />
      </div>
    </Space>
    <div className={styles.action}>
      <FComponentsLib.FTextBtn
        type='default'
        onClick={() => {
          cancel && cancel();
        }}
        disabled={progress === 100}
      >
        <CloseOutlined />
      </FComponentsLib.FTextBtn>
    </div>
  </div>);
}

export default Uploading;
