import * as React from 'react';
import styles from './index.less';
import {router, withRouter} from "umi";
import Sider from './Sider';
import Exhibit from './Exhibit';
import {nodeManagement} from "@/utils/path-assembler";
import {connect, Dispatch} from "dva";
import {InformalNodeManagerPageModelState} from "@/models/informalNodeManagerPage";
import {ConnectState} from "@/models/connect";
import Theme from "./Theme";
import MappingRule from "./MappingRule";

interface InformalNodeProps {
  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
  match: {
    params: {
      id: string;
    }
  }
}


function InformalNode({match, dispatch, informalNodeManagerPage}: InformalNodeProps) {

  return (<div>
    <div className={styles.headerTip}>这里是测试节点管理页面，如需管理正式节点，你可以 <a onClick={() => {
      // router.push(`/node/${match.params.id}/formal`);
      router.push(nodeManagement({nodeID: Number(match.params.id)}));
    }}>进入正式节点</a></div>
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
