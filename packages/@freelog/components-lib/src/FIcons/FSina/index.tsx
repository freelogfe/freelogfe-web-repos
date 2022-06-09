import * as React from 'react';
// import styles from './index.less';
import {CSSProperties} from "react";

interface FSinaProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FSina({className, ...props}: FSinaProps) {
  return (<i className={['freelog', 'fl-icon-weibo', className].join(' ')} {...props} />);
}

export default FSina;
