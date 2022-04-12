import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FCollectProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FCollect({className, ...props}: FCollectProps) {
  return (<i className={['freelog', 'fl-icon-shoucang', className].join(' ')} {...props} />);
}

export default FCollect;
