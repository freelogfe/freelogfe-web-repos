import * as React from 'react';
import styles from './index.less';
import FInput from '@/components/FInput';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import useUrlState from '@ahooksjs/use-url-state';
import { Space } from 'antd';
import { history } from 'umi';
import * as AHooks from 'ahooks';
import fMessage from '@/components/fMessage';
import FComponentsLib from '@freelog/components-lib';
import FPasswordInput from '@/components/FPasswordInput';

function Bind() {
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
  AHooks.useMount(() => {
  });

  AHooks.useUnmount(() => {
  });
  const loginNameChange = async (val: string) => {
    let loginNameError: string = '';

    if (val === '') {
      loginNameError = '用户名称不能为空';
    } else if (val.length > 30) {
      // loginNameError = '不能超过30字符';
      loginNameError = FI18n.i18nNext.t('signup_alarm_username_length');
    } else if (!FUtil.Regexp.USERNAME.test(val)) {
      loginNameError =
        '用户名只能使用小写字母、数字或短横线（-）；必须以小写字母或数字开头和结尾';
    } else if (FUtil.Regexp.MOBILE_PHONE_NUMBER.test(val)) {
      loginNameError = '用户名不能是手机号';
    }

    if (!loginNameError) {
      const params: Parameters<typeof FServiceAPI.User.thirdPartyIsBind>[0] = {
        username: val,
        thirdPartyType: 'weChat',
      };
      // const { data } = await FServiceAPI.User.thirdPartyIsBind(params);
      // console.log(data);
      // if (data.data) {
      //   loginNameError = '用户名已被占用';
      // }
      const { data } = await FServiceAPI.User.userDetails({
        username: val,
      });
      if (data) {
        // loginNameError = '用户名已被占用';
        loginNameError = FI18n.i18nNext.t('signup_alarm_username_in_use');
      }
    }
    setBindData({
      ...bindData,
      loginName: val,
      loginNameError,
    });
  };
  const passwordChange = (val: string) => {
    let passwordError: string = '';
    if (!val) {
      passwordError = '密码不能为空';
    } else if (val.length < 6 || val.length > 24) {
      passwordError = FI18n.i18nNext.t('password_length');
    } else if (!FUtil.Regexp.PASSWORD.test(val)) {
      passwordError = FI18n.i18nNext.t('password_include');
    }
    setBindData({
      ...bindData,
      password: val,
      passwordError,
    });
  };

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
      <div className='flex-row w-100x flex-1 x-auto'>
        <div
          className={styles.container + ' flex-1 flex-column-center shrink-0'}
        >
          {/*<i className={['freelog', 'fl-icon-logo-freelog', styles.logo].join(' ')} />*/}
          <div className='flex-column align-center flex-1'>
            <div className='flex-3' />
            <div className='shrink-0 flex-column-center'>
              <FComponentsLib.FTitleText
                type='h1'
                text={'当前微信账户未绑定freelog'}
              />
              <div className={styles.title2 + ' mt-30'}>
                为了您的账户安全，请完成用户名和密码的设置
              </div>
            </div>
            <div className='flex-2' />
          </div>
          <div className=' flex-column-center shrink-0'>
            <div className={styles.box} ref={boxRef}>
              <div className='flex-row align-center'>
                <span className={styles.dot + ' mr-4'} />
                <FComponentsLib.FTitleText type='h4' text={'用户名'} />
              </div>
              <div style={{ height: 5 }} />
              <FInput
                name='loginName'
                value={bindData.loginName}
                // errorText={}
                className={styles.Input}
                wrapClassName={styles.Input}
                onChange={(e) => {
                  loginNameChange(e.target.value);
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
                <div className='flex-row align-center'>
                  <span className={styles.dot + ' mr-4'} />
                  <FComponentsLib.FTitleText type='h4' text={'密码'} />
                </div>
              </div>
              <div style={{ height: 5 }} />
              <FPasswordInput
                // ref={passwordInput}
                name='password'
                value={bindData.password}
                // errorText={bindData.passwordError}
                className={styles.Input}
                // wrapClassName={styles.Input}
                // type='password'
                onChange={(e) => {
                  passwordChange(e.target.value);
                }}
                onPressEnter={(e) => {
                  // @ts-ignore
                  e.target.blur();
                }}
              />
              {bindData.passwordError && (
                <div className={styles.errorTip}>{bindData.passwordError}</div>
              )}

              <div style={{ height: 40 }} />
              <FComponentsLib.FRectBtn
                className={styles.btn}
                disabled={
                  !bindData.password ||
                  !bindData.loginName ||
                  bindData.loading ||
                  !!bindData.passwordError ||
                  !!bindData.loginNameError
                }
                onClick={submit}
              >
                {bindData.loading ? '完成设置并登录' : '完成设置并登录'}
              </FComponentsLib.FRectBtn>
            </div>
          </div>
          <div className='flex-1 flex-column'>
            <Space size={10}>
              <FComponentsLib.FContentText
                className='mt-95'
                text={'已有帐户？'}
                type='normal'
              />
              <FComponentsLib.FTextBtn
                type='primary'
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

export default Bind;
