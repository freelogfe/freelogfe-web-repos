import * as React from 'react';
import styles from './index.less';
import { Link } from 'umi';
import { Space } from 'antd';
import FInput from '@/components/FInput';
import { FRectBtn } from '@/components/FButton';
import UserInfo from './UserInfo';
import FDropdown from '@/components/FDropdown';
import EmptyAndCreate from '@/components/FHeaderNavigation/EmptyAndCreate';

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
      <Link className={['freelog fl-icon-a-featherlogo5', styles.logoLink].join(' ')} to={logoHref} />
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
                return (<FDropdown overlay={m.emptyItemsTip ? <EmptyAndCreate {...m.emptyItemsTip} /> : <div />}>
                  {
                    m.href.startsWith('http')
                      ? (<a
                        className={[styles.NavLink, activeIDs[0] === m.id ? styles.activated : ''].join(' ')}
                        href={m.href}
                        target={m.target}
                      >
                        <span>{m.text}</span>
                      </a>)
                      : (<Link
                        className={[styles.NavLink, activeIDs[0] === m.id ? styles.activated : ''].join(' ')}
                        to={m.href}
                        target={m.target}
                      >
                        <span>{m.text}</span>
                      </Link>)
                  }
                </FDropdown>);

              })
            }

          </div>
        </>)
      }

    </div>
    <Space size={30} className={styles.FHeaderNavigation_Right}>
      <FInput
        size='small'
        theme='dark'
        style={{ width: 200 }}
      />

      <UserInfo info={null} />

      <FRectBtn
        type='secondary'
        onClick={() => {
          // window.open(FUtil.Format.completeUrlByDomain('console'));
        }}
      >进入工作台</FRectBtn>
    </Space>
  </div>);
}

export default FHeaderNavigation;
