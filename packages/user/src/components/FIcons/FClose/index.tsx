import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FCloseProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FClose({className, ...props}: FCloseProps) {
  return (<i className={['freelog', 'fl-icon-guanbi', className].join(' ')} {...props} />);
}

export default FClose;
