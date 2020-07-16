import * as React from 'react';

import styles from './index.less';
import {Layout} from "antd";

interface FSiderLayoutProps {
  children: React.ReactNode | React.ReactNodeArray;
  sider?: React.ReactNode | React.ReactNodeArray;
}

export default function ({sider, children}: FSiderLayoutProps) {
  return (<Layout.Content className={styles.leftRight}>
    <div className={styles.Slider}>
      <div style={{height: 40}}/>
      <div>{sider}</div>
    </div>
    <div className={styles.rightContent}>
      <div>{children}</div>
    </div>
  </Layout.Content>)
}
