import * as React from 'react';
import styles from "./index.less";
import {FContentText} from "@/components/FText";

interface ResourcesProps {
  dataSource: {
    id: string | number;
    activated: boolean;
    title: string;
    resourceType: string;
    version: string;
    labels: string[];
  }[];
}

export default function Resources({dataSource}: ResourcesProps) {
  return <div className={styles.styles}>
    {dataSource.map((i) => (
      <div
        key={i.id}
        className={styles.DepPanelNav + ' ' + (i.activated ? styles.DepPanelNavActive : '')}>
        <div>
          <FContentText text={i.title}/>
          <div style={{height: 9}}/>
          <FContentText type="additional2">
            <span>{i.resourceType} | 版本范围：{i.version}</span>
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
