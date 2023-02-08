import * as React from 'react';
import styles from './index.less';
import FSwitch from '@/components/FSwitch';
import { Checkbox, message, Space } from 'antd';
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
} from '@/models/exhibitInfoPage';
import FTooltip from '@/components/FTooltip';
import { RouteComponentProps } from 'react-router';
import fConfirmModal from '@/components/fConfirmModal';
import { FUtil, FI18n, FServiceAPI } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FLoadingTip from '@/components/FLoadingTip';
import { Helmet } from 'react-helmet';
// import fMessage from '@/components/fMessage';
// import { FDialog } from '@/components/FDialog';
// import FPolicyBuilderDrawer from '@/components/FPolicyBuilderDrawer';
// import FPolicyOperatorDrawer from '@/components/FPolicyOperatorDrawer';
// import { LoadingOutlined } from '@ant-design/icons';
import FComponentsLib from '@freelog/components-lib';
import useUrlState from '@ahooksjs/use-url-state';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';
import fPolicyBuilder from '@/components/fPolicyBuilder';
import fPolicyOperator from '@/components/fPolicyOperator';
import { onlineExhibit } from '@/pages/node/utils/tools';

interface PresentableProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Presentable({ dispatch, exhibitInfoPage, match }: PresentableProps) {

  const [urlState] = useUrlState<{ openCreatePolicyDrawer: 'true', openOperatePolicyDrawer: 'true' }>();

  // const [activeDialogShow, setActiveDialogShow] = React.useState(false);
  // const [inactiveDialogShow, setInactiveDialogShow] = React.useState(false);
  // const [resultPopupType, setResultPopupType] = React.useState<null | 0 | 1>(null);
  // const [loading, setLoading] = React.useState(false);
  // const [noLonger, setNoLonger] = React.useState(false);

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

  async function activateTheme() {
    const res1: boolean = await fPromiseModalConfirm({
      title: '',
      icon: <div />,
      content: FI18n.i18nNext.t('msg_change_theme_confirm', { ThemeName: exhibitInfoPage.exhibit_Name }),
      okText: FI18n.i18nNext.t('btn_activate_theme'),
      cancelText: FI18n.i18nNext.t('keep_current_theme'),
    });

    if (!res1) {
      return;
    }

    await onlineExhibit(exhibitInfoPage.exhibit_ID);

    dispatch<FetchInfoAction>({
      type: 'exhibitInfoPage/fetchInfo',
    });
  }

  /** 展品上下架 */
  // async function changeExhibitStatus(value: boolean) {
  //   if (exhibitInfoPage.side_ResourceType.includes('主题')) {
  //
  //   }
  //   if (value) {
  //     if (exhibitInfoPage.policy_List.length === 0) {
  //       setActiveDialogShow(true);
  //     } else if (!exhibitInfoPage.policy_List.some((item: { status: number }) => item.status === 1)) {
  //       // exhibitInfoPage.policy_List.forEach((item: any) => {
  //       //   item.checked = false;
  //       // });
  //       dispatch<ChangeAction>({
  //         type: 'exhibitInfoPage/change',
  //         payload: {
  //           policyOperaterVisible: true,
  //         },
  //       });
  //     } else {
  //       const data = { onlineStatus: 1 };
  //       upOrDownExhibit(data);
  //     }
  //   } else {
  //     // 下架
  //     const resourceNoTip = localStorage.getItem('exhibitNoTip') || false;
  //     if (resourceNoTip) {
  //       inactiveResource();
  //     } else {
  //       setNoLonger(false);
  //       setInactiveDialogShow(true);
  //     }
  //   }
  // }

  // function activateTheme() {
  //
  // }

  /** 打开添加策略弹窗 */
  // function openPolicyBuilder() {
  //   dispatch<ChangeAction>({
  //     type: 'exhibitInfoPage/change',
  //     payload: {
  //       policyEditorVisible: true,
  //     },
  //   });
  //   setActiveDialogShow(false);
  // }

  /** 上架 */
  // function activeResource() {
  //   const updatePolicies = exhibitInfoPage.policy_List
  //     .filter((item: any) => item.checked)
  //     .map((item: { policyId: string }) => {
  //       return { policyId: item.policyId, status: 1 };
  //     });
  //   const data = { onlineStatus: 1, updatePolicies };
  //   upOrDownExhibit(data);
  // }

  /** 下架 */
  // function inactiveResource() {
  //   if (inactiveDialogShow && noLonger) {
  //     localStorage.setItem('exhibitNoTip', 'true');
  //   }
  //
  //   const data = { onlineStatus: 0 };
  //   upOrDownExhibit(data);
  // }

  /** 资源上下架 */
  // async function upOrDownExhibit(data: any) {
  //   setActiveDialogShow(false);
  //   setInactiveDialogShow(false);
  //   setLoading(true);
  //   setResultPopupType(data.onlineStatus);
  //
  //   const result = await FUtil.Request({
  //     method: 'PUT',
  //     url: `/v2/presentables/${match.params.id}/onlineStatus`,
  //     data,
  //   });
  //   if (result.errCode === 0) {
  //     setTimeout(() => {
  //       setLoading(false);
  //       setTimeout(() => {
  //         setResultPopupType(null);
  //       }, 1000);
  //     }, 1000);
  //
  //     exhibitInfoPage.exhibit_Online = data.onlineStatus === 1;
  //     if (data.updatePolicies) {
  //       dispatch<ChangeAction>({
  //         type: 'exhibitInfoPage/change',
  //         payload: {
  //           policyOperaterVisible: false,
  //         },
  //       });
  //       data.updatePolicies.forEach((item: any) => {
  //         const i = exhibitInfoPage.policy_List.findIndex(
  //           (policy) => policy.policyId === item.policyId,
  //         );
  //         exhibitInfoPage.policy_List[i].status = 1;
  //       });
  //     }
  //
  //     dispatch<ChangeAction>({
  //       type: 'exhibitInfoPage/change',
  //       payload: {
  //         policy_List: exhibitInfoPage.policy_List,
  //       },
  //     });
  //   } else {
  //     fMessage(result.msg, 'error');
  //     setLoading(false);
  //     setResultPopupType(null);
  //   }
  // }

  // /** 添加授权策略 */
  // async function addPolicy(title: string, text: string) {
  //   dispatch<AddAPolicyAction>({
  //     type: 'exhibitInfoPage/addAPolicy',
  //     payload: {
  //       title,
  //       text,
  //     },
  //   });
  //
  //   dispatch<ChangeAction>({
  //     type: 'exhibitInfoPage/change',
  //     payload: {
  //       policyEditorVisible: false,
  //     },
  //   });
  // }

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
          <FComponentsLib.FHotspotTooltip
            id={'exhibitDetailPage.onlineSwitch'}
            style={{ left: -42, top: -4 }}
            text={FI18n.i18nNext.t('hotpots_exhibit_toggle_exhibit')}
          >
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
                          // loading={loading}
                          onClick={() => {
                            activateTheme();
                          }}
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
                    // loading={loading}
                    onChange={async (checked) => {
                      if (checked) {
                        await onlineExhibit(exhibitInfoPage.exhibit_ID);
                      } else {
                        const params2: Parameters<typeof FServiceAPI.Exhibit.presentablesOnlineStatus>[0] = {
                          presentableId: exhibitInfoPage.exhibit_ID,
                          onlineStatus: 0,
                        };
                        await FServiceAPI.Exhibit.presentablesOnlineStatus(params2);
                        message.success({
                          content: FI18n.i18nNext.t('remove_resource_from_auth_msg_done'),
                          duration: 2,
                        });
                      }
                      dispatch<FetchInfoAction>({
                        type: 'exhibitInfoPage/fetchInfo',
                      });
                    }}
                  />
                </>)
              }

              {!exhibitInfoPage.exhibit_IsAuth && (
                <FTooltip title={exhibitInfoPage.exhibit_AuthErrorText}>
                  <FComponentsLib.FIcons.FWarning />
                </FTooltip>
              )}
            </Space>
          </FComponentsLib.FHotspotTooltip>
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
    </div>
  );
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Presentable);

