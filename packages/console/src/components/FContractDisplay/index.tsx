import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { Space } from 'antd';
import { FContentText, FTipText, FTitleText } from '@/components/FText';
import { FRectBtn } from '@/components/FButton';
import FModal from '@/components/FModal';
import FInput from '@/components/FInput';

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
              placeholder='输入6位支付密码'
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
