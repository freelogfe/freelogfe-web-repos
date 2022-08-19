import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import {
  OnCancel_Activate_CaptchaModal_Action, OnClick_Activate_NextBtn_Action,
  OnClick_ChangingPasswordBtn_Action,
  OnClick_Table_LoadMoreBtn_Action,
  WalletPageModelState,
} from '@/models/walletPage';
import FSafetyLock from '@/components/FIcons/FSafetyLock';
import { ColumnsType } from 'antd/lib/table';
import FTable from '@/components/FTable';
import FListFooter from '@/components/FListFooter';
import { Modal, Space } from 'antd';
import FInput from '@/components/FInput';

interface RewardProps {

}

function Reward({}: RewardProps) {

  const columns: ColumnsType<any> = [
    {
      title: (<FComponentsLib.FTitleText text={'时间'} type='table' />),
      dataIndex: 'dataTime',
      key: 'dataTime',
      width: 150,
      render(_, record) {
        return (<div>
          <FComponentsLib.FContentText text={record.date} type='normal' />
          <FComponentsLib.FContentText text={record.time} type='normal' />
        </div>);
      },
    },
    {
      title: (<FComponentsLib.FTitleText text={'说明'} type='table' />),
      // title: (<FTitleText text={FI18n.i18nNext.t('header_tran_description')} type='table' />),
      dataIndex: 'description',
      key: 'description',
      width: 470,
      render(_, record) {
        return (<div>
          <FComponentsLib.FContentText
            text={record.digest}
            type='highlight'
          />
        </div>);
      },
    }, {
      // title: (<FTitleText text={'金额（枚）'} type='table' />),
      title: (<FComponentsLib.FTitleText text={'金额（元）'} type='table' />),
      dataIndex: 'amount',
      key: 'amount',
      width: 160,
      render(_, record) {
        return (<div>
          <FComponentsLib.FTitleText
            text={record.transactionAmount.startsWith('-') ? record.transactionAmount : ('+' + record.transactionAmount)}
            type='h1'
          />
          <FComponentsLib.FContentText
            text={`余额 ${record.afterBalance}`}
            type='additional1'
          />
        </div>);
      },
    },
  ];

  return (<div className={styles.styles}>
      <div style={{ height: 40 }} />
      <FComponentsLib.FTitleText
        type='h1'
        text={'活动奖励'}
      />
      <div style={{ height: 20 }} />
      <div className={styles.AccountInfo}>
        <div>
          <FComponentsLib.FTitleText
            type='h4'
            text={'可提现金额（元）'}
          />
          <div style={{ height: 15 }} />
          <div className={styles.Gold}>{1234234}</div>
        </div>
        <FComponentsLib.FRectBtn type={'primary'}>提现至微信</FComponentsLib.FRectBtn>
      </div>

      <div style={{ height: 40 }} />
      <FComponentsLib.FTitleText type='h1' text={'奖励明细'} />
      <div style={{ height: 20 }} />

      <div className={styles.TableBody}>
        <FTable
          columns={columns}
          dataSource={[]}
        />

        {/*<FListFooter*/}
        {/*  state={walletPage.table_More}*/}
        {/*  onClickLoadMore={() => {*/}
        {/*    dispatch<OnClick_Table_LoadMoreBtn_Action>({*/}
        {/*      type: 'walletPage/onClick_Table_LoadMoreBtn',*/}
        {/*    });*/}
        {/*  }}*/}
        {/*/>*/}
      </div>

      <Modal
        destroyOnClose
        title={<FComponentsLib.FTitleText
          text={'奖励提现'}
          type='popup'
        />}
        visible={true}
        onCancel={() => {
          // dispatch<OnCancel_Activate_CaptchaModal_Action>({
          //   type: 'walletPage/onCancel_Activate_CaptchaModal',
          // });
        }}
        footer={null}
        width={580}
      >
        <div className={styles.ActivateAccountContent}>
          <Space size={30} direction='vertical' style={{ width: 440 }}>
            <Space size={10} direction='vertical'>
              <FComponentsLib.FTipText type='third' text={'可提现金额'} />
              <div className={styles.Gold}>{1234234}</div>
            </Space>

            <Space size={10} direction='vertical'>
              <FComponentsLib.FTipText type='third' text={'微信账号'} />
              <FComponentsLib.FContentText text={'yanghongtian'} type={'highlight'} />
            </Space>

            <Space size={10} direction='vertical' style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <FComponentsLib.FTipText type='third' text={'实名认证'} />
                <div style={{ width: 10 }} />
                <FComponentsLib.FContentText type={'additional2'} text={'为了保障资金安全，微信平台要求验证提现微信账号真实姓名'} />
              </div>
              <FInput
                value={''}
                onChange={(e) => {
                  // set_password(e.target.value);
                }}
                placeholder='输入已绑定微信的认证实名'
                className={styles.modalBlockInput}
                wrapClassName={styles.modalBlockInput}
              />
            </Space>

            <Space size={10} direction='vertical' style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <FComponentsLib.FTipText type='third' text={'提现金额'} />
                  <div style={{ width: 10 }} />
                  <FComponentsLib.FContentText type={'additional2'} text={'可提现金额少于20元时将不能提现'} />
                </div>

                <FComponentsLib.FTextBtn type={'primary'}>全部提现</FComponentsLib.FTextBtn>
              </div>
              <FInput
                value={''}
                onChange={(e) => {
                  // set_password(e.target.value);
                }}
                placeholder='输入提现金额'
                className={styles.modalBlockInput}
                wrapClassName={styles.modalBlockInput}
              />
            </Space>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <FComponentsLib.FRectBtn
                type='primary'
                // disabled={!walletPage.activating_Captcha}
                onClick={() => {
                  // dispatch<OnClick_Activate_NextBtn_Action>({
                  //   type: 'walletPage/onClick_Activate_NextBtn',
                  // });
                }}
              >提现</FComponentsLib.FRectBtn>
            </div>
          </Space>
        </div>
      </Modal>
    </div>
  );
}

export default Reward;
