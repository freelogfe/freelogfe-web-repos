import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import FInput from '@/components/FInput';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import { ChangeAction, LoginAction, LoginPageModelState } from '@/models/loginPage';
import { connect, Dispatch } from 'dva';
import { ConnectState } from '@/models/connect';
import { FUtil } from '@freelog/tools-lib';
import useUrlState from '@ahooksjs/use-url-state';
import { Space } from 'antd';
import { history } from 'umi';
import loginCover from '@/assets/loginCover.png';

interface LoginProps {
  dispatch: Dispatch;

  loginPage: LoginPageModelState;
}

function Login({ dispatch, loginPage }: LoginProps) {

  const [urlParams] = useUrlState<{ goTo: string }>();
  const boxRef = React.useRef(null);

  async function onChange(payload: Partial<LoginPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'loginPage/change',
      payload,
    });
  }

  const submitBtnDisabled: boolean = loginPage.btnState !== 'normal' || loginPage.btnState !== 'normal' || !loginPage.username || !!loginPage.usernameError || !loginPage.password || !!loginPage.passwordError;

  return (<div className={styles.style}>
    <div className={styles.cover}>
      <img src={loginCover} alt='cover' />
    </div>
    <div className={styles.action}>
      <div className={styles.container}>
        {/*<i className={['freelog', 'fl-icon-logo-freelog', styles.logo].join(' ')} />*/}
        <FTitleText type='h1' text={'登录freelog'} />
        <div style={{ height: 124 }} />
        <div className={styles.box} ref={boxRef}>
          <FTitleText type='h4' text={'用户名/手机号/邮箱'} />
          <div style={{ height: 5 }} />
          <FInput
            name='username'
            value={loginPage.username}
            // errorText={}
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
          {
            loginPage.usernameError && (<div className={styles.errorTip}>{loginPage.usernameError}</div>)
          }

          <div style={{ height: 20 }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FTitleText type='h4' text={'密码'} />
            <FTextBtn
              style={{ fontSize: 12 }}
              type='primary'
              onClick={() => {
                history.replace(FUtil.LinkTo.retrieveUserPassword(urlParams.goTo ? {
                  goTo: decodeURIComponent(urlParams.goTo),
                } : {}));
              }}
            >忘记密码？</FTextBtn>
          </div>
          <div style={{ height: 5 }} />
          <FInput
            // ref={passwordInput}
            name='password'
            value={loginPage.password}
            // errorText={loginPage.passwordError}
            className={styles.Input}
            wrapClassName={styles.Input}
            type='password'
            onChange={(e) => {
              const value: string = e.target.value;
              onChange({
                password: value,
                passwordError: !value ? '密码不能为空' : '',
              });
              // console.log('1111111');
            }}
            onPressEnter={(e) => {
              // @ts-ignore
              e.target.blur();
              if (!submitBtnDisabled) {
                setTimeout(() => {
                  dispatch<LoginAction>({
                    type: 'loginPage/login',
                    payload: urlParams.goTo || '',
                  });
                }, 30);
              }
            }}
          />
          {loginPage.passwordError && (<div>{loginPage.passwordError}</div>)}

          <div style={{ height: 40 }} />
          <FRectBtn
            className={styles.btn}
            disabled={submitBtnDisabled}
            onClick={() => {
              dispatch<LoginAction>({
                type: 'loginPage/login',
                payload: urlParams.goTo || '',
              });
            }}
          >{loginPage.btnState === 'verify' ? '正在登录' : '登 录'}</FRectBtn>
        </div>

        <div style={{ height: 128 }} />

        <Space size={10}>
          <FContentText
            text={'freelog新用户？'}
            type='normal'
          />
          <FTextBtn
            type='primary'
            onClick={() => {
              history.replace(FUtil.LinkTo.logon(urlParams.goTo ? {
                goTo: decodeURIComponent(urlParams.goTo),
              } : {}));
            }}
          >立即注册</FTextBtn>
        </Space>
        <div style={{ height: 10 }} />
      </div>
    </div>

  </div>);
}

export default connect(({ loginPage }: ConnectState) => ({
  loginPage,
}))(Login);
