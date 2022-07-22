import * as React from 'react';
import styles from './index.less';
import FInput from '@/components/FInput';
import UserInfo from './UserInfo';
import EmptyAndCreate from './EmptyAndCreate';
import NavList from './NavList';
import AOrLink from './AOrLink';
import { FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface FHeaderNavigationProps {
  logoBtn: {
    href: string;
    target?: '_self' | '_blank';
  };
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
    createBtn?: {
      href: string;
      target?: '_self' | '_blank';
    } | null;
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
                             logoBtn,
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
      <AOrLink href={logoBtn.href} className={styles.logoLink}>
        <i className={'freelog fl-icon-a-featherlogo5'} />
        {
          showConsoleBabel && (<>
            <div style={{ width: 10 }} />
            <span>· 工作台</span>
          </>)
        }
      </AOrLink>

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
                // console.log(m.emptyItemsTip, 'm.emptyItemsTip');
                return (<FComponentsLib.FDropdown
                  key={m.id}
                  disabled={m.items.length === 0 && !m.emptyItemsTip}
                  overlay={m.items.length === 0 && m.emptyItemsTip
                    ? <EmptyAndCreate {...m.emptyItemsTip} />
                    : <NavList
                      items={m.items}
                      createBtn={m.createBtn}
                      activeID={activeIDs[1]}
                    />}
                >
                  <AOrLink
                    href={m.href}
                    target={m.target}
                    className={[styles.NavLink, activeIDs[0] === m.id ? styles.activated : ''].join(' ')}
                  ><span>{m.text}</span></AOrLink>
                </FComponentsLib.FDropdown>);

              })
            }

          </div>
        </>)
      }

    </div>
    <div className={styles.FHeaderNavigation_Right}>
      {
        showGlobalSearch && (<>
          <FInput
            size='small'
            theme='dark'
            style={{ width: 200 }}
            value={''}
          />
          <div style={{ width: 30 }} />
        </>)
      }

      {
        showGotoConsole && (<>
          <FComponentsLib.FRectBtn
            size='small'
            type='secondary'
            onClick={() => {
              window.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.dashboard());
            }}
          >进入工作台</FComponentsLib.FRectBtn>
          <div style={{ width: 30 }} />
        </>)
      }

      {
        createBtnMenu && createBtnMenu.length > 0 && (<>
          <FComponentsLib.FDropdown
            overlay={<NavList items={createBtnMenu} />}
          >
            <a className={styles.createBtnMenu}>
            <span>
              <FComponentsLib.FIcons.FPlus />
            </span>
            </a>
          </FComponentsLib.FDropdown>
          <div style={{ width: 30 }} />
        </>)
      }

      <UserInfo data={userPanel} />

    </div>
  </div>);
}

export default FHeaderNavigation;
