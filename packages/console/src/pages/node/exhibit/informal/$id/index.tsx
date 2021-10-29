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
      <title>{`编辑展品信息 · ${informExhibitInfoPage.informExhibitName} - Freelog`}</title>
    </Helmet>
    <div>
      <div className={styles.header}>
        <div className={styles.nav}>
          <label>test</label>
          <div style={{ width: 5 }} />
          <FTextBtn onClick={() => {
            router.push(FUtil.LinkTo.informNodeManagement({
              nodeID: informExhibitInfoPage.nodeID,
              showPage: 'exhibit',
            }));
          }}>
            <FContentText
              type='negative'
              // text={nodes.list.find((n) => n.nodeId === informExhibitInfoPage.nodeID)?.nodeName || ''}
              text={informExhibitInfoPage.nodeName}
            />
          </FTextBtn>
          <div style={{ width: 2 }} />
          <FContentText
            type='negative'
            text={'>'}
          />
          <div style={{ width: 10 }} />
          <FIdentityTypeBadge status={informExhibitInfoPage.informExhibitIdentity} />
          <div style={{ width: 10 }} />
          <FTitleText
            style={{ maxWidth: 600 }}
            singleRow
            text={informExhibitInfoPage.informExhibitName}
          />

          <div style={{ width: 20 }} />
          {
            informExhibitInfoPage.mappingRule
            && Object.entries(informExhibitInfoPage.mappingRule)
              .filter((imr) => imr[1]).length > 0
            && (<MappingRule
              add={informExhibitInfoPage.mappingRule.add}
              alter={informExhibitInfoPage.mappingRule.alter}
              version={informExhibitInfoPage.mappingRule?.version}
              active={informExhibitInfoPage.mappingRule.active}
              cover={informExhibitInfoPage.mappingRule.cover}
              title={informExhibitInfoPage.mappingRule.title}
              online={informExhibitInfoPage.mappingRule.online}
              offline={informExhibitInfoPage.mappingRule.offline}
              labels={informExhibitInfoPage.mappingRule.labels}
              replaces={informExhibitInfoPage.mappingRule.replaces}
              attrs={informExhibitInfoPage.mappingRule.attrs}
            />)
          }
        </div>
        <Space size={20}>
          {
            informExhibitInfoPage.onlineSwitchObj && (<>
              <span
                style={{ color: informExhibitInfoPage.onlineSwitchObj?.checked ? '#44C28C' : '#666' }}>{informExhibitInfoPage.onlineSwitchObj?.text}</span>
              <FSwitch
                disabled={informExhibitInfoPage.onlineSwitchObj?.disabled}
                checked={informExhibitInfoPage.onlineSwitchObj?.checked}
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
