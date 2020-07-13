import * as React from 'react';
import styles from './index.less';
import shared from '../shared.less';

interface FNavProps {
  text: string;
  // type?: 'normal' | 'active';
  className?: string;
  singleRow?: boolean;
}

// TODO:
export default function ({text, className, singleRow = false}: FNavProps) {
  return (<a className={[styles.text, className, singleRow ? shared.singleRow : ''].join(' ')}>{text}</a>);
}
