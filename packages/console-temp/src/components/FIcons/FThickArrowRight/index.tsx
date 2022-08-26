import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FThickArrowRightProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FThickArrowRight({className, ...props}: FThickArrowRightProps) {
  return (<i className={['freelog', 'fl-icon-jiantou', className].join(' ')} {...props} />);
}

export default FThickArrowRight;
