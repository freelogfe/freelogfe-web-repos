import * as React from 'react';
import styles from "./index.less";
import {FContentText} from "@/components/FText";
import {FCircleButton} from "@/components/FButton";
import {EditOutlined} from '@ant-design/icons';
import VersionPopover from './VersionPopover';
import {FDepPanelProps} from "@/pages/resource/components/FDepPanel";

export interface ResourcesProps {
  readonly dataSource: FDepPanelProps['dataSource'];
  readonly activatedID: string | number;
  readonly onClick?: (resourceID: string | number) => void;
  readonly onChange?: (resource: ResourcesProps['dataSource'][0]) => void;
  readonly onDelete?: (resourceID: string | number) => void;
}

export default function Resources({dataSource, activatedID, onClick, onChange, onDelete}: ResourcesProps) {
  // console.log(dataSource, 'dataSourcedataSource');

  function onChangeVersion(version: ResourcesProps['dataSource'][0]['version'], id: ResourcesProps['dataSource'][0]['id']) {
    const resource: ResourcesProps['dataSource'][0] = dataSource.find((i) => i.id === id) as ResourcesProps['dataSource'][0];
    return onChange && onChange({
      ...resource,
      version,
    });
  }

  return <div className={styles.styles}>
    {dataSource?.map((i) => {
        if (!i?.version) {
          return null;
        }
        return (<div key={i.id}>
          <div
            onClick={() => onClick && onClick(i.id)}
            className={styles.DepPanelNav + ' ' + (i.id === activatedID ? styles.DepPanelNavActive : '')}>
            <div>
              <FContentText text={i.title}/>
              <div style={{height: 9}}/>
              <FContentText type="additional2">
                <div>{i.resourceType} |
                  <span
                    style={{paddingRight: 5}}>版本范围：{i?.version?.isCustom ? i.version.input : ((i.version?.allowUpdate ? '^' : '') + i.version.select)}</span>
                  <VersionPopover
                    versions={i.versions}
                    onChange={(version) => onChangeVersion(version, i.id)}
                    defaultVersion={i.version}><EditOutlined/></VersionPopover>
                </div>
              </FContentText>
              <>
                <div style={{height: 5}}/>
                <div className={styles.DepPanelLabels}>
                  {
                    !i.upthrow && [...i.enableReuseContracts, ...i.enabledPolicies]
                      .filter((k) => k.checked)
                      .map((j) => (<label
                      key={j.id}
                      className={styles.labelInfo}
                    >{j.title}</label>))
                  }
                  {
                    i.upthrow && (<label
                      className={styles.labelError}
                    >上抛</label>)
                  }
                </div>
              </>
            </div>
            <FCircleButton onClick={(e) => {
              e.stopPropagation();
              return onDelete && onDelete(i.id)
            }} theme='delete'/>
          </div>

          <SmallNav
            dataSource={i.unresolved || []}
            activatedID={activatedID}
            onClick={onClick}
          />

        </div>);
      }
    )}
  </div>
}

interface SmallNavProps {
  dataSource: FDepPanelProps['dataSource'];
  activatedID: string | number;
  readonly onClick?: (resourceID: string | number) => void;
}

function SmallNav({dataSource, activatedID, onClick}: SmallNavProps) {
  if (dataSource.length === 0) {
    return null;
  }

  return (<div className={styles.children}>
    <div style={{padding: '5px 0 5px 20px'}}>
      <FContentText type="additional2" text={'此资源存在以下基础上抛'}/>
    </div>
    {
      dataSource.map((i) => (
        <div
          key={i.id}
          onClick={() => onClick && onClick(i.id)}
          className={styles.childrenDepPanelNav + ' ' + (activatedID === i.id ? styles.DepPanelNavActive : '')}>
          <FContentText text={i.title}/>
          <div style={{height: 5}}/>
          <FContentText type="additional2">
            <div>{i.resourceType}</div>
          </FContentText>
          <>
            <div style={{height: 5}}/>
            <div className={styles.DepPanelLabels}>
              {
                !i.upthrow && [...i.enableReuseContracts, ...i.enabledPolicies].map((j) => (<label
                  key={j.id}
                  className={styles.labelInfo}
                >{j.title}</label>))
              }
              {
                i.upthrow && (<label
                  className={styles.labelError}
                >上抛</label>)
              }
            </div>
          </>
        </div>))
    }

  </div>);
}
