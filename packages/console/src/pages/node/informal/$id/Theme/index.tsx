import * as React from 'react';
import styles from './index.less';
import FNoDataTip from '@/components/FNoDataTip';
import { FContentText, FTitleText } from '@/components/FText';
import { Space } from 'antd';
import { FTextBtn } from '@/components/FButton';
import {
  InformalNodeManagerPageModelState,
  OnCancel_AddThemeDrawer_Action,
  OnChangeThemeKeywordsAction,
  OnClick_ActiveThemeBtn_Action,
  OnClickThemesAddBtnAction,
  OnClickThemesReplaceBtnAction,
  OnConfirm_AddThemeDrawer_Action,
  OnMountThemePageAction,
  OnUnmountThemePageAction,
} from '@/models/informalNodeManagerPage';
import FAdd from '@/components/FIcons/FAdd';
import FInput from '@/components/FInput';
import { Dispatch, connect } from 'dva';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import MappingRule from '@/pages/node/informal/$id/Exhibit/MappingRule';
import { ConnectState } from '@/models/connect';
import FLoadingTip from '@/components/FLoadingTip';
import FDivider from '@/components/FDivider';
import { FUtil } from '@freelog/tools-lib';
import FUtil1 from '@/utils';
import * as AHooks from 'ahooks';
import FMappingRuleReplace from '@/components/FIcons/FMappingRuleReplace';
import fConfirmModal from '@/components/fConfirmModal';
import FCoverImage from '@/components/FCoverImage';
import FAddInformExhibitDrawer from '@/pages/node/informal/$id/components/AddInformExhibitDrawer';
import FTooltip from '@/components/FTooltip';
import { FWarning } from '@/components/FIcons';
import { Helmet } from 'react-helmet';

interface ThemeProps {
  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function Theme({ dispatch, informalNodeManagerPage }: ThemeProps) {

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
          tipText={'当前节点没有添加主题展品'}
          btnText={'添加测试主题展品'}
          onClick={() => {
            dispatch<OnClickThemesAddBtnAction>({
              type: 'informalNodeManagerPage/onClickThemesAddBtn',
            });
          }}
        />)
        : (<>
          <div className={styles.header}>
            <FTitleText text={'主题管理'} />
            <Space size={30}>

              <FTextBtn
                type='default'
                onClick={() => {
                  dispatch<OnClickThemesAddBtnAction>({
                    type: 'informalNodeManagerPage/onClickThemesAddBtn',
                  });
                }}>
                <Space size={5}>
                  <FAdd />
                  <span>{FUtil1.I18n.message('btn_add_test_theme')}</span>
                </Space>
              </FTextBtn>

              <FTextBtn
                type='default'
                onClick={() => {
                  dispatch<OnClickThemesReplaceBtnAction>({
                    type: 'informalNodeManagerPage/onClickExhibitsReplaceBtn',
                  });
                }}>
                <Space size={5}>
                  <FMappingRuleReplace />
                  <span>{FUtil1.I18n.message('btn_replace_resource')}</span>
                </Space>
              </FTextBtn>

              <div>
                <FInput
                  theme={'dark'}
                  value={informalNodeManagerPage.theme_FilterKeywords}
                  debounce={300}
                  onDebounceChange={(value) => {
                    dispatch<OnChangeThemeKeywordsAction>({
                      type: 'informalNodeManagerPage/onChangeThemeKeywords',
                      payload: {
                        value: value,
                      },
                    });
                  }}
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
                        key={t.testResourceId}
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
                                      <FWarning />
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
                          {/*{console.log(informalNodeManagerPage.theme_ActivatingThemeName, t.name, '######98988888')}*/}
                          {
                            informalNodeManagerPage.theme_ActivatingThemeName === t.testResourceName
                              ? (<div className={styles.processing}>
                                <span>处理中…</span>
                              </div>)
                              : (<div className={styles.coverFooter}>
                                <div>
                                  <div style={{ width: 1 }} />

                                  {
                                    !isActive && (<>
                                      <a onClick={() => {
                                        fConfirmModal({
                                          message: FUtil1.I18n.message('msg_change_theme_confirm'),
                                          okText: FUtil1.I18n.message('active_new_theme'),
                                          cancelText: FUtil1.I18n.message('keep_current_theme'),
                                          onOk() {
                                            dispatch<OnClick_ActiveThemeBtn_Action>({
                                              type: 'informalNodeManagerPage/onClick_ActiveThemeBtn',
                                              payload: {
                                                testResourceId: t.testResourceId,
                                                testResourceName: t.testResourceName,
                                              },
                                            });
                                          },
                                        });
                                      }}>激活</a>
                                      <FDivider />
                                    </>)
                                  }
                                  <a onClick={() => {
                                    window.open(FUtil.LinkTo.informExhibitManagement({ exhibitID: t.testResourceId }));
                                  }}>编辑</a>

                                  <FDivider />

                                  <a
                                    onClick={() => {
                                      window.open(t.originInfo.type === 'resource'
                                        ? FUtil.LinkTo.resourceDetails({ resourceID: t.originInfo.id })
                                        : FUtil.LinkTo.objectDetails({
                                          bucketName: t.originInfo.name.split('/')[0],
                                          objectID: t.originInfo.id,
                                        }));
                                    }}
                                  >{t.originInfo.type === 'resource' ? '资源详情' : '对象详情'}</a>

                                  <div style={{ width: 1 }} />
                                </div>
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
                          <FContentText
                            type='highlight'
                            text={t.testResourceName}
                            singleRow
                            style={{ maxWidth: 230 }}
                          />
                        </div>
                        <div style={{ height: 6 }} />
                        <div className={styles.itemVersion}>
                          {
                            t.originInfo.type !== 'object' && (<FContentText
                              text={`展示版本 ${t.originInfo.version}`}
                              type='additional1'
                            />)
                          }

                        </div>
                        <div style={{ height: 10 }} />
                        <div className={styles.itemBar}>
                          {/*<MappingRule*/}
                          {/*  {...t.rule}*/}
                          {/*/>*/}
                          <MappingRule
                            add={add || undefined}
                            alter={alter || undefined}
                            active={activate_theme || undefined}
                            version={(t.originInfo.versionRange === '' || t.originInfo.versionRange === 'latest') ? undefined : t.originInfo.versionRange}
                            cover={t.stateInfo.coverInfo.ruleId === 'default' ? undefined : t.stateInfo.coverInfo.coverImages[0]}
                            title={t.stateInfo.titleInfo.ruleId === 'default' ? undefined : t.stateInfo.titleInfo.title}
                            online={t.stateInfo.onlineStatusInfo.ruleId === 'default' ? undefined : t.stateInfo.onlineStatusInfo.onlineStatus === 1}
                            offline={t.stateInfo.onlineStatusInfo.ruleId === 'default' ? undefined : t.stateInfo.onlineStatusInfo.onlineStatus === 0}
                            labels={t.stateInfo.tagInfo.ruleId === 'default' ? undefined : t.stateInfo.tagInfo.tags}
                            replaces={t.stateInfo.replaceInfo.ruleId === 'default' ? undefined : t.stateInfo.replaceInfo.replaceRecords.map((rr) => {
                              return {
                                ...rr,
                                replacer: {
                                  ...rr.replacer,
                                  versionRange: rr.replacer.version,
                                },
                                replaced: {
                                  ...rr.replaced,
                                  versionRange: rr.replaced.version,
                                },
                              };
                            })}
                            attrs={t.stateInfo.propertyInfo.ruleId === 'default'
                              ? undefined
                              : t.stateInfo.propertyInfo.testResourceProperty
                                .filter((trp) => {
                                  return trp.isRuleSet;
                                })
                                .map((trp) => {
                                  return {
                                    type: 'add',
                                    theKey: trp.key,
                                    value: String(trp.value),
                                    description: trp.remark,
                                  };
                                })}
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
