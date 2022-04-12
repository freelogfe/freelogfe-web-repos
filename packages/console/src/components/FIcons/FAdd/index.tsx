import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FAddProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FAdd({className, ...props}: FAddProps) {
  return (<i className={['freelog', 'fl-icon-xinzeng', className].join(' ')} {...props} />);
}

export default FAdd;
