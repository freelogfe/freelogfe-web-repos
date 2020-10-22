import * as React from 'react';
import styles from './index.less';
import FCenterLayout from "@/layouts/FCenterLayout";
import {FTitleText, FContentText} from '@/components/FText';
import {FNormalButton} from '@/components/FButton';
import {Input} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, NodesModelState} from '@/models/connect';
import {ChangeAction, CreateNodeAction} from "@/models/nodes";

interface NodeCreatorProps {
  dispatch: Dispatch;
  nodes: NodesModelState;
}

function NodeCreator({nodes, dispatch}: NodeCreatorProps) {
  return (<FCenterLayout>
    <div className={styles.header}>
      <FTitleText type="h1" text={'创建节点'}/>
    </div>
    <div className={styles.body}>
      <div className={styles.domain}>
        <FContentText type="negative" text={'节点地址'}/>
        <div className={styles.inputWrap}>
          <Input
            value={nodes.nodeDomain}
            className={styles.input}
            placeholder={'输入节点地址'}
            onChange={(e) => dispatch<ChangeAction>({
              type: 'nodes/change',
              payload: {
                nodeDomain: e.target.value,
              }
            })}
          />
        </div>
        <FContentText type="negative" text={'.freelog.com'}/>
      </div>
      <pre className={styles.errorTip}>{nodes.domainError}</pre>
      <div className={styles.name}>
        <FContentText type="negative" text={'节点名称'}/>
        <div className={styles.inputWrap}>
          <Input
            value={nodes.nodeName}
            onChange={(e) => dispatch<ChangeAction>({
              type: 'nodes/change',
              payload: {
                nodeName: e.target.value,
              }
            })}
            className={styles.input}
            placeholder={'输入节点名称'}
          />
        </div>
      </div>
      <pre className={styles.errorTip}>{nodes.nameError}</pre>
      <FNormalButton
        className={styles.button}
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
