import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText, FTipText} from '@/components/FText';
import {FCircleBtn, FRectBtn} from '@/components/FButton';
import {Space} from 'antd';
import FSwitch from '@/components/FSwitch';
import {AddAPolicyAction, ChangeAction, UpdateAPolicyAction} from "@/models/exhibitInfoPage";
import FPolicyBuilder from "@/components/FPolicyBuilderDrawer";
import {connect, Dispatch} from 'dva';
import {ConnectState, ExhibitInfoPageModelState} from "@/models/connect";
import FUtil from "@/utils";
import FPolicyList from "@/components/FPolicyList";

interface PoliciesProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Policies({dispatch, exhibitInfoPage}: PoliciesProps) {

  const onlyOnePolicy = exhibitInfoPage.policies.filter((p) => p.status === 1).length === 1;

  return (<div>
    <Space size={15}>
      <FTitleText
        text={FUtil.I18n.message('title_auth_plan')}
        type="h3"
      />
      {
        exhibitInfoPage.policies.length !== 0 && (<FCircleBtn
          size="small"
          onClick={() => {
            dispatch<ChangeAction>({
              type: 'exhibitInfoPage/change',
              payload: {
                addPolicyDrawerVisible: true,
              },
            });
          }}
        />)
      }
    </Space>
    <div style={{height: 20}}/>
    {
      exhibitInfoPage.policies.length === 0
        ? (<div className={styles.empty}>
          <FTipText
            type="second"
            // text={FUtil.I18n.message('hint_add_authorization_plan')}
            text={FUtil.I18n.message('exhibit_auth_plan_empty')}
          />
          <div style={{height: 20}}/>
          <FRectBtn
            onClick={() => dispatch<ChangeAction>({
              type: 'exhibitInfoPage/change',
              payload: {
                addPolicyDrawerVisible: true,
              }
            })}
            type="primary"
          >{FUtil.I18n.message('btn_create_auth_plan')}</FRectBtn>
        </div>)
        : (<FPolicyList
          atLeastOneUsing={exhibitInfoPage.isOnline}
          dataSource={exhibitInfoPage.policies.map((p) => {
            return {
              id: p.id,
              name: p.name,
              using: p.status === 1,
              text: p.text,
            };
          })}
          onCheckChange={(data) => {
            dispatch<UpdateAPolicyAction>({
              type: 'exhibitInfoPage/updateAPolicy',
              payload: {id: data.id, status: data.using ? 1 : 0},
            });
          }}
        />)
    }

    <FPolicyBuilder
      visible={exhibitInfoPage.addPolicyDrawerVisible}
      alreadyHas={exhibitInfoPage.policies.map((p) => ({
        title: p.name,
        text: p.text,
      }))}
      onCancel={() => dispatch<ChangeAction>({
        type: 'exhibitInfoPage/change',
        payload: {
          addPolicyDrawerVisible: false,
        }
      })}
      onConfirm={({title, text}) => {
        // console.log(text, title, '90ijdsflfdslkk');
        dispatch<AddAPolicyAction>({
          type: 'exhibitInfoPage/addAPolicy',
          payload: {text, title},
        });
        dispatch<ChangeAction>({
          type: 'exhibitInfoPage/change',
          payload: {
            addPolicyDrawerVisible: false,
          },
        });
      }}
    />
  </div>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Policies);
