import * as React from 'react';
import styles from './index.less';
import FSwitch from '@/components/FSwitch';
import { Checkbox, Space } from 'antd';
import Policies from './Policies';
import Contracts from './Contracts';
import Viewports from './Viewports';
import Side from './Side';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import {
  AddAPolicyAction,
  ChangeAction,
  FetchInfoAction,
  OnMountPageAction,
  OnUnmountPageAction,
  // UpdateStatusAction,
} from '@/models/exhibitInfoPage';
import FTooltip from '@/components/FTooltip';
import { RouteComponentProps } from 'react-router';
import fConfirmModal from '@/components/fConfirmModal';
import { FUtil, FI18n, FServiceAPI } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FLoadingTip from '@/components/FLoadingTip';
import { Helmet } from 'react-helmet';
import fMessage from '@/components/fMessage';
import { FDialog } from '@/components/FDialog';
import FPolicyBuilderDrawer from '@/components/FPolicyBuilderDrawer';
import FPolicyOperatorDrawer from '@/components/FPolicyOperatorDrawer';
import { LoadingOutlined } from '@ant-design/icons';
import FComponentsLib from '@freelog/components-lib';
import useUrlState from '@ahooksjs/use-url-state';

interface PresentableProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Presentable({ dispatch, exhibitInfoPage, match }: PresentableProps) {

  const [urlState] = useUrlState<{ openCreatePolicyDrawer: 'true', openOperatePolicyDrawer: 'true' }>();

  const [activeDialogShow, setActiveDialogShow] = React.useState(false);
  const [inactiveDialogShow, setInactiveDialogShow] = React.useState(false);
  const [resultPopupType, setResultPopupType] = React.useState<null | 0 | 1>(null);
  const [loading, setLoading] = React.useState(false);
  const [noLonger, setNoLonger] = React.useState(false);

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'exhibitInfoPage/onMountPage',
      payload: {
        exhibitID: match.params.id,
      },
    });
  });

  AHooks.useMount(() => {
    if (urlState.openCreatePolicyDrawer) {
      dispatch<ChangeAction>({
        type: 'exhibitInfoPage/change',
        payload: {
          policyEditorVisible: true,
        },
      });
    }

    if (urlState.openOperatePolicyDrawer) {
      dispatch<ChangeAction>({
        type: 'exhibitInfoPage/change',
        payload: {
          policyOperaterVisible: true,
        },
      });
    }
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'exhibitInfoPage/onUnmountPage',
    });
  });

  /** 展品上下架 */
  function changeExhibitStatus(value: boolean) {
    if (exhibitInfoPage.side_ResourceType.includes('主题')) {
      fConfirmModal({
        message: FI18n.i18nNext.t('msg_change_theme_confirm', { ThemeName: exhibitInfoPage.exhibit_Name }),
        okText: FI18n.i18nNext.t('btn_activate_theme'),
        cancelText: FI18n.i18nNext.t('keep_current_theme'),
        onOk() {

          if (exhibitInfoPage.policy_List.length === 0) {
            fConfirmModal({
              message: FI18n.i18nNext.t('alarm_theme_activate_plan'),
              okText: FI18n.i18nNext.t('activatetheme_btn_create_auth_plan'),
              cancelText: FI18n.i18nNext.t('btn_cancel'),
              onOk() {
                // onDelete(bp.theKey);
                // self.open(FUtil.LinkTo.exhibitManagement({ exhibitID: i.id }) + '?openCreatePolicyDrawer=true');
                // setActiveDialogShow(true);
                dispatch<ChangeAction>({
                  type: 'exhibitInfoPage/change',
                  payload: {
                    policyEditorVisible: true,
                  },
                });
              },
            });
            return;
          }

          if (!exhibitInfoPage.policy_List.some((item: { status: number }) => item.status === 1)) {
            fConfirmModal({
              // message: '需要先启用策略',
              message: FI18n.i18nNext.t('msg_activate_theme_for_auth'),
              okText: FI18n.i18nNext.t('activatetheme_activate_btn_select_auth_plan'),
              cancelText: FI18n.i18nNext.t('btn_cancel'),
              onOk() {
                // onDelete(bp.theKey);
                // self.open(FUtil.LinkTo.exhibitManagement({ exhibitID: i.id }) + '?openOperatePolicyDrawer=true');
                dispatch<ChangeAction>({
                  type: 'exhibitInfoPage/change',
                  payload: {
                    policyOperaterVisible: true,
                  },
                });
              },
            });
            return;
          }

          const data = { onlineStatus: 1 };
          upOrDownExhibit(data);
        },
      });
      return;
    }
    if (value) {
      if (exhibitInfoPage.policy_List.length === 0) {
        setActiveDialogShow(true);
      } else if (!exhibitInfoPage.policy_List.some((item: { status: number }) => item.status === 1)) {
        // exhibitInfoPage.policy_List.forEach((item: any) => {
        //   item.checked = false;
        // });
        dispatch<ChangeAction>({
          type: 'exhibitInfoPage/change',
          payload: {
            policyOperaterVisible: true,
          },
        });
      } else {
        const data = { onlineStatus: 1 };
        upOrDownExhibit(data);
      }
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
  }

  function activateTheme() {

  }

  /** 打开添加策略弹窗 */
  function openPolicyBuilder() {
    dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload: {
        policyEditorVisible: true,
      },
    });
    setActiveDialogShow(false);
  }

  /** 上架 */
  function activeResource() {
    const updatePolicies = exhibitInfoPage.policy_List
      .filter((item: any) => item.checked)
      .map((item: { policyId: string }) => {
        return { policyId: item.policyId, status: 1 };
      });
    const data = { onlineStatus: 1, updatePolicies };
    upOrDownExhibit(data);
  }

  /** 下架 */
  function inactiveResource() {
    if (inactiveDialogShow && noLonger) {
      localStorage.setItem('exhibitNoTip', 'true');
    }

    const data = { onlineStatus: 0 };
    upOrDownExhibit(data);
  }

  /** 资源上下架 */
  async function upOrDownExhibit(data: any) {
    setActiveDialogShow(false);
    setInactiveDialogShow(false);
    setLoading(true);
    setResultPopupType(data.onlineStatus);

    const result = await FUtil.Request({
      method: 'PUT',
      url: `/v2/presentables/${match.params.id}/onlineStatus`,
      data,
    });
    if (result.errCode === 0) {
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => {
          setResultPopupType(null);
        }, 1000);
      }, 1000);

      exhibitInfoPage.exhibit_Online = data.onlineStatus === 1;
      if (data.updatePolicies) {
        dispatch<ChangeAction>({
          type: 'exhibitInfoPage/change',
          payload: {
            policyOperaterVisible: false,
          },
        });
        data.updatePolicies.forEach((item: any) => {
          const i = exhibitInfoPage.policy_List.findIndex(
            (policy) => policy.policyId === item.policyId,
          );
          exhibitInfoPage.policy_List[i].status = 1;
        });
      }

      dispatch<ChangeAction>({
        type: 'exhibitInfoPage/change',
        payload: {
          policy_List: exhibitInfoPage.policy_List,
        },
      });
    } else {
      fMessage(result.msg, 'error');
      setLoading(false);
      setResultPopupType(null);
    }
  }

  /** 添加授权策略 */
  async function addPolicy(title: string, text: string) {
    dispatch<AddAPolicyAction>({
      type: 'exhibitInfoPage/addAPolicy',
      payload: {
        title,
        text,
      },
    });

    dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload: {
        policyEditorVisible: false,
      },
    });
  }

  if (exhibitInfoPage.pageLoading) {
    return <FLoadingTip height={'calc(100vh - 140px)'} />;
  }

  return (
    <div className={styles.styles}>
      <Helmet>
        <title>{`编辑展品信息 · ${exhibitInfoPage.exhibit_Name} - Freelog`}</title>
      </Helmet>
      <div>
        <div className={styles.header}>
          <div className={styles.nav}>
            {/*<FLink to={}>*/}
            <FComponentsLib.FTextBtn
              onClick={() => {
                window.open(
                  FUtil.LinkTo.nodeManagement({ nodeID: exhibitInfoPage.exhibit_BelongNode_ID }),
                );
              }}
              style={{ fontWeight: 600 }}
              type='default'
            >
              <FComponentsLib.FContentText
                type='negative'
                text={exhibitInfoPage.exhibit_BelongNode_Name}
                className={styles.nodeName}
              />
            </FComponentsLib.FTextBtn>
            {/*</FLink>*/}
            <div style={{ width: 2 }} />
            <FComponentsLib.FContentText type='negative' text={'>'} />
            <div style={{ width: 2 }} />
            <FComponentsLib.FTitleText
              text={exhibitInfoPage.exhibit_Name}
              style={{
                maxWidth: 800,
              }}
              singleRow
            />
          </div>
          <Space size={20}>
            {
              exhibitInfoPage.side_ResourceType.includes('主题') && (<>
                {
                  exhibitInfoPage.exhibit_Online
                    ? (<div style={{
                      backgroundColor: '#42C28C',
                      borderRadius: 12,
                      lineHeight: '18px',
                      color: 'white',
                      fontSize: 12,
                      padding: '3px 10px',
                    }}>{FI18n.i18nNext.t('theme_state_active')}</div>)
                    : (<>
                    <span
                      style={{ color: exhibitInfoPage.exhibit_Online ? '#42C28C' : '#666' }}>{FI18n.i18nNext.t('toggle_activate_theme')}</span>

                      <FSwitch
                        disabled={!exhibitInfoPage.exhibit_IsAuth && !exhibitInfoPage.exhibit_Online}
                        checked={exhibitInfoPage.exhibit_Online}
                        loading={loading}
                        onClick={(checked) => changeExhibitStatus(checked)}
                      />
                    </>)
                }

              </>)
            }

            {
              !exhibitInfoPage.side_ResourceType.includes('主题') && (<>
                <span
                  style={{ color: exhibitInfoPage.exhibit_Online ? '#42C28C' : '#666' }}>{FI18n.i18nNext.t('switch_set_exhibit_avaliable')}</span>

                <FSwitch
                  disabled={!exhibitInfoPage.exhibit_IsAuth && !exhibitInfoPage.exhibit_Online}
                  checked={exhibitInfoPage.exhibit_Online}
                  loading={loading}
                  onClick={(checked) => changeExhibitStatus(checked)}
                />
              </>)
            }

            {!exhibitInfoPage.exhibit_IsAuth && (
              <FTooltip title={exhibitInfoPage.exhibit_AuthErrorText}>
                <FComponentsLib.FIcons.FWarning />
              </FTooltip>
            )}
          </Space>
        </div>
        <div className={styles.body}>
          <div className={styles.content}>
            <div>
              <Policies />
              <div style={{ height: 50 }} />
              <Contracts />
              <div style={{ height: 50 }} />
              <Viewports />
            </div>
          </div>
          <div style={{ width: 10 }} />
          <Side />
        </div>
      </div>
      <div style={{ height: 100 }} />

      <FDialog
        show={activeDialogShow}
        title={FI18n.i18nNext.t('set_resource_available_for_auth_activate_auth_plan_title')}
        desc={FI18n.i18nNext.t('msg_set_resource_avaliable_for_auth01')}
        sureText={FI18n.i18nNext.t('set_resource_available_for_auth_btn_create_auth_plan')}
        cancelText={FI18n.i18nNext.t('btn_cancel')}
        cancel={() => {
          setActiveDialogShow(false);
        }}
        sure={openPolicyBuilder}
        loading={loading}
      />

      <FDialog
        show={inactiveDialogShow}
        title={FI18n.i18nNext.t('remove_exhibit_from_auth_confirmation_title')}
        desc={FI18n.i18nNext.t('confirm_msg_remove_resource_from_auth')}
        sureText={FI18n.i18nNext.t('remove_resource_from_auth_btn_remve')}
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

      <FPolicyBuilderDrawer
        visible={exhibitInfoPage.policyEditorVisible}
        alreadyUsedTexts={exhibitInfoPage?.policy_List.map((ip: any) => {
          return ip.policyText;
        })}
        alreadyUsedTitles={exhibitInfoPage?.policy_List.map((ip: any) => {
          return ip.policyName;
        })}
        targetType='resource'
        onCancel={() => {
          dispatch<ChangeAction>({
            type: 'exhibitInfoPage/change',
            payload: {
              policyEditorVisible: false,
            },
          });
        }}
        onConfirm={({ title, text }) => {
          addPolicy(title, text);
        }}
      />

      <FPolicyOperatorDrawer
        visible={exhibitInfoPage.policyOperaterVisible}
        // visible={true}
        // type='resource'
        titleText={exhibitInfoPage.side_ResourceType.includes('主题')
          ? FI18n.i18nNext.t('activatetheme_activate_authplan_title')
          : FI18n.i18nNext.t('showexhibit_activate_authplan_title')}
        confirmText={exhibitInfoPage.side_ResourceType.includes('主题')
          ? FI18n.i18nNext.t('activatetheme_activate_authplan_btn')
          : FI18n.i18nNext.t('showexhibit_activate_authplan_btn')}
        tipText={exhibitInfoPage.side_ResourceType.includes('主题')
          ? FI18n.i18nNext.t('msg_activate_theme_for_auth')
          : FI18n.i18nNext.t('msg_set_exhibits_avaliable_for_auth')}
        policiesList={exhibitInfoPage?.policy_List || []}
        onCancel={() => {
          dispatch<FetchInfoAction>({
            type: 'exhibitInfoPage/fetchInfo',
          });
          dispatch<ChangeAction>({
            type: 'exhibitInfoPage/change',
            payload: {
              policyOperaterVisible: false,
            },
          });
        }}
        onConfirm={activeResource}
        onNewPolicy={openPolicyBuilder}
      />

      {
        resultPopupType !== null && (
          <div className={styles['result-modal']}>
            <div className={styles['result-popup']}>
              {loading ? (
                <div className={styles['loader']}>
                  <LoadingOutlined className={styles['loader-icon']} />
                  <div className={styles['loader-text']}>
                    {
                      resultPopupType === 1
                        ? FI18n.i18nNext.t('set_resource_available_for_auth_msg_processing')
                        : FI18n.i18nNext.t('remove_resource_from_auth_msg_processing')}
                  </div>
                </div>
              ) : (
                <div className={styles['result']}>
                  <i
                    className={`freelog fl-icon-shangpao ${styles['result-icon']} ${
                      styles[resultPopupType === 1 ? 'up' : 'down']
                    }`}
                  />
                  <div className={styles['result-text']}>
                    {
                      resultPopupType === 1
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

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Presentable);
