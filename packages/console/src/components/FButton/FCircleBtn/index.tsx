import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";
import {FAdd, FPlus} from "@/components/FIcons";

interface FCircleBtnProps {
  children?: React.ReactNode;
  size?: 'middle' | 'small';
  type?: 'primary' | 'transparent' | 'danger';
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
}

function FCircleBtn({children, size = 'middle', className, style, disabled, onClick, type = 'primary'}: FCircleBtnProps) {
  if (type === 'primary') {
    return (<button
      className={[styles.Primary, className].join(' ')}
      style={{
        height: size === 'middle' ? 32 : 22,
        width: size === 'middle' ? 32 : 22,
        ...style,
      }}
      disabled={disabled}
      onClick={(event: any) => {
        onClick && onClick(event);
      }}
    >{children || <FPlus style={{fontSize: 16}}/>}</button>);
  }

  if (type === 'transparent') {
    return (<button
      className={[styles.Transparent, className].join(' ')}
      style={{
        // height: size === 'middle' ? 32 : 22,
        // width: size === 'middle' ? 32 : 22,
        ...style,
      }}
      disabled={disabled}
      onClick={(event: any) => {
        onClick && onClick(event);
      }}
    >{children || <FPlus style={{fontSize: 16}}/>}</button>);
  }

  return (<button
    className={[styles.add1, className].join(' ')}
    style={{
      height: size === 'middle' ? 32 : 22,
      width: size === 'middle' ? 32 : 22,
      ...style,
    }}
    disabled={disabled}
    onClick={(event: any) => {
      onClick && onClick(event);
    }}
  >{children || <FPlus style={{fontSize: 16}}/>}</button>);

}

export default FCircleBtn;
