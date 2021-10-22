import * as React from 'react';
import styles from './index.less';
import { FInfo } from '@/components/FIcons';
import FPopover from '@/components/FPopover';
import FTooltip from '@/components/FTooltip';
import FUtil1 from '@/utils';

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
      <FTooltip title={FUtil1.I18n.message('info_upcast').split('\n').map((u) => {
        return (<div>{u}</div>);
      })}>
        <div style={{ cursor: 'pointer' }}>
          <FInfo style={{ fontSize: 14 }} />
        </div>
      </FTooltip>
    </div>
  </div>);
}

export default FBasicUpcastCard;
