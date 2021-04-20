import * as React from 'react';
import styles from './index.less';
import {Checkbox, Space} from 'antd';
import {FContentText} from '@/components/FText';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {
  ChangeAction,
} from '@/models/resourceVersionCreatorPage';
import FUtil from "@/utils";
import FDivider from "@/components/FDivider";

interface ContractsProps {
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
        dataIsDirty: true,
      },
    });
  }

  if (resource.enableReuseContracts.length === 0) {
    return null;
  }

  return <Space size={15} style={{width: '100%'}} direction="vertical">
    <FContentText type="additional2" text={FUtil.I18n.message('reusable_contract')}/>
    {
      resource.enableReuseContracts.map((k) => (<div key={k.id} className={styles.Policy}>

        <div style={{height: 15}}/>
        <div className={styles.PolicyGrammarName}>
          <Space size={10}>
            <span>{k.title}</span>
            <label
              className={styles[k.status === 0 ? 'executing' : 'stopped']}>{k.status === 0 ? '执行中' : '已终止'}</label>
          </Space>
          <Checkbox
            checked={k.checked}
            disabled={k.status !== 0}
            onChange={(e) => onChangeChecked(e.target.checked, k)}
          />
        </div>
        <div style={{height: 10}}/>
        <Space style={{padding: '0 20px'}} size={2}>
          <FContentText
            type="additional2"
            text={FUtil.I18n.message('contract_id') + '：' + k.id}
          />
          <FDivider style={{fontSize: 14}}/>
          <FContentText
            type="additional2"
            text={FUtil.I18n.message('contract_signed_time') + '：' + k.date}
          />
        </Space>
        <div style={{height: 15}}/>
        <div className={styles.PolicyGrammar}>
          <pre className={styles.highlight}>{k.code}</pre>
        </div>
        <div className={styles.PolicyInfo}>
          <FContentText type="additional2" text={'当前合约在此资源上被多个版本应用：'}/>
          <div style={{height: 8}}/>
          {/*{FUtil.I18n.message('use_for_version')}：*/}
          <Space size={15} style={{flexWrap: 'wrap'}}>
            {k.versions.map((i) => <span key={i}>{i}</span>)}
          </Space>
        </div>
      </div>))
    }
  </Space>
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(Contracts);

