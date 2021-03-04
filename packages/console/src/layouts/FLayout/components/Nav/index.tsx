import * as React from 'react';
import styles from './index.less';
import {Link} from 'umi';

interface NavProps {
  children: React.ReactNode;
  active: boolean;
  href?: string;

  onClick?(): void;
}

function Nav({children, active, href, onClick}: NavProps) {
  return (<a
    href={href}
    onClick={() => onClick && onClick()}
    className={styles.Menu + ' ' + (active ? styles.MenuActive : '')}>{children}</a>);
}

export default Nav;
