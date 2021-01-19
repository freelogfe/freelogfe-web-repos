import * as React from 'react';

import styles from './index.less';
import {Layout} from 'antd';

interface FSiderLayoutProps {
  children: React.ReactNode | React.ReactNodeArray;
  sider?: React.ReactNode | React.ReactNodeArray;
}

export default function ({sider, children}: FSiderLayoutProps) {

  return (<div
    className={styles.leftRight}
    style={{minHeight: 'calc(100vh - 70px)'}}
  >
    <div className={styles.Slider}>
      {sider}
    </div>
    <div className={styles.rightContent}>
      <div>{children}</div>
    </div>
  </div>)
}
