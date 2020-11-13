import * as React from 'react';
import styles from './index.less';
import FCenterLayout from "@/layouts/FCenterLayout";
import {FTitleText, FContentText} from '@/components/FText';
import {FNormalButton} from '@/components/FButton';
import {Input, Space} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, NodesModelState} from '@/models/connect';
import {
  ChangeAction,
  CreateNodeAction,
  InitModelStateAction,
  OnChangeDomainAction,
  OnChangeNameAction
} from "@/models/nodes";
import {FCheck, FLoading} from '@/components/FIcons';
import FInput from "@/components/FInput";

interface NodeCreatorProps {
  dispatch: Dispatch;
  nodes: NodesModelState;
}

function NodeCreator({nodes, dispatch}: NodeCreatorProps) {
  React.useEffect(() => {
    dispatch<InitModelStateAction>({
      type: 'nodes/initModelState',
    });
  }, []);

  return (<FCenterLayout>
    <div className={styles.header}>
      <FTitleText type="h1" text={'创建节点'}/>
    </div>
    <div className={styles.body}>
      <Space size={10}>
        <div className={styles.domain}>
          <FContentText type="negative" text={'节点地址'}/>
          <div className={styles.inputWrap}>
            <FInput
              value={nodes.nodeDomain}
              debounce={300}
              className={styles.input}
              placeholder={'输入节点地址'}
              onDebounceChange={(value) => dispatch<OnChangeDomainAction>({
                type: 'nodes/onChangeDomain',
                payload: value,
              })}
            />
          </div>
          <FContentText type="negative" text={'.freelog.com'}/>
        </div>
        <div style={{width: 18}}>
          {nodes.domainVerify === 1 && <FLoading/>}
          {nodes.domainVerify === 2 && !nodes.domainError && <FCheck/>}
        </div>
      </Space>
      <pre className={styles.errorTip}>{nodes.domainError}</pre>
      <Space size={10}>
        <div className={styles.name}>
          <FContentText type="negative" text={'节点名称'}/>
          <div className={styles.inputWrap}>
            <FInput
              value={nodes.nodeName}
              debounce={300}
              onDebounceChange={(value) => dispatch<OnChangeNameAction>({
                type: 'nodes/onChangeName',
                payload: value,
              })}
              className={styles.input}
              placeholder={'输入节点名称'}
            />
          </div>
        </div>
        <div style={{width: 18}}>
          {nodes.nameVerify === 1 && <FLoading/>}
          {nodes.nameVerify === 2 && !nodes.nameError && <FCheck/>}
        </div>
      </Space>
      <pre className={styles.errorTip}>{nodes.nameError}</pre>
      <FNormalButton
        className={styles.button}
        disabled={nodes.domainVerify !== 2 || !!nodes.domainError
        || nodes.nameVerify !== 2 || !!nodes.nameError}
        onClick={() => dispatch<CreateNodeAction>({
          type: 'nodes/createNode',
        })}
      >创建节点</FNormalButton>
    </div>
  </FCenterLayout>);
}

export default connect(({nodes}: ConnectState) => ({
  nodes,
}))(NodeCreator);
