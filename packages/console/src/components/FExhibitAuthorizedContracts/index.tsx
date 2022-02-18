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
  const [authorizedContracts, set_AuthorizedContracts] = React.useState<FExhibitAuthorizedContractsStates['authorizedContracts']>([]);
  const [currentExhibitResourceMappingContractIDs, set_CurrentExhibitResourceMappingContractIDs] = React.useState<FExhibitAuthorizedContractsStates['currentExhibitResourceMappingContractIDs']>([]);

  const selectedAuthorizedContract: FExhibitAuthorizedContractsStates['authorizedContracts'][0] | undefined = authorizedContracts.find((i) => {
    return i.id === selectedID;
  });

  React.useEffect(() => {
    handleData();
  }, [exhibitID]);

  async function handleData() {
    const data = await handleExhibitAuthorizedContracts(exhibitID);
    set_AuthorizedContracts(data);
    if (!data.some((d) => d.id === selectedID)) {
      set_SelectedID(data[0].id);
    }
  }

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

    {
      selectedAuthorizedContract && selectedAuthorizedContract.disuseAuthorized && (
        <div className={styles.disuseAuthorizedPanel}>
          <FTitleText
            text={'无需处理授权'}
            type={'h2'}
            style={{ color: '#42C28C' }}
          />
          <div style={{ height: 30 }} />
          <FContentText
            text={'在测试节点测试，你可以自由测试自己发布资源或者上传的对象，无需处理授权'}
            type={'additional2'}
          />
        </div>)
    }

    {
      selectedAuthorizedContract && !selectedAuthorizedContract.disuseAuthorized && (
        <div className={styles.operatorPanel}>
          {
            selectedAuthorizedContract.policies.length > 0 && (<>
              <div style={{ height: 15 }} />
              <div className={styles.hasPolicyTip}>
                <FInfo style={{ fontSize: 14 }} />
                <div style={{ width: 5 }} />
                <span>最下方有可签约的策略</span>
              </div>
            </>)
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
                      console.log(sac.id, 'sac.id@#$@!#$@#4234');
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
                            <FContractDisplay
                              contractID={sac.id}
                              onChangedEvent={() => {
                                // dispatch<FetchInfoAction>({
                                //   type: 'exhibitInfoPage/fetchInfo',
                                // });
                              }}
                            />
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

        </div>)
    }

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

  if (errcode !== 0 || ret !== 0 || !testResourceDetails) {
    return [];
  }

  // console.log(testResourceDetails, 'data_testResourceDetails 309uoijklsad/lfjlk');

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

  let batchResources: {
    resourceId: string;
    resourceName: string;
    resourceType: string;
    policies: {
      policyId: string;
      policyName: string;
      policyText: string;
      status: 0 | 1;
    }[];
  }[] = [];
  let batchObjects: {
    objectId: string;
    objectName: string;
    resourceType: string;
    bucketName: string;
  }[] = [];

  if (allResourceIDs.length > 0) {
    const params: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
      resourceIds: allResourceIDs.join(','),
      isLoadPolicyInfo: 1,
      projection: 'resourceId,resourceName,resourceType,policies',
    };
    const { data } = await FServiceAPI.Resource.batchInfo(params);
    batchResources = data;
  }

  if (allObjectIDs.length > 0) {
    const params: Parameters<typeof FServiceAPI.Storage.batchObjectList>[0] = {
      objectIds: allObjectIDs.join(','),
      projection: 'objectId,objectName,resourceType,bucketName',
    };
    const { data } = await FServiceAPI.Storage.batchObjectList(params);
    batchObjects = data;
  }
  // console.log(batchResources, 'data_batchResources 2390oijsdflk');
  // console.log(batchObjects, 'data_batchObjects 0932jlkjrlefwsd');
  /************** End 获取所有资源和对象的详细信息  *****************************************/

  /*********** Start 获取所有需要处理资源的合同 ******************************************************/
  let allUsedContract: {
    contractId: string;
    contractName: string;
    policyId: string;
    authStatus: 1 | 2 | 128;
    status: 0 | 1 | 2;
    subjectId: string;
    createDate: string;
  }[] = [];

  const allNeedHandleResourceIDs: string[] = testResourceDetails.resolveResources.filter((rr) => {
    return !rr.isSelf && rr.type === 'resource';
  }).map((rr) => {
    return rr.resourceId;
  });

  if (allNeedHandleResourceIDs.length > 0) {
    const params: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
      subjectIds: allNeedHandleResourceIDs.join(','),
      subjectType: 1,
      licenseeIdentityType: 2,
      licenseeId: testResourceDetails.nodeId,
      isLoadPolicyInfo: 1,
    };

    const { data } = await FServiceAPI.Contract.batchContracts(params);
    allUsedContract = data;
    // console.log(allUsedContract, 'data_allUsedContract 90-[lajsdkfhlkjl');
  }
  /*********** End 获取所有需要处理资源的合同 ******************************************************/

  /************ Start 组织最终数据 **************************************************************************/
  const result: FExhibitAuthorizedContractsStates['authorizedContracts'] = testResourceDetails.resolveResources.map((rr) => {

    /******** Start 处理对象 ***********************************************/
    if (rr.type === 'object') {
      const theResource = batchObjects.find((bo) => {
        return bo.objectId === rr.resourceId;
      });

      return {
        id: rr.resourceId,
        name: (theResource?.bucketName || '') + (theResource?.objectName || ''),
        type: theResource?.resourceType || '',
        identity: rr.type,
        disuseAuthorized: rr.isSelf,
        contracts: [],
        policies: [],
      };
    }
    /******** End 处理对象 ***********************************************/

    /********* Start 处理资源 ***********************************************/
    /********* Start 处理合约相关数据 *********************************************************/
    const contracts: FExhibitAuthorizedContractsStates['authorizedContracts'][0]['contracts'] = allUsedContract
      .filter((auc) => {
        return auc.subjectId === rr.resourceId && auc.status !== 1;
      })
      .map((auc) => {
        return {
          id: auc.contractId,
          name: auc.contractName,
          createTime: FUtil.Format.formatDateTime(auc.createDate, true),
          status: auc.authStatus === 1 ? 'active' : auc.authStatus === 2 ? 'testActive' : 'inactive',
          policyID: auc.policyId,
        };
      });
    /********* End 处理合约相关数据 *********************************************************/

    const theResource = batchResources.find((br) => {
      return br.resourceId === rr.resourceId;
    });

    /************** Start 处理策略相关数据 *********************************************************/
    const policies: FExhibitAuthorizedContractsStates['authorizedContracts'][0]['policies'] = !theResource
      ? []
      : theResource.policies
        .filter((thp) => {
          return thp.status === 1 && !contracts.some((c) => c.policyID === thp.policyId);
        })
        .map((thp) => {
          return {
            id: '',
            name: '',
            text: '',
          };
        });
    /************** End 处理策略相关数据 *********************************************************/
    return {
      id: rr.resourceId,
      name: theResource?.resourceName || '',
      type: theResource?.resourceType || '',
      identity: rr.type,
      disuseAuthorized: rr.isSelf,
      contracts: contracts,
      policies: policies,
    };
    /********* End 处理资源 ***********************************************/
  });

  /************ End 组织最终数据 **************************************************************************/
  console.log(result, '###$$$$$$$RRrrrrr');

  return result.sort((res) => {
    // console.log(res.id, testResourceDetails.originInfo.id, '#########000000000））））））））');
    if (res.id === testResourceDetails.originInfo.id) {
    // if (res.id === '61d6b8262ae3ac002eb8581d') {
      return -1;
    }
    return 0;
  });
}
