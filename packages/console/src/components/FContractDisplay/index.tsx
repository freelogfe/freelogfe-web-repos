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

}

interface IContractDisplayStates {
  activated: 'record' | 'code' | 'text' | 'view';

  currentState: IStateAndEvents | null;
  historyStates: IStateAndEvents[];

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

type IStateAndEvents = {
  stateInfo: {
    content: string;
    origin: string;
  };
  eventTranslateInfos: {
    content: string;
    origin: {
      id: string;
      name: 'RelativeTimeEvent'
      args: { elapsed: number, timeUnit: string; };
      state: string;
    } | {
      id: string;
      name: 'TransactionEvent'
      args: { amount: number, account: string; };
      state: string;
    };
  }[];

};

function FContractDisplay({ contractID, containerHeight = 'auto' }: FContractDisplayProps) {

  const [activated, setActivated] = React.useState<IContractDisplayStates['activated']>('record');

  const [currentState, setCurrentState] = React.useState<IContractDisplayStates['currentState']>(null);
  const [historyStates, setHistoryStates] = React.useState<IContractDisplayStates['historyStates']>([]);

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
    console.log(data, 'data111122222333333333');
    const params1: Parameters<typeof FServiceAPI.Contract.transitionRecords>[0] = {
      contractId: contractID,
    };

    const { data: data1 } = await FServiceAPI.Contract.transitionRecords(params1);

    const fsmInfos: IStateAndEvents[] = data.policyInfo.translateInfo.fsmInfos;
    // console.log(data, fsmInfos, 'fsmInfos24123423423');
    const currentState = fsmInfos.find((fi) => {
      return fi.stateInfo.origin === data.fsmCurrentState;
    });

    console.log(fsmInfos, data1, 'data1data1data1currentState9087098-09');

    setModalTarget(data.subjectName);
    setModalContractName(data.contractName);
    setModalPayee(data.licensorOwnerName);
    setCurrentState(currentState || null);

    const historyStates1: IContractDisplayStates['historyStates'] = (data1.dataList as any[])
      .map<IContractDisplayStates['historyStates'][number]>((d1l: any) => {
        // console.log(d1l, 'd1l12341234');
        return fsmInfos.find((fi) => {
          return fi.stateInfo.origin === d1l.fromState;
        }) as IContractDisplayStates['historyStates'][number];
      });
    console.log(historyStates1, 'historyStates1historyStates1!@!!!!!!!');
    setHistoryStates([]);
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
      fMessage('支付成功');
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

    <div className={styles.PolicyBodyContainer} style={{ height: containerHeight }}>
      {
        activated === 'record' && (
          <div className={styles.TransferringRecords} style={{ width: '100%' }}>

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
                  <FContentText
                    type='highlight'
                    text={currentState.stateInfo.content}
                  />
                  {/*<div style={{ height: 10 }} />*/}
                  {
                    currentState.eventTranslateInfos.map((eti, ind) => {
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
                              setModalEventID(eti.origin.id);
                              // console.log(eti.origin.args.amount, '!#@$!234123412341234');
                              setModalTransactionAmount((eti.origin.args as any).amount);
                              readyPay();
                            }}
                          >支付</FRectBtn>
                        </div>);
                      } else if (eti.origin.name === 'RelativeTimeEvent') {
                        return (<div key={eti.origin.id}>
                          <FContentText
                            key={eti.origin.id}
                            type='normal'
                            text={eti.content}
                          />
                        </div>);
                      } else {
                        return (<div key={ind}>1234</div>);
                      }
                    })
                  }

                </div>)
              }

              {
                historyStates.map((hs) => {
                  return (<div className={styles.TransferringRecord}>
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
                    <FContentText
                      type='highlight'
                      text={hs.stateInfo.content}
                    />
                    {/*<div style={{ height: 10 }} />*/}
                    {
                      hs.eventTranslateInfos.map((eti, ind) => {
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
                                setModalEventID(eti.origin.id);
                                // console.log(eti.origin.args.amount, '!#@$!234123412341234');
                                setModalTransactionAmount((eti.origin.args as any).amount);
                                readyPay();
                              }}
                            >支付</FRectBtn>
                          </div>);
                        } else if (eti.origin.name === 'RelativeTimeEvent') {
                          return (<div key={eti.origin.id}>
                            <FContentText
                              key={eti.origin.id}
                              type='normal'
                              text={eti.content}
                            />
                          </div>);
                        } else {
                          return (<div key={ind}>1234</div>);
                        }
                      })
                    }

                  </div>);
                })
              }

            </Space>

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
