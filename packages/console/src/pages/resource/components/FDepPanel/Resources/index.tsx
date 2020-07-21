import * as React from 'react';
import styles from "./index.less";
import {FContentText} from "@/components/FText";
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
}

export default function Resources({dataSource, onClick, onChange}: ResourcesProps) {

  function onChangeVersion() {

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
      </div>))}
  </div>
}


