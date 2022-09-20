import * as React from 'react';
import styles from './index.less';
import { FInfo } from '../FIcons';
import FTooltip from '../FTooltip';
// import FUtil1 from '@/utils';
import { FI18n } from '@freelog/tools-lib';

interface FBasicUpcastCardProps {
  dataSource: {
    resourceID: string;
    resourceName: string;
  }[];

  onClick?(resourceID: string): void;
}

function FBasicUpcastCard({ dataSource, onClick }: FBasicUpcastCardProps) {
  return (<div className={styles.styles}>
    <div style={{ height: 10 }} />
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
      <div style={{ width: 5 }} />
      <FTooltip title={FI18n.i18nNext.t('info_basic_upcast').split('\n').map((u, i) => {
        return (<div key={i}>{u}</div>);
      })}>
        <div style={{ cursor: 'pointer' }}>
          <FInfo style={{ fontSize: 14 }} />
        </div>
      </FTooltip>
    </div>
  </div>);
}

export default FBasicUpcastCard;
