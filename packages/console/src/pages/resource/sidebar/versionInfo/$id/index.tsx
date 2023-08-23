import * as React from 'react';
import styles from './index.less';
import { OnMount_Page_Action as OnMount_Sidebar_Action } from '@/models/resourceSider';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { ConnectState, ResourceVersionEditorPageModelState } from '@/models/connect';
import { RouteComponentProps } from 'react-router/index';
import { Dispatch } from 'redux';
import * as AHooks from 'ahooks';

interface VersionInfoProps extends RouteComponentProps<{
  id: string;
  version: string;
}> {
  dispatch: Dispatch;
  resourceVersionEditorPage: ResourceVersionEditorPageModelState;
}

function VersionInfo({dispatch, resourceVersionEditorPage, match}: VersionInfoProps) {

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

// export default VersionInfo;

export default withRouter(connect(({ resourceVersionEditorPage }: ConnectState) => ({
  resourceVersionEditorPage: resourceVersionEditorPage,
}))(VersionInfo));
