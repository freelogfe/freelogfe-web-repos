import * as React from 'react';
import styles from './index.less';
import FSiderLayout from '@/layouts/FSiderLayout';
import Sider from './Sider';
import NoContent from './NoContent';
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

interface NodeManagerProps extends RouterTypes {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

function NodeManager({dispatch, nodeManagerPage, match}: NodeManagerProps) {


  // React.useEffect(() => {
  //   console.log('NodeManager useEffect');
  // }, []);

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

  return (<FSiderLayout sider={<Sider/>}>
    {/*<NoContent/>*/}
    {
      nodeManagerPage.showTheme ?<Themes/>: <Exhibits/>
    }

  </FSiderLayout>);
}


export default connect(({nodeManagerPage}: ConnectState) => ({
  nodeManagerPage,
}))(withRouter(NodeManager));
