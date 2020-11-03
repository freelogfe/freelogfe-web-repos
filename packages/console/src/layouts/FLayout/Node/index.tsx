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
import {ConnectState, NodesModelState} from "@/models/connect";
import Nav from "../components/Nav";

interface NodeProps {
  nodes: NodesModelState;
}

function Node({nodes}: NodeProps) {

  function onClickNodes(value: string) {
    return router.push('/node/' + value);
  }

  return (<FDropdown
    // visible={true}
    overlay={nodes.list.length > 0 ? (<div>
      <FMenu
        onClick={onClickNodes}
        options={nodes.list.map((n) => ({
          text: n.nodeName,
          // value: n.nodeDomain,
          value: n.nodeId.toString(),
        }))}
      />
      <a
        onClick={() => router.push('/node/creator')}
        className={styles.newButton}>
        <FPlus/>
      </a>
    </div>) : (<div className={styles.emptyDropdown}>
      <FContentText text={'自由创作从Freelog开始'}/>
      <div style={{height: 30}}/>
      <FNormalButton size="small">创建节点</FNormalButton>
    </div>)}>
    <Nav onClick={() => null} active={false}>{i18nMessage('node_manage')}</Nav>
  </FDropdown>);
}

export default connect(({nodes}:ConnectState) => ({
  nodes,
}))(Node);
