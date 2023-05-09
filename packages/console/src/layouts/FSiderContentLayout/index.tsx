import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, GlobalModelState } from '@/models/connect';

interface FCenterLayoutProps {
  style?: React.CSSProperties;
  sider: React.ReactNode;
  children?: React.ReactNode;
}

function FSiderContentLayout({ sider, children, style = {} }: FCenterLayoutProps) {
  return (<div
    style={style}
    className={styles.styles}
  >
    <div className={styles.sider}>{sider}</div>
    <div className={styles.children}>{children}</div>
  </div>);
}

export default FSiderContentLayout;
