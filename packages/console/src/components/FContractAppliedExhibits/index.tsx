import * as React from 'react';
import styles from './index.less';
import { FContentText } from '@/components/FText';
import FUtil1 from '@/utils';
import FSwitch from '@/components/FSwitch';
import { FetchInfoAction, UpdateContractUsedAction } from '@/models/exhibitInfoPage';
import { Space } from 'antd';
import { FUtil } from '@freelog/tools-lib';

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

  onChangeVersionContractIDs?(params: OnChangeExhibitContractIDsParams): void;
}

function FContractAppliedExhibits({
                                    currentPolicyID,
                                    exhibitAndPolicyIDs,
                                    onChangeVersionContractIDs,
                                  }: FContractAppliedExhibitsProps) {

  return (<div className={styles.nodeExhibits}>
    {
      exhibitAndPolicyIDs.map((eac, ind, list) => {
        const checked: boolean = eac.policyIDs.includes(currentPolicyID);
        return (<div key={eac.exhibitID} className={styles.nodeExhibit}>
          <Space size={5}>
            <label className={styles.nodeExhibitLabel}>展品</label>
            {/*<a className={styles.nodeExhibitNameLink}>{eac.exhibitName}</a>*/}
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

              onChangeVersionContractIDs && onChangeVersionContractIDs({
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
