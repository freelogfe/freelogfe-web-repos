import * as React from 'react';
import styles from './index.less';
import {Checkbox, Space} from "antd";
import {connect, Dispatch} from "dva";
import {ConnectState, MarketResourcePageModelState} from "@/models/connect";
import {ChangeAction} from "@/models/marketResourcePage";
import {FContentText} from '@/components/FText';

interface PoliciesProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState;
}

function Policies({dispatch, marketResourcePage}: PoliciesProps) {

  const policies = marketResourcePage.signResources.find((r) => r.selected)?.policies;

  // console.log(policies, 'policies@#$rsafd980judsafsad');

  if (!policies || policies.filter((p) => p.status !== 0).length === 0) {
    return null;
  }

  const isSignedNode: boolean = marketResourcePage.signedNodeIDs.includes(marketResourcePage.selectedNodeID);

  return (<div>
    <div className={styles.smallTitle}>{isSignedNode ? '未签约策略' : '可进行签约的策略'}</div>
    <div style={{height: 5}}/>
    {
      policies.filter((p) => p.status !== 0).map((p) => {
        return (<div
          className={styles.singPolicy}
          key={p.id}
        >
          <div className={styles.singPolicyTitle}>
            <div>{p.name}</div>

            {
              !isSignedNode && (<Checkbox
                checked={p.checked}
                disabled={p.status === 0}
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
                          policies: sr.policies.map((srp) => {
                            if (srp.id !== p.id) {
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
          <pre>{p.text}</pre>
        </div>);
      })
    }
  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({marketResourcePage}))(Policies);
