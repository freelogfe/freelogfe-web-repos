import * as React from 'react';
import styles from './index.less';
import {Checkbox, Space} from "antd";
import {connect, Dispatch} from "dva";
import {ConnectState, MarketResourcePageState} from "@/models/connect";

interface ContractsProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState;
}

function Contracts({dispatch, marketResourcePage}: ContractsProps) {
  const contracts = marketResourcePage.signResources.find((r) => r.checked)?.contracts;
  if (!contracts) {
    return null;
  }
  return (<div>
    {
      contracts.map((c) => (<div key={c.id} className={styles.Contracts}>
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
  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(Contracts);
