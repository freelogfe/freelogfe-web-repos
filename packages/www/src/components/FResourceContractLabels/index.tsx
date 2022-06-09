import * as React from 'react';
import styles from './index.less';
import { FWarning } from '@/components/FIcons';
// import F_Contract_And_Policy_Labels from '@/components/F_Contract_And_Policy_Labels';
import FComponentsLib from '@freelog/components-lib';

interface FResourceContractLabelsProps {
  contracts: {
    name: string;
    auth: boolean;
  }[];
}

function FResourceContractLabels({ contracts }: FResourceContractLabelsProps) {

  if (contracts.length === 0) {
    return (<div className={styles.noLabels}>
      <FWarning style={{ fontSize: 14 }} />
      <span style={{ paddingLeft: 5 }}>无有效合约</span>
    </div>);
  }

  return (<FComponentsLib.F_Contract_And_Policy_Labels
    data={contracts.map((c) => {
      return {
        text: c.name,
        dot: c.auth ? 'green' : 'yellow',
      };
    })}
    // singleRow={true}
  />);

  // return (<div className={styles.labels}>
  //   {
  //     contracts.map((c, i) => (<div key={i}>
  //       <span>{c.name}</span>
  //       <div style={{ width: 5 }} />
  //       <label style={{ backgroundColor: c.auth ? '#42C28C' : '#E9A923' }} />
  //     </div>))
  //   }
  // </div>);
}

export default FResourceContractLabels;
