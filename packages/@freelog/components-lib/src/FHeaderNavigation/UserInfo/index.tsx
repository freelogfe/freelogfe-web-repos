import * as React from 'react';
import styles from './index.less';
import { FUtil } from '@freelog/tools-lib';
import { Space } from 'antd';
import FComponentsLib from '../../';

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
      <FComponentsLib.FRectBtn
        type='default'
        size='small'
        onClick={() => {
          window.location.href = FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.login({
            goTo: window.location.href,
          });
        }}
      >登录</FComponentsLib.FRectBtn>
      <FComponentsLib.FRectBtn
        type='primary'
        size='small'
        onClick={() => {
          window.location.href = FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.logon({
            goTo: window.location.href,
          });
        }}
      >注册</FComponentsLib.FRectBtn>
    </Space>);
  }

  const { info, menu } = data;

  return (<FComponentsLib.FDropdown overlay={<div className={styles.userPanel}>
    <div className={styles.userPanelHeader}>
      {
        info.avatar
          // ? (<img src={info.avatar} alt='headImage' />)
          ? (<div
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundImage: `url(${info.avatar})`,
              width: 60,
              height: 60,
              borderRadius: '50%',
            }}
          />)
          : (<FComponentsLib.FIcons.FUser style={{fontSize: 36}} />)
      }

      <div style={{ height: 10 }} />
      <FComponentsLib.FContentText
        type='highlight'
        text={info.userName}
      />
      {/*<div style={{ height: 8 }} />*/}
      {/*<FComponentsLib.FContentText text={info.phone || info.email} />*/}
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
      {
        info.avatar
          // ? (<img src={info.avatar} alt='avatar' />)
          ? (<div
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundImage: `url(${info.avatar})`,
              width: 32,
              height: 32,
              borderRadius: '50%',
            }}
          />)
          : (<FComponentsLib.FIcons.FUser style={{fontSize: 18}} />)
      }
    </a>
  </FComponentsLib.FDropdown>);
}

export default UserInfo;
