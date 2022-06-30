import * as React from 'react';
import styles from './index.less';
import {FWarning} from '../../FIcons';
// import FUtil1 from "@/utils";
// import {FUtil} from '@freelog/tools-lib';
import { fI18nNext } from '@freelog/tools-lib';

export default function ({className, normal}: any) {
  return (
    <div className={[styles.div, className].join(' ')}>
      <label
        className={normal ? styles.normal : styles.warning}>{normal ? fI18nNext.t('online') : fI18nNext.t('offline')}</label>
      {normal || <FWarning/>}
    </div>
  );
}
