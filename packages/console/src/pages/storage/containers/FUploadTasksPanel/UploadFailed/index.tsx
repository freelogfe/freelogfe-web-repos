import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {RedoOutlined} from '@ant-design/icons';
import {FTextBtn} from "@/components/FButton";

interface UploadFailedProps {
  onClick?(): void;
}

function UploadFailed({onClick}: UploadFailedProps) {
  return (<div className={styles.UploadFailed}>
    <span>上传失败</span>
    <FTextBtn type="primary" onClick={() => onClick && onClick()}>
      <RedoOutlined/>
    </FTextBtn>
  </div>);
}

export default UploadFailed;
