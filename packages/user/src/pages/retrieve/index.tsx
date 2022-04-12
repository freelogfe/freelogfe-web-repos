import * as React from 'react';
import styles from './index.less';
import { FContentText, FTipText, FTitleText } from '@/components/FText';
import FInput from '@/components/FInput';
import { Input, Radio, Space } from 'antd';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import { connect, Dispatch } from 'dva';
import { ConnectState, RetrievePageModelState } from '@/models/connect';
import { history } from 'umi';
import { FUtil } from '@freelog/tools-lib';
import useUrlState from '@ahooksjs/use-url-state';
import FRadio from '@/components/FRadio';
import * as AHooks from 'ahooks';
import {
  OnBlurConfirmPasswordInputAction,
  OnBlurEmailInputAction, OnBlurNewPasswordInputAction,
  OnBlurPhoneInputAction, OnBlurVerifyCodeInputAction,
  OnChangeConfirmPasswordInputAction,
  OnChangeEmailInputAction, OnChangeNewPasswordInputAction,
  OnChangePhoneInputAction, OnChangeVerifyCodeInputAction, OnChangeVerifyCodeReSendWaitAction,
  OnChangeVerifyModeAction, OnChangeWaitingTimeAction, OnClickResetBtnAction, OnClickSendVerifyCodeBtnAction,
  OnMountPageAction,
  OnUnmountPageAction,
} from '@/models/retrievePage';
import { FCheck } from '@/components/FIcons';

interface RetrieveProps {
  dispatch: Dispatch;

  retrievePage: RetrievePageModelState;
}

function Retrieve({ dispatch, retrievePage }: RetrieveProps) {

  const [urlParams] = useUrlState<{ goTo: string }>();

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'retrievePage/onMountPage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'retrievePage/onUnmountPage',
    });
  });

  AHooks.useInterval(() => {
    dispatch<OnChangeVerifyCodeReSendWaitAction>({
      type: 'retrievePage/onChangeVerifyCodeReSendWait',
      payload: {
        value: retrievePage.verifyCodeReSendWait - 1,
      },
    });
  }, retrievePage.verifyCodeReSendWait === 0 ? null : 1000);


  AHooks.useInterval(() => {
    dispatch<OnChangeWaitingTimeAction>({
      type: 'retrievePage/onChangeWaitingTime',
      payload: {
        value: retrievePage.waitingTimeToLogin - 1,
      },
    });
    if (retrievePage.waitingTimeToLogin - 1 === 0) {
      // console.log(1234);
      gotoLogin();
    }
  }, retrievePage.waitingTimeToLogin === 0 ? null : 1000);

  const isVerifyModeValid: boolean = retrievePage.verifyMode === 'phone'
    ? (!!retrievePage.phoneInput && !retrievePage.phoneInputError)
    : (!!retrievePage.emailInput && !retrievePage.emailInputError);

  const isVerifyAllForm: boolean = isVerifyModeValid
    && !!retrievePage.verifyCode
    && !!retrievePage.newPasswordInput && !retrievePage.newPasswordInputError
    && !!retrievePage.confirmPasswordInput && !retrievePage.confirmPasswordInputError;

  function gotoLogin() {
    history.replace(FUtil.LinkTo.login(urlParams.goTo ? {
      goTo: decodeURIComponent(urlParams.goTo),
    } : {}));
  }

  if (retrievePage.showView === 'success') {
    return (<div className={styles.resetPasswordSuccess}>
      <div className={styles.box}>
        <FCheck style={{ fontSize: 96 }} />
        <div style={{ height: 30 }} />
        <FTitleText text={'重置密码成功'} />
        <div style={{ height: 40 }} />
        <Space size={0}>
          <FContentText text={`${retrievePage.waitingTimeToLogin}s后返回登陆界面；`} type='negative' />
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

      <FTitleText text={'重置密码？'} type='h1' />
      <div style={{ height: 30 }} />
      <FTipText text={'现在可以重新设置您的密码，重置成功后可再次登录freelog'} type='second' />
      <div style={{ height: 100 }} />
      <div className={styles.verificationMode}>
        <div className={styles.verificationModeHeader}>
          <div className={styles.title}>
            <i />
            <div style={{ width: 5 }} />
            <FTitleText type='h4' text={'验证方式'} />
          </div>
          <Space size={25}>
            <FRadio
              checked={retrievePage.verifyMode === 'phone'}
              onChange={(e) => {
                dispatch<OnChangeVerifyModeAction>({
                  type: 'retrievePage/onChangeVerifyMode',
                  payload: {
                    value: 'phone',
                  },
                });
              }}
            ><FContentText text={'手机号'} type='additional2' /></FRadio>
            <FRadio
              checked={retrievePage.verifyMode === 'email'}
              onChange={(e) => {
                dispatch<OnChangeVerifyModeAction>({
                  type: 'retrievePage/onChangeVerifyMode',
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
          retrievePage.verifyMode === 'phone'
            ? (<>
              <FInput
                placeholder='输入11位手机号码'
                className={styles.verificationModeInput}
                wrapClassName={styles.verificationModeInput}
                value={retrievePage.phoneInput}
                onChange={(e) => {
                  dispatch<OnChangePhoneInputAction>({
                    type: 'retrievePage/onChangePhoneInput',
                    payload: {
                      value: e.target.value,
                    },
                  });
                }}
                onBlur={() => {
                  dispatch<OnBlurPhoneInputAction>({
                    type: 'retrievePage/onBlurPhoneInput',
                  });
                }}
              />
              {
                retrievePage.phoneInputError && (
                  <div className={styles.errorTip}>{retrievePage.phoneInputError}</div>)
              }

            </>)
            : (<>
              <FInput
                placeholder='输入邮箱'
                className={styles.verificationModeInput}
                wrapClassName={styles.verificationModeInput}
                value={retrievePage.emailInput}
                onChange={(e) => {
                  dispatch<OnChangeEmailInputAction>({
                    type: 'retrievePage/onChangeEmailInput',
                    payload: {
                      value: e.target.value,
                    },
                  });
                }}
                onBlur={() => {
                  dispatch<OnBlurEmailInputAction>({
                    type: 'retrievePage/onBlurEmailInput',
                  });
                }}
              />
              {
                retrievePage.emailInputError && (
                  <div className={styles.errorTip}>{retrievePage.emailInputError}</div>)
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
            value={retrievePage.verifyCode}
            onChange={(e) => {
              dispatch<OnChangeVerifyCodeInputAction>({
                type: 'retrievePage/onChangeVerifyCodeInput',
                payload: {
                  value: e.target.value,
                },
              });
            }}
            onBlur={() => {
              dispatch<OnBlurVerifyCodeInputAction>({
                type: 'retrievePage/onBlurVerifyCodeInput',
              });
            }}
          />
          <FRectBtn
            style={{ width: 110 }}
            disabled={retrievePage.verifyCodeReSendWait > 0 || !isVerifyModeValid}
            onClick={() => {
              dispatch<OnClickSendVerifyCodeBtnAction>({
                type: 'retrievePage/onClickSendVerifyCodeBtn',
              });
            }}
          >{retrievePage.verifyCodeReSendWait === 0 ? '获取验证码' : `${retrievePage.verifyCodeReSendWait}秒`}</FRectBtn>
        </div>
        {
          retrievePage.verifyCodeError && (<div className={styles.errorTip}>{retrievePage.verifyCodeError}</div>)
        }

      </div>

      <div style={{ height: 20 }} />

      <div>
        <div>
          <div className={styles.title}>
            <i />
            <div style={{ width: 5 }} />
            <FTitleText type='h4' text={'新密码'} />
          </div>
        </div>
        <div style={{ height: 5 }} />
        <FInput
          type='password'
          placeholder='密码必须包含数字和字母；且由6-24个字符组成'
          className={styles.input}
          wrapClassName={styles.input}
          value={retrievePage.newPasswordInput}
          onChange={(e) => {
            dispatch<OnChangeNewPasswordInputAction>({
              type: 'retrievePage/onChangeNewPasswordInput',
              payload: {
                value: e.target.value,
              },
            });
          }}
          onBlur={() => {
            dispatch<OnBlurNewPasswordInputAction>({
              type: 'retrievePage/onBlurNewPasswordInput',
            });
          }}
        />
        {
          retrievePage.newPasswordInputError && (
            <div className={styles.errorTip}>{retrievePage.newPasswordInputError}</div>)
        }

      </div>
      <div style={{ height: 20 }} />
      <div className={styles.identifyingCode}>
        <div className={styles.identifyingCodeHeader}>
          <div className={styles.title}>
            <i />
            <div style={{ width: 5 }} />
            <FTitleText type='h4' text={'验证新密码'} />
          </div>
        </div>
        <div style={{ height: 5 }} />
        <FInput
          type='password'
          className={styles.input}
          wrapClassName={styles.input}
          placeholder='再次输入新密码'
          value={retrievePage.confirmPasswordInput}
          onChange={(e) => {
            dispatch<OnChangeConfirmPasswordInputAction>({
              type: 'retrievePage/onChangeConfirmPasswordInput',
              payload: {
                value: e.target.value,
              },
            });
          }}
          onBlur={() => {
            dispatch<OnBlurConfirmPasswordInputAction>({
              type: 'retrievePage/onBlurConfirmPasswordInput',
            });
          }}
        />
        {
          retrievePage.confirmPasswordInputError && (
            <div className={styles.errorTip}>{retrievePage.confirmPasswordInputError}</div>)
        }

      </div>
      <div style={{ height: 40 }} />
      <FRectBtn
        style={{ width: 360 }}
        disabled={!isVerifyAllForm}
        onClick={() => {
          dispatch<OnClickResetBtnAction>({
            type: 'retrievePage/onClickResetBtn',
          });
        }}
      >重置密码</FRectBtn>


      <div style={{ height: 128 }} />
      <Space size={50}>
        <FTextBtn onClick={() => {
          history.replace(FUtil.LinkTo.login(urlParams.goTo ? {
            goTo: decodeURIComponent(urlParams.goTo),
          } : {}));
        }}>返回登陆页</FTextBtn>
        <FTextBtn
          onClick={() => {
            history.replace(FUtil.LinkTo.logon(urlParams.goTo ? {
              goTo: decodeURIComponent(urlParams.goTo),
            } : {}));
          }}
        >注册新帐户</FTextBtn>
      </Space>
    </div>
    <div style={{ height: 20 }} />
  </div>);
}

export default connect(({ retrievePage }: ConnectState) => ({
  retrievePage,
}))(Retrieve);
