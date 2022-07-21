import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {RedoOutlined} from '@ant-design/icons';
import FComponentsLib from '@freelog/components-lib';

interface UploadCancelProps {
  onClick?(): void;
}

function UploadCancel({onClick}: UploadCancelProps) {
  return (<div className={styles.UploadCancel}>
    <FContentText text={'已取消'}/>
    <FComponentsLib.FTextBtn type="primary" onClick={() => onClick && onClick()}>
      <RedoOutlined/>
    </FComponentsLib.FTextBtn>
  </div>);
}

export default UploadCancel;
