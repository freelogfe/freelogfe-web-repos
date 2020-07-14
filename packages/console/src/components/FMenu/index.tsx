import * as React from 'react';
import styles from './index.less';
import {Menu} from 'antd';
import {ClickParam} from 'antd/lib/menu';

interface FMenuItem {
  children: React.ReactNode;
  key: string | number;
}


export interface FMenuProps {
  dataSource: FMenuItem[];
  onClick?: (param: ClickParam) => void;
}

export default function FMenu({dataSource, onClick}: FMenuProps) {
  return (
    <Menu
      selectable={false}
      className={styles.Menu}
      mode="vertical"
      onClick={onClick}
    >
      {
        dataSource
          .map((i: FMenuItem) => (<Menu.Item
            key={i.key}
            className={styles.MenuItem}
          >{i.children}</Menu.Item>))
      }
    </Menu>
  );
}
