import * as React from 'react';
import styles from './index.less';
import {SwapOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FSwapProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FSwap({...props}: FSwapProps) {
  return (<SwapOutlined {...props}/>);
}

export default FSwap;
