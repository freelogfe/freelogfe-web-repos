import * as React from 'react';
import styles from './index.less';
import FFormLayout from "@/layouts/FFormLayout";
import {Space} from "antd";
import * as imgSrc from "@/assets/default-resource-cover.jpg";
import {FContentText} from "@/components/FText";
import FIdentityTypeBadge from "@/components/FIdentityTypeBadge";
import {FDown, FNodes, FUp, FUser} from "@/components/FIcons";
import FDivider from "@/components/FDivider";
import FDrawer from "@/components/FDrawer";
import FContractStatusBadge from "@/components/FContractStatusBadge";
import {FTextBtn} from "@/components/FButton";
import FUtil from "@/utils";
import {FApiServer} from "@/services";
import FLoadingTip from "@/components/FLoadingTip";
import FResource from "@/components/FIcons/FResource";

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

interface FContractDetailsDrawerProps {
  contractID: string;
}

function FContractDetailsDrawer({contractID}: FContractDetailsDrawerProps) {
  // console.log(contractID, 'contractID!!!!2341234');

  const [baseInfo, setBaseInfo] = React.useState<BaseInfo | null>(null);

  React.useEffect(() => {
    fetchHandleData();
  }, [contractID]);

  async function fetchHandleData() {
    const params: Parameters<typeof FApiServer.Contract.contractDetails>[0] = {
      contractId: contractID,
      isLoadPolicyInfo: 1,
    };

    const {data} = await FApiServer.Contract.contractDetails(params);
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
      contractStatus: data.status,
      contractText: data.policyInfo.policyText,
    };

    if (data.subjectType === 1) {
      const params1: Parameters<typeof FApiServer.Resource.info>[0] = {
        resourceIdOrName: data.subjectId,
      };

      const {data: data1} = await FApiServer.Resource.info(params1);
      console.log(data1, '!@#$!@#$!@#$');
      if (data1.coverImages.length > 0) {
        baseInfoData.subjectCover = data.coverImages[0];
      }
    }

    // console.log(data, '@!#$!@#$@#!$@');
    setBaseInfo(baseInfoData);
  }

  return (<FDrawer
    visible={!!contractID}
    title={'合约详情'}
  >
    {
      !baseInfo
        ? <FLoadingTip height={'calc(100vh - 140px)'}/>
        : (<FFormLayout>
          <FFormLayout.FBlock title={'标的物'}>
            <Space size={10}>
              <img
                alt=""
                className={styles.targetCover}
                src={baseInfo?.subjectCover || imgSrc}
              />
              <div>
                <FContentText
                  type="highlight"
                  text={baseInfo?.subjectName}
                />
                <div style={{height: 5}}/>
                <FIdentityTypeBadge
                  status={baseInfo?.subjectType === 1 ? 'resource' : 'exhibit'}
                />
              </div>
            </Space>
          </FFormLayout.FBlock>

          <FFormLayout.FBlock title={'缔约方'}>
            <Space size={10}>
              <div style={{width: 80}}>
                <FContentText type="negative" text={'授权方'}/>
              </div>
              <Space size={10}>
                {
                  baseInfo?.licensorIdentityType === 1 && (<FResource/>)
                }
                {
                  baseInfo?.licensorIdentityType === 2 && (<FNodes/>)
                }
                {
                  baseInfo?.licensorIdentityType === 3 && (<FUser/>)
                }
                <FContentText
                  type="highlight"
                  text={baseInfo?.licensorName}
                />
              </Space>
            </Space>
            <div style={{height: 15}}/>
            <Space size={10}>
              <div style={{width: 80}}>
                <FContentText type="negative" text={'被授权方'}/>
              </div>
              <Space size={10}>
                {
                  baseInfo?.licenseeIdentityType === 1 && (<FResource/>)
                }
                {
                  baseInfo?.licenseeIdentityType === 2 && (<FNodes/>)
                }
                {
                  baseInfo?.licenseeIdentityType === 3 && (<FUser/>)
                }
                <FContentText
                  type="highlight"
                  text={baseInfo?.licenseeName}
                />
              </Space>
            </Space>
          </FFormLayout.FBlock>

          <FFormLayout.FBlock title={'所签授权策略'}>
            <Space size={10}>
              <FContentText
                text={baseInfo?.contractName}
                type="highlight"
              />
              <FContractStatusBadge
                status={baseInfo?.contractStatus === 0 ? 'authorized' : 'stopped'}
              />
            </Space>

            <div style={{height: 10}}/>
            <Space size={2}>
              <FContentText
                type="additional2"
                text={`签约时间：${baseInfo?.contractCreateDate}`}
              />
              <FDivider style={{fontSize: 14}}/>
              <FContentText
                type="additional2"
                text={`合约ID：${baseInfo?.contractId}`}
              />
            </Space>

            <div style={{height: 20}}/>
            <Space className={styles.navs}>
              <div>
                <FContentText text={'合约状态机'}/>
                <div style={{height: 4}}/>
              </div>
            </Space>
            <pre className={styles.policyText}>
                {baseInfo?.contractText}
              </pre>
          </FFormLayout.FBlock>

          <FFormLayout.FBlock title={'关联合约'}>
            <Space size={10} direction="vertical" className={styles.associateContracts}>
              <div className={styles.associateContract}>
                <div className={styles.associateContractHeader}>
                  <div>
                    <Space size={10}>
                      <FContentText text={'免费授权策略'} type="highlight"/>
                      <FContractStatusBadge status="pending"/>
                    </Space>
                    <div style={{height: 10}}/>
                    <Space size={40}>
                      <Space size={10}>
                        <FContentText text={'签约时间'} type="additional2"/>
                        <FContentText text={'2020/09/09 12:00'}/>
                      </Space>
                      <Space size={10}>
                        <FContentText text={'合约ID'} type="additional2"/>
                        <FContentText text={'asakfhadghsifdhdidhfsfoh'}/>
                      </Space>
                    </Space>
                  </div>
                  <FUp/>
                </div>
                <div className={styles.contractText}>
              <pre>{`for public:
    escrow account acct
    custom event acceptor.customEvent
      initial:
         recontractable
         proceed to
               auth:
         presentable
         recontractable
         active
         proceed to refund on acct.confiscated
      refund:
         recontractable
         proceed to finish on acct.refunded
      finish:
         recontractable
         terminate`}</pre>
                </div>
              </div>

              <div className={styles.associateContract}>
                <div className={styles.associateContractHeader}>
                  <div>
                    <Space size={10}>
                      <FContentText text={'免费授权策略'} type="highlight"/>
                      <FContractStatusBadge status="stopped"/>
                    </Space>
                    <div style={{height: 10}}/>
                    <Space size={40}>
                      <Space size={10}>
                        <FContentText text={'签约时间'} type="additional2"/>
                        <FContentText text={'2020/09/09 12:00'}/>
                      </Space>
                      <Space size={10}>
                        <FContentText text={'合约ID'} type="additional2"/>
                        <FContentText text={'asakfhadghsifdhdidhfsfoh'}/>
                      </Space>
                    </Space>
                  </div>
                  <FDown/>
                </div>
              </div>

            </Space>
          </FFormLayout.FBlock>
        </FFormLayout>)
    }

  </FDrawer>);
}

export default FContractDetailsDrawer;
