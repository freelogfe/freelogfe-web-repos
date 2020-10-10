import * as React from 'react';
import styles from './index.less';
import {Dropdown, Menu, Space} from "antd";
import {FContentText} from "@/components/FText";
import {FDown} from "@/components/FIcons";
import {connect, Dispatch} from "dva";
import {ConnectState, MarketResourcePageState} from "@/models/connect";

interface NodeSelectorProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState;
}

function NodeSelector({dispatch, marketResourcePage}: NodeSelectorProps) {
  const selectedNode = marketResourcePage.allNodes.find((n) => n.id === marketResourcePage.selectedNode);

  return (<Dropdown overlay={(
    <Menu
      selectable={false}
      className={styles.Menu}
      mode="vertical"
    >
      {
        marketResourcePage.allNodes.map((n) => (<Menu.Item key={n.id} className={styles.MenuItem}>
          <Space size={10}>
            <span>{n.name}</span>
            {n.signed && (<span className={styles.contracted}>(已签约)</span>)}
          </Space>
        </Menu.Item>))
      }
    </Menu>
  )}>
    <div className={styles.nodeSelector}>
      <Space size={10}>
        <span className={styles.nodeSelectorLabel}>签约节点</span>
        <FContentText
          text={selectedNode?.name || ''}/>
        {selectedNode?.signed && (<span className={styles.contracted}>(已签约)</span>)}
      </Space>
      <FDown/>
    </div>
  </Dropdown>);
}

export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(NodeSelector);
