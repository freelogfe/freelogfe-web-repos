import * as React from 'react';
import styles from './index.less';
import FInput from '@/components/FInput';
import { Popover, Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, LogonPageModelState } from '@/models/connect';
import { FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import {
  OnBlurEmailInputAction,
  OnBlurPasswordInputAction,
  OnBlurPhoneInputAction,
  OnBlurUsernameInputAction,
  OnBlur_Phone_VerifyCodeInput_Action,
  OnBlur_Email_VerifyCodeInput_Action,
  OnChangeAccountTypeAction,
  OnChangeEmailInputAction,
  OnChangePasswordInputAction,
  OnChangePhoneInputAction,
  OnChangeUsernameInputAction,
  OnChange_Phone_VerifyCodeInput_Action,
  OnChange_Email_VerifyCodeInput_Action,
  OnChange_Phone_VerifyCodeReSendWait_Action,
  OnChange_Email_VerifyCodeReSendWait_Action,
  OnClickLogonBtnAction,
  OnClick_Phone_SendVerifyCodeBtn_Action,
  OnClick_Email_SendVerifyCodeBtn_Action,
  OnMountPageAction,
  OnUnmountPageAction,
  OnChangeWaitingTimeAction,
  OnTrigger_Login_Action,
} from '@/models/logonPage';
import * as AHooks from 'ahooks';
import { history } from '@@/core/history';
import useUrlState from '@ahooksjs/use-url-state';
import FRadio from '@/components/FRadio';
import FPasswordInput from '@/components/FPasswordInput';
import FPhoneInput from '@/components/FPhoneInput';

interface LogonProps {
  dispatch: Dispatch;
  logonPage: LogonPageModelState;
}

function Logon({ dispatch, logonPage }: LogonProps) {
  const [urlParams] = useUrlState<{ goTo: string; invitationCode?: string; }>();

  AHooks.useMount(() => {
    self._czc?.push(['_trackPageview', self.location.pathname]);
    dispatch<OnMountPageAction>({
      type: 'logonPage/onMountPage',
      payload: {
        url: urlParams.goTo ? decodeURIComponent(urlParams.goTo) : '',
        invitationCode: urlParams.invitationCode || '',
      },
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'logonPage/onUnmountPage',
    });
  });

  AHooks.useInterval(
    () => {
      dispatch<OnChange_Phone_VerifyCodeReSendWait_Action>({
        type: 'logonPage/onChange_Phone_VerifyCodeReSendWait',
        payload: {
          value: logonPage.phone_verifyCodeReSendWait - 1,
        },
      });
    },
    logonPage.phone_verifyCodeReSendWait === 0 ? undefined : 1000,
  );

  AHooks.useInterval(
    () => {
      dispatch<OnChange_Email_VerifyCodeReSendWait_Action>({
        type: 'logonPage/onChange_Email_VerifyCodeReSendWait',
        payload: {
          value: logonPage.email_verifyCodeReSendWait - 1,
        },
      });
    },
    logonPage.email_verifyCodeReSendWait === 0 ? undefined : 1000,
  );

  AHooks.useInterval(
    () => {
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
    },
    logonPage.waitingTimeToLogin === 0 ? undefined : 1000,
  );

  function gotoLogin() {
    dispatch<OnTrigger_Login_Action>({
      type: 'logonPage/onTrigger_Login',
      payload: {
        goToUrl: urlParams.goTo || '',
      },
    });
  }

  const isVerifyAccountError: boolean =
    logonPage.accountType === 'email'
      ? (logonPage.emailInput === '' || logonPage.emailInputError !== '')
      : (logonPage.phoneInput === '' || logonPage.phoneInputError !== '');

  const isVerifyAllFormError: boolean =
    logonPage.usernameInput === '' ||
    logonPage.usernameInputError !== '' ||
    isVerifyAccountError ||
    (logonPage.accountType === 'email' ? logonPage.email_verificationCodeInput : logonPage.phone_verificationCodeInput) === '' ||
    (logonPage.accountType === 'email' ? logonPage.email_verificationCodeInputError : logonPage.phone_verificationCodeInputError) !== '' ||
    logonPage.passwordInput === '' ||
    logonPage.passwordInputError !== '';

  if (logonPage.showView === 'success') {
    return (
      <div className={styles.resetPasswordSuccess}>
        <div className={styles.box}>
          <FComponentsLib.FIcons.FCheck style={{ fontSize: 96 }} />
          <div style={{ height: 30 }} />
          <FComponentsLib.FTitleText text={'注册成功'} />
          <div style={{ height: 40 }} />
          <Space size={0}>
            <FComponentsLib.FContentText
              text={`${logonPage.waitingTimeToLogin}s后返回登陆界面；`}
              type='negative'
            />
            <FComponentsLib.FTextBtn
              onClick={() => {
                gotoLogin();
              }}
            >
              立即登录
            </FComponentsLib.FTextBtn>
          </Space>
          <div style={{ height: 10 }} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.styles + ' flex-column-center w-100x h-100x'}>
      <div
        className={styles.container + ' flex-column align-center w-100x h-100x'}
      >
        <div className='flex-column align-center flex-1'>
          <div className='flex-3' />
          <div className='shrink-0 flex-column-center'>
            <FComponentsLib.FTitleText text={'注册freelog帐户'} type='h1' />
          </div>
          <div className='flex-2' />
        </div>
        <div className=' flex-column-center shrink-0'>
          <div>
            <div>
              <div className={styles.title}>
                <i>*</i>
                <div style={{ width: 5 }} />
                <FComponentsLib.FTitleText type='h4' text={'用户名'} />
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
            {logonPage.usernameInputError && (
              <div className={styles.errorTip}>
                {logonPage.usernameInputError}
              </div>
            )}
          </div>

          <div style={{ height: 20 }} />

          <div className={styles.verificationMode}>
            <div className={styles.verificationModeHeader}>
              <div className={styles.title}>
                <i>*</i>
                <div style={{ width: 5 }} />
                <FComponentsLib.FTitleText type='h4' text={'注册方式'} />
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
                >
                  <FComponentsLib.FContentText text={'手机号'} type='additional2' />
                </FRadio>
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
                >
                  <FComponentsLib.FContentText text={'邮箱'} type='additional2' />
                </FRadio>
              </Space>
            </div>
            <div style={{ height: 5 }} />
            {logonPage.accountType === 'phone' ? (
              <>
                <FPhoneInput
                  width={360}
                  placeholder='输入11位手机号码'
                  inputValue={logonPage.phoneInput}
                  onChangeInput={(value) => {
                    dispatch<OnChangePhoneInputAction>({
                      type: 'logonPage/onChangePhoneInput',
                      payload: {
                        value: value,
                      },
                    });
                  }}
                  onBlurInput={() => {
                    dispatch<OnBlurPhoneInputAction>({
                      type: 'logonPage/onBlurPhoneInput',
                    });
                  }}
                />
                {logonPage.phoneInputError && (
                  <div className={styles.errorTip}>
                    {logonPage.phoneInputError}
                  </div>
                )}
              </>
            ) : (
              <>
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
                {logonPage.emailInputError && (
                  <div className={styles.errorTip}>
                    {logonPage.emailInputError}
                  </div>
                )}
              </>
            )}
          </div>
          <div style={{ height: 20 }} />
          <div className={styles.identifyingCode}>
            <div className={styles.identifyingCodeHeader}>
              <div className={styles.title}>
                <i>*</i>
                <div style={{ width: 5 }} />
                <FComponentsLib.FTitleText type='h4' text={'验证码'} />
              </div>
            </div>
            <div style={{ height: 5 }} />
            {
              logonPage.accountType === 'phone'
                ? (<>
                  <div className={styles.identifyingCodeBody}>
                    <FInput
                      className={styles.identifyingCodeInput}
                      wrapClassName={styles.identifyingCodeInput}
                      placeholder='输入验证码'
                      value={logonPage.phone_verificationCodeInput}
                      onChange={(e) => {
                        dispatch<OnChange_Phone_VerifyCodeInput_Action>({
                          type: 'logonPage/onChange_Phone_VerifyCodeInput',
                          payload: {
                            value: e.target.value,
                          },
                        });
                      }}
                      onBlur={() => {
                        dispatch<OnBlur_Phone_VerifyCodeInput_Action>({
                          type: 'logonPage/onBlur_Phone_VerifyCodeInput',
                        });
                      }}
                    />
                    <FComponentsLib.FRectBtn
                      style={{ width: 110 }}
                      disabled={
                        logonPage.phone_verifyCodeReSendWait > 0 || logonPage.phoneInput === '' || logonPage.phoneInputError !== ''
                      }
                      onClick={() => {
                        dispatch<OnClick_Phone_SendVerifyCodeBtn_Action>({
                          type: 'logonPage/onClick_Phone_SendVerifyCodeBtn',
                        });
                      }}
                    >
                      {
                        logonPage.phone_verifyCodeReSendWait === 0
                          ? '获取验证码'
                          : `${logonPage.phone_verifyCodeReSendWait}秒`
                      }
                    </FComponentsLib.FRectBtn>
                  </div>
                  {
                    logonPage.phone_verificationCodeInputError && (
                      <div className={styles.errorTip}>
                        {logonPage.phone_verificationCodeInputError}
                      </div>
                    )
                  }
                </>)
                : (<>
                  <div className={styles.identifyingCodeBody}>
                    <FInput
                      className={styles.identifyingCodeInput}
                      wrapClassName={styles.identifyingCodeInput}
                      placeholder='输入验证码'
                      value={logonPage.email_verificationCodeInput}
                      onChange={(e) => {
                        dispatch<OnChange_Email_VerifyCodeInput_Action>({
                          type: 'logonPage/onChange_Email_VerifyCodeInput',
                          payload: {
                            value: e.target.value,
                          },
                        });
                      }}
                      onBlur={() => {
                        dispatch<OnBlur_Email_VerifyCodeInput_Action>({
                          type: 'logonPage/onBlur_Email_VerifyCodeInput',
                        });
                      }}
                    />
                    <FComponentsLib.FRectBtn
                      style={{ width: 110 }}
                      disabled={
                        logonPage.email_verifyCodeReSendWait > 0 || logonPage.emailInput === '' || logonPage.emailInputError !== ''
                      }
                      onClick={() => {
                        dispatch<OnClick_Email_SendVerifyCodeBtn_Action>({
                          type: 'logonPage/onClick_Email_SendVerifyCodeBtn',
                        });
                      }}
                    >
                      {
                        logonPage.email_verifyCodeReSendWait === 0
                          ? '获取验证码'
                          : `${logonPage.email_verifyCodeReSendWait}秒`
                      }
                    </FComponentsLib.FRectBtn>
                  </div>
                  {
                    logonPage.email_verificationCodeInputError && (
                      <div className={styles.errorTip}>
                        {logonPage.email_verificationCodeInputError}
                      </div>
                    )
                  }
                </>)
            }

          </div>

          <div style={{ height: 20 }} />

          <div>
            <div>
              <div className={styles.title}>
                <i>*</i>
                <div style={{ width: 5 }} />
                <FComponentsLib.FTitleText type='h4' text={'密码'} />
              </div>
            </div>
            <div style={{ height: 5 }} />
            <FPasswordInput
              // type='password'
              placeholder='密码必须包含数字和字母；且由6-24个字符组成'
              className={styles.input}
              // wrapClassName={styles.input}
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
            {logonPage.passwordInputError && (
              <div className={styles.errorTip}>
                {logonPage.passwordInputError}
              </div>
            )}
          </div>

          {/*<div style={{ height: 20 }} />*/}

          {/*<div>*/}
          {/*  <div>*/}
          {/*    <div className={styles.title}>*/}
          {/*      /!*<i>*</i>*!/*/}
          {/*      /!*<div style={{ width: 5 }} />*!/*/}
          {/*      <FComponentsLib.FTitleText type='h4' text={'内测邀请码'} />*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  <div style={{ height: 5 }} />*/}
          {/*  <FInput*/}
          {/*    // type='password'*/}
          {/*    placeholder='请输入内测邀请码'*/}
          {/*    className={styles.input}*/}
          {/*    wrapClassName={styles.input}*/}
          {/*    value={logonPage.invitationCodeInput}*/}
          {/*    onChange={(e) => {*/}
          {/*      dispatch<OnChange_InvitationCodeInput_Action>({*/}
          {/*        type: 'logonPage/onChange_InvitationCodeInput',*/}
          {/*        payload: {*/}
          {/*          value: e.target.value,*/}
          {/*        },*/}
          {/*      });*/}
          {/*    }}*/}
          {/*    onBlur={() => {*/}
          {/*      // dispatch<OnBlurPasswordInputAction>({*/}
          {/*      //   type: 'logonPage/onBlurPasswordInput',*/}
          {/*      // });*/}
          {/*    }}*/}
          {/*  />*/}
          {/*  {logonPage.passwordInputError && (*/}
          {/*    <div className={styles.errorTip}>*/}
          {/*      {logonPage.passwordInputError}*/}
          {/*    </div>*/}
          {/*  )}*/}
          {/*</div>*/}

          <div style={{ height: 40 }} />
          <FComponentsLib.FRectBtn
            style={{ width: 360 }}
            disabled={isVerifyAllFormError}
            onClick={() => {
              dispatch<OnClickLogonBtnAction>({
                type: 'logonPage/onClickLogonBtn',
              });
            }}
          >
            注册
          </FComponentsLib.FRectBtn>
        </div>

        <div className='flex-1 flex-column'>
          <Space size={0}>
            <FComponentsLib.FContentText className='mt-95' text={'已有账户？'} type='normal' />
            <FComponentsLib.FTextBtn
              className='mt-95'
              type='primary'
              onClick={() => {
                // history.replace()
                // window.location.replace('http://www.testfreelog.com/signup');
                history.replace(
                  FUtil.LinkTo.login(
                    urlParams.goTo
                      ? {
                        goTo: decodeURIComponent(urlParams.goTo),
                      }
                      : {},
                  ),
                );
              }}
            >
              马上登录
            </FComponentsLib.FTextBtn>
          </Space>
        </div>
      </div>
      {/*<FFooter />*/}
      <FComponentsLib.FPageFooter PopoverPatch={Popover} />
    </div>
  );
}

export default connect(({ logonPage }: ConnectState) => ({
  logonPage,
}))(Logon);
