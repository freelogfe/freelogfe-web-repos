import * as React from 'react';
import styles from './index.less';

interface FNavProps {
  text: string;
  // type?: 'normal' | 'active';
  className?: string;
}

// TODO:
export default function ({text, className}: FNavProps) {
  return (<a className={styles.text + ' ' + className}>{text}</a>);
}
