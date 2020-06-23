import * as React from 'react';
import {Input} from 'antd';
import {InputProps} from "antd/lib/input";
import styles from './index.less';

export default function ({className = '', ...props}: InputProps) {
  return (<Input style={{outline: 'none'}} className={styles.Input + ' ' + className} {...props}/>);
}
