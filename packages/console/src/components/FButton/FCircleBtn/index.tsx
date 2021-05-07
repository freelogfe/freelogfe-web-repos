import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";
import {FAdd, FDelete, FEdit, FLine, FPlus} from "@/components/FIcons";

interface FCircleBtnProps {
  children?: React.ReactNode;
  size?: 'middle' | 'small';
  type?: 'primary' | 'transparent' | 'danger' | 'minor';
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
    >{children || <FPlus
      style={{
        fontSize: size === 'middle' ? 16 : 12,
      }}
    />}</button>);
  }

  if (type === 'transparent') {
    return (<button
      className={[styles.Transparent, className].join(' ')}
      style={{
        ...style,
      }}
      disabled={disabled}
      onClick={(event: any) => {
        onClick && onClick(event);
      }}
    >{children || <FPlus style={{
      fontSize: 14,
    }}/>}</button>);
  }

  if (type === 'minor') {
    return (<button
      className={[styles.Minor, className].join(' ')}
      style={{
        ...style,
      }}
      disabled={disabled}
      onClick={(event: any) => {
        onClick && onClick(event);
      }}
    >{children || <FEdit style={{
      fontSize: 14,
    }}/>}</button>);
  }
  // <FEdit/>

  return (<button
    className={[styles.Danger, className].join(' ')}
    disabled={disabled}
    onClick={(event: any) => {
      onClick && onClick(event);
    }}
  >{children || <FLine style={{fontSize: 12}}/>}</button>);

}

export default FCircleBtn;
