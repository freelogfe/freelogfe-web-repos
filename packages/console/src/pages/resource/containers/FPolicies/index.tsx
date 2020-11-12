import * as React from 'react';
import {FTipText, FContentText} from '@/components/FText';
import {FNormalButton, FTextButton, FCircleButton} from '@/components/FButton';
import FModal from '@/components/FModal';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {PlusOutlined} from '@ant-design/icons';
import styles from './index.less';
import {i18nMessage} from '@/utils/i18n';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceAuthPageModelState, ResourceInfoModelState} from '@/models/connect';
import {ChangeAction, UpdatePoliciesAction} from '@/models/resourceAuthPage';
import PolicyCard from './PolicyCard';
import FPolicyBuilderDrawer from "@/components/FPolicyBuilderDrawer";

interface Policy {
  id: string;
  title: string;
  status: 'executing' | 'stopped';
  code: string;
}

interface FPoliciesProps {
  dispatch: Dispatch;
  auth: ResourceAuthPageModelState;
  resourceInfo: ResourceInfoModelState;
}

function FPolicies({dispatch, auth, resourceInfo: {info}}: FPoliciesProps) {

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
    {info?.policies?.length === 0
      ? (<div className={styles.empty}>
        <FTipText
          type="secondary"
          text={i18nMessage('hint_add_authorization_plan')}
        />
        <div style={{height: 20}}/>
        <FNormalButton onClick={openNewVisible}>{i18nMessage('add_authorization_plan')}</FNormalButton>
      </div>)
      : (<div className={styles.policies}>
        {
          info?.policies?.map((i) => (<PolicyCard
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
        <div>
          <FNormalButton
            onClick={openNewVisible}
            theme="weaken"
            shape="circle"
            icon={<PlusOutlined/>}
          />
        </div>
      </div>)}

    <FModal
      title="查看策略"
      visible={auth.policyPreviewVisible}
      onCancel={() => dispatch<ChangeAction>({
        type: 'resourceAuthPage/change',
        payload: {
          policyPreviewVisible: false,
          policyPreviewText: '',
        }
      })}
      footer={null}
    >
      <SyntaxHighlighter
        showLineNumbers={true}
      >{auth.policyPreviewText}</SyntaxHighlighter>
    </FModal>

    <FPolicyBuilderDrawer
      visible={auth.policyEditorVisible}
      onCancel={closeNewVisible}
      onConfirm={({title, text}) => {
        dispatch<UpdatePoliciesAction>({
          type: 'resourceAuthPage/updatePolicies',
          payload: {
            addPolicies: [{
              policyName: title,
              policyText: text,
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
  auth: resourceAuthPage,
  resourceInfo: resourceInfo,
}))(FPolicies);
