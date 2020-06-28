import * as React from 'react';
import styles from './index.less';

interface FContentProps {
  text: string;
  type?: 'normal' | 'highlight' | 'negative' | 'additional1' | 'additional2';
}

export default function ({text, type = 'normal'}: FContentProps) {
  return (
    <div className={styles.text + ' ' + styles[type]}>{text}</div>
  );
}
