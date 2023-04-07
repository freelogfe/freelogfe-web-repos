import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, NodeManagerModelState } from '@/models/connect';
import { OnChange_ShowPage_Action } from '@/models/nodeManagerPage';
import { withRouter } from 'umi';
import FLink from '@/components/FLink';
import { FUtil, FI18n, FServiceAPI } from '@freelog/tools-lib';
import { Space } from 'antd';
import { FShare } from '@/components/FShare';
import FTooltip from '@/components/FTooltip';
import FComponentsLib from '@freelog/components-lib';
import * as imgSrc from '@/assets/default-resource-cover.jpg';

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
          <img src={nodeManagerPage.nodeCover || imgSrc} />
        </div>
        <div style={{ height: 20 }} />

        <div className={styles.title}>
          <FTooltip title={nodeManagerPage.nodeName} placement={'top'}>
            <div style={{ display: 'inline-block' }}>
              <FComponentsLib.FContentText
                type={'highlight'}
                text={nodeManagerPage.nodeName}
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
            // style={{ fontSize: 12 }}
            // onClick={() => {
            //   window.open(nodeManagerPage.nodeUrl);
            //   FComponentsLib.fSetHotspotTooltipVisible('nodeManager.nodeLink', {
            //     value: false,
            //     effectiveImmediately: true,
            //     onlyNullish: false,
            //   });
            // }}
          >
            {nodeManagerPage.nodeUrl.replace(new RegExp(/http(s)?:\/\//), '')}
          </FComponentsLib.FContentText>
          <div style={{ height: 10 }} />
          <FComponentsLib.FHotspotTooltip
            id={'nodeManager.nodeLink'}
            style={{ right: -110, top: -4 }}
            // style={{ left: '50%', marginLeft: -16, bottom: -42 }}
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

                }}
              >
                <FTooltip title={FI18n.i18nNext.t('nodemgnt_btn_viewnode_tooltip')}>
                  <i className={`freelog fl-icon-fenxiang`} style={{ fontSize: '14px' }} />
                </FTooltip>
              </FComponentsLib.FTextBtn>
              <FComponentsLib.FCopyToClipboard
                text={nodeManagerPage.nodeUrl}
                title={FI18n.i18nNext.t('nodemgnt_btn_copynodeaddr_tooltip')}
                iconStyle={{ fontSize: 14 }}
              />
              <FShare type='node' title={nodeManagerPage.nodeName} url={nodeManagerPage.nodeUrl}>
                <FComponentsLib.FTextBtn onClick={async () => {
                  await FServiceAPI.Activity.pushMessageTask({
                    taskConfigCode: 'TS000034',
                  });
                }}>
                  <FTooltip title={FI18n.i18nNext.t('nodemgnt_btn_sharenode_tooltip')}>
                    <i className={`freelog fl-icon-fenxiang`} style={{ fontSize: '14px' }} />
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
              dispatch<OnChange_ShowPage_Action>({
                type: 'nodeManagerPage/onChange_ShowPage',
                payload: {
                  value: 'exhibit',
                },
              });
            }}
          >
            {FI18n.i18nNext.t('tab_manage_nodes')}
          </a>
          <a
            className={nodeManagerPage.showPage === 'theme' ? styles.activated : ''}
            onClick={() => {
              dispatch<OnChange_ShowPage_Action>({
                type: 'nodeManagerPage/onChange_ShowPage',
                payload: {
                  value: 'theme',
                },
              });
            }}
          >
            {FI18n.i18nNext.t('manage_theme')}
          </a>
          <a
            className={nodeManagerPage.showPage === 'contract' ? styles.activated : ''}
            onClick={() => {
              dispatch<OnChange_ShowPage_Action>({
                type: 'nodeManagerPage/onChange_ShowPage',
                payload: {
                  value: 'contract',
                },
              });
            }}
          >合约管理</a>
          <a
            className={nodeManagerPage.showPage === 'setting' ? styles.activated : ''}
            onClick={() => {
              dispatch<OnChange_ShowPage_Action>({
                type: 'nodeManagerPage/onChange_ShowPage',
                payload: {
                  value: 'setting',
                },
              });
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
