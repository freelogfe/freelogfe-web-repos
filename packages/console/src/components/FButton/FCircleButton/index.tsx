import * as React from 'react';
import styles from './index.less';
import {ButtonProps} from 'antd/lib/button/button';
import {Button} from 'antd';
import {PlusOutlined, MinusOutlined} from '@ant-design/icons';

interface FCircleButtonProps extends ButtonProps {
  theme?: 'normal' | 'weaken' | 'text' | 'delete';
  icon?: React.ReactNode;
}

export default function ({theme = 'normal', icon = (<PlusOutlined/>), ...props}: FCircleButtonProps) {
  return (<Button
    className={styles.Button + ' ' + styles[theme]}
    {...props}
    type="primary"
    shape="circle"
    icon={theme !== 'delete' ? icon : <MinusOutlined/>}
  />);
}
