import * as React from 'react';
import { FTipText } from '@/components/FText';
import styles from './index.less';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceAuthPageModelState } from '@/models/connect';
import { ChangeAction, UpdatePoliciesAction } from '@/models/resourceAuthPage';
import FPolicyBuilderDrawer from '@/components/FPolicyBuilderDrawer';
import FUtil1 from '@/utils';
import { FRectBtn } from '@/components/FButton';
import FPolicyList from '@/components/FPolicyList';

interface FPoliciesProps {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
}

function FPolicies({ dispatch, resourceAuthPage }: FPoliciesProps) {

  function onPolicyStatusChange(id: string, status: boolean) {
    dispatch<UpdatePoliciesAction>({
      type: 'resourceAuthPage/updatePolicies',
      payload: {
        updatePolicies: [{
          policyId: id,
          status: status ? 1 : 0,
        }],
      },
    });
  }

  function openNewVisible() {
    dispatch<ChangeAction>({
      type: 'resourceAuthPage/change',
      payload: {
        policyEditorVisible: true,
      },
    });
  }

  function closeNewVisible() {
    dispatch<ChangeAction>({
      type: 'resourceAuthPage/change',
      payload: {
        policyEditorVisible: false,
      },
    });
  }

  return (<div className={styles.FPoliciesStyles}>
    {
      resourceAuthPage.policies?.length === 0
        ? (<div className={styles.empty}>
          <FTipText
            type='second'
            text={FUtil1.I18n.message('hint_add_authorization_plan')}
          />
          <div style={{ height: 20 }} />
          <FRectBtn
            onClick={openNewVisible}>{'添加授权策略'}</FRectBtn>
        </div>)
        : <FPolicyList
          dataSource={resourceAuthPage.policies.map((p) => {
            return {
              id: p.policyId,
              name: p.policyName,
              using: p.status === 1,
              text: p.policyText,
            };
          })}
          onCheckChange={(data) => {
            onPolicyStatusChange(data.id, data.using);
          }}
        />
    }

    <FPolicyBuilderDrawer
      visible={resourceAuthPage.policyEditorVisible}
      alreadyUsedTexts={resourceAuthPage.policies.map<string>((ip) => {
        return ip.policyText;
      })}
      alreadyUsedTitles={resourceAuthPage.policies.map((ip) => {
        return ip.policyName;
      })}
      onCancel={closeNewVisible}
      onConfirm={({ title, text }) => {
        dispatch<UpdatePoliciesAction>({
          type: 'resourceAuthPage/updatePolicies',
          payload: {
            addPolicies: [{
              policyName: title,
              policyText: window.encodeURIComponent(text),
            }],
          },
        });
        dispatch<ChangeAction>({
          type: 'resourceAuthPage/change',
          payload: {
            policyEditorVisible: false,
          },
        });
      }}
    />

  </div>);
}

export default connect(({ resourceAuthPage }: ConnectState) => ({
  resourceAuthPage: resourceAuthPage,
}))(FPolicies);
