import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import InviteForm from './components/form'
import Invite from './components/invite'
import InviteStatus from './components/status'
import { Form } from 'antd';

interface InvitationProps {

}

interface InvitationStates {
  showPage: 'InviteCode' | 'PersonalData' | 'Result';
}

const initStates: InvitationStates = {
  showPage: 'InviteCode',
};

function Invitation({}: InvitationProps) {

  const [showPage, set_showPage] = React.useState<InvitationStates['showPage']>(initStates['showPage']);

  AHooks.useMount(async () => {

    // const { ret, errCode, data } = await FServiceAPI.User.areasProvinces();
    // const { ret, errCode, data } = await FServiceAPI.TestQualification.betaCodesActivate({ codes: '' });
    // const { ret, errCode, data } = await FServiceAPI.TestQualification.betaApply({
    //   areaCode: '',
    //   occupation: '',
    //   description: '',
    // });
  });

  AHooks.useUnmount(() => {

  });
  
  return (<InviteStatus/>);
}

export default Invitation;
