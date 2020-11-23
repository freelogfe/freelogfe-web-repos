import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {RedoOutlined} from '@ant-design/icons';
import {FTextButton} from "@/components/FButton";

interface UploadSameNameProps {
  onClick?(): void;
}

function UploadSameName({onClick}: UploadSameNameProps) {
  return (<div className={styles.UploadSameName}>
    <span>存在同名对象</span>
    <FTextButton
      theme="primary"
      onClick={() => onClick && onClick()}
    >更新</FTextButton>
  </div>);
}

export default UploadSameName;
