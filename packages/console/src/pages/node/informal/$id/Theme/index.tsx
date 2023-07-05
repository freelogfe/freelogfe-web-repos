import * as React from 'react';
import styles from './index.less';
import FNoDataTip from '@/components/FNoDataTip';
import { Space } from 'antd';
import {
  InformalNodeManagerPageModelState,
  OnCancel_AddThemeDrawer_Action,
  OnChangeThemeKeywordsAction,
  OnClick_ActiveThemeBtn_Action,
  OnClick_Themes_DeleteBtn_Action,
  OnClickThemesAddBtnAction,
  OnClickThemesReplaceBtnAction,
  OnConfirm_AddThemeDrawer_Action,
  OnMountThemePageAction,
  OnUnmountThemePageAction,
} from '@/models/informalNodeManagerPage';
import FInput from '@/components/FInput';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import MappingRule from '@/pages/node/informal/$id/Exhibit/MappingRule';
import { ConnectState } from '@/models/connect';
import FLoadingTip from '@/components/FLoadingTip';
import { FUtil, FI18n } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FCoverImage from '@/components/FCoverImage';
import FAddInformExhibitDrawer from '@/pages/node/informal/$id/components/AddInformExhibitDrawer';
import FTooltip from '@/components/FTooltip';
import { Helmet } from 'react-helmet';
import FCoverFooterButtons from '@/components/FCoverFooterButtons';
import FComponentsLib from '@freelog/components-lib';

interface ThemeProps {
  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function Theme({ dispatch, informalNodeManagerPage }: ThemeProps) {

  const [filterKeywords, setFilterKeywords] = React.useState<string>('');

  AHooks.useMount(() => {
    dispatch<OnMountThemePageAction>({
      type: 'informalNodeManagerPage/onMountThemePage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountThemePageAction>({
      type: 'informalNodeManagerPage/onUnmountThemePage',
    });
  });

  AHooks.useDebounceEffect(() => {
    dispatch<OnChangeThemeKeywordsAction>({
      type: 'informalNodeManagerPage/onChangeThemeKeywords',
      payload: {
        value: filterKeywords,
      },
    });
  }, [filterKeywords], {
    wait: 300,
  });

  if (informalNodeManagerPage.theme_PageError) {
    return (<FNoDataTip height={'calc(100vh - 194px)'} tipText={informalNodeManagerPage.theme_PageError} />);
  }

  if (informalNodeManagerPage.theme_ListState === 'loading') {
    return (<FLoadingTip height={'calc(100vh - 194px)'} />);
  }

  return (<>
    <Helmet>
      <title>{`测试主题管理 · ${informalNodeManagerPage.node_Name} - Freelog`}</title>
    </Helmet>

    {
      informalNodeManagerPage.theme_ListState === 'noData'
        ? (<FNoDataTip
          height={'calc(100vh - 94px)'}
          // tipText={'当前节点没有添加主题展品'}
          tipText={FI18n.i18nNext.t('testnode_themes_msg_empty')}
          btnText={FI18n.i18nNext.t('testnode_themes_btn_add_theme')}
          onClick={() => {
            dispatch<OnClickThemesAddBtnAction>({
              type: 'informalNodeManagerPage/onClickThemesAddBtn',
            });
          }}
        />)
        : (<>
          <div className={styles.header}>
            <FComponentsLib.FTitleText text={'主题管理'} />
            <Space size={30}>

              <FComponentsLib.FTextBtn
                type='default'
                onClick={() => {
                  dispatch<OnClickThemesAddBtnAction>({
                    type: 'informalNodeManagerPage/onClickThemesAddBtn',
                  });
                }}>
                <Space size={5}>
                  <FComponentsLib.FIcons.FAdd />
                  <span>{FI18n.i18nNext.t('btn_add_test_theme')}</span>
                </Space>
              </FComponentsLib.FTextBtn>

              <FComponentsLib.FTextBtn
                type='default'
                onClick={() => {
                  dispatch<OnClickThemesReplaceBtnAction>({
                    type: 'informalNodeManagerPage/onClickExhibitsReplaceBtn',
                  });
                }}>
                <Space size={5}>
                  <FComponentsLib.FIcons.FMappingRuleReplace />
                  <span>{FI18n.i18nNext.t('btn_replace_resource')}</span>
                </Space>
              </FComponentsLib.FTextBtn>

              <div>
                {/*<FInput*/}
                {/*  theme={'dark'}*/}
                {/*  value={informalNodeManagerPage.theme_FilterKeywords}*/}
                {/*  debounce={300}*/}
                {/*  onDebounceChange={(value) => {*/}
                {/*    dispatch<OnChangeThemeKeywordsAction>({*/}
                {/*      type: 'informalNodeManagerPage/onChangeThemeKeywords',*/}
                {/*      payload: {*/}
                {/*        value: value,*/}
                {/*      },*/}
                {/*    });*/}
                {/*  }}*/}
                {/*  placeholder={FI18n.i18nNext.t('nodemgmt_search_themes_hint')}*/}
                {/*/>*/}
                <FComponentsLib.FInput.FSearch
                  // theme={'dark'}
                  value={filterKeywords}
                  // debounce={300}
                  style={{width: 300}}
                  onChange={(e) => {
                    setFilterKeywords(e.target.value);

                  }}
                  placeholder={FI18n.i18nNext.t('nodemgmt_search_themes_hint')}
                />
              </div>
            </Space>
          </div>

          {
            informalNodeManagerPage.theme_ListState === 'noSearchResult'
              ? (<FNoDataTip
                height={'calc(100vh - 70px - 24px - 100px - 100px)'}
                tipText={'无搜索结果'}
              />)
              : (<div className={styles.body}>
                <div className={styles.list}>
                  {
                    informalNodeManagerPage.theme_List.map((t, index, theme_List) => {

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

                      const isActive: boolean = t.stateInfo.themeInfo.isActivatedTheme === 1;

                      return (<div
                        // key={t.testResourceId}
                        key={index}
                        className={styles.item}
                      >
                        <div className={styles.cover}>
                          {/*<img src={t.cover || imgSrc} alt='' />*/}
                          <FCoverImage
                            src={t.stateInfo.coverInfo.coverImages[0] || ''}
                            width={280}
                            style={{ borderRadius: 4, display: 'block' }}
                          />

                          <div className={styles.coverLabel}>
                            {
                              !t.isAuth && (<>
                                <div>
                                  {
                                    <FTooltip
                                      // title={!record.isAuth ? record.authErrorText : '暂无上线策略'}
                                      title={'存在授权问题'}
                                    >
                                      <FComponentsLib.FIcons.FWarning />
                                    </FTooltip>
                                  }
                                </div>

                                <div style={{ width: 10 }} />
                              </>)
                            }
                            {
                              isActive
                                ? (<label className={styles.activated}>已激活</label>)
                                : null
                            }
                          </div>
                          {
                            informalNodeManagerPage.theme_ActivatingThemeName === t.testResourceName
                              ? (<div className={styles.processing}>
                                <span>处理中…</span>
                              </div>)
                              : (<div className={styles.coverFooter}>
                                <FCoverFooterButtons
                                  buttons={[
                                    {
                                      type: !isActive ? 'active' : '',
                                      fn() {
                                        dispatch<OnClick_ActiveThemeBtn_Action>({
                                          type: 'informalNodeManagerPage/onClick_ActiveThemeBtn',
                                          payload: {
                                            testResourceId: t.testResourceId,
                                            testResourceName: t.testResourceName,
                                          },
                                        });
                                      },
                                    },
                                    {
                                      type: 'edit',
                                      fn() {
                                        window.open(FUtil.LinkTo.informExhibitManagement({ exhibitID: t.testResourceId }));
                                      },
                                    },
                                    {
                                      type: t.originInfo.type === 'resource' ? 'resourceDetails' : '',
                                      fn() {
                                        window.open(FUtil.LinkTo.resourceDetails({ resourceID: t.originInfo.id }));
                                      },
                                    },
                                    {
                                      type: t.originInfo.type === 'object' ? 'objectDetails' : '',
                                      fn() {
                                        window.open(
                                          FUtil.LinkTo.objectDetails({
                                            bucketName: t.originInfo.name.split('/')[0],
                                            objectID: t.originInfo.id,
                                          }));
                                      },
                                    },
                                    {
                                      type: t.associatedPresentableId === '' ? 'delete' : '',
                                      fn() {
                                        dispatch<OnClick_Themes_DeleteBtn_Action>({
                                          type: 'informalNodeManagerPage/onClick_Themes_DeleteBtn',
                                          payload: {
                                            testResourceId: t.testResourceId,
                                            testResourceName: t.testResourceName,
                                          },
                                        });
                                      },
                                    },
                                  ]}
                                />
                              </div>)
                          }

                        </div>
                        <div style={{ height: 12 }} />
                        <div className={styles.itemTitle}>
                          {/*{console.log(t.identity, 'TTTTTTTTTTTTT')}*/}
                          <FIdentityTypeBadge
                            status={t.associatedPresentableId === '' ? t.originInfo.type : 'exhibit'}
                          />
                          <div style={{ width: 5 }} />
                          <FComponentsLib.FContentText
                            type='highlight'
                            text={t.testResourceName}
                            singleRow
                            style={{ maxWidth: 230 }}
                          />
                        </div>
                        <div style={{ height: 6 }} />
                        <div className={styles.itemVersion}>
                          {
                            t.originInfo.type !== 'object' && (<FComponentsLib.FContentText
                              text={`展示版本 ${t.originInfo.version}`}
                              type='additional1'
                            />)
                          }

                        </div>
                        <div style={{ height: 10 }} />
                        <div style={{ maxWidth: 280, overflow: 'hidden' }}>
                          <MappingRule
                            operationAndActionRecords={t.operationAndActionRecords}
                          />
                        </div>
                      </div>);
                    })
                  }
                </div>
              </div>)
          }

        </>)
    }

    <FAddInformExhibitDrawer
      nodeID={informalNodeManagerPage.node_ID}
      visible={informalNodeManagerPage.addThemeDrawer_Visible}
      isTheme={true}
      onCancel={() => {
        dispatch<OnCancel_AddThemeDrawer_Action>({
          type: 'informalNodeManagerPage/onCancel_AddThemeDrawer',
        });
      }}
      onConfirmObjects={(values) => {
        // console.log(values, 'onConfirmObjects@#@#$@#$@#$@@@@@@@@@@@@');
        dispatch<OnConfirm_AddThemeDrawer_Action>({
          type: 'informalNodeManagerPage/onConfirm_AddThemeDrawer',
          payload: {
            identity: 'object',
            names: values,
          },
        });
      }}
      onConfirmResources={(values) => {
        // console.log(values, 'onConfirmResources@#@#$@#$@#$@@@@@@@@@@@@');
        dispatch<OnConfirm_AddThemeDrawer_Action>({
          type: 'informalNodeManagerPage/onConfirm_AddThemeDrawer',
          payload: {
            identity: 'resource',
            names: values,
          },
        });
      }}
    />
  </>);
}

export default connect(({ informalNodeManagerPage }: ConnectState) => ({
  informalNodeManagerPage,
}))(Theme);


