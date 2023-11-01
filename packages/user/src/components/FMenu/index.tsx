import * as React from 'react';
import styles from './index.less';
import { Menu } from 'antd';

interface FMenuItem {
  text?: string;
  value: string;
}

export interface FMenuProps {
  value?: string;
  options: FMenuItem[];
  onClick?: (value: string) => void;
}

function FMenu({ options, value, onClick }: FMenuProps) {

  // const items = [
  //   { label: '菜单项一', key: 'item-1' }, // 菜单项务必填写 key
  //   { label: '菜单项二', key: 'item-2' },
  //   {
  //     label: '子菜单',
  //     key: 'submenu',
  //     children: [{ label: '子菜单项', key: 'submenu-item-1' }],
  //   },
  // ];

  const items = options.map((o) => {
    return {
      key: o.value,
      label: o.text || o.value,
    };
  });

  return (<Menu
    selectable={false}
    className={styles.Menu}
    mode='vertical'
    onClick={(param: any) => onClick && onClick(param.key)}
    items={items}
  />);
}

export default FMenu;
