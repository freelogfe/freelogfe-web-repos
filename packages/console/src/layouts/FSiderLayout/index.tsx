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
    window.addEventListener('resize', setHeight);
    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, []);

  function setHeight() {
    setMinHeight(window.innerHeight - 60);
  }

  return (<div
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
  </div>)
}
