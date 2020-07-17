import * as React from 'react';

import styles from './index.less';
import FMenu, {FMenuProps} from '@/components/FMenu';
import {Dropdown} from 'antd';
import {DownOutlined} from '@ant-design/icons';

interface FDropdownProps extends FMenuProps {
  children?: React.ReactNode;
  text?: React.ReactNode;
  onChange?: (value: string) => void;
}

export default function ({options, children, text, onChange}: FDropdownProps) {
  return (<Dropdown overlay={<FMenu
    onClick={onChange}
    options={options}/>}>
    {text ? (<div className={styles.text}>
      {text}
      <DownOutlined className={styles.DownOutlined}/>
    </div>) : children}
  </Dropdown>)
}
