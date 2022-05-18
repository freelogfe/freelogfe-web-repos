import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FDecreaseProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FDecrease({className, ...props}: FDecreaseProps) {
  return (<i className={['freelog', 'fl-icon-shouqi2', className].join(' ')} {...props} />);
}

export default FDecrease;
