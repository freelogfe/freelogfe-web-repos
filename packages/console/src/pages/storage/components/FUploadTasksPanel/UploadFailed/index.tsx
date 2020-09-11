import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {RedoOutlined} from '@ant-design/icons';
import {FTextButton} from "@/components/FButton";

interface UploadFailedProps {

}

function UploadFailed({}: UploadFailedProps) {
  return (<div className={styles.UploadFailed}>
    <span>上传失败</span>
    <FTextButton>
      <RedoOutlined/>
    </FTextButton>
  </div>);
}

export default UploadFailed;
