import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FResourceProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FResource({className, ...props}: FResourceProps) {
  // return (<SwapOutlined {...props}/>);
  return (<i className={['freelog', 'fl-icon-ziyuan', className, styles.style].join(' ')} {...props}/>);
}

export default FResource;
