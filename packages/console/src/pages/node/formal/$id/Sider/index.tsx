import * as React from 'react';
import styles from './index.less';
import { connect, Dispatch } from 'dva';
import { ConnectState, NodeManagerModelState } from '@/models/connect';
import { OnChange_ShowPage_Action } from '@/models/nodeManagerPage';
import { withRouter } from 'umi';
import FLink from '@/components/FLink';
import { FUtil, FI18n } from '@freelog/tools-lib';
import { Space } from 'antd';
import { FShare } from '@/components/FShare';
import FTooltip from '@/components/FTooltip';
import FComponentsLib from '@freelog/components-lib';

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
        <div style={{ height: 30 }} />

        <div className={styles.title}>
          <FComponentsLib.FTitleText type='h2' text={nodeManagerPage.nodeName} />
          <div style={{ height: 15 }} />
          <Space size={10} className={styles.url}>
            <a
              onClick={() => {
                window.open(nodeManagerPage.nodeUrl);
              }}
            >
              {nodeManagerPage.nodeUrl.replace(new RegExp(/http(s)?:\/\//), '')}
            </a>
            <FComponentsLib.FCopyToClipboard
              text={nodeManagerPage.nodeUrl}
              title={'复制节点地址'}
              iconStyle={{ fontSize: 14 }}
            />
            <FShare type='node' title={nodeManagerPage.nodeName} url={nodeManagerPage.nodeUrl}>
              <FComponentsLib.FTextBtn>
                <FTooltip title='分享节点'>
                  <i className={`freelog fl-icon-fenxiang`} style={{ fontSize: '14px' }} />
                </FTooltip>
              </FComponentsLib.FTextBtn>
            </FShare>
          </Space>
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
        </div>
      </div>

      <div className={styles.gotoTest}>
        <span>{FI18n.i18nNext.t('msg_navigate_to_test_node')}</span>
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
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

export default withRouter(
  connect(({ nodeManagerPage }: ConnectState) => ({
    nodeManagerPage,
  }))(Sider),
);
