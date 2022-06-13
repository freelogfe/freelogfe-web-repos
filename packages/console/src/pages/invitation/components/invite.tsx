import * as React from 'react';
import styles from './invite.less';
import * as AHooks from 'ahooks';
import { FRectBtn } from '@/components/FButton';
import  FInput  from '@/components/FInput';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { Divider } from 'antd';
interface InviteProps {}

interface InviteStates {
  showPage: 'InviteCode' | 'PersonalData' | 'Result';
}

const initStates: InviteStates = {
  showPage: 'InviteCode',
};

function Invite({}: InviteProps) {
  const [showPage, set_showPage] = React.useState<InviteStates['showPage']>(initStates['showPage']);

  AHooks.useMount(async () => {
    // const { ret, errCode, data } = await FServiceAPI.User.areasProvinces();
    // const { ret, errCode, data } = await FServiceAPI.TestQualification.betaCodesActivate({ codes: '' });
    // const { ret, errCode, data } = await FServiceAPI.TestQualification.betaApply({
    //   areaCode: '',
    //   occupation: '',
    //   description: '',
    // });
  });

  AHooks.useUnmount(() => {});
  function flatCss(arr: Array<string>) {
    return arr.join(' ')
  }
  return (
    <div className={flatCss(["flex-column flex-1 w-100x align-center",styles.style])}>
      <div className="flex-1 flex-column">
        <div className="flex-3"></div>
        <div className="shrink-0 flex-column align-center">
          <div className={styles.title + ' mb-30'}>当前功能仅对内测用户开放</div>
          <div className={styles.title2}>填写邀请码/申请参加内测成功后，体验全部功能</div>
        </div>
        <div className="flex-2"></div>
      </div>
      <div className="shrink-0 flex-column  w-360">
          <FInput placeholder='请输入内测邀请码' wrapClassName={styles.input} />
          <div className={styles.codeError}>无效邀请码，请重新输入</div>
          <FRectBtn>验证邀请码</FRectBtn>
      </div>
      <div className="flex-1 flex-column align-center ">
        <div className={'flex-row mt-130'}>
          <span className={styles.tip}>没有内测邀请码？</span>
          <span className={styles.link}>申请参加内测</span>
        </div>
      </div>
      <div className={styles.loading + ' flex-column-center'}>
       <div className={'flex-column-center ' + styles.box}>
         <span className={styles.text}>验证中</span>
       </div>
      </div>
    </div>
  );
}

export default Invite;
