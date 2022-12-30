import * as React from 'react';
import styles from './index.less';
import { Menu, Space } from 'antd';
// import { FDown } from '@/components/FIcons';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceDetailPageModelState, NodesModelState } from '@/models/connect';
import { OnChangeNodeSelectorAction } from '@/models/resourceDetailPage';
import { FUtil } from '@freelog/tools-lib';
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
          FComponentsLib.fSetHotspotTooltipVisible('resourceDetailPage.nodeSelector', {
            value: false,
            effectiveImmediately: true,
            onlyNullish: false,
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
        target={'_blank'}
      >
        <Space size={10}>
          <FComponentsLib.FIcons.FPlus style={{ fontSize: 14 }} />
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
              <FComponentsLib.FTextBtn
                type='primary'
                onClick={() => {
                  // router.replace(FUtil.LinkTo.lo);
                  window.location.replace(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.login({
                    goTo: window.location.href,
                  }));
                }}>登录后选择节点签约</FComponentsLib.FTextBtn>
            </>)
            : nodes.list.length === 0
              ? (<>
                <span className={styles.nodeSelectorLabel}>您还没有创建节点</span>
                <FComponentsLib.FTextBtn
                  type='primary'
                  onClick={() => {
                    self.open(FUtil.LinkTo.nodeCreator());
                  }}>创建节点</FComponentsLib.FTextBtn>
              </>)
              : (<>
                <span className={styles.nodeSelectorLabel}>签约节点</span>
                {
                  selectedNode
                    ? (<FComponentsLib.FContentText
                      text={selectedNode.nodeName} />)
                    : (<FComponentsLib.FContentText
                      type='negative'
                      text={'选择签约的节点…'} />)
                }
                {
                  resourceDetailPage.sign_SignedNodeIDs.includes(resourceDetailPage.sign_SelectedNodeID || -1) && (
                    <span className={styles.contracted}>(已签约)</span>)}
              </>)
        }
      </Space>
      <FComponentsLib.FIcons.FDown />
    </div>
  </FComponentsLib.FDropdown>);
}

export default connect(({ resourceDetailPage, nodes }: ConnectState) => ({
  resourceDetailPage,
  nodes,
}))(NodeSelector);
