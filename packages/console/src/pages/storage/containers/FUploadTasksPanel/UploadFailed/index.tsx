import * as React from 'react';
import styles from './index.less';
import {RedoOutlined} from '@ant-design/icons';
import FComponentsLib from '@freelog/components-lib';

interface UploadFailedProps {
  onClick?(): void;
}

function UploadFailed({onClick}: UploadFailedProps) {
  return (<div className={styles.UploadFailed}>
    <span>上传失败</span>
    <FComponentsLib.FTextBtn type="primary" onClick={() => onClick && onClick()}>
      <RedoOutlined/>
    </FComponentsLib.FTextBtn>
  </div>);
}

export default UploadFailed;
