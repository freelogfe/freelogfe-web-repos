import * as React from "react";
import styles from "./index.less";
import {FContentText, FTipText, FTitleText} from "@/components/FText";
import FInput from "@/components/FInput";
import {FRectBtn, FTextBtn} from "@/components/FButton";
import {Radio, Space} from "antd";
import {connect, Dispatch} from "dva";
import {ConnectState, LogonPageModelState} from "@/models/connect";
import {FUtil} from "@freelog/tools-lib";
import {ActiveAccountAction} from "@/models/walletPage";
import {ChangeAction} from "@/models/logonPage";

interface LogonProps {
  dispatch: Dispatch;
  logonPage: LogonPageModelState;
}

function Logon({dispatch, logonPage}: LogonProps) {

  async function onChange(payload: Partial<LogonPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'logonPage/change',
      payload,
    });
  }

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
                // value={walletPage.activatingAccountPasswordTwo}
                // errorText={walletPage.activatingAccountPasswordTwoError}
                // onChange={(e) => {
                //   const value = e.target.value;
                //   onChange({
                //     activatingAccountPasswordTwo: value,
                //     activatingAccountPasswordTwoError: value === walletPage.activatingAccountPasswordOne ? '' : '两次密码必须一致',
                //   });
                // }}
              />
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
                    // value={walletPage.activatingAccountPasswordTwo}
                    // errorText={walletPage.activatingAccountPasswordTwoError}
                    // onChange={(e) => {
                    //   const value = e.target.value;
                    //   onChange({
                    //     activatingAccountPasswordTwo: value,
                    //     activatingAccountPasswordTwoError: value === walletPage.activatingAccountPasswordOne ? '' : '两次密码必须一致',
                    //   });
                    // }}
                  />
                </div>)
                : (<div>
                  <FTipText type="third" text={'手机号'}/>
                  <div style={{height: 5}}/>
                  <FInput
                    placeholder={'请输入11位手机号'}
                    className={styles.blockInput}
                    wrapClassName={styles.blockInput}
                    size="middle"
                    // value={walletPage.activatingAccountPasswordTwo}
                    // errorText={walletPage.activatingAccountPasswordTwoError}
                    // onChange={(e) => {
                    //   const value = e.target.value;
                    //   onChange({
                    //     activatingAccountPasswordTwo: value,
                    //     activatingAccountPasswordTwoError: value === walletPage.activatingAccountPasswordOne ? '' : '两次密码必须一致',
                    //   });
                    // }}
                  />
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
                />
                <FRectBtn
                  style={{width: 110}}
                  type="primary"
                >获取验证码</FRectBtn>
              </Space>
            </div>

            <div>
              <FTipText type="third" text={'密码'}/>
              <div style={{height: 5}}/>
              <FInput
                placeholder={'密码必须包含数字和字母；且由6-24个字符组成'}
                className={styles.blockInput}
                wrapClassName={styles.blockInput}
                size="middle"
                // value={logonPage.activatingAccountPasswordOne}
                // errorText={walletPage.activatingAccountPasswordOneError}
                onChange={(e) => {
                  const value = e.target.value;
                  // onChange({
                  //   activatingAccountPasswordOne: value,
                  //   activatingAccountPasswordOneError: FUtil.Regexp.PAY_PASSWORD.test(value) ? '' : '必须为6为数字',
                  //   activatingAccountPasswordTwoError: (walletPage.activatingAccountPasswordTwo && value !== walletPage.activatingAccountPasswordTwo) ? '两次密码必须一致' : '',
                  // });
                }}
              />
            </div>

            {/*<div>*/}
            {/*  <FTipText type="third" text={'验证支付密码'}/>*/}
            {/*  <div style={{height: 5}}/>*/}
            {/*  <FInput*/}
            {/*    className={styles.blockInput}*/}
            {/*    wrapClassName={styles.blockInput}*/}
            {/*    size="middle"*/}
            {/*    // value={walletPage.activatingAccountPasswordTwo}*/}
            {/*    // errorText={walletPage.activatingAccountPasswordTwoError}*/}
            {/*    // onChange={(e) => {*/}
            {/*    //   const value = e.target.value;*/}
            {/*    //   onChange({*/}
            {/*    //     activatingAccountPasswordTwo: value,*/}
            {/*    //     activatingAccountPasswordTwoError: value === walletPage.activatingAccountPasswordOne ? '' : '两次密码必须一致',*/}
            {/*    //   });*/}
            {/*    // }}*/}
            {/*  />*/}
            {/*</div>*/}
          </Space>
          <div style={{height: 40}}/>
          <FRectBtn
            className={styles.btn}
            type="primary"
            // disabled={!walletPage.activatingAccountPasswordOne
            // || !walletPage.activatingAccountPasswordTwo
            // || !!walletPage.activatingAccountPasswordOneError
            // || !!walletPage.activatingAccountPasswordTwoError}
            onClick={() => {
              dispatch<ActiveAccountAction>({
                type: 'walletPage/activeAccount',
              });
            }}
          >注册</FRectBtn>
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
            window.location.replace('http://www.testfreelog.com/signup');
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
