import * as React from 'react';
import styles from './index.less';
import shared from '../shared.less';
import {CSSProperties} from "react";

interface FContentProps {
  text?: string;
  type?: 'normal' | 'highlight' | 'negative' | 'additional1' | 'additional2';
  singleRow?: boolean;
  children?: React.ReactNode | React.ReactNodeArray;
  className?: string;
  style?: CSSProperties;
}

function FContentText({className, style, children, text, type = 'normal', singleRow = false}: FContentProps) {
  return (
    <div
      style={{
        ...style,
      }}
      className={[(singleRow && shared.singleRow), styles[type], className].join(' ')}>{children || text}</div>
  );
}

export default FContentText;
