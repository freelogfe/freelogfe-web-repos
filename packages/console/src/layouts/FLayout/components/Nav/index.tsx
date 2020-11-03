import * as React from 'react';
import styles from './index.less';

interface NavProps {
  children: React.ReactNode;
  active: boolean;

  onClick?(): void;
}

function Nav({children, active, onClick}: NavProps) {
  return (<a
    onClick={() => onClick && onClick()}
    className={styles.Menu + ' ' + (active ? styles.MenuActive : '')}>{children}</a>);
}

export default Nav;
