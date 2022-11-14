import * as React from 'react';
import styles from './index.less';
import FSwitch from '@/components/FSwitch';
import { Checkbox, Space } from 'antd';
import Contracts from './Contracts';
import Viewports from './Viewports';
import Side from './Side';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, InformExhibitInfoPageModelState, NodesModelState } from '@/models/connect';
import {
  OnPageMountAction,
  OnChange_Exhibit_OnlineSwitch_Action,
  OnChange_Theme_OnlineSwitch_Action,
  OnPageUnmountAction,
} from '@/models/informExhibitInfoPage';
import { history } from 'umi';
import { RouteComponentProps } from 'react-router';
import MappingRule from '@/pages/node/informal/$id/Exhibit/MappingRule';
import { FI18n, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import FLoadingTip from '@/components/FLoadingTip';
import { Helmet } from 'react-helmet';
import FTooltip from '@/components/FTooltip';
import { FDialog } from '@/components/FDialog';
import { LoadingOutlined } from '@ant-design/icons';
import FComponentsLib from '@freelog/components-lib';

interface InformExhibitProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
  nodes: NodesModelState;
}

function Presentable({ dispatch, match, informExhibitInfoPage, nodes }: InformExhibitProps) {
  const [inactiveDialogShow, setInactiveDialogShow] = React.useState(false);
  const [resultPopupType, setResultPopupType] = React.useState<null | boolean>(null);
  const [loading, setLoading] = React.useState(false);
  const [noLonger, setNoLonger] = React.useState(false);

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
    return <FLoadingTip height={'calc(100vh - 140px)'} />;
  }

  /** 上下架 */
  const changeStatus = (value: boolean) => {
    if (value) {
      // 上架
      upOrDownExhibit(value);
    } else {
      // 下架
      const resourceNoTip = localStorage.getItem('exhibitNoTip') || false;
      if (resourceNoTip) {
        inactiveResource();
      } else {
        setNoLonger(false);
        setInactiveDialogShow(true);
      }
    }
  };

  /** 下架 */
  const inactiveResource = () => {
    if (inactiveDialogShow && noLonger) localStorage.setItem('exhibitNoTip', 'true');

    upOrDownExhibit(false);
  };

  /** 上下架请求 */
  const upOrDownExhibit = (value: boolean) => {
    setInactiveDialogShow(false);
    setLoading(true);
    setResultPopupType(value);
    if (informExhibitInfoPage.exhibit_Info?.originInfo.resourceType.includes('主题')) {
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

    setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        setResultPopupType(null);
      }, 1000);
    }, 1000);
  };

  return (
    <div className={styles.styles}>
      <Helmet>
        <title>{`编辑展品信息 · ${informExhibitInfoPage.exhibit_Name} - Freelog`}</title>
      </Helmet>
      <div>
        <div className={styles.header}>
          <div className={styles.nav}>
            <label>test</label>
            <div style={{ width: 5 }} />
            <FComponentsLib.FTextBtn
              onClick={() => {
                history.push(
                  FUtil.LinkTo.informNodeManagement({
                    nodeID: informExhibitInfoPage.node_ID,
                    showPage: 'exhibit',
                  }),
                );
              }}
            >
              <FComponentsLib.FContentText
                type='negative'
                // text={nodes.list.find((n) => n.nodeId === informExhibitInfoPage.nodeID)?.nodeName || ''}
                text={informExhibitInfoPage.node_Name}
              />
            </FComponentsLib.FTextBtn>
            <div style={{ width: 2 }} />
            <FComponentsLib.FContentText type='negative' text={'>'} />
            <div style={{ width: 10 }} />
            <FIdentityTypeBadge status={informExhibitInfoPage.exhibit_Identity} />
            <div style={{ width: 10 }} />
            <FComponentsLib.FTitleText
              style={{ maxWidth: 600 }}
              singleRow
              text={informExhibitInfoPage.exhibit_Name}
            />

            <div style={{ width: 20 }} />
            {informExhibitInfoPage.exhibit_Info && (
              <div style={{ maxWidth: 500, overflow: 'hidden' }}>
                <MappingRule
                  operationAndActionRecords={
                    informExhibitInfoPage.exhibit_Info.operationAndActionRecords
                  }
                  placement='bottom'
                />
              </div>
            )}
          </div>
          <Space size={20}>
            {informExhibitInfoPage.exhibit_OnlineSwitchObj && (
              <>
                {
                  informExhibitInfoPage.exhibit_ResourceType.includes('主题') && (<>
                    {
                      informExhibitInfoPage.exhibit_OnlineSwitchObj?.checked
                        ? (<div style={{
                          backgroundColor: '#42C28C',
                          borderRadius: 12,
                          lineHeight: '18px',
                          color: 'white',
                          fontSize: 12,
                          padding: '3px 10px',
                        }}>已激活</div>)
                        : (<>
                        <span
                          style={{ color: informExhibitInfoPage.exhibit_OnlineSwitchObj?.checked ? '#44C28C' : '#666' }}>{informExhibitInfoPage.exhibit_OnlineSwitchObj?.text}</span>
                          <FSwitch
                            disabled={informExhibitInfoPage.exhibit_OnlineSwitchObj?.disabled}
                            checked={informExhibitInfoPage.exhibit_OnlineSwitchObj?.checked}
                            loading={loading}
                            onClick={(checked) => changeStatus(checked)}
                          />
                        </>)
                    }
                  </>)
                }

                {
                  !informExhibitInfoPage.exhibit_ResourceType.includes('主题') && (<>
                    <span
                      style={{ color: informExhibitInfoPage.exhibit_OnlineSwitchObj?.checked ? '#44C28C' : '#666' }}>{informExhibitInfoPage.exhibit_OnlineSwitchObj?.text}</span>
                    <FSwitch
                      disabled={informExhibitInfoPage.exhibit_OnlineSwitchObj?.disabled}
                      checked={informExhibitInfoPage.exhibit_OnlineSwitchObj?.checked}
                      loading={loading}
                      onClick={(checked) => changeStatus(checked)}
                    />
                  </>)
                }

              </>
            )}

            {!informExhibitInfoPage.exhibit_Info?.isAuth && (
              <FTooltip
                // title={!record.isAuth ? record.authErrorText : '暂无上线策略'}
                title={'存在授权问题'}
              >
                <FComponentsLib.FIcons.FWarning />
              </FTooltip>
            )}
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

      <FDialog
        show={inactiveDialogShow}
        title={FI18n.i18nNext.t('remove_exhibit_from_auth_confirmation_title')}
        desc={FI18n.i18nNext.t('confirm_msg_remove_exhibits_from_auth')}
        sureText={FI18n.i18nNext.t('btn_remove_exhibits_from_auth')}
        cancel={() => {
          setInactiveDialogShow(false);
        }}
        sure={inactiveResource}
        loading={loading}
        footer={
          <Checkbox
            className={styles['no-longer']}
            checked={noLonger}
            onChange={(e) => setNoLonger(e.target.checked)}
          >
            {FI18n.i18nNext.t('checkbox_dontaskmeagain')}
          </Checkbox>
        }
      />

      {resultPopupType !== null && (
        <div className={styles['result-modal']}>
          <div className={styles['result-popup']}>
            {loading ? (
              <div className={styles['loader']}>
                <LoadingOutlined className={styles['loader-icon']} />
                <div className={styles['loader-text']}>
                  {
                    resultPopupType
                      ? FI18n.i18nNext.t('set_resource_available_for_auth_msg_processing')
                      : FI18n.i18nNext.t('remove_resource_from_auth_msg_processing')
                  }
                </div>
              </div>
            ) : (
              <div className={styles['result']}>
                <i
                  className={`freelog fl-icon-shangpao ${styles['result-icon']} ${
                    styles[resultPopupType ? 'up' : 'down']
                  }`}
                />
                <div className={styles['result-text']}>
                  {
                    resultPopupType
                      ? FI18n.i18nNext.t('set_resource_available_for_auth_msg_done')
                      : FI18n.i18nNext.t('remove_resource_from_auth_msg_done')
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default connect(({ informExhibitInfoPage, nodes }: ConnectState) => ({
  informExhibitInfoPage,
  nodes,
}))(Presentable);

// interface RuleBar {
//   t: IExhibit;
// }
//
// function RuleBar({ t }: RuleBar) {
//   let add: {
//     exhibit: string;
//     source: {
//       type: 'resource' | 'object';
//       name: string;
//       versionRange?: string;
//     };
//   } | null = null;
//   let alter: string = '';
//   let activate_theme: string = '';
//   if (t.rules.length > 0 && t.rules[0].operations.includes('add')) {
//     add = {
//       exhibit: t.testResourceName,
//       source: {
//         type: t.originInfo.type,
//         name: t.originInfo.name,
//         versionRange: t.originInfo.versionRange,
//       },
//     };
//   }
//   if (t.rules.length > 0 && t.rules[0].operations.includes('alter')) {
//     alter = t.testResourceName;
//   }
//   if (t.rules.length > 0 && t.rules[0].operations.includes('activate_theme')) {
//     activate_theme = t.testResourceName;
//   }
//
//   return (<MappingRule
//     placement='bottom'
//     add={add || undefined}
//     alter={alter || undefined}
//     active={activate_theme || undefined}
//     // version={t.originInfo.versionRange || undefined}
//     version={(t.originInfo.versionRange === '' || t.originInfo.versionRange === 'latest') ? undefined : t.originInfo.versionRange}
//     cover={t.stateInfo.coverInfo.ruleId === 'default' ? undefined : t.stateInfo.coverInfo.coverImages[0]}
//     title={t.stateInfo.titleInfo.ruleId === 'default' ? undefined : t.stateInfo.titleInfo.title}
//     online={t.stateInfo.onlineStatusInfo.ruleId === 'default' ? undefined : t.stateInfo.onlineStatusInfo.onlineStatus === 1}
//     offline={t.stateInfo.onlineStatusInfo.ruleId === 'default' ? undefined : t.stateInfo.onlineStatusInfo.onlineStatus === 0}
//     labels={t.stateInfo.tagInfo.ruleId === 'default' ? undefined : t.stateInfo.tagInfo.tags}
//     replaces={t.stateInfo.replaceInfo.ruleId === 'default' ? undefined : t.stateInfo.replaceInfo.replaceRecords}
//     attrs={t.stateInfo.propertyInfo.ruleId === 'default'
//       ? undefined
//       : t.stateInfo.propertyInfo.testResourceProperty
//         .filter((trp) => {
//           return trp.isRuleSet;
//         })
//         .map((trp) => {
//           return {
//             type: 'add',
//             theKey: trp.key,
//             value: String(trp.value),
//             description: trp.remark,
//           };
//         })}
//   />);
// }
