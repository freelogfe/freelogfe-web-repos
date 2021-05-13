import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FRectBtnProps {
  children: React.ReactNode;
  size?: 'large' | 'middle' | 'small';
  type?: 'primary' | 'transparent' | 'default' | 'secondary' | 'danger1' | 'danger2';
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
}

function FRectBtn({children, size = 'middle', className, style = {}, type = 'primary', disabled, onClick}: FRectBtnProps) {
  // if (type === 'primary') {
  //   return (<button
  //     className={[styles.styles, styles.Primary, className].join(' ')}
  //     style={{
  //       height: size === 'middle' ? 38 : size === 'large' ? 50 : 32,
  //       ...style,
  //     }}
  //     disabled={disabled}
  //     onClick={(event: any) => {
  //       onClick && onClick(event);
  //     }}
  //   >{children}</button>);
  // }
  //
  // if (type === 'transparent') {
  //   return (<button
  //     className={[styles.styles, styles.Transparent, className].join(' ')}
  //     style={{
  //       height: size === 'middle' ? 38 : size === 'large' ? 50 : 32,
  //       ...style,
  //     }}
  //     disabled={disabled}
  //     onClick={(event: any) => {
  //       onClick && onClick(event);
  //     }}
  //   >{children}</button>);
  // }
  //
  // if (type === 'default') {
  //   return (<button
  //     className={[styles.styles, styles.Default, className].join(' ')}
  //     style={{
  //       height: size === 'middle' ? 38 : size === 'large' ? 50 : 32,
  //       ...style,
  //     }}
  //     disabled={disabled}
  //     onClick={(event: any) => {
  //       onClick && onClick(event);
  //     }}
  //   >{children}</button>);
  // }
  //
  // if (type === 'secondary') {
  //   return (<button
  //     className={[styles.styles, styles.Secondary, className].join(' ')}
  //     style={{
  //       height: size === 'middle' ? 38 : size === 'large' ? 50 : 32,
  //       ...style,
  //     }}
  //     disabled={disabled}
  //     onClick={(event: any) => {
  //       onClick && onClick(event);
  //     }}
  //   >{children}</button>);
  // }
  //
  // if (type === 'danger1') {
  //   return (<button
  //     className={[styles.styles, styles.Secondary, className].join(' ')}
  //     style={{
  //       height: size === 'middle' ? 38 : size === 'large' ? 50 : 32,
  //       ...style,
  //     }}
  //     disabled={disabled}
  //     onClick={(event: any) => {
  //       onClick && onClick(event);
  //     }}
  //   >{children}</button>);
  // }

  return (<button
    className={[styles.styles, styles[type], className].join(' ')}
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

export default FRectBtn;
