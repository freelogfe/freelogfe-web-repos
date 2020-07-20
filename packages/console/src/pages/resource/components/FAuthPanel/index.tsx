import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import Resources from './Resources';
import Contracts from './Contracts';
import Policies from './Policies';

export interface FAuthPanelProps {
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
      versions: { version: string; checked: boolean; }[];
    }[];
    policies: {
      id: string;
      title: string;
      code: string;
    }[];
  }[];
}

export default function ({dataSource}: FAuthPanelProps) {
  return (<div className={styles.DepPanel}>
    <div className={styles.DepPanelNavs}>
      <div>
        <Resources
          dataSource={dataSource.map((i) => ({
            id: i.id,
            activated: i.activated,
            title: i.title,
            resourceType: i.resourceType,
            version: i.version,
            labels: i.contracts.map((j) => j.title)
          }))}
        />
      </div>
    </div>
    <div className={styles.DepPanelContent}>
      <div>
        <FContentText type="additional2" text={'可复用的合约'}/>
        <div style={{height: 5}}/>
        <Contracts dataSource={dataSource[0].contracts}/>

        <div style={{height: 20}}/>
        <FContentText type="additional2" text={'可签约的合约'}/>
        <div style={{height: 5}}/>
        <Policies dataSource={dataSource[0].policies}/>
      </div>
    </div>
  </div>);
}
