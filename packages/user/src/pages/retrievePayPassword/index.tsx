import * as React from 'react';
import styles from './index.less';
import { FContentText, FTipText, FTitleText } from '@/components/FText';
import FInput from '@/components/FInput';
import { Radio, Space } from 'antd';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import { connect, Dispatch } from 'dva';
import {
  ConnectState,
  RetrievePayPasswordPageModelState,
} from '@/models/connect';
import { FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import { FCheck } from '@/components/FIcons';
import {
  OnBlur_PaymentPassword_Password1Input_Action,
  OnBlur_PaymentPassword_Password2Input_Action,
  OnChange_Captcha_CaptchaInput_Action,
  OnChange_Captcha_SentCaptchaWait_Action,
  OnChange_Captcha_VerifyMode_Action,
  OnChange_PaymentPassword_Password1Input_Action,
  OnChange_PaymentPassword_Password2Input_Action, OnChange_Success_CloseWait_Action,
  OnChange_UserPassword_PasswordInput_Action, OnClick_Captcha_NextBtn_Action,
  OnClick_Captcha_SentBtn_Action,
  OnClick_PaymentPassword_ConfirmBtn_Action, OnClick_Success_CloseBtn_Action, OnClick_UserPassword_NextBtn_Action,
  OnMountPageAction,
  OnUnmountPageAction,
} from '@/models/retrievePayPasswordPage';
import FPaymentPasswordInput from '@/components/FPaymentPasswordInput';
import { FetchInfoAction } from '@/models/user';

interface RetrievePayPasswordProps {
  dispatch: Dispatch;

  retrievePayPasswordPage: RetrievePayPasswordPageModelState;
}

function RetrievePayPassword({ dispatch, retrievePayPasswordPage }: RetrievePayPasswordProps) {

  AHooks.useMount(() => {
    dispatch<FetchInfoAction>({
      type: 'user/fetchInfo',
    });
  });

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'retrievePayPasswordPage/onMountPage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'retrievePayPasswordPage/onUnmountPage',
    });
  });

  AHooks.useInterval(() => {
    dispatch<OnChange_Captcha_SentCaptchaWait_Action>({
      type: 'retrievePayPasswordPage/onChange_Captcha_SentCaptchaWait',
      payload: {
        value: retrievePayPasswordPage.captcha_SentCaptchaWait - 1,
      },
    });
  }, retrievePayPasswordPage.captcha_SentCaptchaWait === 0 ? null : 1000);

  AHooks.useInterval(() => {
    dispatch<OnChange_Success_CloseWait_Action>({
      type: 'retrievePayPasswordPage/onChange_Success_CloseWait',
      payload: {
        value: retrievePayPasswordPage.success_CloseWait - 1,
      },
    });
  }, retrievePayPasswordPage.success_CloseWait === 0 ? null : 1000);


  return (<div className={styles.styles}>
    {
      retrievePayPasswordPage.showView === 'userPassword' && (<div className={styles.container}>
        <FTitleText text={'验证登陆密码'} type='h1' />
        <div style={{ height: 30 }} />
        <FTipText text={'设置新的支付密码前，首先需要进行登陆密码的验证'} type='second' />
        <div style={{ height: 100 }} />
        <div className={styles.ActivateAccountContent}>
          <Space size={25} direction='vertical' style={{ width: 360 }}>

            <div>
              <div className={styles.userPassword}>
                <FTipText type='third' text={'用户登录密码'} />
                <FTextBtn
                  style={{ fontSize: 12 }}
                  type='primary'
                  onClick={() => {
                    const path: string = FUtil.LinkTo.retrieveUserPassword();
                    // const host: string = FUtil.Format.completeUrlByDomain('user');
                    window.open(path);
                  }}
                >忘记登录密码？</FTextBtn>
              </div>
              <div style={{ height: 5 }} />
              <FInput
                placeholder='输入登录密码'
                type='password'
                className={styles.blockInput}
                wrapClassName={styles.blockInput}
                size='middle'
                value={retrievePayPasswordPage.userPassword_PasswordInput}
                // errorText={retrievePayPasswordPage.userPasswordInputE}
                onChange={(e) => {
                  dispatch<OnChange_UserPassword_PasswordInput_Action>({
                    type: 'retrievePayPasswordPage/onChange_UserPassword_PasswordInput',
                    payload: {
                      value: e.target.value,
                    },
                  });
                }}
              />
            </div>
          </Space>
          <div style={{ height: 40 }} />
          <FRectBtn
            type='primary'
            disabled={retrievePayPasswordPage.userPassword_PasswordInput === ''}
            onClick={() => {
              dispatch<OnClick_UserPassword_NextBtn_Action>({
                type: 'retrievePayPasswordPage/onClick_UserPassword_NextBtn',
              });
            }}
            // style={{ width: 360 }}
          >下一步</FRectBtn>
        </div>
      </div>)
    }

    {
      retrievePayPasswordPage.showView === 'captcha' && (<div className={styles.container}>
        <FTitleText text={'双重验证'} type='h1' />
        <div style={{ height: 30 }} />
        <FTipText text={'为了您的支付安全，请进行双重验证，验证成功后即可设置新的支付密码'} type='second' />
        <div style={{ height: 70 }} />
        <div className={styles.ActivateAccountContent}>
          <Space size={25} direction='vertical' style={{ width: 360 }}>

            <Space size={15} direction='vertical'>
              <FTipText type='third' text={'验证方式'} />
              {
                retrievePayPasswordPage.userPhone && (<Space size={2}>
                  <Radio
                    checked={retrievePayPasswordPage.captcha_VerifyMode === 'phone'}
                    onChange={(e) => {
                      dispatch<OnChange_Captcha_VerifyMode_Action>({
                        type: 'retrievePayPasswordPage/onChange_Captcha_VerifyMode',
                        payload: {
                          value: 'phone',
                        },
                      });
                    }}
                  />
                  <FContentText
                    text={retrievePayPasswordPage.userPhone}
                    type='normal'
                  />
                </Space>)
              }

              {
                retrievePayPasswordPage.userEmail && (<Space size={2}>
                  <Radio
                    checked={retrievePayPasswordPage.captcha_VerifyMode === 'email'}
                    onChange={(e) => {
                      dispatch<OnChange_Captcha_VerifyMode_Action>({
                        type: 'retrievePayPasswordPage/onChange_Captcha_VerifyMode',
                        payload: {
                          value: 'email',
                        },
                      });
                    }}
                  />
                  <FContentText
                    text={retrievePayPasswordPage.userEmail}
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
                  placeholder='输入验证码'
                  className={styles.verificationCodeInput}
                  wrapClassName={styles.verificationCodeInput}
                  size='middle'
                  value={retrievePayPasswordPage.captcha_CaptchaInput}
                  onChange={(e) => {
                    dispatch<OnChange_Captcha_CaptchaInput_Action>({
                      type: 'retrievePayPasswordPage/onChange_Captcha_CaptchaInput',
                      payload: {
                        value: e.target.value,
                      },
                    });
                  }}
                />
                <FRectBtn
                  style={{ width: 110 }}
                  disabled={retrievePayPasswordPage.captcha_SentCaptchaWait > 0}
                  type='primary'
                  onClick={() => {
                    dispatch<OnClick_Captcha_SentBtn_Action>({
                      type: 'retrievePayPasswordPage/onClick_Captcha_SentBtn',
                    });
                  }}
                >{retrievePayPasswordPage.captcha_SentCaptchaWait === 0 ? '获取验证码' : `${retrievePayPasswordPage.captcha_SentCaptchaWait}秒`}</FRectBtn>
              </Space>
            </div>
          </Space>
          <div style={{ height: 40 }} />
          <FRectBtn
            type='primary'
            disabled={retrievePayPasswordPage.captcha_CaptchaInput === ''}
            onClick={() => {
              dispatch<OnClick_Captcha_NextBtn_Action>({
                type: 'retrievePayPasswordPage/onClick_Captcha_NextBtn',
              });
            }}
            // style={{ width: 360 }}
          >下一步</FRectBtn>
        </div>
      </div>)
    }

    {
      retrievePayPasswordPage.showView === 'paymentPassword' && (<div className={styles.container}>
        <FTitleText text={'重置支付密码'} type='h1' />
        <div style={{ height: 30 }} />
        <FTipText text={'现在您可以设置新的支付密码，重置成功后即可进行支付服务'} type='second' />
        <div style={{ height: 80 }} />
        <div className={styles.ActivateAccountContent}>
          <Space size={25} direction='vertical'>

            <div>
              <FTipText type='third' text={'支付密码'} />
              <div style={{ height: 5 }} />
              <FPaymentPasswordInput
                autoFocus
                value={retrievePayPasswordPage.paymentPassword_Password1Input}
                onChange={(value) => {
                  dispatch<OnChange_PaymentPassword_Password1Input_Action>({
                    type: 'retrievePayPasswordPage/onChange_PaymentPassword_Password1Input',
                    payload: {
                      value: value,
                    },
                  });
                }}
                onBlur={() => {
                  dispatch<OnBlur_PaymentPassword_Password1Input_Action>({
                    type: 'retrievePayPasswordPage/onBlur_PaymentPassword_Password1Input',
                  });
                }}
              />
            </div>

            <div>
              <FTipText type='third' text={'验证支付密码'} />
              <div style={{ height: 5 }} />
              <FPaymentPasswordInput
                value={retrievePayPasswordPage.paymentPassword_Password2Input}
                onChange={(value) => {
                  dispatch<OnChange_PaymentPassword_Password2Input_Action>({
                    type: 'retrievePayPasswordPage/onChange_PaymentPassword_Password2Input',
                    payload: {
                      value: value,
                    },
                  });
                }}
                onBlur={() => {
                  dispatch<OnBlur_PaymentPassword_Password2Input_Action>({
                    type: 'retrievePayPasswordPage/onBlur_PaymentPassword_Password2Input',
                  });
                }}
              />
              <div style={{ color: '#EE4040' }}>{retrievePayPasswordPage.paymentPassword_Password2InputError}</div>

            </div>
          </Space>
          <div style={{ height: 40 }} />
          <FRectBtn
            type='primary'
            disabled={retrievePayPasswordPage.paymentPassword_Password1Input.length !== 6 || retrievePayPasswordPage.paymentPassword_Password1InputError !== ''
            || retrievePayPasswordPage.paymentPassword_Password2Input.length !== 6 || retrievePayPasswordPage.paymentPassword_Password2InputError !== ''}
            onClick={() => {
              dispatch<OnClick_PaymentPassword_ConfirmBtn_Action>({
                type: 'retrievePayPasswordPage/onClick_PaymentPassword_ConfirmBtn',
              });
            }}
            // style={{ width: 360 }}
          >修改支付密码</FRectBtn>
        </div>
      </div>)
    }

    {
      retrievePayPasswordPage.showView === 'success' && (<div className={styles.resetPasswordSuccess}>
        <div className={styles.box}>
          <FCheck style={{ fontSize: 96 }} />
          <div style={{ height: 30 }} />
          <FTitleText text={'支付密码重置成功'} />
          <div style={{ height: 40 }} />
          <Space size={10}>
            <FContentText text={`${retrievePayPasswordPage.success_CloseWait}s后关闭当前页面`} type='negative' />
            <FTextBtn
              type='primary'
              onClick={() => {
                dispatch<OnClick_Success_CloseBtn_Action>({
                  type: 'retrievePayPasswordPage/onClick_Success_CloseBtn',
                });
              }}
            >立即关闭</FTextBtn>
          </Space>
        </div>
      </div>)
    }
    <div style={{ height: 20 }} />
  </div>);
}

export default connect(({ retrievePage, walletPage, retrievePayPasswordPage }: ConnectState) => ({
  retrievePage, walletPage, retrievePayPasswordPage,
}))(RetrievePayPassword);
