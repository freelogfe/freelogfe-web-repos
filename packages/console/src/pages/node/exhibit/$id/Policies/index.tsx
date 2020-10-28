import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import {Space} from 'antd';
import FSwitch from '@/components/FSwitch';
import {AddAPolicyAction, ChangeAction, UpdateAPolicyAction} from "@/models/exhibitInfoPage";
import FPolicyBuilder from "@/components/FPolicyBuilderDrawer";
import {connect, Dispatch} from 'dva';
import {ConnectState, ExhibitInfoPageModelState} from "@/models/connect";

interface PoliciesProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

const text = 'for public:\n' +
  '  initial:\n' +
  '    active\n' +
  '    recontractable\n' +
  '    presentable\n' +
  '    terminate';

function Policies({dispatch, exhibitInfoPage}: PoliciesProps) {
  return (<div>
    <Space size={15}>
      <FTitleText text={'授权策略'} type="h3"/>
      <FCircleButton onClick={() => dispatch<ChangeAction>({
        type: 'exhibitInfoPage/change',
        payload: {
          addPolicyDrawerVisible: true,
        }
      })}/>
    </Space>
    <div style={{height: 20}}/>
    <div className={styles.policies}>

      {
        exhibitInfoPage.policies.map((p) => (<div
          className={styles.policy}
          key={p.id}
        >
          <div className={styles.title}>
            <FContentText text={p.name}/>
            <Space size={8}>
              {
                p.status === 1
                  ? (<label style={{color: '#42C28C'}}>已启用</label>)
                  : (<label style={{color: '#B4B6BA'}}>已搁置</label>)
              }
              <FSwitch
                checked={p.status === 1}
                onChange={(value) => dispatch<UpdateAPolicyAction>({
                  type: 'exhibitInfoPage/updateAPolicy',
                  payload: {id: p.id, status: value ? 1 : 0}
                })}
              />
            </Space>
          </div>
          <div style={{height: 15}}/>
          <pre>{p.text}</pre>
        </div>))
      }

    </div>
    <FPolicyBuilder
      visible={exhibitInfoPage.addPolicyDrawerVisible}
      onCancel={() => dispatch<ChangeAction>({
        type: 'exhibitInfoPage/change',
        payload: {
          addPolicyDrawerVisible: false,
        }
      })}
      onConfirm={({title, text}) => {
        console.log(text, title, '90ijdsflfdslkk');
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
