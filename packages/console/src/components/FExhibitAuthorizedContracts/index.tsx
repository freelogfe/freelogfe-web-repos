import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
import FResourceContractLabels from '@/components/FResourceContractLabels';
import FResourceContractPanelNoContractTip from '@/components/FResourceContractPanelNoContractTip';
import { Space } from 'antd';
import FContractDisplay from '@/components/FContractDisplay';
import FDivider from '@/components/FDivider';
import FSwitch from '@/components/FSwitch';
import FPolicyDisplay from '@/components/FPolicyDisplay';
import fMessage from '@/components/fMessage';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import FComponentsLib from '@freelog/components-lib';
import FTooltip from '@/components/FTooltip';
import fViewTerminatedContracts from '@/components/fViewTerminatedContracts';
import FAutoOverflowTooltipTitle from '@/components/FAutoOverflowTooltipTitle';

interface FExhibitAuthorizedContractsProps {
  exhibitID: string;

  onChangeAuthorize?(): void;
}

interface FExhibitAuthorizedContractsStates {
  selectedID: string;
  authorizedContracts: {
    subjectID: string;
    subjectName: string;
    detailsUrl: string;
    type: string[];
    identity: 'resource' | 'object';
    disuseAuthorized: boolean;
    contracts: {
      contractID: string;
      contractName: string;
      createTime: string;
      status: 'active' | 'testActive' | 'inactive';
      policyID: string;
      applyToCurrentExhibit: {
        checked: boolean;
        disabled: boolean;
      };
    }[];
    terminatedContractIDs: string[];
    policies: PolicyFullInfo_Type[];
  }[];
  // terminatedContractIDs: string[];
}

function FExhibitAuthorizedContracts({ exhibitID, onChangeAuthorize }: FExhibitAuthorizedContractsProps) {

  const [selectedID, set_SelectedID] = React.useState<FExhibitAuthorizedContractsStates['selectedID']>('1');
  const [authorizedContracts, set_AuthorizedContracts] = React.useState<FExhibitAuthorizedContractsStates['authorizedContracts']>([]);
  // const [terminatedContractIDs, set_TerminatedContractIDs] = React.useState<FExhibitAuthorizedContractsStates['terminatedContractIDs']>([]);

  // 当前激活的标的物（资源或对象）
  const selectedAuthorizedContract: FExhibitAuthorizedContractsStates['authorizedContracts'][0] | undefined = authorizedContracts.find((i) => {
    return i.subjectID === selectedID;
  });

  React.useEffect(() => {
    handleData();
  }, [exhibitID]);

  // 处理整个授权合约关系
  async function handleData() {
    const authorizedContracts = await handleExhibitAuthorizedContracts(exhibitID);
    set_AuthorizedContracts(authorizedContracts);
    // set_CurrentExhibitResourceMappingContractIDs(mappingContracts);
    if (!authorizedContracts.some((d) => d.subjectID === selectedID)) {
      set_SelectedID(authorizedContracts[0]?.subjectID || '');
    }
    // console.log(authorizedContracts, 'authorizedContracts 0293ujewlkfasdlkf');
    // console.log(mappingContracts, 'mappingContracts 0293ujewlkfasdlkf');
  }

  // 启用和搁置合约
  async function enableAndUnable(policyID: string, enabled: boolean) {

    const params1: Parameters<typeof FServiceAPI.InformalNode.testResourceDetails>[0] = {
      testResourceId: exhibitID,
    };
    const { data: data_testResourceDetails, errcode, ret }: {
      data: {
        resolveResources: {
          contracts: {
            contractId: string;
            policyId: string;
          }[];
          isSelf: boolean;
          resourceId: string;
          type: 'object' | 'resource';
        }[];
      };
      errcode: number;
      ret: number;
    } | any = await FServiceAPI.InformalNode.testResourceDetails(params1);

    if (errcode !== 0 || ret !== 0 || !data_testResourceDetails) {
      return fMessage('当前测试展品异常', 'error');
    }

    const oldPolicyIDs: string[] = data_testResourceDetails.resolveResources
      .find((acon: any) => {
        return acon.resourceId === selectedID;
      })?.contracts.map((cstr: any) => {
        return cstr.policyId;
      }) || [];

    const finalEnabledPolicyIDs: string[] = enabled
      ? [
        ...oldPolicyIDs,
        policyID,
      ]
      : oldPolicyIDs.filter((rc) => {
        return rc !== policyID;
      });
    const params: Parameters<typeof FServiceAPI.InformalNode.updateTestResourceContracts>[0] = {
      testResourceId: exhibitID,
      resolveResources: [{
        resourceId: selectedID,
        contracts: finalEnabledPolicyIDs.map((rc) => {
          return {
            policyId: rc,
          };
        }),
      }],
    };

    await FServiceAPI.InformalNode.updateTestResourceContracts(params);
    // console.log(data, 'data@@#$@#4');
    handleData();
    onChangeAuthorize && onChangeAuthorize();
  }

  return (<div className={styles.FExhibitAuthorizedContracts}>
    <div className={styles.subjects}>
      {
        authorizedContracts.map((ac, aci) => {
          return (<React.Fragment key={ac.subjectID}>
            {
              aci === 0 && (<div style={{ padding: '0 15px' }}>
                <div style={{ height: 15 }} />
                <FComponentsLib.FTitleText type='h4'>主资源</FComponentsLib.FTitleText>
                <div style={{ height: 5 }} />
              </div>)
            }

            {
              aci === 1 && (<div style={{ padding: '0 15px' }}>
                <div style={{ height: 15 }} />
                <FComponentsLib.FTitleText type='h4'>基础上抛</FComponentsLib.FTitleText>
                <div style={{ height: 5 }} />
              </div>)
            }

            <div
              className={styles.subject}
              style={{ backgroundColor: selectedID === ac.subjectID ? '#FAFBFC' : 'transparent' }}
              onClick={() => {
                set_SelectedID(ac.subjectID);
              }}
            >
              <FAutoOverflowTooltipTitle
                title={ac.subjectName}
                right={<>
                  <FTooltip title={FI18n.i18nNext.t('tip_check_relevant_resource')}>
                    <div>
                      <FComponentsLib.FTextBtn
                        type={'primary'}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(ac.detailsUrl);
                        }}
                      >
                        <FComponentsLib.FIcons.FFileSearch className={styles.FFileSearch} />
                      </FComponentsLib.FTextBtn>
                    </div>
                  </FTooltip>
                </>}
              />
              {/*<div style={{ display: 'flex', alignItems: 'center' }}>*/}
              {/*  <FTooltip title={ac.subjectName}><span><FComponentsLib.FContentText*/}
              {/*    type='highlight'*/}
              {/*    text={ac.subjectName}*/}
              {/*    singleRow*/}
              {/*    className={styles.FContentText}*/}
              {/*  /></span></FTooltip>*/}
              {/*  <FTooltip title={FI18n.i18nNext.t('tip_check_relevant_resource')}><span><FComponentsLib.FTextBtn*/}
              {/*    type={'primary'}*/}
              {/*    onClick={(e) => {*/}
              {/*      e.stopPropagation();*/}
              {/*      window.open(ac.detailsUrl);*/}
              {/*    }}*/}
              {/*  ><FComponentsLib.FIcons.FFileSearch /></FComponentsLib.FTextBtn></span></FTooltip>*/}
              {/*</div>*/}
              <div style={{ height: 5 }} />
              <FComponentsLib.FContentText
                type='additional2'
                text={FUtil.Format.resourceTypeKeyArrToResourceType(ac.type)}
              />
              <div style={{ height: 5 }} />
              {
                ac.disuseAuthorized
                  ? (<div className={styles.disuseAuthorized}>无需处理授权</div>)
                  : (<FResourceContractLabels
                    contracts={ac.contracts
                      .filter((c) => {
                        return c.applyToCurrentExhibit.checked;
                      })
                      .map((c) => {
                        return {
                          name: c.contractName,
                          auth: c.status === 'active' || c.status === 'testActive',
                        };
                      })}
                  />)
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
          <FComponentsLib.FTitleText
            text={'无需处理授权'}
            type={'h2'}
            style={{ color: '#42C28C' }}
          />
          <div style={{ height: 30 }} />
          <FComponentsLib.FContentText
            text={'在测试节点测试，你可以自由测试自己发布资源或者上传的对象，无需处理授权'}
            type={'additional2'}
          />
        </div>)
    }

    {
      selectedAuthorizedContract && !selectedAuthorizedContract.disuseAuthorized && (
        <div className={styles.operatorPanel}>
          {
            selectedAuthorizedContract.contracts.length > 0 && selectedAuthorizedContract.policies.length > 0 && (<>
              <div style={{ height: 15 }} />
              <div className={styles.hasPolicyTip}>
                <FComponentsLib.FIcons.FInfo style={{ fontSize: 14 }} />
                <div style={{ width: 5 }} />
                <span>最下方有可签约的策略</span>
              </div>
            </>)
          }

          <>
            {
              selectedAuthorizedContract.contracts.length > 0 && selectedAuthorizedContract.contracts
                .filter((c) => {
                  return c.applyToCurrentExhibit.checked;
                })
                .length === 0
              && (<>
                <div style={{ height: 15 }} />
                <FResourceContractPanelNoContractTip />
              </>)
            }

            {
              selectedAuthorizedContract.contracts.length > 0 && (<>
                <div style={{ height: 15 }} />
                <FComponentsLib.FTitleText type='h4'>当前合约</FComponentsLib.FTitleText>
                {
                  selectedAuthorizedContract.contracts.map((sac) => {
                    // console.log(sac.id, 'sac.id@#$@!#$@#4234');
                    return (<React.Fragment key={sac.contractID}>
                      <div style={{ height: 15 }} />
                      <div
                        key={sac.contractID}
                        className={styles.Contracts}
                      >
                        <div style={{ height: 10 }} />
                        <Space style={{ padding: '0 20px' }} size={10}>
                          <FComponentsLib.FContentText type='highlight' text={sac.contractName} />
                        </Space>
                        <div style={{ height: 10 }} />

                        <div style={{ padding: '0 20px' }}>
                          <FContractDisplay
                            contractID={sac.contractID}
                            onChangedEvent={() => {
                              onChangeAuthorize && onChangeAuthorize();
                            }}
                          />
                        </div>

                        <div style={{ height: 10 }} />
                        <Space style={{ padding: '0 20px' }} size={5}>
                          <FComponentsLib.FContentText
                            type='additional2'
                            text={FI18n.i18nNext.t('contract_id') + '：' + sac.contractID}
                          />
                          <FDivider style={{ fontSize: 14 }} />
                          <FComponentsLib.FContentText
                            type='additional2'
                            text={FI18n.i18nNext.t('contract_signed_time') + '：' + sac.createTime}
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
                              // checked={currentExhibitResourceMappingContract?.contractIDs.includes(sac.contractID) || false}
                              checked={sac.applyToCurrentExhibit.checked}
                              // disabled={currentExhibitResourceMappingContract && (currentExhibitResourceMappingContract.contractIDs.length <= 1) && currentExhibitResourceMappingContract?.contractIDs.includes(sac.contractID)}
                              disabled={sac.applyToCurrentExhibit.disabled}
                              onChange={(value) => {
                                enableAndUnable(sac.policyID, value);
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

            {
              selectedAuthorizedContract.terminatedContractIDs.length > 0 && (<>
                <div style={{ height: 15 }} />

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {/*<FContentText text={'查看已终止的合约请移至'} type='negative' />*/}
                  <FComponentsLib.FTextBtn onClick={async () => {
                    // set_TerminatedContractIDs(selectedAuthorizedContract.terminatedContractIDs);
                    // window.open(`${FUtil.Format.completeUrlByDomain('user')}${FUtil.LinkTo.contract()}`);
                    await fViewTerminatedContracts({
                      terminatedContractIDs: selectedAuthorizedContract.terminatedContractIDs,
                    });
                  }}>查看已终止合约</FComponentsLib.FTextBtn>
                </div>
              </>)
            }

          </>

          {
            selectedAuthorizedContract && selectedAuthorizedContract.policies.length > 0 && (<>
              <div style={{ height: 25 }} />
              <FComponentsLib.FTitleText
                type='h4'>{FI18n.i18nNext.t('getauth_title_authplanavailable')}</FComponentsLib.FTitleText>
              {
                selectedAuthorizedContract.policies.map((sacp, ind) => {
                  return (<React.Fragment key={sacp.policyId}>
                    {
                      ind !== 0 && (<div style={{ height: 15 }} />)
                    }
                    <div
                      className={styles.Policy}
                      key={sacp.policyId}
                    >
                      <div className={styles.singPolicyHeader}>
                        <FComponentsLib.FContentText type='highlight'>{sacp.policyName}</FComponentsLib.FContentText>
                        <FComponentsLib.FRectBtn
                          style={{ height: 26, padding: '0 15px' }}
                          size='small'
                          onClick={() => {
                            enableAndUnable(sacp.policyId, true);
                          }}
                        >签约</FComponentsLib.FRectBtn>
                      </div>
                      <div style={{ height: 10 }} />
                      <div style={{ padding: '0 20px' }}>
                        <FPolicyDisplay
                          // code={sacp.text}
                          fullInfo={sacp}
                        />
                      </div>

                    </div>
                  </React.Fragment>);
                })
              }
              <div style={{ height: 25 }} />
            </>)
          }


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
      }[];
    };
    errcode: number;
    ret: number;
  } | any
    = await FServiceAPI.InformalNode.testResourceDetails(params1);

  if (errcode !== 0 || ret !== 0 || !testResourceDetails) {
    return [];
  }

  // console.log(testResourceDetails, 'data_testResourceDetails 309uoijklsad/lfjlk');

  /************** Start 获取所有资源和对象的详细信息  *****************************************/
  const allResourceIDs: string[] = testResourceDetails.resolveResources.filter((rr: any) => {
    return rr.type === 'resource';
  }).map((rr: any) => {
    return rr.resourceId;
  });
  const allObjectIDs: string[] = testResourceDetails.resolveResources.filter((rr: any) => {
    return rr.type === 'object';
  }).map((rr: any) => {
    return rr.resourceId;
  });

  let batchResources: {
    resourceId: string;
    resourceName: string;
    resourceType: string;
    policies: PolicyFullInfo_Type[];
    status: 0 | 1;
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
      projection: 'resourceId,resourceName,resourceType,policies,status',
      isTranslate: 1,
    };
    const { data }: { data: any[] } = await FServiceAPI.Resource.batchInfo(params);
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
    authStatus: 1 | 2 | 128 | number;
    status: 0 | 1 | 2;
    subjectId: string;
    createDate: string;
  }[] = [];

  const allNeedHandleResourceIDs: string[] = testResourceDetails.resolveResources.filter((rr: any) => {
    return !rr.isSelf && rr.type === 'resource';
  }).map((rr: any) => {
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
  const result: FExhibitAuthorizedContractsStates['authorizedContracts'] = testResourceDetails.resolveResources.map((rr: any) => {

    /******** Start 处理对象 ***********************************************/
    if (rr.type === 'object') {
      const theResource = batchObjects.find((bo) => {
        return bo.objectId === rr.resourceId;
      });

      // console.log(theResource, 'theResource23433333');

      return {
        subjectID: rr.resourceId,
        subjectName: (theResource?.bucketName || '') + (theResource?.objectName || ''),
        detailsUrl: FUtil.LinkTo.objectDetails({
          bucketName: theResource?.bucketName || '',
          objectID: theResource?.objectId || '',
        }),
        type: theResource?.resourceType || '',
        identity: rr.type,
        disuseAuthorized: rr.isSelf,
        contracts: [],
        terminatedContractIDs: [],
        policies: [],
      };
    }
    /******** End 处理对象 ***********************************************/

    /********* Start 处理资源 ***********************************************/
    const theResource = batchResources.find((br) => {
      return br.resourceId === rr.resourceId;
    });

    /********* Start 处理合约相关数据 *********************************************************/

    const currentExhibitResolveResources = testResourceDetails.resolveResources.find((rere: any) => {
      return rere.resourceId === theResource?.resourceId;
    });

    const contracts: FExhibitAuthorizedContractsStates['authorizedContracts'][0]['contracts'] = allUsedContract
      .filter((auc) => {
        return auc.subjectId === theResource?.resourceId && auc.status !== 1;
      })
      .map((auc) => {
        const checked: boolean = currentExhibitResolveResources?.contracts.some((contract: any) => contract.contractId === auc.contractId) || false;
        const disabled: boolean = checked && currentExhibitResolveResources && (currentExhibitResolveResources?.contracts.length <= 1) || false;
        return {
          contractID: auc.contractId,
          contractName: auc.contractName,
          createTime: FUtil.Format.formatDateTime(auc.createDate, true),
          status: (auc.authStatus === 1 || auc.authStatus === 3) ? 'active' : auc.authStatus === 2 ? 'testActive' : 'inactive',
          policyID: auc.policyId,
          applyToCurrentExhibit: {
            checked,
            disabled,
          },
        };
      });
    const terminatedContractIDs: FExhibitAuthorizedContractsStates['authorizedContracts'][0]['terminatedContractIDs'] = allUsedContract
      .filter((auc) => {
        return auc.subjectId === theResource?.resourceId && auc.status === 1;
      })
      .map((auc) => {
        return auc.contractId;
      });
    /********* End 处理合约相关数据 *********************************************************/

    /************** Start 处理策略相关数据 *********************************************************/
      // console.log(theResource, 'theResource90oewjlksdfjldskjl');
    const policies: FExhibitAuthorizedContractsStates['authorizedContracts'][0]['policies'] = (!theResource || theResource.status !== 1)
        ? []
        : theResource.policies
          .filter((thp) => {
            return thp.status === 1 && !contracts.some((c) => c.policyID === thp.policyId);
          });
    /************** End 处理策略相关数据 *********************************************************/
    return {
      subjectID: rr.resourceId,
      subjectName: theResource?.resourceName || '',
      detailsUrl: FUtil.LinkTo.resourceDetails({
        resourceID: theResource?.resourceId || '',
      }),
      type: theResource?.resourceType || '',
      identity: rr.type,
      disuseAuthorized: rr.isSelf,
      contracts: contracts,
      terminatedContractIDs: terminatedContractIDs,
      policies: policies,
    };
    /********* End 处理资源 ***********************************************/
  });

  /************ End 组织最终数据 **************************************************************************/
  // console.log(result, '###$$$$$$$RRrrrrr');

  return result.sort((res) => {
    // console.log(res.id, testResourceDetails.originInfo.id, '#########000000000））））））））');
    if (res.subjectID === testResourceDetails.originInfo.id) {
      // if (res.id === '61d6b8262ae3ac002eb8581d') {
      return -1;
    }
    return 0;
  });
}
