import * as React from 'react';

import styles from './index.less';
import {Layout} from 'antd';

interface FSiderLayoutProps {
  children: React.ReactNode | React.ReactNodeArray;
  sider?: React.ReactNode | React.ReactNodeArray;
}

export default function ({sider, children}: FSiderLayoutProps) {
  const [minHeight, setMinHeight] = React.useState<number>(window.innerHeight - 70);

  React.useEffect(() => {
    window.addEventListener('resize', setHeight);
    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, []);

  function setHeight() {
    setMinHeight(window.innerHeight - 70);
  }

  return (<div
    className={styles.leftRight}
    style={{minHeight: minHeight}}
  >
    <div className={styles.Slider}>
      {sider}
    </div>
    <div className={styles.rightContent}>
      <div>{children}</div>
    </div>
  </div>)
}
