import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import { connect, Dispatch } from 'dva';
import { ConnectState, NodesModelState } from '@/models/connect';
import {
  InitModelStatesAction,
  OnBlur_DomainInput_Action,
  OnBlur_NameInput_Action,
  OnChange_DomainInput_Action,
  OnChange_NameInput_Action, OnClick_CreateBtn_Action,
} from '@/models/nodes';
import { FCheck, FLoading } from '@/components/FIcons';
import FInput from '@/components/FInput';
import FContentLayout from '@/layouts/FContentLayout';
import * as AHooks from 'ahooks';
import { OnMount_Page_Action, OnUnmount_Page_Action } from '@/models/nodeCreatorPage';
import FComponentsLib from '@freelog/components-lib';
import { FUtil } from '@freelog/tools-lib';

interface NodeCreatorProps {
  dispatch: Dispatch;
  nodes: NodesModelState;
}

function NodeCreator({ nodes, dispatch }: NodeCreatorProps) {

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
    {/*<div className={styles.header}>*/}
    {/*  */}
    {/*</div>*/}
    <div className={styles.body}>
      <Space size={10}>
        <div className={styles.domain}>
          <FComponentsLib.FContentText type='negative' text={'节点地址'} />
          <div className={styles.inputWrap}>
            <FInput
              value={nodes.nodeDomain}
              // debounce={300}
              className={styles.input}
              placeholder={'输入节点地址'}
              onChange={(e) => {
                dispatch<OnChange_DomainInput_Action>({
                  type: 'nodes/onChange_DomainInput',
                  payload: { value: e.target.value },
                });
              }}
              onBlur={() => {
                dispatch<OnBlur_DomainInput_Action>({
                  type: 'nodes/onBlur_DomainInput',
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
          {nodes.domainVerify === 'verifying' && <FLoading />}
          {nodes.domainVerify === 'verified' && !nodes.domainError && <FCheck />}
        </div>
      </Space>
      <pre className={styles.errorTip}>{nodes.domainError}</pre>
      <Space size={10}>
        <div className={styles.name}>
          <FComponentsLib.FContentText type='negative' text={'节点名称'} />
          <div className={styles.inputWrap}>
            <FInput
              value={nodes.nodeName}
              // debounce={300}
              onChange={(e) => {
                dispatch<OnChange_NameInput_Action>({
                  type: 'nodes/onChange_NameInput',
                  payload: { value: e.target.value },
                });
              }}
              onBlur={() => {
                dispatch<OnBlur_NameInput_Action>({
                  type: 'nodes/onBlur_NameInput',
                });
              }}
              className={styles.input}
              placeholder={'输入节点名称'}
            />
          </div>
        </div>
        <div style={{ width: 18 }}>
          {nodes.nameVerify === 'verifying' && <FLoading />}
          {nodes.nameVerify === 'verified' && !nodes.nameError && <FCheck />}
        </div>
      </Space>
      <pre className={styles.errorTip}>{nodes.nameError}</pre>
      <FComponentsLib.FRectBtn
        className={styles.button}
        disabled={nodes.domainVerify !== 'verified' || !!nodes.domainError
        || nodes.nameVerify !== 'verified' || !!nodes.nameError}
        onClick={() => {
          dispatch<OnClick_CreateBtn_Action>({
            type: 'nodes/onClick_CreateBtn',
          });
        }}
        type='primary'
      >创建节点</FComponentsLib.FRectBtn>
    </div>
  </FContentLayout>);
}

export default connect(({ nodes }: ConnectState) => ({
  nodes,
}))(NodeCreator);
