import * as React from 'react';
import styles from './index.less';
import Exhibits from './Exhibits';
import Themes from './Themes';
import {withRouter, router} from 'umi';
import {Dispatch, connect} from 'dva';
import {
  ChangeAction,
  FetchExhibitsAction,
  FetchNodeInfoAction,
  FetchThemesAction, nodeManagerInitData,
  NodeManagerModelState
} from '@/models/nodeManagerPage';
import {ConnectState, NodesModelState} from '@/models/connect';
import {RouteComponentProps} from "react-router";

interface NodeManagerProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
  nodes: NodesModelState;
}

function NodeManager({dispatch, nodeManagerPage, nodes, match}: NodeManagerProps) {

  React.useEffect(() => {

    dispatch<ChangeAction>({
      type: 'nodeManagerPage/change',
      payload: {
        nodeId: Number(match.params.id),
      },
    });

    dispatch<FetchNodeInfoAction>({
      type: 'nodeManagerPage/fetchNodeInfo',
    });

    dispatch<FetchExhibitsAction>({
      type: 'nodeManagerPage/fetchExhibits',
    });

    dispatch<FetchThemesAction>({
      type: 'nodeManagerPage/fetchThemes',
    });

  }, [match.params.id]);

  React.useEffect(() => {
    return () => {
      dispatch<ChangeAction>({
        type: 'nodeManagerPage/change',
        payload: nodeManagerInitData,
      });
    };
  }, []);

  return (<>
    {
      nodeManagerPage.showTheme ? <Themes/> : <Exhibits/>
    }
  </>);
}


export default connect(({nodeManagerPage, nodes}: ConnectState) => ({
  nodeManagerPage,
  nodes,
}))(withRouter(NodeManager));
