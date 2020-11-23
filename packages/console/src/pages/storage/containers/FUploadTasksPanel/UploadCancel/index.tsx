import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {RedoOutlined} from '@ant-design/icons';
import {FTextButton} from "@/components/FButton";

interface UploadCancelProps {
  onClick?(): void;
}

function UploadCancel({onClick}: UploadCancelProps) {
  return (<div className={styles.UploadCancel}>
    <FContentText text={'已取消'}/>
    <FTextButton onClick={() => onClick && onClick()}>
      <RedoOutlined/>
    </FTextButton>
  </div>);
}

export default UploadCancel;
