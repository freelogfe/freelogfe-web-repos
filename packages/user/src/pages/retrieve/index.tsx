import * as React from 'react';
import styles from './index.less';
import FInput from '@/components/FInput';
import { Popover, Radio, Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, RetrievePageModelState } from '@/models/connect';
import { history } from 'umi';
import { FI18n, FUtil } from '@freelog/tools-lib';
import useUrlState from '@ahooksjs/use-url-state';
import FRadio from '@/components/FRadio';
import * as AHooks from 'ahooks';
import FComponentsLib from '@freelog/components-lib';
import {
  OnBlurConfirmPasswordInputAction,
  OnBlurEmailInputAction,
  OnBlurNewPasswordInputAction,
  OnBlurPhoneInputAction,
  OnChangeConfirmPasswordInputAction,
  OnChangeEmailInputAction,
  OnChangeNewPasswordInputAction,
  OnChangePhoneInputAction,
  OnChangeVerifyModeAction,
  OnChangeWaitingTimeAction,
  OnClickResetBtnAction,

  OnBlur_Phone_VerifyCodeInput_Action,
  OnChange_Phone_VerifyCodeInput_Action,
  OnChange_Phone_VerifyCodeReSendWait_Action,
  OnClick_Phone_SendVerifyCodeBtn_Action,

  OnBlur_Email_VerifyCodeInput_Action,
  OnChange_Email_VerifyCodeInput_Action,
  OnChange_Email_VerifyCodeReSendWait_Action,
  OnClick_Email_SendVerifyCodeBtn_Action,

  OnMountPageAction,
  OnUnmountPageAction,
} from '@/models/retrievePage';
import FPasswordInput from '@/components/FPasswordInput';
import FPhoneInput from '@/components/FPhoneInput';

// import { FCheck } from '@/components/FIcons';

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

  AHooks.useInterval(
    () => {
      dispatch<OnChange_Phone_VerifyCodeReSendWait_Action>({
        type: 'retrievePage/onChange_Phone_VerifyCodeReSendWait',
        payload: {
          value: retrievePage.phone_verifyCodeReSendWait - 1,
        },
      });
    },
    retrievePage.phone_verifyCodeReSendWait === 0 ? undefined : 1000,
  );

  AHooks.useInterval(
    () => {
      dispatch<OnChange_Email_VerifyCodeReSendWait_Action>({
        type: 'retrievePage/onChange_Email_VerifyCodeReSendWait',
        payload: {
          value: retrievePage.email_verifyCodeReSendWait - 1,
        },
      });
    },
    retrievePage.email_verifyCodeReSendWait === 0 ? undefined : 1000,
  );

  AHooks.useInterval(
    () => {
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
    },
    retrievePage.waitingTimeToLogin === 0 ? undefined : 1000,
  );

  const isVerifyModeValid: boolean =
    retrievePage.verifyMode === 'phone'
      ? (retrievePage.phoneInput !== '' && retrievePage.phoneInputError === '')
      : (retrievePage.emailInput !== '' && retrievePage.emailInputError === '');

  const verifyCode: boolean =
    retrievePage.verifyMode === 'phone'
      ? (retrievePage.phone_verifyCode !== '' && retrievePage.phone_verifyCodeError === '')
      : (retrievePage.email_verifyCode !== '' && retrievePage.email_verifyCodeError === '');

  const isVerifyAllForm: boolean = isVerifyModeValid
    && verifyCode
    && retrievePage.newPasswordInput !== ''
    && retrievePage.newPasswordInputError === ''
    && retrievePage.confirmPasswordInput !== ''
    && retrievePage.confirmPasswordInputError === '';

  function gotoLogin() {
    history.replace(
      FUtil.LinkTo.login(
        urlParams.goTo
          ? {
            goTo: decodeURIComponent(urlParams.goTo),
          }
          : {},
      ),
    );
  }

  if (retrievePage.showView === 'success') {
    return (
      <div className={styles.resetPasswordSuccess}>
        <div className={styles.box}>
          <FComponentsLib.FIcons.FCheck style={{ fontSize: 96 }} />
          <div style={{ height: 30 }} />
          <FComponentsLib.FTitleText text={'重置密码成功'} />
          <div style={{ height: 40 }} />
          <Space size={0}>
            <FComponentsLib.FContentText
              text={`${retrievePage.waitingTimeToLogin}s后返回登录界面；`}
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
            <FComponentsLib.FTitleText className='mb-30' text={'重置密码？'} type='h1' />
            <FComponentsLib.FTipText
              text={'现在可以重新设置您的密码，重置成功后可再次登录freelog'}
              type='second'
            />
          </div>
          <div className='flex-2' />
        </div>
        <div className=' flex-column-center shrink-0'>
          <div className={styles.verificationMode}>
            <div className={styles.verificationModeHeader}>
              <div className={styles.title}>
                <i />
                <div style={{ width: 5 }} />
                <FComponentsLib.FTitleText type='h4' text={'验证方式'} />
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
                >
                  <FComponentsLib.FContentText text={'手机号'} type='additional2' />
                </FRadio>
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
                >
                  <FComponentsLib.FContentText text={'邮箱'} type='additional2' />
                </FRadio>
              </Space>
            </div>
            <div style={{ height: 5 }} />
            {
              retrievePage.verifyMode === 'phone'
                ? (<>
                  <FPhoneInput
                    width={360}
                    // placeholder='输入11位手机号码'
                    placeholder='输入11位手机号码'
                    // className={styles.verificationModeInput}
                    // wrapClassName={styles.verificationModeInput}
                    inputValue={retrievePage.phoneInput}
                    onChangeInput={(value) => {
                      dispatch<OnChangePhoneInputAction>({
                        type: 'retrievePage/onChangePhoneInput',
                        payload: {
                          value: value,
                        },
                      });
                    }}
                    onBlurInput={() => {
                      dispatch<OnBlurPhoneInputAction>({
                        type: 'retrievePage/onBlurPhoneInput',
                      });
                    }}
                  />
                  {retrievePage.phoneInputError && (<>
                    <div style={{ height: 5 }} />
                    <div className={styles.errorTip}>
                      {
                        retrievePage.phoneInputError === ''
                      }
                    </div>
                  </>)}
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
                  {retrievePage.emailInputError && (<>
                    <div style={{ height: 5 }} />
                    <div className={styles.errorTip}>
                      {retrievePage.emailInputError}
                    </div>
                  </>)}
                </>)
            }
          </div>
          <div style={{ height: 20 }} />

          <div className={styles.identifyingCode}>
            <div className={styles.identifyingCodeHeader}>
              <div className={styles.title}>
                <i />
                <div style={{ width: 5 }} />
                <FComponentsLib.FTitleText type='h4' text={'验证码'} />
              </div>
            </div>
            <div style={{ height: 5 }} />

            {
              retrievePage.verifyMode === 'phone'
                ? (<>
                  <div className={styles.identifyingCodeBody}>
                    <FInput
                      className={styles.identifyingCodeInput}
                      wrapClassName={styles.identifyingCodeInput}
                      placeholder='输入验证码'
                      value={retrievePage.phone_verifyCode}
                      onChange={(e) => {
                        dispatch<OnChange_Phone_VerifyCodeInput_Action>({
                          type: 'retrievePage/onChange_Phone_VerifyCodeInput',
                          payload: {
                            value: e.target.value,
                          },
                        });
                      }}
                      onBlur={() => {
                        dispatch<OnBlur_Phone_VerifyCodeInput_Action>({
                          type: 'retrievePage/onBlur_Phone_VerifyCodeInput',
                        });
                      }}
                    />
                    <FComponentsLib.FRectBtn
                      style={{ width: 110 }}
                      disabled={retrievePage.phone_verifyCodeReSendWait > 0 || !isVerifyModeValid}
                      onClick={() => {
                        dispatch<OnClick_Phone_SendVerifyCodeBtn_Action>({
                          type: 'retrievePage/onClick_Phone_SendVerifyCodeBtn',
                        });
                      }}
                    >
                      {
                        retrievePage.phone_verifyCodeReSendWait === 0
                          ? '获取验证码'
                          : `${retrievePage.phone_verifyCodeReSendWait}秒`
                      }
                    </FComponentsLib.FRectBtn>
                  </div>
                  {
                    retrievePage.phone_verifyCodeError && (<>
                      <div style={{ height: 5 }} />
                      <div className={styles.errorTip}>
                        {retrievePage.phone_verifyCodeError}
                      </div>
                    </>)
                  }
                </>)
                : (<>
                  <div className={styles.identifyingCodeBody}>
                    <FInput
                      className={styles.identifyingCodeInput}
                      wrapClassName={styles.identifyingCodeInput}
                      placeholder='输入验证码'
                      value={retrievePage.email_verifyCode}
                      onChange={(e) => {
                        dispatch<OnChange_Email_VerifyCodeInput_Action>({
                          type: 'retrievePage/onChange_Email_VerifyCodeInput',
                          payload: {
                            value: e.target.value,
                          },
                        });
                      }}
                      onBlur={() => {
                        dispatch<OnBlur_Email_VerifyCodeInput_Action>({
                          type: 'retrievePage/onBlur_Email_VerifyCodeInput',
                        });
                      }}
                    />
                    <FComponentsLib.FRectBtn
                      style={{ width: 110 }}
                      disabled={
                        retrievePage.email_verifyCodeReSendWait > 0 || !isVerifyModeValid
                      }
                      onClick={() => {
                        dispatch<OnClick_Email_SendVerifyCodeBtn_Action>({
                          type: 'retrievePage/onClick_Email_SendVerifyCodeBtn',
                        });
                      }}
                    >
                      {
                        retrievePage.email_verifyCodeReSendWait === 0
                          ? '获取验证码'
                          : `${retrievePage.email_verifyCodeReSendWait}秒`
                      }
                    </FComponentsLib.FRectBtn>
                  </div>
                  {
                    retrievePage.email_verifyCodeError && (<>
                      <div style={{ height: 5 }} />
                      <div className={styles.errorTip}>
                        {retrievePage.email_verifyCodeError}
                      </div>
                    </>)
                  }
                </>)
            }

          </div>

          <div style={{ height: 20 }} />

          <div>
            <div>
              <div className={styles.title}>
                <i />
                <div style={{ width: 5 }} />
                <FComponentsLib.FTitleText type='h4' text={'新密码'} />
              </div>
            </div>
            <div style={{ height: 5 }} />
            <FPasswordInput
              // type='password'
              placeholder='密码必须包含数字和字母；且由6-24个字符组成'
              className={styles.input}
              // wrapClassName={styles.input}
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
            {retrievePage.newPasswordInputError && (<>
              <div style={{ height: 5 }} />
              <div className={styles.errorTip}>
                {retrievePage.newPasswordInputError}
              </div>
            </>)}
          </div>
          <div style={{ height: 20 }} />
          <div className={styles.identifyingCode}>
            <div className={styles.identifyingCodeHeader}>
              <div className={styles.title}>
                <i />
                <div style={{ width: 5 }} />
                <FComponentsLib.FTitleText type='h4' text={FI18n.i18nNext.t('account_reenter_password')} />
              </div>
            </div>
            <div style={{ height: 5 }} />
            <FPasswordInput
              // type='password'
              className={styles.input}
              // wrapClassName={styles.input}
              placeholder={FI18n.i18nNext.t('account_reenter_password_hint')}
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
            {retrievePage.confirmPasswordInputError && (<>
              <div style={{ height: 5 }} />
              <div className={styles.errorTip}>
                {retrievePage.confirmPasswordInputError}
              </div>
            </>)}
          </div>
          <div style={{ height: 40 }} />
          <FComponentsLib.FRectBtn
            style={{ width: 360 }}
            disabled={!isVerifyAllForm}
            onClick={() => {
              dispatch<OnClickResetBtnAction>({
                type: 'retrievePage/onClickResetBtn',
              });
            }}
          >
            重置密码
          </FComponentsLib.FRectBtn>
        </div>
        <div className='flex-1 flex-column'>
          <Space size={50}>
            <FComponentsLib.FTextBtn
              className='mt-95'
              onClick={() => {
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
              {FI18n.i18nNext.t('forgetpw_btn_backtologin')}
            </FComponentsLib.FTextBtn>
            <FComponentsLib.FTextBtn
              className='mt-95'
              onClick={() => {
                history.replace(
                  FUtil.LinkTo.logon(
                    urlParams.goTo
                      ? {
                        goTo: decodeURIComponent(urlParams.goTo),
                      }
                      : {},
                  ),
                );
              }}
            >
              注册新帐户
            </FComponentsLib.FTextBtn>
          </Space>
        </div>
      </div>
      {/*<FFooter />*/}
      <FComponentsLib.FPageFooter PopoverPatch={Popover} />
    </div>
  );
}

export default connect(({ retrievePage }: ConnectState) => ({
  retrievePage,
}))(Retrieve);
