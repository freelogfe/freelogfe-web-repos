import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
import { Space } from 'antd';
import FModal from '../FModal';
import fMessage from '../fMessage';
import { ContractStatus } from '@/type/contractTypes';
import FComponentsLib from '@freelog/components-lib';

interface FContractDisplayProps {
  contractID: string;

  onChangedEvent?(): void;
}

interface IContractDisplayStates {
  activated: 'record' | 'code' | 'text' | 'view';
  recodeFold: boolean;
  isSelfLicensorOwner: boolean;
  isSelfLicenseeOwner: boolean;

  record_CurrentEvents: Array<{
    eventID: string;
    tip: string;
  } & ({
    type: 'RelativeTimeEvent';
  } | {
    type: 'TimeEvent';
  } | {
    type: 'TransactionEvent';
    amount: number;
  })>;
  record_Histories: {
    contractStatus: ContractStatus;
    datetime: string;
    description: string;
  }[];

  modal_Visible: boolean;
  modal_AccountBalance: number;
  modal_AccountState: 'inactive' | 'activate' | 'frozen';
  modal_Target: string;
  modal_ContractName: string;
  modal_Payee: string;
  modal_EventID: string;
  modal_AccountID: string;
  modal_TransactionAmount: number;
  modal_Password: string;
  modal_IsPaying: boolean;

  text: string;
  code: string;
}

const initStates: IContractDisplayStates = {
  activated: 'record',
  recodeFold: true,
  isSelfLicensorOwner: false,
  isSelfLicenseeOwner: false,

  record_CurrentEvents: [],
  record_Histories: [],

  modal_Visible: false,
  modal_AccountBalance: -1,
  modal_AccountState: 'activate',
  modal_Target: '',
  modal_ContractName: '',
  modal_Payee: '',
  modal_EventID: '',
  modal_AccountID: '',
  modal_TransactionAmount: -1,
  modal_Password: '',
  modal_IsPaying: false,

  text: '',
  code: '',
};

const contractStatus = {
  1: 'active',
  2: 'testActive',
  3: 'active',
  128: 'inactive',
};

function FContractDisplay({ contractID, onChangedEvent }: FContractDisplayProps) {

  const inputEl = React.useRef<any>(null);

  const [activated, setActivated] = React.useState<IContractDisplayStates['activated']>(initStates['activated']);
  const [recodeFold, setRecodeFold] = React.useState<IContractDisplayStates['recodeFold']>(initStates['recodeFold']);
  const [isSelfLicensorOwner, setIsSelfLicensorOwner] = React.useState<IContractDisplayStates['isSelfLicensorOwner']>(initStates['isSelfLicensorOwner']);
  const [isSelfLicenseeOwner, setIsSelfLicenseeOwner] = React.useState<IContractDisplayStates['isSelfLicenseeOwner']>(initStates['isSelfLicenseeOwner']);

  const [record_CurrentEvents, set_Record_CurrentEvents] = React.useState<IContractDisplayStates['record_CurrentEvents']>(initStates['record_CurrentEvents']);
  const [record_Histories, set_Record_Histories] = React.useState<IContractDisplayStates['record_Histories']>(initStates['record_Histories']);

  const [modal_Visible, set_Modal_Visible] = React.useState<IContractDisplayStates['modal_Visible']>(initStates['modal_Visible']);
  const [modal_AccountBalance, set_Modal_AccountBalance] = React.useState<IContractDisplayStates['modal_AccountBalance']>(initStates['modal_AccountBalance']);
  const [modal_AccountState, set_Modal_AccountState] = React.useState<IContractDisplayStates['modal_AccountState']>(initStates['modal_AccountState']);
  const [modal_Target, set_Modal_Target] = React.useState<IContractDisplayStates['modal_Target']>(initStates['modal_Target']);
  const [modal_ContractName, set_Modal_ContractName] = React.useState<IContractDisplayStates['modal_ContractName']>(initStates['modal_ContractName']);
  const [modal_Payee, set_Modal_Payee] = React.useState<IContractDisplayStates['modal_ContractName']>(initStates['modal_ContractName']);
  const [modal_EventID, set_Modal_EventID] = React.useState<IContractDisplayStates['modal_EventID']>(initStates['modal_EventID']);
  const [modal_AccountID, set_Modal_AccountID] = React.useState<IContractDisplayStates['modal_AccountID']>(initStates['modal_AccountID']);
  const [modal_TransactionAmount, set_Modal_TransactionAmount] = React.useState<IContractDisplayStates['modal_TransactionAmount']>(initStates['modal_TransactionAmount']);
  const [modal_Password, set_Modal_Password] = React.useState<IContractDisplayStates['modal_Password']>(initStates['modal_Password']);
  const [modal_IsPaying, set_Modal_IsPaying] = React.useState<IContractDisplayStates['modal_IsPaying']>(initStates['modal_IsPaying']);

  const [text, setText] = React.useState<IContractDisplayStates['text']>(initStates['text']);
  const [code, setCode] = React.useState<IContractDisplayStates['code']>(initStates['code']);

  React.useEffect(() => {
    if (!contractID) {
      return;
    }

    fetchInitData();
  }, [contractID]);

  async function fetchInitData() {
    const params: Parameters<typeof FServiceAPI.Contract.contractDetails>[0] = {
      contractId: contractID,
      isLoadPolicyInfo: 1,
      isTranslate: 1,
    };

    const { data: data_ContractDetails }: {
      data: {
        licensorOwnerId: number;
        licenseeOwnerId: number;
        subjectName: string;
        contractName: string;
        licensorOwnerName: string;
        policyInfo: any;
        fsmCurrentState: string;
        status: 0 | 1 | 2;
      };
    } = await FServiceAPI.Contract.contractDetails(params);
    // console.log(data_ContractDetails, 'data_ContractDetails111122222333333333');

    setIsSelfLicensorOwner(data_ContractDetails.licensorOwnerId === FUtil.Tool.getUserIDByCookies());
    setIsSelfLicenseeOwner(data_ContractDetails.licenseeOwnerId === FUtil.Tool.getUserIDByCookies());
    set_Modal_Target(data_ContractDetails.subjectName);
    set_Modal_ContractName(data_ContractDetails.contractName);
    set_Modal_Payee(data_ContractDetails.licensorOwnerName);
    setCode(data_ContractDetails.policyInfo.policyText);
    setText(data_ContractDetails.policyInfo.translateInfo.content);

    const params1: Parameters<typeof FServiceAPI.Contract.transitionRecords>[0] = {
      skip: 0,
      limit: 100,
      contractId: contractID,
      isTranslate: 1,
    };

    const { ret, errCode, data: data_transitionRecords }: {
      ret: number;
      errCode: number;
      data: {
        dataList: {
          serviceStates: 1 | 2 | 3 | 128;
          stateInfoStr: string;
          stateStr: string;
          time: string;
          eventSectionEntities: {
            content: string;
            origin: any;
          }[];
        }[];
        limit: 100
        skip: 0
        totalItem: 1
      }
    } = await FServiceAPI.Contract.transitionRecords(params1);

    if (ret !== 0 || errCode !== 0 || !data_transitionRecords) {
      return;
    }

    // console.log(data_transitionRecords, 'data_transitionRecords098iweojflskdfjsdlkj');

    // const currentState: any = data_ContractDetails.policyInfo.translateInfo.fsmInfos.find((fi: any) => {
    //   return fi.stateInfo.origin === data_ContractDetails.fsmCurrentState;
    // });

    // const record_CurrentEvents: IContractDisplayStates['record_Cu/**/rrentEvents'] = (currentState.eventTranslateInfos as any[])
    // data_transitionRecords[0].eventSectionEntities
    const record_CurrentEvents: IContractDisplayStates['record_CurrentEvents'] = data_transitionRecords.dataList[0].eventSectionEntities
      .filter((eti) => {
        return eti.origin.name === 'TransactionEvent' || eti.origin.name === 'RelativeTimeEvent' || eti.origin.name === 'TimeEvent';
      })
      .map((eti: any, etiIndex) => {
        const obj = {
          eventID: eti.origin.id,
          tip: eti.content,
          type: eti.origin.name,
        };
        if (eti.origin.name === 'TransactionEvent') {
          return {
            ...obj,
            amount: eti.origin.args.amount,
          };
        } else {
          return obj;
        }
      });

    const record_Histories: IContractDisplayStates['record_Histories'] = data_transitionRecords.dataList.map((tr, trIndex) => {
      return {
        contractStatus: (trIndex === 0 && data_ContractDetails.status === 1) ? 'terminal' : contractStatus[tr.serviceStates] as 'active',
        datetime: tr.time,
        description: tr.stateInfoStr,
      };
    });

    set_Record_CurrentEvents(record_CurrentEvents);
    set_Record_Histories(record_Histories);

  }

  async function readyPay() {
    const params: Parameters<typeof FServiceAPI.Transaction.individualAccounts>[0] = {
      userId: FUtil.Tool.getUserIDByCookies(),
    };
    const { data } = await FServiceAPI.Transaction.individualAccounts(params);
    set_Modal_AccountBalance(data.balance);
    set_Modal_AccountState(data.status === 0 ? 'inactive' : data.status === 1 ? 'activate' : 'frozen');
    set_Modal_AccountID(data.accountId);
    set_Modal_Visible(true);
  }

  async function confirmPay(password: string) {
    set_Modal_IsPaying(true);
    console.log(contractID, 'contractID09iowesjflksdfjlsdkj');
    const params: Parameters<typeof FServiceAPI.Event.transaction>[0] = {
      contractId: contractID,
      eventId: modal_EventID,
      accountId: modal_AccountID,
      transactionAmount: modal_TransactionAmount,
      password: password,
    };
    const { data, errCode, msg, ret } = await FServiceAPI.Event.transaction(params);

    if (ret + (errCode || 0) > 0) {
      set_Modal_Password('');
      inputEl.current.focus();
      set_Modal_IsPaying(false);
      return fMessage(msg, 'error');
    }

    // console.log(data, 'data13241234');

    const bool: boolean = await paymentStatus(data.transactionRecordId);
    if (!bool) {
      return fMessage('交易关闭', 'error');
    }

    fetchInitData();
    fMessage(FI18n.i18nNext.t('msg_payment_successful'));
    // fMessage('支付成功');
    set_Modal_Visible(false);
    set_Modal_Password('');
    set_Modal_IsPaying(false);
    onChangedEvent && onChangedEvent();
  }

  return (<div className={styles.ContractDisplay}>
    <div className={styles.PolicyBodyTabs}>
      <a
        className={activated === 'record' ? styles.PolicyBodyTabActivated : ''}
        onClick={() => {
          setActivated('record');
        }}
      >合约流转记录</a>
      <div style={{ width: 15 }} />

      <a
        className={activated === 'text' ? styles.PolicyBodyTabActivated : ''}
        onClick={() => {
          setActivated('text');
        }}
      >策略内容</a>
      {/*<div style={{ width: 15 }} />*/}
      {/*<a*/}
      {/*  className={activated === 'view' ? styles.PolicyBodyTabActivated : ''}*/}
      {/*  onClick={() => {*/}
      {/*    setActivated('view');*/}
      {/*  }}*/}
      {/*>状态机视图</a>*/}
      <div style={{ width: 15 }} />
      <a
        className={activated === 'code' ? styles.PolicyBodyTabActivated : ''}
        onClick={() => {
          setActivated('code');
        }}
      >策略代码</a>
    </div>

    <div
      className={styles.PolicyBodyContainer}
    >
      {
        activated === 'record' && (<div className={styles.StateRecord}>
          {
            record_Histories.length > 0 && (<div className={styles.CurrentState}>
              <Space size={5}>
                <FComponentsLib.FContractStatusBadge status={record_Histories[0].contractStatus} />

                <FComponentsLib.FContentText text={record_Histories[0].datetime} type='normal' />
              </Space>


              <div style={{ height: 10 }} />
              <FComponentsLib.FContentText
                type='highlight'
                text={record_Histories[0].description}
              />

              {
                record_Histories[0].contractStatus !== 'terminal' && record_CurrentEvents.length > 0 && (<>
                  <div style={{ height: 10 }} />
                  <Space size={10} direction='vertical' style={{ width: '100%' }}>
                    {/*{console.log(record_CurrentEvents, 'record_CurrentEvents2390jsdlkfj')}*/}
                    {
                      record_CurrentEvents
                        .map((eti, etiIndex) => {
                          if (eti.type === 'TransactionEvent') {
                            return (<div key={etiIndex} className={styles.Event}>
                              <FComponentsLib.FContentText
                                style={{ flexShrink: 1 }}
                                type='highlight'
                                text={eti.tip}
                              />
                              {
                                isSelfLicenseeOwner ?
                                  (<FComponentsLib.FRectBtn
                                    style={{ flexShrink: 0 }}
                                    type='primary'
                                    size='small'
                                    onClick={() => {
                                      if (isSelfLicensorOwner) {
                                        // return fMessage('收款方不能是自己', 'error');
                                        return fMessage(FI18n.i18nNext.t('alert_cantsendmoneytoyourself'), 'error');
                                      }
                                      set_Modal_EventID(eti.eventID);
                                      // console.log(eti.origin.args.amount, '!#@$!234123412341234');
                                      set_Modal_TransactionAmount(eti.amount);
                                      readyPay();
                                    }}
                                  >支付</FComponentsLib.FRectBtn>)
                                  // : (<FContentText type='negative' text={'待对方执行'} />)
                                  : (<FComponentsLib.FContentText
                                    type='negative'
                                    text={FI18n.i18nNext.t('msg_waitfor_theotherparty_excutecontract')}
                                  />)
                              }
                            </div>);
                          } else if (eti.type === 'RelativeTimeEvent') {
                            return (<div key={etiIndex} className={styles.Event}>
                              <FComponentsLib.FContentText
                                type='highlight'
                                text={eti.tip}
                              />
                            </div>);
                          } else if (eti.type === 'TimeEvent') {
                            return (<div key={etiIndex} className={styles.Event}>
                              <FComponentsLib.FContentText
                                type='highlight'
                                text={eti.tip}
                              />
                            </div>);
                          } else {
                            return undefined;
                          }
                        })
                    }
                  </Space>
                </>)
              }

            </div>)
          }


          {
            !recodeFold && (<>
              <div style={{ height: 20 }} />

              <Space className={styles.TransferringRecords} size={20} direction='vertical'>

                {
                  record_Histories
                    .filter((_, i) => {
                      return i !== 0;
                    })
                    .map((hs, index) => {
                      // console.log(hs, 'hshshshshshshs1234234');
                      return (<div key={index} className={styles.TransferringRecord}>
                        <Space size={5}>
                          <FComponentsLib.FContractStatusBadge status={hs.contractStatus} />

                          <FComponentsLib.FContentText text={hs.datetime} type='normal' />
                        </Space>
                        <div style={{ height: 10 }} />
                        <FComponentsLib.FContentText
                          type='highlight'
                          text={hs.description}
                        />
                      </div>);
                    })
                }

              </Space>
            </>)
          }
          {
            record_Histories.length > 1 && (<>
              <div style={{ height: 20 }} />
              <div className={styles.recodeFold}>
                {
                  recodeFold
                    ? (<FComponentsLib.FTextBtn
                      type='default'
                      onClick={() => {
                        setRecodeFold(false);
                      }}
                      style={{ fontSize: 12, color: '#7A869A' }}
                    >展开流转记录 <FComponentsLib.FIcons.FDown /></FComponentsLib.FTextBtn>)
                    : (<FComponentsLib.FTextBtn
                      type='default'
                      onClick={() => {
                        setRecodeFold(true);
                      }}
                      style={{ fontSize: 12, color: '#7A869A' }}
                    >收起流转记录 <FComponentsLib.FIcons.FUp /></FComponentsLib.FTextBtn>)
                }
              </div>
            </>)
          }

        </div>)
      }


      {
        activated === 'text' && (<div className={styles.Text}>
          <FComponentsLib.FCodeFormatter code={text} />
        </div>)
      }

      {
        activated === 'view' && (<div className={styles.View}>
        </div>)
      }

      {
        activated === 'code' && (<div className={styles.Code}>
          <FComponentsLib.FCodeFormatter code={code} />
        </div>)
      }
    </div>

    <FModal
      title={null}
      footer={null}
      visible={modal_Visible}
      width={600}
      onCancel={() => {
        set_Modal_Visible(false);
        set_Modal_Password('');
      }}
      destroyOnClose={true}
    >
      <div className={styles.ModalTitle}>
        <FComponentsLib.FTitleText
          text={'支付'}
          type='h3'
        />
      </div>
      <div style={{ height: 40 }} />
      <div className={styles.paymentAmount}>
        <label>{modal_TransactionAmount}</label>
        <div style={{ width: 10 }} />
        <FComponentsLib.FTipText text={'羽币'} type='third' />
      </div>
      <div style={{ height: 40 }} />
      <div className={styles.paymentInfo}>
        <Space size={20} direction='vertical' style={{ width: 440 }}>
          <div className={styles.paymentInfoRow}>
            <div><FComponentsLib.FContentText text={'标的物'} type='normal' /></div>
            <div><FComponentsLib.FContentText text={modal_Target} type='highlight' /></div>
          </div>

          <div className={styles.paymentInfoRow}>
            <div><FComponentsLib.FContentText text={'授权合约'} type='normal' /></div>
            <div><FComponentsLib.FContentText text={modal_ContractName} type='highlight' /></div>
          </div>

          <div className={styles.paymentInfoRow}>
            <div><FComponentsLib.FContentText text={'收款方'} type='normal' /></div>
            <div><FComponentsLib.FContentText text={modal_Payee} type='highlight' /></div>
          </div>

          <div className={styles.paymentInfoRow}>
            <div><FComponentsLib.FContentText text={'支付方式'} type='normal' /></div>
            <div>
              <FComponentsLib.FContentText text={'羽币账户'} type='highlight' />
              <div style={{ width: 10 }} />
              <FComponentsLib.FContentText text={`(余额 ${modal_AccountBalance}枚 )`} type='negative' />
            </div>
          </div>

        </Space>

        <div style={{ height: 40 }} />

        {
          modal_AccountState === 'inactive' && (<FComponentsLib.FRectBtn
            onClick={() => {
              window.open(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.wallet());
              set_Modal_Visible(false);
            }}>激活账户</FComponentsLib.FRectBtn>)
        }

        {
          modal_AccountState === 'activate' && (<div className={styles.paymentPassword}>
            {
              modal_IsPaying
                ? (<div style={{ color: '#2784FF', lineHeight: '20px' }}><FComponentsLib.FIcons.FLoading /> <span>正在支付…</span></div>)
                : (<FComponentsLib.FContentText text={'输入支付密码进行支付'} type='normal' />)
            }


            <div style={{ height: 20 }} />
            {/*<FComponentsLib.FPaymentPasswordInput*/}
            <FComponentsLib.FInput.FPaymentPassword
              ref={inputEl}
              autoFocus={true}
              value={modal_Password}
              onChange={async (value) => {
                // console.log(value, '@#$@#$@#$@#$');
                // console.log(value, 'valuevalue9032klsdflksdfl');
                set_Modal_Password(value);
                if (value.length === 6) {
                  inputEl.current.blur();
                  confirmPay(value);
                }
              }}
            />
            <div style={{ height: 20 }} />
            <FComponentsLib.FTextBtn
              type='default'
              onClick={() => {
                window.open(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.retrievePayPassword());
              }}
            >忘记支付密码</FComponentsLib.FTextBtn>
          </div>)
        }

      </div>


      <div style={{ height: 40 }} />
    </FModal>
  </div>);
}

export default FContractDisplay;

async function paymentStatus(recordId: string): Promise<boolean> {
  const params: Parameters<typeof FServiceAPI.Transaction.transactionDetails>[0] = {
    recordId: recordId,
  };
  do {
    const { data } = await FServiceAPI.Transaction.transactionDetails(params);
    if (data.status === 2) {
      return true;
    } else if (data.status === 3) {
      return false;
    }
    await sleep(300);
  } while (true);
}

function sleep(ms: number = 300): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
