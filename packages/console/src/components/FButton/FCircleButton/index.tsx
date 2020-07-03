import * as React from 'react';
import styles from './index.less';
import sharedStyles from '../shared.less';
import {ButtonProps} from 'antd/lib/button/button';
import {Button} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

interface FCircleButtonProps extends ButtonProps {
  theme?: 'normal' | 'weaken' | 'text' | 'delete';
  icon?: React.ReactNode;
}

export default function ({theme = 'normal', icon = (<PlusOutlined/>), ...props}: FCircleButtonProps) {
  return (<Button
    className={styles.Button + ' ' + sharedStyles[theme]}
    {...props}
    type="primary"
    shape="circle"
    icon={icon}
  />);
}
