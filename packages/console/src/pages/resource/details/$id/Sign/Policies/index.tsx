import * as React from 'react';
import styles from './index.less';
import { Checkbox, Space } from 'antd';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceDetailPageModelState } from '@/models/connect';
import { ChangeAction } from '@/models/resourceDetailPage';
import { FContentText, FTitleText } from '@/components/FText';
import FPolicyDisplay from '@/components/FPolicyDisplay';
import FFullScreen from '@/components/FIcons/FFullScreen';
// import FUtil1 from '@/utils';
// import FSwitch from '@/components/FSwitch';
import FModal from '@/components/FModal';

interface PoliciesProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState;
}

function Policies({ dispatch, resourceDetailPage }: PoliciesProps) {

  const [visibleModalPolicyID, setVisibleModalPolicyID] = React.useState<string>('');

  const policies = resourceDetailPage.sign_SignResources.find((r) => r.selected)?.policies;

  // console.log(policies, 'policies@#$rsafd980judsafsad');

  if (!policies || policies.filter((p) => p.fullInfo.status !== 0).length === 0) {
    return null;
  }

  const isSignedNode: boolean = resourceDetailPage.sign_SignedNodeIDs.includes(resourceDetailPage.sign_SelectedNodeID);

  const modalPolicy = policies.find((pl) => {
    return pl.fullInfo.policyId === visibleModalPolicyID;
  });

  function onChangeResourceChecked(id: string, checked: boolean) {
    dispatch<ChangeAction>({
      type: 'resourceDetailPage/change',
      payload: {
        sign_SignResources: resourceDetailPage.sign_SignResources.map((sr) => {
          if (!sr.selected) {
            return sr;
          }
          return {
            ...sr,
            policies: sr.policies.map((srp) => {
              if (srp.fullInfo.policyId !== id) {
                return srp;
              }
              return {
                ...srp,
                checked: checked,
              };
            }),
          };
        }),
      },
    });
  }

  return (<div>
    <div className={styles.smallTitle}>{isSignedNode ? '未签约策略' : '可进行签约的策略'}</div>
    <div style={{ height: 5 }} />
    {
      policies.filter((p) => p.fullInfo.status !== 0).map((p) => {
        return (<div
          className={styles.singPolicy}
          key={p.fullInfo.policyId}
        >
          <div className={styles.singPolicyTitle}>
            <FContentText text={p.fullInfo.policyName} type='highlight' />
            {
              !isSignedNode && (<Checkbox
                checked={p.checked}
                disabled={p.fullInfo.status === 0}
                onChange={(e) => {
                  onChangeResourceChecked(p.fullInfo.policyId, e.target.checked);
                }}
              />)
            }

          </div>
          {/*<pre>{p.text}</pre>*/}
          <div style={{ height: 10 }} />
          <div style={{ padding: '0 15px' }}>
            <FPolicyDisplay
              // code={p.fullInfo}
              fullInfo={p.fullInfo}
              // containerHeight={170}
            />
          </div>
          <a
            className={styles.PolicyFullScreenBtn}
            onClick={() => {
              // setFullScreenVisible(true);
              setVisibleModalPolicyID(p.fullInfo.policyId);
            }}
          ><FFullScreen style={{ fontSize: 12 }} /></a>


        </div>);
      })
    }

    <FModal
      title={null}
      visible={!!visibleModalPolicyID}
      onCancel={() => {
        setVisibleModalPolicyID('');
      }}
      width={1240}
      footer={null}
      centered
    >
      <div className={styles.ModalTile}>
        <FTitleText text={modalPolicy?.fullInfo.policyName || ''} type='h2' />
        <div style={{ width: 20 }} />

        {
          !isSignedNode && (<Checkbox
            checked={modalPolicy?.checked}
            disabled={modalPolicy?.fullInfo.status === 0}
            onChange={(e) => {
              onChangeResourceChecked(modalPolicy?.fullInfo.policyId || '', e.target.checked);
            }}
          />)
        }
      </div>
      <div style={{ padding: '0 15px' }}>
        {
          modalPolicy && (<FPolicyDisplay
            containerHeight={770}
            // code={modalPolicy?.text || ''}
            fullInfo={modalPolicy.fullInfo}
          />)
        }

      </div>
    </FModal>
  </div>);
}

export default connect(({ resourceDetailPage }: ConnectState) => ({ resourceDetailPage }))(Policies);

// interface PolicyCardProps {
//   name: string;
//   code: string;
//   checked: boolean;
//
//   onChangeChecked?(checked: boolean): void;
// }
//
// function PolicyCard({ name, code, checked }: PolicyCardProps) {
//
// }
