import * as React from 'react';
import styles from './index.less';
import { FContentText, FTipText, FTitleText } from '@/components/FText';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import FSafetyLock from '@/components/FIcons/FSafetyLock';
import FTable from '@/components/FTable';
import { ColumnsType } from 'antd/lib/table';
import { Modal, Space, Radio, message, DatePicker, Input } from 'antd';
import FInput from '@/components/FInput';
import * as AHooks from 'ahooks';
import { connect, Dispatch } from 'dva';
import { ConnectState, UserModelState, WalletPageModelState } from '@/models/connect';
import {
  OnBlur_ChangingPassword_NewPasswordModal_Password1Input_Action,
  OnBlur_ChangingPassword_NewPasswordModal_Password2Input_Action,
  OnBlurActivateAccountPassword1Action,
  OnBlurActivateAccountPassword2Action,
  OnCancel_ChangingPassword_CaptchaModal_Action,
  OnCancel_ChangingPassword_NewPasswordModal_Action,
  OnCancel_ChangingPassword_OldPasswordModal_Action,
  OnCancelActivateAccountModalAction,
  OnChange_ChangingPassword_CaptchaModal_CaptchaInput_Action,
  OnChange_ChangingPassword_CaptchaModal_SentCaptchaWait_Action,
  OnChange_ChangingPassword_CaptchaModal_TypeCheckbox_Action,
  OnChange_ChangingPassword_NewPasswordModal_Password1_Action,
  OnChange_ChangingPassword_NewPasswordModal_Password2Input_Action,
  OnChange_ChangingPassword_OldPasswordModal_PasswordInput_Action,
  OnChangeActivateAccountCaptchaInputAction,
  OnChangeActivateAccountModeAction,
  OnChangeActivateAccountPassword1Action,
  OnChangeActivateAccountPassword2Action,
  OnChangeActivatingAccountSentCaptchaWaitAction,
  OnClick_ChangingPassword_CaptchaModal_NextBtn_Action,
  OnClick_ChangingPassword_CaptchaModal_SendBtn_Action,
  OnClick_ChangingPassword_NewPasswordModal_ConfirmBtn_Action,
  OnClick_ChangingPassword_OldPasswordModal_NextBtn_Action,
  OnClick_ChangingPasswordBtn_Action,
  OnClickActivateAccountBtnAction,
  OnClickActivateAccountCaptchaBtnAction,
  OnClickActivateAccountConfirmBtnAction,
  OnMountPageAction,
  OnUnmountPageAction,
} from '@/models/walletPage';
import { FCheck } from '@/components/FIcons';
import FLoadingTip from '@/components/FLoadingTip';
import { FUtil } from '@freelog/tools-lib';
import FPaymentPasswordInput from '@/components/FPaymentPasswordInput';
import FDropdownMenu from '@/components/FDropdownMenu';
import FListFooter from '@/components/FListFooter';

interface WalletProps {
  dispatch: Dispatch;
  walletPage: WalletPageModelState;
  user: UserModelState;
}

//1.交易确认中 2:交易成功 3:交易关闭
const stateOptions = [
  { value: '0', text: '全部' },
  { value: '1', text: '交易确认中' },
  { value: '2', text: '交易成功' },
  { value: '3', text: '交易关闭' },
];

function Wallet({ dispatch, walletPage, user }: WalletProps) {

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'walletPage/onMountPage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'walletPage/onUnmountPage',
    });
  });

  AHooks.useInterval(() => {
    dispatch<OnChangeActivatingAccountSentCaptchaWaitAction>({
      type: 'walletPage/onChangeActivatingAccountSentCaptchaWait',
      payload: {
        value: walletPage.activatingAccountSentCaptchaWait - 1,
      },
    });
  }, walletPage.activatingAccountSentCaptchaWait === 0 ? null : 1000);

  AHooks.useInterval(() => {
    dispatch<OnChange_ChangingPassword_CaptchaModal_SentCaptchaWait_Action>({
      type: 'walletPage/onChange_ChangingPassword_CaptchaModal_SentCaptchaWait',
      payload: {
        value: walletPage.changingPassword_CaptchaModal_SentCaptchaWait - 1,
      },
    });
  }, walletPage.changingPassword_CaptchaModal_SentCaptchaWait === 0 ? null : 1000);

  const columns: ColumnsType<{
    serialNo: string;
    date: string;
    time: string;
    digest: string;
    reciprocalAccountId: string;
    reciprocalAccountName: string;
    reciprocalAccountType: string;
    transactionAmount: string;
    afterBalance: string;
    status: 1 | 2 | 3 | 4;
  }> = [
    {
      title: (<FTitleText text={'时间'} type='table' />),
      dataIndex: 'dataTime',
      key: 'dataTime',
      render(_, record) {
        return (<div>
          {
            record.date && (<FContentText text={record.date} type='normal' />)
          }
          <FContentText text={record.time} type='normal' />
        </div>);
      },
    }, {
      title: (<FTitleText text={'交易说明｜对方｜流水号'} type='table' />),
      dataIndex: 'num',
      key: 'num',
      render(_, record) {
        return (<div>
          <FContentText
            text={record.digest}
            type='highlight'
          />
          <FContentText
            text={`${record.reciprocalAccountName}｜${record.serialNo}`}
            type='additional1'
          />
        </div>);
      },
    }, {
      title: (<FTitleText text={'金额'} type='table' />),
      dataIndex: 'amount',
      key: 'amount',
      render(_, record) {
        return (<div>
          <FTitleText
            text={record.transactionAmount.startsWith('-') ? record.transactionAmount : ('+' + record.transactionAmount)}
            type='h1'
          />
          <FContentText
            text={`余额 ${record.afterBalance}`}
            type='additional1'
          />
        </div>);
      },
    }, {
      title: (<FTitleText text={'交易状态'} type='table' />),
      dataIndex: 'status',
      key: 'status',
      render(_, record) {
        const allStatus = ['', '交易确认中', '交易成功', '交易取消', '交易失败'];
        if (record.status !== 2) {
          return (<div className={styles.tipProcessing}>{allStatus[record.status]}</div>);
        }
        return (<div className={styles.tipCompleted}>{allStatus[record.status]}</div>);
      },
    },
  ];

  if (walletPage.accountStatus === -1) {
    return (<FLoadingTip height={'calc(100vh - 70px)'} />);
  }

  return (<div className={styles.styles}>
    <div style={{ height: 40 }} />
    <FTitleText
      type='h1'
      text={'羽币账户'}
    />
    <div style={{ height: 20 }} />
    {
      walletPage.accountStatus === 0
        ? (<div className={styles.Inactive}>
          <FTipText text={'账户未激活，点击按钮激活'} type='second' />
          <div style={{ width: 30 }} />
          <FRectBtn
            type='primary'
            onClick={() => {
              dispatch<OnClickActivateAccountBtnAction>({
                type: 'walletPage/onClickActivateAccountBtn',
              });
            }}
          >激活账户</FRectBtn>
        </div>)
        : (<>
          <div className={styles.AccountInfo}>
            <div>
              <FTitleText
                type='h4'
                text={'账户余额（枚）'}
              />
              <div style={{ height: 15 }} />
              <div className={styles.Gold}>{walletPage.accountBalance}</div>
            </div>
            <div
              className={styles.ChangePassword}
              onClick={() => {
                dispatch<OnClick_ChangingPasswordBtn_Action>({
                  type: 'walletPage/onClick_ChangingPasswordBtn',
                });
              }}
            >
              <FSafetyLock style={{ fontSize: 32, color: '#DA6666' }} />
              {/*<div style={{height: 10}}/>*/}
              <div style={{ color: '#333', fontSize: 13 }}>修改支付密码</div>
            </div>
          </div>
          {
            walletPage.table_DateSource.length > 0 && (<>
              <div style={{ height: 40 }} />
              <FTitleText type='h1' text={'交易记录'} />
              <div style={{ height: 20 }} />
              <div className={styles.TableBody}>
                <div style={{ height: 20 }} />
                <div className={styles.filter1}>
                  <div className={styles.filter1Date}>
                    <FContentText
                      text={'日期区间：'}
                    />
                    <div style={{ width: 5 }} />
                    <DatePicker.RangePicker />
                    <div style={{ width: 15 }} />
                    <a className={[styles.dateRange, styles.active].join(' ')}>近一周</a>
                    <a className={styles.dateRange}>近一月</a>
                    <a className={styles.dateRange}>近一年</a>
                  </div>
                  <div className={styles.filter1Keyword}>
                    <FInput theme='dark' />
                  </div>
                </div>
                <div style={{ height: 15 }} />
                <div className={styles.filter2}>
                  <FContentText
                    text={'金额区间：'}
                  />
                  <div style={{ width: 5 }} />
                  <FInput
                    size='small'
                    placeholder={'最低金额'}
                    className={styles.filterAmount}
                    wrapClassName={styles.filterAmount}
                    onChange={() => {

                    }}
                  />
                  <span className={styles.filterAmountTo}>-</span>
                  <FInput
                    size='small'
                    placeholder={'最高金额'}
                    className={styles.filterAmount}
                    wrapClassName={styles.filterAmount}
                    onChange={() => {

                    }}
                  />
                  <div style={{ width: 50 }} />
                  <FContentText text={'交易状态：'} />
                  <div style={{ width: 5 }} />
                  <FDropdownMenu
                    options={stateOptions}
                    text={'全部'}
                  />
                </div>
                <div style={{ height: 30 }} />
                <div className={styles.totalAmount}>
                  <FTitleText text={'支出'} type='table' />
                  <div style={{ width: 10 }} />
                  <div className={styles.totalAmountExpenditure}>20.00</div>
                  <div style={{ width: 20 }} />
                  <FTitleText text={'收入'} type='table' />
                  <div style={{ width: 10 }} />
                  <div className={styles.totalAmountIncome}>130.00</div>
                </div>
                <div style={{ height: 10 }} />

                <FTable
                  columns={columns}
                  dataSource={walletPage.table_DateSource.map((tr) => {
                    return {
                      key: tr.serialNo,
                      ...tr,
                    };
                  })}
                />

                <FListFooter state={'andMore'} />
              </div>
            </>)
          }

        </>)
    }
    <div style={{ height: 100 }} />

    <Modal
      destroyOnClose
      title={<FTitleText text={'激活账户验证'} type='popup' />}
      visible={walletPage.activatingAccount}
      onCancel={() => {
        dispatch<OnCancelActivateAccountModalAction>({
          type: 'walletPage/onCancelActivateAccountModal',
        });
      }}
      footer={null}
      width={500}
    >
      <div className={styles.ActivateAccountContent}>
        <Space size={25} direction='vertical' style={{ width: 320 }}>
          <Space size={15} direction='vertical'>
            <FTipText type='third' text={'验证方式'} />
            {
              walletPage.activatingAccountMobile && (<Space size={2}>
                <Radio
                  checked={walletPage.activatingAccountType === 'phone'}
                  onChange={(e) => {
                    // onChange({
                    //   activatingAccountType: 'phone',
                    // });
                    dispatch<OnChangeActivateAccountModeAction>({
                      type: 'walletPage/onChangeActivateAccountMode',
                      payload: {
                        value: 'phone',
                      },
                    });
                  }}
                />
                <FContentText text={walletPage.activatingAccountMobile} type='normal' />
              </Space>)
            }

            {
              walletPage.activatingAccountEmail && (<Space size={2}>
                <Radio
                  checked={walletPage.activatingAccountType === 'email'}
                  onChange={(e) => {
                    // onChange({
                    //   activatingAccountType: 'email',
                    // });
                    dispatch<OnChangeActivateAccountModeAction>({
                      type: 'walletPage/onChangeActivateAccountMode',
                      payload: {
                        value: 'email',
                      },
                    });
                  }}
                />
                <FContentText text={walletPage.activatingAccountEmail} type='normal' />
              </Space>)
            }

          </Space>

          <div>
            <FTipText type='third' text={'验证码'} />
            <div style={{ height: 5 }} />
            <Space size={10}>
              <FInput
                className={styles.verificationCodeInput}
                wrapClassName={styles.verificationCodeInput}
                size='middle'
                value={walletPage.activatingAccountCaptcha}
                onChange={(e) => {
                  dispatch<OnChangeActivateAccountCaptchaInputAction>({
                    type: 'walletPage/onChangeActivateAccountCaptchaInput',
                    payload: {
                      value: e.target.value,
                    },
                  });
                }}
              />
              <FRectBtn
                style={{ width: 110 }}
                type='primary'
                disabled={walletPage.activatingAccountSentCaptchaWait > 0}
                onClick={() => {
                  dispatch<OnClickActivateAccountCaptchaBtnAction>({
                    type: 'walletPage/onClickActivateAccountCaptchaBtn',
                  });
                }}
              >{walletPage.activatingAccountSentCaptchaWait === 0 ? '获取验证码' : `${walletPage.activatingAccountSentCaptchaWait}秒`}</FRectBtn>
            </Space>
          </div>

          <div>
            <FTipText type='third' text={'支付密码'} />
            <div style={{ height: 5 }} />
            <FInput
              type='password'
              className={styles.blockInput}
              wrapClassName={styles.blockInput}
              size='middle'
              value={walletPage.activatingAccountPasswordOne}
              errorText={walletPage.activatingAccountPasswordOneError}
              onChange={(e) => {
                dispatch<OnChangeActivateAccountPassword1Action>({
                  type: 'walletPage/onChangeActivateAccountPassword1',
                  payload: {
                    value: e.target.value,
                  },
                });
              }}
              onBlur={() => {
                dispatch<OnBlurActivateAccountPassword1Action>({
                  type: 'walletPage/onBlurActivateAccountPassword1',
                });
              }}
            />
          </div>

          <div>
            <FTipText type='third' text={'验证支付密码'} />
            <div style={{ height: 5 }} />
            <FInput
              type='password'
              className={styles.blockInput}
              wrapClassName={styles.blockInput}
              size='middle'
              value={walletPage.activatingAccountPasswordTwo}
              errorText={walletPage.activatingAccountPasswordTwoError}
              onChange={(e) => {
                dispatch<OnChangeActivateAccountPassword2Action>({
                  type: 'walletPage/onChangeActivateAccountPassword2',
                  payload: {
                    value: e.target.value,
                  },
                });
              }}
              onBlur={() => {
                dispatch<OnBlurActivateAccountPassword2Action>({
                  type: 'walletPage/onBlurActivateAccountPassword2',
                });
              }}
            />
          </div>
        </Space>
        <div style={{ height: 40 }} />
        <FRectBtn
          type='primary'
          disabled={!walletPage.activatingAccountCaptcha
          || !walletPage.activatingAccountPasswordOne
          || !walletPage.activatingAccountPasswordTwo
          || !!walletPage.activatingAccountPasswordOneError
          || !!walletPage.activatingAccountPasswordTwoError}
          onClick={() => {
            dispatch<OnClickActivateAccountConfirmBtnAction>({
              type: 'walletPage/onClickActivateAccountConfirmBtn',
            });
          }}
        >激活feth账户</FRectBtn>
      </div>

    </Modal>

    <Modal
      destroyOnClose
      title={<FTitleText text={'修改支付密码验证'} type='popup' />}
      visible={walletPage.changingPassword_CaptchaModal_Visible}
      // onOk={handleOk}
      onCancel={() => {
        dispatch<OnCancel_ChangingPassword_CaptchaModal_Action>({
          type: 'walletPage/onCancel_ChangingPassword_CaptchaModal',
        });
      }}
      footer={null}
      width={500}
    >
      <div className={styles.ActivateAccountContent}>
        <Space size={25} direction='vertical' style={{ width: 320 }}>
          <Space size={15} direction='vertical'>
            <FTipText type='third' text={'验证方式'} />
            {
              walletPage.changingPassword_CaptchaModal_Phone && (<Space size={2}>
                <Radio
                  checked={walletPage.changingPassword_CaptchaModal_TypeCheckbox === 'phone'}
                  onChange={(e) => {
                    dispatch<OnChange_ChangingPassword_CaptchaModal_TypeCheckbox_Action>({
                      type: 'walletPage/onChange_ChangingPassword_CaptchaModal_TypeCheckbox',
                      payload: {
                        value: 'phone',
                      },
                    });
                  }}
                />
                <FContentText
                  text={walletPage.changingPassword_CaptchaModal_Phone}
                  type='normal'
                />
              </Space>)
            }

            {
              walletPage.changingPassword_CaptchaModal_Email && (<Space size={2}>
                <Radio
                  checked={walletPage.changingPassword_CaptchaModal_TypeCheckbox === 'email'}
                  onChange={(e) => {
                    dispatch<OnChange_ChangingPassword_CaptchaModal_TypeCheckbox_Action>({
                      type: 'walletPage/onChange_ChangingPassword_CaptchaModal_TypeCheckbox',
                      payload: {
                        value: 'email',
                      },
                    });
                  }}
                />
                <FContentText
                  text={walletPage.changingPassword_CaptchaModal_Email}
                  type='normal'
                />
              </Space>)
            }

          </Space>

          <div>
            <FTipText type='third' text={'验证码'} />
            <div style={{ height: 5 }} />
            <Space size={10}>
              <FInput
                className={styles.verificationCodeInput}
                wrapClassName={styles.verificationCodeInput}
                size='middle'
                value={walletPage.changingPassword_CaptchaModal_CaptchaInput}
                onChange={(e) => {
                  dispatch<OnChange_ChangingPassword_CaptchaModal_CaptchaInput_Action>({
                    type: 'walletPage/onChange_ChangingPassword_CaptchaModal_CaptchaInput',
                    payload: {
                      value: e.target.value,
                    },
                  });
                }}
              />
              <FRectBtn
                style={{ width: 110 }}
                disabled={walletPage.changingPassword_CaptchaModal_SentCaptchaWait > 0}
                type='primary'
                onClick={() => {
                  dispatch<OnClick_ChangingPassword_CaptchaModal_SendBtn_Action>({
                    type: 'walletPage/onClick_ChangingPassword_CaptchaModal_SendBtn',
                  });
                }}
              >{walletPage.changingPassword_CaptchaModal_SentCaptchaWait === 0 ? '获取验证码' : `${walletPage.changingPassword_CaptchaModal_SentCaptchaWait}秒`}</FRectBtn>
            </Space>
          </div>
        </Space>
        <div style={{ height: 40 }} />
        <FRectBtn
          type='primary'
          disabled={walletPage.changingPassword_CaptchaModal_CaptchaInput === ''}
          onClick={() => {
            dispatch<OnClick_ChangingPassword_CaptchaModal_NextBtn_Action>({
              type: 'walletPage/onClick_ChangingPassword_CaptchaModal_NextBtn',
            });
          }}
        >下一步</FRectBtn>
      </div>

    </Modal>

    <Modal
      destroyOnClose
      title={<FTitleText text={'验证原支付密码'} type='popup' />}
      visible={walletPage.changingPassword_OldPasswordModal_Visible}
      // onOk={handleOk}
      onCancel={() => {
        dispatch<OnCancel_ChangingPassword_OldPasswordModal_Action>({
          type: 'walletPage/onCancel_ChangingPassword_OldPasswordModal',
        });
      }}
      footer={null}
      width={500}
    >
      <div className={styles.ActivateAccountContent}>
        <Space size={25} direction='vertical' style={{ width: 320 }}>
          <div>
            <div className={styles.payPassword}>
              <FTipText type='third' text={'原支付密码'} />
              <FTextBtn
                style={{ fontSize: 12 }}
                type='primary'
                onClick={() => {
                  const path: string = FUtil.LinkTo.retrievePayPassword();
                  // const host: string = FUtil.Format.completeUrlByDomain('user');
                  window.open(path);
                }}
              >忘记密码？</FTextBtn>
            </div>
            <div style={{ height: 5 }} />
            <FPaymentPasswordInput
              autoFocus
              value={walletPage.changingPassword_OldPasswordModal_PasswordInput}
              onChange={(value) => {
                dispatch<OnChange_ChangingPassword_OldPasswordModal_PasswordInput_Action>({
                  type: 'walletPage/onChange_ChangingPassword_OldPasswordModal_PasswordInput',
                  payload: {
                    value: value,
                  },
                });
              }}
            />
          </div>
        </Space>

        <div style={{ height: 40 }} />
        <FRectBtn
          type='primary'
          disabled={walletPage.changingPassword_OldPasswordModal_PasswordInput.length !== 6}
          onClick={() => {
            dispatch<OnClick_ChangingPassword_OldPasswordModal_NextBtn_Action>({
              type: 'walletPage/onClick_ChangingPassword_OldPasswordModal_NextBtn',
            });
          }}
        >下一步</FRectBtn>
      </div>
    </Modal>

    <Modal
      destroyOnClose
      title={<FTitleText text={'设置新支付密码'} type='popup' />}
      visible={walletPage.changingPassword_NewPasswordModal_Visible}
      // onOk={handleOk}
      onCancel={() => {
        dispatch<OnCancel_ChangingPassword_NewPasswordModal_Action>({
          type: 'walletPage/onCancel_ChangingPassword_NewPasswordModal',
        });
      }}
      footer={null}
      width={500}
    >
      <div className={styles.ActivateAccountContent}>
        <Space size={25} direction='vertical' style={{ width: 320 }}>
          <div>
            <FTipText type='third' text={'新支付密码'} />
            <div style={{ height: 5 }} />
            <FPaymentPasswordInput
              autoFocus
              value={walletPage.changingPassword_NewPasswordModal_Password1}
              onChange={(value) => {
                dispatch<OnChange_ChangingPassword_NewPasswordModal_Password1_Action>({
                  type: 'walletPage/onChange_ChangingPassword_NewPasswordModal_Password1Input',
                  payload: {
                    value: value,
                  },
                });
              }}
              onBlur={() => {
                dispatch<OnBlur_ChangingPassword_NewPasswordModal_Password1Input_Action>({
                  type: 'walletPage/onBlur_ChangingPassword_NewPasswordModal_Password1Input',
                });
              }}
            />
          </div>

          <div>
            <FTipText type='third' text={'验证新支付密码'} />
            <div style={{ height: 5 }} />
            <FPaymentPasswordInput
              value={walletPage.changingPassword_NewPasswordModal_Password2}
              onChange={(value) => {
                dispatch<OnChange_ChangingPassword_NewPasswordModal_Password2Input_Action>({
                  type: 'walletPage/onChange_ChangingPassword_NewPasswordModal_Password2Input',
                  payload: {
                    value: value,
                  },
                });
              }}
              onBlur={() => {
                dispatch<OnBlur_ChangingPassword_NewPasswordModal_Password2Input_Action>({
                  type: 'walletPage/onBlur_ChangingPassword_NewPasswordModal_Password2Input',
                });
              }}
            />

            <div style={{ color: 'red' }}>{walletPage.changingPassword_NewPasswordModal_Password2Error}</div>
          </div>
        </Space>

        <div style={{ height: 40 }} />
        <FRectBtn
          type='primary'
          disabled={walletPage.changingPassword_NewPasswordModal_Password1 === ''
          || walletPage.changingPassword_NewPasswordModal_Password1Error !== ''
          || walletPage.changingPassword_NewPasswordModal_Password2 === ''
          || walletPage.changingPassword_NewPasswordModal_Password2Error !== ''}
          onClick={() => {
            dispatch<OnClick_ChangingPassword_NewPasswordModal_ConfirmBtn_Action>({
              type: 'walletPage/onClick_ChangingPassword_NewPasswordModal_ConfirmBtn',
            });
          }}
        >修改支付密码</FRectBtn>
      </div>
    </Modal>
  </div>);
}

export default connect(({ walletPage, user }: ConnectState) => ({
  walletPage,
  user,
}))(Wallet);

export function successMessage() {
  message.success({
    content: (<div className={styles.success}>
      <FCheck style={{ fontSize: 76 }} />
      <div style={{ height: 20 }} />
      <FTitleText type='popup' text={'支付密码修改成功!'} />
    </div>),
    // className: 'custom-class',
    style: {
      marginTop: '20vh',
    },
    icon: <div />,
    duration: 1,
  });
}
