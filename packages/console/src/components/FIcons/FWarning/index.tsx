import * as React from 'react';
import styles from './index.less';
import {SwapOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FSwapProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FSwap({className, ...props}: FSwapProps) {
  // return (<SwapOutlined {...props}/>);
  return (<i className={['freelog', 'fl-icon-warning1', className].join(' ')} {...props}/>);
}

export default FSwap;
