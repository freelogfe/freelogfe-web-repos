import * as React from 'react';
import styles from './index.less';
import { FTitleText, FTipText } from '@/components/FText';
import { FCircleBtn, FRectBtn } from '@/components/FButton';
import { Space } from 'antd';
import { AddAPolicyAction, ChangeAction, UpdateAPolicyAction } from '@/models/exhibitInfoPage';
import FPolicyBuilder from '@/components/FPolicyBuilderDrawer';
import { connect, Dispatch } from 'dva';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import FUtil1 from '@/utils';
import FPolicyList from '@/components/FPolicyList';

interface PoliciesProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Policies({ dispatch, exhibitInfoPage }: PoliciesProps) {

  return (<div>
    <Space size={15}>
      <FTitleText
        text={FUtil1.I18n.message('title_auth_plan')}
        type='h3'
      />
      {
        exhibitInfoPage.policy_List.length !== 0 && (<FCircleBtn
          size='small'
          onClick={() => {
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
          <FTipText
            type='second'
            // text={FUtil.I18n.message('hint_add_authorization_plan')}
            text={FUtil1.I18n.message('exhibit_auth_plan_empty')}
          />
          <div style={{ height: 20 }} />
          <FRectBtn
            onClick={() => dispatch<ChangeAction>({
              type: 'exhibitInfoPage/change',
              payload: {
                policy_BuildDrawer_Visible: true,
              },
            })}
            type='primary'
          >{FUtil1.I18n.message('btn_create_auth_plan')}</FRectBtn>
        </div>)
        : (<FPolicyList
          atLeastOneUsing={exhibitInfoPage.exhibit_Online}
          dataSource={exhibitInfoPage.policy_List}
          onCheckChange={(data) => {
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
