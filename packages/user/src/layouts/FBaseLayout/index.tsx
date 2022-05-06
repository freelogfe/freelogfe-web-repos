import * as React from 'react';
import styles from './index.less';
// import FLayout from '@/components/FLayout';
// import { NavLink } from 'umi';
// import FDropdown from '@/components/FDropdown';
// import { FContentText } from '@/components/FText';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { Layout, Space } from 'antd';
// import { FRectBtn } from '@/components/FButton';
import { connect } from 'dva';
import { ConnectState, UserModelState } from '@/models/connect';
// import UserSVG from '@/assets/user.svg';
// import { history } from 'umi';
// import FUtil1 from '@/utils';
import FHeaderNavigation from '@/components/FHeaderNavigation';

interface FBaseLayoutProps {
  children: React.ReactNode;
  user: UserModelState;
}

function FBaseLayout({ children, user }: FBaseLayoutProps) {
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
            href: FUtil.LinkTo.market(),
            items: [
              {
                id: 'myResource',
                text: '发现资源',
                href: FUtil.LinkTo.market(),
              },
              {
                id: 'myCollection',
                text: '示例节点',
                href: FUtil.LinkTo.market(),
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
        activeIDs={['dashboard', '']}
        showGotoConsole={true}
        userPanel={{
          info: {
            avatar: '',
            userName: 'Liu',
            email: '12345@qq.com',
            phone: '13333333333',
          },
          menu: [
            {
              text: '个人中心',
              onClick() {
                console.log('####');
              },
            },
            {
              text: '登出',
              onClick() {
                console.log('****');
              },
            },
          ],
        }}
      />
    </Layout.Header>

    <div style={{ height: 70 }} />

    <Layout.Content>{children}</Layout.Content>
  </Layout>);
  // return (<FLayout
  //   headerLeft={
  //     <NavLink
  //       to={FUtil.LinkTo.wallet()}
  //       className={['freelog', 'fl-icon-logo-freelog', styles.logo].join(' ')}
  //     />
  //   }
  //   headerRight={<Space size={5}>
  //     <FRectBtn
  //       type='secondary'
  //       onClick={() => {
  //         window.open(FUtil.Format.completeUrlByDomain('console'));
  //       }}
  //     >{FUtil1.I18n.message('btn_go_to_console')}</FRectBtn>
  //     <FDropdown overlay={<div className={styles.userPanel}>
  //       <div className={styles.userPanelHeader}>
  //         <img src={(user.userInfo?.headImage || UserSVG) as string} alt='headImage' />
  //         <div style={{ height: 10 }} />
  //         <FContentText
  //           type='highlight'
  //           text={user.userInfo?.username}
  //         />
  //         <div style={{ height: 8 }} />
  //         <FContentText
  //           text={user.userInfo?.mobile || user.userInfo?.email}
  //         />
  //       </div>
  //       <div className={styles.userPanelMenu}>
  //         {/*<a onClick={() => {*/}
  //         {/*  window.location.href = `${FUtil.Format.completeUrlByDomain('www')}/user/Profile`;*/}
  //         {/*}}>个人中心</a>*/}
  //         <a onClick={async () => {
  //           // window.location.href = `${FUtil.Format.completeUrlByDomain('www')}/login`;
  //           await FServiceAPI.User.logout({});
  //           // return window.location.replace(`${FUtil.Format.completeUrlByDomain('www')}/login`);
  //           history.replace(FUtil.LinkTo.login());
  //         }}>登出</a>
  //       </div>
  //     </div>}>
  //       <a className={styles.avatar}>
  //         <img src={(user.userInfo?.headImage || UserSVG) as string} alt={'avatar'} />
  //       </a>
  //     </FDropdown>
  //   </Space>}
  // >{children}
  // </FLayout>);
}

export default connect(({ user }: ConnectState) => ({ user }))(FBaseLayout);
