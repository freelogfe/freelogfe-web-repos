import * as React from 'react';
import styles from './index.less';
import {FContentText} from "@/components/FText";
import FDropdown from "@/components/FDropdown";
import {connect, Dispatch} from 'dva';
import {FetchUserInfoAction, UserModelState} from "@/models/user";
import {ConnectState} from "@/models/connect";
import {FServiceAPI, FUtil} from '@freelog/tools-lib';
import UserSVG from '@/assets/user.svg';
import * as AHooks from 'ahooks';

interface UserProps {
  dispatch: Dispatch;
  user: UserModelState;
}

function User({dispatch, user}: UserProps) {

  AHooks.useMount(() => {
  // console.log('!@#$!@#$@#$@#$@#!423444333423423423');
    dispatch<FetchUserInfoAction>({
      type: 'user/fetchUserInfo',
    });
  });

  return (<FDropdown overlay={<div className={styles.userPanel}>
    <div className={styles.userPanelHeader}>
      <img src={(user.info?.headImage || UserSVG) as string} alt="headImage"/>
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
        window.open(`${FUtil.Format.completeUrlByDomain('user')}/logged/wallet`);
      }}>个人中心</a>
      <a onClick={async () => {
        // window.location.href = `${FUtil.Format.completeUrlByDomain('www')}/login`;
        await FServiceAPI.User.logout({});

        setTimeout(() => {
          window.location.replace(`${FUtil.Format.completeUrlByDomain('user')}${FUtil.LinkTo.login()}`);
        }, 30);
        // router.replace(FUtil.LinkTo.login());
      }}>登出</a>
    </div>
  </div>}>
    <a className={styles.avatar}>
      <img
        src={(user.info?.headImage || UserSVG) as string}
        alt={'avatar'}
      />
    </a>
  </FDropdown>);
}

export default connect(({user}: ConnectState) => ({
  user,
}))(User);
