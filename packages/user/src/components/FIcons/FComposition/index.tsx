import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FCompositionProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FComposition({className, ...props}: FCompositionProps) {
  return (<i className={['freelog', 'fl-icon-zuhemoshi', className].join(' ')} {...props} />);
}

export default FComposition;
