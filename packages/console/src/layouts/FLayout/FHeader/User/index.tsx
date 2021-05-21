import * as React from 'react';
import styles from './index.less';
import {FContentText} from "@/components/FText";
import FDropdown from "@/components/FDropdown";
import {connect, Dispatch} from 'dva';
import {UserModelState} from "@/models/user";
import {ConnectState} from "@/models/connect";
import FUtil from "@/utils";

interface UserProps {
  dispatch: Dispatch;
  user: UserModelState;
}

function User({dispatch, user}: UserProps) {
  return (<FDropdown overlay={<div className={styles.userPanel}>
    <div className={styles.userPanelHeader}>
      <img src={user.info?.headImage} alt="headImage"/>
      <div style={{height: 10}}/>
      <FContentText
        type="highlight"
        text={user.info?.username}
      />
      <div style={{height: 8}}/>
      <FContentText text={user.info?.mobile || user.info?.email}/>
    </div>
    <div className={styles.userPanelMenu}>
      <a onClick={() => {
        window.location.href = `${FUtil.Format.completeUrlByDomain('www')}/user/profile`;
      }}>个人中心</a>
      <a onClick={() => {
        window.location.href = `${FUtil.Format.completeUrlByDomain('www')}/login`;
      }}>登出</a>
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
