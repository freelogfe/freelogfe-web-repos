import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { ColumnsType } from 'antd/lib/table';
import FTable from '@/components/FTable';
import { Modal, Space } from 'antd';
import FInput from '@/components/FInput';
import * as AHooks from 'ahooks';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, RewardPageModelState } from '@/models/connect';
import {
  OnBlur_WithdrawModal_AmountInput_Action,
  OnBlur_WithdrawModal_RealNameInput_Action, OnChange_WithdrawModal_AmountInput_Action,
  OnChange_WithdrawModal_RealNameInput_Action,
  OnClick_WechatModal_BindingBtn_Action, OnClick_WechatModal_RefreshBtn_Action,
  OnClick_WithdrawBtn_Action, OnClick_WithdrawModal_ConfirmBtn_Action, OnClick_WithdrawModal_TotalBtn_Action,
  OnClose_WechatModal_Action, OnClose_WithdrawModal_Action,
  OnMountPageAction,
  OnUnmountPageAction,
} from '@/models/rewardPage';
import FNoDataTip from '@/components/FNoDataTip';
import FListFooter from '@/components/FListFooter';
import FVerifyUserPasswordModal from '@/components/FVerifyUserPasswordModal';

interface RewardProps {
  dispatch: Dispatch;

  rewardPage: RewardPageModelState;
}

function Reward({ dispatch, rewardPage }: RewardProps) {

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'rewardPage/onMountPage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'rewardPage/onUnmountPage',
    });
  });

  const columns: ColumnsType<RewardPageModelState['records'][number]> = [
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
            text={record.transactionAmount < 0 ? ('' + record.transactionAmount) : ('+' + record.transactionAmount)}
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
          <div className={styles.Gold}>{rewardPage.cashAmount}</div>
        </div>
        <Space size={20}>
          {
            rewardPage.cashAmount < 20 && (
              <div style={{ fontSize: 14, color: '#E9A923', display: 'flex', alignItems: 'center' }}>
                <FComponentsLib.FIcons.FWarning />
                <div style={{ width: 5 }} />
                <span>可提现金额少于20元，不可提现</span>
              </div>)
          }

          <FComponentsLib.FRectBtn
            type={'primary'}
            disabled={rewardPage.cashAmount < 20}
            onClick={() => {
              dispatch<OnClick_WithdrawBtn_Action>({
                type: 'rewardPage/onClick_WithdrawBtn',
              });
            }}
          >提现至微信</FComponentsLib.FRectBtn>
        </Space>
      </div>

      <div style={{ height: 40 }} />
      <FComponentsLib.FTitleText type='h1' text={'奖励明细'} />
      <div style={{ height: 20 }} />

      <div className={styles.TableBody}>

        {
          rewardPage.records.length === 0
            ? (<FNoDataTip
              height={600}
              tipText={'无奖励明细'}
            />)
            : (<>
              <FTable
                columns={columns}
                dataSource={rewardPage.records}
              />
              <FListFooter
                state={'noMore'}
                // onClickLoadMore={() => {
                //   dispatch<OnClick_Table_LoadMoreBtn_Action>({
                //     type: 'walletPage/onClick_Table_LoadMoreBtn',
                //   });
                // }}
              />
            </>)
        }


      </div>

      <div style={{ height: 100 }} />

      <Modal
        title={<FComponentsLib.FTitleText
          text={'提示'}
          type='popup'
        />}
        visible={rewardPage.showModal === 'wechat'}
        onCancel={() => {
          dispatch<OnClose_WechatModal_Action>({
            type: 'rewardPage/onClose_WechatModal',
          });
        }}
        footer={null}
        width={580}
      >
        <div className={styles.unableWithdrawCash}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 30,
              alignItems: 'center',
              minHeight: 100,
              justifyContent: 'center',
            }}
          >
            {
              rewardPage.wechatModal_task === 'binding' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                  <div style={{ fontSize: 14, color: '#E9A923', display: 'flex', alignItems: 'center' }}>
                    <FComponentsLib.FIcons.FWarning />
                    <div style={{ width: 5 }} />
                    <span>提现需绑定微信</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FComponentsLib.FContentText text={'需绑定微信才可提现'} type={'additional2'} />
                    <FComponentsLib.FTextBtn
                      type={'primary'}
                      style={{ fontSize: 12 }}
                      onClick={() => {
                        dispatch<OnClick_WechatModal_BindingBtn_Action>({
                          type: 'rewardPage/onClick_WechatModal_BindingBtn',
                        });
                      }}
                    >绑定微信</FComponentsLib.FTextBtn>
                  </div>
                </div>)
            }

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
              <div style={{ fontSize: 14, color: '#E9A923', display: 'flex', alignItems: 'center' }}>
                <FComponentsLib.FIcons.FWarning />
                <div style={{ width: 5 }} />
                <span>提现需关注微信公众号</span>
              </div>

              <FComponentsLib.FContentText text={'因微信企业支付平台目前不提供网页提现的功能，请关注公众号后进行提现操作'} type={'additional2'} />

              <img src={'//static.freelog.com/static/WeChatQR.jpg'} style={{ width: 160, height: 160 }} />
            </div>
          </div>

          <div style={{ height: 30 }} />

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FComponentsLib.FContentText text={'已完成上述操作，'} type={'negative'} />
            <FComponentsLib.FTextBtn
              type={'primary'}
              onClick={() => {
                dispatch<OnClick_WechatModal_RefreshBtn_Action>({
                  type: 'rewardPage/onClick_WechatModal_RefreshBtn',
                });
              }}
            >立即刷新</FComponentsLib.FTextBtn>
            &nbsp;
            <FComponentsLib.FContentText
              text={'开始提现'}
              type={'negative'}
            />

          </div>
          {/*<Space size={30} style={{ width: 440, alignItems: 'center' }}>*/}
          {/*  <Space size={10} direction='vertical'>*/}
          {/*    */}
          {/*  </Space>*/}
          {/*</Space>*/}
        </div>
      </Modal>

      <Modal
        title={<FComponentsLib.FTitleText
          text={'奖励提现'}
          type='popup'
        />}
        visible={rewardPage.showModal === 'withdraw'}
        onCancel={() => {
          dispatch<OnClose_WithdrawModal_Action>({
            type: 'rewardPage/onClose_WithdrawModal',
          });
        }}
        footer={null}
        width={580}
      >
        <div className={styles.ActivateAccountContent}>
          <Space size={30} direction='vertical' style={{ width: 440 }}>
            <Space size={10} direction='vertical'>
              <FComponentsLib.FTipText type='third' text={'可提现金额'} />
              <div className={styles.Gold}>{rewardPage.cashAmount}</div>
            </Space>

            <Space size={10} direction='vertical'>
              <FComponentsLib.FTipText type='third' text={'微信账号'} />
              <FComponentsLib.FContentText text={rewardPage.withdrawModal_WechatName} type={'highlight'} />
            </Space>

            <Space size={10} direction='vertical' style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <FComponentsLib.FTipText type='third' text={'实名认证'} />
                <div style={{ width: 10 }} />
                <FComponentsLib.FContentText
                  type={'additional2'}
                  text={'为了保障资金安全，微信平台要求验证提现微信账号真实姓名'}
                />
              </div>
              <FInput
                value={rewardPage.withdrawModal_RealName}
                onChange={(e) => {
                  dispatch<OnChange_WithdrawModal_RealNameInput_Action>({
                    type: 'rewardPage/onChange_WithdrawModal_RealNameInput',
                    payload: {
                      value: e.target.value,
                    },
                  });
                }}
                onBlur={() => {
                  dispatch<OnBlur_WithdrawModal_RealNameInput_Action>({
                    type: 'rewardPage/onBlur_WithdrawModal_RealNameInput',
                  });
                }}
                errorText={rewardPage.withdrawModal_RealNameError}
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

                <FComponentsLib.FTextBtn
                  type={'primary'}
                  onClick={() => {
                    dispatch<OnClick_WithdrawModal_TotalBtn_Action>({
                      type: 'rewardPage/onClick_WithdrawModal_TotalBtn',
                    });
                  }}
                >全部提现</FComponentsLib.FTextBtn>
              </div>
              <FInput
                value={rewardPage.withdrawModal_Amount}
                onChange={(e) => {
                  dispatch<OnChange_WithdrawModal_AmountInput_Action>({
                    type: 'rewardPage/onChange_WithdrawModal_AmountInput',
                    payload: {
                      value: e.target.value,
                    },
                  });
                }}
                onBlur={() => {
                  dispatch<OnBlur_WithdrawModal_AmountInput_Action>({
                    type: 'rewardPage/onBlur_WithdrawModal_AmountInput',
                  });
                }}
                errorText={rewardPage.withdrawModal_AmountError}
                placeholder='输入提现金额'
                className={styles.modalBlockInput}
                wrapClassName={styles.modalBlockInput}
              />
            </Space>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <FComponentsLib.FRectBtn
                type='primary'
                disabled={rewardPage.withdrawModal_RealName === ''
                || rewardPage.withdrawModal_RealNameError !== ''
                || rewardPage.withdrawModal_Amount === ''
                || rewardPage.withdrawModal_AmountError !== ''
                || rewardPage.withdrawModal_drawing
                }
                onClick={() => {
                  dispatch<OnClick_WithdrawModal_ConfirmBtn_Action>({
                    type: 'rewardPage/onClick_WithdrawModal_ConfirmBtn',
                  });
                }}
              >提现</FComponentsLib.FRectBtn>
            </div>
          </Space>
        </div>
      </Modal>

      <FVerifyUserPasswordModal
        visible={rewardPage.showModal === 'verify'}
        // actionReturn={bindTip.way === 'unbind' ? unBind : undefined}
        onCancel={() => {
          // setVerifyPassword(false);
        }}
        onSuccess={(data) => {
          console.log(data, 'dataiwoefjsdlkfjsdlkj');
        }}
      />
    </div>
  );
}

export default connect(({ rewardPage }: ConnectState) => ({
  rewardPage,
}))(Reward);
