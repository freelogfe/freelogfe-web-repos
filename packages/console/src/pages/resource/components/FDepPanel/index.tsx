import * as React from 'react';

import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import {EditOutlined, InfoCircleFilled} from '@ant-design/icons';
import {Radio, Checkbox, Space} from 'antd';

const code = 'initial:\n' +
  '    active\n' +
  '    recontractable\n' +
  '    presentable\n' +
  '    terminate';

export interface AuthPanelProps {
  type: 'auth';
  dataSource: {
    id: string | number;
    activated: boolean;
    title: string;
    resourceType: string;
    version: string;
    contracts: {
      checked: boolean;
      title: string;
      status: string;
      code: string;
      id: string;
      date: string;
      versions: string[];
      checkedVersions: string[];
    }[];
    policies: {
      id: string;
      title: string;
      code: string;
    }[];
  }[];
}

interface DepPanelProps {
  type: 'dep';
  dataSource: {
    activated: boolean;
    title: string;
    resourceType: string;
    selectedVersion: string;
    versions: string[];
    upthrow: boolean;
    enableReuseContracts: {
      selected: boolean;
      title: string;
      status: string;
      code: string;
      id: string;
      date: string;
      versions: string[];
    }[];
    enabledPolicies: {
      id: string;
      title: string;
      code: string;
    }[];
  }[];
}

export default function ({type, dataSource}: AuthPanelProps | DepPanelProps) {

  return (<div className={styles.DepPanel}>
    <div className={styles.DepPanelNavs}>
      <div>
        {
          // TODO:

        }

        {false && <div className={styles.DepPanelNav}>
          <div>
            <FContentText text={'ww-zh/PB-markdown'}/>
            <div style={{height: 9}}/>
            <FContentText type="additional2">
              <span>image | 版本范围：xxx</span> <EditOutlined/>
            </FContentText>
            <>
              <div style={{height: 9}}/>
              <div className={styles.DepPanelLabels}>
                {type === 'dep' && <label className={styles.labelError}>上抛</label>}
                <label className={styles.labelInfo}>上抛</label>
                <label className={styles.labelInfo}>上抛</label>
                <label className={styles.labelInfo}>上抛</label>
                <label className={styles.labelInfo}>上抛</label>
                <label className={styles.labelInfo}>上抛</label>
                <label className={styles.labelInfo}>上抛</label>
                <label className={styles.labelInfo}>上抛</label>
                <label className={styles.labelInfo}>上抛</label>
              </div>
            </>
          </div>
          <FCircleButton theme="delete"/>
        </div>}
      </div>
    </div>
    {
      // @ts-ignore
      dataSource.filter((i: any) => i.activated)
        .map((j: any) => (<div key={j.id} className={styles.DepPanelContent}>
          {type === 'dep' && (<div className={styles.radios}>
            <div>
              <Radio style={{lineHeight: '16px'}} checked={true}/>
              <span style={{color: '#666'}}>上抛</span>
              <InfoCircleFilled style={{color: '#C7C7C7', fontSize: 16, marginLeft: 20}}/>
            </div>
            <div style={{height: 18}}/>
            <div>
              <Radio style={{lineHeight: '16px'}} checked={false}/>
              <span style={{color: '#666'}}>签约</span>
              <InfoCircleFilled style={{color: '#C7C7C7', fontSize: 16, marginLeft: 20}}/>
            </div>
          </div>)}

          <div className={styles.block}>
            <>
              <div style={{height: 10}}/>
              <FContentText type="additional2" text={'可复用的合约'}/>
            </>
            <>
              <div style={{height: 10}}/>
              {
                //  TODO:
              }

            </>
          </div>
        </div>))
    }

  </div>);
}

interface ResourcesProps {
  type: 'dep' | 'auth';
  dataSource: {
    id: string | number;
    activated: boolean;
    title: string;
    resourceType: string;
    version: string;
    label: string[];
  }[];
}

function Resources({type, dataSource}: ResourcesProps) {
  return dataSource.map((i) => (
    <div className={styles.DepPanelNav + ' ' + (i.activated ? styles.DepPanelNavActive : '')}>
      <div>
        <FContentText text={i.title}/>
        <div style={{height: 9}}/>
        <FContentText type="additional2">
          <span>{i.resourceType} | 版本范围：{i.version}</span> {type === 'dep' && <EditOutlined/>}
        </FContentText>
        <>
          <div style={{height: 9}}/>
          <div className={styles.DepPanelLabels}>
            {type === 'dep' && <label className={styles.labelError}>上抛</label>}
            {
              i.label.map((j: string) => (<label
                key={j}
                className={styles.labelInfo}
              >{j}</label>))
            }
          </div>
        </>
      </div>
      {type === 'dep' && <FCircleButton theme="delete"/>}
    </div>))
}


interface ContractsProps {
  type: 'dep' | 'auth';
  dataSource: {
    checked: boolean;
    title: string;
    status: string;
    code: string;
    id: string;
    date: string;
    versions: string[];
    checkedVersions: string[];
  }[];
}

function Contracts({type, dataSource}: ContractsProps) {
  return dataSource.map((k) => (<div className={styles.Policy}>
    <div className={styles.PolicyGrammar}>
      <div className={styles.PolicyGrammarName}>
        <Checkbox checked={k.checked}/><span>{k.title}</span>
        <div>
          <label className={styles.executing}>执行中</label>
        </div>
      </div>
      <div style={{height: 15}}/>
      <pre className={styles.highlight}>{code}</pre>
    </div>
    <div className={styles.PolicyInfo}>
      <Space size={40}>
        <FContentText type="additional2" text={'合约ID：' + k.id}/>
        <FContentText type="additional2" text={'签约时间：' + k.date}/>
      </Space>
      <div style={{height: 9}}/>
      <div>
        <FContentText type="additional2">
          应用版本：
          <Space size={15}>
            {k.versions.map((i) => <span key={i}>{i}</span>)}
          </Space>
        </FContentText>
      </div>
    </div>
  </div>))
}


interface PoliciesProps {
  type: 'dep' | 'auth';
  dataSource: {
    id: string;
    title: string;
    code: string;
  }[];
}

function Policies() {

}
