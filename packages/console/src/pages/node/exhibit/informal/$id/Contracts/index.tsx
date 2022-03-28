import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import { connect, Dispatch } from 'dva';
import { ConnectState, InformExhibitInfoPageModelState } from '@/models/connect';
import FPolicyDisplay from '@/components/FPolicyDisplay';
import FFullScreen from '@/components/FIcons/FFullScreen';
import FModal from '@/components/FModal';
import { FRectBtn } from '@/components/FButton';
import FExhibitAuthorizedContracts from '@/components/FExhibitAuthorizedContracts';
import { OnChanged_ExhibitAuthorized_Action } from '@/models/informExhibitInfoPage';

interface ContractsProps {
  dispatch: Dispatch;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
}

function Contracts({ dispatch, informExhibitInfoPage }: ContractsProps) {

  return (<div>
    <FTitleText
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
