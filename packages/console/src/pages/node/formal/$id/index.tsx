import * as React from 'react';
import styles from './index.less';
import Exhibits from './Exhibits';
import Themes from './Themes';
import {withRouter} from 'umi';
import RouterTypes from 'umi/routerTypes';
import {Dispatch, connect} from 'dva';
import {
  ChangeAction,
  FetchInfoAction,
  FetchNodeInfoAction,
  FetchThemesAction,
  NodeManagerModelState
} from '@/models/nodeManagerPage';
import {ConnectState} from '@/models/connect';
import {RouteComponentProps} from "react-router";

interface NodeManagerProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

function NodeManager({dispatch, nodeManagerPage, match}: NodeManagerProps) {

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'nodeManagerPage/change',
      payload: {
        nodeId: Number((match.params as any).id),
      },
    });

    dispatch<FetchNodeInfoAction>({
      type: 'nodeManagerPage/fetchNodeInfo',
    });

    dispatch<FetchInfoAction>({
      type: 'nodeManagerPage/fetchInfo',
    });

    dispatch<FetchThemesAction>({
      type: 'nodeManagerPage/fetchThemes',
    });

  }, [(match.params as any).id]);

  return (<>
    {
      nodeManagerPage.showTheme ? <Themes/> : <Exhibits/>
    }
  </>);
}


export default connect(({nodeManagerPage}: ConnectState) => ({
  nodeManagerPage,
}))(withRouter(NodeManager));
