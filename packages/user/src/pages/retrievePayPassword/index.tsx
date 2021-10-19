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
  OnChange_PaymentPassword_Password2Input_Action,
  OnChange_UserPassword_PasswordInput_Action,
  OnClick_Captcha_SentBtn_Action,
  OnClick_PaymentPassword_ConfirmBtn_Action,
  OnMountPageAction,
  OnUnmountPageAction,
} from '@/models/retrievePayPasswordPage';

interface RetrievePayPasswordProps {
  dispatch: Dispatch;

  retrievePayPasswordPage: RetrievePayPasswordPageModelState;
}

function RetrievePayPassword({ dispatch, retrievePayPasswordPage }: RetrievePayPasswordProps) {

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

  if (retrievePayPasswordPage.showView === 'success') {
    return (<div className={styles.resetPasswordSuccess}>
      <div className={styles.box}>
        <FCheck style={{ fontSize: 96 }} />
        <div style={{ height: 30 }} />
        <FTitleText text={'重置支付密码成功'} />
        <div style={{ height: 10 }} />
      </div>
    </div>);
  }

  return (<div className={styles.styles}>
    <div className={styles.container}>

      <FTitleText text={'重置支付密码'} type='h1' />
      <div style={{ height: 30 }} />
      <div className={styles.ActivateAccountContent}>
        <Space size={25} direction='vertical' style={{ width: 320 }}>

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
              >忘记密码？</FTextBtn>
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

          <div>
            <FTipText type='third' text={'支付密码'} />
            <div style={{ height: 5 }} />
            <FInput
              placeholder='支付密码由6位数字组成'
              type='password'
              className={styles.blockInput}
              wrapClassName={styles.blockInput}
              size='middle'
              value={retrievePayPasswordPage.paymentPassword_Password1Input}
              errorText={retrievePayPasswordPage.paymentPassword_Password1InputError}
              onChange={(e) => {
                dispatch<OnChange_PaymentPassword_Password1Input_Action>({
                  type: 'retrievePayPasswordPage/onChange_PaymentPassword_Password1Input',
                  payload: {
                    value: e.target.value,
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
            <FInput
              placeholder='重复输入支付密码'
              type='password'
              className={styles.blockInput}
              wrapClassName={styles.blockInput}
              size='middle'
              value={retrievePayPasswordPage.paymentPassword_Password2Input}
              errorText={retrievePayPasswordPage.paymentPassword_Password2InputError}
              onChange={(e) => {
                dispatch<OnChange_PaymentPassword_Password2Input_Action>({
                  type: 'retrievePayPasswordPage/onChange_PaymentPassword_Password2Input',
                  payload: {
                    value: e.target.value,
                  },
                });
              }}
              onBlur={() => {
                dispatch<OnBlur_PaymentPassword_Password2Input_Action>({
                  type: 'retrievePayPasswordPage/onBlur_PaymentPassword_Password2Input',
                });
              }}
            />
          </div>
        </Space>
        <div style={{ height: 40 }} />
        <FRectBtn
          type='primary'
          disabled={retrievePayPasswordPage.userPassword_PasswordInput === ''
          || retrievePayPasswordPage.captcha_CaptchaInput === ''
          || retrievePayPasswordPage.paymentPassword_Password1Input === '' || retrievePayPasswordPage.paymentPassword_Password1InputError !== ''
          || retrievePayPasswordPage.paymentPassword_Password2Input === '' || retrievePayPasswordPage.paymentPassword_Password2InputError !== ''}
          onClick={() => {
            dispatch<OnClick_PaymentPassword_ConfirmBtn_Action>({
              type: 'retrievePayPasswordPage/onClick_PaymentPassword_ConfirmBtn',
            });
          }}
        >修改支付密码</FRectBtn>
      </div>
    </div>
    <div style={{ height: 20 }} />
  </div>);
}

export default connect(({ retrievePage, walletPage, retrievePayPasswordPage }: ConnectState) => ({
  retrievePage, walletPage, retrievePayPasswordPage,
}))(RetrievePayPassword);
