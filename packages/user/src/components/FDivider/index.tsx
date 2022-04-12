import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FDividerProps {
  style?: CSSProperties;
}

function FDivider({style = {}}: FDividerProps) {
  return (<span
    style={{
      ...style,
    }}
    className={styles.styles}>|</span>);
}

export default FDivider;
