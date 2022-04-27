import * as React from 'react';
import styles from './index.less';
import { Link } from 'umi';

interface FHeaderNavigationProps {
  logoHref: string;
  isAlphaTest?: boolean;
  menu?: {
    id: string;
    text: string;
    href: string;
    target?: '_self' | '_blank';
    items: {
      id: string;
      text: string;
      href: string;
      target?: '_self' | '_blank';
    }[];
    showAddBtn?: boolean;
    emptyItemsTip?: {
      tipText: string;
      btnText: string;
      btnHref: string;
      target?: '_self' | '_blank';
    },
  }[];
  activeIDs: [string, string];
  createBtnMenu?: {
    id: string;
    text: string;
    href: string;
    target?: '_self' | '_blank';
  }[];
  showGotoUerCenter?: boolean;
  showGotoConsole?: boolean;
}

function FHeaderNavigation({
                             logoHref,
                             isAlphaTest,
                             menu,
                             activeIDs,
                             showGotoUerCenter,
                           }: FHeaderNavigationProps) {
  return (<div className={styles.FHeaderNavigation}>
    <div className={styles.FHeaderNavigation_Left}>
      <Link className={['freelog fl-icon-a-featherlogo5', styles.logoLink].join(' ')} href={logoHref} />
      {
        isAlphaTest && (<>
          <div style={{ width: 10 }} />
          <label className={styles.alphaTestLabel}>内测</label>
        </>)
      }

      {
        menu && menu.length > 0 && (<>
          <div style={{ width: 25 }} />
          <div className={styles.Menus}>
            {
              menu.map((m) => {
                if (m.target === '_blank') {
                  return (
                    <a className={[styles.NavLink, activeIDs[0] === m.id ? styles.activated : ''].join(' ')}
                       href={m.href}
                       target='_blank'>
                      <span>{m.text}</span>
                    </a>);
                }
                return (
                  <Link className={[styles.NavLink, activeIDs[0] === m.id ? styles.activated : ''].join(' ')}
                        to={m.href}>
                    <span>{m.text}</span>
                  </Link>);
              })
            }

          </div>
        </>)
      }

    </div>
    <div className={styles.FHeaderNavigation_Right}>

    </div>
  </div>);
}

export default FHeaderNavigation;
