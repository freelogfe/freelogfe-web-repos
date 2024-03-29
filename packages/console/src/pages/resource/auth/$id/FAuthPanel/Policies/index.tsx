import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ResourceAuthPageModelState, UpdateAuthorizedAction } from '@/models/resourceAuthPage';
import { Space } from 'antd';
import { ConnectState } from '@/models/connect';
import FContract_AvailablePolicy_Card from '@/components/FContract_AvailablePolicy_Card';
import FComponentsLib from '@freelog/components-lib';
import { FI18n } from '@freelog/tools-lib';

interface PoliciesProps {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
}

function Policies({ dispatch, resourceAuthPage }: PoliciesProps) {

  const activeResource = resourceAuthPage.contractsAuthorized.find((i) => i.activated);

  if (!activeResource || activeResource?.policies?.length === 0) {
    return null;
  }

  return (<Space
    size={15}
    style={{ width: '100%' }}
    direction='vertical'
  >
    {/*<FComponentsLib.FContentText type='additional2' text={'可签约的合约'} />*/}
    <FComponentsLib.FContentText type='additional2' text={FI18n.i18nNext.t('getauth_title_authplanavailable')} />

    {activeResource?.policies.map((i) => (
      <FContract_AvailablePolicy_Card
        key={i.fullInfo.policyId}
        fullInfo={i.fullInfo}
        allVersions={i.allEnabledVersions}
        // allVersions={['0.0.1', '0.0.2', '0.0.3']}
        onClickLicense={(versions: string[]) => {
          dispatch<UpdateAuthorizedAction>({
            type: 'resourceAuthPage/updateAuthorized',
            payload: versions.map((v: string) => ({
              version: v,
              policyId: i.fullInfo.policyId,
              operation: 1,
            })),
          });
        }}
      />
    ))}
  </Space>);
}

export default connect(({ resourceAuthPage }: ConnectState) => ({
  resourceAuthPage,
}))(Policies);
