import * as React from 'react';
import styles from './index.less';
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
      <FComponentsLib.FIcons.FWarning style={{ fontSize: 14 }} />
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
  />);
}

export default FResourceContractLabels;
