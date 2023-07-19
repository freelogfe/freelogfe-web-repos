import React from 'react';
import styles from './index.less';
import { Link, withRouter } from 'umi';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import {
  ConnectState,
  GlobalModelState,
  NodesModelState,
  StorageHomePageModelState,
  UserModelState,
} from '@/models/connect';
import { RouteComponentProps } from 'react-router';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import * as AHooks from 'ahooks';

// import useUrlState from '@ahooksjs/use-url-state';

interface FLayoutProps extends RouteComponentProps {
  router: {
    location: Location;
  };
  children: React.ReactNode | React.ReactNodeArray;
  dispatch: Dispatch;
  global: GlobalModelState;
  storageHomePage: StorageHomePageModelState;
  nodes: NodesModelState;
  user: UserModelState;
}

interface FLayoutStates {
  activeIDs: [string, string];
  searchInput: string;
}

const initState: FLayoutStates = {
  activeIDs: ['', ''],
  searchInput: '',
};

function FLayout({
                   router: routerObj,
                   dispatch,
                   children,
                   global,
                   storageHomePage,
                   nodes,
                   user,
                 }: FLayoutProps) {
  // console.log(global, 'global09234jl23kl');
  // const [activeIDs, set_ActiveIDs] = React.useState<[string, string]>(['', '']);
  // const [urlState] = useUrlState<any>();
  // console.log(urlState, 'urlState09sodujfoksdjflksdjlkjl');
  const [$state, $setState] = AHooks.useSetState<FLayoutStates>(initState);

  React.useEffect(() => {
    const curRouter = global.routerHistories[global.routerHistories.length - 1];
    let active: [string, string] = ['', ''];
    if (curRouter.pathname.startsWith('/dashboard')) {
      active = (['dashboard', '']);
    } else if (curRouter.pathname.startsWith('/resource/list')) {
      active = (['resource', 'myResource']);
    } else if (curRouter.pathname.startsWith('/resource/collect')) {
      active = (['resource', 'myCollection']);
    } else if (curRouter.pathname.startsWith('/node/formal/')) {
      const nodeID: string = curRouter.pathname.split('/')[3];
      active = (['node', nodeID]);
    } else if (curRouter.pathname.startsWith('/storage')) {
      active = (['storage', curRouter.query.bucketName || '']);
    } else if (curRouter.pathname.startsWith('/market')) {
      active = (['discover', 'market']);
    } else if (curRouter.pathname.startsWith('/examples')) {
      active = (['discover', 'example']);
    }

    $setState({
      activeIDs: active,
    });
  }, [global.routerHistories]);
  // console.log(storageHomePage.bucketList, '’storageHomePage.bucketList390osd');
  const navs = user.info
    ? [
      {
        id: 'dashboard',
        text: FI18n.i18nNext.t('nav_dashboard'),
        href: FUtil.LinkTo.dashboard(),
        emptyItemsTip: undefined,
        items: [],
      },
      {
        id: 'resource',
        text: FI18n.i18nNext.t('nav_ManageResources'),
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
        text: FI18n.i18nNext.t('nav_ManageNodes'),
        href:
          nodes.list.length === 0
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
        text: FI18n.i18nNext.t('nav_storage'),
        href: FUtil.LinkTo.storageSpace({
          bucketName:
            storageHomePage.bucketList && storageHomePage.bucketList.length > 0
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
        createBtn:
          storageHomePage.bucketList && storageHomePage.bucketList.length >= 5
            ? undefined
            : {
              href: FUtil.LinkTo.storageSpace({
                bucketName:
                  storageHomePage.bucketList && storageHomePage.bucketList.length > 0
                    ? $state.activeIDs[0] === 'storage' ? $state.activeIDs[1] : storageHomePage.bucketList[0].bucketName
                    : '',
                createBucket: true,
              }),
            },
      },
    ]
    : [
      {
        id: 'product',
        // text: '产品',
        text: FI18n.i18nNext.t('nav_product'),
        href: FUtil.Format.completeUrlByDomain('www') + FUtil.LinkTo.home(),
        items: [],
      },
    ];

  // if (global.globalLoading) {
  //   return <FLoadingTip height={window.innerHeight} />;
  // }

  return (
    <div className={styles.Layout1}>
      <div className={styles.Header1}>
        <FComponentsLib.FHeaderNavigation
          UmiLinkPatch={Link}
          logoBtn={{ href: FUtil.LinkTo.dashboard() }}
          showAlphaTest={user.info?.userType === 1}
          showConsoleBabel={!!user.info}
          menu={[
            ...navs,
            {
              id: 'discover',
              text: FI18n.i18nNext.t('nav_explore'),
              href: FUtil.LinkTo.market(),
              items: [
                {
                  id: 'market',
                  text: '发现资源',
                  href: FUtil.LinkTo.market(),
                },
                {
                  id: 'example',
                  text: '示例节点',
                  href: FUtil.LinkTo.exampleNodes(),
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
          activeIDs={$state.activeIDs}
          // showGlobalSearch={true}
          // showGotoConsole={true}
          extra={
            // <Search
            //   placeholder='输入用户名或资源名称'
            //   onSearch={(value: string) => {
            //     window.location.href = window.location.origin + `/search?search=${value}`;
            //   }}
            //   style={{ width: 240 }}
            // />

            <FComponentsLib.FInput.FSearch
              size='small'
              // theme='dark'
              // placeholder='输入用户名或资源名称'
              placeholder={FI18n.i18nNext.t('general_search_hint')}
              style={{ width: 200 }}
              onPressEnter={() => {
                // console.log(e);
                // window.location.href = window.location.origin + `/search?search=${e.target.value}`;
                // history.push(FUtil.LinkTo.globalSearch({ search: e.target.value }));
                // self.open(FUtil.LinkTo.globalSearch({ search: e.target.value }));
                self.open(FUtil.LinkTo.globalSearch({ search: $state.searchInput }));
              }}
              value={$state.searchInput}
              onChange={(e) => {
                $setState({ searchInput: e.target.value });
              }}
            />
          }
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
          userPanel={
            user.info
              ? {
                info: {
                  avatar: user.info.headImage,
                  userName: user.info.username,
                  email: user.info.email,
                  phone: user.info.mobile,
                },
                menu: [
                  {
                    text: '个人中心',
                    onClick() {
                      window.open(
                        FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.wallet(),
                      );
                    },
                  },
                  {
                    text: '登出',
                    async onClick() {
                      await FServiceAPI.User.logout();
                      return window.location.replace(
                        FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.login(),
                      );
                    },
                  },
                ],
              }
              : null
          }
          showHotspotTooltip
        />
      </div>

      {/*<div style={{ height: 70 }} />*/}

      <div className={styles.Content1}>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default withRouter(
  connect(({ global, storageHomePage, nodes, user }: ConnectState) => ({
    global: global,
    storageHomePage: storageHomePage,
    nodes: nodes,
    user: user,
  }))(FLayout),
);
