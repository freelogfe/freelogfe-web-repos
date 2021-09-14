import * as React from 'react';
import styles from './index.less';
import { FContentText, FTipText, FTitleText } from '@/components/FText';
import FInput from '@/components/FInput';
import { Radio, Space } from 'antd';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import { connect, Dispatch } from 'dva';
import {
  ConnectState,
  RetrievePageModelState,
  RetrievePayPasswordPageModelState,
  WalletPageModelState,
} from '@/models/connect';
import { history } from 'umi';
import { FUtil } from '@freelog/tools-lib';
import useUrlState from '@ahooksjs/use-url-state';
import FRadio from '@/components/FRadio';
import * as AHooks from 'ahooks';
// import {
//   OnBlurConfirmPasswordInputAction,
//   OnBlurEmailInputAction,
//   OnBlurNewPasswordInputAction,
//   OnBlurPhoneInputAction,
//   OnBlurVerifyCodeInputAction,
//   OnChangeConfirmPasswordInputAction,
//   OnChangeEmailInputAction,
//   OnChangeNewPasswordInputAction,
//   OnChangePhoneInputAction,
//   OnChangeVerifyCodeInputAction,
//   OnChangeVerifyCodeReSendWaitAction,
//   OnChangeVerifyModeAction,
//   OnChangeWaitingTimeAction,
//   OnClickResetBtnAction,
//   OnClickSendVerifyCodeBtnAction,
//   OnMountPageAction,
//   OnUnmountPageAction,
// } from '@/models/retrievePage';
import { FCheck } from '@/components/FIcons';
// import {
//   OnBlurUpdatePaymentPasswordNew1Action, OnBlurUpdatePaymentPasswordNew2Action,
//   OnChangeUpdatePaymentPasswordCaptchaInputAction,
//   OnChangeUpdatePaymentPasswordModeAction,
//   OnChangeUpdatePaymentPasswordNew1Action,
//   OnChangeUpdatePaymentPasswordNew2Action,
//   OnChangeUpdatePaymentPasswordOldAction,
//   OnClickUpdatePaymentPasswordCaptchaBtnAction, OnClickUpdatePaymentPasswordConfirmBtnAction,
// } from '@/models/walletPage';
import {
  OnBlurPassword1InputAction,
  OnBlurPassword2InputAction,
  OnChangeCaptchaInputAction,
  OnChangePassword1InputAction,
  OnChangePassword2InputAction,
  OnChangeUserPasswordInputAction,
  OnChangeVerifyModeAction,
  OnChangSentWaitAction,
  OnClickSentBtnAction,
  OnClickUpdatePasswordBtnAction,
  OnMountPageAction,
  OnUnmountPageAction,
} from '@/models/retrievePayPasswordPage';

interface RetrievePayPasswordProps {
  dispatch: Dispatch;

  retrievePage: RetrievePageModelState;
  walletPage: WalletPageModelState;
  retrievePayPasswordPage: RetrievePayPasswordPageModelState;
}

function RetrievePayPassword({
                               dispatch,
                               // retrievePage,
                               // walletPage,
                               retrievePayPasswordPage,
                             }: RetrievePayPasswordProps) {

  // const [urlParams] = useUrlState<{ goTo: string }>();

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
    dispatch<OnChangSentWaitAction>({
      type: 'retrievePayPasswordPage/onChangSentWait',
      payload: {
        value: retrievePayPasswordPage.sentCaptchaWait - 1,
      },
    });
  }, retrievePayPasswordPage.sentCaptchaWait === 0 ? null : 1000);

  // function gotoLogin() {
  //   history.replace(FUtil.LinkTo.login(urlParams.goTo ? {
  //     goTo: decodeURIComponent(urlParams.goTo),
  //   } : {}));
  // }

  if (retrievePayPasswordPage.showView === 'success') {
    return (<div className={styles.resetPasswordSuccess}>
      <div className={styles.box}>
        <FCheck style={{ fontSize: 96 }} />
        <div style={{ height: 30 }} />
        <FTitleText text={'重置支付密码成功'} />
        {/*<div style={{ height: 40 }} />*/}
        {/*<Space size={0}>*/}
        {/*  <FContentText text={`${retrievePage.waitingTimeToLogin}s后返回登陆界面；`} type='negative' />*/}
        {/*  <FTextBtn onClick={() => {*/}
        {/*    gotoLogin();*/}
        {/*  }}>立即登录</FTextBtn>*/}
        {/*</Space>*/}
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
              value={retrievePayPasswordPage.userPasswordInput}
              // errorText={retrievePayPasswordPage.userPasswordInputE}
              onChange={(e) => {
                dispatch<OnChangeUserPasswordInputAction>({
                  type: 'retrievePayPasswordPage/onChangeUserPasswordInput',
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
                  checked={retrievePayPasswordPage.verifyMode === 'phone'}
                  onChange={(e) => {
                    dispatch<OnChangeVerifyModeAction>({
                      type: 'retrievePayPasswordPage/onChangeVerifyMode',
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
                  checked={retrievePayPasswordPage.verifyMode === 'email'}
                  onChange={(e) => {
                    dispatch<OnChangeVerifyModeAction>({
                      type: 'retrievePayPasswordPage/onChangeVerifyMode',
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
                value={retrievePayPasswordPage.captchaInput}
                onChange={(e) => {
                  dispatch<OnChangeCaptchaInputAction>({
                    type: 'retrievePayPasswordPage/onChangeCaptchaInput',
                    payload: {
                      value: e.target.value,
                    },
                  });
                }}
              />
              <FRectBtn
                style={{ width: 110 }}
                disabled={retrievePayPasswordPage.sentCaptchaWait > 0}
                type='primary'
                onClick={() => {
                  dispatch<OnClickSentBtnAction>({
                    type: 'retrievePayPasswordPage/onClickSentBtn',
                  });
                }}
              >{retrievePayPasswordPage.sentCaptchaWait === 0 ? '获取验证码' : `${retrievePayPasswordPage.sentCaptchaWait}秒`}</FRectBtn>
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
              value={retrievePayPasswordPage.passwordOneInput}
              errorText={retrievePayPasswordPage.passwordOneInputError}
              onChange={(e) => {
                dispatch<OnChangePassword1InputAction>({
                  type: 'retrievePayPasswordPage/onChangePassword1Input',
                  payload: {
                    value: e.target.value,
                  },
                });
              }}
              onBlur={() => {
                dispatch<OnBlurPassword1InputAction>({
                  type: 'retrievePayPasswordPage/onBlurPassword1Input',
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
              value={retrievePayPasswordPage.passwordTwoInput}
              errorText={retrievePayPasswordPage.passwordTwoInputError}
              onChange={(e) => {
                dispatch<OnChangePassword2InputAction>({
                  type: 'retrievePayPasswordPage/onChangePassword2Input',
                  payload: {
                    value: e.target.value,
                  },
                });
              }}
              onBlur={() => {
                dispatch<OnBlurPassword2InputAction>({
                  type: 'retrievePayPasswordPage/onBlurPassword2Input',
                });
              }}
            />
          </div>
        </Space>
        <div style={{ height: 40 }} />
        <FRectBtn
          type='primary'
          disabled={!retrievePayPasswordPage.userPasswordInput
          || !retrievePayPasswordPage.captchaInput
          || !retrievePayPasswordPage.passwordOneInput || !!retrievePayPasswordPage.passwordOneInputError
          || !retrievePayPasswordPage.passwordTwoInput || !!retrievePayPasswordPage.passwordTwoInputError}
          onClick={() => {
            dispatch<OnClickUpdatePasswordBtnAction>({
              type: 'retrievePayPasswordPage/onClickUpdatePasswordBtn',
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
