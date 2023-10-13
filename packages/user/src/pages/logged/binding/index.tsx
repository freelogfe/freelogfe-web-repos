import * as React from 'react';
import styles from './index.less';
import FInput from '@/components/FInput';
import FComponentsLib from '@freelog/components-lib';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';
import { getUrlOfBindingWechat } from '@/utils';
import FPasswordInput from '@/components/FPasswordInput';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Dispatch } from 'redux';
import * as AHooks from 'ahooks';
import { FetchInfoAction } from '@/models/user';

interface BindingProps {
  dispatch: Dispatch;
}

function Binding({dispatch}: BindingProps) {

  const [password, set_password] = React.useState<string>('');

  AHooks.useMount(() => {
    dispatch<FetchInfoAction>({
      type: 'user/fetchInfo',
    });
  });

  async function verify() {
    const params: Parameters<typeof FServiceAPI.User.verifyLoginPassword>[0] = {
      password: password,
    };
    const { data } = await FServiceAPI.User.verifyLoginPassword(params);
    // data: {userId: 50028, isVerifySuccessful: false}
    if (!data?.isVerifySuccessful) {
      return fMessage('密码输入错误', 'error');
    }

    self.location.replace(getUrlOfBindingWechat({
      returnUrl: FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.resultBindingSuccess(),
      state: data.state,
    }));
  }

  return (<div>
    <div className={styles.ModalContainer}>
      <FComponentsLib.FTitleText text={'验证登陆密码'} type={'h2'} />
      <div style={{ height: 30 }} />
      <div className={styles.userPassword}>
        <FComponentsLib.FTipText type='third' text={'用户登录密码'} />
        <FComponentsLib.FTextBtn
          style={{ fontSize: 12 }}
          type='primary'
          onClick={() => {
            self.open(FUtil.LinkTo.retrieveUserPassword());
          }}
        >
          忘记登录密码？
        </FComponentsLib.FTextBtn>
      </div>

      <div style={{ height: 5 }} />
      <FPasswordInput
        value={password}
        onChange={(e) => {
          set_password(e.target.value);
        }}
        // type='password'
        placeholder='请输入登录密码'
        className={styles.modalBlockInput}
        // wrapClassName={styles.modalBlockInput}
      />
      <div style={{ height: 80 }} />
      <div className={styles.modalFooter}>
        <FComponentsLib.FRectBtn
          disabled={password === ''}
          type='primary'
          onClick={() => {
            verify();
          }}
        >
          下一步
        </FComponentsLib.FRectBtn>
      </div>
      <div style={{ height: 5 }} />
    </div>
  </div>);
}

export default connect(({}: ConnectState) => ({}))(Binding);
