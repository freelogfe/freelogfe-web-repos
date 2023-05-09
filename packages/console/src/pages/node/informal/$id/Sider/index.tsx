import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, InformalNodeManagerPageModelState } from '@/models/connect';
import { history, withRouter } from 'umi';
import { OnMountPageSiderAction } from '@/models/informalNodeManagerPage';
import { RouteComponentProps } from 'react-router';
import { FUtil, FI18n } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FComponentsLib from '@freelog/components-lib';
import FTooltip from '@/components/FTooltip';

interface SiderProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;

  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function Sider({ match, dispatch, informalNodeManagerPage }: SiderProps) {

  AHooks.useMount(() => {
    dispatch<OnMountPageSiderAction>({
      type: 'informalNodeManagerPage/onMountPageSider',
      payload: {
        nodeID: Number(match.params.id),
      },
    });
  });

  AHooks.useUnmount(() => {

  });

  return (<>
    <div style={{ height: 35 }} />
    <div className={styles.title}>
      <label>test</label>
      &nbsp;&nbsp;
      <FTooltip title={informalNodeManagerPage.node_Name} placement={'top'}>
      <span style={{
        display: 'inline-block',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        maxWidth: 155,
      }}>{informalNodeManagerPage.node_Name}</span>
      </FTooltip>
    </div>
    <div style={{ height: 15 }} />
    <Space size={5} className={styles.url}>
      <a onClick={() => {
        window.open(informalNodeManagerPage.node_TestUrl);
      }}>{informalNodeManagerPage.node_TestUrl.replace(new RegExp(/http(s)?:\/\//), '')}</a>
      <FComponentsLib.FCopyToClipboard
        text={informalNodeManagerPage.node_TestUrl}
        iconStyle={{ fontSize: 14 }}
        title={FI18n.i18nNext.t('tip_copy_node_domain')}
      />
    </Space>
    <div style={{ height: 35 }} />
    <div className={styles.navs}>
      <div
        className={informalNodeManagerPage.showPage === 'exhibit' ? styles.activated : ''}
        onClick={() => {
          history.push(FUtil.LinkTo.informNodeManagement({
            nodeID: informalNodeManagerPage.node_ID,
            showPage: 'exhibit',
          }));
        }}
      >展品管理
      </div>
      <div
        className={informalNodeManagerPage.showPage === 'theme' ? styles.activated : ''}
        onClick={() => {
          history.push(FUtil.LinkTo.informNodeManagement({
            nodeID: informalNodeManagerPage.node_ID,
            showPage: 'theme',
          }));
        }}
      >主题管理
      </div>
      <div
        className={informalNodeManagerPage.showPage === 'mappingRule' ? styles.activated : ''}
        onClick={() => {
          history.push(FUtil.LinkTo.informNodeManagement({
            nodeID: informalNodeManagerPage.node_ID,
            showPage: 'mappingRule',
          }));
        }}
      >映射规则管理
      </div>
    </div>
  </>);
}

export default withRouter(connect(({ informalNodeManagerPage }: ConnectState) => ({
  informalNodeManagerPage,
}))(Sider));
