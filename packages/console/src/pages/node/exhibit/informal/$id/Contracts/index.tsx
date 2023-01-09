import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, InformExhibitInfoPageModelState } from '@/models/connect';
import FExhibitAuthorizedContracts from '@/components/FExhibitAuthorizedContracts';
import { OnChanged_ExhibitAuthorized_Action } from '@/models/informExhibitInfoPage';
import FComponentsLib from '@freelog/components-lib';

interface ContractsProps {
  dispatch: Dispatch;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
}

function Contracts({ dispatch, informExhibitInfoPage }: ContractsProps) {

  return (<div>
    <FComponentsLib.FTitleText
      text={'关联合约'}
      type='h3'
    />

    <div style={{ height: 20 }} />
    <FExhibitAuthorizedContracts
      exhibitID={informExhibitInfoPage.exhibit_ID}
      onChangeAuthorize={() => {
        dispatch<OnChanged_ExhibitAuthorized_Action>({
          type: 'informExhibitInfoPage/onChanged_ExhibitAuthorized',
        });
      }}
    />
  </div>);
}

export default connect(({ informExhibitInfoPage }: ConnectState) => ({
  informExhibitInfoPage,
}))(Contracts);
