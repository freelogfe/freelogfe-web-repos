import * as React from 'react';
import styles from './index.less';
import {ButtonProps} from 'antd/lib/button/button';
import {Button} from 'antd';

interface FNormalButtonProps extends ButtonProps {
  theme?: 'normal' | 'sub' | 'weaken' | 'delete1' | 'delete2';
}

// TODO:
export default function ({theme = 'normal', ...props}: FNormalButtonProps) {
  return (<Button {...props}/>);
}
