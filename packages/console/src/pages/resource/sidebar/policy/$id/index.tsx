import * as React from 'react';
import styles from './index.less';
import { RouteComponentProps } from 'react-router/index';
import { Dispatch } from 'redux';
import {
  OnAdd_Policy_Action,
  OnMount_PolicyPage_Action,
  ResourceAuthPageModelState,
  UpdatePoliciesAction,
} from '@/models/resourceAuthPage';
import { OnChange_Page_Action, OnMount_Page_Action as OnMount_Sidebar_Action } from '@/models/resourceSider';
import * as AHooks from 'ahooks';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FUtil } from '@freelog/tools-lib';
import FPolicyList from '@/components/FPolicyList';
import PolicyTemplates from '@/pages/resource/creator/Step3/PolicyTemplates';

interface PolicyProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
}

function Policy({ dispatch, resourceAuthPage, match }: PolicyProps) {
  AHooks.useMount(async () => {
    // console.log(match.params.id, 'match.params.id we8rfijohsdlkfjsdlfkjsdl');
    dispatch<OnMount_Sidebar_Action>({
      type: 'resourceSider/onMount_Page',
      payload: {
        resourceID: match.params.id,
      },
    });
    dispatch<OnMount_PolicyPage_Action>({
      type: 'resourceAuthPage/onMount_PolicyPage',
      payload: {
        resourceID: match.params.id,
      },
    });
    dispatch<OnChange_Page_Action>({
      type: 'resourceSider/onChange_Page',
      payload: {
        page: 'policy',
      },
    });

  });

  return (<>
    <div>
      <div style={{ height: 40 }} />
      <div className={styles.block}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <FComponentsLib.FContentText text={FI18n.i18nNext.t('authplanmgnt_title')} type={'highlight'} />
          {
            resourceAuthPage.policies.length > 0 && (<FComponentsLib.FTextBtn
              style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}
              type='primary'
              onClick={async () => {
                // dispatch<OnClick_step3_addPolicyBtn_Action>({
                //   type: 'resourceCreatorPage/onClick_step3_addPolicyBtn',
                //   payload: {},
                // });
                dispatch<OnAdd_Policy_Action>({
                  type: 'resourceAuthPage/onAdd_Policy',
                });
              }}>
              <FComponentsLib.FIcons.FContract style={{ fontSize: 14 }} />
              <span>添加策略</span>
            </FComponentsLib.FTextBtn>)
          }

        </div>
        {
          resourceAuthPage.policies.length === 0 && (<>
            <div style={{ height: 10 }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <FComponentsLib.FContentText text={'资源需添加授权策略才能上架到资源市场，开放签约。'} type={'additional2'} />
              <FComponentsLib.FContentText text={'授权策略，即资源对外授权范围和条件的申明，如支付10元获得一个月使用授权。'} type={'additional2'} />
              <div style={{ height: 20 }} />

              <FComponentsLib.FRectBtn
                type={'primary'}
                onClick={() => {
                  // dispatch<OnClick_step3_addPolicyBtn_Action>({
                  //   type: 'resourceCreatorPage/onClick_step3_addPolicyBtn',
                  //   payload: {},
                  // });
                  dispatch<OnAdd_Policy_Action>({
                    type: 'resourceAuthPage/onAdd_Policy',
                  });
                }}
              >{FI18n.i18nNext.t('authplanmgnt_list_empty_btn')}</FComponentsLib.FRectBtn>
            </div>
          </>)
        }

        {
          resourceAuthPage.policies.length > 0 && (<>
            <div style={{ height: 20 }} />
            <FPolicyList
              atLeastOneUsing={resourceAuthPage.status === 1}
              dataSource={resourceAuthPage.policies}
              // onCheckChange={(data) => {
              //   if (data.using) {
              //     self._czc?.push(['_trackEvent', '授权信息页', '上线', '', 1]);
              //   }
              //   onPolicyStatusChange(data.id, data.using);
              // }}
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
            />
          </>)
        }

      </div>

      <div style={{ height: 5 }} />

      <div className={styles.block}>
        <FComponentsLib.FContentText
          text={'策略模板'}
          type={'highlight'}
        />
        <div style={{ height: 5 }} />
        <FComponentsLib.FContentText
          text={FI18n.i18nNext.t('authplanmgnt_title_templates_help')}
          type={'additional2'}
        />
        <div style={{ height: 20 }} />
        <PolicyTemplates
          onSelect={(value) => {
            // fPolicyBuilder({ targetType: 'resource', defaultValue: value });
            // dispatch<OnClick_step3_addPolicyBtn_Action>({
            //   type: 'resourceCreatorPage/onClick_step3_addPolicyBtn',
            //   payload: {
            //     defaultValue: value,
            //   },
            // });

            dispatch<OnAdd_Policy_Action>({
              type: 'resourceAuthPage/onAdd_Policy',
              payload: {
                defaultValue: value,
              },
            });
          }}
        />
      </div>

      <div style={{ height: 100 }} />

    </div>
  </>);
}

export default withRouter(connect(({ resourceAuthPage }: ConnectState) => ({
  resourceAuthPage: resourceAuthPage,
}))(Policy));
