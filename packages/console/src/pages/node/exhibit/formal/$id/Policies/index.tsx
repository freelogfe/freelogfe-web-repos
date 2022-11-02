import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import { AddAPolicyAction, ChangeAction, UpdateAPolicyAction } from '@/models/exhibitInfoPage';
import FPolicyBuilder from '@/components/FPolicyBuilderDrawer';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import FPolicyList from '@/components/FPolicyList';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface PoliciesProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Policies({ dispatch, exhibitInfoPage }: PoliciesProps) {

  return (<div>
    <Space size={15}>
      <FComponentsLib.FTitleText
        text={FI18n.i18nNext.t('title_auth_plan')}
        type='h3'
      />
      {
        exhibitInfoPage.policy_List.length !== 0 && (<FComponentsLib.FCircleBtn
          size='small'
          onClick={() => {
            self._czc?.push(['_trackEvent', '授权策略页', '创建授权策略', '', 1]);
            dispatch<ChangeAction>({
              type: 'exhibitInfoPage/change',
              payload: {
                policy_BuildDrawer_Visible: true,
              },
            });
          }}
        />)
      }
    </Space>
    <div style={{ height: 20 }} />
    {
      exhibitInfoPage.policy_List.length === 0
        ? (<div className={styles.empty}>
          <FComponentsLib.FTipText
            type='second'
            // text={FUtil.I18n.message('hint_add_authorization_plan')}
            text={FI18n.i18nNext.t('exhibit_auth_plan_empty')}
          />
          <div style={{ height: 20 }} />
          <FComponentsLib.FRectBtn
            onClick={() => {
              self._czc?.push(['_trackEvent', '授权策略页', '创建授权策略', '', 1]);
              dispatch<ChangeAction>({
                type: 'exhibitInfoPage/change',
                payload: {
                  policy_BuildDrawer_Visible: true,
                },
              });
            }}
            type='primary'
          >{FI18n.i18nNext.t('btn_create_auth_plan')}</FComponentsLib.FRectBtn>
        </div>)
        : (<FPolicyList
          atLeastOneUsing={exhibitInfoPage.exhibit_Online}
          dataSource={exhibitInfoPage.policy_List}
          onCheckChange={(data) => {
            if (data.using) {
              self._czc?.push(['_trackEvent', '授权策略页', '上线', '', 1]);
            }
            dispatch<UpdateAPolicyAction>({
              type: 'exhibitInfoPage/updateAPolicy',
              payload: { id: data.id, status: data.using ? 1 : 0 },
            });
          }}
        />)
    }

    <FPolicyBuilder
      visible={exhibitInfoPage.policy_BuildDrawer_Visible}
      alreadyUsedTitles={exhibitInfoPage.policy_List.map((p) => {
        return p.policyName;
      })}
      alreadyUsedTexts={exhibitInfoPage.policy_List.map((p) => {
        return p.policyText;
      })}
      targetType='presentable'
      onCancel={() => dispatch<ChangeAction>({
        type: 'exhibitInfoPage/change',
        payload: {
          policy_BuildDrawer_Visible: false,
        },
      })}
      onConfirm={({ title, text }) => {
        // console.log(text, title, '90ijdsflfdslkk');
        dispatch<AddAPolicyAction>({
          type: 'exhibitInfoPage/addAPolicy',
          payload: { text, title },
        });
        dispatch<ChangeAction>({
          type: 'exhibitInfoPage/change',
          payload: {
            policy_BuildDrawer_Visible: false,
          },
        });
      }}
    />
  </div>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Policies);
