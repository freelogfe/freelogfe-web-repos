import * as React from 'react';
import styles from './index.less';
import {connect, Dispatch} from "dva";
import {ConnectState, ExhibitInfoPageModelState} from "@/models/connect";
import {FContentText, FTitleText} from "@/components/FText";
import {Space} from "antd";
import FContractStatusBadge from "@/components/FContractStatusBadge";
import FUtil1 from "@/utils";
import {FUtil} from '@freelog/tools-lib';
import FDivider from "@/components/FDivider";
import FSwitch from "@/components/FSwitch";
import { ChangeAction, FetchInfoAction, UpdateContractUsedAction } from '@/models/exhibitInfoPage';
import {FTextBtn} from "@/components/FButton";
import {FDown, FUp} from "@/components/FIcons";
import FContractDisplay from '@/components/FContractDisplay';

interface ContractProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Contract({dispatch, exhibitInfoPage}: ContractProps) {

  const selectedResource = exhibitInfoPage.associated.find((a) => a.id === exhibitInfoPage.selectedAssociatedID);

  async function onChange(payload: Partial<ExhibitInfoPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload: payload,
    });
  }

  return (<Space style={{width: '100%'}} size={15} direction="vertical">
    <FTitleText type="h4">{FUtil1.I18n.message('valid_contracts_list')}</FTitleText>
    {
      selectedResource?.contracts.map((c) => {
        const exhibitInfoExhibit = exhibitInfoPage.exhibitAllContractIDs.find((eac) => {
          return eac.exhibitID === exhibitInfoPage.pID && eac.resourceID === selectedResource.id;
        });
        return (<div
          key={c.id}
          className={styles.Contracts}
        >
          <div style={{height: 15}}/>
          <div className={styles.title}>
            <Space style={{padding: '0 20px'}} size={10}>
              <FContentText type="highlight" text={c.name}/>
              {/*<FContractStatusBadge*/}
              {/*  status={FUtil.Predefined.EnumContractStatus[c.status] as 'pending'}*/}
              {/*/>*/}
            </Space>
          </div>
          <div style={{height: 10}}/>

          <FContractDisplay
            containerHeight={300}
            contractID={c.id}
            onChangedEvent={() => {
              // dispatch<FetchInfoAction>({
              //   type: 'exhibitInfoPage/fetchInfo',
              // });
            }}
          />

          <div style={{height: 10}}/>
          <Space style={{padding: '0 20px'}} size={5}>
            <FContentText
              type="additional2"
              text={FUtil1.I18n.message('contract_id') + '：' + c.id}
            />
            <FDivider style={{fontSize: 14}}/>
            <FContentText
              type="additional2"
              text={FUtil1.I18n.message('contract_signed_time') + '：' + c.createTime}
            />
          </Space>
          <div style={{height: 10}}/>

          <div className={styles.footer}>
            <div className={styles.action}>
              <FContentText
                // text={exhibitInfoPage.pName}
                text={FUtil1.I18n.message('use_in_current_exhibit')}
                type="highlight"
              />
              <FSwitch
                checked={exhibitInfoExhibit?.contractIDs.includes(c.id)}
                disabled={exhibitInfoExhibit && (exhibitInfoExhibit.contractIDs.length <= 1) && exhibitInfoExhibit?.contractIDs.includes(c.id)}
                onChange={(value) => {
                  dispatch<UpdateContractUsedAction>({
                    type: 'exhibitInfoPage/updateContractUsed',
                    payload: {
                      exhibitID: exhibitInfoPage.pID,
                      resourceID: selectedResource.id,
                      policyID: c.policyId,
                      isUsed: value,
                    },
                  })
                }}
              />
            </div>

            {
              selectedResource.exhibits.length > 0 && (<>
                <div className={styles.otherTitle}>
                  <div style={{height: 10}}/>

                  <FTextBtn onClick={() => {
                    onChange({
                      associated: exhibitInfoPage.associated.map((asso) => {
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
                    <FTitleText type="h4">
                      <span>{FUtil1.I18n.message('use_for_exhibit')}</span>
                      &nbsp;
                      {
                        c.exhibitOpen
                          ? (<FUp/>)
                          : (<FDown/>)
                      }
                    </FTitleText>
                  </FTextBtn>
                </div>

                {
                  c.exhibitOpen
                    ? (<div className={styles.otherActions}>
                      {
                        selectedResource.exhibits.map((ex) => {
                          const currentExhibit = exhibitInfoPage.exhibitAllContractIDs.find((eac) => {
                            return eac.exhibitID === ex.id && eac.resourceID === selectedResource.id;
                          });
                          const currentExhibitChecked = currentExhibit?.contractIDs.includes(c.id);
                          return (<div key={ex.id} className={styles.otherAction}>
                            <FContentText
                              text={ex.name}
                              type="highlight"
                            />
                            <FSwitch
                              checked={currentExhibitChecked}
                              disabled={currentExhibitChecked && currentExhibit && (currentExhibit.contractIDs.length <= 1)}
                              onChange={(value) => {
                                dispatch<UpdateContractUsedAction>({
                                  type: 'exhibitInfoPage/updateContractUsed',
                                  payload: {
                                    exhibitID: ex.id,
                                    resourceID: selectedResource.id,
                                    policyID: c.policyId,
                                    isUsed: value,
                                  },
                                })
                              }}
                            />
                          </div>);
                        })
                      }
                    </div>)
                    : (<div style={{height: 12}}/>)
                }

              </>)
            }

          </div>
        </div>)
      })
    }
  </Space>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Contract);

// interface UsedSwitchDisabledParams {
//
// }
//
// function usedSwitchDisabled() {
//
// }
