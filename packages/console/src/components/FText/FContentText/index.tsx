import * as React from 'react';
import styles from './index.less';
import shared from '../shared.less';

interface FContentProps {
  text: string;
  type?: 'normal' | 'highlight' | 'negative' | 'additional1' | 'additional2';
  singleRow?: boolean;
  children?: React.ReactNode | React.ReactNodeArray;
  className?: string;
}

export default function ({className, children, text, type = 'normal', singleRow = false}: FContentProps) {
  return (
    <div className={[(singleRow && shared.singleRow), styles[type], className].join(' ')}>{children || text}</div>
  );
}
