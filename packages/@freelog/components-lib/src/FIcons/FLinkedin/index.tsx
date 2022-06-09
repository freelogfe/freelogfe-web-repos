import * as React from 'react';
// import styles from './index.less';
import {CSSProperties} from "react";

interface FLinkedinProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FLinkedin({className, ...props}: FLinkedinProps) {
  return (<i className={['freelog', 'fl-icon-linkedin', className].join(' ')} {...props} />);
}

export default FLinkedin;
