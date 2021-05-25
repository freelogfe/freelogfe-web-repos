import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FTextBtnProps {
  children: React.ReactNode;
  type?: 'primary' | 'default' | 'danger';
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
}

function FTextBtn({children, type = 'primary', className, style, disabled, onClick}: FTextBtnProps) {
  return (<button
    className={[styles.textBtn, styles[type], className].join(' ')}
    style={{
      ...style,
    }}
    disabled={disabled}
    onClick={(event: any) => {
      onClick && onClick(event);
    }}
  >{children}</button>);
}

export default FTextBtn;
