import * as React from 'react';
import styles from './index.less';

interface FNavProps {
  text: string;
  type?: 'normal' | 'active';
}

// TODO:
export default function ({text, type = 'normal'}: FNavProps) {
  return (<div className={styles.text + ' ' + styles[type]}>{text}</div>);
}
