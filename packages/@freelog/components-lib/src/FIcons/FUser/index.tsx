import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FUserProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FUser({className, ...props}: FUserProps) {
  return (<i className={['freelog', 'fl-icon-yonghu', className, styles.style].join(' ')} {...props}/>);
}

export default FUser;
