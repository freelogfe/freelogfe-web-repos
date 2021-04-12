import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FRectBtnProps {
  children: React.ReactNode;
  size?: 'large' | 'middle' | 'small';
  theme?: 'primary' | 'transparent';
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
}

function FRectBtn({children, size = 'middle', className, style = {}, theme = 'primary', disabled, onClick}: FRectBtnProps) {
  if (theme === 'primary') {
    return (<button
      className={[styles.Primary, className].join(' ')}
      style={{
        height: size === 'middle' ? 38 : size === 'large' ? 50 : 32,
        ...style,
      }}
      disabled={disabled}
      onClick={(event: any) => {
        onClick && onClick(event);
      }}
    >{children}</button>);
  }

  if (theme === 'transparent') {
    return (<button
      className={[styles.Transparent, className].join(' ')}
      style={{
        height: size === 'middle' ? 38 : size === 'large' ? 50 : 32,
        ...style,
      }}
      disabled={disabled}
      onClick={(event: any) => {
        onClick && onClick(event);
      }}
    >{children}</button>);
  }

  return (<button
    className={[styles.Primary, className].join(' ')}
    style={{
      height: size === 'middle' ? 38 : size === 'large' ? 50 : 32,
      ...style,
    }}
    disabled={disabled}
  >{children}</button>);

}

export default FRectBtn;
