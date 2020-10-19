import * as React from 'react';

import styles from './index.less';
import {Layout} from 'antd';

interface FSiderLayoutProps {
  children: React.ReactNode | React.ReactNodeArray;
  sider?: React.ReactNode | React.ReactNodeArray;
}

export default function ({sider, children}: FSiderLayoutProps) {
  const [minHeight, setMinHeight] = React.useState<number>(window.innerHeight - 60);

  React.useEffect(() => {
    window.onresize = () => {
      setMinHeight(window.innerHeight - 60);
    }
  },[]);

  return (<Layout.Content
    className={styles.leftRight}
    style={{minHeight: minHeight}}
  >
    <div className={styles.Slider}>
      {/*<div style={{height: 40}}/>*/}
      {/*<div></div>*/}
      {sider}
    </div>
    <div className={styles.rightContent}>
      <div>{children}</div>
      <div style={{height: 100}}/>
    </div>
  </Layout.Content>)
}
