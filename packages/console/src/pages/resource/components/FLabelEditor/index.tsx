import * as React from 'react';
import styles from './index.less';
import {CloseOutlined} from '@ant-design/icons';
import {Input} from 'antd';

export default function () {
  return (<div className={styles.styles}>
    <label className={styles.label}>
      <span>标签1</span>
      <a><CloseOutlined/></a>
    </label>
    <label className={styles.label}>
      <span>标签2</span>
      <a><CloseOutlined/></a>
    </label>
    <Input className={styles.Input} placeholder={'回车添加标签，esc取消'}/>
  </div>);
}
