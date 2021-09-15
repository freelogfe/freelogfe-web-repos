import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import { Space } from 'antd';
import { connect, Dispatch } from 'dva';
import { ConnectState, SettingPageModelState } from '@/models/connect';
import Profile from './Profile';
import Security from './Security';
import Privacy from './Privacy';

interface SettingProps {
  dispatch: Dispatch;
  settingPage: SettingPageModelState;
}

function Setting({ settingPage }: SettingProps) {
  console.log(settingPage, 'settingPagesettingPagesettingPage1111');

  return (<div className={styles.styles}>
    <div className={styles.header}>
      <a className={settingPage.showPage === 'profile' ? styles.active : ''}>个人资料</a>
      <div style={{ width: 30 }} />
      <a className={settingPage.showPage === 'security' ? styles.active : ''}>账号安全</a>
      <div style={{ width: 30 }} />
      <a className={settingPage.showPage === 'privacy' ? styles.active : ''}>隐私</a>
    </div>
    <div className={styles.content}>

      {
        settingPage.showPage === 'profile' && (<Profile />)
      }

      {
        settingPage.showPage === 'security' && (<Security />)
      }

      {
        settingPage.showPage === 'privacy' && (<Privacy />)
      }

    </div>
  </div>);
}

// export default connect(({ settingPage }: ConnectState) => ({
//   settingPage,
// }))(Setting);

export default connect(({ settingPage }: ConnectState) => ({
  settingPage,
}))(Setting);
