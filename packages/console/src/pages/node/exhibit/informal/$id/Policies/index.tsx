import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FSwitch from '@/components/FSwitch';
import { AddAPolicyAction, ChangeAction, UpdateAPolicyAction } from '@/models/exhibitInfoPage';
import FPolicyBuilder from '@/components/FPolicyBuilderDrawer';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface PoliciesProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Policies({ dispatch, exhibitInfoPage }: PoliciesProps) {

  const onlyOnePolicy = exhibitInfoPage.policy_List.filter((p) => p.status === 1).length === 1;

  return (<div>
    <Space size={15}>
      <FComponentsLib.FTitleText
        text={'授权策略'}
        type='h3'
      />
      {
        exhibitInfoPage.policy_List.length !== 0 && (<FComponentsLib.FCircleBtn
          onClick={() => dispatch<ChangeAction>({
            type: 'exhibitInfoPage/change',
            payload: {
              policy_BuildDrawer_Visible: true,
            },
          })}
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
            text={'无策略'}
          />
          <div style={{ height: 20 }} />
          <FComponentsLib.FRectBtn
            onClick={() => dispatch<ChangeAction>({
              type: 'exhibitInfoPage/change',
              payload: {
                policy_BuildDrawer_Visible: true,
              },
            })}
            type='primary'
          >{FI18n.i18nNext.t('add_authorization_plan')}</FComponentsLib.FRectBtn>
        </div>)
        : (<div className={styles.policies}>
          {
            exhibitInfoPage.policy_List.map((p) => (<div
              className={styles.policy}
              key={p.policyId}
            >
              <div className={styles.title}>
                <FComponentsLib.FContentText
                  text={p.policyName}
                />
                <Space size={8}>
                  {
                    p.status === 1
                      ? (<label style={{ color: '#42C28C' }}>已启用</label>)
                      : (<label style={{ color: '#B4B6BA' }}>已搁置</label>)
                  }
                  <FSwitch
                    disabled={exhibitInfoPage.exhibit_Online && onlyOnePolicy && p.status === 1}
                    checked={p.status === 1}
                    onChange={(value) => dispatch<UpdateAPolicyAction>({
                      type: 'exhibitInfoPage/updateAPolicy',
                      payload: { id: p.policyId, status: value ? 1 : 0 },
                    })}
                  />
                </Space>
              </div>
              <div style={{ height: 15 }} />
              <pre>{p.policyText}</pre>
            </div>))
          }
        </div>)
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
