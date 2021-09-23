import * as React from 'react';
import styles from './index.less';
import { FContentText, FTipText, FTitleText } from '@/components/FText';
import FInput from '@/components/FInput';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import { Space } from 'antd';
import { connect, Dispatch } from 'dva';
import { ConnectState, LogonPageModelState } from '@/models/connect';
import { FUtil } from '@freelog/tools-lib';
import {
  OnBlurEmailInputAction, OnBlurPasswordInputAction, OnBlurPhoneInputAction,
  OnBlurUsernameInputAction, OnBlurVerifyCodeInputAction,
  OnChangeAccountTypeAction, OnChangeEmailInputAction, OnChangePasswordInputAction,
  OnChangePhoneInputAction,
  OnChangeUsernameInputAction, OnChangeVerifyCodeInputAction,
  OnChangeVerifyCodeReSendWaitAction, OnClickLogonBtnAction, OnClickSendVerifyCodeBtnAction,
  OnMountPageAction,
  OnUnmountPageAction, OnChangeWaitingTimeAction,
} from '@/models/logonPage';
import * as AHooks from 'ahooks';
import { history } from '@@/core/history';
import useUrlState from '@ahooksjs/use-url-state';
import FRadio from '@/components/FRadio';
import { FCheck } from '@/components/FIcons';

// import { OnChangeWaitingTimeAction } from '@/models/retrievePage';

interface LogonProps {
  dispatch: Dispatch;
  logonPage: LogonPageModelState;
}

function Logon({ dispatch, logonPage }: LogonProps) {

  const [urlParams] = useUrlState<{ goTo: string }>();

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'logonPage/onMountPage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'logonPage/onUnmountPage',
    });
  });

  AHooks.useInterval(() => {
    dispatch<OnChangeVerifyCodeReSendWaitAction>({
      type: 'logonPage/onChangeVerifyCodeReSendWait',
      payload: {
        value: logonPage.verifyCodeReSendWait - 1,
      },
    });
  }, logonPage.verifyCodeReSendWait === 0 ? null : 1000);

  AHooks.useInterval(() => {
    dispatch<OnChangeWaitingTimeAction>({
      type: 'logonPage/onChangeWaitingTime',
      payload: {
        value: logonPage.waitingTimeToLogin - 1,
      },
    });
    if (logonPage.waitingTimeToLogin - 1 === 0) {
      // console.log(1234);
      gotoLogin();
    }
  }, logonPage.waitingTimeToLogin === 0 ? null : 1000);

  function gotoLogin() {
    history.replace(FUtil.LinkTo.login(urlParams.goTo ? {
      goTo: decodeURIComponent(urlParams.goTo),
    } : {}));
  }

  const isVerifyAccountError: boolean = logonPage.accountType === 'email'
    ? (logonPage.emailInput === '' || logonPage.emailInputError !== '')
    : (logonPage.phoneInput === '' || logonPage.phoneInputError !== '');

  const isVerifyAllFormError: boolean = logonPage.usernameInput === '' || logonPage.usernameInputError !== ''
    || isVerifyAccountError
    || logonPage.verificationCodeInput === '' || logonPage.verificationCodeInputError !== ''
    || logonPage.passwordInput === '' || logonPage.passwordInputError !== '';

  if (logonPage.showView === 'success') {
    return (<div className={styles.resetPasswordSuccess}>
      <div className={styles.box}>
        <FCheck style={{ fontSize: 96 }} />
        <div style={{ height: 30 }} />
        <FTitleText text={'注册成功'} />
        <div style={{ height: 40 }} />
        <Space size={0}>
          <FContentText text={`${logonPage.waitingTimeToLogin}s后返回登陆界面；`} type='negative' />
          <FTextBtn onClick={() => {
            gotoLogin();
          }}>立即登录</FTextBtn>
        </Space>
        <div style={{ height: 10 }} />
      </div>
    </div>);
  }

  return (<div className={styles.styles}>
    <div className={styles.container}>

      <FTitleText text={'注册freelog帐户'} type='h1' />
      <div style={{ height: 90 }} />

      <div>
        <div>
          <div className={styles.title}>
            <i />
            <div style={{ width: 5 }} />
            <FTitleText type='h4' text={'用户名'} />
          </div>
        </div>
        <div style={{ height: 5 }} />
        <FInput
          placeholder='输入用户名'
          className={styles.input}
          wrapClassName={styles.input}
          value={logonPage.usernameInput}
          onChange={(e) => {
            dispatch<OnChangeUsernameInputAction>({
              type: 'logonPage/onChangeUsernameInput',
              payload: {
                value: e.target.value,
              },
            });
          }}
          onBlur={() => {
            dispatch<OnBlurUsernameInputAction>({
              type: 'logonPage/onBlurUsernameInput',
            });
          }}
        />
        {
          logonPage.usernameInputError && (
            <div className={styles.errorTip}>{logonPage.usernameInputError}</div>)
        }

      </div>

      <div style={{ height: 20 }} />

      <div className={styles.verificationMode}>
        <div className={styles.verificationModeHeader}>
          <div className={styles.title}>
            <i />
            <div style={{ width: 5 }} />
            <FTitleText type='h4' text={'注册方式'} />
          </div>
          <Space size={25}>
            <FRadio
              checked={logonPage.accountType === 'phone'}
              onChange={(e) => {
                dispatch<OnChangeAccountTypeAction>({
                  type: 'logonPage/onChangeAccountType',
                  payload: {
                    value: 'phone',
                  },
                });
              }}
            ><FContentText text={'手机号'} type='additional2' /></FRadio>
            <FRadio
              checked={logonPage.accountType === 'email'}
              onChange={(e) => {
                // console.log('33333333333');
                dispatch<OnChangeAccountTypeAction>({
                  type: 'logonPage/onChangeAccountType',
                  payload: {
                    value: 'email',
                  },
                });
              }}
            ><FContentText text={'邮箱'} type='additional2' /></FRadio>
          </Space>
        </div>
        <div style={{ height: 5 }} />
        {
          logonPage.accountType === 'phone'
            ? (<>
              <FInput
                placeholder='输入11位手机号码'
                className={styles.verificationModeInput}
                wrapClassName={styles.verificationModeInput}
                value={logonPage.phoneInput}
                onChange={(e) => {
                  dispatch<OnChangePhoneInputAction>({
                    type: 'logonPage/onChangePhoneInput',
                    payload: {
                      value: e.target.value,
                    },
                  });
                }}
                onBlur={() => {
                  dispatch<OnBlurPhoneInputAction>({
                    type: 'logonPage/onBlurPhoneInput',
                  });
                }}
              />
              {
                logonPage.phoneInputError && (
                  <div className={styles.errorTip}>{logonPage.phoneInputError}</div>)
              }

            </>)
            : (<>
              <FInput
                placeholder='输入邮箱'
                className={styles.verificationModeInput}
                wrapClassName={styles.verificationModeInput}
                value={logonPage.emailInput}
                onChange={(e) => {
                  dispatch<OnChangeEmailInputAction>({
                    type: 'logonPage/onChangeEmailInput',
                    payload: {
                      value: e.target.value,
                    },
                  });
                }}
                onBlur={() => {
                  dispatch<OnBlurEmailInputAction>({
                    type: 'logonPage/onBlurEmailInput',
                  });
                }}
              />
              {
                logonPage.emailInputError && (
                  <div className={styles.errorTip}>{logonPage.emailInputError}</div>)
              }
            </>)
        }

      </div>
      <div style={{ height: 20 }} />
      <div className={styles.identifyingCode}>
        <div className={styles.identifyingCodeHeader}>
          <div className={styles.title}>
            <i />
            <div style={{ width: 5 }} />
            <FTitleText type='h4' text={'验证码'} />
          </div>
        </div>
        <div style={{ height: 5 }} />
        <div className={styles.identifyingCodeBody}>
          <FInput
            className={styles.identifyingCodeInput}
            wrapClassName={styles.identifyingCodeInput}
            placeholder='输入验证码'
            value={logonPage.verificationCodeInput}
            onChange={(e) => {
              dispatch<OnChangeVerifyCodeInputAction>({
                type: 'logonPage/onChangeVerifyCodeInput',
                payload: {
                  value: e.target.value,
                },
              });
            }}
            onBlur={() => {
              dispatch<OnBlurVerifyCodeInputAction>({
                type: 'logonPage/onBlurVerifyCodeInput',
              });
            }}
          />
          <FRectBtn
            style={{ width: 110 }}
            disabled={logonPage.verifyCodeReSendWait > 0 || isVerifyAccountError}
            onClick={() => {
              dispatch<OnClickSendVerifyCodeBtnAction>({
                type: 'logonPage/onClickSendVerifyCodeBtn',
              });
            }}
          >{logonPage.verifyCodeReSendWait === 0 ? '获取验证码' : `${logonPage.verifyCodeReSendWait}秒`}</FRectBtn>
        </div>
        {
          logonPage.verificationCodeInputError && (
            <div className={styles.errorTip}>{logonPage.verificationCodeInputError}</div>)
        }

      </div>

      <div style={{ height: 20 }} />

      <div>
        <div>
          <div className={styles.title}>
            <i />
            <div style={{ width: 5 }} />
            <FTitleText type='h4' text={'密码'} />
          </div>
        </div>
        <div style={{ height: 5 }} />
        <FInput
          type='password'
          placeholder='密码必须包含数字和字母；且由6-24个字符组成'
          className={styles.input}
          wrapClassName={styles.input}
          value={logonPage.passwordInput}
          onChange={(e) => {
            dispatch<OnChangePasswordInputAction>({
              type: 'logonPage/onChangePasswordInput',
              payload: {
                value: e.target.value,
              },
            });
          }}
          onBlur={() => {
            dispatch<OnBlurPasswordInputAction>({
              type: 'logonPage/onBlurPasswordInput',
            });
          }}
        />
        {
          logonPage.passwordInputError && (
            <div className={styles.errorTip}>{logonPage.passwordInputError}</div>)
        }

      </div>

      <div style={{ height: 40 }} />
      <FRectBtn
        style={{ width: 360 }}
        disabled={isVerifyAllFormError}
        onClick={() => {
          dispatch<OnClickLogonBtnAction>({
            type: 'logonPage/onClickLogonBtn',
          });
        }}
      >注册</FRectBtn>

      <div style={{ height: 95 }} />
      <Space size={0}>
        <FContentText
          text={'已有账户？'}
          type='normal'
        />
        <FTextBtn
          type='primary'
          onClick={() => {
            // history.replace()
            // window.location.replace('http://www.testfreelog.com/signup');
            history.replace(FUtil.LinkTo.login(urlParams.goTo ? {
              goTo: decodeURIComponent(urlParams.goTo),
            } : {}));
          }}
        >马上登录</FTextBtn>
      </Space>
      <div style={{ height: 20 }} />
    </div>

  </div>);

}

export default connect(({ logonPage }: ConnectState) => ({
  logonPage,
}))(Logon);
