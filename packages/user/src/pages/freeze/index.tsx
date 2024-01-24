import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import { history } from '@@/core/history';
import userPermission from '@/permissions/UserPermission';
import FComponentsLib from '@freelog/components-lib';

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

    const data = await userPermission.getUserInfo();

    const check = await userPermission.check();

    if (check === 'SUCCESS') {
      window.location.replace(FUtil.LinkTo.wallet());
      return;
    }

    set_userName(data?.username || '');
    set_freezeReason(data?.userDetail.reason || '其他违法违规');
  }

  return (<div className={styles.container}>
    <FComponentsLib.FIcons.FForbid className={styles.FForbid} />
    <div style={{ height: 30 }} />
    {FI18n.i18nNext.tJSXElement('alert_resourceblocked02', {
      UserName: userName,
      DisableDetails: freezeReason,
    })}
    {/*<FComponentsLib.FTitleText text={'你的账号已经被冻结'} type='h1' />*/}
    {/*<div style={{ height: 80 }} />*/}
    {/*<div className={styles.content}>*/}
    {/*  <FComponentsLib.FContentText text={`经核实，你的账号 ${userName} ，严重违反平台规范 `} />*/}
    {/*  <FComponentsLib.FTextBtn*/}
    {/*    onClick={() => {*/}
    {/*      window.open('https://freelog2.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62cce8f2456ff0002e328eb2');*/}
    {/*    }}*/}
    {/*  >&nbsp;查看服务协议&nbsp;</FComponentsLib.FTextBtn>*/}
    {/*  <FComponentsLib.FContentText text={` ，涉嫌 ${freezeReason} ，已经被冻结。`} />*/}
    {/*</div>*/}
    {/*<div style={{ height: 20 }} />*/}
    {/*<div className={styles.content}>*/}
    {/*  <FComponentsLib.FContentText text={'如果你对此存在异议，可向Freelog提交相关证明材料进行申诉。'} />*/}
    {/*</div>*/}
    {/*<div style={{ height: 20 }} />*/}
    {/*<div className={styles.content}>*/}
    {/*  <FComponentsLib.FContentText text={'联系邮箱：service@freelog.com'} />*/}
    {/*  <FComponentsLib.FCopyToClipboard*/}
    {/*    text={'service@freelog.com'}*/}
    {/*    title={'复制'}*/}
    {/*  >*/}
    {/*  <FComponentsLib.FTextBtn>&nbsp;复制&nbsp;</FComponentsLib.FTextBtn>*/}
    {/*  </FComponentsLib.FCopyToClipboard>*/}
    {/*</div>*/}
    <div style={{ height: 80 }} />
    <FComponentsLib.FTextBtn onClick={async () => {
      await FServiceAPI.User.logout();
      history.replace(FUtil.LinkTo.login());
    }}>返回登录页</FComponentsLib.FTextBtn>
  </div>);
}

export default Freeze;
