import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText, FTipText} from '@/components/FText';
import {FCircleBtn, FCircleButton, FRectBtn} from '@/components/FButton';
import {Space} from 'antd';
import FSwitch from '@/components/FSwitch';
import {AddAPolicyAction, ChangeAction, UpdateAPolicyAction} from "@/models/exhibitInfoPage";
import FPolicyBuilder from "@/components/FPolicyBuilderDrawer";
import {connect, Dispatch} from 'dva';
import {ConnectState, ExhibitInfoPageModelState} from "@/models/connect";
import FUtil from "@/utils";

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
          onClick={() => dispatch<ChangeAction>({
            type: 'exhibitInfoPage/change',
            payload: {
              addPolicyDrawerVisible: true,
            }
          })}
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
        : (<div className={styles.policies}>
          {
            exhibitInfoPage.policies.map((p) => (<div
              className={styles.policy}
              key={p.id}
            >
              <div className={styles.title}>
                <FContentText
                  text={p.name}
                />
                <Space size={8}>
                  {
                    p.status === 1
                      ? (<label style={{color: '#42C28C'}}>{FUtil.I18n.message('btn_activate_auth_plan')}</label>)
                      : (<label style={{color: '#B4B6BA'}}>{FUtil.I18n.message('btn_activate_auth_plan')}</label>)
                  }
                  <FSwitch
                    disabled={exhibitInfoPage.isOnline && onlyOnePolicy && p.status === 1}
                    checked={p.status === 1}
                    onChange={(value) => dispatch<UpdateAPolicyAction>({
                      type: 'exhibitInfoPage/updateAPolicy',
                      payload: {id: p.id, status: value ? 1 : 0}
                    })}
                  />
                </Space>
              </div>
              <div className={styles.pre}>
                <pre>{p.text}</pre>
              </div>
            </div>))
          }
        </div>)
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
