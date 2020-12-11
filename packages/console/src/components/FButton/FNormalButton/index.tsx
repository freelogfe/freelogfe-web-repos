import * as React from 'react';
import styles from './index.less';
import {ButtonProps} from 'antd/lib/button/button';
import {Button} from 'antd';

interface FNormalButtonProps extends ButtonProps {
  theme?: 'normal' | 'sub' | 'weaken' | 'delete1' | 'delete2' | 'big' | 'small';
}

function FNormalButton({theme = 'normal', className, ...props}: FNormalButtonProps) {
  return (<Button
    {...props}
    className={[styles.Button, styles[theme], className].join(' ')}
    type="primary"
  />);
}

export default FNormalButton;
