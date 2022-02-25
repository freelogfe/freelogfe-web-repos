import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FCancelCollectProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FCancelCollect({className, ...props}: FCancelCollectProps) {
  return (<i className={['freelog', 'fl-icon-yishoucang', className].join(' ')} {...props} />);
}

export default FCancelCollect;
