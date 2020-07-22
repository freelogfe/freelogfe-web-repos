import * as React from 'react';

import styles from './index.less';
import {FTitleText} from "@/components/FText";
import {ExclamationCircleFilled} from '@ant-design/icons';

interface UpthrowListProps {
  labels: string[];
}

export default function ({labels}: UpthrowListProps) {
  if (!labels || labels.length === 0) {
    return null;
  }
  return (<>
    <div style={{height: 30}}/>
    <div className={styles.depUpthrow}>
      <FTitleText text={'基础上抛'} type="form"/>
      <ExclamationCircleFilled style={{color: '#C7C7C7', marginLeft: 5}}/>
      <div className={styles.depUpthrowLabel}>
        {
          labels.map((j) => <label key={j}>{j}</label>)
        }
      </div>
    </div>
  </>)
}
