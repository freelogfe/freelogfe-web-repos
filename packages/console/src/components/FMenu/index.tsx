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
