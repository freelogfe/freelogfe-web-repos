import React from 'react';
import styles from './index.less';
import { Layout } from 'antd';
import { withRouter } from 'umi';
import { connect, Dispatch } from 'dva';
import { ConnectState, GlobalModelState, NodesModelState, StorageHomePageModelState } from '@/models/connect';
import { RouteComponentProps } from 'react-router';
// import FFooter from "@/layouts/FFooter";
import FHeader from '@/layouts/FLayout/FHeader';
import FHeaderNavigation from '@/components/FHeaderNavigation';
import { FUtil } from '@freelog/tools-lib';
import { dashboard } from '@freelog/tools-lib/dist/utils/linkTo';
// import * as AHooks from 'ahooks';
// import {ChangeAction} from "@/models/user";

interface FLayoutProps extends RouteComponentProps {
  children: React.ReactNode | React.ReactNodeArray;
  dispatch: Dispatch;
  global: GlobalModelState;
  storageHomePage: StorageHomePageModelState;
  nodes: NodesModelState;
}

function FLayout({ dispatch, children, global, storageHomePage, nodes }: FLayoutProps) {

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
          logoBtn={{ href: FUtil.LinkTo.dashboard() }}
          showAlphaTest={true}
          showConsoleBabel={true}
          menu={[
            {
              id: 'dashboard',
              text: '概览',
              href: FUtil.LinkTo.dashboard(),
              emptyItemsTip: undefined,
              items: [],
            },
            {
              id: 'resource',
              text: '资源管理',
              href: FUtil.LinkTo.myResources(),
              items: [
                {
                  id: 'myResource',
                  text: '我的资源',
                  href: FUtil.LinkTo.myResources(),
                },
                {
                  id: 'myCollection',
                  text: '我的收藏',
                  href: FUtil.LinkTo.myCollects(),
                },
              ],
            },
            {
              id: 'node',
              text: '节点管理',
              href: nodes.list.length === 0
                ? FUtil.LinkTo.nodeCreator()
                : FUtil.LinkTo.nodeManagement({ nodeID: nodes.list[0].nodeId }),
              items: nodes.list.map((n) => ({
                id: n.nodeId.toString(),
                text: n.nodeName,
                href: FUtil.LinkTo.nodeManagement({ nodeID: n.nodeId }),
              })),
              createBtn: {
                href: FUtil.LinkTo.nodeCreator(),
              },
              emptyItemsTip: {
                tipText: '自由创作从Freelog开始',
                btnText: '创建节点',
                btnHref: FUtil.LinkTo.nodeCreator(),
              },
            },
            {
              id: 'storage',
              text: '存储空间',
              href: FUtil.LinkTo.storageSpace({
                bucketName: storageHomePage.bucketList && storageHomePage.bucketList.length > 0
                  ? storageHomePage.bucketList[0].bucketName
                  : '',
              }),
              items: (storageHomePage.bucketList || []).map((b) => {
                return {
                  id: b.bucketName,
                  text: b.bucketName,
                  href: FUtil.LinkTo.storageSpace({
                    bucketName: b.bucketName,
                  }),
                };
              }),
              emptyItemsTip: {
                tipText: '自由创作从Freelog开始',
                btnText: '创建Bucket',
                btnHref: FUtil.LinkTo.storageSpace({
                  createBucket: true,
                }),
              },
              createBtn: {
                href: FUtil.LinkTo.storageSpace({
                  createBucket: true,
                }),
              },
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
            // {
            //   id: 'product',
            //   text: '产品',
            //   href: FUtil.LinkTo.home(),
            //   items: [],
            // },
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

      <div style={{ height: 70 }} />

      <Layout.Content className={styles.Content}>{children}</Layout.Content>

      {/*<Layout.Footer className={styles.Footer}>*/}
      {/*  <FFooter/>*/}
      {/*</Layout.Footer>*/}

    </Layout>
  );
}

export default withRouter(connect(({ global, storageHomePage, nodes }: ConnectState) => ({
  global: global,
  storageHomePage: storageHomePage,
  nodes: nodes,
}))(FLayout));
