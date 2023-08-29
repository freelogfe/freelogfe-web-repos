import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceAuthPageModelState } from '@/models/connect';
import { ChangeAction, OnAdd_Policy_Action, UpdatePoliciesAction } from '@/models/resourceAuthPage';
import FPolicyBuilderDrawer from '@/components/FPolicyBuilderDrawer';
import FPolicyList from '@/components/FPolicyList';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface FPoliciesProps {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
}

function FPolicies({ dispatch, resourceAuthPage }: FPoliciesProps) {

  // function onPolicyStatusChange(id: string, status: boolean) {
  //   dispatch<UpdatePoliciesAction>({
  //     type: 'resourceAuthPage/updatePolicies',
  //     payload: {
  //       updatePolicies: [{
  //         policyId: id,
  //         status: status ? 1 : 0,
  //       }],
  //     },
  //   });
  // }

  // function openNewVisible() {
  //   dispatch<ChangeAction>({
  //     type: 'resourceAuthPage/change',
  //     payload: {
  //       policyEditorVisible: true,
  //     },
  //   });
  // }

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
      resourceAuthPage.policies.length === 0
        ? (<div className={styles.empty}>
          <FComponentsLib.FTipText
            type='second'
            text={FI18n.i18nNext.t('hint_add_authorization_plan')}
          />
          <div style={{ height: 20 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FComponentsLib.FRectBtn
              onClick={() => {
                dispatch<OnAdd_Policy_Action>({
                  type: 'resourceAuthPage/onAdd_Policy',
                });
              }}>{'添加授权策略'}</FComponentsLib.FRectBtn>
            <div style={{
              backgroundColor: 'red',
              borderRadius: '50%',
              width: 4,
              height: 4,
            }} />
          </div>
        </div>)
        : (<FPolicyList
          atLeastOneUsing={resourceAuthPage.status === 1}
          dataSource={resourceAuthPage.policies}
          onCheckChange={(data) => {
            if (data.using) {
              self._czc?.push(['_trackEvent', '授权信息页', '上线', '', 1]);
            }
            // onPolicyStatusChange(data.id, data.using);
            dispatch<UpdatePoliciesAction>({
              type: 'resourceAuthPage/updatePolicies',
              payload: {
                updatePolicies: [{
                  policyId: data.id,
                  status: data.using ? 1 : 0,
                }],
              },
            });
          }}
        />)
    }

    <FPolicyBuilderDrawer
      visible={resourceAuthPage.policyEditorVisible}
      alreadyUsedTexts={resourceAuthPage.policies.map<string>((ip) => {
        return ip.policyText;
      })}
      alreadyUsedTitles={resourceAuthPage.policies.map((ip) => {
        return ip.policyName;
      })}
      targetType='resource'
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
