import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import {FTextBtn} from '@/components/FButton';
import {Space} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, ExhibitInfoPageModelState} from "@/models/connect";
import {ChangeAction} from "@/models/exhibitInfoPage";
import FUtil from "@/utils";
import FContractStatusBadge from "@/components/FContractStatusBadge";
import FDivider from "@/components/FDivider";
import FSwitch from "@/components/FSwitch";
import {FDown, FUp} from "@/components/FIcons";

interface ContractsProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Contracts({dispatch, exhibitInfoPage}: ContractsProps) {

  if (exhibitInfoPage.associated.length === 0) {
    return null;
  }

  const [mainResource, ...otherResource] = exhibitInfoPage.associated;

  const selectedResource = exhibitInfoPage.associated.find((a) => a.selected);

  // console.log(mainResource, 'mainResource9032jhf');

  function onChangeSelect(id: string) {
    onChange({
      associated: exhibitInfoPage.associated.map((a) => ({
        ...a,
        selected: a.id === id
      })),
    });
  }

  async function onChange(payload: Partial<ExhibitInfoPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload: payload,
    });
  }

  return (<div>
    <FTitleText text={'关联合约'} type="h3"/>

    <div style={{height: 20}}/>

    <div className={styles.sign}>
      <div className={styles.signLeft}>
        <FTitleText type="h4">主资源</FTitleText>

        <a
          className={styles.signResource + ' ' + (mainResource.selected ? styles.activatedSignResource : '')}
          onClick={() => onChangeSelect(mainResource.id)}
        >
          <FTextBtn
            onClick={(e) => {
              e.stopPropagation();
              window.open(FUtil.LinkTo.resourceDetails({
                resourceID: mainResource.id,
              }));
            }}
          >
            <FContentText
              type="highlight"
              text={mainResource.name}
              singleRow
              className={styles.FContentText}
            />
          </FTextBtn>
          <div style={{height: 5}}/>
          <FContentText
            type="additional2"
            text={mainResource.type}
          />
          <div style={{height: 5}}/>
          <div className={styles.policeTags}>
            {
              mainResource.contracts.map((c) => (<label key={c.id}>{c.name}</label>))
            }
          </div>
        </a>

        {
          otherResource.length > 0 && (<FTitleText type="h4">基础上抛</FTitleText>)
        }

        {
          otherResource.map((r) => (<a
            className={styles.signResource + ' ' + (r.selected ? styles.activatedSignResource : '')}
            onClick={() => onChangeSelect(r.id)}
            key={r.id}
          >
            <FTextBtn
              onClick={(e) => {
                e.stopPropagation();
                window.open(FUtil.LinkTo.resourceDetails({
                  resourceID: r.id,
                }));
              }}
            >
              <FContentText
                type="highlight"
                text={r.name}
                singleRow
                className={styles.FContentText}
              />
            </FTextBtn>
            <div style={{height: 5}}/>
            <FContentText
              type="additional2"
              text={r.type}
            />
            <div style={{height: 5}}/>
            <div className={styles.policeTags}>
              {
                r.contracts.map((c) => (<label key={c.id}>{c.name}</label>))
              }
            </div>
          </a>))
        }
      </div>

      <div className={styles.signRight}>
        <Space style={{width: '100%'}} size={15} direction="vertical">
          <FTitleText type="h4">当前合约</FTitleText>
          {
            selectedResource?.contracts.map((c) => (<div
              key={c.id}
              className={styles.Contracts}
            >
              <div style={{height: 15}}/>
              <div className={styles.title}>
                <Space style={{padding: '0 20px'}} size={10}>
                  <FContentText type="highlight" text={c.name}/>
                  <FContractStatusBadge
                    status={FUtil.Predefined.EnumContractStatus[c.status] as 'pending'}
                  />
                </Space>
                <div style={{height: 10}}/>
                <Space style={{padding: '0 20px'}} size={2}>
                  <FContentText
                    type="additional2"
                    text={FUtil.I18n.message('contract_id') + '：' + c.id}
                  />
                  <FDivider style={{fontSize: 14}}/>
                  <FContentText
                    type="additional2"
                    text={FUtil.I18n.message('contract_signed_time') + '：' + c.createTime}
                  />
                </Space>
                <div style={{height: 15}}/>
              </div>
              <div className={styles.content}>
                <pre>{c.text}</pre>
              </div>

              <div className={styles.footer}>
                <div className={styles.action}>
                  <FContentText
                    text={exhibitInfoPage.pName}
                    type="highlight"
                  />
                  <FSwitch checked={true}/>
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
                          <span>当前合约在此节点中被其他展品应用</span>
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
                              return (<div key={ex.id} className={styles.otherAction}>
                                <FContentText text={ex.name} type="highlight"/>
                                <FSwitch checked={true}/>
                              </div>);
                            })
                          }
                        </div>)
                        : (<div style={{height: 12}}/>)
                    }

                  </>)
                }

              </div>
            </div>))
          }

          {
            selectedResource?.policies && selectedResource?.policies.length > 0 &&
            (<>
              <FTitleText type="h4">未签约策略</FTitleText>
              {
                selectedResource?.policies.map((p) => (<div
                  className={styles.singPolicy}
                  key={p.id}
                >
                  <div className={styles.singPolicyHeader}>
                    <span>{p.name}</span>
                    {/*<a*/}
                    {/*  className={styles.singPolicyHeaderBtn}*/}
                    {/*  onClick={() => dispatch<UpdateRelationAction>({*/}
                    {/*    type: 'exhibitInfoPage/updateRelation',*/}
                    {/*    payload: {*/}
                    {/*      resourceId: selectedResource.id,*/}
                    {/*      policyId: p.id,*/}
                    {/*    }*/}
                    {/*  })}*/}
                    {/*>签约</a>*/}
                  </div>
                  <div style={{height: 15}}/>
                  <pre>{p.text}</pre>
                </div>))
              }
            </>)
          }
        </Space>
      </div>
    </div>
  </div>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Contracts);
