import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { Space } from 'antd';
import { FContentText, FTipText, FTitleText } from '../FText';
import { FRectBtn, FTextBtn } from '../FButton';
import FModal from '../FModal';
import FCodeFormatter from '../FCodeFormatter';
import fMessage from '../fMessage';
import { FDown, FLoading, FUp } from '../FIcons';
import FPaymentPasswordInput from '@/components/FPaymentPasswordInput';
import FUtil1 from '@/utils';

interface FContractDisplayProps {
  contractID: string;

  // containerHeight?: string | number;

  onChangedEvent?(): void;
}

interface IContractDisplayStates {
  activated: 'record' | 'code' | 'text' | 'view';
  recodeFold: boolean;
  isSelfLicensorOwner: boolean;
  isSelfLicenseeOwner: boolean;

  currentS: {
    name: string;
    auth: 'active' | 'testActive' | 'inactive' | 'terminal' | string;
    datetime: string;
    events: Array<{
      id: string;
      tip: string;
    } & ({
      type: 'RelativeTimeEvent';
    } | {
      type: 'TimeEvent';
    } | {
      type: 'TransactionEvent';
      amount: number;
    })>;
  } | null;
  historySs: {
    name: string;
    colors: string[];
    datetime: string;
    event: {
      id: string;
      tip: string;
      type: 'RelativeTimeEvent' | 'TimeEvent' | 'TransactionEvent';
    };
  }[];

  modal_Visible: boolean;
  modal_AccountBalance: number;
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

  currentS: null,
  historySs: [],

  modal_Visible: false,
  modal_AccountBalance: -1,
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

function FContractDisplay({ contractID, onChangedEvent }: FContractDisplayProps) {

  const inputEl = React.useRef<any>(null);

  const [activated, setActivated] = React.useState<IContractDisplayStates['activated']>(initStates['activated']);
  const [recodeFold, setRecodeFold] = React.useState<IContractDisplayStates['recodeFold']>(initStates['recodeFold']);
  const [isSelfLicensorOwner, setIsSelfLicensorOwner] = React.useState<IContractDisplayStates['isSelfLicensorOwner']>(initStates['isSelfLicensorOwner']);
  const [isSelfLicenseeOwner, setIsSelfLicenseeOwner] = React.useState<IContractDisplayStates['isSelfLicenseeOwner']>(initStates['isSelfLicenseeOwner']);

  const [currentS, setCurrentS] = React.useState<IContractDisplayStates['currentS']>(initStates['currentS']);
  const [historySs, setHistorySs] = React.useState<IContractDisplayStates['historySs']>(initStates['historySs']);

  const [modal_Visible, set_Modal_Visible] = React.useState<IContractDisplayStates['modal_Visible']>(initStates['modal_Visible']);
  const [modal_AccountBalance, set_Modal_AccountBalance] = React.useState<IContractDisplayStates['modal_AccountBalance']>(initStates['modal_AccountBalance']);
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
    // console.log(contractID, 'contractID@#@@#@#$@#$');

    const params: Parameters<typeof FServiceAPI.Contract.contractDetails>[0] = {
      contractId: contractID,
      isLoadPolicyInfo: 1,
      isTranslate: 1,
    };

    const { data } = await FServiceAPI.Contract.contractDetails(params);
    // console.log(data, 'data111122222333333333');
    const params1: Parameters<typeof FServiceAPI.Contract.transitionRecords>[0] = {
      skip: 0,
      limit: 100,
      contractId: contractID,
    };

    const { data: data1 } = await FServiceAPI.Contract.transitionRecords(params1);

    const fsmInfos: any = data.policyInfo.translateInfo.fsmInfos;
    // console.log(fsmInfos, 'fsmInfos9023u4k23jl');
    // console.log(data, fsmInfos, 'fsmInfos24123423423');
    const currentState: any = fsmInfos.find((fi: any) => {
      return fi.stateInfo.origin === data.fsmCurrentState;
    });

    // console.log(currentState, 'currentState0923u4kjl');

    // console.log(data, FUtil.Tool.getUserIDByCookies(), '#@#$@#$@#@@@@@@@@@@');
    setIsSelfLicensorOwner(data.licensorOwnerId === FUtil.Tool.getUserIDByCookies());
    setIsSelfLicenseeOwner(data.licenseeOwnerId === FUtil.Tool.getUserIDByCookies());
    set_Modal_Target(data.subjectName);
    set_Modal_ContractName(data.contractName);
    set_Modal_Payee(data.licensorOwnerName);

    let theAuth: string = '';
    if (data.fsmRunningStatus !== 4) {
      theAuth = 'terminal';
    } else if (data.authStatus === 1 || data.authStatus === 3) {
      theAuth = 'active';
    } else if (data.authStatus === 2) {
      theAuth = 'testActive';
    } else if (data.authStatus === 128) {
      theAuth = 'inactive';
    }

    const currentSData: IContractDisplayStates['currentS'] = {
      name: currentState.stateInfo.content,
      // colors: currentState.serviceStateInfos.map((ssi: any) => {
      //   return ssi.content;
      // }),
      auth: theAuth,
      datetime: FUtil.Format.formatDateTime(data1.dataList.length === 0
        ? data.createDate
        : data1.dataList[data1.dataList.length - 1].createDate, true),
      // datetime: '2001-01-01 00:00',
      events: (currentState.eventTranslateInfos as any[]).map((eti) => {
        const obj = {
          id: eti.origin.id,
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
      }),
    };
    // console.log(currentSData, 'currentSData!!!!@3904ulksjfl');
    setCurrentS(currentSData);

    // console.log(currentSData, 'currentSDatacurrentSData11111111');
    // console.log(data1, 'data1data1data1data19023jlksdf');
    const historySsData: IContractDisplayStates['historySs'] = (data1.dataList as any[])
      .filter((dl:any) => {
        return dl.fromState !== '_none_';
      })
      .map<IContractDisplayStates['historySs'][number]>((d1l: any, ind, arr) => {
        // console.log(d1l, 'd1l123412344444444');
        const currS = fsmInfos.find((fi: any) => {
          return fi.stateInfo.origin === d1l.fromState;
        });
        // console.log(currS, 'currScurrScurrS55555555');
        const currE = currS.eventTranslateInfos.find((eti: any) => {
          return eti.origin.id === d1l.eventId;
        });
        // console.log(currE, 'currE111111');
        return {
          name: currS.stateInfo.content,
          colors: currS.serviceStateInfos.map((ssi: any) => {
            return ssi.content;
          }),
          datetime: FUtil.Format.formatDateTime(ind === 0
            ? data.createDate
            : arr[ind - 1].createDate, true),
          event: {
            id: currE.origin.id,
            tip: currE.content,
            type: currE.origin.name,
          },
        };
      });

    // console.log(historySsData, 'historySsData000000000000');
    setHistorySs(historySsData);

    // setHistoryStates(historyStates1);
    setCode(data.policyInfo.policyText);
    const { error, text } = await FUtil.Format.policyCodeTranslationToText(data.policyInfo.policyText, 'resource');
    if (error) {
      setText('!!!解析错误\n' + '    ' + error[0]);
      return;
    }
    setText(text || '');

  }

  async function readyPay() {
    const params: Parameters<typeof FServiceAPI.Transaction.individualAccounts>[0] = {
      userId: FUtil.Tool.getUserIDByCookies(),
    };
    const { data } = await FServiceAPI.Transaction.individualAccounts(params);

    // console.log(data, '@!#$#@!$@#$2314123432');
    set_Modal_AccountBalance(data.balance);
    set_Modal_AccountID(data.accountId);
    set_Modal_Visible(true);
  }

  async function confirmPay(password: string) {
    set_Modal_IsPaying(true);
    const params: Parameters<typeof FServiceAPI.Event.transaction>[0] = {
      contractId: contractID,
      eventId: modal_EventID,
      accountId: modal_AccountID,
      transactionAmount: modal_TransactionAmount,
      password: password,
    };
    const { data, errCode, errcode, msg, ret } = await FServiceAPI.Event.transaction(params);

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
    fMessage(FUtil1.I18n.message('msg_payment_successful'));
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
      <div style={{ width: 15 }} />
      <a
        className={activated === 'view' ? styles.PolicyBodyTabActivated : ''}
        onClick={() => {
          setActivated('view');
        }}
      >状态机视图</a>
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
      // style={{ height: containerHeight }}
    >
      {
        activated === 'record' && (<div className={styles.StateRecord}>
          {/*{console.log(currentS, 'currentS!!!!!@#$@#$@#$@#$')}*/}
          {
            currentS && (<div className={styles.CurrentState}>
              <Space size={5}>
                {
                  currentS.auth === 'terminal' && (<label className={styles.Terminal}>已终止</label>)
                }
                {
                  currentS.auth === 'inactive' && (<label className={styles.Unauthorized}>未授权</label>)
                }

                {
                  currentS.auth !== 'terminal' && currentS.auth !== 'inactive' && (
                    <label className={styles.Authorized}>{currentS.auth === 'active'
                      ? '已授权'
                      : currentS.auth === 'active'
                        ? '测试授权'
                        : currentS.auth}</label>)
                }
                <FContentText text={currentS.datetime} type='normal' />
              </Space>
              {/*<div style={{ height: 10 }} />*/}
              {/*<FContentText*/}
              {/*  type='highlight'*/}
              {/*  text={currentS.name}*/}
              {/*/>*/}
              {/*<div style={{*/}
              {/*  color: '#7A869A',*/}
              {/*  fontWeight: 600,*/}
              {/*  lineHeight: '18px',*/}
              {/*}}>{currentS.name}</div>*/}

              {
                currentS.events.length > 0 && (<>
                  <div style={{ height: 10 }} />
                  {/*{console.log(currentS.events, 'currentS.events****887878787878')}*/}
                  <Space size={10} direction='vertical' style={{ width: '100%' }}>
                    {
                      currentS.events.length === 0
                        ? (<div className={styles.Event}>
                          <FContentText
                            type='highlight'
                            text={'停止接收事件'}
                          />
                        </div>)
                        : currentS.events.map((eti) => {

                          if (eti.type === 'TransactionEvent') {
                            return (<div key={eti.id} className={styles.Event}>
                              <FContentText
                                style={{ flexShrink: 1 }}
                                type='highlight'
                                text={eti.tip}
                              />
                              {
                                isSelfLicenseeOwner ?
                                  (<FRectBtn
                                    style={{ flexShrink: 0 }}
                                    type='primary'
                                    size='small'
                                    onClick={() => {
                                      if (isSelfLicensorOwner) {
                                        return fMessage('收款方不能是自己', 'error');
                                      }
                                      set_Modal_EventID(eti.id);
                                      // console.log(eti.origin.args.amount, '!#@$!234123412341234');
                                      set_Modal_TransactionAmount(eti.amount);
                                      readyPay();
                                    }}
                                  >支付</FRectBtn>)
                                  // : (<FContentText type='negative' text={'待对方执行'} />)
                                  : (<FContentText
                                    type='negative'
                                    text={FUtil1.I18n.message('msg_waitfor_theotherparty_excutecontract')}
                                  />)
                              }

                            </div>);
                          } else if (eti.type === 'RelativeTimeEvent') {
                            return (<div key={eti.id} className={styles.Event}>
                              <FContentText
                                type='highlight'
                                text={eti.tip}
                              />
                            </div>);
                          } else if (eti.type === 'TimeEvent') {
                            return (<div key={eti.id} className={styles.Event}>
                              <FContentText
                                type='highlight'
                                text={eti.tip}
                              />
                            </div>);
                          } else {
                            return (<div key={'terminal'} className={styles.Event}>
                              <FContentText
                                type='highlight'
                                text={(eti as any).tip}
                              />
                            </div>);
                          }
                        })
                    }
                  </Space>
                </>)
              }

            </div>)
          }

          {
            historySs.length > 0 && (<>
              {
                !recodeFold && (<>
                  <div style={{ height: 20 }} />

                  <Space className={styles.TransferringRecords} size={20} direction='vertical'>

                    {
                      historySs.map((hs, index) => {
                        // console.log(hs, 'hshshshshshshs1234234');
                        return (<div key={index} className={styles.TransferringRecord}>
                          <Space size={5}>
                            {
                              hs.colors.length > 0
                                ? hs.colors.map((cl) => {
                                  return (<label key={cl} className={styles.Authorized}>{cl}</label>);
                                })
                                : (<label className={styles.Unauthorized}>未授权</label>)
                            }

                            <FContentText text={hs.datetime} type='normal' />
                          </Space>
                          <div style={{ height: 10 }} />
                          {/*<FContentText*/}
                          {/*  type='highlight'*/}
                          {/*  text={hs.name}*/}
                          {/*/>*/}
                          {/*<div style={{ height: 10 }} />*/}

                          <div className={styles.Event}>
                            <FContentText
                              type='highlight'
                              text={hs.event.tip}
                            />

                            {/*<span style={{ color: '#2784FF' }}>已执行</span>*/}
                          </div>

                          {/*<div className={styles.mask} />*/}
                        </div>);
                      })
                    }

                  </Space>
                </>)
              }

              <div style={{ height: 20 }} />
              <div className={styles.recodeFold}>
                {
                  recodeFold
                    ? (<FTextBtn
                      type='default'
                      onClick={() => {
                        setRecodeFold(false);
                      }}
                      style={{ fontSize: 12, color: '#7A869A' }}
                    >展开流转记录 <FDown /></FTextBtn>)
                    : (<FTextBtn
                      type='default'
                      onClick={() => {
                        setRecodeFold(true);
                      }}
                      style={{ fontSize: 12, color: '#7A869A' }}
                    >收起流转记录 <FUp /></FTextBtn>)
                }
              </div>
            </>)
          }

        </div>)
      }


      {
        activated === 'text' && (<div className={styles.Text}>
          <FCodeFormatter code={text} />
        </div>)
      }

      {
        activated === 'view' && (<div className={styles.View}>
        </div>)
      }

      {
        activated === 'code' && (<div className={styles.Code}>
          <FCodeFormatter code={code} />
        </div>)
      }
    </div>
    {/*<div style={{height: 15}}/>*/}

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
        <FTitleText
          text={'支付'}
          type='h3'
        />
      </div>
      <div style={{ height: 40 }} />
      <div className={styles.paymentAmount}>
        <label>{modal_TransactionAmount}</label>
        <div style={{ width: 10 }} />
        <FTipText text={'羽币'} type='third' />
      </div>
      <div style={{ height: 40 }} />
      <div className={styles.paymentInfo}>
        <Space size={20} direction='vertical' style={{ width: 440 }}>
          <div className={styles.paymentInfoRow}>
            <div><FContentText text={'标的物'} type='normal' /></div>
            <div><FContentText text={modal_Target} type='highlight' /></div>
          </div>

          <div className={styles.paymentInfoRow}>
            <div><FContentText text={'授权合约'} type='normal' /></div>
            <div><FContentText text={modal_ContractName} type='highlight' /></div>
          </div>

          <div className={styles.paymentInfoRow}>
            <div><FContentText text={'收款方'} type='normal' /></div>
            <div><FContentText text={modal_Payee} type='highlight' /></div>
          </div>

          <div className={styles.paymentInfoRow}>
            <div><FContentText text={'支付方式'} type='normal' /></div>
            <div>
              <FContentText text={'羽币账户'} type='highlight' />
              <div style={{ width: 10 }} />
              <FContentText text={`(余额 ${modal_AccountBalance}枚 )`} type='negative' />
            </div>
          </div>

        </Space>

        <div style={{ height: 40 }} />

        <div className={styles.paymentPassword}>
          {
            modal_IsPaying
              ? (<div style={{ color: '#2784FF', lineHeight: '20px' }}><FLoading /> <span>正在支付…</span></div>)
              : (<FContentText text={'输入支付密码进行支付'} type='normal' />)
          }


          <div style={{ height: 20 }} />
          <FPaymentPasswordInput
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
          <FTextBtn
            type='default'
            onClick={() => {
              window.open(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.retrievePayPassword());
            }}
          >忘记支付密码</FTextBtn>
        </div>

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
