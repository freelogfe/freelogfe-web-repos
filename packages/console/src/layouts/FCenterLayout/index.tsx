import * as React from 'react';

import styles from './index.less';
import {Layout} from "antd";

interface FCenterLayoutProps {
  children?: React.ReactNode | React.ReactNodeArray;
}

export default function ({children}: FCenterLayoutProps) {
  return (<Layout.Content className={styles.Content}>
    <div>{children}</div>
    <div style={{height: 100}}/>
  </Layout.Content>)
}
