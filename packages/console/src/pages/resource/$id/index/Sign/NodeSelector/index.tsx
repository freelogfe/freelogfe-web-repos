import * as React from 'react';
import styles from './index.less';
import {Dropdown, Menu, Space} from "antd";
import {FContentText} from "@/components/FText";
import {FDown} from "@/components/FIcons";
import {connect, Dispatch} from "dva";
import {ConnectState, MarketResourcePageState, NodesModelState} from "@/models/connect";
import {ChangeAction, OnChangeNodeSelectorAction} from "@/models/marketResourcePage";

interface NodeSelectorProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState;
  nodes: NodesModelState;
}

function NodeSelector({dispatch, marketResourcePage, nodes}: NodeSelectorProps) {
  const selectedNode = nodes.list.find((n) => n.nodeId === marketResourcePage.selectedNodeID);

  return (<Dropdown overlay={(
    <Menu
      selectable={false}
      className={styles.Menu}
      mode="vertical"
      onClick={(param: any) => dispatch<OnChangeNodeSelectorAction>({
          type: 'marketResourcePage/onChangeNodeSelector',
          payload: Number(param.key),
      })}
    >
      {
        nodes.list.map((n) => (<Menu.Item
          key={n.nodeId}
          className={styles.MenuItem}
        >
          <Space size={10}>
            <span>{n.nodeName}</span>
            {marketResourcePage.signedNodeIDs.includes(n.nodeId) && (<span className={styles.contracted}>(已签约)</span>)}
          </Space>
        </Menu.Item>))
      }
    </Menu>
  )}>
    <div className={styles.nodeSelector}>
      <Space size={10}>
        <span className={styles.nodeSelectorLabel}>签约节点</span>
        {
          selectedNode
            ? (<FContentText
              text={selectedNode.nodeName}/>)
            : (<FContentText
              type="negative"
              text={'选择签约的节点…'}/>)
        }
        {marketResourcePage.signedNodeIDs.includes(marketResourcePage.selectedNodeID || -1) && (
          <span className={styles.contracted}>(已签约)</span>)}
      </Space>
      <FDown/>
    </div>
  </Dropdown>);
}

export default connect(({marketResourcePage, nodes}: ConnectState) => ({
  marketResourcePage,
  nodes
}))(NodeSelector);
