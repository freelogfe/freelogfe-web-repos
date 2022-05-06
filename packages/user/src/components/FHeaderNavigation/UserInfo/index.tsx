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
  data: {
    info: {
      avatar: string;
      userName: string;
      email: string;
      phone: string;
    };
    menu: {
      text: string;
      onClick(): void;
    }[];
  } | null;
}

function UserInfo({ data }: UserInfoProps) {

  if (!data) {
    return (<Space size={10}>
      <FRectBtn
        type='default'
        size='small'
        onClick={() => {
          window.location.href = FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.login({
            goTo: window.location.href,
          });
        }}
      >登录</FRectBtn>
      <FRectBtn
        type='primary'
        size='small'
        onClick={() => {
          window.location.href = FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.logon();
        }}
      >注册</FRectBtn>
    </Space>);
  }

  const { info, menu } = data;

  return (<FDropdown overlay={<div className={styles.userPanel}>
    <div className={styles.userPanelHeader}>
      <img src={info.avatar || UserSVG} alt='headImage' />
      <div style={{ height: 10 }} />
      <FContentText
        type='highlight'
        text={info.userName}
      />
      <div style={{ height: 8 }} />
      <FContentText text={info.phone || info.email} />
    </div>
    <div className={styles.userPanelMenu}>
      {
        menu.map((m) => {
          return (<a
            key={m.text}
            onClick={(e) => {
              e.preventDefault();
              m.onClick();
            }}
          >{m.text}</a>);
        })
      }
    </div>
  </div>}>
    <a className={styles.avatar}>
      <img
        src={info.avatar || UserSVG}
        alt={'avatar'}
      />
    </a>
  </FDropdown>);
}

export default UserInfo;
