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

interface RetrieveProps {
  dispatch: Dispatch;

  retrievePage: RetrievePageModelState;
}

function Retrieve({ dispatch, retrievePage }: RetrieveProps) {

  const [urlParams] = useUrlState<{ goTo: string }>();

  return (<div className={styles.styles}>
    <div className={styles.container}>
      {
        retrievePage.showView === 'verify'
          ? (<>
            <FTitleText text={'忘记密码？'} type='h1' />
            <div style={{ height: 30 }} />
            <FTipText text={'请填写注册时使用的手机号/邮箱接收验证码，验证成功后可以重置您的密码'} type='second' />
            <div style={{ height: 100 }} />
            <div className={styles.verificationMode}>
              <div className={styles.verificationModeHeader}>
                <div className={styles.title}>
                  <i />
                  <div style={{ width: 5 }} />
                  <FTitleText type='h4' text={'验证方式'} />
                </div>
                <Space size={25}>
                  <Space size={5}>
                    <Radio
                      style={{ margin: 0 }}
                      value={retrievePage.verifyMode === 'phone'}
                    />
                    <FContentText text={'手机号'} type='additional2' />
                  </Space>
                  <Space>
                    <Radio
                      style={{ margin: 0 }}
                      value={retrievePage.verifyMode === 'email'}
                    />
                    <FContentText text={'邮箱'} type='additional2' />
                  </Space>
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
                  <FTitleText type='h4' text={'验证方式'} />
                </div>
              </div>
              <div style={{ height: 5 }} />
              <div className={styles.identifyingCodeBody}>
                <FInput
                  className={styles.identifyingCodeInput}
                  wrapClassName={styles.identifyingCodeInput}
                  placeholder='输入验证码'
                  value={retrievePage.verifyCode}
                />
                <FRectBtn
                  style={{ width: 110 }}
                  disabled={retrievePage.verifyCodeReSendWait > 0}
                >获取验证码</FRectBtn>
              </div>
              <div className={styles.errorTip}>请输入账号</div>
            </div>
            <div style={{ height: 40 }} />
            <FRectBtn style={{ width: 360 }}>下一步</FRectBtn>
          </>)
          : (<>
            <FTitleText text={'重置密码？'} type='h1' />
            <div style={{ height: 30 }} />
            <FTipText text={'现在可以重新设置您的密码，重置成功后可再次登录freelog'} type='second' />
            <div style={{ height: 100 }} />
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
                placeholder='密码必须包含数字和字母；且由6-24个字符组成'
                className={styles.input}
                wrapClassName={styles.input}
                value={retrievePage.newPasswordInput}
              />
              {
                retrievePage.newPasswordInput && (<div className={styles.errorTip}>{retrievePage.newPasswordInput}</div>)
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
                className={styles.input}
                wrapClassName={styles.input}
                placeholder='再次输入新密码'
                value={retrievePage.confirmPasswordInput}
              />
              {
                retrievePage.confirmPasswordInput && (
                  <div className={styles.errorTip}>{retrievePage.confirmPasswordInputError}</div>)
              }

            </div>
            <div style={{ height: 40 }} />
            <FRectBtn style={{ width: 360 }}>下一步</FRectBtn>
          </>)
      }

      <div style={{ height: 128 }} />
      <Space size={50}>
        <FTextBtn onClick={() => {
          // history.replace(FUtil.LinkTo.login());
          history.replace(FUtil.LinkTo.login(urlParams.goTo ? {
            goTo: decodeURIComponent(urlParams.goTo),
          } : {}));
        }}>返回登陆页</FTextBtn>
        <FTextBtn onClick={() => {
          history.replace(FUtil.LinkTo.logon(urlParams.goTo ? {
            goTo: decodeURIComponent(urlParams.goTo),
          } : {}));
          // history.replace(FUtil.LinkTo.logon());
        }}>注册新帐户</FTextBtn>
      </Space>
    </div>
    <div style={{ height: 20 }} />
  </div>);
}

export default connect(({ retrievePage }: ConnectState) => ({
  retrievePage,
}))(Retrieve);
