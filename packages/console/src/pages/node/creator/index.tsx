import * as React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import { FTitleText, FContentText } from '@/components/FText';
import { FRectBtn } from '@/components/FButton';
import { Input, Space } from 'antd';
import { connect, Dispatch } from 'dva';
import { ConnectState, NodesModelState } from '@/models/connect';
import {
  CreateNodeAction,
  InitModelStatesAction,
  OnBlur_DomainInput_Action,
  OnBlur_NameInput_Action,
  OnChange_DomainInput_Action,
  OnChange_NameInput_Action,
  // OnChangeDomainAction,
  // OnChangeNameAction,
} from '@/models/nodes';
import { FCheck, FLoading } from '@/components/FIcons';
import FInput from '@/components/FInput';
import FContentLayout from '@/layouts/FContentLayout';

interface NodeCreatorProps {
  dispatch: Dispatch;
  nodes: NodesModelState;
}

function NodeCreator({ nodes, dispatch }: NodeCreatorProps) {
  React.useEffect(() => {
    dispatch<InitModelStatesAction>({
      type: 'nodes/initModelStates',
    });
  }, []);

  return (<FContentLayout header={<FTitleText
    type='h1'
    text={'创建节点'} />}
  >
    {/*<div className={styles.header}>*/}
    {/*  */}
    {/*</div>*/}
    <div className={styles.body}>
      <Space size={10}>
        <div className={styles.domain}>
          <FContentText type='negative' text={'节点地址'} />
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
          <FContentText type='negative' text={'.freelog.com'} />
        </div>
        <div style={{ width: 18 }}>
          {nodes.domainVerify === 1 && <FLoading />}
          {nodes.domainVerify === 2 && !nodes.domainError && <FCheck />}
        </div>
      </Space>
      <pre className={styles.errorTip}>{nodes.domainError}</pre>
      <Space size={10}>
        <div className={styles.name}>
          <FContentText type='negative' text={'节点名称'} />
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
          {nodes.nameVerify === 1 && <FLoading />}
          {nodes.nameVerify === 2 && !nodes.nameError && <FCheck />}
        </div>
      </Space>
      <pre className={styles.errorTip}>{nodes.nameError}</pre>
      <FRectBtn
        className={styles.button}
        disabled={nodes.domainVerify !== 2 || !!nodes.domainError
        || nodes.nameVerify !== 2 || !!nodes.nameError}
        onClick={() => dispatch<CreateNodeAction>({
          type: 'nodes/createNode',
        })}
        type='primary'
      >创建节点</FRectBtn>
    </div>
  </FContentLayout>);
}

export default connect(({ nodes }: ConnectState) => ({
  nodes,
}))(NodeCreator);
