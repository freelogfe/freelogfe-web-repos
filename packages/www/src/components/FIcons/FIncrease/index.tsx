import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FIncreaseProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FIncrease({className, ...props}: FIncreaseProps) {
  return (<i className={['freelog', 'fl-icon-zhankai1', className].join(' ')} {...props} />);
}

export default FIncrease;
