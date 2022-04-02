import * as React from 'react';
import styles from './index.less';
import FCheckbox from '../FCheckbox';

interface FContractAppliedVersionsProps {
  versionAndPolicyIDs: {
    version: string;
    policyIDs: string[];
  }[];
  currentPolicyID: string;

  onChangeVersionContractIDs?(changedIDs: FContractAppliedVersionsProps['versionAndPolicyIDs'][number], allIDs: FContractAppliedVersionsProps['versionAndPolicyIDs']): void;
}

function FContractAppliedVersions({
                     versionAndPolicyIDs,
                     currentPolicyID,
                     onChangeVersionContractIDs,
                   }: FContractAppliedVersionsProps) {
  return (<div className={styles.resourceVersions}>
    {
      versionAndPolicyIDs.map((vai, ind, list) => {
        const checked: boolean = vai.policyIDs.includes(currentPolicyID);
        return (<div key={vai.version}>
          <FCheckbox
            checked={checked}
            disabled={checked && vai.policyIDs.length === 1}
            onChange={(e) => {
              const versionPolicyIDs: FContractAppliedVersionsProps['versionAndPolicyIDs'][number] = {
                ...vai,
                policyIDs: e.target.checked
                  ? [
                    ...vai.policyIDs,
                    currentPolicyID,
                  ]
                  : vai.policyIDs.filter((c) => c !== currentPolicyID),
              };

              const all: FContractAppliedVersionsProps['versionAndPolicyIDs'] = list.map((ea) => {
                if (ea.version !== vai.version) {
                  return ea;
                }
                return versionPolicyIDs;
              });

              onChangeVersionContractIDs && onChangeVersionContractIDs(versionPolicyIDs, all);
              // onChangeVersionAllContractIDs && onChangeVersionAllContractIDs(all);
            }}
          />
          <span style={{
            display: 'inline-block',
            paddingLeft: 5,
          }}>{vai.version}</span>
        </div>);
      })
    }
  </div>);
}

export default FContractAppliedVersions;
