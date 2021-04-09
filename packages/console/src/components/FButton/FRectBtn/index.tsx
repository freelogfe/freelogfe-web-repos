import * as React from 'react';
import styles from './index.less';

interface FRectBtnProps {
  children: React.ReactNode;
  size?: 'large' | 'middle' | 'small';
  disabled?: boolean;
  className?: string;
}

function FRectBtn({children, disabled, size = 'middle', className}: FRectBtnProps) {
  return (<button
    className={[styles.Primary, className].join(' ')}
    style={{
      height: size === 'middle' ? 38 : size === 'large' ? 50 : 32,
    }}
    disabled={disabled}
  >{children}</button>);
}

export default FRectBtn;
