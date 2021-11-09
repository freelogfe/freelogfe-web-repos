import * as React from 'react';
import styles from './index.less';
import PolicyCard from './PolicyCard';
import { Dispatch, connect } from 'dva';
import { ResourceAuthPageModelState, UpdateAuthorizedAction } from '@/models/resourceAuthPage';
import { Space } from 'antd';
import { ConnectState } from '@/models/connect';
import { FContentText } from '@/components/FText';

interface PoliciesProps {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
}

function Policies({ dispatch, resourceAuthPage }: PoliciesProps) {

  const activeResource = resourceAuthPage.contractsAuthorized.find((i) => i.activated);

  function onLicense(versions: string[], policyId: string) {
    dispatch<UpdateAuthorizedAction>({
      type: 'resourceAuthPage/updateAuthorized',
      payload: versions.map((v: string) => ({
        version: v,
        policyId: policyId,
        operation: 1,
      })),
    });
  }

  if (!activeResource || activeResource?.policies?.length === 0) {
    return null;
  }

  return (<Space
    size={15}
    style={{ width: '100%' }}
    direction='vertical'
  >
    <FContentText type='additional2' text={'可签约的合约'} />

    {activeResource?.policies.map((i) => (
      <PolicyCard
        key={i.id}
        title={i.title}
        code={i.code}
        allVersions={i.allEnabledVersions}
        // allVersions={['0.0.1', '0.0.2', '0.0.3']}
        onClickLicense={(versions: string[]) => onLicense(versions, i.id)}
      />
    ))}
  </Space>);
}

export default connect(({ resourceAuthPage }: ConnectState) => ({
  resourceAuthPage,
}))(Policies);
