import * as React from 'react';
import styles from './index.less';
import {FWarning} from '@/components/FIcons';
import FUtil1 from "@/utils";
// import {FUtil} from '@freelog/tools-lib';

export default function ({className, normal}: any) {
  return (
    <div className={[styles.div, className].join(' ')}>
      <label
        className={normal ? styles.normal : styles.warning}>{normal ? FUtil1.I18n.message('online') : FUtil1.I18n.message('offline')}</label>
      {normal || <FWarning/>}
    </div>
  );
}
