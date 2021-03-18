import * as React from 'react';
import styles from './index.less';
import {Checkbox, Space} from "antd";
import {connect, Dispatch} from "dva";
import {ConnectState, MarketResourcePageModelState} from "@/models/connect";
import {ChangeAction} from "@/models/marketResourcePage";

interface ContractsProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState;
}

function Contracts({dispatch, marketResourcePage}: ContractsProps) {

  // if (!marketResourcePage.signedNodeIDs.includes(marketResourcePage.selectedNodeID)) {
  //   return null;
  // }

  const contracts = marketResourcePage.signResources.find((r) => r.selected)?.contracts;


  if (!contracts || contracts.length === 0) {
    return null;
  }

  const isSignedNode: boolean = marketResourcePage.signedNodeIDs.includes(marketResourcePage.selectedNodeID);


  return (<div>
    <div className={styles.smallTitle}>{isSignedNode ? '当前合约' : '可复用的合约'}</div>
    <div style={{height: 5}}/>
    {
      contracts.map((c) => {
        return (<div key={c.id} className={styles.Contracts}>
          <div className={styles.contractTitle}>
            <Space size={5}>
              <span>{c.name}</span>
              <label className={styles.executing}>执行中</label>
            </Space>
            {
              !isSignedNode && (<Checkbox
                checked={c.checked}
                onChange={(e) => {
                  dispatch<ChangeAction>({
                    type: 'marketResourcePage/change',
                    payload: {
                      signResources: marketResourcePage.signResources.map((sr) => {
                        if (!sr.selected) {
                          return sr;
                        }
                        return {
                          ...sr,
                          contracts: sr.contracts.map((srp) => {
                            if (srp.id !== c.id) {
                              return srp;
                            }
                            return {
                              ...srp,
                              checked: e.target.checked,
                            }
                          }),
                        };
                      }),
                    }
                  });
                }}
              />)
            }
          </div>
          <div style={{height: 10}}/>
          <pre>{c.text}</pre>
          <div style={{height: 10}}/>
          <div className={styles.footer}>
            <Space size={0}>
              <div>合约ID：</div>
              <div>{c.id}</div>
            </Space>
            <div style={{height: 5}}/>
            <Space size={0}>
              <div>签约时间：</div>
              <div>{c.createTime}</div>
            </Space>
          </div>
          {/*<div style={{margin: '0 15px', borderTop: '1px solid #E5E7EB'}}/>*/}
          {/*<div>*/}

          {/*</div>*/}
        </div>);
      })
    }
  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(Contracts);
