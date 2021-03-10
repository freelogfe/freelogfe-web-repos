import * as React from 'react';
import styles from './index.less';
import FMenu from "@/components/FMenu";
import {router} from "umi";
import {FPlus} from "@/components/FIcons";
import {FContentText} from "@/components/FText";
import {FNormalButton} from "@/components/FButton";
import {i18nMessage} from "@/utils/i18n";
import FDropdown from "@/components/FDropdown";
import {connect, Dispatch} from 'dva';
import {ConnectState, GlobalModelState, NodesModelState} from "@/models/connect";
import {nodeCreator, nodeManagement} from "@/utils/path-assembler";
import FNavLink from "@/layouts/FLayout/components/FNavLink";

interface NodeProps {
  dispatch: Dispatch;
  nodes: NodesModelState;
  global: GlobalModelState;
}

function Node({dispatch, nodes, global}: NodeProps) {

  const cRoute = global.routerHistories[global.routerHistories.length - 1];
  const isCurrent: boolean = /\/node\/(\d*)\/formal/.test(cRoute.pathname) || /\/node\/(\d*)\/informal/.test(cRoute.pathname);
  // console.log(isCurrent, 'isCurrent');
  // console.log(cRoute.pathname, 'cRoute.pathname');
  const nodeId: string | null = (cRoute.pathname.match(/\/node\/(\d*)\/formal/) || cRoute.pathname.match(/\/node\/(\d*)\/informal/) || [null, null])[1];

  function onClickNodes(value: string) {
    // return router.push('/node/' + value + '/formal');
    return router.push(nodeManagement({nodeID: Number(value)}));
  }

  return (<FDropdown
    // visible={true}
    overlay={nodes.list.length > 0 ? (<div>
      <FMenu
        value={nodeId || ''}
        onClick={onClickNodes}
        options={nodes.list.map((n) => ({
          text: n.nodeName,
          // value: n.nodeDomain,
          value: n.nodeId.toString(),
        }))}
      />
      <a
        href={nodeCreator()}
        className={styles.newButton}>
        <FPlus/>
      </a>
    </div>) : (<div className={styles.emptyDropdown}>
      <FContentText text={'自由创作从Freelog开始'}/>
      <div style={{height: 30}}/>
      <FNormalButton
        size="small"
        onClick={() => {
          // router.push('/node/creator');
          router.push(nodeCreator());
        }}
      >创建节点</FNormalButton>
    </div>)}>
    <FNavLink
      text={i18nMessage('node_manage')}
      to={nodes.list.length == 0 ? nodeCreator() : nodeManagement({nodeID: nodes.list[0].nodeId})}
      active={isCurrent}
    />
  </FDropdown>);
}

export default connect(({nodes, global}: ConnectState) => ({
  nodes,
  global,
}))(Node);
