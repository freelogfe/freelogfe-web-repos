import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { Space } from 'antd';
import { FContentText, FTipText, FTitleText } from '@/components/FText';
import { FRectBtn } from '@/components/FButton';
import FModal from '@/components/FModal';
import FInput from '@/components/FInput';
import FCodeFormatter from '@/components/FCodeFormatter';
import FUtil1 from '@/utils';
import fMessage from '@/components/fMessage';

interface FContractDisplayProps {
  contractID: string;
  containerHeight?: string | number;

  onChangedEvent?(): void;
}

interface IContractDisplayStates {
  activated: 'record' | 'code' | 'text' | 'view';

  // currentState: IStateAndEvents | null;
  // historyStates: IStateAndEvents[];

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

function FContractDisplay({ contractID, containerHeight = 'auto', onChangedEvent }: FContractDisplayProps) {

  const [activated, setActivated] = React.useState<IContractDisplayStates['activated']>('record');

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

    fetchInitDa();
  }, [contractID]);

  async function fetchInitDa() {

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

    console.log(fsmInfos, 'data1data1data1currentState9087098-09');

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
    const { error, text } = await FUtil1.Tool.codeTranslationToText({
      code: data.policyInfo.policyText,
      targetType: 'resource',
    });
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

    console.log(data, '@!#$#@!$@#$2314123432');
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
      fMessage(msg, 'error');
    } else {
      fetchInitDa();
      fMessage('支付成功');
      setModalVisible(false);
      setModalPassword('');
      onChangedEvent && onChangedEvent();
    }
  }

  return (<div>
    <div className={styles.PolicyBodyTabs}>
      <a
        className={activated === 'record' ? styles.PolicyBodyTabActivated : ''}
        onClick={() => {
          setActivated('record');
        }}
      >合约流转记录</a>
      <div style={{ width: 20 }} />

      <a
        className={activated === 'text' ? styles.PolicyBodyTabActivated : ''}
        onClick={() => {
          setActivated('text');
        }}
      >策略内容</a>
      <div style={{ width: 20 }} />
      <a
        className={activated === 'view' ? styles.PolicyBodyTabActivated : ''}
        onClick={() => {
          setActivated('view');
        }}
      >状态机视图</a>
      <div style={{ width: 20 }} />
      <a
        className={activated === 'code' ? styles.PolicyBodyTabActivated : ''}
        onClick={() => {
          setActivated('code');
        }}
      >策略代码</a>
    </div>

    <div
      className={styles.PolicyBodyContainer}
      style={{ height: containerHeight }}
    >
      {/*{console.log(currentS, 'currentScurrentS')}*/}
      {/*{console.log(historySs, 'historySshistorySs')}*/}
      {
        activated === 'record' && (<div style={{ width: '100%' }}>
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
              <div style={{ height: 10 }} />
              {
                currentS.events.map((eti) => {
                  if (eti.type === 'TransactionEvent') {
                    return (<div key={eti.id} className={styles.Event}>
                      <FContentText
                        type='normal'
                        text={eti.tip}
                      />
                      <FRectBtn
                        type='primary'
                        size='small'
                        onClick={() => {
                          setModalEventID(eti.id);
                          // console.log(eti.origin.args.amount, '!#@$!234123412341234');
                          setModalTransactionAmount(eti.amount);
                          readyPay();
                        }}
                      >支付</FRectBtn>
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

            </div>)
          }

          <div style={{ height: 20 }} />

          <div className={styles.TransferringRecords} style={{ width: '100%' }}>

            <Space size={20} direction='vertical' style={{ width: '100%' }}>


              {
                historySs.map((hs) => {
                  // console.log(hs, 'hshshshshshshs1234234');
                  return (<div className={styles.TransferringRecord}>
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
                    </div>

                    <div className={styles.mask} />
                  </div>);
                })
              }

            </Space>

          </div>
        </div>)
      }


      {
        activated === 'text' && (<div>
          <FCodeFormatter code={text} />
        </div>)
      }

      {
        activated === 'view' && (<div>
        </div>)
      }

      {
        activated === 'code' && (<div>
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

          <div>
            <FInput
              value={modalPassword}
              onChange={(e) => {
                setModalPassword(e.target.value);
              }}
              className={styles.paymentPassword}
              wrapClassName={styles.paymentPassword}
              type='password'
              placeholder='输入6位支付密码'
            />
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
