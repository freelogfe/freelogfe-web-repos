import * as React from 'react';

import styles from './index.less';
import FMenu, {FMenuProps} from '@/components/FMenu';
import {Dropdown} from 'antd';
import {DownOutlined} from '@ant-design/icons';

interface FDropdownProps extends FMenuProps {
  children?: React.ReactNode;
  text?: React.ReactNode;
}

export default function ({dataSource, children, text}: FDropdownProps) {
  return (<Dropdown overlay={<FMenu dataSource={dataSource}/>}>
    {text ? (<div className={styles.text}>
      {text}
      <DownOutlined className={styles.DownOutlined}/>
    </div>) : children}
  </Dropdown>)
}
