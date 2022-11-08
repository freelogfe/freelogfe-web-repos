import * as React from 'react';
import styles from './index.less';
// import {FWarning} from '../../FIcons';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

export default function ({className, normal}: any) {
  return (
    <div className={[styles.div, className].join(' ')}>
      <label
        className={normal ? styles.normal : styles.warning}>{normal ? FI18n.i18nNext.t('online') : FI18n.i18nNext.t('offline')}</label>
      {normal || <FComponentsLib.FIcons.FWarning/>}
    </div>
  );
}
