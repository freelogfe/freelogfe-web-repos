import * as React from 'react';
import styles from './index.less';
import Exhibits from './Exhibits';
import Themes from './Themes';
import { withRouter } from 'umi';
import { Dispatch, connect } from 'dva';
import {
  OnChange_ShowPage_Action,
  OnMount_Page_Action,
  OnUnmount_Page_Action,
} from '@/models/nodeManagerPage';
import { ConnectState, NodeManagerModelState } from '@/models/connect';
import { RouteComponentProps } from 'react-router';
import * as AHooks from 'ahooks';
import FLoadingTip from '@/components/FLoadingTip';
import { Helmet } from 'react-helmet';
import useUrlState from '@ahooksjs/use-url-state';

interface NodeManagerProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

function NodeManager({ dispatch, nodeManagerPage, match }: NodeManagerProps) {
  AHooks.useMount(() => {
    // dispatch<OnMount_Page_Action>({
    //   type: 'nodeManagerPage/onMount_Page',
    //   payload: {
    //     nodeID: Number(match.params.id),
    //   },
    // });
  });

  AHooks.useUnmount(() => {
    // dispatch<OnUnmount_Page_Action>({
    //   type: 'nodeManagerPage/onUnmount_Page',
    // });
  });

  const [{ showPage }] = useUrlState<{ showPage: 'exhibit' | 'theme' | 'mappingRule' }>();

  React.useEffect(() => {
    dispatch<OnChange_ShowPage_Action>({
      type: 'nodeManagerPage/onChange_ShowPage',
      payload: {
        value: showPage,
      },
    });
    dispatch<OnMount_Page_Action>({
      type: 'nodeManagerPage/onMount_Page',
      payload: {
        nodeID: Number(match.params.id),
      },
    });
    return () => {
      dispatch<OnUnmount_Page_Action>({
        type: 'nodeManagerPage/onUnmount_Page',
      });
    };
  }, [match.params.id]);

  // React.useEffect(() => {
  //
  //   dispatch<ChangeAction>({
  //     type: 'nodeManagerPage/change',
  //     payload: {
  //       nodeId: Number(match.params.id),
  //     },
  //   });
  //
  //   dispatch<FetchNodeInfoAction>({
  //     type: 'nodeManagerPage/fetchNodeInfo',
  //   });
  //
  //   dispatch<FetchExhibitsAction>({
  //     type: 'nodeManagerPage/fetchExhibits',
  //   });
  //
  //   dispatch<FetchThemesAction>({
  //     type: 'nodeManagerPage/fetchThemes',
  //   });
  //
  // }, [match.params.id]);

  // React.useEffect(() => {
  //   return () => {
  //     dispatch<ChangeAction>({
  //       type: 'nodeManagerPage/change',
  //       payload: nodeManagerInitData,
  //     });
  //   };
  // }, []);

  if (nodeManagerPage.nodeInfoState === 'loading' || !nodeManagerPage.listFirstLoaded) {
    return <FLoadingTip height={'calc(100vh - 70px)'} />;
  }

  return <>{nodeManagerPage.showPage === 'theme' ? <Themes /> : <Exhibits />}</>;
}

export default connect(({ nodeManagerPage, nodes }: ConnectState) => ({
  nodeManagerPage,
  nodes,
}))(withRouter(NodeManager));
