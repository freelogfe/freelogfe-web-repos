import * as React from 'react';

import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import {EditOutlined, InfoCircleFilled, ExclamationCircleFilled} from '@ant-design/icons';
import {Radio, Checkbox, Space} from 'antd';
import Resources, {ResourcesProps} from './Resources';
import Contracts from "./Contracts";
import Policies from "./Policies";
import {resourceTypes} from "@/utils/globals";

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
      status: 'executing' | 'stopped';
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
    // console.log(value, '######');
    return onChange && onChange(dataSource.map((i) => {
      if (value.id !== i.id) {
        return i;
      }
      return {
        ...i,
        version: value.version,
      };
    }));
  }

  function onChangeResourcesActivated(value: ResourcesProps['dataSource'][0]) {
    return onChange && onChange(dataSource.map((i) => ({
      ...i,
      activated: value.id === i.id,
    })));
  }

  function onDeleteResource(value: ResourcesProps['dataSource'][0]) {
    const resources = dataSource.filter((i) => i.id !== value.id);

    if (value.activated && resources.length > 0) {
      resources[0].activated = true;
    }
    return onChange && onChange(resources);
  }

  function onChangeIsUpthrow(bool: boolean) {
    return onChange && onChange(dataSource.map((i) => {
      if (i.id !== activeResource?.id) {
        return i;
      }
      return {
        ...i,
        upthrow: bool,
      };
    }))
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
                onClick={onChangeResourcesActivated}
                onChange={onChangeResources}
                onDelete={onDeleteResource}
              />
            </div>
          </div>
        </div>
        <div className={styles.DepPanelContent}>
          <div>
            <div className={styles.radios}>
              <div>
                <Radio
                  style={{lineHeight: '16px'}}
                  checked={activeResource?.upthrow}
                  onClick={() => onChangeIsUpthrow(true)}
                />
                <span style={{color: '#666'}}>上抛</span>
                <InfoCircleFilled style={{color: '#C7C7C7', fontSize: 16, marginLeft: 20}}/>
              </div>
              <div style={{height: 18}}/>
              <div>
                <Radio
                  style={{lineHeight: '16px'}}
                  checked={!activeResource?.upthrow}
                  onClick={() => onChangeIsUpthrow(false)}
                />
                <span style={{color: '#666'}}>签约</span>
                <InfoCircleFilled style={{color: '#C7C7C7', fontSize: 16, marginLeft: 20}}/>
              </div>
            </div>

            {!activeResource?.upthrow &&
            <>
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
            </>
            }
          </div>
        </div>
      </div>
    </>
  </>);
}
