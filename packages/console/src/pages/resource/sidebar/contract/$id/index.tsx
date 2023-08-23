import * as React from 'react';
import styles from './index.less';
import { OnMount_Page_Action as OnMount_Sidebar_Action } from '@/models/resourceSider';
import * as AHooks from 'ahooks';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { ConnectState, ResourceAuthPageModelState } from '@/models/connect';
import { RouteComponentProps } from 'react-router/index';
import { Dispatch } from 'redux';

interface ContractProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
}

function Contract({ dispatch, resourceAuthPage, match }: ContractProps) {

  AHooks.useMount(async () => {
    dispatch<OnMount_Sidebar_Action>({
      type: 'resourceSider/onMount_Page',
      payload: {
        resourceID: match.params.id,
      },
    });
  });

  return (<div>Contract</div>);
}

// export default Contract;

export default withRouter(connect(({ resourceAuthPage }: ConnectState) => ({
  resourceAuthPage: resourceAuthPage,
}))(Contract));
