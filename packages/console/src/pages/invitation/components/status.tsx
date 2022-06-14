import * as React from 'react';
import styles from './status.less';
import * as AHooks from 'ahooks';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { Divider } from 'antd';
import { FRectBtn } from '@/components/FButton';

interface StatusProps {
  status: 101 | 10 | 0 | 1 | 2;
  tipData: string;
  goBack: any
}

function Status({ status, tipData, goBack }: StatusProps) {
  const titleData = {
    10: '内测申请审核未通过',
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
  function act() {
    if(status === 101){
      goBack && goBack()
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
      <div className="flex-2"></div>
      <div className={'mb-31'}>图片</div>
      <span className={styles.title + ' mb-40'}>{titleData[status]}</span>
      <span className={styles.title2 + ' mb-40'}>{tipDatas[status]}</span>
      <div className={styles.tip + ' mb-40'}>
        经审核，您需要重新提交您常用的创作平台或社区的个人主页网址
        “https://ones.ai/project/#/team/X4r1vx7D/project/248wHyM4awN6K6r
        w/component/FUPZ3tkt/view/12H9iFTi”无法打开
      </div>
      <div className="flex-row-center">
        <FRectBtn className="mb-40 " onClick={act}>
          {buttonDatas[status]}
        </FRectBtn>
      </div>
      {[0, 2].includes(status) && <span className={styles.link}>我有内测邀请码</span>}
      <div className="flex-3"></div>
    </div>
  );
}

export default Status;
