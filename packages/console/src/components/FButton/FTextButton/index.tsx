import * as React from 'react';
import styles from './index.less';
import {Button} from 'antd';
import {ButtonProps} from 'antd/lib/button/button';

interface FTextButtonProps extends ButtonProps {
  theme?: 'normal' | 'link' | 'primary';
}

export default function ({className, children, theme = 'normal', ...props}: FTextButtonProps) {
  return (<Button
    {...props}
    className={[styles.button, styles[theme], className].join(' ')}
    type="link">{children}</Button>);
}
