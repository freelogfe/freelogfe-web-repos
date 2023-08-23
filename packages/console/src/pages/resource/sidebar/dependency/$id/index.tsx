import * as React from 'react';
import styles from './index.less';
import { OnMount_Page_Action as OnMount_Sidebar_Action } from '@/models/resourceSider';
import { RouteComponentProps } from 'react-router/index';
import { Dispatch } from 'redux';
import { ResourceAuthPageModelState } from '@/models/resourceAuthPage';
import * as AHooks from 'ahooks';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

interface DependencyProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
}

function Dependency({dispatch, resourceAuthPage, match}: DependencyProps) {

  AHooks.useMount(async () => {
    dispatch<OnMount_Sidebar_Action>({
      type: 'resourceSider/onMount_Page',
      payload: {
        resourceID: match.params.id,
      },
    });
  });

  return (<div>__Template</div>);
}

export default withRouter(connect(({ resourceAuthPage }: ConnectState) => ({
  resourceAuthPage: resourceAuthPage,
}))(Dependency));
