import * as React from 'react';
import styles from './index.less';
import {CheckCircleFilled} from '@ant-design/icons';

interface UploadSuccessProps {

}

function UploadSuccess({}: UploadSuccessProps) {
  return (<div className={styles.UploadSuccess}>
    <div>上传成功</div>
    <CheckCircleFilled/>
  </div>);
}

export default UploadSuccess;
