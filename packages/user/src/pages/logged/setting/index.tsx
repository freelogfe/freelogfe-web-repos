import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import { Space } from 'antd';
import { connect } from 'dva';
import { ConnectState, UserModelState } from '@/models/connect';
import Profile from './Profile';
import Security from './Security';
import Privacy from './Privacy';

interface SettingProps {
  user: UserModelState;
}

function Setting({ user }: SettingProps) {


  return (<div className={styles.styles}>
    <div className={styles.header}>
      <a className={styles.active}>个人资料</a>
      <div style={{ width: 30 }} />
      <a>账号安全</a>
      <div style={{ width: 30 }} />
      <a>隐私</a>
    </div>
    <div className={styles.content}>
      <Profile />

      {/*<Security />*/}

      {/*<Privacy />*/}
    </div>
  </div>);
}

export default connect(({ user }: ConnectState) => ({
  user,
}))(Setting);
