import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
import { Layout, Space } from 'antd';
import { connect } from 'dva';
import { ConnectState, GlobalModelState } from '@/models/connect';
import * as AHooks from 'ahooks';
import FComponentsLib from '@freelog/components-lib';
import { Link } from 'umi';

interface FBaseLayoutProps {
  children: React.ReactNode;
  global: GlobalModelState;
}

interface FBaseLayoutStates {
  userInfo: null | {
    createDate: string;
    email: string;
    headImage: string;
    mobile: string;
    status: number;
    tokenSn: string;
    userDetail: {
      sex: 0 | 1 | 2;
      birthday: string;
      occupation: string;
      areaCode: string;
    };
    userId: number;
    userType: 0 | 1;
    username: string;
  };
  activeIDs: [string, string];
}

const initStates: FBaseLayoutStates = {
  userInfo: null,
  activeIDs: ['', ''],
};

function FBaseLayout({ children, global }: FBaseLayoutProps) {

  const [userInfo, set_UserInfo] = React.useState<FBaseLayoutStates['userInfo']>(initStates['userInfo']);
  const [activeIDs, set_ActiveIDs] = React.useState<FBaseLayoutStates['activeIDs']>(initStates['activeIDs']);

  AHooks.useMount(async () => {
    if (FUtil.Tool.getUserIDByCookies() === -1) {
      set_UserInfo(initStates['userInfo']);
      return;
    }
    const { data } = await FServiceAPI.User.currentUserInfo();
    set_UserInfo(data);
  });

  AHooks.useUnmount(() => {
    // set_UserInfo(initStates['userInfo']);
  });

  React.useEffect(() => {
    const curRouter = global.routerHistories[global.routerHistories.length - 1];
    if (curRouter.pathname.startsWith('/home')) {
      set_ActiveIDs(['product', '']);
    } else if (curRouter.pathname.startsWith('/activities')) {
      set_ActiveIDs(['activities', '']);
    } else {
      set_ActiveIDs(initStates['activeIDs']);
    }
  }, [global.routerHistories]);

  return (<div className={styles.Layout1}>
    <div className={styles.Header1}>

      <FComponentsLib.FHeaderNavigation
        UmiLinkPatch={Link}
        logoBtn={{ href: FUtil.LinkTo.home() }}
        // showAlphaTest={true}
        // showConsoleBabel={true}
        menu={[
          {
            id: 'product',
            text: FI18n.i18nNext.t('nav_product'),
            href: FUtil.LinkTo.home(),
            items: [],
          },
          {
            id: 'discover',
            // text: '发现',
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
            id: 'activities',
            // text: '活动',
            text: FI18n.i18nNext.t('nav_events'),
            href: FUtil.LinkTo.activities(),
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
        activeIDs={activeIDs}
        showGotoConsole={!!userInfo}
        userPanel={userInfo ? {
          info: {
            // avatar: userInfo.headImage,
            avatar: FUtil.Tool.getAvatarUrl(),
            userName: userInfo.username,
            email: userInfo.email,
            phone: userInfo.mobile,
          },
          menu: [
            {
              text: '个人中心',
              onClick() {
                window.open(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.wallet());
              },
            },
            {
              text: '登出',
              async onClick() {
                await FServiceAPI.User.logout();
                set_UserInfo(initStates['userInfo']);
              },
            },
          ],
        } : null}
        showHotspotTooltip
      />
    </div>
    {/*<Space>*/}
    {/*  <div style={{ height: 70 }} />*/}
    {/*</Space>*/}

    <div className={styles.Content1}>
      <div>{children}</div>
    </div>
  </div>);
}

export default connect(({ global }: ConnectState) => ({
  global,
}))(FBaseLayout);
