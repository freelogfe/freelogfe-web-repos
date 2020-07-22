import * as React from 'react';

import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import {EditOutlined, InfoCircleFilled, ExclamationCircleFilled} from '@ant-design/icons';
import {Radio, Checkbox, Space} from 'antd';
import Resources, {ResourcesProps} from './Resources';
import Contracts from "./Contracts";
import Policies from "./Policies";
import UpthrowList from "./UpthrowList";
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
    }));
  }

  function onChangeContracts(contracts: FDepPanelProps['dataSource'][0]['enableReuseContracts']) {
    return onChange && onChange(dataSource.map((i) => {
      if (i.id !== activeResource?.id) {
        return i;
      }
      return {
        ...i,
        enableReuseContracts: contracts,
      };
    }));
  }

  function onChangePolicies(policies: FDepPanelProps['dataSource'][0]['enabledPolicies']) {
    return onChange && onChange(dataSource.map((i) => {
      if (i.id !== activeResource?.id) {
        return i;
      }
      return {
        ...i,
        enabledPolicies: policies,
      };
    }));
  }


  if (!dataSource || dataSource.length === 0) {
    return null;
  }

  return (<>
    <UpthrowList labels={dataSource.filter((i) => i.upthrow).map((j) => j.title)}/>
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
                  labels: [
                    ...i.enableReuseContracts.filter((i) => i.checked).map((j) => j.title),
                    ...i.enabledPolicies.filter((i) => i.checked).map((j) => j.title)
                  ],
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
              {
                activeResource && activeResource.enableReuseContracts.length > 0 && (<>
                  <div style={{height: 20}}/>
                  <FContentText type="additional2" text={'可复用的合约'}/>
                  <div style={{height: 5}}/>
                  <Contracts
                    dataSource={activeResource.enableReuseContracts}
                    onChange={onChangeContracts}
                  />
                </>)
              }

              {
                activeResource && activeResource.enabledPolicies.length > 0 && (<>
                  <div style={{height: 20}}/>
                  <FContentText type="additional2" text={'可签约的策略'}/>
                  <div style={{height: 5}}/>
                  <Policies
                    dataSource={activeResource.enabledPolicies}
                    onChange={onChangePolicies}
                  />
                </>)
              }

            </>
            }
          </div>
        </div>
      </div>
    </>
  </>);
}
