import * as React from 'react';
import styles from './index.less';
import {NavLink} from 'umi';
import * as H from "history";

interface FNavLinkProps {
  text: string;
  to: H.LocationDescriptor<H.LocationState> | ((location: H.Location<H.LocationState>) => H.LocationDescriptor<H.LocationState>);
  active: boolean;
}

function FNavLink({text, to, active}: FNavLinkProps) {
  return (<NavLink
    className={[styles.Menu, active ? styles.MenuActive : ''].join(' ')}
    // activeClassName={styles.MenuActive}
    to={to}
  >{text}</NavLink>);
}

export default FNavLink;
