import * as React from "react";
import styles from './index.less';
import FBaseLayout from "@/layouts/FBaseLayout";
import {FContentText, FTitleText} from '@/components/FText';
import FLink from "@/components/FLink";
import * as AHooks from 'ahooks';
import {connect, Dispatch} from 'dva';
import {ConnectState, LoggedSiderModelState} from "@/models/connect";
import {FetchInfoAction} from '@/models/loggedSider';

interface LoggedProps {
  dispatch: Dispatch;
  loggedSider: LoggedSiderModelState;

  children: React.ReactNode;
}

function FLogged({dispatch, loggedSider, children}: LoggedProps) {

  AHooks.useMount(() => {
    dispatch<FetchInfoAction>({
      type: 'loggedSider/fetchInfo',
    });
  });

  return (<FBaseLayout>
    <div className={styles.container}>
      <div className={styles.sider}>
        <div style={{height: 35}}/>
        <div className={styles.userInfo}>
          <img
            alt=""
            src={loggedSider.userInfo?.headImage || ''}
            className={styles.img}
          />
          <div style={{height: 20}}/>
          <FTitleText type="h3" text={loggedSider.userInfo?.username || ''}/>
          <div style={{height: 10}}/>
          <FContentText type="highlight" text={loggedSider.userInfo?.mobile || loggedSider.userInfo?.email || ''}/>
          <div style={{height: 35}}/>
          <FLink to={'/logged/wallet'} className={[styles.FLink, styles.FLinkActive].join(' ')}>
            钱包
          </FLink>
          {/*<FLink to={'/logged/contract'} className={[styles.FLink].join(' ')}>*/}
          {/*  合约管理*/}
          {/*</FLink>*/}
          {/*<FLink to={'/logged/setting'} className={[styles.FLink].join(' ')}>*/}
          {/*  设置*/}
          {/*</FLink>*/}
        </div>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  </FBaseLayout>);
}

export default connect(({loggedSider}: ConnectState) => ({
  loggedSider,
}))(FLogged);
