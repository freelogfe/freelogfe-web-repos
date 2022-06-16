import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import InviteForm from './components/form';
import Invite from './components/invite';
import InviteStatus from './components/status';
import { Form } from 'antd';
import useUrlState from '@ahooksjs/use-url-state';
import { router } from 'umi';

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
  const [urlState] = useUrlState<any>();

  // 状态 0:待审核 1:审核通过 2:审核不通过   10: 刚提交的  101: 提交失败
  const [status, setStatus] = React.useState<101 | 10 | 0 | 1 | 2>(0);
  const [applyData, setApplyData] = React.useState<any>(null);
  AHooks.useMount(async () => {
    const userData = await FServiceAPI.User.currentUserInfo();
    if (userData && userData.data && (userData.data.userType & 1) === 1) {
      if (urlState.returnUrl) {
        window.location.href = urlState.returnUrl;
      } else {
        router.push('/dashboard');
      }
      return;
    }
    const { ret, errCode, data } = await FServiceAPI.TestQualification.getBetaApply1();
    setApplyData(data);
    if (data) {
      setStatus(data.status);
      setShowPage('Result');
      router.push(
        '/invitation?type=status' + (urlState.returnUrl ? '&returnUrl=' + urlState.returnUrl : ''),
      );
    } else {
      if (urlState.type) {
        switch (urlState.type) {
          case 'apply':
            setShowPage('Apply');
            break;
          case 'code':
            setShowPage('InviteCode');
            break;
        }
        return;
      } else {
        setShowPage('InviteCode');
      }
    }
  });
  function jump(page: InvitationStates['showPage']) {
    let route = page === 'Apply' ? 'apply' : page === 'InviteCode' ? 'code' : 'status';
    router.push(
      `/invitation?type=${route}` + (urlState.returnUrl ? '&returnUrl=' + urlState.returnUrl : ''),
    );
    setShowPage(page);
  }
  AHooks.useUnmount(() => {});
  function finished(type: 101 | 10 | 0 | 1 | 2) {
    setStatus(type);
    router.push(
      `/invitation?type=status` + (urlState.returnUrl ? '&returnUrl=' + urlState.returnUrl : ''),
    );
    setShowPage('Result');
  }

  return showPage === 'InviteCode' ? (
    <Invite jump={jump} />
  ) : showPage === 'Apply' ? (
    <InviteForm finished={finished} />
  ) : (
    <InviteStatus status={status} tipData={applyData ? applyData.auditMsg : ''} jump={jump} />
  );
}

export default Invitation;
