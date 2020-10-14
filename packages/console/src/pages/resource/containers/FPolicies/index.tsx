import * as React from 'react';
import {FTipText, FContentText} from '@/components/FText';
import StatusLabel from '@/pages/resource/components/StatusLabel';
import {FNormalButton, FTextButton, FCircleButton} from '@/components/FButton';
import FDropdown from '@/components/FDropdown';
import FModal from '@/components/FModal';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {PlusOutlined} from '@ant-design/icons';
import styles from './index.less';
import {i18nMessage} from '@/utils/i18n';
import {Drawer, Space, Collapse} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceAuthPageModelState, ResourceInfoModelState} from '@/models/connect';
import {ChangeAction, UpdatePoliciesAction} from '@/models/resourceAuthPage';
import FInput from '@/components/FInput';
import FCodemirror from '@/components/FCodemirror';
import {FFileText} from '@/components/FIcons';
import PolicyCard from './PolicyCard';
import PolicyTemplates from '@/pages/resource/containers/FPolicies/PolicyTemplates';

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

    <Drawer
      title={'添加授权策略'}
      onClose={closeNewVisible}
      visible={auth.policyEditorVisible}
      width={720}
      bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
    >
      <FInput
        className={styles.newTitle}
        value={auth.newPolicyTitle}
        onChange={(e) => dispatch<ChangeAction>({
          type: 'resourceAuthPage/change',
          payload: {
            newPolicyTitle: e.target.value,
          }
        })}
        placeholder={'请输入授权策略名称'}
      />
      <div style={{height: 20}}/>
      <FCodemirror
        value={auth.newPolicyText}
        onChange={(value) => dispatch<ChangeAction>({
          type: 'resourceAuthPage/change',
          payload: {
            newPolicyText: value,
          }
        })}
      />
      <div style={{height: 10}}/>
      <div className={styles.footer}>
        <a
          style={{color: '#666'}}
          onClick={() => dispatch<ChangeAction>({
            type: 'resourceAuthPage/change',
            payload: {
              policyTemplateVisible: true,
            }
          })}>
          <Space size={4}>
            <FFileText/>
            <span>策略模板</span>
          </Space>
        </a>
        <Space size={30}>
          <FTextButton onClick={closeNewVisible}>取消</FTextButton>
          <FNormalButton onClick={() => {
            dispatch<UpdatePoliciesAction>({
              type: 'resourceAuthPage/updatePolicies',
              payload: {
                addPolicies: [{
                  policyName: auth.newPolicyTitle,
                  policyText: auth.newPolicyText,
                }],
              },
            });
            dispatch<ChangeAction>({
              type: 'resourceAuthPage/change',
              payload: {
                policyEditorVisible: false,
              },
            });
          }}>确定</FNormalButton>
        </Space>
      </div>

      <Drawer
        width={640}
        visible={auth.policyTemplateVisible}
        title={'策略模板'}
        onClose={() => dispatch<ChangeAction>({
          type: 'resourceAuthPage/change',
          payload: {
            policyTemplateVisible: false,
          }
        })}
      >
        <PolicyTemplates
          onSelect={(p) => dispatch<ChangeAction>({
            type: 'resourceAuthPage/change',
            payload: {
              newPolicyTitle: p.title,
              newPolicyText: p.text,
              policyTemplateVisible: false,
            }
          })}/>
      </Drawer>
    </Drawer>

  </div>);
}

export default connect(({resourceAuthPage, resourceInfo}: ConnectState) => ({
  auth: resourceAuthPage,
  resourceInfo: resourceInfo,
}))(FPolicies);
