import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import { Space } from 'antd';
import FDivider from '@/components/FDivider';
import FSwitch from '@/components/FSwitch';
import { ChangeAction, FetchInfoAction, UpdateContractUsedAction } from '@/models/exhibitInfoPage';
// import { FDown, FUp } from '@/components/FIcons';
import FContractDisplay from '@/components/FContractDisplay';
import FResourceContractPanelNoContractTip from '@/components/FResourceContractPanelNoContractTip';
// import FTerminatedContractListDrawer from '@/components/FTerminatedContractListDrawer';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import fViewTerminatedContracts from '@/components/fViewTerminatedContracts';

interface ContractProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Contract({ dispatch, exhibitInfoPage }: ContractProps) {
  // const [terminatedContractIDs, set_TerminatedContractIDs] = React.useState<string[]>([]);
  const selectedResource = exhibitInfoPage.contract_Associated.find((a) => a.id === exhibitInfoPage.contract_SelectedAssociatedID);

  async function onChange(payload: Partial<ExhibitInfoPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload: payload,
    });
  }

  return (<div>
    {
      selectedResource?.contracts && selectedResource?.contracts.length > 0 ? (<>
          <FComponentsLib.FTitleText type='h4'>{FI18n.i18nNext.t('valid_contracts_list')}</FComponentsLib.FTitleText>
          <div style={{ height: 5 }} />
          <Space style={{ width: '100%' }} size={15} direction='vertical'>
            {
              selectedResource?.contracts.map((c) => {
                const exhibitInfoExhibit = exhibitInfoPage.contract_ExhibitAllContractIDs.find((eac) => {
                  return eac.exhibitID === exhibitInfoPage.exhibit_ID && eac.resourceID === selectedResource.id;
                });
                return (<div
                  key={c.id}
                  className={styles.Contracts}
                >
                  <div style={{ height: 10 }} />
                  <Space style={{ padding: '0 20px' }} size={10}>
                    <FComponentsLib.FContentText type='highlight' text={c.name} />
                  </Space>
                  <div style={{ height: 10 }} />

                  <div style={{ padding: '0 20px' }}>
                    <FContractDisplay
                      contractID={c.id}
                      onChangedEvent={() => {
                        dispatch<FetchInfoAction>({
                          type: 'exhibitInfoPage/fetchInfo',
                        });
                      }}
                    />
                  </div>

                  <div style={{ height: 10 }} />
                  <Space style={{ padding: '0 20px' }} size={5}>
                    <FComponentsLib.FContentText
                      type='additional2'
                      text={FI18n.i18nNext.t('contract_id') + '：' + c.id}
                    />
                    <FDivider style={{ fontSize: 14 }} />
                    <FComponentsLib.FContentText
                      type='additional2'
                      text={FI18n.i18nNext.t('contract_signed_time') + '：' + c.createTime}
                    />
                  </Space>
                  <div style={{ height: 10 }} />

                  <div className={styles.footer}>
                    <div className={styles.action}>
                      <FComponentsLib.FContentText
                        // text={exhibitInfoPage.pName}
                        text={FI18n.i18nNext.t('use_in_current_exhibit')}
                        type='highlight'
                      />
                      <FSwitch
                        checked={exhibitInfoExhibit?.contractIDs.includes(c.id)}
                        disabled={exhibitInfoExhibit && (exhibitInfoExhibit.contractIDs.length <= 1) && exhibitInfoExhibit?.contractIDs.includes(c.id)}
                        onChange={async (value) => {
                          await dispatch<UpdateContractUsedAction>({
                            type: 'exhibitInfoPage/updateContractUsed',
                            payload: {
                              exhibitID: exhibitInfoPage.exhibit_ID,
                              resourceID: selectedResource.id,
                              policyID: c.policyId,
                              isUsed: value,
                            },
                          });
                          await dispatch<FetchInfoAction>({
                            type: 'exhibitInfoPage/fetchInfo',
                          });
                        }}
                      />
                    </div>

                    {
                      selectedResource.exhibits.length > 0 && (<>
                        <div className={styles.otherTitle}>
                          <div style={{ height: 10 }} />

                          <FComponentsLib.FTextBtn onClick={() => {
                            onChange({
                              contract_Associated: exhibitInfoPage.contract_Associated.map((asso) => {
                                if (asso.id !== selectedResource.id) {
                                  return asso;
                                }
                                return {
                                  ...asso,
                                  contracts: asso.contracts.map((assoct) => {
                                    if (assoct.id !== c.id) {
                                      return assoct;
                                    }
                                    return {
                                      ...assoct,
                                      exhibitOpen: !assoct.exhibitOpen,
                                    };
                                  }),
                                };
                              }),
                            });
                          }}>
                            <FComponentsLib.FTitleText type='h4'>
                              <span>{FI18n.i18nNext.t('use_for_exhibit')}</span>
                              &nbsp;
                              {
                                c.exhibitOpen
                                  ? (<FComponentsLib.FIcons.FUp />)
                                  : (<FComponentsLib.FIcons.FDown />)
                              }
                            </FComponentsLib.FTitleText>
                          </FComponentsLib.FTextBtn>
                        </div>

                        {
                          c.exhibitOpen
                            ? (<div className={styles.otherActions}>
                              {
                                selectedResource.exhibits.map((ex) => {
                                  const currentExhibit = exhibitInfoPage.contract_ExhibitAllContractIDs.find((eac) => {
                                    return eac.exhibitID === ex.id && eac.resourceID === selectedResource.id;
                                  });
                                  const currentExhibitChecked = currentExhibit?.contractIDs.includes(c.id);
                                  return (<div key={ex.id} className={styles.otherAction}>
                                    <FComponentsLib.FContentText
                                      text={ex.name}
                                      type='highlight'
                                    />
                                    <FSwitch
                                      checked={currentExhibitChecked}
                                      disabled={currentExhibitChecked && currentExhibit && (currentExhibit.contractIDs.length <= 1)}
                                      onChange={async (value) => {
                                        await dispatch<UpdateContractUsedAction>({
                                          type: 'exhibitInfoPage/updateContractUsed',
                                          payload: {
                                            exhibitID: ex.id,
                                            resourceID: selectedResource.id,
                                            policyID: c.policyId,
                                            isUsed: value,
                                          },
                                        });

                                        await dispatch<FetchInfoAction>({
                                          type: 'exhibitInfoPage/fetchInfo',
                                        });
                                      }}
                                    />
                                  </div>);
                                })
                              }
                            </div>)
                            : (<div style={{ height: 12 }} />)
                        }

                      </>)
                    }

                  </div>
                </div>);
              })
            }
          </Space>
        </>)
        : (<FResourceContractPanelNoContractTip />)
    }


    {
      selectedResource && selectedResource.terminatedContractIDs.length > 0 && (<>
        <div style={{ height: 15 }} />

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/*<FContentText text={'查看已终止的合约请移至'} type='negative' />*/}
          <FComponentsLib.FTextBtn onClick={async () => {
            // set_TerminatedContractIDs(selectedResource.terminatedContractIDs);
            // window.open(`${FUtil.Format.completeUrlByDomain('user')}${FUtil.LinkTo.contract()}`);
            await fViewTerminatedContracts({
              terminatedContractIDs: selectedResource.terminatedContractIDs,
            });
          }}>查看已终止合约</FComponentsLib.FTextBtn>
        </div>
      </>)
    }

    {/*<FTerminatedContractListDrawer*/}
    {/*  terminatedContractIDs={terminatedContractIDs}*/}
    {/*  onClose={() => {*/}
    {/*    set_TerminatedContractIDs([]);*/}
    {/*  }}*/}
    {/*/>*/}

  </div>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Contract);

