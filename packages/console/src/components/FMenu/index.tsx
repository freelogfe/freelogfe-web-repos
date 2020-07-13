import * as React from 'react';
import styles from './index.less';
import {Menu} from 'antd';

interface FMenuItem {
  children: React.ReactNode;
  id: string | number;
}


export interface FMenuProps {
  dataSource: FMenuItem[];
}

export default function FMenu({dataSource}: FMenuProps) {
  return (
    <Menu selectable={false} className={styles.Menu} mode="vertical">
      {
        dataSource.map((i: FMenuItem) => (<Menu.Item key={i.id} className={styles.MenuItem}>{i.children}</Menu.Item>))
      }
      {/*<Menu.Item className={styles.MenuItem} key="1">Option 1Option 1Option 1</Menu.Item>*/}
      {/*<Menu.Item className={styles.MenuItem} key="2">Option 2</Menu.Item>*/}
    </Menu>
  );
}
