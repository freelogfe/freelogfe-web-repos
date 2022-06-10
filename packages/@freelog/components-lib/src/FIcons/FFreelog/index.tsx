import * as React from 'react';
// import styles from './index.less';
import {CSSProperties} from "react";

interface FFreelogProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FFreelog({className, ...props}: FFreelogProps) {
  return (<i className={['freelog', 'fl-icon-a-featherlogo5', className].join(' ')} {...props} />);
}

export default FFreelog;
