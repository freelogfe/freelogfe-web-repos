import * as React from 'react';
import styles from './index.less';
import FMenu from "@/components/FMenu";
import {router} from "umi";
import {FPlus} from "@/components/FIcons";
import {FContentText} from "@/components/FText";
import {FRectBtn} from "@/components/FButton";
import FDropdown from "@/components/FDropdown";
import {connect, Dispatch} from 'dva';
import {ConnectState, GlobalModelState, NodesModelState} from "@/models/connect";
import FNavLink from "@/layouts/FLayout/components/FNavLink";
import FUtil1 from "@/utils";
import {FUtil} from '@freelog/tools-lib';

interface NodeProps {
  dispatch: Dispatch;
  nodes: NodesModelState;
  router: {
    location: Location;
  };
}

function Node({dispatch, nodes, router: routerObj}: NodeProps) {
  // console.log(routerObj, 'nnnnNNNNNNNNNnnnnnnnnnNNNNNNNooooijsodfjlkdsjf');
  // const cRoute = global.routerHistories[global.routerHistories.length - 1];
  const isCurrent: boolean = /\/node\/formal\/(\d*)/.test(routerObj.location.pathname) || /\/node\/informal\/(\d*)/.test(routerObj.location.pathname);
  // console.log(isCurrent, 'isCurrent');
  // console.log(cRoute.pathname, 'cRoute.pathname');
  const nodeId: string | null = (routerObj.location.pathname.match(/\/node\/formal\/(\d*)/) || routerObj.location.pathname.match(/\/node\/informal\/(\d*)/) || [null, null])[1];

  function onClickNodes(value: string) {
    // console.log(value, '!@#$!@#$!@#$');
    return router.push(FUtil.LinkTo.nodeManagement({nodeID: Number(value)}));
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
        href={FUtil.LinkTo.nodeCreator()}
        className={styles.newButton}>
        <FPlus style={{fontSize: 14}}/>
      </a>
    </div>) : (<div className={styles.emptyDropdown}>
      <FContentText text={'自由创作从Freelog开始'}/>
      <div style={{height: 30}}/>
      <FRectBtn
        size="small"
        onClick={() => {
          router.push(FUtil.LinkTo.nodeCreator());
        }}
        type="primary"
      >创建节点</FRectBtn>
    </div>)}>
    <FNavLink
      text={FUtil1.I18n.message('node_manage')}
      to={nodes.list.length == 0 ? FUtil.LinkTo.nodeCreator() : FUtil.LinkTo.nodeManagement({nodeID: nodes.list[0].nodeId})}
      active={isCurrent}
    />
  </FDropdown>);
}

export default connect(({nodes, router}: ConnectState) => ({
  nodes,
  router,
}))(Node);
