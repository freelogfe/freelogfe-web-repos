import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import InviteForm from './components/form';
import Invite from './components/invite';
import InviteStatus from './components/status';
import { Form } from 'antd';

interface InvitationProps {}

interface InvitationStates {
  showPage: 'InviteCode' | 'Apply' | 'Result';
}

const initStates: InvitationStates = {
  showPage: 'Apply',
};

function Invitation({}: InvitationProps) {
  const [showPage, setShowPage] = React.useState<InvitationStates['showPage']>(
    initStates['showPage'],
  );
  // 状态 0:待审核 1:审核通过 2:审核不通过   10: 刚提交的  101: 提交失败
  const [status, setStatus] = React.useState<101 | 10 | 0 | 1 | 2>(0);

  AHooks.useMount(async () => {
    // const { ret, errCode, data } = await FServiceAPI.User.areasProvinces();
    // const { ret, errCode, data } = await FServiceAPI.User.areasProvinces();
    console.log();
    // const { ret, errCode, data } = await FServiceAPI.TestQualification.betaCodesActivate({ codes: '' });
    // const { ret, errCode, data } = await FServiceAPI.TestQualification.betaApply({
    //   areaCode: '',
    //   occupation: '',
    //   description: '',
    // });
  });

  AHooks.useUnmount(() => {});
  function finished(type: 101 | 10 | 0 | 1 | 2) {
    setStatus(type);
  }

  return showPage === 'InviteCode' ? (
    <Invite />
  ) : showPage === 'Apply' ? (
    <InviteForm finished={finished} />
  ) : (
    <InviteStatus
      status={status}
      tipData={''}
      goBack={() => {
        setShowPage('Apply');
      }}
    />
  );
}

export default Invitation;
