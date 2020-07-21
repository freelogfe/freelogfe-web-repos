import * as React from 'react';

import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import {EditOutlined, InfoCircleFilled, ExclamationCircleFilled} from '@ant-design/icons';
import {Radio, Checkbox, Space} from 'antd';
import Resources, {ResourcesProps} from './Resources';
import Contracts from "./Contracts";
import Policies from "./Policies";

export interface FDepPanelProps {
  dataSource: {
    id: string;
    activated: boolean;
    title: string;
    resourceType: string;
    version: {
      isCustom: boolean;
      select: string;
      allowUpdate: boolean;
      input: string;
    };
    versions: string[];
    upthrow: boolean;
    enableReuseContracts: {
      checked: boolean;
      title: string;
      status: string;
      code: string;
      id: string;
      date: string;
      versions: string[];
    }[];
    enabledPolicies: {
      checked: boolean;
      id: string;
      title: string;
      code: string;
    }[];
  }[];
  onChange?: (dataSource: FDepPanelProps['dataSource']) => void;
}

export default function ({dataSource, onChange}: FDepPanelProps) {

  const [activeResource, setActiveResource] = React.useState<FDepPanelProps['dataSource'][0] | null>(null);

  React.useEffect(() => {
    const resource = dataSource.find((i) => i.activated);
    setActiveResource(resource || null);
  }, [dataSource]);

  function onChangeResources(value: ResourcesProps['dataSource'][0]) {
    console.log(value, '######');
  }

  function onChangeResourcesActivated(value: ResourcesProps['dataSource'][0]) {
    return onChange && onChange(dataSource.map((i) => ({
      ...i,
      activated: value.id === i.id,
    })));
  }

  return (<>
    <>
      <div style={{height: 30}}/>
      <div className={styles.depUpthrow}>
        <FTitleText text={'基础上抛'} type="form"/>
        <ExclamationCircleFilled style={{color: '#C7C7C7', marginLeft: 5}}/>
        <div className={styles.depUpthrowLabel}>
          <label>ww-zh/PB-markdown</label>
          <label>ww-zh/PB-markdown</label>
          <label>ww-zh/PB-markdown</label>
        </div>
      </div>
    </>
    <>
      <div style={{height: 20}}/>
      <div className={styles.DepPanel}>
        <div className={styles.DepPanelNavs}>
          <div>
            <div>
              <Resources
                dataSource={dataSource.map((i) => ({
                  id: i.id,
                  activated: i.activated,
                  title: i.title,
                  resourceType: i.resourceType,
                  versions: i.versions,
                  version: i.version,
                  labels: i.enableReuseContracts.map((j) => j.title),
                  upthrow: i.upthrow,
                }))}
                onClick={(resource) => onChangeResourcesActivated(resource)}
              />
            </div>
          </div>
        </div>
        <div className={styles.DepPanelContent}>
          <div>
            <div className={styles.radios}>
              <div>
                <Radio style={{lineHeight: '16px'}} checked={activeResource?.upthrow}/>
                <span style={{color: '#666'}}>上抛</span>
                <InfoCircleFilled style={{color: '#C7C7C7', fontSize: 16, marginLeft: 20}}/>
              </div>
              <div style={{height: 18}}/>
              <div>
                <Radio style={{lineHeight: '16px'}} checked={!activeResource?.upthrow}/>
                <span style={{color: '#666'}}>签约</span>
                <InfoCircleFilled style={{color: '#C7C7C7', fontSize: 16, marginLeft: 20}}/>
              </div>
            </div>

            <div style={{height: 20}}/>
            <FContentText type="additional2" text={'可复用的合约'}/>
            <div style={{height: 5}}/>
            {activeResource && <Contracts
              dataSource={activeResource.enableReuseContracts}
            />}

            <div style={{height: 20}}/>
            <FContentText type="additional2" text={'可签约的策略'}/>
            <div style={{height: 5}}/>
            {activeResource && <Policies
              dataSource={activeResource.enabledPolicies}
            />}
          </div>
        </div>
      </div>
    </>
  </>);
}
