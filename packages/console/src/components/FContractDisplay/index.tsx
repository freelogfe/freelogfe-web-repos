import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { Space } from 'antd';
import { FContentText, FTipText, FTitleText } from '../FText';
import { FRectBtn, FTextBtn } from '../FButton';
import FModal from '../FModal';
import FInput from '../FInput';
import FCodeFormatter from '../FCodeFormatter';
import fMessage from '../fMessage';
import { FDown, FUp } from '../FIcons';
import FPaymentPasswordInput from '@/components/FPaymentPasswordInput';

interface FContractDisplayProps {
  contractID: string;

  // containerHeight?: string | number;

  onChangedEvent?(): void;
}

interface IContractDisplayStates {
  activated: 'record' | 'code' | 'text' | 'view';
  recodeFold: boolean;
  isSelfLicensorOwner: boolean;

  currentS: {
    name: string;
    colors: string[];
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

  modalVisible: boolean;
  modalAccountBalance: number;
  modalTarget: string;
  modalContractName: string;
  modalPayee: string;
  modalEventID: string;
  modalAccountID: string;
  modalTransactionAmount: number;
  modalPassword: string;

  text: string;
  code: string;
}

function FContractDisplay({ contractID, onChangedEvent }: FContractDisplayProps) {

  const [activated, setActivated] = React.useState<IContractDisplayStates['activated']>('record');
  const [recodeFold, setRecodeFold] = React.useState<IContractDisplayStates['recodeFold']>(true);
  const [isSelfLicensorOwner, setIsSelfLicensorOwner] = React.useState<IContractDisplayStates['isSelfLicensorOwner']>(false);

  const [currentS, setCurrentS] = React.useState<IContractDisplayStates['currentS']>(null);
  const [historySs, setHistorySs] = React.useState<IContractDisplayStates['historySs']>([]);

  const [modalVisible, setModalVisible] = React.useState<IContractDisplayStates['modalVisible']>(false);
  const [modalAccountBalance, setModalAccountBalance] = React.useState<IContractDisplayStates['modalAccountBalance']>(-1);
  const [modalTarget, setModalTarget] = React.useState<IContractDisplayStates['modalTarget']>('');
  const [modalContractName, setModalContractName] = React.useState<IContractDisplayStates['modalContractName']>('');
  const [modalPayee, setModalPayee] = React.useState<IContractDisplayStates['modalContractName']>('');
  const [modalEventID, setModalEventID] = React.useState<IContractDisplayStates['modalEventID']>('');
  const [modalAccountID, setModalAccountID] = React.useState<IContractDisplayStates['modalAccountID']>('');
  const [modalTransactionAmount, setModalTransactionAmount] = React.useState<IContractDisplayStates['modalTransactionAmount']>(-1);
  const [modalPassword, setModalPassword] = React.useState<IContractDisplayStates['modalPassword']>('');

  const [text, setText] = React.useState<IContractDisplayStates['text']>('');
  const [code, setCode] = React.useState<IContractDisplayStates['code']>('');

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

    const { data } = await FServiceAPI.Contract.contractDetails(params);
    // console.log(data, 'data111122222333333333');
    const params1: Parameters<typeof FServiceAPI.Contract.transitionRecords>[0] = {
      contractId: contractID,
    };

    const { data: data1 } = await FServiceAPI.Contract.transitionRecords(params1);

    const fsmInfos: any = data.policyInfo.translateInfo.fsmInfos;
    // console.log(data, fsmInfos, 'fsmInfos24123423423');
    const currentState: any = fsmInfos.find((fi: any) => {
      return fi.stateInfo.origin === data.fsmCurrentState;
    });

    // console.log(data, FUtil.Tool.getUserIDByCookies(), '#@#$@#$@#@@@@@@@@@@');
    setIsSelfLicensorOwner(data.licensorOwnerId === FUtil.Tool.getUserIDByCookies());
    setModalTarget(data.subjectName);
    setModalContractName(data.contractName);
    setModalPayee(data.licensorOwnerName);

    const currentSData: IContractDisplayStates['currentS'] = {
      name: currentState.stateInfo.content,
      colors: currentState.serviceStateInfos.map((ssi: any) => {
        return ssi.content;
      }),
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
    setCurrentS(currentSData);

    // console.log(currentSData, 'currentSDatacurrentSData11111111');
    const historySsData: IContractDisplayStates['historySs'] = (data1.dataList as any[])
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
      }).reverse();

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
    setModalAccountBalance(data.balance);
    setModalAccountID(data.accountId);
    setModalVisible(true);
  }

  async function confirmPay() {
    const params: Parameters<typeof FServiceAPI.Event.transaction>[0] = {
      contractId: contractID,
      eventId: modalEventID,
      accountId: modalAccountID,
      transactionAmount: modalTransactionAmount,
      password: modalPassword,
    };
    const { data, errCode, errcode, msg, ret } = await FServiceAPI.Event.transaction(params);
    if (ret + (errCode || 0) + (errcode || 0) > 0) {
      return fMessage(msg, 'error');
    }

    // console.log(data, 'data13241234');

    const bool: boolean = await paymentStatus(data.transactionRecordId);
    if (!bool) {
      return fMessage('交易关闭', 'error');
    }

    fetchInitData();
    fMessage('支付成功');
    setModalVisible(false);
    setModalPassword('');
    onChangedEvent && onChangedEvent();
  }

  return (<div>
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
                  currentS.colors.length > 0
                    ? currentS.colors.map((cl) => {
                      return (<label key={cl} className={styles.Authorized}>{cl}</label>);
                    })
                    : (<label className={styles.Unauthorized}>未授权</label>)
                }
                <FContentText text={currentS.datetime} type='normal' />
              </Space>
              <div style={{ height: 10 }} />
              <FContentText
                type='highlight'
                text={currentS.name}
              />

              {
                currentS.events.length > 0 && (<>
                  <div style={{ height: 10 }} />

                  <Space size={10} direction='vertical' style={{ width: '100%' }}>
                    {
                      currentS.events.map((eti) => {

                        if (eti.type === 'TransactionEvent') {
                          return (<div key={eti.id} className={styles.Event}>
                            <FContentText
                              style={{ flexShrink: 1 }}
                              type='normal'
                              text={eti.tip}
                            />
                            {
                              !isSelfLicensorOwner && (<FRectBtn
                                style={{ flexShrink: 0 }}
                                type='primary'
                                size='small'
                                onClick={() => {
                                  setModalEventID(eti.id);
                                  // console.log(eti.origin.args.amount, '!#@$!234123412341234');
                                  setModalTransactionAmount(eti.amount);
                                  readyPay();
                                }}
                              >支付</FRectBtn>)
                            }

                          </div>);
                        } else if (eti.type === 'RelativeTimeEvent') {
                          return (<div key={eti.id} className={styles.Event}>
                            <FContentText
                              type='normal'
                              text={eti.tip}
                            />
                          </div>);
                        } else if (eti.type === 'TimeEvent') {
                          return (<div key={eti.id} className={styles.Event}>
                            <FContentText
                              type='normal'
                              text={eti.tip}
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
                          <FContentText
                            type='highlight'
                            text={hs.name}
                          />
                          <div style={{ height: 10 }} />

                          <div className={styles.Event}>
                            <FContentText
                              type='normal'
                              text={hs.event.tip}
                            />

                            <span style={{ color: '#2784FF' }}>已执行</span>
                          </div>

                          <div className={styles.mask} />
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
                    >展开流转记录 <FDown /></FTextBtn>)
                    : (<FTextBtn
                      type='default'
                      onClick={() => {
                        setRecodeFold(true);
                      }}
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


    <FModal
      title={null}
      footer={null}
      visible={modalVisible}
      width={600}
      onCancel={() => {
        setModalVisible(false);
        setModalPassword('');
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
        <label>{modalTransactionAmount}</label>
        <div style={{ width: 10 }} />
        <FTipText text={'羽币'} type='third' />
      </div>
      <div style={{ height: 40 }} />
      <div className={styles.paymentInfo}>
        <Space size={20} direction='vertical' style={{ width: 440 }}>
          <div className={styles.paymentInfoRow}>
            <div><FContentText text={'标的物'} type='normal' /></div>
            <div><FContentText text={modalTarget} type='highlight' /></div>
          </div>

          <div className={styles.paymentInfoRow}>
            <div><FContentText text={'授权合约'} type='normal' /></div>
            <div><FContentText text={modalContractName} type='highlight' /></div>
          </div>

          <div className={styles.paymentInfoRow}>
            <div><FContentText text={'收款方'} type='normal' /></div>
            <div><FContentText text={modalPayee} type='highlight' /></div>
          </div>

          <div className={styles.paymentInfoRow}>
            <div><FContentText text={'支付方式'} type='normal' /></div>
            <div>
              <FContentText text={'羽币账户'} type='highlight' />
              <div style={{ width: 10 }} />
              <FContentText text={`(余额 ${modalAccountBalance}枚 )`} type='negative' />
            </div>
          </div>

          <div className={styles.paymentInfoRow}>
            <div><FContentText text={'支付密码'} type='normal' /></div>
            <div>
              <FPaymentPasswordInput
                value={modalPassword}
                onChange={(value) => {
                  // console.log(value, '@#$@#$@#$@#$');
                  setModalPassword(value);
                }}
              />
            </div>
          </div>

          <div>
            <FRectBtn
              style={{ width: '100%' }}
              onClick={() => {
                confirmPay();
              }}
            >确认支付</FRectBtn>
          </div>
        </Space>
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
