import * as React from 'react';
import styles from './index.less';
import FInput from '@/components/FInput';
import { Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, NodeManagerModelState } from '@/models/connect';
import {
  OnActiveAction,
  OnChangeThemeAction,
  OnChange_ShowPage_Action,
  OnMount_ThemePage_Action,
  OnUnmount_ThemePage_Action, FetchThemesAction,
} from '@/models/nodeManagerPage';
import { history, withRouter } from 'umi';
import FNoDataTip from '@/components/FNoDataTip';
import FLoadingTip from '@/components/FLoadingTip';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Sider from '../Sider';
import FTooltip from '@/components/FTooltip';
import fConfirmModal from '@/components/fConfirmModal';
import { FUtil, FI18n, FServiceAPI } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FCoverImage from '@/components/FCoverImage';
import { Helmet } from 'react-helmet';
import FCoverFooterButtons from '@/components/FCoverFooterButtons';
import fMessage from '@/components/fMessage';
import FComponentsLib from '@freelog/components-lib';
import { LoadingOutlined } from '@ant-design/icons';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';

// import { onlineExhibit } from '@/pages/node/utils/tools';

interface ThemesProps {
  match: any;
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

function Themes({ match, dispatch, nodeManagerPage }: ThemesProps) {
  const [themeList, setThemeList] = React.useState<any[]>([]);
  const [emptyTheme, setEmptyTheme] = React.useState<any>(null);
  const [activeId, setActiveId] = React.useState<null | string>(null);
  const [emptyPopupShow, setEmptyPopupShow] = React.useState(false);

  AHooks.useMount(async () => {
    dispatch<OnMount_ThemePage_Action>({
      type: 'nodeManagerPage/onMount_ThemePage',
    });

    const [themeList, emptyThemeList] = await Promise.all([
      FServiceAPI.Resource.resourcesRecommend({ recommendType: 1 }),
      FServiceAPI.Resource.resourcesRecommend({ recommendType: 2 }),
    ]);
    setThemeList(themeList.data);
    setEmptyTheme(emptyThemeList.data[0]);
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmount_ThemePage_Action>({
      type: 'nodeManagerPage/onUnmount_ThemePage',
    });
  });

  /** 跳转资源详情页 */
  const toResourceDetail = (id: string) => {
    window.open(FUtil.LinkTo.resourceDetails({ resourceID: id }));
  };

  /** 浏览更多主题 */
  const viewMoreTheme = () => {
    history.push(FUtil.LinkTo.market({ query: '主题' }));
  };

  /** 激活主题 */
  const activeTheme = async (theme: any) => {
    if (activeId) return;

    setActiveId(theme.resourceId);

    // const params: Parameters<typeof FServiceAPI.Exhibit.createPresentable>[0] = {
    const params: Parameters<typeof FServiceAPI.Exhibit.createPresentable>[0] = {
      nodeId: Number(match.params.id),
      resourceId: theme.resourceId,
      version: theme.latestVersion,
      resolveResources: [
        {
          resourceId: theme.resourceId,
          // contracts: [
          //   {
          //     policyId: theme.policies.find((item: any) => item.policyName === '开放授权').policyId,
          //   },
          // ],
          contracts: theme.policies
            .filter((p: any) => {
              return p.status === 1;
            })
            .map((p: any) => {
              return {
                policyId: p.policyId,
              };
            }),
        },
      ],
      presentableName: theme.resourceName.split('/')[1],
      policies: [
        {
          policyName: '开放授权',
          policyText: 'for public initial[active]:\n  terminate',
          status: 1,
        },
      ],
    };
    let result = await FServiceAPI.Exhibit.createPresentable(params);

    if (result.errCode !== 0) {
      fMessage('激活失败', 'error');
      setActiveId(null);
      return;
    }

    const activeParams: Parameters<typeof FServiceAPI.Exhibit.presentablesOnlineStatus>[0] = {
      presentableId: result.data.presentableId,
      onlineStatus: 1,
    };
    result = await FServiceAPI.Exhibit.presentablesOnlineStatus(activeParams);

    if (result.errCode !== 0) {
      fMessage('激活失败', 'error');
      setActiveId(null);
      return;
    }

    setActiveId(null);
    setEmptyPopupShow(false);
    fMessage('激活成功', 'success');
    // dispatch<OnChange_ShowPage_Action>({
    //   type: 'nodeManagerPage/onChange_ShowPage',
    //   payload: {
    //     value: 'theme',
    //   },
    // });
    dispatch<FetchThemesAction>({
      type: 'nodeManagerPage/fetchThemes',
    });
  };

  /** 开关占位主题弹窗 */
  const operateEmptyPopup = () => {
    setEmptyPopupShow(!emptyPopupShow);
  };

  return (
    <>
      <Helmet>
        <title>{`主题管理 · ${nodeManagerPage.nodeName} - Freelog`}</title>
      </Helmet>
      <FLeftSiderLayout
        // header={''}
        sider={<Sider />}
        type='empty'
      >
        {
          nodeManagerPage.theme_ListState === 'noData'
            ? (<div className={styles.wrapper}>
              <div className={styles['recommend-area']}>
                <div className={styles.btns}>
                  <div className={styles['develop-btn']} onClick={operateEmptyPopup}>
                    我是主题/插件开发者
                  </div>
                  <div className={styles['more-btn']} onClick={viewMoreTheme}>
                    浏览更多主题
                  </div>
                </div>
                <div className={styles.title}>为你的节点选择一个主题</div>
                <div className={styles.desc}>
                  主题决定了节点的整体外观和设计，你签约的展品将通过主题在节点陈列和展示。主题为节点提供了高度可定制话的可能，你可以根据需要随时更改节点的主题
                </div>
                <div className={styles.list}>
                  {
                    themeList.map((item) => {
                      return (<div className={styles.theme} key={item.resourceId}>
                        <div className={styles.cover}>
                          <img className={styles['cover-img']} src={item.coverImages[0]} alt={''} />
                          <div className={styles.triangle} />
                          <div className={styles['free-text']}>免费</div>
                        </div>
                        <div className={styles['right-area']}>
                          <div className={styles['title-area']}>
                            <div className={styles.title}>{item.resourceName.split('/')[1]}</div>
                            <FTooltip title='查看资源详情'>
                              <i
                                className={`freelog fl-icon-chakanziyuan ${styles['view-detail']}`}
                                onClick={() => toResourceDetail(item.resourceId)}
                              />
                            </FTooltip>
                          </div>
                          <div className={styles.intro}>{item.intro}</div>
                          <div className={styles.version}>最新版本 {item.latestVersion}</div>
                          <div className={styles['active-btn']} onClick={() => activeTheme(item)}>
                            {activeId === item.resourceId && (
                              <LoadingOutlined className={styles.loader} />
                            )}
                            激活主题
                          </div>
                        </div>
                      </div>);
                    })}
                </div>
              </div>

              {
                emptyPopupShow && (<div className={styles.modal}>
                  <div className={styles['empty-popup']}>
                    <div className={styles.title}>我是主题/插件开发者</div>
                    <div className={styles.desc}>使用占位主题，可快速进行主题/插件的开发</div>
                    <div className={styles.btns}>
                      <div className={styles['cancel-btn']} onClick={operateEmptyPopup}>
                        取消
                      </div>
                      <div className={styles['active-btn']} onClick={() => activeTheme(emptyTheme)}>
                        {activeId === emptyTheme.resourceId && (
                          <LoadingOutlined className={styles.loader} />
                        )}
                        使用占位主题
                      </div>
                    </div>
                    <i
                      className={`freelog fl-icon-guanbi ${styles['close-btn']}`}
                      onClick={operateEmptyPopup}
                    />
                  </div>
                </div>)
              }
            </div>)
            : (<>
              <div className={styles.header}>
                <FComponentsLib.FTitleText type='h1' text={'主题管理'} />
                <FInput
                  className={styles.input}
                  theme='dark'
                  debounce={300}
                  onDebounceChange={(value) => {
                    dispatch<OnChangeThemeAction>({
                      type: 'nodeManagerPage/onChangeTheme',
                      payload: {
                        themeInputFilter: value,
                      },
                    });
                  }}
                  placeholder={FI18n.i18nNext.t('nodemgmt_search_themes_hint')}
                />
              </div>
              {nodeManagerPage.theme_ListState === 'loading' && (
                <FLoadingTip height={'calc(100vh - 270px)'} />
              )}
              {nodeManagerPage.theme_ListState === 'noSearchResult' && (
                <FNoDataTip height={'calc(100vh - 270px)'} tipText={'无搜索结果'} />
              )}
              {nodeManagerPage.theme_ListState === 'loaded' && (
                <div className={styles.body}>
                  {nodeManagerPage.theme_List.map((i) => {
                    // const hasActiveBtn: boolean = !i.isOnline && i.isAuth; //&& i.policies.length > 0;
                    const hasActiveBtn: boolean = !i.isOnline; //&& i.policies.length > 0;
                    return (
                      <div className={styles.theme} key={i.id}>
                        <div className={styles.cover}>
                          <Space size={10}>
                            {i.isOnline && (
                              <label className={styles.label}>
                                {/*{FI18n.i18nNext.t('state_active')}*/}
                                {FI18n.i18nNext.t('theme_state_active')}
                              </label>
                            )}

                            {!i.isAuth && (
                              <FTooltip title={i.authErrorText}>
                                <FComponentsLib.FIcons.FWarning />
                              </FTooltip>
                            )}
                          </Space>

                          <FCoverImage
                            src={i.cover || ''}
                            width={280}
                            style={{ borderRadius: 4, display: 'block' }}
                          />

                          {nodeManagerPage.theme_ActivatingThemeID === i.id ? (
                            <div className={styles.processing}>
                              <span>{FI18n.i18nNext.t('activatetheme_inprocessing')}</span>
                            </div>
                          ) : (
                            <div
                              className={styles.action}
                              // style={{padding: hasActiveBtn ? '0 20px' : undefined}}
                            >
                              <FCoverFooterButtons
                                buttons={[
                                  {
                                    type: hasActiveBtn ? 'active' : '',
                                    async fn() {

                                      if (!i.isAuth) {
                                        // fMessage(F)
                                        fMessage(i.authErrorText, 'error');
                                        return;
                                      }
                                      if (!nodeManagerPage.nodeThemeId) {
                                        dispatch<OnActiveAction>({
                                          type: 'nodeManagerPage/onActive',
                                          payload: {
                                            id: i.id,
                                          },
                                        });
                                        return;
                                      }

                                      const res1: boolean = await fPromiseModalConfirm({
                                        title: '提示',
                                        // icon: <div />,
                                        description: FI18n.i18nNext.t('msg_change_theme_confirm', { ThemeName: i.title }),
                                        okText: FI18n.i18nNext.t('btn_activate_theme'),
                                        cancelText: FI18n.i18nNext.t('keep_current_theme'),
                                      });

                                      if (!res1) {
                                        return;
                                      }

                                      dispatch<OnActiveAction>({
                                        type: 'nodeManagerPage/onActive',
                                        payload: {
                                          id: i.id,
                                        },
                                      });
                                      // fConfirmModal({
                                      //   message: FI18n.i18nNext.t('msg_change_theme_confirm', { ThemeName: i.title }),
                                      //   okText: FI18n.i18nNext.t('btn_activate_theme'),
                                      //   cancelText: FI18n.i18nNext.t('keep_current_theme'),
                                      //   onOk() {
                                      //
                                      //
                                      //   },
                                      // });
                                    },
                                  },
                                  {
                                    type: 'edit',
                                    fn() {
                                      window.open(
                                        FUtil.LinkTo.exhibitManagement({ exhibitID: i.id }),
                                      );
                                    },
                                  },
                                  {
                                    type: 'resourceDetails',
                                    fn() {
                                      window.open(
                                        FUtil.LinkTo.resourceDetails({ resourceID: i.resourceId }),
                                      );
                                    },
                                  },
                                ]}
                              />
                            </div>
                          )}
                        </div>
                        <div style={{ height: 12 }} />
                        <FComponentsLib.FContentText text={i.title} singleRow type='highlight' />
                        <div style={{ height: 6 }} />
                        <FComponentsLib.FContentText type='additional1' text={'展示版本 ' + i.version} />
                        <div style={{ height: 15 }} />
                        <div className={styles.bottom}>
                          <div className={styles.polices}>
                            {i.policies.length > 0 ? (
                              <FComponentsLib.F_Contract_And_Policy_Labels
                                data={i.policies.map((p) => {
                                  return {
                                    text: p,
                                    dot: '',
                                  };
                                })}
                              />
                            ) : (
                              <FComponentsLib.FContentText text={'暂无策略…'} type='additional2' />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
              )}
            </>)
        }
      </FLeftSiderLayout>
    </>
  );
}

export default withRouter(
  connect(({ nodeManagerPage }: ConnectState) => ({
    nodeManagerPage,
  }))(Themes),
);
