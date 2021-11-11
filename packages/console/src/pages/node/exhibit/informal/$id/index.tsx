import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import FSwitch from '@/components/FSwitch';
import { Space } from 'antd';
import Contracts from './Contracts';
import Viewports from './Viewports';
import Side from './Side';
import { connect, Dispatch } from 'dva';
import {
  ConnectState,
  InformExhibitInfoPageModelState,
  NodesModelState,
} from '@/models/connect';
import {
  OnPageMountAction,
  OnOnlineSwitchChangeAction,
  OnPageUnmountAction,
} from '@/models/informExhibitInfoPage';
import { FTextBtn } from '@/components/FButton';
import { router } from 'umi';
import { RouteComponentProps } from 'react-router';
import MappingRule from '@/pages/node/informal/$id/Exhibit/MappingRule';
import { FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import FLoadingTip from '@/components/FLoadingTip';
import { Helmet } from 'react-helmet';

interface InformExhibitProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
  nodes: NodesModelState;
}

function Presentable({ dispatch, match, informExhibitInfoPage, nodes }: InformExhibitProps) {

  AHooks.useMount(() => {
    dispatch<OnPageMountAction>({
      type: 'informExhibitInfoPage/onPageMount',
      payload: {
        informExhibitID: match.params.id,
      },
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnPageUnmountAction>({
      type: 'informExhibitInfoPage/onPageUnmount',
    });
  });

  if (informExhibitInfoPage.pageLoading) {
    return (<FLoadingTip height={'calc(100vh - 140px)'} />);
  }

  return (<div className={styles.styles}>
    <Helmet>
      <title>{`编辑展品信息 · ${informExhibitInfoPage.exhibit_Name} - Freelog`}</title>
    </Helmet>
    <div>
      <div className={styles.header}>
        <div className={styles.nav}>
          <label>test</label>
          <div style={{ width: 5 }} />
          <FTextBtn onClick={() => {
            router.push(FUtil.LinkTo.informNodeManagement({
              nodeID: informExhibitInfoPage.node_ID,
              showPage: 'exhibit',
            }));
          }}>
            <FContentText
              type='negative'
              // text={nodes.list.find((n) => n.nodeId === informExhibitInfoPage.nodeID)?.nodeName || ''}
              text={informExhibitInfoPage.node_Name}
            />
          </FTextBtn>
          <div style={{ width: 2 }} />
          <FContentText
            type='negative'
            text={'>'}
          />
          <div style={{ width: 10 }} />
          <FIdentityTypeBadge status={informExhibitInfoPage.exhibit_Identity} />
          <div style={{ width: 10 }} />
          <FTitleText
            style={{ maxWidth: 600 }}
            singleRow
            text={informExhibitInfoPage.exhibit_Name}
          />

          <div style={{ width: 20 }} />
          {
            informExhibitInfoPage.node_MappingRule
            && Object.entries(informExhibitInfoPage.node_MappingRule)
              .filter((imr) => imr[1]).length > 0
            && (<MappingRule
              add={informExhibitInfoPage.node_MappingRule.add}
              alter={informExhibitInfoPage.node_MappingRule.alter}
              version={informExhibitInfoPage.node_MappingRule?.version}
              active={informExhibitInfoPage.node_MappingRule.active}
              cover={informExhibitInfoPage.node_MappingRule.cover}
              title={informExhibitInfoPage.node_MappingRule.title}
              online={informExhibitInfoPage.node_MappingRule.online}
              offline={informExhibitInfoPage.node_MappingRule.offline}
              labels={informExhibitInfoPage.node_MappingRule.labels}
              replaces={informExhibitInfoPage.node_MappingRule.replaces}
              attrs={informExhibitInfoPage.node_MappingRule.attrs}
            />)
          }
        </div>
        <Space size={20}>
          {
            informExhibitInfoPage.exhibit_OnlineSwitchObj && (<>
              <span
                style={{ color: informExhibitInfoPage.exhibit_OnlineSwitchObj?.checked ? '#44C28C' : '#666' }}>{informExhibitInfoPage.exhibit_OnlineSwitchObj?.text}</span>
              <FSwitch
                disabled={informExhibitInfoPage.exhibit_OnlineSwitchObj?.disabled}
                checked={informExhibitInfoPage.exhibit_OnlineSwitchObj?.checked}
                onChange={(value) => {
                  dispatch<OnOnlineSwitchChangeAction>({
                    type: 'informExhibitInfoPage/onOnlineSwitchChange',
                    payload: {
                      checked: value,
                    },
                  });
                }}
              />
            </>)
          }
        </Space>
      </div>
      <div className={styles.body}>
        <div className={styles.content}>
          <Space direction='vertical' size={50}>
            <Contracts />
            <Viewports />
          </Space>
        </div>
        <div style={{ width: 10 }} />
        <Side />
      </div>
    </div>
    <div style={{ height: 100 }} />
  </div>);
}

export default connect(({ informExhibitInfoPage, nodes }: ConnectState) => ({
  informExhibitInfoPage,
  nodes,
}))(Presentable);
