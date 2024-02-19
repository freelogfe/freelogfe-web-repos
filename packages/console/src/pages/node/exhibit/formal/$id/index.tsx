import * as React from 'react';
import styles from './index.less';
import FSwitch from '@/components/FSwitch';
import { message, Space } from 'antd';
import Policies from './Policies';
import Contracts from './Contracts';
import Viewports from './Viewports';
import Side from './Side';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import {
  ChangeAction,
  FetchInfoAction,
  OnMountPageAction,
  OnUnmountPageAction,
} from '@/models/exhibitInfoPage';
import FTooltip from '@/components/FTooltip';
import { RouteComponentProps } from 'react-router';
import { FUtil, FI18n, FServiceAPI } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FLoadingTip from '@/components/FLoadingTip';
import { Helmet } from 'react-helmet';
import FComponentsLib from '@freelog/components-lib';
import useUrlState from '@ahooksjs/use-url-state';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';
import { onlineExhibit } from '@/pages/node/utils/tools';
import { fOnOffFeedback } from '@/components/fOnOffFeedback';

interface PresentableProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Presentable({ dispatch, exhibitInfoPage, match }: PresentableProps) {

  const [urlState] = useUrlState<{ openCreatePolicyDrawer: 'true', openOperatePolicyDrawer: 'true' }>();

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
      title: '提示',
      // icon: <div />,
      description: FI18n.i18nNext.t('msg_change_theme_confirm', { ThemeName: exhibitInfoPage.exhibit_Name }),
      okText: FI18n.i18nNext.t('btn_activate_theme'),
      cancelText: FI18n.i18nNext.t('keep_current_theme'),
    });

    if (!res1) {
      return;
    }

    await onlineExhibit(exhibitInfoPage.exhibit_ID);

    FComponentsLib.fSetHotspotTooltipVisible('exhibitDetailPage.onlineSwitch', {
      value: false,
      effectiveImmediately: true,
      onlyNullish: false,
    });

    dispatch<FetchInfoAction>({
      type: 'exhibitInfoPage/fetchInfo',
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
                          onChange={async () => {
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
                      // FComponentsLib.fSetHotspotTooltipVisible('exhibitDetailPage.onlineSwitch', {
                      //   value: false,
                      //   effectiveImmediately: true,
                      //   onlyNullish: false,
                      // });
                      if (checked) {
                        await onlineExhibit(exhibitInfoPage.exhibit_ID);
                      } else {

                        const confirm: boolean = await fPromiseModalConfirm({
                          title: '下架展品',
                          description: '下架后，其它用户将无法签约该展品，确认要下架吗？',
                        });

                        if (confirm) {
                          const params2: Parameters<typeof FServiceAPI.Exhibit.presentablesOnlineStatus>[0] = {
                            presentableId: exhibitInfoPage.exhibit_ID,
                            onlineStatus: 0,
                          };
                          await FServiceAPI.Exhibit.presentablesOnlineStatus(params2);
                          fOnOffFeedback({
                            state: 'off',
                            message: FI18n.i18nNext.t('remove_resource_from_auth_msg_done'),
                          });
                        }

                      }
                      FComponentsLib.fSetHotspotTooltipVisible('exhibitDetailPage.onlineSwitch', {
                        value: false,
                        effectiveImmediately: true,
                        onlyNullish: false,
                      });
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

