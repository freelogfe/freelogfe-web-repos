import * as React from 'react';
import styles from './index.less';
import { Menu, Space } from 'antd';
import { FContentText } from '@/components/FText';
import { FDown, FPlus } from '@/components/FIcons';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceDetailPageModelState, NodesModelState } from '@/models/connect';
import { OnChangeNodeSelectorAction } from '@/models/resourceDetailPage';
import { FTextBtn } from '@/components/FButton';
import { router } from 'umi';
import { FUtil } from '@freelog/tools-lib';
// import FDropdown from '@/components/FDropdown';
import FComponentsLib from '@freelog/components-lib';

interface NodeSelectorProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState;
  nodes: NodesModelState;
}

const FMenu: any = Menu;

function NodeSelector({ dispatch, resourceDetailPage, nodes }: NodeSelectorProps) {
  const selectedNode = nodes.list.find((n) => n.nodeId === resourceDetailPage.sign_SelectedNodeID);

  return (<FComponentsLib.FDropdown
    overlay={nodes.list.length > 0 ? (<div style={{ width: 638 }}>
      <FMenu
        className={styles.Menu}
        mode='vertical'
        onClick={(param: any) => {
          dispatch<OnChangeNodeSelectorAction>({
            type: 'resourceDetailPage/onChangeNodeSelector',
            payload: Number(param.key),
          });
        }}
      >
        {
          nodes.list.map((n) => (<FMenu.Item
            key={n.nodeId}
            className={styles.MenuItem}
          >
            <Space size={10}>
              <span>{n.nodeName}</span>
              {resourceDetailPage.sign_SignedNodeIDs.includes(n.nodeId) && (
                <span className={styles.contracted}>(已签约)</span>)}
            </Space>
          </FMenu.Item>))
        }
      </FMenu>
      <a
        href={FUtil.LinkTo.nodeCreator()}
        className={styles.newButton}
      >
        <Space size={10}>
          <FPlus style={{ fontSize: 14 }} />
          <span>创建节点</span>
        </Space>
      </a>
    </div>) : (<span />)}>
    <div className={styles.nodeSelector}>
      <Space size={10}>
        {
          !resourceDetailPage.user_Logged ?
            (<>
              <span className={styles.nodeSelectorLabel}>选择签约节点</span>
              <FTextBtn
                type='primary'
                onClick={() => {
                  // router.replace(FUtil.LinkTo.lo);
                  window.location.replace(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.login({
                    goTo: window.location.href,
                  }));
                }}>登录后选择节点签约</FTextBtn>
            </>)
            : nodes.list.length === 0
              ? (<>
                <span className={styles.nodeSelectorLabel}>您还没有创建节点</span>
                <FTextBtn
                  type='primary'
                  onClick={() => {
                    router.push(FUtil.LinkTo.nodeCreator());
                  }}>创建节点</FTextBtn>
              </>)
              : (<>
                <span className={styles.nodeSelectorLabel}>签约节点</span>
                {
                  selectedNode
                    ? (<FContentText
                      text={selectedNode.nodeName} />)
                    : (<FContentText
                      type='negative'
                      text={'选择签约的节点…'} />)
                }
                {
                  resourceDetailPage.sign_SignedNodeIDs.includes(resourceDetailPage.sign_SelectedNodeID || -1) && (
                    <span className={styles.contracted}>(已签约)</span>)}
              </>)
        }
      </Space>
      <FDown />
    </div>
  </FComponentsLib.FDropdown>);
}

export default connect(({ resourceDetailPage, nodes }: ConnectState) => ({
  resourceDetailPage,
  nodes,
}))(NodeSelector);
