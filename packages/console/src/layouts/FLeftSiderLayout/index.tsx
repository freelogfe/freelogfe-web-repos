import * as React from 'react';
import styles from './index.less';

interface FLeftSiderLayoutProps {

  type?: 'form' | 'table';

  header: React.ReactNode;
  sider: React.ReactNode | React.ReactNodeArray;
  children: React.ReactNode | React.ReactNodeArray;
}

function FLeftSiderLayout({children, header, sider, type}: FLeftSiderLayoutProps) {

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
      <div className={[styles.header, type === 'table' ? styles.tableWidth : ''].join(' ')}>
        {header}
      </div>
      <div className={[styles.content, type === 'table' ? styles.tableWidth : ''].join(' ')}>
        {children}
      </div>
      <div style={{height: 100}}/>
    </div>
  </div>);
}

export default FLeftSiderLayout;
