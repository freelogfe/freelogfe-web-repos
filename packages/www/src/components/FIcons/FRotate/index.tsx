import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FRotateProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FRotate({className, ...props}: FRotateProps) {
  return (<i className={['freelog', 'fl-icon-zhongzhi', className].join(' ')} {...props} />);
}

export default FRotate;
