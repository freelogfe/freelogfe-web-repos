import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import { Space } from 'antd';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import { FContentText } from '@/components/FText';
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

interface BaseInfo {
  subjectId: string;
  subjectName: string;
  subjectType: 1 | 2 | 3;
  subjectCover: string;

  licensorId: string;
  licensorName: string;
  licensorIdentityType: 1 | 2 | 3;

  licenseeId: string;
  licenseeName: string;
  licenseeIdentityType: 1 | 2 | 3;

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

function FContractDetailsDrawer({ contractID = '', onClose }: FContractDetailsDrawerProps) {
  // console.log(contractID, 'contractID!!!!2341234');

  const [baseInfo, setBaseInfo] = React.useState<BaseInfo | null>(null);
  const [associateContracts, setAssociateContracts] = React.useState<AssociateContracts | null>(null);

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
    const baseInfoData: BaseInfo = {
      subjectId: data.subjectId,
      subjectName: data.subjectName,
      subjectType: data.subjectType,
      subjectCover: '',

      licensorId: data.licensorId,
      licensorName: data.licensorName,
      licensorIdentityType: data.subjectType === 1 ? 1 : 2,

      licenseeId: data.licenseeId,
      licenseeName: data.licenseeName,
      licenseeIdentityType: data.licenseeIdentityType,

      contractId: data.contractId,
      contractName: data.contractName,
      contractCreateDate: FUtil.Format.formatDateTime(data.createDate, true),
      contractStatus: data.status === 1 ? 2 : ((data.authStatus & 1) === 1) ? 1 : 0,
      contractText: data.policyInfo.policyText,
    };

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
                  baseInfo?.licensorIdentityType === 1 && (<FResource />)
                }
                {
                  baseInfo?.licensorIdentityType === 2 && (<FNodes />)
                }
                {
                  baseInfo?.licensorIdentityType === 3 && (<FUser />)
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
                  baseInfo?.licenseeIdentityType === 1 && (<FResource />)
                }
                {
                  baseInfo?.licenseeIdentityType === 2 && (<FNodes />)
                }
                {
                  baseInfo?.licenseeIdentityType === 3 && (<FUser />)
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
              <div style={{ padding: '15px 20px' }}>
                <Space size={10}>
                  <FContentText
                    text={baseInfo?.contractName}
                    type='highlight'
                  />
                  {/*<FContractStatusBadge*/}
                  {/*  status={FUtil.Predefined.EnumContractStatus[baseInfo?.contractStatus || 0] as 'authorized'}*/}
                  {/*/>*/}
                </Space>
              </div>

              {/*<div style={{ height: 10 }} />*/}

              {/*{baseInfo && (<FPolicyDisplay*/}
              {/*  code={baseInfo.contractText}*/}
              {/*  containerHeight={170}*/}
              {/*/>)}*/}

              {/*{console.log(contractID, 'contractID12342342ojlksdfjlasdkfsdf')}*/}
              {
                contractID && (<FContractDisplay
                  contractID={contractID}
                />)
              }

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
                            {/*<FContractStatusBadge*/}
                            {/*  // status={ac.contractStatus === 1 ? 'authorized' : 'stopped'}*/}
                            {/*  status={FUtil.Predefined.EnumContractStatus[baseInfo?.contractStatus || 0] as 'authorized'}*/}
                            {/*/>*/}
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
                      {/*{*/}
                      {/*  ac.expansion && (<FPolicyDisplay*/}
                      {/*    code={ac.contractText}*/}
                      {/*    containerHeight={170}*/}
                      {/*  />)*/}
                      {/*}*/}

                      <div style={{ display: ac.expansion ? 'block' : 'none'}}>
                        <FContractDisplay
                          contractID={ac.contractId}
                        />
                      </div>

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


