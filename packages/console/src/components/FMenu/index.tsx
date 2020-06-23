import * as React from 'react';
import styles from './index.less';
import {Menu} from 'antd';

export default function FMenu() {
  return (
    <Menu selectable={false} className={styles.Menu} mode="vertical">
      <Menu.Item className={styles.MenuItem} key="1">Option 1Option 1Option 1</Menu.Item>
      <Menu.Item className={styles.MenuItem} key="2">Option 2</Menu.Item>
    </Menu>
  );
}
