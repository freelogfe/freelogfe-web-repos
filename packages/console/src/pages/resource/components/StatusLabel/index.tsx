import * as React from 'react';
import styles from './index.less';
// import FUtil1 from "@/utils";
import { FI18n } from '@freelog/tools-lib';

interface StatusLabelProps {
  status?: 'executing' | 'pending' | 'stopped';
}

export default function ({status = 'executing'}: StatusLabelProps) {
  let text = '';
  switch (status) {
    // case "executing":
    //   text = FUtil.I18n.message('contract_state_authorzed');
    //   break;
    case "pending":
      text = FI18n.i18nNext.t('contract_state_pending');
      break;
    case "stopped":
      text = FI18n.i18nNext.t('contract_state_end');
      break;
    default:
      text = FI18n.i18nNext.t('contract_state_authorzed');
  }
  return (<label className={styles[status]}>{text}</label>);
}
