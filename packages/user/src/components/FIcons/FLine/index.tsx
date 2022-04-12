import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FLineProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FLine({className, ...props}: FLineProps) {
  return (<i className={['freelog', 'fl-icon-zhanweifu', className].join(' ')} {...props} />);
}

export default FLine;
