import * as React from 'react';
import styles from './index.less';
import FSwitch from '@/components/FSwitch';
import { Space } from 'antd';
import { FUtil } from '@freelog/tools-lib';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';

interface OnChangeExhibitContractIDsParams {
  changed: {
    exhibitID: string;
    checked: boolean;
  };
  changedIDs: FContractAppliedExhibitsProps['exhibitAndPolicyIDs'][number];
  changedAllIDs: FContractAppliedExhibitsProps['exhibitAndPolicyIDs'];
}

interface FContractAppliedExhibitsProps {
  currentPolicyID: string;
  exhibitAndPolicyIDs: {
    exhibitID: string;
    exhibitName: string;
    exhibitDetailsUrl: string;
    policyIDs: string[];
  }[];

  onChangeExhibitContractIDs?(params: OnChangeExhibitContractIDsParams): void;
}

function FContractAppliedExhibits({
                                    currentPolicyID,
                                    exhibitAndPolicyIDs,
                                    onChangeExhibitContractIDs,
                                  }: FContractAppliedExhibitsProps) {

  return (<div className={styles.nodeExhibits}>
    {
      exhibitAndPolicyIDs.map((eac, ind, list) => {
        const checked: boolean = eac.policyIDs.includes(currentPolicyID);
        return (<div key={eac.exhibitID} className={styles.nodeExhibit}>
          <Space size={5}>
            {/*<label className={styles.nodeExhibitLabel}>展品</label>*/}
            {/*<a className={styles.nodeExhibitNameLink}>{eac.exhibitName}</a>*/}
            <FIdentityTypeBadge status={'exhibit'} />
            <a
              type='default'
              className={styles.nodeExhibitNameLink}
              onClick={() => {
                window.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.exhibitManagement({ exhibitID: eac.exhibitID }));
              }}
            >{eac.exhibitName}</a>
          </Space>

          <FSwitch
            checked={checked}
            disabled={checked && eac.policyIDs.length === 1}
            onChange={(value) => {
              const exhibitContractIDs: FContractAppliedExhibitsProps['exhibitAndPolicyIDs'][number] = {
                ...eac,
                policyIDs: value
                  ? [
                    ...eac.policyIDs,
                    currentPolicyID,
                  ]
                  : eac.policyIDs.filter((c) => c !== currentPolicyID),
              };

              const all: FContractAppliedExhibitsProps['exhibitAndPolicyIDs'] = list.map((ea) => {
                if (ea.exhibitID !== eac.exhibitID) {
                  return ea;
                }
                return exhibitContractIDs;
              });

              onChangeExhibitContractIDs && onChangeExhibitContractIDs({
                changed: {
                  exhibitID: eac.exhibitID,
                  checked: value,
                },
                changedIDs: exhibitContractIDs,
                changedAllIDs: all,
              });
            }}
          />
        </div>);
      })
    }

  </div>);
}

export default FContractAppliedExhibits;

interface ServerData_2_ContractAppliedExhibits_Params {
  data: {
    presentableId: string;
    presentableName: string;
    resolveResources: {
      contracts: {
        contractId: string;
        policyId: string;
      }[];
      resourceId: string;
      resourceName: string;
    }[];
  }[];
  currentResourceID: string;
}

export function serverData_2_ContractAppliedExhibits({
                                                       data,
                                                       currentResourceID,
                                                     }: ServerData_2_ContractAppliedExhibits_Params): FContractAppliedExhibitsProps['exhibitAndPolicyIDs'] {
  return data.map((dd) => {
    const resource = dd.resolveResources.find((rr) => {
      return rr.resourceId === currentResourceID;
    });
    return {
      exhibitID: dd.presentableId,
      exhibitName: dd.presentableName,
      exhibitDetailsUrl: FUtil.LinkTo.exhibitManagement({ exhibitID: dd.presentableId }),
      policyIDs: resource ? resource.contracts.map((c) => {
        return c.policyId;
      }) : [],
    };
  });
}
