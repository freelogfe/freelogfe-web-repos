import * as React from 'react';
import styles from './index.less';
import { Checkbox, Space } from 'antd';
import { FContentText } from '@/components/FText';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceVersionCreatorPageModelState } from '@/models/connect';
import {
  ChangeAction,
} from '@/models/resourceVersionCreatorPage';
import FUtil1 from '@/utils';
import { FUtil } from '@freelog/tools-lib';
import FDivider from '@/components/FDivider';
import FContractDisplay from '@/components/FContractDisplay';
import { FTextBtn } from '@/components/FButton';
import FTerminatedContractListDrawer from '@/components/FTerminatedContractListDrawer';

interface ContractsProps {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function Contracts({ resourceVersionCreatorPage, dispatch }: ContractsProps) {
  const [terminatedContractIDs, set_TerminatedContractIDs] = React.useState<string[]>([]);

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
      };
    });

    const dependencies = resourceVersionCreatorPage.dependencies.map<ResourceVersionCreatorPageModelState['dependencies'][number]>((dd) => {
      if (dd.id !== resource.id) {
        return dd;
      }
      return {
        ...dd,
        enableReuseContracts,
      };
    });

    dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload: {
        dependencies: dependencies,
        dataIsDirty: true,
      },
      caller: '234532434345234324534%#$%#89127893784789123478%#$%#$#$',
    });
  }

  if (resource.enableReuseContracts.length === 0) {
    return null;
  }

  return (<>
    <Space size={15} style={{ width: '100%' }} direction='vertical'>
      <FContentText type='additional2' text={FUtil1.I18n.message('reusable_contract')} />
      {
        resource.enableReuseContracts.map((k) => (<div key={k.id} className={styles.Policy}>

          <div style={{ height: 15 }} />
          <div className={styles.PolicyGrammarName}>
            <Space size={10}>
              <span>{k.title}</span>
              {/*<label*/}
              {/*  className={styles[k.status === 0 ? 'executing' : 'stopped']}>{k.status === 0 ? '执行中' : '已终止'}</label>*/}
            </Space>
            <Checkbox
              checked={k.checked}
              disabled={k.status !== 0}
              onChange={(e) => onChangeChecked(e.target.checked, k)}
            />
          </div>
          {/*<div style={{height: 10}}/>*/}

          {/*<div style={{height: 15}}/>*/}
          {/*<div className={styles.PolicyGrammar}>*/}
          {/*  <pre className={styles.highlight}>{k.code}</pre>*/}
          {/*</div>*/}

          <div style={{ height: 10 }} />

          <div style={{ padding: '0 20px' }}>
            <FContractDisplay contractID={k.id} />
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

          {/*<div style={{height: 10}}/>*/}

          <div className={styles.PolicyInfo}>
            <FContentText type='additional2' text={'当前合约在此资源上被多个版本应用：'} />
            <div style={{ height: 8 }} />
            {/*{FUtil.I18n.message('use_for_version')}：*/}
            <div className={styles.allVersions}>
              {k.versions.map((i) => <div key={i}>{i}</div>)}
            </div>
          </div>
        </div>))
      }

      {
        resource.terminatedContractIDs.length > 0 && (<div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/*<FContentText text={'查看已终止的合约请移至'} type='negative' />*/}
            <FTextBtn onClick={() => {
              // window.open(`${FUtil.Format.completeUrlByDomain('user')}${FUtil.LinkTo.contract()}`);
              set_TerminatedContractIDs(resource.terminatedContractIDs);
            }}>查看已终止合约</FTextBtn>
            {/*<div style={{ height: 5 }} />*/}
          </div>
        </div>)
      }

    </Space>
    <FTerminatedContractListDrawer
      terminatedContractIDs={terminatedContractIDs}
      onClose={() => {
        set_TerminatedContractIDs([]);
      }}
    />
  </>);
}

export default connect(({ resourceVersionCreatorPage }: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(Contracts);

