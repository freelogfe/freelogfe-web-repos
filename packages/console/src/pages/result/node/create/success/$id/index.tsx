import * as React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import { withRouter, router } from 'umi';
import RouterTypes from 'umi/routerTypes';
import { ChangeAction } from '@/models/global';
import { Dispatch, connect } from 'dva';
import { FUtil } from '@freelog/tools-lib';
import { RouteComponentProps } from 'react-router';
import { ChangeAction as MarketChangeAction } from '@/models/marketPage';
import FResultTip from '@/components/FResultTip';
import FGraph_Tree_Authorization_Exhibit from '@/components/FAntvG6/FGraph_Tree_Authorization_Exhibit';
import FGraph_Tree_Relationship_Exhibit from '@/components/FAntvG6/FGraph_Tree_Relationship_Exhibit';
import FGraph_State_Machine from '@/components/FAntvG6/FGraph_State_Machine';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import FHeaderNavigation from '@/components/FHeaderNavigation';


const fsmDescriptionInfo: PolicyFullInfo_Type['fsmDescriptionInfo'] = {
  'initial': {
    'transitions': [{
      'toState': 'finish',
      'service': 'freelog',
      'name': 'RelativeTimeEvent',
      'args': { 'elapsed': 1, 'timeUnit': 'month' },
      'code': 'A103',
      'isSingleton': false,
      'eventId': '1b0662145c874a7fa9fba4a8a3479550',
    }],
    'serviceStates': ['active'],
    'isInitial': true,
    'isAuth': true,
    'isTestAuth': false,
  },
  'finish': {
    'transitions': [],
    'serviceStates': [],
    'isAuth': false,
    'isTestAuth': false,
    'isTerminate': true,
  },
};

interface SuccessProps extends RouteComponentProps<{ id: string; }> {
  dispatch: Dispatch;
}

function Success({ route, dispatch }: RouterTypes & SuccessProps) {

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

  function goto() {
    dispatch<MarketChangeAction>({
      type: 'marketPage/change',
      payload: {
        resourceType: 'theme',
      },
    });
    router.push(FUtil.LinkTo.market());
  }

  return (<FHeaderNavigation
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
  />);

  return (<FCenterLayout style={{ backgroundColor: 'white' }}>
    <div style={{ height: 100 }} />
    <div className={styles.modal}>
      <FResultTip
        // h1={FUtil1.I18n.message('msg_nodecreatedsuccessfully')}
        h1={'节点创建成功'}
        // h2={FUtil1.I18n.message('msg_nodecreatedsuccessfully')}
        h2={'主题决定节点的整体外观和设计，你可以通过激活不同的主题来更改节点的布局、配色方案等。'}
        // btnText={FUtil1.I18n.message('cta_btn_add_theme')}
        btnText={'添加主题'}
        onClickBtn={goto}
      />


    </div>

  </FCenterLayout>);
}

export default withRouter(connect()(Success));
