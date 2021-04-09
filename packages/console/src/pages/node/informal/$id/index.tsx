import * as React from 'react';
import styles from './index.less';
import {router, withRouter} from "umi";
import Sider from './Sider';
import Exhibit from './Exhibit';
import {connect, Dispatch} from "dva";
import {
  InformalNodeManagerPageModelState,
} from "@/models/informalNodeManagerPage";
import {ConnectState} from "@/models/connect";
import Theme from "./Theme";
import MappingRule from "./MappingRule";
import {RouteComponentProps} from "react-router";
import FLink from "@/components/FLink";
import FUtil from "@/utils";

interface InformalNodeProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function InformalNode({match, dispatch, informalNodeManagerPage}: InformalNodeProps) {

  React.useEffect(() => {
    // initData();
  }, []);

  return (<div>
    <div className={styles.headerTip}>
      <span>这里是测试节点管理页面，如需管理正式节点，你可以 </span>
      <FLink to={FUtil.LinkTo.nodeManagement({nodeID: Number(match.params.id)})}> 进入正式节点</FLink></div>
    <div style={{height: 24}}/>
    <div style={{minHeight: 'calc(100vh - 94px)'}} className={styles.container}>
      <div className={styles.sider}>
        <Sider/>
      </div>

      <div className={styles.content}>
        {informalNodeManagerPage.showPage === 'exhibit' && <Exhibit/>}
        {informalNodeManagerPage.showPage === 'theme' && <Theme/>}
        {informalNodeManagerPage.showPage === 'mappingRule' && <MappingRule/>}
        <div style={{height: 100}}/>
      </div>
    </div>
  </div>);
}

export default withRouter(connect(({informalNodeManagerPage}: ConnectState) => ({
  informalNodeManagerPage,
}))(InformalNode));
