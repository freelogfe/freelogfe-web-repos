import * as React from 'react';
import styles from './status.less';
import * as AHooks from 'ahooks';
import { FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface StatusProps {
  status: 101 | 10 | 0 | 1 | 2;
  tipData: string;
  jump: any;
}

function Status({ status, tipData, jump }: StatusProps) {
  const titleData = {
    10: '内测申请已提交，待审核',
    0: '内测申请审核中',
    2: '内测申请审核未通过',
    1: '审核通过',
    101: '内测申请提交失败',
  };
  const tipDatas = {
    10: '我们会尽快审核您的申请，审核结果会通过您的注册邮箱或者手机号发送给你，敬请留意。',
    0: '我们会尽快审核您的申请，审核结果会通过您的注册邮箱或者手机号发送给你，敬请留意。',
    2: tipData,
    1: '审核通过',
    101: '您的网络可能不稳定，内测申请提交失败，请返回上一页重新提交。',
  };
  const buttonDatas = {
    10: '进入个人中心',
    0: '进入个人中心',
    2: '重新提交',
    1: '进入个人中心',
    101: '返回上一页',
  };
  const iconColor = {
    10: '#E9A923',
    0: '#E9A923',
    2: 'rgb(237 74 81)',
    1: '#E9A923',
    101: 'rgb(237 74 81)',
  };
  function act() {
    if ([101, 2].includes(status)) {
      jump && jump('Apply');
    }
    if ([10, 0].includes(status)) {
      window.location.href = FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.setting();
    }
  }

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

  return (
    <div className={'flex-column-center ' + styles.style}>
      <div className="flex-2"/>
      <div className={'mb-31 h-78'}>
        <i
          className={['freelog', 'fl-icon-shenhe'].join(' ')}
          style={{ fontSize: '78px', color: iconColor[status] }}
        />
      </div>
      <span className={styles.title + ' mb-40'}>{titleData[status]}</span>
      {status !== 2 && <span className={styles.title2 + ' mb-40'}>{tipDatas[status]}</span>}
      {status === 2 && <div className={styles.tip + ' mb-40'}>{tipDatas[status]}</div>}
      <div className="flex-row-center">
        <FComponentsLib.FRectBtn className="mb-40 " onClick={act}>
          {buttonDatas[status]}
        </FComponentsLib.FRectBtn>
      </div>
      {[0, 2].includes(status) && (
        <span
          className={styles.link}
          onClick={() => {
            jump('InviteCode');
          }}
        >
          我有内测邀请码
        </span>
      )}
      <div className="flex-3"/>
    </div>
  );
}

export default Status;
