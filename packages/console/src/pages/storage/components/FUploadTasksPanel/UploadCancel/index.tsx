import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {RedoOutlined} from '@ant-design/icons';
import {FTextButton} from "@/components/FButton";

interface UploadCancelProps {

}

function UploadCancel({}: UploadCancelProps) {
  return (<div className={styles.UploadCancel}>
    <FContentText text={'已取消'}/>
    <FTextButton>
      <RedoOutlined/>
    </FTextButton>
  </div>);
}

export default UploadCancel;
