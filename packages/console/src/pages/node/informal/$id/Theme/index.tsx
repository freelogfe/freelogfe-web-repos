import * as React from 'react';
import styles from './index.less';
import FNoDataTip from "@/components/FNoDataTip";
import {FContentText, FTitleText} from "@/components/FText";
import {Space} from "antd";
import {FTextBtn} from "@/components/FButton";
import {
  ChangeAction,
  FetchThemeListAction,
  InformalNodeManagerPageModelState,
  SaveDataRulesAction,
} from "@/models/informalNodeManagerPage";
import FAdd from "@/components/FIcons/FAdd";
import FInput from "@/components/FInput";
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import {Dispatch, connect} from 'dva';
import FIdentityTypeBadge from "@/components/FIdentityTypeBadge";
import MappingRule from "@/pages/node/informal/$id/Exhibit/MappingRule";
import {ConnectState} from "@/models/connect";
import FLoadingTip from "@/components/FLoadingTip";
// import AddInformExhibitDrawer from "@/pages/node/informal/$id/containers/AddInformExhibitDrawer";
import FDivider from "@/components/FDivider";
import FLink from "@/components/FLink";
import {FUtil} from '@freelog/tools-lib';
import FUtil1 from "@/utils";
import * as AHooks from 'ahooks';
import FMappingRuleReplace from "@/components/FIcons/FMappingRuleReplace";

const {compile} = require('@freelog/nmr_translator');

interface ThemeProps {
  dispatch: Dispatch;

  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function Theme({dispatch, informalNodeManagerPage}: ThemeProps) {

  React.useEffect(() => {
    dispatch<FetchThemeListAction>({
      type: 'informalNodeManagerPage/fetchThemeList',
      payload: {
        isRematch: true,
      },
    });
  }, []);

  AHooks.useUnmount(() => {
    onChange({
      // ...themePageInitData,
    });
  });

  if (informalNodeManagerPage.themePageThemesTotal === -1) {
    return (<FLoadingTip height={'calc(100vh - 94px)'}/>);
  }

  function onChange(value: Partial<InformalNodeManagerPageModelState>) {
    dispatch<ChangeAction>({
      type: 'informalNodeManagerPage/change',
      payload: {
        ...value,
      },
    });
  }

  return (<>
    {
      informalNodeManagerPage.themePageThemeList.length === 0 && !informalNodeManagerPage.themePageFilterKeywords
        ? (<FNoDataTip
          height={'calc(100vh - 94px)'}
          tipText={'当前节点没有添加主题展品'}
          btnText={'添加测试主题展品'}
          onClick={() => {
            onChange({
              addExhibitDrawerVisible: true,
            });
          }}
        />)
        : (<>
          <div className={styles.header}>
            <FTitleText text={'主题管理'}/>
            <Space size={30}>
              <Space size={5}>
                <FTextBtn
                  type="default"
                  onClick={() => {
                    onChange({
                      addExhibitDrawerVisible: true,
                    });
                  }}><FAdd/></FTextBtn>
                <FContentText
                  text={FUtil1.I18n.message('btn_add_test_theme')}
                />
              </Space>
              <Space size={5}>
                <FTextBtn
                  type="default"
                  onClick={() => {
                    onChange({replaceModalVisible: true});
                  }}>
                  <FMappingRuleReplace/>
                </FTextBtn>
                <FContentText text={FUtil1.I18n.message('btn_replace_resource')}/>
              </Space>
              <div>
                <FInput
                  theme={'dark'}
                  value={informalNodeManagerPage.themePageFilterKeywords}
                  debounce={300}
                  onDebounceChange={async (value) => {
                    await onChange({
                      themePageFilterKeywords: value
                    });

                    dispatch<FetchThemeListAction>({
                      type: 'informalNodeManagerPage/fetchThemeList',
                      payload: {
                        isRestart: true,
                      },
                    });
                  }}
                />
              </div>
            </Space>
          </div>

          {
            informalNodeManagerPage.themePageThemeList.length === 0
              ? (<FNoDataTip
                height={'calc(100vh - 70px - 24px - 100px - 100px)'}
                tipText={'无搜索结果'}
              />)
              : (<div className={styles.body}>
                <div className={styles.list}>
                  {
                    informalNodeManagerPage.themePageThemeList.map((t, index, arr) => {
                      return (<div
                        key={t.id}
                        className={styles.item}
                      >
                        <div className={styles.cover}>
                          <img src={t.cover || imgSrc} alt=""/>
                          <div className={styles.coverLabel}>
                            {
                              t.isOnline
                                ? (<label className={styles.activated}>已激活</label>)
                                : null
                            }
                            {/*(<>*/}
                            {/*<label className={styles.nonActivated}>未激活</label>*/}
                            {/*<div style={{width: 10}}/>*/}
                            {/*<FWarning/>*/}
                            {/*</>)*/}
                          </div>
                          <div className={styles.coverFooter}>
                            <div>
                              <div style={{width: 1}}/>
                              <FLink to={FUtil.LinkTo.informExhibitManagement({exhibitID: t.id})}>编辑</FLink>
                              <FDivider/>
                              <FLink
                                to={t.originInfo.type === 'resource'
                                  ? FUtil.LinkTo.resourceDetails({resourceID: t.originInfo.id})
                                  : FUtil.LinkTo.objectDetails({
                                    bucketName: t.originInfo.name.split('/')[0],
                                    objectID: t.originInfo.id,
                                  })}
                              >{t.originInfo.type === 'resource' ? '资源详情' : '对象详情'}</FLink>
                              {
                                !t.isOnline && (<>
                                  <FDivider/>
                                  <a onClick={() => {
                                    const {rules}: { rules: any[] } = compile(informalNodeManagerPage.ruleText);
                                    // console.log(rules, 'rules1234234');
                                    const rule = rules.find((r) => r.themeName);

                                    let data;

                                    if (rule) {
                                      data = rules.map((r) => {
                                        if (!r.themeName) {
                                          return r;
                                        }
                                        return {
                                          ...r,
                                          themeName: t.name,
                                        };
                                      });
                                    } else {
                                      data = [
                                        {
                                          operation: 'activate_theme',
                                          themeName: t.name,
                                        },
                                        ...rules,
                                      ];
                                    }
                                    // console.log(rule, 'rule21930usdf');

                                    dispatch<SaveDataRulesAction>({
                                      type: 'informalNodeManagerPage/saveDataRules',
                                      payload: {
                                        type: 'replace',
                                        data: data,
                                      },
                                    });
                                    onChange({
                                      themePageThemeList: arr.map((ttt) => {
                                        if (ttt.id !== t.id) {
                                          return {
                                            ...ttt,
                                            isOnline: false,
                                          };
                                        }
                                        return {
                                          ...ttt,
                                          isOnline: true,
                                        };
                                      }),
                                      // mappingRule
                                    });
                                  }}>激活</a>
                                </>)
                              }

                              <div style={{width: 1}}/>
                            </div>
                          </div>
                        </div>
                        <div style={{height: 12}}/>
                        <div className={styles.itemTitle}>
                          {/*{console.log(t.identity, 'TTTTTTTTTTTTT')}*/}
                          <FIdentityTypeBadge
                            status={t.identity}
                          />
                          <div style={{width: 5}}/>
                          <FContentText
                            type="highlight"
                            text={t.name}
                            singleRow
                          />
                        </div>
                        <div style={{height: 6}}/>
                        <div className={styles.itemVersion}>
                          {
                            t.identity !== 'object' && (<FContentText
                              text={`展示版本 ${t.version}`}
                              type="additional1"
                            />)
                          }

                        </div>
                        <div style={{height: 10}}/>
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

    {/*<AddInformExhibitDrawer*/}
    {/*  visible={informalNodeManagerPage.addThemeDrawerVisible}*/}
    {/*  isTheme={true}*/}
    {/*  onCancel={() => {*/}
    {/*    onChange({*/}
    {/*      addThemeDrawerVisible: false,*/}
    {/*    });*/}
    {/*  }}*/}
    {/*  onConfirm={async (value) => {*/}
    {/*    // console.log(value, 'VVVV234pjl;kdsfl;kdf;lVV');*/}
    {/*    await onChange({*/}
    {/*      addThemeDrawerVisible: false,*/}
    {/*    });*/}
    {/*    await dispatch<SaveDataRulesAction>({*/}
    {/*      type: 'informalNodeManagerPage/saveDataRules',*/}
    {/*      payload: {*/}
    {/*        type: 'append',*/}
    {/*        data: value.names.map((n) => {*/}
    {/*          return {*/}
    {/*            operation: 'add',*/}
    {/*            exhibitName: n.split('/')[1] + `_${FUtil.Tool.generateRandomCode()}`,*/}
    {/*            candidate: {*/}
    {/*              name: n,*/}
    {/*              versionRange: 'latest',*/}
    {/*              type: value.identity,*/}
    {/*            },*/}
    {/*          };*/}
    {/*        }),*/}
    {/*      },*/}
    {/*    });*/}
    {/*    await dispatch<FetchThemeListAction>({*/}
    {/*      type: 'informalNodeManagerPage/fetchThemeList',*/}
    {/*      payload: {*/}
    {/*        isRematch: false,*/}
    {/*      },*/}
    {/*    });*/}
    {/*  }}*/}
    {/*  disabledResourceNames={informalNodeManagerPage.themeList.filter((e) => e.originInfo.type === 'resource').map((e) => e.originInfo.name)}*/}
    {/*  disabledObjectNames={informalNodeManagerPage.themeList.filter((e) => e.originInfo.type === 'object').map((e) => e.originInfo.name)}*/}
    {/*/>*/}
  </>);
}

export default connect(({informalNodeManagerPage}: ConnectState) => ({
  informalNodeManagerPage,
}))(Theme);
