import * as React from 'react';
import styles from './index.less';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import FComponentsLib from '@freelog/components-lib';
import { FI18n } from '@freelog/tools-lib';
import { Checkbox, Radio, Space } from 'antd';
import FTooltip from '@/components/FTooltip';
import FContractDisplay from '@/components/FContractDisplay';
import FDivider from '@/components/FDivider';
import FPolicyDisplay from '@/components/FPolicyDisplay';

interface TargetInfo {
  targetID: string;
  targetName: string;
  targetType: 'resource' | 'object';
  targetResourceType: string[];
  error: '' | 'offline' | 'cyclicDependency' | 'storageObject' | 'upThrow' | 'freeze';
  warning: '' | 'authException' | 'ownerFreeze';
  versionRange: string;
  versions: string[];
  upThrow: boolean;
  upThrowDisabled: boolean;
  contracts: {
    contractID: string;
    policyID: string;
    title: string;
    code: string;
    date: string;
  }[];
  terminatedContractIDs: string[];
  enabledPolicies: {
    checked: boolean;
    policyFullInfo: PolicyFullInfo_Type;
  }[];
}

interface ContentProps {
  targetInfos: TargetInfo[];

  activatedTarget: {
    id: string;
    name: string;
    type: 'resource' | 'object';
  } | null;
}

function Content({ targetInfos, activatedTarget }: ContentProps) {

  if (!activatedTarget) {
    return null;
  }

  const info: TargetInfo | undefined = targetInfos.find((i) => {
    return activatedTarget.id === i.targetID && activatedTarget.name === i.targetName && activatedTarget.type === i.targetType;
  });

  if (!info) {
    return null;
  }

  if (info.error === 'offline' && info.contracts.length === 0 && info.enabledPolicies.length === 0) {
    return (
      <div className={styles.errorBox}>
        <FComponentsLib.FIcons.FForbid className={styles.errorIcon} />
        <FComponentsLib.FTipText
          text={FI18n.i18nNext.t('authorization_issue_offline_resource')}
          type='second'
        />
      </div>);
  }

  if (info.error === 'cyclicDependency') {
    return (<div className={styles.errorBox}>
      <FComponentsLib.FIcons.FForbid className={styles.errorIcon} />
      <FComponentsLib.FTipText
        text={FI18n.i18nNext.t('authorization_issue_circular_reply')}
        type='second'
      />
    </div>);
  }

  if (info.error === 'storageObject') {
    return (<div className={styles.errorBox}>
      <FComponentsLib.FIcons.FForbid className={styles.errorIcon} />
      <FComponentsLib.FTipText text={'该依赖是存储空间对象，无法获取授权。'} type='second' />
    </div>);
  }

  if (info.error === 'upThrow') {
    return (<div className={styles.errorBox}>
      <FComponentsLib.FIcons.FUpcast className={styles.errorIcon} />
      <FComponentsLib.FTipText text={'此依赖为当前资源的基础上抛'} type='second' />
    </div>);
  }

  if (info.error === 'freeze') {
    return (<div className={styles.errorBox}>
      <FComponentsLib.FIcons.FForbid className={styles.errorIcon} />
      <FComponentsLib.FTipText text={'此资源因违规无法授权'} type='second' />
    </div>);
  }

  if (info.warning === 'authException') {
    return (<Space size={10}>
      <FComponentsLib.FIcons.FWarning style={{ fontSize: 20 }} />
      <span style={{ fontSize: 14, color: '#C78D12' }}>该资源授权链异常，请谨慎签约。</span>
    </Space>);
  }

  if (info.warning === 'ownerFreeze') {
    return (<Space size={10}>
      <FComponentsLib.FIcons.FWarning style={{ fontSize: 20 }} />
      <span style={{ fontSize: 14, color: '#C78D12' }}>该资源发行方账号因违规已被冻结，请谨慎处理授权。</span>
    </Space>);
  }

  return (<>
    <div>
      <Space size={20}>
        <Space size={2}>
          <Radio
            style={{ lineHeight: '16px', color: 'red' }}
            checked={info.upThrow}
            disabled={info.upThrowDisabled && !info.upThrow}
            // onClick={() => onChangeIsUpthrow(true)}
          />
          <span style={{ color: '#666' }}>上抛</span>
        </Space>

        <FTooltip title={FI18n.i18nNext.t('info_upcast')}>
          <div><FComponentsLib.FIcons.FInfo /></div>
        </FTooltip>
      </Space>

      <div style={{ height: 15 }} />
      <Space size={20}>
        <Space size={2}>
          <Radio
            style={{ lineHeight: '16px' }}
            checked={!info.upThrow}
            disabled={info.upThrowDisabled}
            // onClick={() => onChangeIsUpthrow(false)}
          />
          <span style={{ color: '#666' }}>{FI18n.i18nNext.t('sign_contract')}</span>
        </Space>
        <FTooltip title={FI18n.i18nNext.t('info_sign_contract')}>
          <div><FComponentsLib.FIcons.FInfo /></div>
        </FTooltip>
      </Space>
    </div>

    <Space size={15} style={{ width: '100%' }} direction='vertical'>
      <FComponentsLib.FContentText type='additional2' text={FI18n.i18nNext.t('reusable_contract')} />
      {
        info.contracts
          .map((k) => (<div key={k.contractID} className={styles.Policy}>

            <div style={{ height: 15 }} />
            <div className={styles.PolicyGrammarName}>
              <Space size={10}>
                <span>{k.title}</span>
              </Space>
            </div>

            <div style={{ height: 10 }} />

            <div style={{ padding: '0 20px' }}>
              <FContractDisplay contractID={k.contractID} />
            </div>

            <div style={{ height: 10 }} />

            <Space style={{ padding: '0 20px' }} size={2}>
              <FComponentsLib.FContentText
                type='additional2'
                text={FI18n.i18nNext.t('contract_id') + '：' + k.contractID}
              />
              <FDivider style={{ fontSize: 14 }} />
              <FComponentsLib.FContentText
                type='additional2'
                text={FI18n.i18nNext.t('contract_signed_time') + '：' + k.date}
              />
            </Space>
          </div>))
      }

      {
        info.terminatedContractIDs.length > 0 && (<div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/*<FContentText text={'查看已终止的合约请移至'} type='negative' />*/}
            <FComponentsLib.FTextBtn onClick={() => {
              // window.open(`${FUtil.Format.completeUrlByDomain('user')}${FUtil.LinkTo.contract()}`);
              // set_TerminatedContractIDs(resource.terminatedContractIDs);
            }}>查看已终止合约</FComponentsLib.FTextBtn>
            {/*<div style={{ height: 5 }} />*/}
          </div>
        </div>)
      }

    </Space>

    <Space
      size={15}
      style={{ width: '100%' }}
      direction='vertical'
    >
      <FComponentsLib.FContentText type='additional2' text={FI18n.i18nNext.t('getauth_title_authplanavailable')} />
      {info.enabledPolicies.map((i) => (
        <div key={i.policyFullInfo.policyId} className={styles.Policy}>
          <div style={{ height: 15 }} />
          <div className={styles.PolicyName}>
            <span>{i.policyFullInfo.policyName}</span>
            <Checkbox
              // disabled={i.status === 0}
              checked={i.checked}
              // onChange={(e) => onChangeChecked(e.target.checked, i)}
            />
          </div>
          <div style={{ height: 10 }} />
          <div style={{ padding: '0 20px' }}>
            <FPolicyDisplay fullInfo={i.policyFullInfo} />
          </div>
        </div>
      ))}
    </Space>
  </>);
}

export default Content;

// {
//   // (resource?.status === 1
//   (resource?.error === ''
//     // || (resource?.status === 0
//     || (resource?.error === 'offline'
//       && (resource?.enableReuseContracts.length !== 0 || resource.enabledPolicies.length !== 0)))
//   && (<Space
//     style={{ width: '100%' }}
//     size={25}
//     direction='vertical'
//   >
//
//     {
//       // resource.authProblem && (<Space size={10}>
//       resource.warning === 'ownerFreeze' &&
//     }
//
//     return (
//     <div>
//
//     </div>
//     );
//     }


