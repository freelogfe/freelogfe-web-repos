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
  OnChange_Exhibit_OnlineSwitch_Action,
  OnChange_Theme_OnlineSwitch_Action,
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
import { IExhibit } from '@/models/informalNodeManagerPage';

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
            informExhibitInfoPage.exhibit_Info && (<RuleBar t={informExhibitInfoPage.exhibit_Info} />)
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
                  if (informExhibitInfoPage.exhibit_Info?.originInfo.resourceType === 'theme') {
                    dispatch<OnChange_Theme_OnlineSwitch_Action>({
                      type: 'informExhibitInfoPage/onChange_Theme_OnlineSwitch',
                      payload: {
                        checked: true,
                      },
                    });
                  } else {
                    dispatch<OnChange_Exhibit_OnlineSwitch_Action>({
                      type: 'informExhibitInfoPage/onChange_Exhibit_OnlineSwitch',
                      payload: {
                        checked: value,
                      },
                    });
                  }

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

interface RuleBar {
  t: IExhibit;
}

function RuleBar({ t }: RuleBar) {
  let add: {
    exhibit: string;
    source: {
      type: 'resource' | 'object';
      name: string;
      versionRange?: string;
    };
  } | null = null;
  let alter: string = '';
  let activate_theme: string = '';
  if (t.rules.length > 0 && t.rules[0].operations.includes('add')) {
    add = {
      exhibit: t.testResourceName,
      source: {
        type: t.originInfo.type,
        name: t.originInfo.name,
        versionRange: t.originInfo.versionRange,
      },
    };
  }
  if (t.rules.length > 0 && t.rules[0].operations.includes('alter')) {
    alter = t.testResourceName;
  }
  if (t.rules.length > 0 && t.rules[0].operations.includes('activate_theme')) {
    activate_theme = t.testResourceName;
  }

  return (<MappingRule
    placement='bottom'
    add={add || undefined}
    alter={alter || undefined}
    active={activate_theme || undefined}
    // version={t.originInfo.versionRange || undefined}
    version={(t.originInfo.versionRange === '' || t.originInfo.versionRange === 'latest') ? undefined : t.originInfo.versionRange}
    cover={t.stateInfo.coverInfo.ruleId === 'default' ? undefined : t.stateInfo.coverInfo.coverImages[0]}
    title={t.stateInfo.titleInfo.ruleId === 'default' ? undefined : t.stateInfo.titleInfo.title}
    online={t.stateInfo.onlineStatusInfo.ruleId === 'default' ? undefined : t.stateInfo.onlineStatusInfo.onlineStatus === 1}
    offline={t.stateInfo.onlineStatusInfo.ruleId === 'default' ? undefined : t.stateInfo.onlineStatusInfo.onlineStatus === 0}
    labels={t.stateInfo.tagInfo.ruleId === 'default' ? undefined : t.stateInfo.tagInfo.tags}
    replaces={t.stateInfo.replaceInfo.ruleId === 'default' ? undefined : t.stateInfo.replaceInfo.replaceRecords}
    attrs={t.stateInfo.propertyInfo.ruleId === 'default'
      ? undefined
      : t.stateInfo.propertyInfo.testResourceProperty
        .filter((trp) => {
          return trp.isRuleAdd;
        })
        .map((trp) => {
          return {
            type: 'add',
            theKey: trp.key,
            value: String(trp.value),
            description: trp.remark,
          };
        })}
  />);
}
