import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, NodeManagerModelState } from '@/models/connect';
import { withRouter } from 'umi';
import FLink from '@/components/FLink';
import { FUtil, FI18n, FServiceAPI } from '@freelog/tools-lib';
import { Space } from 'antd';
import { FShare } from '@/components/FShare';
import FTooltip from '@/components/FTooltip';
import FComponentsLib from '@freelog/components-lib';
import * as imgSrc from '@/assets/default-node-cover.png';
import FNodeCoverImage from '@/components/FNodeCoverImage';
import { history } from 'umi';

interface SiderProps {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
  match: {
    params: {
      id: string;
    };
  };
}

function Sider({ dispatch, nodeManagerPage, match }: SiderProps) {
  return (
    <div className={styles.styles}>
      <div className={styles.header}>
        <div style={{ height: 35 }} />

        <div className={styles.cover}>
          <FNodeCoverImage
            src={nodeManagerPage.nodeCover || imgSrc}
            // width={80}
          />
        </div>
        <div style={{ height: 20 }} />

        <div className={styles.title}>
          <FTooltip title={nodeManagerPage.nodeTitle || nodeManagerPage.nodeName} placement={'top'}>
            <div style={{ display: 'inline-block' }}>
              <FComponentsLib.FContentText
                type={'highlight'}
                text={nodeManagerPage.nodeTitle || nodeManagerPage.nodeName}
                singleRow
                style={{
                  maxWidth: 200,
                }}
              />
            </div>
          </FTooltip>
          <div style={{ height: 10 }} />
          <FComponentsLib.FContentText
            type={'highlight'}
          >
            {nodeManagerPage.nodeUrl.replace(new RegExp(/http(s)?:\/\//), '')}
          </FComponentsLib.FContentText>
          <div style={{ height: 10 }} />
          <FComponentsLib.FHotspotTooltip
            id={'nodeManager.nodeLink'}
            style={{ right: -80, top: -4 }}
            text={FI18n.i18nNext.t('hotpots_nodemanager_link_domain')}
            onMount={() => {
              FComponentsLib.fSetHotspotTooltipVisible('nodeManager.nodeLink', {
                value: false,
                effectiveImmediately: false,
                onlyNullish: true,
              });
            }}
          >
            <Space size={30}>
              <FComponentsLib.FTextBtn
                onClick={async () => {
                  self.open(nodeManagerPage.nodeUrl);
                }}
              >
                <FTooltip title={FI18n.i18nNext.t('nodemgnt_btn_viewnode_tooltip')}>
                  <i className={`freelog fl-icon-fangwen`} style={{ fontSize: '14px' }} />
                </FTooltip>
              </FComponentsLib.FTextBtn>
              <FComponentsLib.FCopyToClipboard
                text={nodeManagerPage.nodeUrl}
                title={FI18n.i18nNext.t('nodemgnt_btn_copynodeaddr_tooltip')}
                iconStyle={{ fontSize: 14 }}
              />
              <FShare
                type='node'
                title={nodeManagerPage.nodeName}
                url={nodeManagerPage.nodeUrl}
                onClickShare={() => {
                  // console.log('**********8 88888888d onClickShare')
                  // FServiceAPI.Activity.pushMessageTask({
                  //   taskConfigCode: 'TS000034',
                  //   meta: { nodeId: nodeManagerPage.nodeId },
                  // });
                  // FServiceAPI.Activity.pushMessageTask({
                  //   taskConfigCode: 'TS000076',
                  //   meta: { nodeId: nodeManagerPage.nodeId },
                  // });
                  FServiceAPI.Activity.pushMessageTask({
                    taskConfigCode: 'TS000803',
                    meta: { nodeId: nodeManagerPage.nodeId },
                  });
                }}
              >
                <FComponentsLib.FTextBtn
                  onClick={async () => {

                  }}
                >
                  <FTooltip title={FI18n.i18nNext.t('nodemgnt_btn_sharenode_tooltip')}>
                    <i className={`freelog fl-icon-fenxiang`} style={{ fontSize: 14 }} />
                  </FTooltip>
                </FComponentsLib.FTextBtn>
              </FShare>
            </Space>
          </FComponentsLib.FHotspotTooltip>
        </div>

        <div style={{ height: 35 }} />

        <div className={styles.navs}>
          <a
            className={nodeManagerPage.showPage === 'exhibit' ? styles.activated : ''}
            onClick={() => {
              history.push(FUtil.LinkTo.nodeManagement({
                nodeID: nodeManagerPage.nodeId,
                showPage: 'exhibit',
              }));
            }}
          >
            {FI18n.i18nNext.t('tab_manage_nodes')}
          </a>
          <a
            className={nodeManagerPage.showPage === 'theme' ? styles.activated : ''}
            onClick={() => {
              history.push(FUtil.LinkTo.nodeManagement({
                nodeID: nodeManagerPage.nodeId,
                showPage: 'theme',
              }));
            }}
          >
            {FI18n.i18nNext.t('manage_theme')}
          </a>
          <a
            className={nodeManagerPage.showPage === 'contract' ? styles.activated : ''}
            onClick={() => {
              history.push(FUtil.LinkTo.nodeManagement({
                nodeID: nodeManagerPage.nodeId,
                showPage: 'contract',
              }));
            }}
          >合约管理</a>
          <a
            className={nodeManagerPage.showPage === 'setting' ? styles.activated : ''}
            onClick={() => {
              // dispatch<OnChange_ShowPage_Action>({
              //   type: 'nodeManagerPage/onChange_ShowPage',
              //   payload: {
              //     value: 'setting',
              //   },
              // });

              history.push(FUtil.LinkTo.nodeManagement({
                nodeID: nodeManagerPage.nodeId,
                // @ts-ignore
                showPage: 'setting',
              }));
            }}
          >节点设置</a>
        </div>
      </div>

      <div className={styles.gotoTest}>
        <span>{FI18n.i18nNext.t('msg_navigate_to_test_node')}</span>
        &nbsp;
        <FLink
          // to={FUtil.LinkTo.informNodeManagement({ nodeID: Number(match.params.id), showPage: 'exhibit' })}
          to={FUtil.LinkTo.informNodeManagement({
            nodeID: Number(match.params.id),
            showPage: 'exhibit',
          })}
          target='_blank'
        >
          {FI18n.i18nNext.t('btn_navigate_to_test_node')}
        </FLink>
        {/*<div style={{ height: 40 }} />*/}
      </div>
    </div>
  );
}

export default withRouter(
  connect(({ nodeManagerPage }: ConnectState) => ({
    nodeManagerPage,
  }))(Sider),
);
