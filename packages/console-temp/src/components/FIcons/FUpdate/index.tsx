import * as React from 'react';
import styles from './index.less';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FUpdateProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FUpdate({className, ...props}: FUpdateProps) {
  return (<i className={['freelog', 'fl-icon-gengxin', className].join(' ')} {...props} />);
}

export default FUpdate;
