import * as React from 'react';
import styles from './index.less';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceAuthPageModelState } from '@/models/connect';
import { ChangeAction, UpdatePoliciesAction } from '@/models/resourceAuthPage';
import FPolicyBuilderDrawer from '@/components/FPolicyBuilderDrawer';
import FPolicyList from '@/components/FPolicyList';
import fConfirmModal from '@/components/fConfirmModal';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

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

  // {
  //   // console.log(resourceAuthPage.policies, 'resourceAuthPage.policies@@@@@@@@');
  // }

  return (<div className={styles.FPoliciesStyles}>
    {
      resourceAuthPage.policies.length === 0
        ? (<div className={styles.empty}>
          <FComponentsLib.FTipText
            type='second'
            text={FI18n.i18nNext.t('hint_add_authorization_plan')}
          />
          <div style={{ height: 20 }} />
          <FComponentsLib.FRectBtn
            onClick={openNewVisible}>{'添加授权策略'}</FComponentsLib.FRectBtn>
        </div>)
        : (<FPolicyList
          atLeastOneUsing={resourceAuthPage.status === 1}
          dataSource={resourceAuthPage.policies}
          onCheckChange={(data) => {
            // const usedCount: number = resourceAuthPage.policies.filter((p) => {
            //   return p.status === 1;
            // }).length;
            // if (usedCount === 1 && !data.using) {
            //   fConfirmModal({
            //     // message: '一旦删除则无法恢复，确认删除吗？',
            //     message: FI18n.i18nNext.t('alert_disable_auth_plan_confirm'),
            //     onOk() {
            //       onPolicyStatusChange(data.id, data.using);
            //     },
            //     okText: FI18n.i18nNext.t('btn_disable_auth_plan'),
            //     cancelText: FI18n.i18nNext.t('btn_cancel'),
            //   });
            // } else {
              onPolicyStatusChange(data.id, data.using);
            // }
          }}
        />)
      // : null
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
