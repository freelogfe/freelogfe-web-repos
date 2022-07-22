import * as React from 'react';
import styles from './index.less';
import { Checkbox, Space } from 'antd';
import { ChangeAction } from '@/models/resourceVersionCreatorPage';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceVersionCreatorPageModelState } from '@/models/connect';
import FPolicyDisplay from '@/components/FPolicyDisplay';
import FComponentsLib from '@freelog/components-lib';

interface PoliciesProps {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function Policies({ resourceVersionCreatorPage, dispatch }: PoliciesProps) {
  const resource: ResourceVersionCreatorPageModelState['dependencies'][number] = resourceVersionCreatorPage.dependencies.find((i) => i.id === resourceVersionCreatorPage.depActivatedID) as ResourceVersionCreatorPageModelState['dependencies'][number];

  if (!resource || resource.upthrow) {
    return null;
  }

  function onChangeChecked(checked: boolean, contractID: ResourceVersionCreatorPageModelState['dependencies'][number]['enabledPolicies'][number]) {
    const enabledPolicies = resource.enabledPolicies.map((i) => {
      if (i.id !== contractID.id) {
        return i;
      }
      return {
        ...i,
        checked,
      };
    });
    const dependencies: ResourceVersionCreatorPageModelState['dependencies'] = resourceVersionCreatorPage.dependencies.map((dd) => {
      if (dd.id !== resource.id) {
        return dd;
      }
      return {
        ...dd,
        enabledPolicies,
      };
    });
    dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload: {
        dependencies,
        dataIsDirty: true,
      },
      caller: '23451234234234=====32434345234324534%#$%#$%#$%#$#$',
    });
  }

  const enabledPolicies = resource.enabledPolicies.filter((ep) => ep.status === 1);

  if (enabledPolicies.length === 0) {
    return null;
  }

  return (<Space
    size={15}
    style={{ width: '100%' }}
    direction='vertical'
  >
    {/*<FContentText type="additional2" text={FUtil.I18n.message('other_authorization_plan')}/>*/}
    <FComponentsLib.FContentText type='additional2' text={'可签约的策略'} />
    {enabledPolicies.map((i) => (
      <div key={i.id} className={styles.Policy}>
        <div style={{ height: 15 }} />
        <div className={styles.PolicyName}>

          {/*<div style={{width: 5}}/>*/}
          <span>{i.title}</span>
          {/*<div style={{width: 2}}/>*/}
          {/*{i.status === 0 && <>*/}
          {/*  <CloseCircleFilled className={styles.titleErrorIcon}/>*/}
          {/*  <div style={{width: 5}}/>*/}
          {/*  <FTipText text={'该授权策略已停用，无法签约。'} type="modal"/>*/}
          {/*</>}*/}
          <Checkbox
            disabled={i.status === 0}
            checked={i.checked}
            onChange={(e) => onChangeChecked(e.target.checked, i)}
          />
        </div>
        {/*<div style={{height: 15}}/>*/}
        {/*<div className={styles.PolicyGrammar}>*/}
        {/*  <pre>{i.code}</pre>*/}
        {/*</div>*/}
        <div style={{ height: 10 }} />
        <div style={{ padding: '0 20px' }}>
          <FPolicyDisplay code={i.code} />
        </div>
      </div>
    ))}
  </Space>);
}

export default connect(({ resourceVersionCreatorPage }: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(Policies);
