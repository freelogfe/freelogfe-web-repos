import * as React from 'react';
import styles from './index.less';

// first second third
interface FTipTextProps {
  type?: 'first' | 'second' | 'third';
  text: string | number;
}

function FTipText({type = 'first', text}: FTipTextProps) {
  return (<div className={styles[type] + ' ' + styles.text}>{text}</div>);
}

export default FTipText;
