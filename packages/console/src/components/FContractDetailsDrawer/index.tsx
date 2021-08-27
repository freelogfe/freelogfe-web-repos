import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import { Space } from 'antd';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import { FContentText, FTipText, FTitleText } from '@/components/FText';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import { FDown, FNodes, FUp, FUser } from '@/components/FIcons';
import FDivider from '@/components/FDivider';
import FDrawer from '@/components/FDrawer';
import FContractStatusBadge from '@/components/FContractStatusBadge';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import FLoadingTip from '@/components/FLoadingTip';
import FResource from '@/components/FIcons/FResource';
import { FRectBtn } from '@/components/FButton';
import FModal from '@/components/FModal';
import FInput from '@/components/FInput';

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
    fetchHandleData();
  }, [contractID, fetchHandleData]);

  async function fetchHandleData() {
    if (!contractID) {
      return;
    }
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
            <Space size={10}>
              <FContentText
                text={baseInfo?.contractName}
                type='highlight'
              />
              <FContractStatusBadge
                // status={baseInfo?.contractStatus === 0 ? 'authorized' : 'stopped'}
                status={FUtil.Predefined.EnumContractStatus[baseInfo?.contractStatus || 0] as 'authorized'}
              />
            </Space>

            <div style={{ height: 10 }} />
            {/*<Space size={2}>*/}
            {/*  <FContentText*/}
            {/*    type='additional2'*/}
            {/*    text={`签约时间：${baseInfo?.contractCreateDate}`}*/}
            {/*  />*/}
            {/*  <FDivider style={{ fontSize: 14 }} />*/}
            {/*  <FContentText*/}
            {/*    type='additional2'*/}
            {/*    text={`合约ID：${baseInfo?.contractId}`}*/}
            {/*  />*/}
            {/*</Space>*/}

            {/*<div style={{ height: 20 }} />*/}
            {/*<Space className={styles.navs}>*/}
            {/*  <div>*/}
            {/*    <FContentText text={'合约状态机'} />*/}
            {/*    <div style={{ height: 4 }} />*/}
            {/*  </div>*/}
            {/*</Space>*/}
            {/*<pre className={styles.policyText}>*/}
            {/*    {baseInfo?.contractText}*/}
            {/*  </pre>*/}
            {baseInfo && (<ContractDisplay contractID={baseInfo.contractId} />)}
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
                            <FContractStatusBadge
                              // status={ac.contractStatus === 1 ? 'authorized' : 'stopped'}
                              status={FUtil.Predefined.EnumContractStatus[baseInfo?.contractStatus || 0] as 'authorized'}
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
                      {
                        ac.expansion && (<div className={styles.contractText}>
                          <pre>{ac.contractText}</pre>
                        </div>)
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

interface IContractDisplay {
  contractID: string;
}

interface IContractDisplayStates {
  currentState: IStateAndEvents | null;

  modalVisible: boolean;
  modalEventID: string;
  modalFromAccountID: string;
  modalPaymentAmount: number;
  modalUserUserBanace: number;
  modalPassword: string;
}

type IStateAndEvents = {
  stateInfo: {
    content: string;
    origin: string;
  };
  eventTranslateInfos: {
    content: string;
    origin: {
      args: { elapsed: number, timeUnit: string; };
      id: string;
      name: 'RelativeTimeEvent'
      state: string;
    } | {
      args: { amount: number, account: string; };
      id: string;
      name: 'TransactionEvent'
      state: string;
    };
  }[];

};

function ContractDisplay({ contractID }: IContractDisplay) {

  const [currentState, setCurrentState] = React.useState<IContractDisplayStates['currentState']>(null);

  const [modalVisible, setModalVisible] = React.useState<IContractDisplayStates['modalVisible']>(false);
  const [modalEventID, setModalEventID] = React.useState<IContractDisplayStates['modalEventID']>('');
  const [modalPaymentAmount, setModalPaymentAmount] = React.useState<IContractDisplayStates['modalPaymentAmount']>(-1);

  const [modalFromAccountID, setModalFromAccountID] = React.useState<IContractDisplayStates['modalFromAccountID']>('');
  const [modalUserBanace, setModalUserBanace] = React.useState<IContractDisplayStates['modalUserUserBanace']>(-1);
  const [modalPassword, setModalPassword] = React.useState<IContractDisplayStates['modalPassword']>('');

  React.useEffect(() => {
    fetchInitData();
  }, [contractID, fetchInitData]);

  async function fetchInitData() {
    if (!contractID) {
      return;
    }

    const params: Parameters<typeof FServiceAPI.Contract.contractDetails>[0] = {
      contractId: contractID,
      isLoadPolicyInfo: 1,
      isTranslate: 1,
    };

    const { data } = await FServiceAPI.Contract.contractDetails(params);

    const params1: Parameters<typeof FServiceAPI.Contract.transitionRecords>[0] = {
      contractId: contractID,
    };

    const { data: data1 } = await FServiceAPI.Contract.transitionRecords(params1);

    const fsmInfos: IStateAndEvents[] = data.policyInfo.translateInfo.fsmInfos;
    // console.log(data, fsmInfos, 'fsmInfos24123423423');
    const currentState = fsmInfos.find((fi) => {
      return fi.stateInfo.origin === data.fsmCurrentState;
    });
    // console.log(data, currentState, 'currentState9087098-09');
    setCurrentState(currentState || null);
  }

  async function readyPay() {
    const params: Parameters<typeof FServiceAPI.Transaction.individualAccounts>[0] = {
      userId: FUtil.Tool.getUserIDByCookies(),
    };
    const { data } = await FServiceAPI.Transaction.individualAccounts(params);

    console.log(data, '@!#$#@!$@#$2314123432');
    setModalUserBanace(data.balance);
    setModalFromAccountID(data.accountId);
    setModalVisible(true);
  }

  async function confirmPay() {
    const params: Parameters<typeof FServiceAPI.Event.transaction>[0] = {
      contractId: contractID,
      eventId: modalEventID,
      accountId: modalFromAccountID,
      transactionAmount: modalUserBanace,
      password: '123456',
    };
    const { data } = await FServiceAPI.Event.transaction(params);
    console.log(data, 'D234324');
  }

  return (<div>
    <div className={styles.TransferringRecords}>
      <Space size={20} direction='vertical' style={{ width: '100%' }}>
        {
          currentState && (<div className={styles.TransferringRecord}>
            <Space size={5}>
              {
                false && (<label className={styles.Authorized}>未授权</label>)
              }
              {
                true && (<label className={styles.Unauthorized}>未授权</label>)
              }

              <FContentText text={'2021/04/23 17:03'} type='normal' />
            </Space>
            <div style={{ height: 10 }} />
            <FTitleText type='h3' text={currentState.stateInfo.content} />
            <div style={{ height: 10 }} />
            {
              currentState.eventTranslateInfos.map((eti) => {
                if (eti.origin.name === 'TransactionEvent') {
                  return (<div key={eti.origin.id} className={styles.paymentEvent}>
                    <FContentText
                      type='normal'
                      text={eti.content}
                    />
                    <FRectBtn
                      type='primary'
                      size='small'
                      onClick={() => {
                        readyPay();
                      }}
                    >支付</FRectBtn>
                  </div>);
                } else {
                  return (<div>1234</div>);
                }
              })
            }

          </div>)
        }

      </Space>
    </div>

    <FModal
      title={null}
      footer={null}
      visible={modalVisible}
      width={600}
      onCancel={() => {
        setModalVisible(false);
      }}
    >
      <div className={styles.ModalTitle}>
        <FTitleText
          text={'支付'}
          type='h3'
        />
      </div>
      <div style={{ height: 40 }} />
      <div className={styles.paymentAmount}>
        <label>100</label>
        <div style={{ width: 10 }} />
        <FTipText text={'羽币'} type='third' />
      </div>
      <div style={{ height: 40 }} />
      <div className={styles.paymentInfo}>
        <Space size={20} direction='vertical' style={{ width: 440 }}>
          <div className={styles.paymentInfoRow}>
            <div><FContentText text={'标的物'} type='normal' /></div>
            <div><FContentText text={'资源-职场图片1'} type='highlight' /></div>
          </div>

          <div className={styles.paymentInfoRow}>
            <div><FContentText text={'授权合约'} type='normal' /></div>
            <div><FContentText text={'试用后订阅（包月/包年）'} type='highlight' /></div>
          </div>

          <div className={styles.paymentInfoRow}>
            <div><FContentText text={'收款方'} type='normal' /></div>
            <div><FContentText text={'yang'} type='highlight' /></div>
          </div>

          <div className={styles.paymentInfoRow}>
            <div><FContentText text={'支付方式'} type='normal' /></div>
            <div>
              <FContentText text={'羽币账户'} type='highlight' />
              <div style={{ width: 10 }} />
              <FContentText text={`(余额 ${modalUserBanace}枚 )`} type='negative' />
            </div>
          </div>

          <div>
            <FInput
              value={modalPassword}
              onChange={(e) => {
                setModalPassword(e.target.value);
              }}
              className={styles.paymentPassword}
              wrapClassName={styles.paymentPassword}
              type='password'
            />
          </div>

          <div>
            <FRectBtn style={{ width: '100%' }}>确认支付</FRectBtn>
          </div>
        </Space>
      </div>
      <div style={{ height: 40 }} />
    </FModal>
  </div>);
}
