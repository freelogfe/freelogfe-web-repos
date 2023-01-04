import * as React from 'react';
import styles from './index.less';
import { Checkbox, Space } from 'antd';
import {
  // FetchAuthorizedAction,
  OnTrigger_AuthorizedContractEvent_Action,
  ResourceAuthPageModelState,
  UpdateAuthorizedAction,
} from '@/models/resourceAuthPage';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import FDivider from '@/components/FDivider';
import { ConnectState } from '@/models/connect';
import FContractDisplay from '@/components/FContractDisplay';
import FResourceContractPanelNoContractTip from '@/components/FResourceContractPanelNoContractTip';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

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
    return (<FResourceContractPanelNoContractTip />);
  }

  return (<Space
    size={15}
    style={{ width: '100%' }}
    direction='vertical'
  >
    <FComponentsLib.FContentText type='additional2' text={'当前合约'} />

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
              dispatch<OnTrigger_AuthorizedContractEvent_Action>({
                type: 'resourceAuthPage/onTrigger_AuthorizedContractEvent',
              });
            }}
          />
        </div>
        <div style={{ height: 10 }} />
        <Space style={{ padding: '0 20px' }} size={2}>
          <FComponentsLib.FContentText
            type='additional2'
            text={FI18n.i18nNext.t('contract_id') + '：' + k.id}
          />
          <FDivider style={{ fontSize: 14 }} />
          <FComponentsLib.FContentText
            type='additional2'
            text={FI18n.i18nNext.t('contract_signed_time') + '：' + k.date}
          />
        </Space>
        <div style={{ height: 10 }} />

        {
          (<div className={styles.PolicyInfo}>
            <div className={styles.versionControl}>
              <FComponentsLib.FContentText type='additional2'>当前合约在此资源上被多个版本应用：</FComponentsLib.FContentText>
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
  </Space>);
}

export default connect(({ resourceAuthPage }: ConnectState) => ({
  resourceAuthPage,
}))(Contracts);
