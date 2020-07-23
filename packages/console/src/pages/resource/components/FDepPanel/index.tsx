import * as React from 'react';

import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import {EditOutlined, InfoCircleFilled, CopyOutlined} from '@ant-design/icons';
import {Radio, Checkbox, Space, Drawer} from 'antd';
import Resources, {ResourcesProps} from './Resources';
import Contracts from "./Contracts";
import Policies from "./Policies";
import UpthrowList from "./UpthrowList";
import Market from "./Market";

export interface DepResources {
  readonly id: string;
  readonly title: string;
  readonly resourceType: string;
  readonly time?: string;
  readonly version: {
    readonly isCustom: boolean;
    readonly select: string;
    readonly allowUpdate: boolean;
    readonly input: string;
  };
  readonly versions: string[];
  readonly upthrow: boolean;
  readonly enableReuseContracts: {
    readonly checked: boolean;
    readonly title: string;
    readonly status: 'executing' | 'stopped';
    readonly code: string;
    readonly id: string;
    readonly date: string;
    readonly versions: string[];
  }[];
  readonly enabledPolicies: {
    readonly checked: boolean;
    readonly id: string;
    readonly title: string;
    readonly code: string;
  }[];
  readonly unresolved?: DepResources[];
}

interface Relationship {
  readonly id: string;
  readonly children: {
    readonly id: string;
  }[];
}

export interface FDepPanelProps {
  readonly dataSource: DepResources[];
  readonly relationships: Relationship[];
  readonly onChange?: (dataSource: FDepPanelProps['dataSource']) => void;
  readonly onChangeRelationships?: (relationships: FDepPanelProps['relationships']) => void;
}

export default function ({dataSource, relationships, onChange, onChangeRelationships}: FDepPanelProps) {

  const [activeResource, setActiveResource] = React.useState<FDepPanelProps['dataSource'][0] | null>(null);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [activatedID, setActivatedID] = React.useState<string | number>('');

  // 删除无用的数据源
  // React.useEffect(() => {
  //   const set = new Set();
  //   for (const i of relationships) {
  //     set.add(i.id);
  //     for (const j of i.children) {
  //       set.add(j.id);
  //     }
  //   }
  //   onChange && onChange(dataSource.filter((i) => !set.has(i.id)));
  // }, [relationships]);

  // 自动刷新当前激活的资源信息
  React.useEffect(() => {
    const resource = dataSource.find((i) => i.id === activatedID);
    setActiveResource(resource || null);
  }, [dataSource, activatedID]);

  // 自动激活一个资源ID
  React.useEffect(() => {
    for (const i of relationships) {
      if (i.id === activatedID) {
        return;
      }
      for (const j of i.children) {
        if (j.id === activatedID) {
          return;
        }
      }
    }
    setActivatedID(relationships.length > 0 ? relationships[0].id : '');
  }, [activatedID, relationships]);

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

  function onChangeResourcesActivated(value: string | number) {
    setActivatedID(value);
  }

  function onDeleteResource(value: string | number) {
    let resources = relationships.filter((i) => i.id !== value);
    onChangeRelationships && onChangeRelationships(resources);
    const usedResourceID: string[] = [];
    for (const i of resources) {
      usedResourceID.push(i.id);
      for (const j of i.children) {
        usedResourceID.push(j.id);
      }
    }
    return onChange && onChange(dataSource.filter((i) => usedResourceID.includes(i.id)));
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

  function addDepResource(resource: DepResources) {
    // console.log(resource, 'valuevalue');
    // const [data, rela] = marketToDep(value),

    const addResource = [
      resource,
      ...(resource.unresolved || []),
    ];
    const allResourceID = dataSource.map((i) => i.id);

    const enabledAddResource = addResource.filter((i) => !allResourceID.includes(i.id));

    onChange && onChange([
      ...enabledAddResource,
      ...dataSource,
    ]);

    return onChangeRelationships && onChangeRelationships([
      {
        id: resource.id,
        children: (resource.unresolved || []).map((i) => ({id: i.id})),
      },
      ...relationships,
    ]);
  }


  return (<>
    <Space size={80}>
      <Space size={10}>
        <FCircleButton onClick={() => setModalVisible(true)} theme="weaken"/>
        <FContentText text={'添加'}/>
      </Space>
      <Space size={10}>
        <FCircleButton theme="weaken" icon={<CopyOutlined/>}/>
        <FContentText text={'从上一版本导入'}/>
      </Space>
    </Space>

    {relationships.length > 0 && (<>
      <UpthrowList
        labels={Array.from(new Set(dataSource.filter((i) => i.upthrow).map((j) => j.title)))}
      />

      <div style={{height: 20}}/>
      <div className={styles.DepPanel}>
        <div className={styles.DepPanelNavs}>
          <div>
            <div>
              <Resources
                activatedID={activatedID}
                // @ts-ignore
                dataSource={relationships.map((i) => {
                  return {
                    ...dataSource.find((j) => j.id === i.id),
                    unresolved: i.children.map((k) => {
                      return dataSource.find((l) => k.id === l.id)
                    })
                  }
                })}
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
    </>)}

    <Drawer
      title={'添加依赖'}
      onClose={() => setModalVisible(false)}
      visible={modalVisible}
      width={820}
      bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
    >
      <Market
        addedResourceID={relationships.map((i) => i.id)}
        onSelect={addDepResource}
      />
    </Drawer>
  </>);
}


// function marketToDep(value: MarketResource): DepResources[] {
//   return {
//     id: value.id,
//     title: value.name,
//     resourceType: value.resourceType,
//     version: {
//       isCustom: false,
//       select: value.versions[0],
//       allowUpdate: true,
//       input: '',
//     },
//     versions: value.versions,
//     upthrow: false,
//     enableReuseContracts: value.enableReuseContracts.map((i) => ({
//       checked: true,
//       title: i.title,
//       status: i.status,
//       code: i.code,
//       id: i.id,
//       date: i.date,
//       versions: i.versions,
//     })),
//     enabledPolicies: value.enabledPolicies.map((i) => ({
//       checked: true,
//       id: i.id,
//       title: i.title,
//       code: i.title,
//     })),
//     unresolved: [],
//   };
// }
