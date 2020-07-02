import * as React from 'react';
import styles from './index.less';
import shared from '../shared.less';

interface FContentProps {
  text: string;
  type?: 'normal' | 'highlight' | 'negative' | 'additional1' | 'additional2';
  singleRow?: boolean;
}

export default function ({text, type = 'normal', singleRow = false}: FContentProps) {
  return (
    <div className={(singleRow && shared.singleRow) + ' ' + styles[type]}>{text}</div>
  );
}
