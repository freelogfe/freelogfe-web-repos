import * as React from "react";
import {Layout} from 'antd';
import styles from './index.less';

interface FLayoutProps {
  headerLeft: React.ReactNode;
  headerRight: React.ReactNode;

  children: React.ReactNode;
}

function FLayout({children, headerLeft, headerRight}: FLayoutProps) {
  return <Layout className={styles.Layout}>
    <Layout.Header className={styles.Header}>
      {headerLeft}
      {headerRight}
    </Layout.Header>

    <div style={{height: 70}}/>

    <Layout.Content>{children}</Layout.Content>
  </Layout>
}

export default FLayout;
