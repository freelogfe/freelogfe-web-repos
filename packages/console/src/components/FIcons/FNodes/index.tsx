import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FNodesProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FNodes({className, ...props}: FNodesProps) {
  // return (<SwapOutlined {...props}/>);
  return (<i className={['freelog', 'fl-icon-jiedian', className, styles.style].join(' ')} {...props}/>);
}

export default FNodes;
