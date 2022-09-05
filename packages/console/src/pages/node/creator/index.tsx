import * as React from 'react';
import styles from './index.less';
import { Input, Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, NodeCreatorPageModelState, NodesModelState } from '@/models/connect';
import {
  // InitModelStatesAction,
  OnBlur_DomainInput_Action,
  OnBlur_NameInput_Action,
  OnChange_DomainInput_Action,
  OnChange_NameInput_Action,
  OnClick_CreateBtn_Action,
} from '@/models/nodeCreatorPage';
import { FCheck, FLoading } from '@/components/FIcons';
import FInput from '@/components/FInput';
import FContentLayout from '@/layouts/FContentLayout';
import * as AHooks from 'ahooks';
import { OnMount_Page_Action, OnUnmount_Page_Action } from '@/models/nodeCreatorPage';
import FComponentsLib from '@freelog/components-lib';
import { FUtil } from '@freelog/tools-lib';

interface NodeCreatorProps {
  dispatch: Dispatch;
  nodeCreatorPage: NodeCreatorPageModelState;
}

function NodeCreator({ nodeCreatorPage, dispatch }: NodeCreatorProps) {

  AHooks.useMount(() => {
    dispatch<OnMount_Page_Action>({
      type: 'nodeCreatorPage/onMount_Page',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmount_Page_Action>({
      type: 'nodeCreatorPage/onUnmount_Page',
    });
  });
  // React.useEffect(() => {
  //   dispatch<InitModelStatesAction>({
  //     type: 'nodes/initModelStates',
  //   });
  // }, []);

  return (<FContentLayout header={<FComponentsLib.FTitleText
    type='h1'
    text={'创建节点'} />}
  >
    <div className={styles.body}>
      <Space size={10}>
        <div className={styles.domain}>
          <FComponentsLib.FContentText type='negative' text={'节点地址'} />
          <div className={styles.inputWrap}>
            <FInput
              value={nodeCreatorPage.nodeDomain}
              // debounce={300}
              className={styles.input}
              placeholder={'输入节点地址'}
              onChange={(e) => {
                dispatch<OnChange_DomainInput_Action>({
                  type: 'nodeCreatorPage/onChange_DomainInput',
                  payload: { value: e.target.value },
                });
              }}
              onBlur={() => {
                dispatch<OnBlur_DomainInput_Action>({
                  type: 'nodeCreatorPage/onBlur_DomainInput',
                });
              }}
              // onDebounceChange={(value) => dispatch<OnChangeDomainAction>({
              //   type: 'nodes/onChangeDomain',
              //   payload: value,
              // })}
            />
          </div>
          <FComponentsLib.FContentText
            type='negative'
            text={FUtil.Format.completeUrlByDomain('').replace(/(http|https):\/\//, '')}
          />
        </div>
        <div style={{ width: 18 }}>
          {nodeCreatorPage.nodeDomainState === 'verifying' && <FLoading />}
          {nodeCreatorPage.nodeDomainState === 'verified' && !nodeCreatorPage.nodeDomainError && <FCheck />}
        </div>
      </Space>
      <pre className={styles.errorTip}>{nodeCreatorPage.nodeDomainError}</pre>
      <Space size={10}>
        <div className={styles.name}>
          <FComponentsLib.FContentText type='negative' text={'节点名称'} />
          <div className={styles.inputWrap}>
            <FInput
              value={nodeCreatorPage.nodeName}
              // debounce={300}
              onChange={(e) => {
                dispatch<OnChange_NameInput_Action>({
                  type: 'nodeCreatorPage/onChange_NameInput',
                  payload: { value: e.target.value },
                });
              }}
              onBlur={() => {
                dispatch<OnBlur_NameInput_Action>({
                  type: 'nodeCreatorPage/onBlur_NameInput',
                });
              }}
              className={styles.input}
              placeholder={'输入节点名称'}
            />
          </div>
        </div>
        <div style={{ width: 18 }}>
          {nodeCreatorPage.nodeNameState === 'verifying' && <FLoading />}
          {nodeCreatorPage.nodeNameState === 'verified' && !nodeCreatorPage.nodeNameError && <FCheck />}
        </div>
      </Space>
      <pre className={styles.errorTip}>{nodeCreatorPage.nodeNameError}</pre>
      <FComponentsLib.FRectBtn
        className={styles.button}
        disabled={nodeCreatorPage.nodeDomainState === 'verifying'
        || nodeCreatorPage.nodeDomainError !== ''
        || nodeCreatorPage.nodeNameState === 'verifying'
        || nodeCreatorPage.nodeNameError !== ''
        }
        onClick={() => {
          dispatch<OnClick_CreateBtn_Action>({
            type: 'nodeCreatorPage/onClick_CreateBtn',
          });
        }}
        type='primary'
      >创建节点</FComponentsLib.FRectBtn>
    </div>
  </FContentLayout>);
}

export default connect(({ nodeCreatorPage }: ConnectState) => ({
  nodeCreatorPage,
}))(NodeCreator);
