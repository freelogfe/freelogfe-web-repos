import * as React from 'react';
import styles from './index.less';
import FSwitch from '@/components/FSwitch';
import { Radio, Space } from 'antd';
import Policies from './Policies';
import Contracts from './Contracts';
import Viewports from './Viewports';
import Side from './Side';
import { connect, Dispatch } from 'dva';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import {
  AddAPolicyAction,
  ChangeAction,
  // FetchInfoAction,
  OnMountPageAction,
  OnUnmountPageAction,
  // UpdateStatusAction,
} from '@/models/exhibitInfoPage';
import FTooltip from '@/components/FTooltip';
import { FWarning } from '@/components/FIcons';
import { RouteComponentProps } from 'react-router';
import fConfirmModal from '@/components/fConfirmModal';
import { FUtil, FI18n, FServiceAPI } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FLoadingTip from '@/components/FLoadingTip';
import { Helmet } from 'react-helmet';
import fMessage from '@/components/fMessage';
import { FDialog } from '@/components/FDialog';
import FPolicyBuilderDrawer from '@/components/FPolicyBuilderDrawer';
import { FPolicyOperaterDrawer } from '@/components/FPolicyOperaterDrawer';
import { LoadingOutlined } from '@ant-design/icons';
import FComponentsLib from '@freelog/components-lib';

interface PresentableProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Presentable({ dispatch, exhibitInfoPage, match }: PresentableProps) {
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

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'exhibitInfoPage/onUnmountPage',
    });
  });

  if (exhibitInfoPage.pageLoading) {
    return <FLoadingTip height={'calc(100vh - 140px)'} />;
  }

  /** 上下架 */
  const changeStatus = (value: boolean) => {
    if (value) {
      // 上架
      const { policy_List } = exhibitInfoPage;
      if (policy_List.length === 0) {
        setActiveDialogShow(true);
      } else if (policy_List.filter((item: { status: number }) => item.status === 1).length === 0) {
        exhibitInfoPage.policy_List.forEach((item: any) => {
          item.checked = false;
        });
        dispatch<ChangeAction>({
          type: 'exhibitInfoPage/change',
          payload: {
            policyOperaterVisible: true,
          },
        });
      } else {
        if (
          !exhibitInfoPage.side_ResourceType.includes('主题') ||
          !exhibitInfoPage.exhibit_BelongNode_ActiveThemeId
        ) {
          const data = { onlineStatus: 1 };
          upOrDownExhibit(data);
        } else {
          fConfirmModal({
            // message: FUtil.I18n.message('msg_change_theme_confirm'),
            message: '激活该主题，将下线其它主题',
            // okText: FUtil.I18n.message('active_new_theme'),
            okText: '激活',
            // cancelText: FUtil.I18n.message('keep_current_theme'),
            cancelText: '保持当前主题',
            onOk() {
              const data = { onlineStatus: 1 };
              upOrDownExhibit(data);
            },
          });
        }
      }
    } else {
      // 下架
      const resourceNoTip = localStorage.getItem('exhibitNoTip') || false;
      if (resourceNoTip) {
        inactiveResource();
      } else {
        setInactiveDialogShow(true);
      }
    }
  };

  /** 打开添加策略弹窗 */
  const openPolicyBuilder = () => {
    dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload: {
        policyEditorVisible: true,
      },
    });
    setActiveDialogShow(false);
  };

  /** 上架 */
  const activeResource = () => {
    const updatePolicies = exhibitInfoPage.policy_List
      .filter((item: any) => item.checked)
      .map((item: { policyId: string }) => {
        return { policyId: item.policyId, status: 1 };
      });
    const data = { onlineStatus: 1, updatePolicies };
    upOrDownExhibit(data);
  };

  /** 下架 */
  const inactiveResource = () => {
    if (inactiveDialogShow && noLonger) localStorage.setItem('exhibitNoTip', 'true');

    const data = { onlineStatus: 0 };
    upOrDownExhibit(data);
  };

  /** 资源上下架 */
  const upOrDownExhibit = async (data: any) => {
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
  };

  /** 添加授权策略 */
  const addPolicy = async (title: string, text: string) => {
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
  };

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
            {exhibitInfoPage.side_ResourceType.includes('主题') && (<>
              {
                exhibitInfoPage.exhibit_Online
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
                      style={{ color: exhibitInfoPage.exhibit_Online ? '#42C28C' : '#666' }}>{FI18n.i18nNext.t('toggle_activate_theme')}</span>

                    <FSwitch
                      disabled={!exhibitInfoPage.exhibit_IsAuth && !exhibitInfoPage.exhibit_Online}
                      checked={exhibitInfoPage.exhibit_Online}
                      loading={loading}
                      onClick={(checked) => changeStatus(checked)}
                    />
                  </>)
              }

            </>)}

            {
              !exhibitInfoPage.side_ResourceType.includes('主题') && (<>
                <span style={{ color: exhibitInfoPage.exhibit_Online ? '#42C28C' : '#666' }}>上架</span>

                <FSwitch
                  disabled={!exhibitInfoPage.exhibit_IsAuth && !exhibitInfoPage.exhibit_Online}
                  checked={exhibitInfoPage.exhibit_Online}
                  loading={loading}
                  onClick={(checked) => changeStatus(checked)}
                />
              </>)
            }

            {!exhibitInfoPage.exhibit_IsAuth && (
              <FTooltip title={exhibitInfoPage.exhibit_AuthErrorText}>
                <FWarning />
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
        title='提醒'
        desc='请先为资源添加一个授权策略，再进行上架操作'
        sureText='添加策略'
        cancel={() => {
          setActiveDialogShow(false);
        }}
        sure={openPolicyBuilder}
        loading={loading}
      ></FDialog>

      <FDialog
        show={inactiveDialogShow}
        title='提醒'
        desc='下架后其它用户将无法签约该资源，确认要下架吗？'
        sureText='下架资源'
        cancel={() => {
          setInactiveDialogShow(false);
        }}
        sure={inactiveResource}
        loading={loading}
        footer={
          <Radio
            className={styles['no-longer']}
            checked={noLonger}
            onClick={() => setNoLonger(!noLonger)}
          >
            不再提醒
          </Radio>
        }
      ></FDialog>

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
        onConfirm={({ title, text }) => addPolicy(title, text)}
      />

      <FPolicyOperaterDrawer
        visible={exhibitInfoPage.policyOperaterVisible}
        type='resource'
        policiesList={exhibitInfoPage?.policy_List || []}
        onCancel={() => {
          dispatch<ChangeAction>({
            type: 'exhibitInfoPage/change',
            payload: {
              policyOperaterVisible: false,
            },
          });
        }}
        onConfirm={activeResource}
      />

      {resultPopupType !== null && (
        <div className={styles['result-modal']}>
          <div className={styles['result-popup']}>
            {loading ? (
              <div className={styles['loader']}>
                <LoadingOutlined className={styles['loader-icon']} />
                <div className={styles['loader-text']}>
                  正在{resultPopupType === 1 ? '上架' : '下架'}
                </div>
              </div>
            ) : (
              <div className={styles['result']}>
                <i
                  className={`freelog fl-icon-shangpao ${styles['result-icon']} ${
                    styles[resultPopupType === 1 ? 'up' : 'down']
                  }`}
                ></i>
                <div className={styles['result-text']}>
                  已{resultPopupType === 1 ? '上架' : '下架'}
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
