import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import { Space } from 'antd';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
// import { FNodes, FUp } from '@/components/FIcons';
import FDrawer from '@/components/FDrawer';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import FLoadingTip from '@/components/FLoadingTip';
// import FResource from '@/components/FIcons/FResource';
import FDivider from '@/components/FDivider';
import FContractDisplay from '@/components/FContractDisplay';
import FCheckbox from '@/components/FCheckbox';
import FSwitch from '@/components/FSwitch';
import FCoverImage from '@/components/FCoverImage';
import FComponentsLib from '@freelog/components-lib';

interface BaseInfo {
  subjectId: string;
  subjectName: string;
  subjectType: 1 | 2 | 3;
  subjectCover: string;

  licensorId: string;
  licensorName: string;
  licensorIdentityType: 'resource' | 'node' | 'user';

  licenseeOwnerIsCurrentUser: boolean;
  licenseeId: string;
  licenseeName: string;
  licenseeIdentityType: 'resource' | 'node' | 'user';

  contractId: string;
  contractName: string;
  contractCreateDate: string;
  contractStatus: 'active' | 'testActive' | 'inactive' | 'terminal';

  policyID: string;
  policyText: string;
}

type AssociateContracts = {
  expansion: boolean;
  contractId: string;
  contractName: string;
  contractCreateDate: string;
  contractStatus: 'active' | 'testActive' | 'inactive' | 'terminal';
  policyID: string;
  policyText: string;
}[];

interface FContractDetailsDrawerProps {
  contractID?: string;
  onClose?: () => void;

  onChange_SomeContract?(): void;
}

interface FContractDetailsDrawerStates {
  isSelfLicensorOwner: boolean;
  isSelfLicenseeOwner: boolean;

  baseInfo: BaseInfo | null;
  associateContracts: AssociateContracts | null;
  versionAllContractIDs: {
    version: string;
    policyIDs: string[];
  }[];
  exhibitAllContractIDs: {
    exhibitID: string;
    exhibitName: string;
    resourceID: string;
    policyIDs: string[];
  }[];
}

const initStates: FContractDetailsDrawerStates = {
  isSelfLicensorOwner: false,
  isSelfLicenseeOwner: false,

  baseInfo: null,
  associateContracts: null,
  versionAllContractIDs: [],
  exhibitAllContractIDs: [],
};

function FContractDetailsDrawer({ contractID = '', onClose, onChange_SomeContract }: FContractDetailsDrawerProps) {
  // console.log(contractID, 'contractID!!!!2341234');

  const [isSelfLicensorOwner, set_IsSelfLicensorOwner] = React.useState<FContractDetailsDrawerStates['isSelfLicensorOwner']>(initStates['isSelfLicensorOwner']);
  const [isSelfLicenseeOwner, set_IsSelfLicenseeOwner] = React.useState<FContractDetailsDrawerStates['isSelfLicenseeOwner']>(initStates['isSelfLicenseeOwner']);
  const [baseInfo, setBaseInfo] = React.useState<FContractDetailsDrawerStates['baseInfo']>(initStates['baseInfo']);
  const [associateContracts, setAssociateContracts] = React.useState<FContractDetailsDrawerStates['associateContracts']>(initStates['associateContracts']);
  const [versionAllContractIDs, setVersionAllContractIDs] = React.useState<FContractDetailsDrawerStates['versionAllContractIDs']>(initStates['versionAllContractIDs']);
  const [exhibitAllContractIDs, setExhibitAllContractIDs] = React.useState<FContractDetailsDrawerStates['exhibitAllContractIDs']>(initStates['exhibitAllContractIDs']);

  React.useEffect(() => {
    if (!contractID) {
      return;
    }
    fetchHandleData();
  }, [contractID]);

  function onChange_DrawerVisible(visible: boolean) {
    if (!visible) {
      setBaseInfo(initStates['baseInfo']);
      setAssociateContracts(initStates['associateContracts']);
      setVersionAllContractIDs(initStates['versionAllContractIDs']);
      setExhibitAllContractIDs(initStates['exhibitAllContractIDs']);
    }
  }

  async function fetchHandleData() {

    const params: Parameters<typeof FServiceAPI.Contract.contractDetails>[0] = {
      contractId: contractID,
      isLoadPolicyInfo: 1,
    };

    const { data: data_contractDetails } = await FServiceAPI.Contract.contractDetails(params);
    set_IsSelfLicensorOwner(data_contractDetails.licensorOwnerId === FUtil.Tool.getUserIDByCookies());
    set_IsSelfLicenseeOwner(data_contractDetails.licenseeOwnerId === FUtil.Tool.getUserIDByCookies());
    // console.log(data, 'data90234oi');
    const baseInfoData: BaseInfo = {
      subjectId: data_contractDetails.subjectId,
      subjectName: data_contractDetails.subjectName,
      subjectType: data_contractDetails.subjectType,
      subjectCover: '',

      licensorId: data_contractDetails.licensorId,
      licensorName: data_contractDetails.licensorName,
      licensorIdentityType: data_contractDetails.subjectType === 1 ? 'resource' : data_contractDetails.subjectType === 2 ? 'node' : 'user',

      licenseeOwnerIsCurrentUser: data_contractDetails.licenseeOwnerId === FUtil.Tool.getUserIDByCookies(),
      licenseeId: data_contractDetails.licenseeId,
      licenseeName: data_contractDetails.licenseeName,
      licenseeIdentityType: data_contractDetails.licenseeIdentityType === 1 ? 'resource' : data_contractDetails.licenseeIdentityType === 2 ? 'node' : 'user',

      contractId: data_contractDetails.contractId,
      contractName: data_contractDetails.contractName,
      contractCreateDate: FUtil.Format.formatDateTime(data_contractDetails.createDate, true),
      contractStatus: data_contractDetails.status === 1 ? 'terminal' : (data_contractDetails.authStatus === 1 || data_contractDetails.authStatus === 3) ? 'active' : data_contractDetails.authStatus === 2 ? 'testActive' : 'inactive',

      policyID: data_contractDetails.policyId,
      policyText: data_contractDetails.policyInfo.policyText,
    };

    // console.log(data, 'data12432433333########');

    if (data_contractDetails.subjectType === 1) {
      const params1: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: data_contractDetails.subjectId,
      };

      const { data: data1 } = await FServiceAPI.Resource.info(params1);
      // console.log(data1, '!@#$!@#$!@#$');
      if (data1.coverImages.length > 0) {
        baseInfoData.subjectCover = data1.coverImages[0];
      }
    } else if (data_contractDetails.subjectType === 2) {
      const params1: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
        presentableId: data_contractDetails.subjectId,
      };

      const { data: data1 } = await FServiceAPI.Exhibit.presentableDetails(params1);
      // console.log(data1, '展品详情!@#$!@#$!@#$');
      if (data1.coverImages.length > 0) {
        baseInfoData.subjectCover = data1.coverImages[0];
      }
    }

    if (baseInfoData.licenseeIdentityType === 'resource' && baseInfoData.licenseeOwnerIsCurrentUser) {
      const params9: Parameters<typeof FServiceAPI.Resource.resolveResources>[0] = {
        resourceId: baseInfoData.licenseeId,
      };
      const { data: data9 } = await FServiceAPI.Resource.resolveResources(params9);
      // console.log(data9, 'data92938429342394');
      // console.log(baseInfoData.licensorId, 'licensorId23423423');
      const result: FContractDetailsDrawerStates['versionAllContractIDs'] = (data9 as any[])
        .find((d: any) => {
          return d.resourceId === baseInfoData.licensorId;
        })?.versions.map((d: any) => {
          return {
            version: d.version,
            policyIDs: d.contracts.map((c: any) => {
              return c.policyId;
            }),
          };
        }) || [];

      // console.log(result, 'resultresultresult23980423ioRRRRRR');
      setVersionAllContractIDs(result);
    } else {
      setVersionAllContractIDs([]);
    }

    // console.log(baseInfoData, 'baseInfoData234234234');
    if (baseInfoData.licenseeIdentityType === 'node' && baseInfoData.licenseeOwnerIsCurrentUser) {
      // 根据资源 id 批量查询所有合同
      const params5: Parameters<typeof FServiceAPI.Exhibit.presentableList>[0] = {
        nodeId: data_contractDetails.licenseeId,
        resolveResourceIds: baseInfoData.licensorId,
      };

      // console.log(params5, 'params5!@$@!#$@#$@#');

      const { data: data5 } = await FServiceAPI.Exhibit.presentableList(params5);

      // console.log(data5, 'data5!@#$!@#$@#$!@#$!@#$!@#4123421341234');
      const result: FContractDetailsDrawerStates['exhibitAllContractIDs'] = data5
        .map((d5: any) => {
          return d5.resolveResources?.map((resvr: any) => {
            return {
              exhibitID: d5.presentableId,
              exhibitName: d5.presentableName,
              resourceID: resvr.resourceId,
              policyIDs: resvr.contracts.map((cccc: any) => {
                return cccc.policyId;
              }),
            };
          });
        })
        .flat()
        .filter((d5: any) => {
          return baseInfoData.licensorId === d5.resourceID;
        });
      // console.log(result, 'resultresultresult2342980348uoi');
      // console.log(exhibitAllContractIDs, 'exhibitAllContractIDs32dsfsdffs');
      setExhibitAllContractIDs(result);
    } else {
      setExhibitAllContractIDs([]);
    }


    // console.log(data, '@!#$!@#$@#!$@');
    setBaseInfo(baseInfoData);

    const params2: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
      subjectIds: data_contractDetails.subjectId,
      subjectType: data_contractDetails.subjectType,
      licenseeIdentityType: data_contractDetails.licenseeIdentityType,
      licensorId: data_contractDetails.licensorId,
      licenseeId: data_contractDetails.licenseeId,
      isLoadPolicyInfo: 1,
    };
    const { data: data2 } = await FServiceAPI.Contract.batchContracts(params2);
    // console.log(data2, 'data22222222#$##$@$##$');
    const AssociateContractsResult: FContractDetailsDrawerStates['associateContracts'] = (data2 as any)
      .filter((d: any) => d.contractId !== data_contractDetails.contractId)
      .map((d: any) => {
        return {
          expansion: false,
          contractId: d.contractId,
          contractName: d.contractName,
          contractCreateDate: FUtil.Format.formatDateTime(d.createDate, true),
          // contractStatus: d.status === 1 ? 2 : ((d.authStatus & 1) === 1) ? 1 : 0,
          contractStatus: d.status === 1 ? 'terminal' : (d.authStatus === 1 || d.authStatus === 3) ? 'active' : d.authStatus === 2 ? 'testActive' : 'inactive',
          policyID: d.policyId,
          policyText: d.policyInfo.policyText,
        };
      });
    // console.log(AssociateContractsResult, 'AssociateContractsResult290342309u');
    setAssociateContracts(AssociateContractsResult);
  }

  async function syncVersionUsedContracts(value: FContractDetailsDrawerStates['versionAllContractIDs'][number]) {
    // @ts-ignore
    const params: Parameters<typeof FServiceAPI.Resource.updateResourceVersionInfo>[0] = {
      version: value.version,
      resourceId: baseInfo?.licenseeId || '',
      resolveResources: [{
        resourceId: baseInfo?.licensorId || '',
        contracts: value.policyIDs.map((p) => {
          return {
            policyId: p,
          };
        }),
      }],
    };

    const { data, errCode } = await FServiceAPI.Resource.updateResourceVersionInfo(params);
    if (errCode !== 0 || !data) {
      setVersionAllContractIDs(versionAllContractIDs);
    }
    // console.log(data, 'updateResourceVersionInfo@#$@#$@#$@#$@34234234');
  }

  async function syncExhibitUsedContracts(value: FContractDetailsDrawerStates['exhibitAllContractIDs'][number]) {

    const params2: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
      // presentableId: data[0].presentableId,
      presentableId: value.exhibitID,
      resolveResources: [{
        resourceId: baseInfo?.licensorId || '',
        contracts: value.policyIDs.map((p) => {
          return {
            policyId: p,
          };
        }),
      }],
    };
    const { data: data2, errCode: errCode2 } = await FServiceAPI.Exhibit.updatePresentable(params2);
    // console.log(data2, '@@@@#$23498');
    if (errCode2 !== 0 || !data2) {
      setExhibitAllContractIDs(exhibitAllContractIDs);
    }
  }

  function reportedInformation() {
    onChange_SomeContract && onChange_SomeContract();
  }

  return (<FDrawer
    // visible={!!contractID}
    open={!!contractID}
    title={'合约详情'}
    onClose={() => onClose && onClose()}
    // afterVisibleChange={onChange_DrawerVisible}
    afterOpenChange={onChange_DrawerVisible}
  >
    {
      !baseInfo
        ? <FLoadingTip height={'calc(100vh - 140px)'} />
        : (<FFormLayout>
          <FFormLayout.FBlock title={'标的物'}>
            <Space size={10}>
              <FCoverImage src={baseInfo?.subjectCover || ''} width={60} />
              <div>
                <FComponentsLib.FContentText
                  type='highlight'
                  text={baseInfo?.subjectName}
                />
                <div style={{ height: 5 }} />
                <FIdentityTypeBadge
                  status={baseInfo?.subjectType === 1 ? 'resource' : 'exhibit'}
                />
              </div>
            </Space>
          </FFormLayout.FBlock>

          <FFormLayout.FBlock title={'缔约方'}>
            <Space size={10}>
              <div style={{ width: 80 }}>
                <FComponentsLib.FContentText type='negative' text={'授权方'} />
              </div>
              <Space size={10}>
                {
                  baseInfo?.licensorIdentityType === 'resource' && (<FComponentsLib.FIcons.FResource />)
                }
                {
                  baseInfo?.licensorIdentityType === 'node' && (<FComponentsLib.FIcons.FNodes />)
                }
                {
                  baseInfo?.licensorIdentityType === 'user' && (<FComponentsLib.FIcons.FUser />)
                }
                <FComponentsLib.FContentText
                  type='highlight'
                  text={baseInfo?.licensorName}
                />
              </Space>
            </Space>
            <div style={{ height: 15 }} />
            <Space size={10}>
              <div style={{ width: 80 }}>
                <FComponentsLib.FContentText
                  type='negative'
                  text={'被授权方'}
                />
              </div>
              <Space size={10}>
                {
                  baseInfo?.licenseeIdentityType === 'resource' && (<FComponentsLib.FIcons.FResource />)
                }
                {
                  baseInfo?.licenseeIdentityType === 'node' && (<FComponentsLib.FIcons.FNodes />)
                }
                {
                  baseInfo?.licenseeIdentityType === 'user' && (<FComponentsLib.FIcons.FUser />)
                }
                <FComponentsLib.FContentText
                  type='highlight'
                  text={baseInfo?.licenseeName}
                />
              </Space>
            </Space>
          </FFormLayout.FBlock>

          <FFormLayout.FBlock title={'所签授权策略'}>
            <div className={styles.currentContract}>
              <div style={{ height: 15 }} />
              <div style={{ padding: '0 20px' }}>
                <Space size={10}>
                  <FComponentsLib.FContentText
                    text={baseInfo?.contractName}
                    type='highlight'
                  />
                </Space>
              </div>
              <div style={{ height: 10 }} />

              <div style={{ padding: '0 20px' }}>
                <Space size={5}>
                  <FComponentsLib.FContentText
                    type='additional2'
                    text={`签约时间：${baseInfo?.contractCreateDate}`}
                  />
                  <FDivider style={{ fontSize: 14 }} />
                  <FComponentsLib.FContentText
                    type='additional2'
                    text={`合约ID：${baseInfo?.contractId}`}
                  />
                </Space>
              </div>
              <div style={{ height: 10 }} />

              {
                contractID && (<div style={{ padding: '0 20px' }}>
                  <FContractDisplay
                    contractID={contractID}
                    onChangedEvent={() => {
                      reportedInformation();
                    }}
                  />
                </div>)
              }
              <div style={{ height: 15 }} />
              {
                isSelfLicenseeOwner && versionAllContractIDs.length > 0 && baseInfo.contractStatus !== 'terminal' && (<>

                  <div style={{ padding: '0 20px' }}>
                    <FVersions
                      versionAllContractIDs={versionAllContractIDs}
                      resourceName={baseInfo.licenseeName}
                      currentPolicyID={baseInfo.policyID}
                      // onChangeVersionAllContractIDs={(value) => {
                      //   // console.log(value, '@#$@#$@#');
                      //   setVersionAllContractIDs(value);
                      //   reportedInformation();
                      // }}
                      onChangeVersionContractIDs={async (value, values) => {
                        // console.log(value, '##$@#$@#$');
                        setVersionAllContractIDs(values);
                        await syncVersionUsedContracts(value);
                        reportedInformation();
                      }}
                    />
                  </div>
                </>)
              }

              {
                isSelfLicenseeOwner && exhibitAllContractIDs.length > 0 && baseInfo.contractStatus !== 'terminal' && (<>
                  <div style={{ padding: '0 20px' }}>
                    <FExhibits
                      nodeName={baseInfo.licenseeName}
                      exhibitAllContractIDs={exhibitAllContractIDs}
                      currentPolicyID={baseInfo.policyID}
                      // onChangeExhibitAllContractIDs={(value) => {
                      //   // console.log(value, '@#$@#$@#$@#09sdj');
                      //   setExhibitAllContractIDs(value);
                      //   reportedInformation();
                      // }}
                      onChangeExhibitContractIDs={async (value, values) => {
                        // console.log(value, '@#$@#098jsdlfkjl');
                        setExhibitAllContractIDs(values);
                        await syncExhibitUsedContracts(value);
                        reportedInformation();
                      }}
                    />
                  </div>
                </>)
              }

            </div>
          </FFormLayout.FBlock>
          {/*{console.log(associateContracts, 'associateContractsassociateContractsassociateContractsassociateContracts')}*/}
          {
            associateContracts && associateContracts.length > 0 && (<FFormLayout.FBlock title={'关联合约'}>
              <Space size={10} direction='vertical' className={styles.associateContracts}>
                {
                  associateContracts?.map((ac) => {
                    return (<div
                      key={ac.contractId}
                      className={styles.associateContract}
                    >
                      <div
                        className={styles.associateContractHeader}
                        onClick={() => {
                          setAssociateContracts(associateContracts?.map((acm) => {
                            if (acm.contractId !== ac.contractId) {
                              return acm;
                            }
                            return {
                              ...acm,
                              expansion: !acm.expansion,
                            };
                          }));
                        }}
                      >
                        <div>
                          <Space size={10}>
                            <FComponentsLib.FContentText
                              text={ac.contractName}
                              type='highlight'
                            />
                          </Space>
                          <div style={{ height: 10 }} />
                          <Space size={40}>
                            <Space size={10}>
                              <FComponentsLib.FContentText
                                text={'签约时间'}
                                type='additional2'
                              />
                              <FComponentsLib.FContentText
                                text={ac.contractCreateDate}
                              />
                            </Space>
                            <Space size={10}>
                              <FComponentsLib.FContentText
                                text={'合约ID'}
                                type='additional2'
                              />
                              <FComponentsLib.FContentText
                                text={ac.contractId}
                              />
                            </Space>
                          </Space>
                        </div>
                        {
                          ac.expansion ? (<FComponentsLib.FIcons.FUp />) : (<FComponentsLib.FIcons.FDown />)
                        }

                      </div>

                      <div style={{ display: ac.expansion ? 'block' : 'none', padding: '0 20px' }}>
                        <FContractDisplay
                          contractID={ac.contractId}
                          onChangedEvent={() => {
                            reportedInformation();
                          }}
                        />
                        <div style={{ height: 10 }} />
                      </div>

                      {
                        isSelfLicenseeOwner && versionAllContractIDs.length > 0 && ac.contractStatus !== 'terminal' && (<>
                          {/*<div style={{ height: 10 }} />*/}
                          {
                            !ac.expansion && (<>
                              <div style={{ borderTop: '1px solid #E5E7EB', margin: '0 20px' }} />
                              <div style={{ height: 15 }} />
                            </>)
                          }


                          <div style={{ padding: '0 20px' }}>
                            <FVersions
                              versionAllContractIDs={versionAllContractIDs}
                              resourceName={baseInfo.licenseeName}
                              currentPolicyID={ac.policyID}
                              // onChangeVersionAllContractIDs={(value) => {
                              //   // console.log(value, '@#$@#$@#');
                              //   setVersionAllContractIDs(value);
                              //   reportedInformation();
                              // }}
                              onChangeVersionContractIDs={async (value, values) => {
                                // console.log(value, '##$@#$@#$');
                                setVersionAllContractIDs(values);
                                await syncVersionUsedContracts(value);
                                reportedInformation();
                              }}
                            />

                          </div>
                          <div style={{ height: 10 }} />
                        </>)
                      }

                      {
                        isSelfLicenseeOwner && exhibitAllContractIDs.length > 0 && ac.contractStatus !== 'terminal' && (<>
                          {/*<div style={{ height: 10 }} />*/}

                          {
                            !ac.expansion && (<>
                              <div style={{ borderTop: '1px solid #E5E7EB', margin: '0 20px' }} />
                              <div style={{ height: 15 }} />
                            </>)
                          }

                          <div style={{ padding: '0 20px' }}>
                            <FExhibits
                              nodeName={baseInfo.licenseeName}
                              exhibitAllContractIDs={exhibitAllContractIDs}
                              currentPolicyID={ac.policyID}
                              // onChangeExhibitAllContractIDs={(value) => {
                              //   // console.log(value, '@#$@#$@#$@#09sdj');
                              //   setExhibitAllContractIDs(value);
                              //   reportedInformation();
                              // }}
                              onChangeExhibitContractIDs={async (value, values) => {
                                // console.log(value, '@#$@#098jsdlfkjl');
                                setExhibitAllContractIDs(values);
                                await syncExhibitUsedContracts(value);
                                reportedInformation();
                              }}
                            />
                          </div>
                        </>)
                      }

                    </div>);
                  })
                }

              </Space>
            </FFormLayout.FBlock>)
          }

        </FFormLayout>)
    }
  </FDrawer>);
}

export default FContractDetailsDrawer;

interface FVersionsProps {
  resourceName: string;
  versionAllContractIDs: FContractDetailsDrawerStates['versionAllContractIDs'];
  currentPolicyID: string;

  // onChangeVersionAllContractIDs?(value: FContractDetailsDrawerStates['versionAllContractIDs']): void;

  onChangeVersionContractIDs?(changedContractIDs: FContractDetailsDrawerStates['versionAllContractIDs'][number], allContractIDs: FContractDetailsDrawerStates['versionAllContractIDs']): void;
}

function FVersions({
                     resourceName,
                     versionAllContractIDs,
                     currentPolicyID,
                     // onChangeVersionAllContractIDs,
                     onChangeVersionContractIDs,
                   }: FVersionsProps) {
  return (<>
    <FComponentsLib.FTitleText text={`当前合约资源 ${resourceName} 中各个版本的应用情况`} type='table'
                               style={{ fontSize: 12 }} />

    <div style={{ height: 10 }} />

    <div className={styles.resourceVersions}>
      {
        versionAllContractIDs.map((vai, ind, list) => {
          const checked: boolean = vai.policyIDs.includes(currentPolicyID);
          return (<div key={vai.version}>
            <FCheckbox
              checked={checked}
              disabled={checked && vai.policyIDs.length === 1}
              onChange={(e) => {
                const versionContractIDs: FContractDetailsDrawerStates['versionAllContractIDs'][number] = {
                  ...vai,
                  policyIDs: e.target.checked
                    ? [
                      ...vai.policyIDs,
                      currentPolicyID,
                    ]
                    : vai.policyIDs.filter((c) => c !== currentPolicyID),
                };

                const all: FContractDetailsDrawerStates['versionAllContractIDs'] = list.map((ea) => {
                  if (ea.version !== vai.version) {
                    return ea;
                  }
                  return versionContractIDs;
                });

                onChangeVersionContractIDs && onChangeVersionContractIDs(versionContractIDs, all);
                // onChangeVersionAllContractIDs && onChangeVersionAllContractIDs(all);
              }}
            />
            <span>{vai.version}</span>
          </div>);
        })
      }
    </div>
  </>);
}

interface FExhibitsProps {
  nodeName: string;
  exhibitAllContractIDs: FContractDetailsDrawerStates['exhibitAllContractIDs'];
  currentPolicyID: string;

  // onChangeExhibitAllContractIDs?(value: FContractDetailsDrawerStates['exhibitAllContractIDs']): void;

  onChangeExhibitContractIDs?(changedContractIDs: FContractDetailsDrawerStates['exhibitAllContractIDs'][number], allContractIDs: FContractDetailsDrawerStates['exhibitAllContractIDs']): void;
}

function FExhibits({
                     nodeName,
                     exhibitAllContractIDs,
                     // currentContractID,
                     currentPolicyID,
                     // onChangeExhibitAllContractIDs,
                     onChangeExhibitContractIDs,
                   }: FExhibitsProps) {

  return (<>
    <FComponentsLib.FTitleText text={`当前合约在节点 ${nodeName} 上的应用情况`} type='table' style={{ fontSize: 12 }} />
    {/*<div style={{ height: 10 }} />*/}
    <div className={styles.nodeExhibits}>
      {
        exhibitAllContractIDs.map((eac, ind, list) => {
          const checked: boolean = eac.policyIDs.includes(currentPolicyID);
          return (<div key={eac.exhibitID} className={styles.nodeExhibit}>
            <Space size={5}>
              <label className={styles.nodeExhibitLabel}>展品</label>
              {/*<a className={styles.nodeExhibitNameLink}>{eac.exhibitName}</a>*/}
              <a
                type='default'
                className={styles.nodeExhibitNameLink}
                onClick={() => {
                  window.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.exhibitManagement({ exhibitID: eac.exhibitID }));
                }}
              >{eac.exhibitName}</a>
            </Space>

            <FSwitch
              checked={checked}
              disabled={checked && eac.policyIDs.length === 1}
              onChange={(value) => {
                const exhibitContractIDs: FContractDetailsDrawerStates['exhibitAllContractIDs'][number] = {
                  ...eac,
                  policyIDs: value
                    ? [
                      ...eac.policyIDs,
                      currentPolicyID,
                    ]
                    : eac.policyIDs.filter((c) => c !== currentPolicyID),
                };

                const all: FContractDetailsDrawerStates['exhibitAllContractIDs'] = list.map((ea) => {
                  if (ea.exhibitID !== eac.exhibitID) {
                    return ea;
                  }
                  return exhibitContractIDs;
                });

                onChangeExhibitContractIDs && onChangeExhibitContractIDs(exhibitContractIDs, all);
                // onChangeExhibitAllContractIDs && onChangeExhibitAllContractIDs(all);

              }}
            />
          </div>);
        })
      }

    </div>
  </>);
}
