import * as React from 'react';
import styles from './index.less';
import FForbid from '@/components/FIcons/FForbid';
import { FContentText, FTitleText } from '@/components/FText';
import { FTextBtn } from '@/components/FButton';
import * as AHooks from 'ahooks';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { history } from '@@/core/history';
import userPermission from '@/permissions/UserPermission';

interface FreezeProps {

}

interface FreezeStates {
  userName: string;
  freezeReason: string;
}

function Freeze({}: FreezeProps) {
  // console.log('Freeze   Freeze #####398ioasdjflskdfjlkj');

  const [userName, set_userName] = React.useState<FreezeStates['userName']>('');
  const [freezeReason, set_freezeReason] = React.useState<FreezeStates['freezeReason']>('');

  AHooks.useMount(() => {
    handleData();
  });

  AHooks.useUnmount(() => {

  });

  async function handleData() {

    const data = await userPermission.getUserInfo()

    // const { data } = await FServiceAPI.User.currentUserInfo();
    // console.log(data, 'DDDDDDDDDfo9iwekjlskdfjsdlkj');

    // if (data.)

    set_userName(data.username);
    set_freezeReason(data.userDetail.reason || '其他违法违规');
  }

  return (<div className={styles.container}>
    <FForbid className={styles.FForbid} />
    <div style={{ height: 30 }} />
    <FTitleText text={'你的账号已经被冻结'} type='h1' />
    <div style={{ height: 80 }} />
    <div className={styles.content}>
      <FContentText text={`经核实，你的账号 ${userName} ，严重违反平台规范 `} />
      <FTextBtn onClick={() => {

      }}>&nbsp;查看服务协议&nbsp;</FTextBtn>
      <FContentText text={` ，涉嫌 ${freezeReason} ，已经被冻结。`} />
    </div>
    <div style={{ height: 20 }} />
    <div className={styles.content}>
      <FContentText text={'如果你对此存在异议，可向Freelog提交相关证明材料进行申诉。'} />
    </div>
    <div style={{ height: 20 }} />
    <div className={styles.content}>
      <FContentText text={'联系邮箱：service@freelog.com'} />
      <FTextBtn onClick={() => {

      }}>&nbsp;复制&nbsp;</FTextBtn>
    </div>
    <div style={{ height: 80 }} />
    <FTextBtn onClick={async () => {
      await FServiceAPI.User.logout();
      history.replace(FUtil.LinkTo.login());
    }}>返回登录页</FTextBtn>
  </div>);
}

export default Freeze;
