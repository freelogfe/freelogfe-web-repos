import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import { Space } from 'antd';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import { FContentText, FTitleText } from '@/components/FText';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import { FDown, FNodes, FUp, FUser } from '@/components/FIcons';
import FDrawer from '@/components/FDrawer';
import FContractStatusBadge from '@/components/FContractStatusBadge';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import FLoadingTip from '@/components/FLoadingTip';
import FResource from '@/components/FIcons/FResource';
import FPolicyDisplay from '@/components/FPolicyDisplay';
import FDivider from '@/components/FDivider';
import FContractDisplay from '@/components/FContractDisplay';
import FCheckbox from '@/components/FCheckbox';
import FSwitch from '@/components/FSwitch';

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
  contractStatus: 0 | 1 | 2;
  contractText: string;
}

type AssociateContracts = {
  expansion: boolean;
  contractId: string;
  contractName: string;
  contractCreateDate: string;
  contractStatus: 0 | 1 | 2;
  contractText: string;
}[];

interface FContractDetailsDrawerProps {
  contractID?: string;
  onClose?: () => void;
}

interface FContractDetailsDrawerStates {
  baseInfo: BaseInfo | null;
  associateContracts: AssociateContracts | null;
  versionAllContractIDs: {
    version: string;
    contractIDs: string[];
  }[];
  exhibitAllContractIDs: {
    exhibitID: string;
    exhibitName: string;
    resourceID: string;
    contractIDs: string[];
  }[];
}

function FContractDetailsDrawer({ contractID = '', onClose }: FContractDetailsDrawerProps) {
  // console.log(contractID, 'contractID!!!!2341234');

  const [baseInfo, setBaseInfo] = React.useState<FContractDetailsDrawerStates['baseInfo']>(null);
  const [associateContracts, setAssociateContracts] = React.useState<FContractDetailsDrawerStates['associateContracts']>(null);
  const [versionAllContractIDs, setVersionAllContractIDs] = React.useState<FContractDetailsDrawerStates['versionAllContractIDs']>([]);
  const [exhibitAllContractIDs, setExhibitAllContractIDs] = React.useState<FContractDetailsDrawerStates['exhibitAllContractIDs']>([]);

  React.useEffect(() => {
    if (!contractID) {
      return;
    }
    fetchHandleData();
  }, [contractID]);

  async function fetchHandleData() {

    const params: Parameters<typeof FServiceAPI.Contract.contractDetails>[0] = {
      contractId: contractID,
      isLoadPolicyInfo: 1,
    };

    const { data } = await FServiceAPI.Contract.contractDetails(params);
    console.log(data, 'data90234oi');
    const baseInfoData: BaseInfo = {
      subjectId: data.subjectId,
      subjectName: data.subjectName,
      subjectType: data.subjectType,
      subjectCover: '',

      licensorId: data.licensorId,
      licensorName: data.licensorName,
      licensorIdentityType: data.subjectType === 1 ? 'resource' : data.subjectType === 2 ? 'node' : 'user',

      licenseeOwnerIsCurrentUser: data.licenseeOwnerId === FUtil.Tool.getUserIDByCookies(),
      licenseeId: data.licenseeId,
      licenseeName: data.licenseeName,
      licenseeIdentityType: data.licenseeIdentityType === 1 ? 'resource' : data.licenseeIdentityType === 2 ? 'node' : 'user',

      contractId: data.contractId,
      contractName: data.contractName,
      contractCreateDate: FUtil.Format.formatDateTime(data.createDate, true),
      contractStatus: data.status === 1 ? 2 : ((data.authStatus & 1) === 1) ? 1 : 0,
      contractText: data.policyInfo.policyText,
    };

    console.log(data, 'data12432433333########');

    if (data.subjectType === 1) {
      const params1: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: data.subjectId,
      };

      const { data: data1 } = await FServiceAPI.Resource.info(params1);
      // console.log(data1, '!@#$!@#$!@#$');
      if (data1.coverImages.length > 0) {
        baseInfoData.subjectCover = data1.coverImages[0];
      }
    }

    if (baseInfoData.licenseeIdentityType === 'resource' && baseInfoData.licenseeOwnerIsCurrentUser) {
      const params9: Parameters<typeof FServiceAPI.Resource.resolveResources>[0] = {
        resourceId: baseInfoData.licenseeId,
      };
      const { data: data9 } = await FServiceAPI.Resource.resolveResources(params9);
      console.log(data9, 'data92938429342394');
      console.log(baseInfoData.licensorId, 'licensorId23423423');
      const result: FContractDetailsDrawerStates['versionAllContractIDs'] = (data9 as any[])
        .find((d: any) => {
          return d.resourceId === baseInfoData.licensorId;
        })?.versions.map((d: any) => {
          return {
            version: d.version,
            contractIDs: d.contracts.map((c: any) => {
              return c.contractId;
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
        nodeId: data.licenseeId,
        resolveResourceIds: baseInfoData.licensorId,
      };

      // console.log(params5, 'params5!@$@!#$@#$@#');

      const { data: data5 } = await FServiceAPI.Exhibit.presentableList(params5);

      console.log(data5, 'data5!@#$!@#$@#$!@#$!@#$!@#4123421341234');
      const result: FContractDetailsDrawerStates['exhibitAllContractIDs'] = data5
        .map((d5: any) => {
          return d5.resolveResources?.map((resvr: any) => {
            return {
              exhibitID: d5.presentableId,
              exhibitName: d5.presentableName,
              resourceID: resvr.resourceId,
              contractIDs: resvr.contracts.map((cccc: any) => {
                return cccc.contractId;
              }),
            };
          });
        })
        .flat()
        .filter((d5: any) => {
          return baseInfoData.licensorId !== d5.resourceID;
        });
      console.log(result, 'resultresultresult2342980348uoi');
      // console.log(exhibitAllContractIDs, 'exhibitAllContractIDs32dsfsdffs');
      setExhibitAllContractIDs(result);
    } else {
      setExhibitAllContractIDs([]);
    }


    // console.log(data, '@!#$!@#$@#!$@');
    setBaseInfo(baseInfoData);

    const params2: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
      subjectIds: data.subjectId,
      subjectType: data.subjectType,
      licenseeIdentityType: data.licenseeIdentityType,
      licensorId: data.licensorId,
      licenseeId: data.licenseeId,
      isLoadPolicyInfo: 1,
    };
    const { data: data2 } = await FServiceAPI.Contract.batchContracts(params2);
    // console.log(data2, '#$##$@$##$');

    setAssociateContracts(data2
      .filter((d: any) => d.contractId !== data.contractId)
      .map((d: any) => {
        return {
          expansion: false,
          contractId: d.contractId,
          contractName: d.contractName,
          contractCreateDate: FUtil.Format.formatDateTime(d.createDate, true),
          // contractStatus: d.status,
          contractStatus: d.status === 1 ? 2 : ((d.authStatus & 1) === 1) ? 1 : 0,
          contractText: d.policyInfo.policyText,
        };
      }));
  }

  return (<FDrawer
    visible={!!contractID}
    title={'合约详情'}
    onClose={() => onClose && onClose()}
  >
    {
      !baseInfo
        ? <FLoadingTip height={'calc(100vh - 140px)'} />
        : (<FFormLayout>
          <FFormLayout.FBlock title={'标的物'}>
            <Space size={10}>
              <img
                alt=''
                className={styles.targetCover}
                src={baseInfo?.subjectCover || imgSrc}
              />
              <div>
                <FContentText
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
                <FContentText type='negative' text={'授权方'} />
              </div>
              <Space size={10}>
                {
                  baseInfo?.licensorIdentityType === 'resource' && (<FResource />)
                }
                {
                  baseInfo?.licensorIdentityType === 'node' && (<FNodes />)
                }
                {
                  baseInfo?.licensorIdentityType === 'user' && (<FUser />)
                }
                <FContentText
                  type='highlight'
                  text={baseInfo?.licensorName}
                />
              </Space>
            </Space>
            <div style={{ height: 15 }} />
            <Space size={10}>
              <div style={{ width: 80 }}>
                <FContentText
                  type='negative'
                  text={'被授权方'}
                />
              </div>
              <Space size={10}>
                {
                  baseInfo?.licenseeIdentityType === 'resource' && (<FResource />)
                }
                {
                  baseInfo?.licenseeIdentityType === 'node' && (<FNodes />)
                }
                {
                  baseInfo?.licenseeIdentityType === 'user' && (<FUser />)
                }
                <FContentText
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
                  <FContentText
                    text={baseInfo?.contractName}
                    type='highlight'
                  />
                </Space>
              </div>
              <div style={{ height: 10 }} />

              <div style={{ padding: '0 20px' }}>
                <Space size={5}>
                  <FContentText
                    type='additional2'
                    text={`签约时间：${baseInfo?.contractCreateDate}`}
                  />
                  <FDivider style={{ fontSize: 14 }} />
                  <FContentText
                    type='additional2'
                    text={`合约ID：${baseInfo?.contractId}`}
                  />
                </Space>
              </div>
              <div style={{ height: 10 }} />

              {
                contractID && (<FContractDisplay
                  contractID={contractID}
                />)
              }


              {
                versionAllContractIDs.length > 0 && (<>
                  <div style={{ height: 10 }} />
                  <div style={{ padding: '0 20px' }}>
                    <FVersions
                      versionAllContractIDs={versionAllContractIDs}
                      resourceName={baseInfo.licenseeName}
                      currentContractID={contractID}
                    />
                  </div>
                </>)
              }

              {
                exhibitAllContractIDs.length > 0 && (<>
                  <div style={{ height: 10 }} />
                  <div style={{ padding: '0 20px' }}>
                    <FExhibits
                      nodeName={baseInfo.licenseeName}
                      exhibitAllContractIDs={exhibitAllContractIDs}
                      currentContractID={contractID}
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
                            <FContentText
                              text={ac.contractName}
                              type='highlight'
                            />
                          </Space>
                          <div style={{ height: 10 }} />
                          <Space size={40}>
                            <Space size={10}>
                              <FContentText
                                text={'签约时间'}
                                type='additional2'
                              />
                              <FContentText
                                text={ac.contractCreateDate}
                              />
                            </Space>
                            <Space size={10}>
                              <FContentText
                                text={'合约ID'}
                                type='additional2'
                              />
                              <FContentText
                                text={ac.contractId}
                              />
                            </Space>
                          </Space>
                        </div>
                        {
                          ac.expansion ? (<FUp />) : (<FDown />)
                        }

                      </div>

                      <div style={{ display: ac.expansion ? 'block' : 'none' }}>
                        <FContractDisplay
                          contractID={ac.contractId}
                        />
                      </div>


                      {
                        versionAllContractIDs.length > 0 && (<>
                          <div style={{ height: 10 }} />
                          <div style={{ padding: '0 20px' }}>
                            <FVersions
                              versionAllContractIDs={versionAllContractIDs}
                              resourceName={baseInfo.licenseeName}
                              currentContractID={ac.contractId}
                            />

                          </div>
                          <div style={{ height: 10 }} />
                        </>)
                      }

                      {
                        exhibitAllContractIDs.length > 0 && (<>
                          <div style={{ height: 10 }} />
                          <div style={{ padding: '0 20px' }}>
                            <FExhibits
                              nodeName={baseInfo.licenseeName}
                              exhibitAllContractIDs={exhibitAllContractIDs}
                              currentContractID={ac.contractId}
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
  currentContractID: string;
  // onChange()
}

function FVersions({ resourceName, versionAllContractIDs, currentContractID }: FVersionsProps) {
  return (<>
    <FTitleText text={`当前合约资源 ${resourceName} 中各个版本的应用情况`} type='table' />

    <div style={{ height: 10 }} />

    <div className={styles.resourceVersions}>

      {
        versionAllContractIDs.map((vai) => {
          return (<div key={vai.version}>
            <FCheckbox
              checked={vai.contractIDs.includes(currentContractID)}
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
  currentContractID: string;
}

function FExhibits({ nodeName, exhibitAllContractIDs, currentContractID }: FExhibitsProps) {
  return (<>
    <FTitleText text={`当前合约在节点 ${nodeName} 上的应用情况`} type='table' />
    {/*<div style={{ height: 10 }} />*/}
    <div className={styles.nodeExhibits}>
      {
        exhibitAllContractIDs.map((eac) => {
          return (<div key={eac.exhibitID} className={styles.nodeExhibit}>
            <FContentText
              text={eac.exhibitName}
              type='highlight'
            />
            <FSwitch
              checked={eac.contractIDs.includes(currentContractID)}
              // disabled={currentExhibitChecked && currentExhibit && (currentExhibit.contractIDs.length <= 1)}
              onChange={(value) => {
                // await dispatch<UpdateContractUsedAction>({
                //   type: 'exhibitInfoPage/updateContractUsed',
                //   payload: {
                //     exhibitID: ex.id,
                //     resourceID: selectedResource.id,
                //     policyID: c.policyId,
                //     isUsed: value,
                //   },
                // });
                //
                // await dispatch<FetchInfoAction>({
                //   type: 'exhibitInfoPage/fetchInfo',
                // });
              }}
            />
          </div>);
        })
      }

    </div>
  </>);
}
