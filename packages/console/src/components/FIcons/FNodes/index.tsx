import * as React from 'react';
import styles from './index.less';
import {SwapOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FNodesProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FNodes({className, ...props}: FNodesProps) {
  // return (<SwapOutlined {...props}/>);
  return (<i className={['freelog', 'fl-icon-jiedian', className].join(' ')} {...props}/>);
}

export default FNodes;
