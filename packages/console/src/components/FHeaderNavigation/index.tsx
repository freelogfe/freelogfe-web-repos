import * as React from 'react';
import styles from './index.less';
import { Link } from 'umi';
import { Space } from 'antd';
import FInput from '@/components/FInput';
import { FRectBtn } from '@/components/FButton';
import UserInfo from './UserInfo';
import FDropdown from '@/components/FDropdown';
import EmptyAndCreate from './EmptyAndCreate';
import NavList from './NavList';
import FPlus from '../FIcons/FPlus';

interface FHeaderNavigationProps {
  logoHref: string;
  showAlphaTest?: boolean;
  showConsoleBabel?: boolean;
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
  activeIDs?: [string, string];
  showGlobalSearch?: boolean;
  showGotoConsole?: boolean;
  createBtnMenu?: {
    id: string;
    text: string;
    href: string;
    target?: '_self' | '_blank';
  }[];
  userPanel: {
    info: {
      avatar: string;
      userName: string;
      email: string;
      phone: string;
    };
    menu: {
      text: string;
      onClick(): void;
    }[];
  } | null;
}

function FHeaderNavigation({
                             logoHref,
                             showAlphaTest = false,
                             showConsoleBabel = false,
                             menu = [],
                             activeIDs = ['', ''],
                             showGlobalSearch = false,
                             showGotoConsole = false,
                             createBtnMenu = [],
                             userPanel,
                           }: FHeaderNavigationProps) {
  return (<div className={styles.FHeaderNavigation}>
    <div className={styles.FHeaderNavigation_Left}>
      {

      }
      <Link className={styles.logoLink} to={logoHref}>
        <i className={'freelog fl-icon-a-featherlogo5'} />
        {
          showConsoleBabel && (<>
            <div style={{ width: 10 }} />
            <span>· 工作台</span>
          </>)
        }

      </Link>
      {
        showAlphaTest && (<>
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
                return (<FDropdown
                  key={m.id}
                  overlay={m.emptyItemsTip ? <EmptyAndCreate {...m.emptyItemsTip} /> : <NavList items={m.items} />}
                >
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
      {
        showGlobalSearch && (<FInput
          size='small'
          theme='dark'
          style={{ width: 200, height: 32 }}
        />)
      }

      {
        showGotoConsole && (<FRectBtn
          size='small'
          type='secondary'
          onClick={() => {
            // window.open(FUtil.Format.completeUrlByDomain('console'));
          }}
        >进入工作台</FRectBtn>)
      }

      {
        createBtnMenu && createBtnMenu.length > 0 && (<FDropdown
          overlay={<NavList items={createBtnMenu} />}
        >
          <a className={styles.createBtnMenu}>
            <span>
              <FPlus />
            </span>
          </a>
        </FDropdown>)
      }


      <UserInfo data={userPanel} />

    </Space>
  </div>);
}

export default FHeaderNavigation;
