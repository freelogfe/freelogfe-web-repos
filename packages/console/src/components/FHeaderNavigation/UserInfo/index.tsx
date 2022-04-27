import * as React from 'react';
import styles from './index.less';
import { FContentText } from '@/components/FText';
import FDropdown from '@/components/FDropdown';
import { connect, Dispatch } from 'dva';
import { FetchUserInfoAction, UserModelState } from '@/models/user';
import { ConnectState } from '@/models/connect';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import UserSVG from '@/assets/user.svg';
import * as AHooks from 'ahooks';
import { FRectBtn } from '@/components/FButton';
import { Space } from 'antd';

interface UserInfoProps {
  info: {
    avatar: string;
    userName: string;
    email: string;
    phone: string;
  } | null;
}

function UserInfo({info}: UserInfoProps) {

  if (!info) {
    return (<Space size={10}>
      <FRectBtn type='default' size='small'>登录</FRectBtn>
      <FRectBtn type='primary' size='small'>注册</FRectBtn>
    </Space>);
  }

  return (<FDropdown overlay={<div className={styles.userPanel}>
    <div className={styles.userPanelHeader}>
      <img src={(UserSVG) as string} alt='headImage' />
      <div style={{ height: 10 }} />
      <FContentText
        type='highlight'
        text={'Liu'}
      />
      <div style={{ height: 8 }} />
      <FContentText text={'13333333333'} />
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
      }}>登出</a>
    </div>
  </div>}>
    <a className={styles.avatar}>
      <img
        src={(UserSVG) as string}
        alt={'avatar'}
      />
    </a>
  </FDropdown>);
}

export default UserInfo;
