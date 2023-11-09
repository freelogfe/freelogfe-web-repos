import * as React from 'react';
import styles from './index.less';
import Sider from '../containers/Sider';

interface SidebarProps {
  children: React.ReactNode;
}

function Sidebar({ children }: SidebarProps) {

  return (<div
    className={styles.leftRight}
  >
    <div className={styles.Slider}>
      <div>
        <Sider />
      </div>
    </div>
    <div className={styles.rightContent}>
      <div>
        {children}
      </div>
    </div>
  </div>);
}

export default Sidebar;
