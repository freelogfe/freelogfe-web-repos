import * as React from 'react';
import styles from './index.less';
import { Checkbox, Space } from 'antd';
import { FContentText } from '@/components/FText';
import { FetchAuthorizedAction, ResourceAuthPageModelState, UpdateAuthorizedAction } from '@/models/resourceAuthPage';
import { connect, Dispatch } from 'dva';
import FUtil1 from '@/utils';
// import { FUtil } from '@freelog/tools-lib';
import FDivider from '@/components/FDivider';
// import FContractStatusBadge from '@/components/FContractStatusBadge';
import { ConnectState } from '@/models/connect';
import FContractDisplay from '@/components/FContractDisplay';
import { FTextBtn } from '@/components/FButton';
import { FUtil } from '@freelog/tools-lib';

interface ContractsProps {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
}

function Contracts({ resourceAuthPage, dispatch }: ContractsProps) {

  const activeResource = resourceAuthPage.contractsAuthorized.find((i) => i.activated);

  function onLicenseChange(version: string, policyId: string, checked: boolean) {
    // console.log($version, policyId, checked, '#@WDSfaDSAFD0[IJOA');
    dispatch<UpdateAuthorizedAction>({
      type: 'resourceAuthPage/updateAuthorized',
      payload: [{
        version: version,
        policyId: policyId,
        operation: checked ? 1 : 0,
      }],
    });
  }

  if (!activeResource || activeResource?.contracts.length === 0) {
    return null;
  }

  return <Space
    size={15}
    style={{ width: '100%' }}
    direction='vertical'
  >
    <FContentText type='additional2' text={'当前合约'} />

    {
      activeResource?.contracts.map((k) => (<div key={k.id} className={styles.Policy}>
        <div style={{ height: 15 }} />

        <div className={styles.PolicyGrammarName}>
          <Space size={10}>
            <span>{k.title}</span>
          </Space>
        </div>

        <div style={{ height: 10 }} />
        <div style={{ padding: '0 20px' }}>
          <FContractDisplay
            contractID={k.id}
            onChangedEvent={() => {
              dispatch<FetchAuthorizedAction>({
                type: 'resourceAuthPage/fetchAuthorized',
                payload: {
                  activatedResourceId: resourceAuthPage.contractsAuthorized.find((ca) => {
                    return ca.activated;
                  })?.id || '',
                },
              });
            }}
          />
        </div>
        <div style={{ height: 10 }} />
        <Space style={{ padding: '0 20px' }} size={2}>
          <FContentText
            type='additional2'
            text={FUtil1.I18n.message('contract_id') + '：' + k.id}
          />
          <FDivider style={{ fontSize: 14 }} />
          <FContentText
            type='additional2'
            text={FUtil1.I18n.message('contract_signed_time') + '：' + k.date}
          />
        </Space>
        <div style={{ height: 10 }} />

        {
          (<div className={styles.PolicyInfo}>
            <div className={styles.versionControl}>
              <FContentText type='additional2'>当前合约在此资源上被多个版本应用：</FContentText>
              <div style={{ height: 8 }} />
              <div className={styles.allVersions}>
                {k.versions.map((i) => <Space size={8} key={i.version}>
                  <Checkbox
                    checked={i.checked}
                    disabled={i.disabled}
                    onChange={(e) => onLicenseChange(i.version, k.policyId, e.target.checked)}
                  />
                  <span>{i.version}</span>
                </Space>)}
              </div>
            </div>
          </div>)
        }

      </div>))}

    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FContentText text={'查看已终止的合约请移至'} type='negative' />
        <FTextBtn onClick={() => {
          window.open(`${FUtil.Format.completeUrlByDomain('user')}${FUtil.LinkTo.contract()}`);
        }}>合约管理</FTextBtn>
      </div>
      <div style={{ height: 5 }} />
    </div>
  </Space>;
}

export default connect(({ resourceAuthPage }: ConnectState) => ({
  resourceAuthPage,
}))(Contracts);
