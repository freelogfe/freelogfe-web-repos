import * as React from 'react';
import styles from './index.less';
import {FInfo} from "@/components/FIcons";

interface FBasicUpcastCardProps {
  dataSource: {
    resourceID: string;
    resourceName: string;
  }[];

  onClick?(resourceID: string): void;
}

function FBasicUpcastCard({dataSource, onClick}: FBasicUpcastCardProps) {
  return (<div className={styles.styles}>
    <div style={{height: 10}}/>
    <div className={styles.redBorder}>
      <div className={styles.baseUpthrow}>
        {
          dataSource.map((ds) => {
            return (<label
              key={ds.resourceID}
              onClick={() => {
                onClick && onClick(ds.resourceID);
              }}
            >{ds.resourceName}</label>);
          })
        }
      </div>
    </div>
    <div className={styles.title}>
      <span>基础上抛</span>
      <div style={{width: 5}}/>
      <FInfo style={{fontSize: 14}}/>
    </div>
  </div>);
}

export default FBasicUpcastCard;
