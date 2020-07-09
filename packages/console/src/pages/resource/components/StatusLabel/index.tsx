import * as React from 'react';
import styles from './index.less';


interface StatusLabelProps {
  status?: 'executing' | 'pending' | 'stopped';
}

export default function ({status = 'executing'}: StatusLabelProps) {
  let text = '';
  switch (status) {
    case "executing":
      text = '执行中';
      break;
    case "pending":
      text = '待执行';
      break;
    case "stopped":
      text = '已终止';
      break;
    default:
      text = '执行中';
  }
  return (<label className={styles[status]}>{text}</label>);
}
