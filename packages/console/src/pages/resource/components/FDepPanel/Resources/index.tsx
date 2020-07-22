import * as React from 'react';
import styles from "./index.less";
import {FContentText} from "@/components/FText";
import {FCircleButton} from "@/components/FButton";
import {EditOutlined} from '@ant-design/icons';
import VersionPopover from './VersionPopover';

export interface ResourcesProps {
  dataSource: {
    id: string | number;
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
    labels: string[];
    upthrow: boolean;
  }[];
  onClick?: (resource: ResourcesProps['dataSource'][0]) => void;
  onChange?: (resource: ResourcesProps['dataSource'][0]) => void;
  onDelete?: (resource: ResourcesProps['dataSource'][0]) => void;
}

export default function Resources({dataSource, onClick, onChange, onDelete}: ResourcesProps) {

  function onChangeVersion(version: ResourcesProps['dataSource'][0]['version'], id: ResourcesProps['dataSource'][0]['id']) {
    const resource: ResourcesProps['dataSource'][0] = dataSource.find((i) => i.id === id) as ResourcesProps['dataSource'][0];
    return onChange && onChange({
      ...resource,
      version,
    })
  }

  return <div className={styles.styles}>
    {dataSource.map((i) => (
      <div
        key={i.id}
        onClick={() => onClick && onClick(i)}
        className={styles.DepPanelNav + ' ' + (i.activated ? styles.DepPanelNavActive : '')}>
        <div>
          <FContentText text={i.title}/>
          <div style={{height: 9}}/>
          <FContentText type="additional2">
            <div>{i.resourceType} |
              <span
                style={{paddingRight: 5}}>版本范围：{i.version.isCustom ? i.version.input : ((i.version.allowUpdate ? '^' : '') + i.version.select)}</span>
              <VersionPopover
                versions={i.versions}
                onChange={(version) => onChangeVersion(version, i.id)}
                defaultVersion={i.version}><EditOutlined/></VersionPopover>
            </div>
          </FContentText>
          <>
            <div style={{height: 9}}/>
            <div className={styles.DepPanelLabels}>
              {
                i.labels.map((j: string) => (<label
                  key={j}
                  className={styles.labelInfo}
                >{j}</label>))
              }
            </div>
          </>
        </div>
        <FCircleButton onClick={(e) => {
          e.stopPropagation();
          return onDelete && onDelete(i)
        }} theme='delete'/>
      </div>))}
  </div>
}


