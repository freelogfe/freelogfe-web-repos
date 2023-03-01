import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

interface UploadSameNameProps {
  onClick?(): void;
}

function UploadSameName({onClick}: UploadSameNameProps) {
  return (<div className={styles.UploadSameName}>
    <span>存在同名对象</span>
    <FComponentsLib.FTextBtn
      type="primary"
      onClick={() => onClick && onClick()}
    >更新</FComponentsLib.FTextBtn>
  </div>);
}

export default UploadSameName;
