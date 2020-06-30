import * as React from 'react';
import {Input} from 'antd';
import {InputProps} from "antd/lib/input";
import styles from './index.less';
import {SearchOutlined} from '@ant-design/icons';

interface FInputProps extends InputProps {
  theme?: 'dark' | 'light';
}

export default function ({theme = 'light', className = '', ...props}: FInputProps) {
  if (theme === 'dark') {
    return (<Input
      prefix={<SearchOutlined style={{color: '#8E8E93'}}/>}
      className={[styles.Input, theme === 'dark' ? styles.dark : '', className].join(' ')}
      {...props}
    />)
  }
  return (<Input className={[styles.Input, className].join(' ')} {...props}/>);
}
