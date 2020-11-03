import * as React from 'react';

import styles from './index.less';
import FMenu, {FMenuProps} from '@/components/FMenu';
import {Dropdown} from 'antd';
import {DownOutlined} from '@ant-design/icons';

interface FDropdownMenuProps extends FMenuProps {
  children?: React.ReactNode;
  text?: React.ReactNode;
  onChange?: (value: string) => void;
}

function FDropdownMenu({options, children, text, onChange}: FDropdownMenuProps) {
  return (<Dropdown
    overlay={<FMenu
      onClick={onChange}
      options={options}/>}>
    {text ? (<div className={styles.text}>
      {text}
      <DownOutlined className={styles.DownOutlined}/>
    </div>) : children}
  </Dropdown>)
}

export default FDropdownMenu;
