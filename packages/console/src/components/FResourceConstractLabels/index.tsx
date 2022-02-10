import * as React from 'react';
import styles from './index.less';
import { FWarning } from '@/components/FIcons';

interface FResourceContractLabelsProps {
  contracts: {
    name: string;
    auth: 'active' | 'testActive';
  }[];
}

function FResourceContractLabels({ contracts }: FResourceContractLabelsProps) {

  if (contracts.length === 0) {
    return (<div className={styles.noLabels}>
      <FWarning style={{ fontSize: 14 }} />
      <span style={{ paddingLeft: 5 }}>无有效合约</span>
    </div>);
  }

  return (<div className={styles.labels}>
    {
      contracts.map((c, i) => (<div key={i}>
        <span>{c.name}</span>
        <div style={{ width: 5 }} />
        <label style={{ backgroundColor: c.auth === 'active' ? '#42C28C' : '#E9A923' }} />
      </div>))
    }
  </div>);
}

export default FResourceContractLabels;
