import * as React from 'react';
import styles from './index.less';
import { Checkbox, Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceDetailPageModelState } from '@/models/connect';
import { ChangeAction } from '@/models/resourceDetailPage';
import { FUtil } from '@freelog/tools-lib';
import FContractDisplay from '@/components/FContractDisplay';
// import FTerminatedContractListDrawer from '@/components/FTerminatedContractListDrawer';
import FComponentsLib from '@freelog/components-lib';
import fViewTerminatedContracts from '@/components/fViewTerminatedContracts';

interface ContractsProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState;
}

function Contracts({ dispatch, resourceDetailPage }: ContractsProps) {
  // const [terminatedContractIDs, set_TerminatedContractIDs] = React.useState<string[]>([]);

  const selectedResource = resourceDetailPage.sign_SignResources.find((r) => r.selected);
  const contracts = selectedResource?.contracts;

  if (!contracts || contracts.length === 0) {
    return null;
  }

  const isSignedNode: boolean = resourceDetailPage.sign_SignedNodeIDs.includes(resourceDetailPage.sign_SelectedNodeID);

  return (<div>
    <div className={styles.smallTitle}>{isSignedNode ? '当前合约' : '可复用的合约'}</div>
    <div style={{ height: 5 }} />
    {
      contracts.map((c) => {
        return (<div key={c.id} className={styles.Contracts}>
          <div style={{ height: 15 }} />
          <div className={styles.contractTitle}>
            <FComponentsLib.FContentText text={c.name} type='highlight' />
            {
              !isSignedNode && (<Checkbox
                checked={c.checked}
                onChange={(e) => {
                  dispatch<ChangeAction>({
                    type: 'resourceDetailPage/change',
                    payload: {
                      sign_SignResources: resourceDetailPage.sign_SignResources.map((sr) => {
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
                            };
                          }),
                        };
                      }),
                    },
                  });
                }}
              />)
            }
          </div>
          <div style={{ height: 10 }} />
          {/*<pre>{c.text}</pre>*/}
          <div style={{ padding: '0 15px' }}>
            <FContractDisplay contractID={c.id} />
          </div>
          {/*<div style={{height: 10}}/>*/}
          <div className={styles.footer}>
            <Space size={0}>
              <div>合约ID：</div>
              <div>{c.id}</div>
            </Space>
            <div style={{ height: 5 }} />
            <Space size={0}>
              <div>签约时间：</div>
              <div>{c.createTime}</div>
            </Space>
          </div>

          <div className={styles.exhibit}>
            {/*<div style={{borderTop: '1px solid #E5E7EB'}}/>*/}
            <div style={{ height: 10 }} />
            <div>当前合约在此节点上存在 <span style={{ color: '#2784FF' }}>{c.exhibits.length}</span> 次复用：</div>
            <div style={{ height: 8 }} />
            <Space size={5} direction='vertical' style={{ width: '100%' }}>
              {
                c.exhibits.map((et) => {
                  return (<Space key={et.exhibitID} size={2} style={{ display: 'flex', alignItems: 'center' }}>
                    <div>展品</div>
                    <FComponentsLib.FTextBtn
                      style={{
                        fontSize: 12,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        maxWidth: 200,
                        display: 'block',
                      }}
                      onClick={() => {
                        window.open(FUtil.LinkTo.exhibitManagement({
                          exhibitID: et.exhibitID,
                        }));
                      }}
                    >{et.exhibitName}</FComponentsLib.FTextBtn>
                    <div>的授权链；</div>
                  </Space>);
                })
              }
            </Space>
            <div style={{ height: 10 }} />
          </div>
        </div>);
      })
    }

    {
      selectedResource && selectedResource.terminatedContractIDs.length > 0 && (<div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/*<FContentText text={'查看已终止的合约请移至'} type='negative' />*/}
          <FComponentsLib.FTextBtn onClick={async () => {
            // window.open(`${FUtil.Format.completeUrlByDomain('user')}${FUtil.LinkTo.contract()}`);
            // set_TerminatedContractIDs(selectedResource.terminatedContractIDs);
            await fViewTerminatedContracts({
              terminatedContractIDs: selectedResource.terminatedContractIDs,
            });
          }}>查看已终止合约</FComponentsLib.FTextBtn>
        </div>
        <div style={{ height: 25 }} />
      </div>)
    }

    {/*<FTerminatedContractListDrawer*/}
    {/*  terminatedContractIDs={terminatedContractIDs}*/}
    {/*  onClose={() => {*/}
    {/*    set_TerminatedContractIDs([]);*/}
    {/*  }}*/}
    {/*/>*/}
  </div>);
}

export default connect(({ resourceDetailPage }: ConnectState) => ({ resourceDetailPage }))(Contracts);
