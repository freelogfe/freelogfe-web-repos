import * as React from 'react';
import styles from './index.less';
import FNoDataTip from "@/components/FNoDataTip";
import {FContentText, FTitleText} from "@/components/FText";
import {Space} from "antd";
import {FTextButton} from "@/components/FButton";
import {
  ChangeAction, FetchExhibitListAction,
  FetchThemeListAction,
  InformalNodeManagerPageModelState,
  SaveDataRulesAction
} from "@/models/informalNodeManagerPage";
import FAdd from "@/components/FIcons/FAdd";
import FInput from "@/components/FInput";
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import {FWarning} from '@/components/FIcons';
import {router} from "umi";
import {Dispatch, connect} from 'dva';
import FIdentityTypeBadge from "@/components/FIdentityTypeBadge";
import MappingRule from "@/pages/node/informal/$id/Exhibit/MappingRule";
import {ConnectState} from "@/models/connect";
import FLoadingTip from "@/components/FLoadingTip";
// import FLinkTo from "@/utils/path-assembler";
import AddInformExhibitDrawer from "@/pages/node/informal/$id/containers/AddInformExhibitDrawer";
import {generateRandomCode} from "@/utils/tools";
import FDivider from "@/components/FDivider";
import FLink from "@/components/FLink";
import FUtil from "@/utils";

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

  if (informalNodeManagerPage.themeListIsLoading) {
    return (<FLoadingTip height={'calc(100vh - 94px)'}/>);
  }

  // if (informalNodeManagerPage.themeList.length === 0) {
  //   return ();
  // }

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
      informalNodeManagerPage.themeList.length === 0
        ? (<FNoDataTip
          height={'calc(100vh - 94px)'}
          tipText={'当前节点没有添加主题展品'}
          btnText={'添加测试主题展品'}
          onClick={() => {
            onChange({
              addThemeDrawerVisible: true,
            });
          }}
        />)
        : (<>
          <div className={styles.header}>
            <FTitleText text={'展品管理'}/>
            <Space size={30}>
              <Space size={5}>
                <FTextButton
                  onClick={() => {
                    onChange({
                      addThemeDrawerVisible: true,
                    });
                  }}><FAdd/></FTextButton>
                <FContentText
                  text={'新增测试展品'}
                />
              </Space>
              <div><FInput theme={'dark'}/></div>
            </Space>
          </div>

          <div className={styles.body}>
            <div className={styles.list}>
              {
                informalNodeManagerPage.themeList.map((t, index, arr) => {


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
                            : (<>
                              <label className={styles.nonActivated}>未激活</label>
                              <div style={{width: 10}}/>
                              <FWarning/>
                            </>)
                        }
                      </div>
                      <div className={styles.coverFooter}>
                        <div>
                          <div style={{width: 1}}/>
                          <FLink to={FUtil.LinkTo.informExhibitManagement({exhibitID: t.id})}>编辑</FLink>
                          {
                            t.originInfo.type === 'resource' && (<>
                              <FDivider/>
                              <FLink
                                to={FUtil.LinkTo.resourceDetails({resourceID: t.originInfo.id})}>资源详情</FLink>
                            </>)
                          }
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
                                ...rules,
                                {
                                  operation: 'activate_theme',
                                  themeName: t.name,
                                },
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
                              themeList: arr.map((ttt) => {
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
                            })
                          }}>激活</a>
                          <div style={{width: 1}}/>
                        </div>
                      </div>
                    </div>
                    <div style={{height: 12}}/>
                    <div className={styles.itemTitle}>
                      <FIdentityTypeBadge/>
                      <div style={{width: 5}}/>
                      <FTitleText
                        type="h5"
                        text={t.name}
                        singleRow
                      />
                    </div>
                    <div style={{height: 6}}/>
                    <div className={styles.itemVersion}>
                      <FContentText
                        text={`展示版本 ${t.version}`}
                        type="additional1"
                      />
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
          </div>
        </>)
    }

    <AddInformExhibitDrawer
      visible={informalNodeManagerPage.addThemeDrawerVisible}
      onCancel={() => {
        onChange({
          addThemeDrawerVisible: false,
        });
      }}
      onConfirm={async (value) => {
        // console.log(value, 'VVVV234pjl;kdsfl;kdf;lVV');
        await onChange({
          addThemeDrawerVisible: false,
        });
        await dispatch<SaveDataRulesAction>({
          type: 'informalNodeManagerPage/saveDataRules',
          payload: {
            type: 'append',
            data: value.names.map((n) => {
              return {
                operation: 'add',
                exhibitName: n.split('/')[1] + `_${generateRandomCode()}`,
                candidate: {
                  name: n,
                  versionRange: 'latest',
                  type: value.identity,
                },
              };
            }),
          },
        });
        await dispatch<FetchThemeListAction>({
          type: 'informalNodeManagerPage/fetchThemeList',
          payload: {
            isRematch: false,
          },
        });
      }}
      disabledResourceNames={['Freelog/blog-theme']}
      disabledObjectNames={['234234/th002.jpeg']}
    />
  </>);
}

export default connect(({informalNodeManagerPage}: ConnectState) => ({
  informalNodeManagerPage,
}))(Theme);
