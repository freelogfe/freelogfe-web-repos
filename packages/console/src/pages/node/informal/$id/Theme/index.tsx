import * as React from 'react';
import styles from './index.less';
import FNoDataTip from '@/components/FNoDataTip';
import { FContentText, FTitleText } from '@/components/FText';
import { Space } from 'antd';
import { FTextBtn } from '@/components/FButton';
import {
  // ChangeAction,
  InformalNodeManagerPageModelState,
  OnChangeThemeKeywordsAction, OnClickActiveThemeBtnAction,
  OnClickThemesAddBtnAction,
  OnClickThemesReplaceBtnAction,
  OnMountThemePageAction, OnUnmountThemePageAction,
  // SaveDataRulesAction,
} from '@/models/informalNodeManagerPage';
import FAdd from '@/components/FIcons/FAdd';
import FInput from '@/components/FInput';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import { Dispatch, connect } from 'dva';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import MappingRule from '@/pages/node/informal/$id/Exhibit/MappingRule';
import { ConnectState } from '@/models/connect';
import FLoadingTip from '@/components/FLoadingTip';
import FDivider from '@/components/FDivider';
// import FLink from '@/components/FLink';
import { FUtil } from '@freelog/tools-lib';
import FUtil1 from '@/utils';
import * as AHooks from 'ahooks';
import FMappingRuleReplace from '@/components/FIcons/FMappingRuleReplace';
import fConfirmModal from '@/components/fConfirmModal';
// import { OnActiveAction } from '@/models/nodeManagerPage';

// const { compile } = require('@freelog/nmr_translator');

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

  // function onChange(value: Partial<InformalNodeManagerPageModelState>) {
  //   dispatch<ChangeAction>({
  //     type: 'informalNodeManagerPage/change',
  //     payload: {
  //       ...value,
  //     },
  //   });
  // }


  return (<>
    {
      informalNodeManagerPage.theme_ListState === 'noData'
        ? (<FNoDataTip
          height={'calc(100vh - 94px)'}
          tipText={'当前节点没有添加主题展品'}
          btnText={'添加测试主题展品'}
          onClick={() => {
            dispatch<OnClickThemesAddBtnAction>({
              type: 'informalNodeManagerPage/onClickExhibitsAddBtn',
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
                    type: 'informalNodeManagerPage/onClickExhibitsAddBtn',
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
                    informalNodeManagerPage.theme_List.map((t, index, arr) => {
                      return (<div
                        key={t.id}
                        className={styles.item}
                      >
                        <div className={styles.cover}>
                          <img src={t.cover || imgSrc} alt='' />
                          <div className={styles.coverLabel}>
                            {
                              t.isOnline
                                ? (<label className={styles.activated}>已激活</label>)
                                : null
                            }
                          </div>
                          {/*{console.log(informalNodeManagerPage.theme_ActivatingThemeName, t.name, '######98988888')}*/}
                          {
                            informalNodeManagerPage.theme_ActivatingThemeName === t.name
                              ? (<div className={styles.processing}>
                                <span>处理中…</span>
                              </div>)
                              : (<div className={styles.coverFooter}>
                                <div>
                                  <div style={{ width: 1 }} />

                                  {
                                    !t.isOnline && (<>
                                      <a onClick={() => {
                                        fConfirmModal({
                                          message: FUtil1.I18n.message('msg_change_theme_confirm'),
                                          okText: FUtil1.I18n.message('active_new_theme'),
                                          cancelText: FUtil1.I18n.message('keep_current_theme'),
                                          onOk() {
                                            dispatch<OnClickActiveThemeBtnAction>({
                                              type: 'informalNodeManagerPage/onClickActiveThemeBtn',
                                              payload: {
                                                themeName: t.name,
                                              },
                                            });
                                          },
                                        });
                                      }}>激活</a>
                                      <FDivider />
                                    </>)
                                  }
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
                                  <FDivider />

                                  <a onClick={() => {
                                    window.open(FUtil.LinkTo.informExhibitManagement({ exhibitID: t.id }));
                                  }}>编辑</a>

                                  <div style={{ width: 1 }} />
                                </div>
                              </div>)
                          }

                        </div>
                        <div style={{ height: 12 }} />
                        <div className={styles.itemTitle}>
                          {/*{console.log(t.identity, 'TTTTTTTTTTTTT')}*/}
                          <FIdentityTypeBadge
                            status={t.identity}
                          />
                          <div style={{ width: 5 }} />
                          <FContentText
                            type='highlight'
                            text={t.name}
                            singleRow
                          />
                        </div>
                        <div style={{ height: 6 }} />
                        <div className={styles.itemVersion}>
                          {
                            t.identity !== 'object' && (<FContentText
                              text={`展示版本 ${t.version}`}
                              type='additional1'
                            />)
                          }

                        </div>
                        <div style={{ height: 10 }} />
                        <div className={styles.itemBar}>
                          <MappingRule
                            {...t.rule}
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

  </>);
}

export default connect(({ informalNodeManagerPage }: ConnectState) => ({
  informalNodeManagerPage,
}))(Theme);
