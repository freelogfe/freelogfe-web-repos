import * as React from 'react';
import {FTipText} from '@/components/FText';
import {FNormalButton} from '@/components/FButton';
import FModal from '@/components/FModal';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {PlusOutlined} from '@ant-design/icons';
import styles from './index.less';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceAuthPageModelState, ResourceInfoModelState} from '@/models/connect';
import {ChangeAction, UpdatePoliciesAction} from '@/models/resourceAuthPage';
import PolicyCard from './PolicyCard';
import FPolicyBuilderDrawer from "@/components/FPolicyBuilderDrawer";
import FUtil from "@/utils";
import {FRectBtn} from '@/components/FButton';

interface Policy {
  id: string;
  title: string;
  status: 'executing' | 'stopped';
  code: string;
}

interface FPoliciesProps {
  dispatch: Dispatch;
  resourceAuthPage: ResourceAuthPageModelState;
  resourceInfo: ResourceInfoModelState;
}

function FPolicies({dispatch, resourceAuthPage, resourceInfo}: FPoliciesProps) {

  function onPolicyStatusChange(id: string, status: Policy['status'], title: string) {
    dispatch<UpdatePoliciesAction>({
      type: 'resourceAuthPage/updatePolicies',
      payload: {
        updatePolicies: [{
          policyId: id,
          status: status === 'executing' ? 1 : 0,
        }],
      },
    });
  }

  function openNewVisible() {
    dispatch<ChangeAction>({
      type: 'resourceAuthPage/change',
      payload: {
        policyEditorVisible: true,
      }
    });
  }

  function closeNewVisible() {
    dispatch<ChangeAction>({
      type: 'resourceAuthPage/change',
      payload: {
        policyEditorVisible: false,
      }
    });
  }

  return (<div className={styles.FPoliciesStyles}>
    {
      resourceAuthPage.policies?.length === 0
        ? (<div className={styles.empty}>
          <FTipText
            type="secondary"
            text={FUtil.I18n.message('hint_add_authorization_plan')}
          />
          <div style={{height: 20}}/>
          <FRectBtn
            onClick={openNewVisible}>{'添加授权策略'}</FRectBtn>
        </div>)
        : (<div className={styles.policies}>
          {
            resourceAuthPage.policies.map((i) => (<PolicyCard
              key={i.policyId}
              title={i.policyName}
              status={i.status ? 'executing' : 'stopped'}
              code={i.policyText}
              onPreview={() => dispatch<ChangeAction>({
                type: 'resourceAuthPage/change',
                payload: {
                  policyPreviewVisible: true,
                  policyPreviewText: i.policyText,
                }
              })}
              onChangeStatus={(value) => onPolicyStatusChange(i.policyId, value, i.policyName)}
            />))
          }
          {/*<div>*/}
          {/*  */}
          {/*</div>*/}
        </div>)
    }

    <FModal
      title="查看策略"
      visible={resourceAuthPage.policyPreviewVisible}
      onCancel={() => dispatch<ChangeAction>({
        type: 'resourceAuthPage/change',
        payload: {
          policyPreviewVisible: false,
          policyPreviewText: '',
        },
      })}
      footer={null}
    >
      <SyntaxHighlighter
        showLineNumbers={true}
      >{resourceAuthPage.policyPreviewText}</SyntaxHighlighter>
    </FModal>

    <FPolicyBuilderDrawer
      visible={resourceAuthPage.policyEditorVisible}
      alreadyHas={resourceAuthPage.policies.map((ip) => ({
        title: ip.policyName,
        text: ip.policyText,
      }))}
      onCancel={closeNewVisible}
      onConfirm={({title, text}) => {
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

export default connect(({resourceAuthPage, resourceInfo}: ConnectState) => ({
  resourceAuthPage: resourceAuthPage,
  resourceInfo: resourceInfo,
}))(FPolicies);
