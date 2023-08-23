import * as React from 'react';
import styles from './index.less';
import Sider from '../containers/Sider';
import { OnMount_Page_Action } from '@/models/resourceSider';
import * as AHooks from 'ahooks';

interface SidebarProps {
  children: React.ReactNode;
}

function Sidebar({ children }: SidebarProps) {

  return (<div
    className={styles.leftRight}
    // style={{ height: 'calc(100vh - 70px)' }}
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
