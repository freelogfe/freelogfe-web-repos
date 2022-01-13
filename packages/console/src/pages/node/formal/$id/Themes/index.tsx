import * as React from 'react';
import styles from './index.less';
import { FTitleText, FContentText } from '@/components/FText';
import FInput from '@/components/FInput';
// import * as imgSrc from '@/assets/default-resource-cover.jpg';
import { Space } from 'antd';
import { FWarning } from '@/components/FIcons';
import { connect, Dispatch } from 'dva';
import { ConnectState, NodeManagerModelState } from '@/models/connect';
import {
  OnActiveAction,
  OnChangeThemeAction,
  OnMount_ThemePage_Action,
  OnUnmount_ThemePage_Action,
} from '@/models/nodeManagerPage';
import { router } from 'umi';
import FNoDataTip from '@/components/FNoDataTip';
import { ChangeAction as MarketChangeAction } from '@/models/marketPage';
import FLoadingTip from '@/components/FLoadingTip';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Sider from '@/pages/node/formal/$id/Sider';
import FTooltip from '@/components/FTooltip';
// import FLink from '@/components/FLink';
import fConfirmModal from '@/components/fConfirmModal';
import FDivider from '@/components/FDivider';
import FUtil1 from '@/utils';
import { FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FCoverImage from '@/components/FCoverImage';
// import informExhibitInfoPage from '@/models/informExhibitInfoPage';
// import exhibitInfoPage from '@/models/exhibitInfoPage';

interface ThemesProps {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

function Themes({ dispatch, nodeManagerPage }: ThemesProps) {

  AHooks.useMount(() => {
    dispatch<OnMount_ThemePage_Action>({
      type: 'nodeManagerPage/onMount_ThemePage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmount_ThemePage_Action>({
      type: 'nodeManagerPage/onUnmount_ThemePage',
    });
  });

  // if (nodeManagerPage.theme_ListState === 'loading') {
  //   return (<FLoadingTip height={'calc(100vh - 70px)'} />);
  // }

  return (<FLeftSiderLayout
    // header={''}
    sider={<Sider />}
    type='empty'
  >
    {
      nodeManagerPage.theme_ListState === 'noData'
        ? (<FNoDataTip
          height={'calc(100vh - 70px)'}
          tipText={FUtil1.I18n.message('manage_themes_empty')}
          btnText={FUtil1.I18n.message('btn_add_theme')}
          onClick={() => {
            dispatch<MarketChangeAction>({
              type: 'marketPage/change',
              payload: {
                resourceType: 'theme',
              },
            });
            router.push(FUtil.LinkTo.market());
          }}
        />)
        : (<>
          <div className={styles.header}>
            <FTitleText type='h1' text={'主题管理'} />
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
            />
          </div>
          {
            nodeManagerPage.theme_ListState === 'loading' && (<FLoadingTip height={'calc(100vh - 270px)'} />)
          }
          {
            nodeManagerPage.theme_ListState === 'noSearchResult'
            && (<FNoDataTip
              height={'calc(100vh - 270px)'}
              tipText={'无搜索结果'}
            />)
          }
          {
            nodeManagerPage.theme_ListState === 'loaded' && (<div className={styles.body}>
              {
                nodeManagerPage.theme_List.map((i) => {
                  const hasActiveBtn: boolean = !i.isOnline && i.isAuth && i.policies.length > 0;
                  return (<div
                    className={styles.theme}
                    key={i.id}
                  >
                    <div className={styles.cover}>
                      <Space size={10}>
                        {
                          i.isOnline && (<label className={styles.label}>{FUtil1.I18n.message('state_active')}</label>)
                        }

                        {!i.isAuth || i.policies.length === 0 ? <FTooltip title={!i.isAuth ? i.authErrorText : '暂无上线策略'}>
                          <FWarning />
                        </FTooltip> : ''}
                      </Space>

                      {/*<img*/}
                      {/*  alt=''*/}
                      {/*  src={i.cover || imgSrc}*/}
                      {/*/>*/}
                      <FCoverImage src={i.cover || ''} width={280} style={{ borderRadius: 4 }} />

                      {
                        nodeManagerPage.theme_ActivatingThemeID === i.id
                          ? (<div className={styles.processing}>
                            <span>处理中…</span>
                          </div>)
                          : (<div
                            className={styles.action}
                            // style={{padding: hasActiveBtn ? '0 20px' : undefined}}
                          >
                            <div style={{ width: 1 }} />
                            {
                              hasActiveBtn && (<>
                                <a
                                  onClick={() => {
                                    if (!nodeManagerPage.nodeThemeId) {
                                      dispatch<OnActiveAction>({
                                        type: 'nodeManagerPage/onActive',
                                        payload: {
                                          id: i.id,
                                        },
                                      });
                                      return;
                                    }

                                    fConfirmModal({
                                      message: FUtil1.I18n.message('msg_change_theme_confirm'),
                                      // message: '激活该主题，将下线其它主题',
                                      okText: FUtil1.I18n.message('active_new_theme'),
                                      // okText: '激活',
                                      cancelText: FUtil1.I18n.message('keep_current_theme'),
                                      // cancelText: '保持当前主题',
                                      onOk() {
                                        dispatch<OnActiveAction>({
                                          type: 'nodeManagerPage/onActive',
                                          payload: {
                                            id: i.id,
                                          },
                                        });
                                      },
                                    });
                                  }}>{FUtil1.I18n.message('btn_activate_theme')}</a>

                                <FDivider />
                              </>)
                            }
                            <a
                              onClick={() => {
                                window.open(FUtil.LinkTo.exhibitManagement({ exhibitID: i.id }));
                              }}
                            >{FUtil1.I18n.message('btn_edit_exhibit')}</a>
                            <FDivider />
                            <a
                              onClick={() => {
                                window.open(FUtil.LinkTo.resourceDetails({ resourceID: i.resourceId }));
                              }}>{FUtil1.I18n.message('btn_check_resource_details')}</a>
                            <div style={{ width: 1 }} />
                          </div>)
                      }
                    </div>
                    <div style={{ height: 12 }} />
                    <FContentText
                      text={i.title}
                      singleRow
                      type='highlight'
                    />
                    <div style={{ height: 6 }} />
                    <FContentText
                      type='additional1'
                      text={'展示版本 ' + i.version}
                    />
                    <div style={{ height: 15 }} />
                    <div className={styles.bottom}>
                      <div className={styles.polices}>
                        {
                          i.policies.length > 0
                            ? i.policies.map((p) => (<label key={p}>{p}</label>))
                            : (<FContentText text={'暂无策略…'} type='additional2' />)
                        }
                      </div>
                    </div>
                  </div>);
                })
              }
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>)
          }
        </>)
    }

  </FLeftSiderLayout>);
}

export default connect(({ nodeManagerPage }: ConnectState) => ({
  nodeManagerPage,
}))(Themes);
