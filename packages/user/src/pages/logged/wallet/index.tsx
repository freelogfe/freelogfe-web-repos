import * as React from 'react';
import styles from './index.less';
import { FContentText, FTipText, FTitleText } from '@/components/FText';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import FSafetyLock from '@/components/FIcons/FSafetyLock';
import FTable from '@/components/FTable';
import { ColumnsType } from 'antd/lib/table';
import { Modal, Space, Radio, message, DatePicker } from 'antd';
import FInput from '@/components/FInput';
import * as AHooks from 'ahooks';
import { connect, Dispatch } from 'dva';
import { ConnectState, UserModelState, WalletPageModelState } from '@/models/connect';
import {
  OnBlur_ChangingPassword_NewPasswordModal_Password1Input_Action,
  OnBlur_ChangingPassword_NewPasswordModal_Password2Input_Action,
  OnBlur_Table_Filter_MaxAmount_Action,
  OnBlur_Table_Filter_MinAmount_Action,
  OnBlur_Activate_Password1_Action,
  OnBlur_Activate_Password2_Action,
  OnCancel_ChangingPassword_CaptchaModal_Action,
  OnCancel_ChangingPassword_NewPasswordModal_Action,
  OnCancel_ChangingPassword_OldPasswordModal_Action,
  OnCancel_Activate_CaptchaModal_Action,
  OnChange_ChangingPassword_CaptchaModal_CaptchaInput_Action,
  OnChange_ChangingPassword_CaptchaModal_SentCaptchaWait_Action,
  OnChange_ChangingPassword_CaptchaModal_TypeCheckbox_Action,
  OnChange_ChangingPassword_NewPasswordModal_Password1_Action,
  OnChange_ChangingPassword_NewPasswordModal_Password2Input_Action,
  OnChange_ChangingPassword_OldPasswordModal_PasswordInput_Action,
  OnChange_Table_Filter_Date_Custom_Action,
  OnChange_Table_Filter_Date_Type_Action,
  OnChange_Table_Filter_Keywords_Action,
  OnChange_Table_Filter_MaxAmount_Action,
  OnChange_Table_Filter_MinAmount_Action, OnChange_Table_Filter_StateSelected_Action,
  OnChange_Activate_CaptchaInput_Action,
  OnChange_Activate_AccountMode_Action,
  OnChange_Activate_Password1_Action,
  OnChange_Activate_Password2_Action,
  OnChange_Activate_SentCaptchaWait_Action,
  OnClick_ChangingPassword_CaptchaModal_NextBtn_Action,
  OnClick_ChangingPassword_CaptchaModal_SendBtn_Action,
  OnClick_ChangingPassword_NewPasswordModal_ConfirmBtn_Action,
  OnClick_ChangingPassword_OldPasswordModal_NextBtn_Action,
  OnClick_ChangingPasswordBtn_Action,
  OnClick_Table_LoadMoreBtn_Action,
  OnClick_Activate_AccountBtn_Action,
  OnClick_Activate_SentCaptchaBtn_Action,
  OnClick_Activate_ConfirmBtn_Action,
  OnMountPageAction,
  OnUnmountPageAction, OnClick_Activate_NextBtn_Action,
} from '@/models/walletPage';
import { FCheck } from '@/components/FIcons';
import FLoadingTip from '@/components/FLoadingTip';
import { FUtil } from '@freelog/tools-lib';
import FPaymentPasswordInput from '@/components/FPaymentPasswordInput';
import FDropdownMenu from '@/components/FDropdownMenu';
import FListFooter from '@/components/FListFooter';
import FNoDataTip from '@/components/FNoDataTip';
import moment from 'moment';
import {
  OnBlur_PaymentPassword_Password2Input_Action,
  OnChange_PaymentPassword_Password2Input_Action,
} from '@/models/retrievePayPasswordPage';

interface WalletProps {
  dispatch: Dispatch;
  walletPage: WalletPageModelState;
  user: UserModelState;
}

//1.交易确认中 2:交易成功 3:交易关闭
// const stateOptions = [
//   { value: '0', text: '全部' },
//   { value: '1', text: '交易确认中' },
//   { value: '2', text: '交易成功' },
//   { value: '3', text: '交易关闭' },
// ];

function Wallet({ dispatch, walletPage }: WalletProps) {

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
    dispatch<OnChange_Activate_SentCaptchaWait_Action>({
      type: 'walletPage/onChange_Activate_SentCaptchaWait',
      payload: {
        value: walletPage.activating_SentCaptchaWait - 1,
      },
    });
  }, walletPage.activating_SentCaptchaWait === 0 ? null : 1000);

  AHooks.useInterval(() => {
    dispatch<OnChange_ChangingPassword_CaptchaModal_SentCaptchaWait_Action>({
      type: 'walletPage/onChange_ChangingPassword_CaptchaModal_SentCaptchaWait',
      payload: {
        value: walletPage.changingPassword_CaptchaModal_SentCaptchaWait - 1,
      },
    });
  }, walletPage.changingPassword_CaptchaModal_SentCaptchaWait === 0 ? null : 1000);

  const columns: ColumnsType<WalletPageModelState['table_DateSource'][number]> = [
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
      title: (<FTitleText text={'交易方｜支付方式｜流水号'} type='table' />),
      dataIndex: 'payment',
      key: 'payment',
      render(_, record) {
        return (<div>
          <FContentText
            text={`${record.reciprocalAccountName} | 羽币支付`}
            type='highlight'
          />
          <FContentText
            text={`流水号 ${record.serialNo}`}
            type='additional1'
          />
        </div>);
      },
    }, {
      title: (<FTitleText text={'金额（枚）'} type='table' />),
      dataIndex: 'money',
      key: 'money',
      render(_, record) {
        return (<div>
          <FContentText
            text={record.digest}
            type='highlight'
          />
          <FContentText
            text={`合约编号 ${record.contractID}`}
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
              dispatch<OnClick_Activate_AccountBtn_Action>({
                type: 'walletPage/onClick_Activate_AccountBtn',
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

          <div style={{ height: 40 }} />
          <FTitleText type='h1' text={'交易记录'} />
          <div style={{ height: 20 }} />

          <div className={styles.TableBody}>

            {
              walletPage.table_State === 'noData'
                ? (<FNoDataTip height={600} tipText={'无数据'} />)
                : (<>
                  <div style={{ height: 20 }} />
                  <div className={styles.filter1}>
                    <div className={styles.filter1Date}>
                      <FContentText
                        text={'日期区间：'}
                      />
                      <div style={{ width: 5 }} />
                      <DatePicker.RangePicker
                        allowClear={false}
                        value={walletPage.table_Filter_Date_Custom}
                        onChange={(values: any) => {
                          // console.log(values, 'values2423');
                          dispatch<OnChange_Table_Filter_Date_Custom_Action>({
                            type: 'walletPage/onChange_Table_Filter_Date_Custom',
                            payload: {
                              value: values,
                            },
                          });
                        }}
                        disabledDate={(date) => {
                          // console.log(date, 'date234234234');
                          return moment().isBefore(date);
                        }}
                      />
                      <div style={{ width: 15 }} />
                      <a
                        className={[styles.dateRange, walletPage.table_Filter_Date_Type === 'week' ? styles.active : ''].join(' ')}
                        onClick={() => {
                          dispatch<OnChange_Table_Filter_Date_Type_Action>({
                            type: 'walletPage/onChange_Table_Filter_Date_Type',
                            payload: {
                              value: 'week',
                            },
                          });
                        }}
                      >近一周</a>
                      <a
                        className={[styles.dateRange, walletPage.table_Filter_Date_Type === 'month' ? styles.active : ''].join(' ')}
                        onClick={() => {
                          dispatch<OnChange_Table_Filter_Date_Type_Action>({
                            type: 'walletPage/onChange_Table_Filter_Date_Type',
                            payload: {
                              value: 'month',
                            },
                          });
                        }}
                      >近一月</a>
                      <a
                        className={[styles.dateRange, walletPage.table_Filter_Date_Type === 'year' ? styles.active : ''].join(' ')}
                        onClick={() => {
                          dispatch<OnChange_Table_Filter_Date_Type_Action>({
                            type: 'walletPage/onChange_Table_Filter_Date_Type',
                            payload: {
                              value: 'year',
                            },
                          });
                        }}
                      >近一年</a>
                    </div>
                    <div className={styles.filter1Keyword}>
                      <FInput
                        theme='dark'
                        debounce={300}
                        onDebounceChange={(value) => {
                          dispatch<OnChange_Table_Filter_Keywords_Action>({
                            type: 'walletPage/onChange_Table_Filter_Keywords',
                            payload: {
                              value: value,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ height: 15 }} />
                  <div className={styles.filter2}>
                    <FContentText
                      text={'金额区间：'}
                    />
                    <div style={{ width: 5 }} />
                    <FInput
                      min={0}
                      max={walletPage.table_Filter_MaxAmount || Number.POSITIVE_INFINITY}
                      value={walletPage.table_Filter_MinAmount}
                      onChange={(e) => {
                        dispatch<OnChange_Table_Filter_MinAmount_Action>({
                          type: 'walletPage/onChange_Table_Filter_MinAmount',
                          payload: {
                            value: e.target.value,
                          },
                        });
                      }}
                      onBlur={() => {
                        dispatch<OnBlur_Table_Filter_MinAmount_Action>({
                          type: 'walletPage/onBlur_Table_Filter_MinAmount',
                        });
                      }}
                      type='number'
                      size='small'
                      placeholder={'最低金额'}
                      className={styles.filterAmount}
                      wrapClassName={styles.filterAmount}
                    />
                    <span className={styles.filterAmountTo}>-</span>
                    <FInput
                      type='number'
                      size='small'
                      value={walletPage.table_Filter_MaxAmount}
                      onChange={(e) => {
                        dispatch<OnChange_Table_Filter_MaxAmount_Action>({
                          type: 'walletPage/onChange_Table_Filter_MaxAmount',
                          payload: {
                            value: e.target.value,
                          },
                        });
                      }}
                      onBlur={() => {
                        dispatch<OnBlur_Table_Filter_MaxAmount_Action>({
                          type: 'walletPage/onBlur_Table_Filter_MaxAmount',
                        });
                      }}
                      placeholder={'最高金额'}
                      className={styles.filterAmount}
                      wrapClassName={styles.filterAmount}
                      // debounce={300}
                      // onDebounceChange={(value) => {
                      //   // console.log(typeof value, 'Maxvalue23423');
                      //   dispatch<OnChange_Table_Filter_MaxAmount_Action>({
                      //     type: 'walletPage/onChange_Table_Filter_MaxAmount',
                      //     payload: {
                      //       value: value,
                      //     },
                      //   });
                      // }}
                    />
                    <div style={{ width: 50 }} />
                    <FContentText text={'交易状态：'} />
                    <div style={{ width: 5 }} />
                    <FDropdownMenu
                      options={walletPage.table_Filter_StateOptions}
                      text={walletPage.table_Filter_StateOptions.find((so) => so.value === walletPage.table_Filter_StateSelected)?.text || ''}
                      onChange={(value) => {
                        dispatch<OnChange_Table_Filter_StateSelected_Action>({
                          type: 'walletPage/onChange_Table_Filter_StateSelected',
                          payload: {
                            value: value as '0',
                          },
                        });
                      }}
                    />
                  </div>

                  {
                    walletPage.table_State === 'loading'
                      ? (<FLoadingTip height={600} />)
                      : (<>
                        <div style={{ height: 30 }} />
                        <div className={styles.totalAmount}>
                          <FTitleText text={'支出'} type='table' />
                          <div style={{ width: 10 }} />
                          <div className={styles.totalAmountExpenditure}>{walletPage.table_TotalAmountExpenditure}</div>
                          <div style={{ width: 20 }} />
                          <FTitleText text={'收入'} type='table' />
                          <div style={{ width: 10 }} />
                          <div className={styles.totalAmountIncome}>{walletPage.table_TotalAmountIncome}</div>
                        </div>
                        <div style={{ height: 10 }} />

                        {
                          walletPage.table_State === 'noSearchResult' && (<FNoDataTip height={600} tipText={'无交易记录'} />)
                        }

                        {
                          walletPage.table_State === 'loaded' && (<>
                            <FTable
                              columns={columns}
                              dataSource={walletPage.table_DateSource.map((tr) => {
                                return {
                                  key: tr.serialNo,
                                  ...tr,
                                };
                              })}
                            />

                            <FListFooter
                              state={walletPage.table_More}
                              onClickLoadMore={() => {
                                dispatch<OnClick_Table_LoadMoreBtn_Action>({
                                  type: 'walletPage/onClick_Table_LoadMoreBtn',
                                });
                              }}
                            />
                          </>)
                        }
                      </>)
                  }

                </>)
            }

          </div>
        </>)
    }


    <div style={{ height: 100 }} />

    <Modal
      destroyOnClose
      title={<FTitleText text={'激活账户验证'} type='popup' />}
      visible={walletPage.activating_VisibleModal === 'captcha'}
      onCancel={() => {
        dispatch<OnCancel_Activate_CaptchaModal_Action>({
          type: 'walletPage/onCancel_Activate_CaptchaModal',
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
              walletPage.activating_AccountMobile && (<Space size={2}>
                <Radio
                  checked={walletPage.activating_AccountType === 'phone'}
                  onChange={() => {
                    // onChange({
                    //   activatingAccountType: 'phone',
                    // });
                    dispatch<OnChange_Activate_AccountMode_Action>({
                      type: 'walletPage/onChange_Activate_AccountMode',
                      payload: {
                        value: 'phone',
                      },
                    });
                  }}
                />
                <FContentText text={walletPage.activating_AccountMobile} type='normal' />
              </Space>)
            }

            {
              walletPage.activating_AccountEmail && (<Space size={2}>
                <Radio
                  checked={walletPage.activating_AccountType === 'email'}
                  onChange={() => {
                    // onChange({
                    //   activatingAccountType: 'email',
                    // });
                    dispatch<OnChange_Activate_AccountMode_Action>({
                      type: 'walletPage/onChange_Activate_AccountMode',
                      payload: {
                        value: 'email',
                      },
                    });
                  }}
                />
                <FContentText text={walletPage.activating_AccountEmail} type='normal' />
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
                value={walletPage.activating_Captcha}
                onChange={(e) => {
                  dispatch<OnChange_Activate_CaptchaInput_Action>({
                    type: 'walletPage/onChange_Activate_CaptchaInput',
                    payload: {
                      value: e.target.value,
                    },
                  });
                }}
              />
              <FRectBtn
                style={{ width: 110 }}
                type='primary'
                disabled={walletPage.activating_SentCaptchaWait > 0}
                onClick={() => {
                  dispatch<OnClick_Activate_SentCaptchaBtn_Action>({
                    type: 'walletPage/onClick_Activate_SentCaptchaBtn',
                  });
                }}
              >{walletPage.activating_SentCaptchaWait === 0 ? '获取验证码' : `${walletPage.activating_SentCaptchaWait}秒`}</FRectBtn>
            </Space>
          </div>
        </Space>
        <div style={{ height: 40 }} />
        <FRectBtn
          type='primary'
          disabled={!walletPage.activating_Captcha}
          onClick={() => {
            dispatch<OnClick_Activate_NextBtn_Action>({
              type: 'walletPage/onClick_Activate_NextBtn',
            });
          }}
        >下一步</FRectBtn>
      </div>

    </Modal>

    <Modal
      destroyOnClose
      title={<FTitleText text={'设置支付密码'} type='popup' />}
      visible={walletPage.activating_VisibleModal === 'password'}
      onCancel={() => {
        dispatch<OnCancel_Activate_CaptchaModal_Action>({
          type: 'walletPage/onCancel_Activate_CaptchaModal',
        });
      }}
      footer={null}
      width={500}
    >
      <div className={styles.ActivateAccountContent}>
        <Space size={25} direction='vertical' style={{ width: 320 }}>

          <div>
            <FTipText type='third' text={'支付密码'} />
            <div style={{ height: 5 }} />
            {/*<FInput*/}
            {/*  type='password'*/}
            {/*  className={styles.blockInput}*/}
            {/*  wrapClassName={styles.blockInput}*/}
            {/*  size='middle'*/}
            {/*  value={walletPage.activating_PasswordOne}*/}
            {/*  errorText={walletPage.activating_PasswordOneError}*/}
            {/*  onChange={(e) => {*/}
            {/*    dispatch<OnChange_Activate_Password1_Action>({*/}
            {/*      type: 'walletPage/onChange_Activate_Password1',*/}
            {/*      payload: {*/}
            {/*        value: e.target.value,*/}
            {/*      },*/}
            {/*    });*/}
            {/*  }}*/}
            {/*  onBlur={() => {*/}
            {/*    dispatch<OnBlur_Activate_Password1_Action>({*/}
            {/*      type: 'walletPage/onBlur_Activate_Password1',*/}
            {/*    });*/}
            {/*  }}*/}
            {/*/>*/}
            <FPaymentPasswordInput
              // autoFocus
              value={walletPage.activating_PasswordOne}
              onChange={(value) => {
                dispatch<OnChange_Activate_Password1_Action>({
                  type: 'walletPage/onChange_Activate_Password1',
                  payload: {
                    value: value,
                  },
                });
              }}
              onBlur={() => {
                dispatch<OnBlur_Activate_Password1_Action>({
                  type: 'walletPage/onBlur_Activate_Password1',
                });
              }}
            />
          </div>

          <div>
            <FTipText type='third' text={'验证支付密码'} />
            <div style={{ height: 5 }} />
            <FPaymentPasswordInput
              value={walletPage.activating_PasswordTwo}
              onChange={(value) => {
                dispatch<OnChange_Activate_Password2_Action>({
                  type: 'walletPage/onChange_Activate_Password2',
                  payload: {
                    value: value,
                  },
                });
              }}
              onBlur={() => {
                dispatch<OnBlur_Activate_Password2_Action>({
                  type: 'walletPage/onBlur_Activate_Password2',
                });
              }}
            />
            <div style={{ color: '#EE4040' }}>{walletPage.activating_PasswordTwoError}</div>
            {/*<FInput*/}
            {/*  type='password'*/}
            {/*  className={styles.blockInput}*/}
            {/*  wrapClassName={styles.blockInput}*/}
            {/*  size='middle'*/}
            {/*  value={walletPage.activating_PasswordTwo}*/}
            {/*  errorText={walletPage.activating_PasswordTwoError}*/}
            {/*  onChange={(e) => {*/}
            {/*    dispatch<OnChange_Activate_Password2_Action>({*/}
            {/*      type: 'walletPage/onChange_Activate_Password2',*/}
            {/*      payload: {*/}
            {/*        value: e.target.value,*/}
            {/*      },*/}
            {/*    });*/}
            {/*  }}*/}
            {/*  onBlur={() => {*/}
            {/*    dispatch<OnBlur_Activate_Password2_Action>({*/}
            {/*      type: 'walletPage/onBlur_Activate_Password2',*/}
            {/*    });*/}
            {/*  }}*/}
            {/*/>*/}
          </div>
        </Space>
        <div style={{ height: 40 }} />
        <FRectBtn
          type='primary'
          disabled={walletPage.activating_PasswordOne === ''
          || walletPage.activating_PasswordTwo === ''
          || walletPage.activating_PasswordOneError !== ''
          || walletPage.activating_PasswordTwoError !== ''}
          onClick={() => {
            dispatch<OnClick_Activate_ConfirmBtn_Action>({
              type: 'walletPage/onClick_Activate_ConfirmBtn',
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
                  onChange={() => {
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
                  onChange={() => {
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
