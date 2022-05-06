import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { Layout } from 'antd';
import FHeaderNavigation from '@/components/FHeaderNavigation';
import { connect } from 'dva';
import { ConnectState, GlobalModelState } from '@/models/connect';
import * as AHooks from 'ahooks';

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
    if (!FUtil.Tool.getUserIDByCookies()) {
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
    } else if (curRouter.pathname.startsWith('/activity')) {
      set_ActiveIDs(['activity', '']);
    } else {
      set_ActiveIDs(initStates['activeIDs']);
    }
  }, [global.routerHistories]);

  return (<Layout className={styles.Layout}>
    <Layout.Header className={styles.Header}>
      <FHeaderNavigation
        logoBtn={{ href: FUtil.LinkTo.home() }}
        // showAlphaTest={true}
        // showConsoleBabel={true}
        menu={[
          {
            id: 'product',
            text: '产品',
            href: FUtil.LinkTo.home(),
            items: [],
          },
          {
            id: 'discover',
            text: '发现',
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
            text: '活动',
            href: FUtil.LinkTo.activities(),
            items: [],
          },
          {
            id: 'community',
            text: '社区',
            href: '',
            items: [],
          },
          {
            id: 'help',
            text: '帮助',
            href: '',
            items: [],
          },
        ]}
        activeIDs={activeIDs}
        showGotoConsole={!!userInfo}
        userPanel={userInfo ? {
          info: {
            avatar: userInfo.headImage,
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
      />
    </Layout.Header>

    <div style={{ height: 70 }} />

    <Layout.Content>{children}</Layout.Content>
  </Layout>);
}

export default connect(({ global }: ConnectState) => ({
  global,
}))(FBaseLayout);
