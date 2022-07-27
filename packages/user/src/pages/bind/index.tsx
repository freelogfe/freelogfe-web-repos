import * as React from 'react';
import styles from './index.less';
import FInput from '@/components/FInput';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import useUrlState from '@ahooksjs/use-url-state';
import { Space } from 'antd';
import { history } from 'umi';
import * as AHooks from 'ahooks';
import fMessage from '@/components/fMessage';
import FComponentsLib from '@freelog/components-lib';

function Login() {
  const [urlParams] = useUrlState<{
    goTo: string;
    identityId: string;
    returnUrl: string;
  }>();
  const boxRef = React.useRef(null);
  const [bindData, setBindData] = React.useState({
    loginName: '',
    loginNameError: '',
    password: '',
    passwordError: '',
    loading: false,
  });
  AHooks.useMount(() => {});

  AHooks.useUnmount(() => {});

  async function submit() {
    const data = await FServiceAPI.User.registerOrBind({
      identityId: urlParams.identityId,
      loginName: bindData.loginName,
      password: bindData.password,
    });
    fMessage(data.msg, 'error');
    if (data.errCode === 0) {
      location.replace(urlParams.returnUrl);
    }
  }

  return (
    <div className={styles.style + ' w-100x h-100x flex-column over-h'}>
      <div className="flex-row w-100x flex-1 x-auto">
        <div
          className={styles.container + ' flex-1 flex-column-center shrink-0'}
        >
          {/*<i className={['freelog', 'fl-icon-logo-freelog', styles.logo].join(' ')} />*/}
          <div className="flex-column align-center flex-1">
            <div className="flex-3"></div>
            <div className="shrink-0 flex-column-center">
              <FComponentsLib.FTitleText type="h1" text={'当前微信账户未绑定freelog'} />
              <div className={styles.title2 + ' mt-30'}>
                为了您的账户安全，请完成用户名和密码的设置
              </div>
            </div>
            <div className="flex-2"></div>
          </div>
          <div className=" flex-column-center shrink-0">
            <div className={styles.box} ref={boxRef}>
              <div className="flex-row align-center">
                <span className={styles.dot + ' mr-4'}></span>
                <FComponentsLib.FTitleText type="h4" text={'用户名'} />
              </div>
              <div style={{ height: 5 }} />
              <FInput
                name="loginName"
                value={bindData.loginName}
                // errorText={}
                className={styles.Input}
                wrapClassName={styles.Input}
                onChange={(e) => {
                  const loginName: string = e.target.value;
                  setBindData({
                    ...bindData,
                    loginName,
                    loginNameError: loginName ? '' : '不能为空',
                  });
                }}
              />
              {bindData.loginNameError && (
                <div className={styles.errorTip}>{bindData.loginNameError}</div>
              )}

              <div style={{ height: 20 }} />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div className="flex-row align-center">
                  <span className={styles.dot + ' mr-4'}></span>
                  <FComponentsLib.FTitleText type="h4" text={'密码'} />
                </div>
              </div>
              <div style={{ height: 5 }} />
              <FInput
                // ref={passwordInput}
                name="password"
                value={bindData.password}
                // errorText={bindData.passwordError}
                className={styles.Input}
                wrapClassName={styles.Input}
                type="password"
                onChange={(e) => {
                  const password: string = e.target.value;
                  setBindData({
                    ...bindData,
                    password,
                    passwordError: password ? '' : '不能为空',
                  });
                }}
                onPressEnter={(e) => {
                  // @ts-ignore
                  e.target.blur();
                }}
              />
              {bindData.passwordError && <div>{bindData.passwordError}</div>}

              <div style={{ height: 40 }} />
              <FComponentsLib.FRectBtn
                className={styles.btn}
                disabled={bindData.loading}
                onClick={submit}
              >
                {bindData.loading ? '完成设置并登录' : '完成设置并登录'}
              </FComponentsLib.FRectBtn>
            </div>
          </div>
          <div className="flex-1 flex-column">
            <Space size={10}>
              <FComponentsLib.FContentText
                className="mt-95"
                text={'已有帐户？'}
                type="normal"
              />
              <FComponentsLib.FTextBtn
                type="primary"
                className="mt-95"
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
                马上登录
              </FComponentsLib.FTextBtn>
            </Space>
          </div>
        </div>
      </div>
      {/*<FFooter />*/}
    </div>
  );
}

export default Login;
