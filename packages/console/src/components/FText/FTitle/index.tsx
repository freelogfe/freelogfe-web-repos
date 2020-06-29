import * as React from 'react';
import styles from './index.less';


interface FTitleProps {
  text: string;
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'form';
}

// TODO:
export default function ({text, type = 'h1'}: FTitleProps) {
  return (<div className={styles.text + ' ' + styles[type]}>{text}</div>);
}
