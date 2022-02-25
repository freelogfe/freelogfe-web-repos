import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FForbidProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FForbid({className, ...props}: FForbidProps) {
  return (<i className={['freelog', 'fl-icon-jinzhi', className].join(' ')} {...props}/>);
}

export default FForbid;
