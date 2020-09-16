import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {RedoOutlined} from '@ant-design/icons';
import {FTextButton} from "@/components/FButton";

interface UploadSameNameProps {

}

function UploadSameName({}: UploadSameNameProps) {
  return (<div className={styles.UploadSameName}>
    <span>存在同名对象</span>
    <FTextButton theme="primary">更新</FTextButton>
  </div>);
}

export default UploadSameName;
