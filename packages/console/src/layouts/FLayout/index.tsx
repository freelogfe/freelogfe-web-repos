import React from 'react';
import styles from './index.less';
import {Layout} from 'antd';
import {withRouter} from 'umi';
import {connect, Dispatch} from 'dva';
import {ConnectState, GlobalModelState} from '@/models/connect';
import {RouteComponentProps} from "react-router";
// import FFooter from "@/layouts/FFooter";
import FHeader from "@/layouts/FLayout/FHeader";
import FHeaderNavigation from '@/components/FHeaderNavigation';
// import * as AHooks from 'ahooks';
// import {ChangeAction} from "@/models/user";

interface FLayoutProps extends RouteComponentProps {
  children: React.ReactNode | React.ReactNodeArray;
  dispatch: Dispatch;
  global: GlobalModelState;
}

function FLayout({dispatch, children, global}: FLayoutProps) {

  // const [cookiesUserID] = AHooks.useCookieState('uid', {
  //   defaultValue: '50028',
  // });
  //
  // React.useEffect(() => {
  //   // console.log(cookiesUserID, '!~!!!!!!!!###3333333');
  //   dispatch<ChangeAction>({
  //     type: 'user/change',
  //     payload: {
  //       cookiesUserID: Number(cookiesUserID),
  //     },
  //   });
  // }, []);

  return (
    <Layout
      className={styles.Layout}
    >
      <Layout.Header className={styles.header}>
        <FHeaderNavigation
          logoHref={''}
          showAlphaTest={true}
          showConsoleBabel={true}
          menu={[
            {
              id: 'dashboard',
              text: '概览',
              href: 'https://www.baidu.com',
              showAddBtn: false,
              emptyItemsTip: undefined,
              items: [
                {
                  id: 'dashboard-1',
                  text: '我的资源',
                  href: 'https://www.baidu.com',
                },
                {
                  id: 'dashboard-2',
                  text: '我的收藏',
                  href: 'https://www.baidu.com',
                },
              ],
            },
            {
              id: 'resource',
              text: '资源管理',
              href: '/dashboard',
              items: [],
              emptyItemsTip: {
                tipText: '自由创作从Freelog开始',
                btnText: '创建Bucket',
                btnHref: 'https://www.baidu.com',
              },
            },
            {
              id: 'node',
              text: '节点管理',
              href: '',
              items: [],
            },
            {
              id: 'storage',
              text: '存储空间',
              href: '',
              items: [],
            },
            {
              id: 'discover',
              text: '发现',
              href: '',
              items: [],
            },
            {
              id: 'activity',
              text: '活动',
              href: '',
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
            {
              id: 'product',
              text: '产品',
              href: '',
              items: [],
            },
          ]}
          activeIDs={['dashboard', '']}
          showGlobalSearch={true}
          showGotoConsole={true}
          createBtnMenu={[
            {
              id: 'createResource',
              text: '创建资源',
              href: '/resource/creator',
            },
            {
              id: 'createNode',
              text: '创建节点',
              href: '/node/creator',
            },
          ]}
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

      <div style={{height: 70}}/>

      <Layout.Content className={styles.Content}>{children}</Layout.Content>

      {/*<Layout.Footer className={styles.Footer}>*/}
      {/*  <FFooter/>*/}
      {/*</Layout.Footer>*/}

    </Layout>
  );
}

export default withRouter(connect(({global}: ConnectState) => ({
  global: global,
}))(FLayout));
