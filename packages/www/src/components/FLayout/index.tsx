import * as React from "react";
import {Layout} from 'antd';
import styles from './index.less';
import { FUtil } from '@freelog/tools-lib';
import FHeaderNavigation from '@/components/FHeaderNavigation';

interface FLayoutProps {
  headerLeft: React.ReactNode;
  headerRight: React.ReactNode;

  children: React.ReactNode;
}

function FLayout({children, headerLeft, headerRight}: FLayoutProps) {
  return <Layout className={styles.Layout}>
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
        // showGlobalSearch={true}
        showGotoConsole={true}
        // createBtnMenu={[
        //   {
        //     id: 'createResource',
        //     text: '创建资源',
        //     href: '/resource/creator',
        //   },
        //   {
        //     id: 'createNode',
        //     text: '创建节点',
        //     href: '/node/creator',
        //   },
        // ]}
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

    <Layout.Content>{children}</Layout.Content>
  </Layout>
}

export default FLayout;
