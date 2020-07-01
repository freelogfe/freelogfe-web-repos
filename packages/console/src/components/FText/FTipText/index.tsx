import * as React from 'react';
import styles from './index.less';

interface FTipTextProps {
  type?: 'primary' | 'secondary' | 'modal';
  text: string | number;
}

export default function ({type = 'modal', text}: FTipTextProps) {
  return (<div className={styles[type] + ' ' + styles.text}>{text}</div>);
}
