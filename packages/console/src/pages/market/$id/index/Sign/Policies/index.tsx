import * as React from 'react';
import styles from './index.less';
import {Checkbox, Space} from "antd";
import {connect, Dispatch} from "dva";
import {ConnectState, MarketResourcePageState} from "@/models/connect";

interface PoliciesProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState;
}

function Policies({marketResourcePage}: PoliciesProps) {

  const policies = marketResourcePage.signResources.find((r) => r.checked)?.policies;
  if (!policies) {
    return null;
  }
  return (<div>
    {
      policies.map((p) => (<div
        className={styles.singPolicy}
        key={p.id}
      >
        <Space size={5}>
          <Checkbox
            checked={p.checked}
          />
          <span>{p.name}</span>
        </Space>
        <div style={{height: 15}}/>
        <pre>{p.text}</pre>
      </div>))
    }
  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(Policies);
