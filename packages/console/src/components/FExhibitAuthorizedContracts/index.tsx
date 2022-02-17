import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { FTextBtn } from '@/components/FButton';
import FResourceContractLabels from '@/components/FResourceContractLabels';
import FResourceContractPanelNoContractTip from '@/components/FResourceContractPanelNoContractTip';
import { FInfo } from '@/components/FIcons';
import { Space } from 'antd';
import FContractDisplay from '@/components/FContractDisplay';
import { FetchInfoAction, UpdateContractUsedAction } from '@/models/exhibitInfoPage';
import FUtil1 from '@/utils';
import FDivider from '@/components/FDivider';
import FSwitch from '@/components/FSwitch';

interface FExhibitAuthorizedContractsProps {
  exhibitID: string;
}

interface FExhibitAuthorizedContractsStates {
  selectedID: string;
  authorizedContracts: {
    id: string;
    name: string;
    type: string;
    identity: 'resource' | 'object';
    disuseAuthorized: boolean;
    contracts: {
      id: string;
      name: string;
      createTime: string;
      status: 'active' | 'testActive' | 'inactive';
      policyID: string;
    }[];
    policies: {
      id: string;
      name: string;
      text: string;
    }[];
  }[];
  currentExhibitResourceMappingContractIDs: {
    resourceID: string;
    contractIDs: string[];
  }[];
  // otherExhibitResourceMappingContractIDs: {
  //   exhibitID: string;
  //   resourceID: string;
  //   contractIDs: string[];
  // }[];
}

function FExhibitAuthorizedContracts({ exhibitID }: FExhibitAuthorizedContractsProps) {

  const [selectedID, set_SelectedID] = React.useState<FExhibitAuthorizedContractsStates['selectedID']>('1');
  const [authorizedContracts, set_AuthorizedContracts] = React.useState<FExhibitAuthorizedContractsStates['authorizedContracts']>([
    {
      id: '1',
      name: 'Stefan/freelog白皮书',
      type: 'json',
      identity: 'object',
      disuseAuthorized: true,
      contracts: [{
        id: 'c1',
        name: '免费1',
        createTime: '2002-10-10',
        status: 'active',
        policyID: 'p1',
      }],
      policies: [{
        id: 'p2',
        name: '收费',
        text: '',
      }],
    },
    {
      id: '2',
      name: 'Stefan/freelog白皮书2',
      type: 'json',
      identity: 'resource',
      disuseAuthorized: false,
      contracts: [{
        id: 'c1',
        name: '免费1',
        createTime: '2002-10-10',
        status: 'active',
        policyID: 'p1',
      }],
      policies: [{
        id: 'p2',
        name: '收费',
        text: '',
      }],
    },
    {
      id: '3',
      name: 'Stefan/freelog白皮书3',
      type: 'json',
      identity: 'resource',
      disuseAuthorized: false,
      contracts: [],
      policies: [{
        id: 'p2',
        name: '收费',
        text: '',
      }],
    },
    {
      id: '4',
      name: 'Stefan/freelog白皮书4',
      type: 'json',
      identity: 'resource',
      disuseAuthorized: false,
      contracts: [],
      policies: [{
        id: 'p2',
        name: '收费',
        text: '',
      }],
    },
    {
      id: '5',
      name: 'Stefan/freelog白皮书5',
      type: 'json',
      identity: 'resource',
      disuseAuthorized: false,
      contracts: [],
      policies: [{
        id: 'p2',
        name: '收费',
        text: '',
      }],
    },
  ]);
  const [currentExhibitResourceMappingContractIDs, set_CurrentExhibitResourceMappingContractIDs] = React.useState<FExhibitAuthorizedContractsStates['currentExhibitResourceMappingContractIDs']>([]);

  const selectedAuthorizedContract: FExhibitAuthorizedContractsStates['authorizedContracts'][0] | undefined = authorizedContracts.find((i) => {
    return i.id === selectedID;
  });

  React.useEffect(() => {
    handleExhibitAuthorizedContracts(exhibitID);
  }, []);


  return (<div className={styles.FExhibitAuthorizedContracts}>
    <div className={styles.subjects}>
      {
        authorizedContracts.map((ac, aci) => {
          return (<React.Fragment key={ac.id}>
            {
              aci === 0 && (<div style={{ padding: '0 15px' }}>
                <div style={{ height: 15 }} />
                <FTitleText type='h4'>主资源</FTitleText>
                <div style={{ height: 5 }} />
              </div>)
            }

            {
              aci === 1 && (<div style={{ padding: '0 15px' }}>
                <div style={{ height: 15 }} />
                <FTitleText type='h4'>基础上抛</FTitleText>
                <div style={{ height: 5 }} />
              </div>)
            }

            <div
              className={styles.subject}
              style={{ backgroundColor: selectedID === ac.id ? '#FAFBFC' : 'transparent' }}
              onClick={() => {
                set_SelectedID(ac.id);
              }}
            >
              <FTextBtn
                onClick={(e) => {
                  // e.stopPropagation();
                  // window.open(FUtil.LinkTo.resourceDetails({
                  //   resourceID: mainResource.id,
                  // }));
                }}
              >
                <FContentText
                  type='highlight'
                  text={ac.name}
                  singleRow
                  className={styles.FContentText}
                />
              </FTextBtn>
              <div style={{ height: 5 }} />
              <FContentText
                type='additional2'
                text={ac.type}
              />
              <div style={{ height: 5 }} />
              {
                ac.disuseAuthorized
                  ? (<div className={styles.disuseAuthorized}>无需处理授权</div>)
                  : (<FResourceContractLabels contracts={ac.contracts.map((c) => {
                    return {
                      name: c.name,
                      auth: c.status === 'active' || c.status === 'testActive',
                    };
                  })} />)
              }

            </div>

          </React.Fragment>);
        })
      }

      <div style={{ height: 15 }} />
    </div>

    <div className={styles.operatorPanel}>
      {
        selectedAuthorizedContract && (<>
          {
            selectedAuthorizedContract.policies.length > 0 && (<>
                <div style={{ height: 15 }} />
                <div className={styles.hasPolicyTip}>
                  <FInfo style={{ fontSize: 14 }} />
                  <div style={{ width: 5 }} />
                  <span>最下方有可签约的策略</span>
                </div>
              </>
            )
          }

          <>
            {
              selectedAuthorizedContract.contracts.length === 0
                ? (<>
                  <div style={{ height: 15 }} />
                  <FResourceContractPanelNoContractTip />
                </>)
                : (<>
                  <div style={{ height: 15 }} />
                  <div style={{ height: 15 }} />
                  <FTitleText type='h4'>当前合约</FTitleText>
                  {
                    selectedAuthorizedContract.contracts.map((sac) => {
                      return (<React.Fragment key={sac.id}>
                        <div style={{ height: 15 }} />
                        <div
                          key={sac.id}
                          className={styles.Contracts}
                        >
                          <div style={{ height: 10 }} />
                          <Space style={{ padding: '0 20px' }} size={10}>
                            <FContentText type='highlight' text={sac.name} />
                          </Space>
                          <div style={{ height: 10 }} />

                          <div style={{ padding: '0 20px' }}>
                            {/*<FContractDisplay*/}
                            {/*  contractID={sac.id}*/}
                            {/*  onChangedEvent={() => {*/}
                            {/*    // dispatch<FetchInfoAction>({*/}
                            {/*    //   type: 'exhibitInfoPage/fetchInfo',*/}
                            {/*    // });*/}
                            {/*  }}*/}
                            {/*/>*/}
                          </div>

                          <div style={{ height: 10 }} />
                          <Space style={{ padding: '0 20px' }} size={5}>
                            <FContentText
                              type='additional2'
                              text={FUtil1.I18n.message('contract_id') + '：' + sac.id}
                            />
                            <FDivider style={{ fontSize: 14 }} />
                            <FContentText
                              type='additional2'
                              text={FUtil1.I18n.message('contract_signed_time') + '：' + sac.createTime}
                            />
                          </Space>
                          <div style={{ height: 10 }} />
                          <div className={styles.footer}>
                            <div className={styles.action}>
                              <FContentText
                                // text={exhibitInfoPage.pName}
                                text={FUtil1.I18n.message('use_in_current_exhibit')}
                                type='highlight'
                              />
                              <FSwitch
                                // checked={exhibitInfoExhibit?.contractIDs.includes(c.id)}
                                // disabled={exhibitInfoExhibit && (exhibitInfoExhibit.contractIDs.length <= 1) && exhibitInfoExhibit?.contractIDs.includes(c.id)}
                                onChange={async (value) => {
                                  // await dispatch<UpdateContractUsedAction>({
                                  //   type: 'exhibitInfoPage/updateContractUsed',
                                  //   payload: {
                                  //     exhibitID: exhibitInfoPage.exhibit_ID,
                                  //     resourceID: selectedResource.id,
                                  //     policyID: c.policyId,
                                  //     isUsed: value,
                                  //   },
                                  // });
                                  // await dispatch<FetchInfoAction>({
                                  //   type: 'exhibitInfoPage/fetchInfo',
                                  // });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </React.Fragment>);
                    })
                  }

                </>)
            }

            <div style={{ height: 15 }} />

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FContentText text={'查看已终止的合约请移至'} type='negative' />
              <FTextBtn onClick={() => {
                window.open(`${FUtil.Format.completeUrlByDomain('user')}${FUtil.LinkTo.contract()}`);
              }}>合约管理</FTextBtn>
            </div>
          </>


        </>)
      }
    </div>
  </div>);
}

export default FExhibitAuthorizedContracts;

async function handleExhibitAuthorizedContracts(exhibitID: string): Promise<FExhibitAuthorizedContractsStates['authorizedContracts']> {
  const params1: Parameters<typeof FServiceAPI.InformalNode.testResourceDetails>[0] = {
    testResourceId: exhibitID,
  };

  const { data: testResourceDetails, errcode, ret }: {
    data: {
      createDate: string;
      nodeId: number;
      originInfo: {
        id: string;
      };
      resolveResources: {
        contracts: {
          contractId: string;
          policyId: string;
        }[];
        isSelf: boolean;
        resourceId: string;
        type: 'object' | 'resource';
      }[]
    };
    errcode: number;
    ret: number;
  } = await FServiceAPI.InformalNode.testResourceDetails(params1);

  if (errcode !== 0 || ret !== 0 || !data) {
    return [];
  }

  console.log(testResourceDetails, ' ######23423423');

  /************** Start 获取所有资源和对象的详细信息  *****************************************/
  const allResourceIDs: string[] = testResourceDetails.resolveResources.filter((rr) => {
    return rr.type === 'resource';
  }).map((rr) => {
    return rr.resourceId;
  });
  const allObjectIDs: string[] = testResourceDetails.resolveResources.filter((rr) => {
    return rr.type === 'object';
  }).map((rr) => {
    return rr.resourceId;
  });

  let batchResources = [];
  let batchObjects = [];

  if (allResourceIDs.length > 0) {
    const params: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
      resourceIds: allResourceIDs.join(','),
    };
    const { data } = await FServiceAPI.Resource.batchInfo(params);
    batchResources = data;
  }

  if (allObjectIDs.length > 0) {
    const params: Parameters<typeof FServiceAPI.Storage.batchObjectList>[0] = {
      objectIds: allObjectIDs.join(','),
    };
    const { data } = await FServiceAPI.Storage.batchObjectList(params);
    batchObjects = data;
  }
  /************** End 获取所有资源和对象的详细信息  *****************************************/

  /*********** Start 获取所有需要处理资源的合同 ******************************************************/
  const allNeedHandleResourceIDs: string[] = testResourceDetails.resolveResources.filter((rr) => {
    return !rr.isSelf && rr.type === 'resource';
  }).map((rr) => {
    return rr.resourceId;
  });

  

  /*********** End 获取所有需要处理资源的合同 ******************************************************/
}
