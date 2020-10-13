import * as React from 'react';
import styles from './index.less';
import {Dropdown, Menu, Space} from "antd";
import {FContentText} from "@/components/FText";
import {FDown} from "@/components/FIcons";
import {connect, Dispatch} from "dva";
import {ConnectState, MarketResourcePageState, NodesModelState} from "@/models/connect";

interface NodeSelectorProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState;
  nodes: NodesModelState;
}

function NodeSelector({dispatch, marketResourcePage, nodes}: NodeSelectorProps) {
  const selectedNode = nodes.nodeList.find((n) => n.nodeDomain === marketResourcePage.selectedNodeDomain);

  return (<Dropdown overlay={(
    <Menu
      selectable={false}
      className={styles.Menu}
      mode="vertical"
    >
      {
        nodes.nodeList.map((n) => (<Menu.Item
          key={n.nodeId}
          className={styles.MenuItem}
        >
          <Space size={10}>
            <span>{n.nodeName}</span>
            {/*{n.signed && (<span className={styles.contracted}>(已签约)</span>)}*/}
          </Space>
        </Menu.Item>))
      }
    </Menu>
  )}>
    <div className={styles.nodeSelector}>
      <Space size={10}>
        <span className={styles.nodeSelectorLabel}>签约节点</span>
        <FContentText
          text={selectedNode?.nodeName || ''}/>
        {/*{selectedNode?.signed && (<span className={styles.contracted}>(已签约)</span>)}*/}
      </Space>
      <FDown/>
    </div>
  </Dropdown>);
}

export default connect(({marketResourcePage, nodes}: ConnectState) => ({marketResourcePage, nodes}))(NodeSelector);
