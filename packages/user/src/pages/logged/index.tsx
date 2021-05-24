import * as React from "react";
import styles from './index.less';
import FBaseLayout from "@/layouts/FBaseLayout";
import {FContentText, FTitleText} from '@/components/FText';
import FLink from "@/components/FLink";

interface LoggedProps {
  children: React.ReactNode;
}

function FLogged({children}: LoggedProps) {
  return (<FBaseLayout>
    <div className={styles.container}>
      <div className={styles.sider}>
        <div style={{height: 35}}/>
        <div className={styles.userInfo}>
          <img
            alt=""
            src={'https://image.freelog.com/headImage/50028'}
            className={styles.img}
          />
          <div style={{height: 20}}/>
          <FTitleText type="h3" text={'YANGHONGTIAN'}/>
          <div style={{height: 10}}/>
          <FContentText type="highlight" text={'13145959706'}/>
          <div style={{height: 35}}/>
          <FLink to={'/logged/wallet'} className={styles.FLink}>
            钱包
          </FLink>
          <FLink to={'/logged/contract'} className={styles.FLink}>
            合约管理
          </FLink>
          <FLink to={'/logged/setting'} className={[styles.FLink, styles.FLinkActive].join(' ')}>
            设置
          </FLink>
        </div>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  </FBaseLayout>);
}

export default FLogged;
