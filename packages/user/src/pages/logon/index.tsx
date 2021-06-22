import * as React from "react";
import styles from "./index.less";
import {FContentText, FTipText, FTitleText} from "@/components/FText";
import FInput from "@/components/FInput";
import {FRectBtn, FTextBtn} from "@/components/FButton";
import {Radio, Space} from "antd";
import {connect, Dispatch} from "dva";
import {ConnectState, LogonPageModelState} from "@/models/connect";
import {FUtil} from "@freelog/tools-lib";
import {ChangeAction, LogonAction, SendVerificationCodeAction, VerifyExistsAction} from "@/models/logonPage";
import * as AHooks from 'ahooks';
import {history} from "@@/core/history";
import useUrlState from "@ahooksjs/use-url-state";

interface LogonProps {
  dispatch: Dispatch;
  logonPage: LogonPageModelState;
}

function Logon({dispatch, logonPage}: LogonProps) {

  const [urlParams] = useUrlState<{ goTo: string }>();
  // console.log(decodeURIComponent(urlParams.goTo), 'urlParams!@#$!@#$!@#$');

  AHooks.useInterval(() => {
      if (logonPage.sendVerificationCodeStatus > 0) {
        onChange({
          sendVerificationCodeStatus: logonPage.sendVerificationCodeStatus - 1,
        });
      }
    },
    logonPage.sendVerificationCodeStatus === 0 ? null : 1000,
  );

  AHooks.useUnmount(() => {
    onChange({sendVerificationCodeStatus: 0});
  });

  async function onChange(payload: Partial<LogonPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'logonPage/change',
      payload,
    });
  }

  const accountError: boolean = logonPage.accountType === 'email'
    ? !logonPage.emailInput || !!logonPage.emailInputError
    : !logonPage.mobileInput || !!logonPage.mobileInputError;

  const allError: boolean = !logonPage.usernameInput || !!logonPage.usernameInputError
    || accountError
    || !logonPage.verificationCodeInput || !!logonPage.verificationCodeInputError
    || !logonPage.passwordInput || !!logonPage.passwordInputError;

  return (<div className={styles.style}>
    <div style={{height: '30%', flexShrink: 1}}/>
    <div className={styles.container}>
      <i className={['freelog', 'fl-icon-logo-freelog', styles.logo].join(' ')}/>
      <div style={{height: 20}}/>
      <div className={styles.box}>
        <div className={styles.ActivateAccountContent}>
          <Space size={25} direction="vertical" style={{width: '100%'}}>

            <div>
              <FTipText type="third" text={'用户名'}/>
              <div style={{height: 5}}/>
              <FInput
                placeholder={'请输入用户名称（1-30个字符、数字或-）'}
                className={styles.blockInput}
                wrapClassName={styles.blockInput}
                size="middle"
                value={logonPage.usernameInput}
                onChange={(e) => {
                  const value = e.target.value;
                  onChange({
                    usernameInput: value,
                    // activatingAccountPasswordTwoError: value === walletPage.activatingAccountPasswordOne ? '' : '两次密码必须一致',
                  });
                }}
                onBlur={() => {
                  const inputValue: string = logonPage.usernameInput;
                  let inputError: string = '';
                  if (!inputValue) {
                    inputError = '用户名称不能为空';
                  } else if (!FUtil.Regexp.USERNAME.test(inputValue)) {
                    inputError = '用户名只能使用小写字母、数字或短横线（-）；必须以小写字母或数字开头和结尾';
                  }
                  if (inputError) {
                    onChange({
                      usernameInputError: inputError,
                    });
                  } else {
                    dispatch<VerifyExistsAction>({
                      type: 'logonPage/verifyExists',
                      payload: 'username',
                    });
                  }
                }}
              />
              {
                logonPage.usernameInputError && (<>
                  <div style={{height: 5}}/>
                  <div className={styles.inputError}>{logonPage.usernameInputError}</div>
                </>)
              }

            </div>

            <Space size={15} direction="vertical">
              <FTipText type="third" text={'注册方式'}/>
              <Space size={2}>
                <Radio
                  checked={logonPage.accountType === 'mobile'}
                  onChange={(e) => {
                    onChange({
                      accountType: 'mobile',
                    });
                  }}
                />
                <FContentText
                  // text={walletPage.activatingAccountMobile}
                  text={'手机号'}
                  type="normal"
                />
              </Space>

              <Space size={2}>
                <Radio
                  checked={logonPage.accountType === 'email'}
                  onChange={(e) => {
                    onChange({
                      accountType: 'email',
                    });
                  }}
                />
                <FContentText
                  text={'邮箱地址'}
                  type="normal"
                />
              </Space>

            </Space>

            {
              logonPage.accountType === 'email'
                ? (<div>
                  <FTipText type="third" text={'邮箱地址'}/>
                  <div style={{height: 5}}/>
                  <FInput
                    placeholder={'请输入邮箱地址'}
                    className={styles.blockInput}
                    wrapClassName={styles.blockInput}
                    size="middle"
                    value={logonPage.emailInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      onChange({
                        emailInput: value,
                      });
                    }}
                    onBlur={() => {
                      const inputValue: string = logonPage.emailInput;
                      // console.log(FUtil.Regexp.EMAIL_ADDRESS.test(inputValue), '!@#$@#');
                      // console.log(inputValue, 'inputValue!@#$@#$!@#$@#$');
                      let inputError: string = '';
                      if (!inputValue) {
                        inputError = '邮箱不能为空';
                      } else if (!FUtil.Regexp.EMAIL_ADDRESS.test(inputValue)) {
                        // console.log('!!!!!!!!@@@@@@@##3333333');
                        inputError = '输入格式有误，请输入正确的邮箱';
                      }
                      // console.log(inputError, 'inputError]]]]]]]]]]]]');
                      if (inputError) {
                        onChange({
                          emailInputError: inputError,
                        });
                      } else {
                        dispatch<VerifyExistsAction>({
                          type: 'logonPage/verifyExists',
                          payload: 'email',
                        });
                      }
                    }}
                  />
                  {
                    logonPage.emailInputError && (<>
                      <div style={{height: 5}}/>
                      <div className={styles.inputError}>{logonPage.emailInputError}</div>
                    </>)
                  }
                </div>)
                : (<div>
                  <FTipText type="third" text={'手机号'}/>
                  <div style={{height: 5}}/>
                  <FInput
                    placeholder={'请输入11位手机号'}
                    className={styles.blockInput}
                    wrapClassName={styles.blockInput}
                    size="middle"
                    value={logonPage.mobileInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      onChange({
                        mobileInput: value,
                      });
                    }}
                    onBlur={() => {
                      const inputValue: string = logonPage.mobileInput;
                      let inputError: string = '';
                      if (!inputValue) {
                        inputError = '手机号不能为空';
                      } else if (!FUtil.Regexp.MOBILE_PHONE_NUMBER.test(inputValue)) {
                        inputError = '输入格式有误，请输入正确的手机号';
                      }

                      if (inputError) {
                        onChange({
                          mobileInputError: inputError,
                        });
                      } else {
                        dispatch<VerifyExistsAction>({
                          type: 'logonPage/verifyExists',
                          payload: 'mobile',
                        });
                      }
                    }}
                  />

                  {
                    logonPage.mobileInputError && (<>
                      <div style={{height: 5}}/>
                      <div className={styles.inputError}>{logonPage.mobileInputError}</div>
                    </>)
                  }
                </div>)
            }

            <div>
              <FTipText type="third" text={'验证码'}/>
              <div style={{height: 5}}/>
              <Space size={10}>
                <FInput
                  placeholder={'请输入验证码'}
                  className={styles.verificationCodeInput}
                  wrapClassName={styles.verificationCodeInput}
                  size="middle"
                  value={logonPage.verificationCodeInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    onChange({
                      verificationCodeInput: value,
                    });
                  }}
                  onBlur={() => {
                    const inputValue: string = logonPage.verificationCodeInput;
                    let inputError: string = '';
                    if (!inputValue) {
                      inputError = '验证码不能为空';
                    }
                    // else if (!FUtil.Regexp.MOBILE_PHONE_NUMBER.test(inputValue)) {
                    //   inputError = '输入格式有误，请输入正确的手机号';
                    // }
                    onChange({
                      verificationCodeInputError: inputError,
                    });
                  }}
                />
                <FRectBtn
                  style={{width: 110, padding: 0}}
                  type="primary"
                  disabled={logonPage.sendVerificationCodeStatus !== 0 || accountError}
                  onClick={() => {
                    onChange({sendVerificationCodeStatus: 60});
                    dispatch<SendVerificationCodeAction>({
                      type: 'logonPage/sendVerificationCode',
                    });
                  }}
                >{logonPage.sendVerificationCodeStatus === 0 ? '获取验证码' : `${logonPage.sendVerificationCodeStatus}秒后重发`}</FRectBtn>
              </Space>
              {
                logonPage.verificationCodeInputError && (<>
                  <div style={{height: 5}}/>
                  <div className={styles.inputError}>{logonPage.verificationCodeInputError}</div>
                </>)
              }
            </div>

            <div>
              <FTipText type="third" text={'密码'}/>
              <div style={{height: 5}}/>
              <FInput
                placeholder={'密码必须包含数字和字母；且由6-24个字符组成'}
                className={styles.blockInput}
                wrapClassName={styles.blockInput}
                size="middle"
                type="password"
                value={logonPage.passwordInput}
                onChange={(e) => {
                  const value = e.target.value;
                  onChange({
                    passwordInput: value,
                  });
                }}
                onBlur={() => {
                  const inputValue: string = logonPage.passwordInput;
                  let inputError: string = '';
                  if (!inputValue) {
                    inputError = '密码不能为空';
                  } else if (!FUtil.Regexp.PASSWORD.test(inputValue)) {
                    inputError = '密码必须包含数字和字母；且由6-24个字符组成';
                  }
                  onChange({
                    passwordInputError: inputError,
                  });
                }}
              />
              {
                logonPage.passwordInputError && (<>
                  <div style={{height: 5}}/>
                  <div className={styles.inputError}>{logonPage.passwordInputError}</div>
                </>)
              }
            </div>

          </Space>
          <div style={{height: 40}}/>
          <FRectBtn
            className={styles.btn}
            type="primary"
            onClick={() => {
              dispatch<LogonAction>({
                type: 'logonPage/logon',
                payload: urlParams.goTo ? {
                  goTo: decodeURIComponent(urlParams.goTo),
                } : undefined,
              });
            }}
            disabled={allError}
          >注 册</FRectBtn>
        </div>
      </div>

      <div style={{height: 20}}/>

      <Space size={10}>
        <FContentText
          text={'已有账户？'}
          type="normal"
        />
        <FTextBtn
          type="primary"
          onClick={() => {
            // history.replace()
            // window.location.replace('http://www.testfreelog.com/signup');
            history.replace(FUtil.LinkTo.login(urlParams.goTo ? {
              goTo: decodeURIComponent(urlParams.goTo),
            } : {}));
          }}
        >马上登录</FTextBtn>
      </Space>
    </div>
    <div style={{height: '70%', flexShrink: 1}}/>

  </div>);
}

export default connect(({logonPage}: ConnectState) => ({
  logonPage,
}))(Logon);
