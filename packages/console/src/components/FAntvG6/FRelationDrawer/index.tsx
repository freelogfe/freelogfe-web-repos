import * as React from 'react';
import FFormLayout from '@/components/FFormLayout';
import FDrawer from '@/components/FDrawer';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
import { Space } from 'antd';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import FLoadingTip from '@/components/FLoadingTip';
import styles from './index.less';
import FContractDisplay from '@/components/FContractDisplay';
import FDivider from '@/components/FDivider';
import FContractAppliedVersions from '@/components/FContractAppliedVersions';
import fMessage from '@/components/fMessage';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import FContract_AvailablePolicy_Card from '@/components/FContract_AvailablePolicy_Card';
import FContractAppliedExhibits, { serverData_2_ContractAppliedExhibits } from '@/components/FContractAppliedExhibits';
// import FTerminatedContractListDrawer from '@/components/FTerminatedContractListDrawer';
import FComponentsLib from '@freelog/components-lib';
import fViewTerminatedContracts from '@/components/fViewTerminatedContracts';

interface FRelationDrawerProps {
  bothSidesInfo: {
    licensor: {
      licensorID: string;
      licensorIdentityType: 'resource';
    };
    licensee: {
      licenseeID: string;
      licenseeIdentityType: 'resource' | 'exhibit';
    };
  } | null;

  onClose?(): void;

  onChange_Authorization?(): void;
}

interface FRelationDrawerStates {
  dataSource: {
    licensor: {
      licensorID: string;
      licensorName: string;
      licensorIdentityType: 'resource';
      isCurrentUser: boolean;
    };
    licensee: {
      licenseeID: string;
      licenseeName: string;
      licensorIdentityType: 'resource' | 'exhibit';
      isCurrentUser: boolean;
    };
    validContracts: {
      contractID: string;
      policyID: string;
      contractName: string;
      createDate: string;
    }[];
    invalidContracts: any[];
    validPolicies: PolicyFullInfo_Type[];
  } | null;

  versions: {
    version: string;
    policyIDs: string[];
  }[];

  exhibits: {
    exhibitID: string;
    exhibitName: string;
    exhibitDetailsUrl: string;
    policyIDs: string[];
  }[];

  // terminatedContractIDs: string[];
}

const initData: FRelationDrawerStates = {
  dataSource: null,
  versions: [],
  exhibits: [],
  // terminatedContractIDs: [],
};

function FRelationDrawer({ bothSidesInfo, onClose, onChange_Authorization }: FRelationDrawerProps) {
  // console.log(bothSidesInfo, 'bothSidesInfo8903wqioj;sdlkfjsdlfkj');

  const [dataSource, set_DataSource] = React.useState<FRelationDrawerStates['dataSource']>(initData['dataSource']);
  const [versions, set_Versions] = React.useState<FRelationDrawerStates['versions']>(initData['versions']);
  const [exhibits, set_Exhibits] = React.useState<FRelationDrawerStates['exhibits']>(initData['exhibits']);
  // const [terminatedContractIDs, set_terminatedContractIDs] = React.useState<FRelationDrawerStates['terminatedContractIDs']>(initData['terminatedContractIDs']);

  React.useEffect(() => {

  }, []);

  function onChange_DrawerVisible(visible: boolean) {
    // console.log(visible, bothSidesInfo, '898932798479384798237498273948723984798');
    if (!visible || !bothSidesInfo) {
      set_DataSource(initData['dataSource']);
      set_Versions(initData['versions']);
      return;
    }
    const { licensor, licensee } = bothSidesInfo;
    if (licensor.licensorIdentityType === 'resource' && licensee.licenseeIdentityType === 'resource') {
      handleData_Resource2Resource();
    }

    if (licensor.licensorIdentityType === 'resource' && licensee.licenseeIdentityType === 'exhibit') {
      handleData_Resource2Exhibit();
    }
  }

  async function handleData_Resource2Resource() {
    // console.log(bothSidesInfo, 'bothSidesInfobothSidesInfo8932iosdaflkbothSidesInfo');
    if (!bothSidesInfo) {
      return;
    }
    const { licensor, licensee } = bothSidesInfo;
    const params0: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
      resourceIds: [licensor.licensorID, licensee.licenseeID].join(','),
      isLoadPolicyInfo: 1,
      isTranslate: 1,
      projection: 'resourceId,resourceName,userId,policies,status',
    };

    const { data: data_ResourceInfos }: {
      // data: {
      //   resourceId: string;
      //   resourceName: string;
      //   userId: number;
      //   policies: PolicyFullInfo_Type[];
      // }[];
      data: any;
    } = await FServiceAPI.Resource.batchInfo(params0);

    // console.log(data_ResourceInfos, 'data_ResourceInfos#@890uiojsd;flsdfklk');

    const params1: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
      subjectIds: licensor.licensorID,
      subjectType: 1,
      licensorId: licensor.licensorID,
      licenseeId: licensee.licenseeID,
      licenseeIdentityType: 1,
      projection: 'contractId,contractName,createDate,policyId,status',
    };

    const { data: data_Contracts }: {
      data: {
        contractId: string;
        contractName: string;
        createDate: string;
        policyId: string;
        status: 0 | 1;
      }[];
    } = await FServiceAPI.Contract.batchContracts(params1);

    const params2: Parameters<typeof FServiceAPI.Resource.resolveResources>[0] = {
      resourceId: licensee.licenseeID,
    };

    const { data: data_resolveResource }: {
      data: {
        resourceId: string;
        resourceName: string;
        versions: {
          version: string;
          versionId: string;
          contracts: {
            policyId: string;
            contractId: string;
          }[];
        }[];
      }[];
    } = await FServiceAPI.Resource.resolveResources(params2);

    // console.log(JSON.stringify(data_resolveResource), 'data_resolveResource0932ojisdlf');

    const lor = data_ResourceInfos.find((ri: any) => {
      return ri.resourceId === licensor.licensorID;
    });
    const lee = data_ResourceInfos.find((ri: any) => {
      return ri.resourceId === licensee.licenseeID;
    });

    // console.log(lor, 'lor90oeijwfslkdfjsdlkfjdslkj');
    if (!lor || !lee) {
      return;
    }
    const validContracts = data_Contracts
      .filter((dc) => {
        return dc.status === 0;
      })
      .map<NonNullable<FRelationDrawerStates['dataSource']>['validContracts'][number]>((dc) => {
        return {
          contractID: dc.contractId,
          contractName: dc.contractName,
          createDate: FUtil.Format.formatDateTime(dc.createDate),
          policyID: dc.policyId,
        };
      });
    const data: FRelationDrawerStates['dataSource'] = {
      licensor: {
        licensorID: lor.resourceId,
        licensorName: lor.resourceName,
        licensorIdentityType: 'resource',
        isCurrentUser: lor.userId === FUtil.Tool.getUserIDByCookies(),
      },
      licensee: {
        licenseeID: lee.resourceId,
        licenseeName: lee.resourceName,
        licensorIdentityType: 'resource',
        isCurrentUser: lee.userId === FUtil.Tool.getUserIDByCookies(),
      },
      validContracts: validContracts,
      invalidContracts: data_Contracts.filter((dc) => {
        return dc.status === 1;
      }),
      validPolicies: lor.status === 1
        ? lor.policies.filter((p: any) => {
          return p.status === 1 && !validContracts.some((vcp) => {
            return vcp.policyID === p.policyId;
          });
        })
        : [],
    };
    // console.log(data_resolveResource, 'data_resolveResource3209iojsdlfksdjflk');
    const currentResource = data_resolveResource.find((rr) => {
      return rr.resourceId === licensor.licensorID;
    });

    // console.log(data, currentResource, 'currentResource093wqiojsdlkfddddddded');
    if (!currentResource) {
      return;
    }

    const vs: FRelationDrawerStates['versions'] = currentResource.versions.map((v) => {
      return {
        version: v.version,
        policyIDs: v.contracts.map((c) => {
          return c.policyId;
        }),
      };
    });
    set_DataSource(data);
    set_Versions(vs);
    set_Exhibits([]);
  }

  async function handleData_Resource2Exhibit() {
    if (!bothSidesInfo) {
      return;
    }
    const { licensor, licensee } = bothSidesInfo;
    const params0: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
      presentableId: licensee.licenseeID,
    };
    const { data: data_exhibitDetails }: {
      data: {
        presentableId: string;
        presentableName: string;
        userId: number;
        nodeId: number;
      };
    } = await FServiceAPI.Exhibit.presentableDetails(params0);

    const params1: Parameters<typeof FServiceAPI.Resource.info>[0] = {
      resourceIdOrName: licensor.licensorID,
      isLoadPolicyInfo: 1,
      isTranslate: 1,
      projection: 'resourceId,resourceName,userId,policies',
    };

    const { data: data_ResourceDetails }: {
      // data: {
      //   resourceId: string;
      //   resourceName: string;
      //   userId: number;
      //   policies: PolicyFullInfo_Type[];
      // };
      data: any;
    } = await FServiceAPI.Resource.info(params1);

    const params2: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
      subjectIds: licensor.licensorID,
      subjectType: 1,
      licensorId: licensor.licensorID,
      licenseeId: data_exhibitDetails.nodeId,
      licenseeIdentityType: 2,
      // projection: 'contractId,contractName,createDate,policyId,status',
    };

    const { data: data_Contracts }: {
      data: {
        contractId: string;
        contractName: string;
        createDate: string;
        policyId: string;
        status: 0 | 1;
      }[];
    } = await FServiceAPI.Contract.batchContracts(params2);
    // console.log(data_Contracts, 'data_Contracts23890io9873928uoijlk');

    const validContracts = data_Contracts
      .filter((dc) => {
        return dc.status === 0;
      })
      .map<NonNullable<FRelationDrawerStates['dataSource']>['validContracts'][number]>((dc) => {
        return {
          contractID: dc.contractId,
          contractName: dc.contractName,
          createDate: FUtil.Format.formatDateTime(dc.createDate),
          policyID: dc.policyId,
        };
      });

    const params5: Parameters<typeof FServiceAPI.Exhibit.presentableList>[0] = {
      nodeId: data_exhibitDetails.nodeId,
      resolveResourceIds: licensor.licensorID,
    };

    const { data: data_ResolveResourceExhibit }: {
      data: {
        presentableId: string;
        presentableName: string;
        resolveResources: {
          contracts: {
            contractId: string;
            policyId: string;
          }[];
          resourceId: string;
          resourceName: string;
        }[];
      }[];
    } = await FServiceAPI.Exhibit.presentableList(params5);

    // console.log(data_ResolveResourceExhibit, 'data_ResolveResourceExhibit');

    const data: FRelationDrawerStates['dataSource'] = {
      licensor: {
        licensorID: data_ResourceDetails.resourceId,
        licensorName: data_ResourceDetails.resourceName,
        licensorIdentityType: 'resource',
        isCurrentUser: data_ResourceDetails.userId === FUtil.Tool.getUserIDByCookies(),
      },
      licensee: {
        licenseeID: data_exhibitDetails.presentableId,
        licenseeName: data_exhibitDetails.presentableName,
        licensorIdentityType: 'exhibit',
        isCurrentUser: data_exhibitDetails.userId === FUtil.Tool.getUserIDByCookies(),
      },
      validContracts: validContracts,
      invalidContracts: data_Contracts.filter((dc) => {
        return dc.status === 1;
      }),
      validPolicies: data_ResourceDetails.policies.filter((p: any) => {
        return p.status === 1 && !validContracts.some((vcp) => {
          return vcp.policyID === p.policyId;
        });
      }),
    };
    set_DataSource(data);
    // set_Exhibits(data_ContractApplied.map((ca) => {
    //   return {
    //     contractID: ca.contractId,
    //     exhibits: ca.presentables.map((p) => {
    //       return {
    //         exhibitID: p.presentableId,
    //         exhibitName: p.presentableName,
    //       };
    //     }),
    //   };
    // }));
    set_Exhibits(serverData_2_ContractAppliedExhibits({
      data: data_ResolveResourceExhibit,
      currentResourceID: licensor.licensorID,
    }));
  }

  async function onChange_AppliedVersion(changed: {
    version: string;
    checked: boolean;
    policyID: string;
  }[]) {
    if (!bothSidesInfo) {
      return;
    }
    const { licensor, licensee } = bothSidesInfo;

    const params: Parameters<typeof FServiceAPI.Resource.batchSetContracts>[0] = {
      resourceId: licensee.licenseeID,
      subjects: [{
        subjectId: licensor.licensorID,
        versions: changed.map((cha) => {
          return {
            version: cha.version,
            policyId: cha.policyID,
            operation: cha.checked ? 1 : 0,
          };
        }),
      }],
    };
    const { ret, errCode, msg, data } = await FServiceAPI.Resource.batchSetContracts(params);

    if (ret !== 0 || errCode !== 0 || !data) {
      fMessage(msg, 'error');
      return;
    }
    handleData_Resource2Resource();
    onChange_Authorization && onChange_Authorization();
  }

  async function onChange_AppliedExhibit(changed: {
    exhibitID: string;
    checked: boolean;
    policyID: string;
  }) {
    if (!dataSource) {
      return;
    }
    const params1: HandleFinalResolveResourceParams = {
      exhibitID: changed.exhibitID,
      resourceID: dataSource.licensor.licensorID,
      policyID: changed.policyID,
      isUsed: changed.checked,
    };

    const resolveResources: HandleFinalResolveResourceReturn = await handleFinalResolveResource(params1);

    const params: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
      presentableId: changed.exhibitID,
      resolveResources: resolveResources,
    };

    // console.log(params, 'params2093uiksdjflsdkjl');
    const { data } = await FServiceAPI.Exhibit.updatePresentable(params);
    handleData_Resource2Exhibit();
    onChange_Authorization && onChange_Authorization();
  }

  return (<FDrawer
    // visible={!!bothSidesInfo}
    open={!!bothSidesInfo}
    title={'授权关系'}
    // onClose={() => onClose && onClose()}
    // afterVisibleChange={onChange_DrawerVisible}
    afterOpenChange={onChange_DrawerVisible}
    onClose={() => {
      onClose && onClose();
    }}
  >
    {
      !dataSource && (<FLoadingTip height={500} />)
    }

    {
      dataSource && (<FFormLayout>
        <FFormLayout.FBlock title={'授权方'}>
          <Space size={10}>
            <FIdentityTypeBadge status={dataSource.licensor.licensorIdentityType} />
            <FComponentsLib.FContentText
              type='highlight'
              text={dataSource.licensor.licensorName}
            />
          </Space>

        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={'被授权方'}>
          <Space size={10}>
            <FIdentityTypeBadge status={dataSource.licensee.licensorIdentityType} />
            <FComponentsLib.FContentText
              type='highlight'
              text={dataSource.licensee.licenseeName}
            />
          </Space>
        </FFormLayout.FBlock>

        <FFormLayout.FBlock title={'合约详情'}>
          <Space size={15} direction='vertical' style={{ width: '100%' }}>
            {
              dataSource.validContracts.map((k) => {
                return (<div key={k.contractID} className={styles.Policy}>
                  <div style={{ height: 15 }} />

                  <div className={styles.PolicyGrammarName}>
                    <Space size={10}>
                      <span>{k.contractName}</span>
                    </Space>
                  </div>

                  <div style={{ height: 10 }} />
                  <div style={{ padding: '0 20px' }}>
                    <FContractDisplay
                      contractID={k.contractID}
                      onChangedEvent={() => {
                        onChange_Authorization && onChange_Authorization();
                      }}
                    />
                  </div>
                  <div style={{ height: 10 }} />
                  <Space style={{ padding: '0 20px' }} size={2}>
                    <FComponentsLib.FContentText
                      type='additional2'
                      text={FI18n.i18nNext.t('contract_id') + '：' + k.contractID}
                    />
                    <FDivider style={{ fontSize: 14 }} />
                    <FComponentsLib.FContentText
                      type='additional2'
                      text={FI18n.i18nNext.t('contract_signed_time') + '：' + k.createDate}
                    />
                  </Space>

                  {
                    dataSource.licensee.isCurrentUser && versions.length > 0 && (<>
                      <div style={{ height: 10 }} />
                      <div style={{
                        padding: '12px 20px',
                        borderTop: '1px solid #E5E7EB',
                      }}>
                        <FComponentsLib.FTitleText
                          // text={`当前合约资源 ${dataSource.licensee.licenseeName} 中各个版本的应用情况`}
                          // text={`当前合约在此资源上被多个版本应用`}
                          text={`当前合约应用版本`}
                          type='table'
                          style={{ fontSize: 12 }}
                        />

                        <div style={{ height: 8 }} />
                        <FContractAppliedVersions
                          versionAndPolicyIDs={versions}
                          currentPolicyID={k.policyID}
                          onChangeVersionContractIDs={({ changed, changedAllIDs }) => {
                            onChange_AppliedVersion([{
                              ...changed,
                              policyID: k.policyID,
                            }]);
                            set_Versions(changedAllIDs);
                          }}
                        />
                      </div>
                    </>)
                  }

                  {
                    dataSource.licensee.isCurrentUser && exhibits.length > 0 && (<>
                      <div style={{ height: 10 }} />
                      <div style={{
                        padding: '12px 20px',
                        borderTop: '1px solid #E5E7EB',
                      }}>
                        <FComponentsLib.FTitleText
                          // text={`当前合约资源 ${dataSource.licensee.licenseeName} 中各个版本的应用情况`}
                          // text={`当前合约在此资源上被多个版本应用`}
                          text={`当前合约应用展品`}
                          type='table'
                          style={{ fontSize: 12 }}
                        />

                        {/*<div style={{ height: 8 }} />*/}
                        <FContractAppliedExhibits
                          currentPolicyID={k.policyID}
                          exhibitAndPolicyIDs={exhibits}
                          onChangeExhibitContractIDs={({ changed, changedAllIDs }) => {
                            onChange_AppliedExhibit({
                              ...changed,
                              policyID: k.policyID,
                            });
                            set_Exhibits(changedAllIDs);
                          }}
                        />
                      </div>
                    </>)
                  }

                </div>);
              })}

            {
              dataSource.invalidContracts.length > 0 && (<div style={{ display: 'flex', alignItems: 'center' }}>
                {/*<FContentText text={'查看已终止的合约请移至'} type='negative' />*/}
                <FComponentsLib.FTextBtn onClick={async () => {
                  // window.open(`${FUtil.Format.completeUrlByDomain('user')}${FUtil.LinkTo.contract()}`);
                  // set_terminatedContractIDs(dataSource.invalidContracts.map((ic) => {
                  //   return ic.contractId;
                  // }));
                  await fViewTerminatedContracts({
                    terminatedContractIDs: dataSource.invalidContracts.map((ic) => {
                      return ic.contractId;
                    }),
                  });
                }}>查看已终止合约</FComponentsLib.FTextBtn>
              </div>)
            }

          </Space>

        </FFormLayout.FBlock>
        {/*{console.log(dataSource.licensee, 'dataSource.licensee.isCurrentUser90o3lsfdfl')}*/}
        {
          dataSource.validPolicies.length > 0 && (<FFormLayout.FBlock title={'可签约的策略'}>
            <Space size={15} direction='vertical' style={{ width: '100%' }}>
              {
                dataSource.validPolicies.map((vp) => {
                  return (<FContract_AvailablePolicy_Card
                    canSign={dataSource.licensee.isCurrentUser}
                    key={vp.policyId}
                    fullInfo={vp}
                    allVersions={versions.map((vs) => {
                      return vs.version;
                    })}
                    onClickLicense={(vs) => {
                      if (dataSource.licensee.licensorIdentityType === 'resource') {
                        onChange_AppliedVersion(vs.map((v) => {
                          return {
                            version: v,
                            checked: true,
                            policyID: vp.policyId,
                          };
                        }));
                      }
                      if (dataSource.licensee.licensorIdentityType === 'exhibit') {
                        onChange_AppliedExhibit({
                          exhibitID: dataSource.licensee.licenseeID,
                          checked: true,
                          policyID: vp.policyId,
                        });
                      }
                    }}
                  />);
                })
              }
            </Space>
          </FFormLayout.FBlock>)
        }

      </FFormLayout>)
    }

    {/*<FTerminatedContractListDrawer*/}
    {/*  terminatedContractIDs={terminatedContractIDs}*/}
    {/*  onClose={() => {*/}
    {/*    set_terminatedContractIDs([]);*/}
    {/*  }}*/}
    {/*/>*/}
  </FDrawer>);
}

export default FRelationDrawer;

interface HandleFinalResolveResourceParams {
  exhibitID: string;
  resourceID: string;
  policyID: string;
  isUsed: boolean;
}

type HandleFinalResolveResourceReturn = {
  resourceId: string,
  contracts: {
    policyId: string
  }[];
}[];

async function handleFinalResolveResource({
                                            exhibitID,
                                            resourceID,
                                            policyID,
                                            isUsed,
                                          }: HandleFinalResolveResourceParams): Promise<HandleFinalResolveResourceReturn> {

  // console.log(exhibitID, 'exhibitID333333');
  // console.log(resourceID, 'resourceID3232423423423');
  // console.log(policyID, 'policyID234234234');
  // console.log(isUsed, 'isUsed0239j32lkl');

  const params: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
    presentableId: exhibitID,
  };

  const { data } = await FServiceAPI.Exhibit.presentableDetails(params);
  // console.log(data, 'data2903jsaldfksjd');
  return data.resolveResources?.map((rrs: any) => {
    if (resourceID !== rrs.resourceId) {
      return {
        resourceId: rrs.resourceId,
        contracts: rrs.contracts.map((cccttt: any) => {
          return {
            policyId: cccttt.policyId,
          };
        }),
      };
    }
    const policyIDs: string[] = isUsed ? [
      ...rrs.contracts.map((cccttt: any) => {
        return cccttt.policyId;
      }),
      policyID,
    ] : rrs.contracts
      .filter((ccc: any) => {
        return ccc.policyId !== policyID;
      })
      .map((cccttt: any) => {
        return cccttt.policyId;
      });
    // console.log(policyIDs, 'policyIDs@@@#$234234234234');
    return {
      resourceId: rrs.resourceId,
      contracts: Array.from(new Set(policyIDs))
        .map((pID) => {
          return {
            policyId: pID,
          };
        }),
    };
  });
}
