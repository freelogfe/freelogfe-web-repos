import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
import { connect } from 'dva';
import { ConnectState, GlobalModelState, UserModelState } from '@/models/connect';
import { history } from '@@/core/history';
import FComponentsLib from '@freelog/components-lib';
import { Link } from 'umi';

interface FBaseLayoutProps {
  children: React.ReactNode;
  user: UserModelState;
  global: GlobalModelState;
}

function FBaseLayout({ children, user, global }: FBaseLayoutProps) {

  return (<div className={styles.Layout1}>
    <div className={styles.Header1}>
      <FComponentsLib.FHeaderNavigation
        logoBtn={{ href: FUtil.Format.completeUrlByDomain('www') + FUtil.LinkTo.home() }}
        // showAlphaTest={true}
        // showConsoleBabel={true}
        menu={[
          {
            id: 'product',
            text: FI18n.i18nNext.t('nav_product'),
            href: FUtil.Format.completeUrlByDomain('www') + FUtil.LinkTo.home(),
            items: [],
          },
          {
            id: 'discover',
            text: FI18n.i18nNext.t('nav_explore'),
            href: FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.market(),
            items: [
              {
                id: 'myResource',
                text: '发现资源',
                href: FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.market(),
              },
              {
                id: 'myCollection',
                text: '示例节点',
                href: FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.market(),
              },
            ],
          },
          {
            id: 'activity',
            text: FI18n.i18nNext.t('nav_events'),
            href: FUtil.Format.completeUrlByDomain('www') + FUtil.LinkTo.activities(),
            items: [],
          },
          {
            id: 'community',
            text: FI18n.i18nNext.t('nav_communitiy'),
            href: 'https://forum.freelog.com/',
            target: '_blank',
            items: [],
          },
          {
            id: 'help',
            text: FI18n.i18nNext.t('nav_docs'),
            href: 'https://freelog3.freelog.com/',
            target: '_blank',
            items: [],
          },
        ]}
        activeIDs={['', '']}
        showGotoConsole={true}
        userPanel={user.userInfo ? {
          info: {
            avatar: user.userInfo.headImage,
            userName: user.userInfo.username,
            email: user.userInfo.email,
            phone: user.userInfo.mobile,
          },
          menu: [
            {
              text: '登出',
              async onClick() {
                await FServiceAPI.User.logout();
                // return FUtil.LinkTo.login();
                history.push(FUtil.LinkTo.login());
              },
            },
          ],
        } : null}
        UmiLinkPatch={Link}
      />
    </div>
    <div className={styles.Content1}>
      {/*<div></div>*/}
      <div>{children}</div>
    </div>
  </div>);
}

export default connect(({ user, global }: ConnectState) => ({ user, global }))(FBaseLayout);
