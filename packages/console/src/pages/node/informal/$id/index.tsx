import * as React from 'react';
import styles from './index.less';
import { withRouter } from 'umi';
import Sider from './Sider';
import Exhibit from './Exhibit';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import {
  OnChangePageAction,
  OnMountPageAction,
  OnUnmountPageAction,
} from '@/models/informalNodeManagerPage';
import { ConnectState, InformalNodeManagerPageModelState } from '@/models/connect';
import Theme from './Theme';
import MappingRule from './MappingRule';
import { RouteComponentProps } from 'react-router';
import { FUtil } from '@freelog/tools-lib';
import useUrlState from '@ahooksjs/use-url-state';
import FReplaceModal from './containers/FReplaceModal';
import * as AHooks from 'ahooks';
import FComponentsLib from '@freelog/components-lib';

interface InformalNodeProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function InformalNode({ match, dispatch, informalNodeManagerPage }: InformalNodeProps) {

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'informalNodeManagerPage/onMountPage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'informalNodeManagerPage/onUnmountPage',
    });
  });

  const [{ showPage }] = useUrlState<{ showPage: 'exhibit' | 'theme' | 'mappingRule' }>();

  React.useEffect(() => {
    // console.log(showPage, 'showPage093lkjladsf');
    dispatch<OnChangePageAction>({
      type: 'informalNodeManagerPage/onChangePage',
      payload: {
        value: showPage,
      },
    });
  }, [showPage]);

  return (<>


    <div>
      <div className={styles.headerTip}>
        <span>这里是测试节点管理页面，如需管理正式节点，你可以</span>
        &nbsp;
        {/*<FLink to={FUtil.LinkTo.nodeManagement({nodeID: Number(match.params.id)})}> 进入正式节点</FLink></div>*/}
        <FComponentsLib.FTextBtn
          type='primary'
          style={{ fontSize: 12 }}
          onClick={() => {
            window.open(FUtil.LinkTo.nodeManagement({ nodeID: Number(match.params.id) }));
          }}
        >进入正式节点</FComponentsLib.FTextBtn>
      </div>
      <div style={{ height: 24 }} />
      <div style={{ minHeight: 'calc(100vh - 94px)' }} className={styles.container}>
        <div className={styles.sider}>
          <Sider />
        </div>

        <div className={styles.content}>
          {informalNodeManagerPage.showPage === 'exhibit' && <Exhibit />}
          {informalNodeManagerPage.showPage === 'theme' && <Theme />}
          {informalNodeManagerPage.showPage === 'mappingRule' && <MappingRule />}
          <div style={{ height: 100 }} />
        </div>
      </div>
    </div>

    <FReplaceModal />
  </>);
}

export default withRouter(connect(({ informalNodeManagerPage }: ConnectState) => ({
  informalNodeManagerPage,
}))(InformalNode));
