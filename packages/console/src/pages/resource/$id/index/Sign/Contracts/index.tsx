import * as React from 'react';
import styles from './index.less';
import {Checkbox, Space} from "antd";
import {connect, Dispatch} from "dva";
import {ConnectState, MarketResourcePageState} from "@/models/connect";
import {ChangeAction} from "@/models/marketResourcePage";

interface ContractsProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState;
}

function Contracts({dispatch, marketResourcePage}: ContractsProps) {

  if (!marketResourcePage.signedNodeIDs.includes(marketResourcePage.selectedNodeID)) {
    return null;
  }

  const resource = marketResourcePage.signedResources?.find((r) => r.selected);
  return (<div>
    <div className={styles.smallTitle}>当前合约</div>
    <div style={{height: 5}}/>
    {
      resource?.contracts.map((c) => (<div key={c.id} className={styles.Contracts}>
        <div className={styles.content}>
          <Space size={5}>
            <span>{c.name}</span>
            <label className={styles.executing}>执行中</label>
          </Space>
          <div style={{height: 10}}/>
          <pre>{c.text}</pre>
          <div style={{height: 10}}/>
        </div>
        <div className={styles.footer}>
          <div>
            <div>合约ID</div>
            <div>{c.id}</div>
          </div>
          <div>
            <div>签约时间</div>
            <div>{c.createTime}</div>
          </div>
        </div>
      </div>))
    }

    {
      (resource?.policies.length || 0) > 0 && (<>
        <div className={styles.smallTitle}>未签约策略</div>
        <div style={{height: 5}}/>
        {
          resource?.policies.map((p) => (<div
            className={styles.singPolicy}
            key={p.id}
          >
            <span>{p.name}</span>
            <div style={{height: 15}}/>
            <pre>{p.text}</pre>
          </div>))
        }
      </>)
    }

  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(Contracts);
