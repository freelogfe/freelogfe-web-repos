import * as React from 'react';
import styles from './index.less';
import {Checkbox, Space} from 'antd';
import {FContentText} from '@/components/FText';
// import {FDepPanelProps} from '@/pages/resource/containers/FDepPanel';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {
  ChangeAction,
} from '@/models/resourceVersionCreatorPage';
import {i18nMessage} from '@/utils/i18n';

interface ContractsProps {
  // dataSource: FDepPanelProps['dataSource'][0]['enableReuseContracts'];
  // onChange?: (dataRourece: ContractsProps['dataSource']) => void;
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function Contracts({resourceVersionCreatorPage, dispatch}: ContractsProps) {

  const resource: ResourceVersionCreatorPageModelState['dependencies'][number] = resourceVersionCreatorPage.dependencies.find((i) => i.id === resourceVersionCreatorPage.depActivatedID) as ResourceVersionCreatorPageModelState['dependencies'][number];

  if (!resource || resource.upthrow) {
    return null;
  }

  function onChangeChecked(checked: boolean, contract: ResourceVersionCreatorPageModelState['dependencies'][number]['enableReuseContracts'][number]) {
    // console.log(contract, 'erc2093jsdflk');
    const enableReuseContracts: ResourceVersionCreatorPageModelState['dependencies'][number]['enableReuseContracts'] = resource.enableReuseContracts.map((erc) => {
      if (erc.id !== contract.id) {
        return erc;
      }
      return {
        ...erc,
        checked,
      }
    });

    const dependencies = resourceVersionCreatorPage.dependencies.map<ResourceVersionCreatorPageModelState['dependencies'][number]>((dd) => {
      if (dd.id !== resource.id) {
        return dd;
      }
      return {
        ...dd,
        enableReuseContracts,
      }
    });

    dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload: {
        dependencies: dependencies,
      },
    });
  }

  if (resource.enableReuseContracts.length === 0) {
    return null;
  }

  return <>
    <div style={{height: 20}}/>
    <FContentText type="additional2" text={i18nMessage('reusable_contract')}/>
    <div style={{height: 5}}/>
    <div className={styles.styles}>
      {resource.enableReuseContracts.map((k) => (<div key={k.id} className={styles.Policy}>
        <div className={styles.PolicyGrammar}>
          <div className={styles.PolicyGrammarName}>
            <Checkbox
              checked={k.checked}
              disabled={k.status !== 0}
              onChange={(e) => onChangeChecked(e.target.checked, k)}
            />
            <div style={{width: 5}}/>
            <span>{k.title}</span>
            <div style={{width: 10}}/>
            <label className={styles[k.status === 0 ? 'executing' : 'stopped']}>{k.status === 0 ? '执行中' : '已终止'}</label>
          </div>
          <div style={{height: 15}}/>
          <pre className={styles.highlight}>{k.code}</pre>
        </div>
        <div className={styles.PolicyInfo}>
          <Space size={40}>
            <FContentText type="additional2" text={i18nMessage('contract_id') + '：' + k.id}/>
            <FContentText type="additional2" text={i18nMessage('contract_signed_time') + '：' + k.date}/>
          </Space>
          <div style={{height: 9}}/>
          <div>
            <FContentText type="additional2">
              {i18nMessage('use_for_version')}：
              <Space size={15}>
                {k.versions.map((i) => <span key={i}>{i}</span>)}
              </Space>
            </FContentText>
          </div>
        </div>
      </div>))}
    </div>
  </>
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(Contracts);

