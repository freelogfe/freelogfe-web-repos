import * as React from 'react';
import styles from './index.less';
import {FTitleText} from "@/components/FText";
import {Space, Upload} from "antd";
import {FImport, FExport, FDelete, FCode, FWarning, FExit} from "@/components/FIcons";
import TypesCaption from "../components/TypesCaption";
import {
  AttrRule,
  VersionRule,
  TitleRule,
  ReplaceRule,
  OnlineRule,
  OfflineRule,
  LabelRule,
  CoverRule,
  AlterRule,
  AddRule, ActiveRule
} from "../components/MappingRules";
import FCodemirror from "@/components/FCodemirror";
import {FNormalButton} from "@/components/FButton";
import {RouteComponentProps} from "react-router";
import {connect, Dispatch} from 'dva';
import {ConnectState, InformalNodeManagerPageModelState} from "@/models/connect";
import {ChangeAction, FetchRulesAction, SaveRulesAction} from "@/models/informalNodeManagerPage";
import FileSaver from 'file-saver';
import FUpload from "@/components/FUpload";
import FCheckbox from "@/components/FCheckbox";

const {compile} = require('@freelog/nmr_translator');

interface MappingRuleProps {
  dispatch: Dispatch;

  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function MappingRule({dispatch, informalNodeManagerPage}: MappingRuleProps) {

  React.useEffect(() => {
    dispatch<FetchRulesAction>({
      type: 'informalNodeManagerPage/fetchRules'
    });
  }, []);

  const {rules} = compile(informalNodeManagerPage.ruleText);
  // console.log(rules, '@#$RASDF)(JULK');
  const rulesObj = rules.map((r: any) => {
    if (r.operation === 'activate_theme') {
      return {
        active: r.themeName,
      };
    }
    return {
      add: r.operation === 'add' ? {
        exhibit: r.exhibitName,
        source: {
          type: r.candidate.type,
          name: r.candidate.name,
        },
      } : undefined,
      alter: r.operation === 'alter' ? r.exhibitName : undefined,
      cover: r.cover,
      title: r.title,
      online: r.online === true,
      offline: r.online === false,
      labels: r.labels,
      replaces: r.replaces,
      // attrs: r.attrs?.map((a: any) => {
      //   return {
      //     type: a.operation,
      //     theKey: a.key,
      //     value: a.value,
      //     description: a.description,
      //   };
      // }) || undefined,
    };
  });

  // console.log(rulesObj, 'rulesObjQ#@FDSZfj()Uew');

  async function onChange(payload: Partial<InformalNodeManagerPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'informalNodeManagerPage/change',
      payload,
    });
  }

  return (<>
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <FTitleText text={'展品管理'}/>
        <div style={{width: 10}}/>
        <TypesCaption/>
        <div style={{width: 50}}/>
        <Space size={30}>
          <FUpload
            accept={'text/plain'}
            beforeUpload={(file) => {
              // console.log(file, 'file@Q#asdf-juLK(*)YHOjkf');
              const reader = new FileReader();
              reader.readAsText(file);
              reader.onload = function (evt: any) {
                // console.log(evt, 'evt@#RFDSf0(UJo90jsdal;f');
                const exportText = evt.target.result;
                // console.log(exportText, 'exportText@#$AFSD;f-[k;lzzfsasdf');
                onChange({
                  codeInput: exportText,
                  isCodeEditing: true,
                  codeIsDirty: true,
                });
              };
              return false;
            }}
            showUploadList={false}
          >
            <a><FImport/> <span>导入</span></a>
          </FUpload>
          <a onClick={() => {
            const fileName = `测试节点.映射规则.${informalNodeManagerPage.nodeID}.txt`;
            const blob = new Blob([informalNodeManagerPage.codeInput], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, fileName);
          }}><FExport/> <span>导出</span></a>
          {/*<a style={{}}><FDelete/> <span>删除</span></a>*/}
        </Space>
      </div>

      {
        informalNodeManagerPage.isCodeEditing
          ? (<a onClick={() => {
            onChange({
              isCodeEditing: false,
            });
          }}><FExit/> 退出代码模式</a>)
          : (<a onClick={() => {
            onChange({
              isCodeEditing: true,
            });
          }}><FCode/> 进入代码模式</a>)
      }

    </div>

    {
      informalNodeManagerPage.isCodeEditing
        ? (<div className={styles.codeMirrorBody}>
          <div>
            <FCodemirror
              value={informalNodeManagerPage.codeInput}
              onChange={(value) => {
                onChange({
                  codeInput: value,
                  codeIsDirty: true,
                });
              }}

            />
            <div style={{height: 15}}/>
            <FNormalButton
              loading={informalNodeManagerPage.codeIsChecking}
              disabled={!informalNodeManagerPage.codeIsDirty && !informalNodeManagerPage.codeIsChecking}
              onClick={() => {
                onChange({
                  codeIsDirty: false,
                });
                const {errors, rules, errorObjects} = compile(informalNodeManagerPage.codeInput);
                if (errorObjects.length > 0) {
                  // return dispatch<ChangeAction>({
                  //   type: 'informalNodeManagerPage/change',
                  //   payload: {
                  //     codeCompileErrors: errorObjects,
                  //   },
                  // });
                  return onChange({
                    codeCompileErrors: errorObjects,
                  });
                }
                dispatch<SaveRulesAction>({
                  type: 'informalNodeManagerPage/saveRules',
                });
              }}
            >{informalNodeManagerPage.codeIsChecking ? '校验中' : '校验并保存'}</FNormalButton>
            {
              informalNodeManagerPage.codeCompileErrors && (<div className={styles.codeCompileErrors}>
                <div style={{height: 20}}/>
                <div className={styles.errorTitle}>编译错误，请检查更正后提交。</div>
                <div style={{height: 20}}/>
                <Space className={styles.errorList} size={5} direction="vertical">
                  {
                    informalNodeManagerPage.codeCompileErrors.map((cme, index) => {
                      return (<div key={index} className={styles.errorListItem}>
                        <div>•</div>
                        <div style={{width: 5}}/>
                        <div>
                          {
                            !!cme.offendingSymbol && (<div>
                              <div>规则语句：</div>
                              <div>{`${cme.line}:${cme.charPositionInLine} ${cme.offendingSymbol}`}</div>
                            </div>)
                          }

                          <div>
                            <div>错误提示：</div>
                            <div>{cme.msg}</div>
                          </div>
                        </div>
                      </div>);
                    })
                  }
                </Space>
              </div>)
            }

            {
              informalNodeManagerPage.codeExecutionError && (<div className={styles.codeExecutionError}>
                <div style={{height: 20}}/>
                <div className={styles.errorTitle}>校验并保存成功，但存在预执行错误。</div>
                <div style={{height: 20}}/>
                <Space className={styles.errorList} size={5} direction="vertical">
                  {
                    informalNodeManagerPage.codeExecutionError.map((cme, index) => {
                      return (<div key={index} className={styles.errorListItem}>
                        <div>•</div>
                        <div style={{width: 5}}/>
                        <div>
                          <div>
                            <div>错误提示：</div>
                            <div>{cme.msg}</div>
                          </div>
                        </div>
                      </div>);
                    })
                  }
                </Space>
              </div>)
            }

            {
              informalNodeManagerPage.codeSaveSuccess && (<>
                <div style={{height: 20}}/>
                <div className={styles.codeSaveSuccess}>
                  校验并保存成功。
                </div>
              </>)
            }

          </div>
        </div>)
        : (<div className={styles.ruleListBody}>
          <Space
            className={styles.ruleList}
            direction="vertical"
          >
            {
              rulesObj.map((obj: any, index: number) => {
                return (<div
                  key={index}
                  className={styles.ruleCard}
                >
                  <div className={styles.ruleCardHeader}>
                    {/*<FCheckbox*/}
                    {/*  checked={*/}
                    {/*    informalNodeManagerPage.checkedExhibitName.includes(obj.alter)*/}
                    {/*    || informalNodeManagerPage.checkedExhibitName.includes(obj.add?.exhibit || '')*/}
                    {/*    || informalNodeManagerPage.checkedThemeName === obj.active*/}
                    {/*  }*/}
                    {/*  onChange={(e) => {*/}
                    {/*    const exhibitName: string = obj.alter || obj.add?.exhibit || '';*/}
                    {/*    const themeName: string = obj.active || '';*/}
                    {/*    if (e.target.checked) {*/}
                    {/*      if (exhibitName) {*/}
                    {/*        onChange({*/}
                    {/*          checkedExhibitName: [*/}
                    {/*            ...informalNodeManagerPage.checkedExhibitName,*/}
                    {/*            exhibitName,*/}
                    {/*          ],*/}
                    {/*        });*/}
                    {/*      } else {*/}
                    {/*        onChange({*/}
                    {/*          checkedThemeName: themeName,*/}
                    {/*        });*/}
                    {/*      }*/}
                    {/*    } else {*/}
                    {/*      if (exhibitName) {*/}
                    {/*        onChange({*/}
                    {/*          checkedExhibitName: informalNodeManagerPage.checkedExhibitName.filter((ce) => {*/}
                    {/*            return ce !== exhibitName;*/}
                    {/*          }),*/}
                    {/*        });*/}
                    {/*      } else {*/}
                    {/*        onChange({*/}
                    {/*          checkedThemeName: '',*/}
                    {/*        });*/}
                    {/*      }*/}
                    {/*    }*/}
                    {/*  }}*/}
                    {/*/>*/}
                    {/*<div style={{width: 20}}/>*/}
                    {obj.add && <AddRule {...obj.add}/>}
                    {obj.alter && <AlterRule alter={obj.alter}/>}
                    {obj.active && <ActiveRule active={obj.active}/>}
                  </div>
                  {
                    !(!obj.cover && !obj.title && !obj.labels && !obj.online && !obj.offline && !obj.replaces && !obj.attrs)
                    && (<div className={styles.ruleCardBody}>
                      <Space
                        className={styles.ruleCardBodyList}
                        size={15}
                        direction="vertical"
                      >
                        {/*{version && <VersionRule version={version}/>}*/}
                        {obj.cover && <div className={styles.ruleCardBodyListItem}><CoverRule cover={obj.cover}/></div>}
                        {obj.title && <div className={styles.ruleCardBodyListItem}><TitleRule title={obj.title}/></div>}
                        {obj.labels &&
                        <div className={styles.ruleCardBodyListItem}><LabelRule labels={obj.labels}/></div>}
                        {obj.online &&
                        <div className={styles.ruleCardBodyListItem}><OnlineRule online={obj.online}/></div>}
                        {obj.offline &&
                        <div className={styles.ruleCardBodyListItem}><OfflineRule offline={obj.offline}/></div>}
                        {obj.replaces && obj.replaces.map((replace: any, replaceIndex: any) => {
                          return (<div key={replaceIndex} className={styles.ruleCardBodyListItem}><ReplaceRule
                            {...replace}
                          /></div>);
                        })}
                        {obj.attrs && obj.attrs.map((attr: any, attrIndex: any) => {
                          return (
                            <div key={attrIndex} className={styles.ruleCardBodyListItem}><AttrRule  {...attr}/></div>);
                        })}

                      </Space>
                    </div>)
                  }
                </div>);
              })
            }
          </Space>
        </div>)
    }

  </>);
}

export default connect(({informalNodeManagerPage}: ConnectState) => ({
  informalNodeManagerPage,
}))(MappingRule);
