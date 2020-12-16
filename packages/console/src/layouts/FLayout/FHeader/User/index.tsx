import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from "@/components/FText";
import FDropdown from "@/components/FDropdown";
import {connect, Dispatch} from 'dva';
import {UserModelState} from "@/models/user";
import {ConnectState} from "@/models/connect";

interface UserProps {
  dispatch: Dispatch;

  user: UserModelState;
}

function User({dispatch, user}: UserProps) {
  return (<FDropdown overlay={<div className={styles.userPanel}>
    <div className={styles.userPanelHeader}>
      <img src={user.info?.headImage} alt="headImage"/>
      <div style={{height: 10}}/>
      <FTitleText type="h4" text={user.info?.username}/>
      <div style={{height: 8}}/>
      <FContentText text={user.info?.mobile || user.info?.email}/>
    </div>
    <div className={styles.userPanelMenu}>
      <a onClick={() => {
        let origin = 'http://${}.testfreelog.com';
        if (window.location.origin.includes('.freelog.com')) {
          origin = 'https://${}.freelog.com';
        }
        return window.location.replace(`${origin.replace('${}', 'www')}/login?redirect=${encodeURIComponent(window.location.href)}`);
      }}>个人中心</a>
      <a>登出</a>
    </div>
  </div>}>
    <a className={styles.avatar}>
      <img src={user.info?.headImage} alt={'avatar'}/>
    </a>
  </FDropdown>);
}

export default connect(({user}: ConnectState) => ({
  user,
}))(User);
