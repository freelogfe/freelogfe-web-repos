import * as React from "react";
import styles from './index.less';
import FLayout from "@/components/FLayout";
import {NavLink} from "umi";
import FDropdown from '@/components/FDropdown';
import {FContentText} from '@/components/FText';

interface FBaseLayoutProps {
  children: React.ReactNode;
}

function FBaseLayout({children}: FBaseLayoutProps) {
  return (<FLayout
    headerLeft={
      <NavLink
        to={'/'}
        className={['freelog', 'fl-icon-logo-freelog', styles.logo].join(' ')}
      />
    }
    headerRight={<FDropdown overlay={<div className={styles.userPanel}>
      <div className={styles.userPanelHeader}>
        <img src={'https://image.freelog.com/headImage/50028'} alt="headImage"/>
        <div style={{height: 10}}/>
        <FContentText
          type="highlight"
          text={'myName'}
        />
        <div style={{height: 8}}/>
        <FContentText
          text={'1025887998@qq.com'}
        />
      </div>
      <div className={styles.userPanelMenu}>
        <a onClick={() => {
          // window.location.href = `${FUtil.Format.completeUrlByDomain('www')}/user/profile`;
        }}>个人中心</a>
        <a onClick={() => {
          // window.location.href = `${FUtil.Format.completeUrlByDomain('www')}/login`;
        }}>登出</a>
      </div>
    </div>}>
      <a className={styles.avatar}>
        <img src={'https://image.freelog.com/headImage/50028'} alt={'avatar'}/>
      </a>
    </FDropdown>}
  >{children}
  </FLayout>)
}

export default FBaseLayout;
