import * as React from "react";
import styles from './index.less';
import {FTitleText} from "@/components/FText";
import FInput from "@/components/FInput";
import {FRectBtn} from "@/components/FButton";
import {ChangeAction, LoginAction, LoginPageModelState} from "@/models/loginPage";
import {connect, Dispatch} from 'dva';
import {ConnectState} from "@/models/connect";
import {FUtil} from "@freelog/tools-lib";
import useUrlState from "@ahooksjs/use-url-state";

interface LoginProps {
  dispatch: Dispatch;

  loginPage: LoginPageModelState;
}

function Login({dispatch, loginPage}: LoginProps) {

  const [urlParams] = useUrlState<{ goTo: string }>();

  async function onChange(payload: Partial<LoginPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'loginPage/change',
      payload,
    });
  }

  return (<div className={styles.style}>
    <div className={styles.container}>
      <i className={['freelog', 'fl-icon-logo-freelog', styles.logo].join(' ')}/>
      <div style={{height: 20}}/>
      <div className={styles.box}>
        <FTitleText type="h4" text={'用户名/手机号/邮箱'}/>
        <div style={{height: 5}}/>
        <FInput
          name="username"
          value={loginPage.username}
          errorText={loginPage.usernameError}
          className={styles.Input}
          wrapClassName={styles.Input}
          onChange={(e) => {
            const value: string = e.target.value;
            onChange({
              username: value,
              usernameError: !value ? '账号不能为空' : '',
            });
          }}
        />
        <div style={{height: 30}}/>
        <FTitleText type="h4" text={'密码'}/>
        <div style={{height: 5}}/>
        <FInput
          name="password"
          value={loginPage.password}
          errorText={loginPage.passwordError}
          className={styles.Input}
          wrapClassName={styles.Input}
          type="password"
          onChange={(e) => {
            const value: string = e.target.value;
            onChange({
              password: value,
              passwordError: !value ? '密码不能为空' : '',
            });
          }}
        />
        <div style={{height: 50}}/>
        <FRectBtn
          className={styles.btn}
          disabled={loginPage.btnState !== 'normal' || !loginPage.username || !!loginPage.usernameError || !loginPage.password || !!loginPage.passwordError}
          onClick={() => {
            dispatch<LoginAction>({
              type: 'loginPage/login',
              payload: urlParams.goTo || '',
            });
          }}
        >登 录</FRectBtn>
      </div>
      <div style={{height: 100}}/>
    </div>
  </div>);
}

export default connect(({loginPage}: ConnectState) => ({
  loginPage,
}))(Login);
