import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {RedoOutlined} from '@ant-design/icons';
import {FTextBtn} from "@/components/FButton";

interface UploadCancelProps {
  onClick?(): void;
}

function UploadCancel({onClick}: UploadCancelProps) {
  return (<div className={styles.UploadCancel}>
    <FContentText text={'已取消'}/>
    <FTextBtn type="primary" onClick={() => onClick && onClick()}>
      <RedoOutlined/>
    </FTextBtn>
  </div>);
}

export default UploadCancel;
