import * as React from 'react';
import styles from './index.less';
import {FTextBtn} from "@/components/FButton";

interface UploadSameNameProps {
  onClick?(): void;
}

function UploadSameName({onClick}: UploadSameNameProps) {
  return (<div className={styles.UploadSameName}>
    <span>存在同名对象</span>
    <FTextBtn
      type="primary"
      onClick={() => onClick && onClick()}
    >更新</FTextBtn>
  </div>);
}

export default UploadSameName;
