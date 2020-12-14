import * as React from 'react';
import styles from './index.less';

interface FContentLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;

  containerClassName?: string;
  contentClassName?: string;
}

function FContentLayout({header, children, containerClassName, contentClassName}: FContentLayoutProps) {
  return (<div className={styles.container}>
    <div className={styles.header}>
      {header}
    </div>
    <div className={styles.content}>
      {children}
    </div>
    <div style={{height: 100}}/>
  </div>);
}

export default FContentLayout;
