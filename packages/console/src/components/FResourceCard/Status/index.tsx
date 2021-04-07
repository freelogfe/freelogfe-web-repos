import * as React from 'react';
import styles from './index.less';
// import {i18nMessage} from "@/utils/i18n";
import {FWarning} from '@/components/FIcons';
import FUtil from "@/utils";

export default function ({className, normal}: any) {
  return (
    <div className={[styles.div, className].join(' ')}>
      <label
        className={normal ? styles.normal : styles.warning}>{normal ? FUtil.I18n.message('online') : FUtil.I18n.message('offline')}</label>
      {normal || <FWarning/>}
    </div>
  );
}
