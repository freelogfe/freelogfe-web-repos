import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, NodeManagerModelState } from '@/models/connect';
import { Helmet } from 'react-helmet';
import { Dispatch } from 'redux';
import Sider from '@/pages/node/formal/$id/Sider';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';

interface SettingProps {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

function Setting({ nodeManagerPage }: SettingProps) {
  return (<>
    <Helmet>
      <title>{`节点设置 · ${nodeManagerPage.nodeName} - Freelog`}</title>
    </Helmet>

    <FLeftSiderLayout
      // header={''}
      sider={<Sider />}
      type='empty'
    >
    </FLeftSiderLayout>
  </>);
}

export default connect(({ nodeManagerPage }: ConnectState) => ({
  nodeManagerPage,
}))(Setting);
