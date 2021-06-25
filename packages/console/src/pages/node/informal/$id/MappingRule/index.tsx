import * as React from 'react';
import styles from './index.less';
import {FTitleText} from "@/components/FText";
import {Space} from "antd";
import {FImport, FExport, FCode, FExit, FInfo, FWarning} from "@/components/FIcons";
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
import {FRectBtn, FTextBtn} from "@/components/FButton";
import {connect, Dispatch} from 'dva';
import {ConnectState, InformalNodeManagerPageModelState} from "@/models/connect";
import {ChangeAction, FetchRulesAction, SaveRulesAction} from "@/models/informalNodeManagerPage";
import FileSaver from 'file-saver';
import FUpload from "@/components/FUpload";
import FUtil1 from "@/utils";
import Prompt from "umi/prompt";
import * as H from "history";
import * as AHooks from 'ahooks';
import fConfirmModal from "@/components/fConfirmModal";
import {router} from "umi";
import {FUtil} from '@freelog/tools-lib';
import FTooltip from "@/components/FTooltip";

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

  React.useEffect(() => {
    if (informalNodeManagerPage.codeIsDirty) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }

  }, [informalNodeManagerPage.codeIsDirty]);

  AHooks.useUnmount(() => {
    window.onbeforeunload = null;
    onChange({
      promptLeavePath: '',
      // codeIsDirty: false,
    });
  });

  // const {rules} = compile(informalNodeManagerPage.ruleText);
  // console.log(rules, '@#$RASDF)(JULK');
  const ruleObjList = informalNodeManagerPage.ruleList.map((rule) => {
    const {ruleInfo} = rule;

    let theRule: any = {};
    if (ruleInfo.operation === 'activate_theme') {
      theRule = {
        active: ruleInfo.themeName,
      };
    } else {
      theRule = {
        add: ruleInfo.operation === 'add' ? {
          exhibit: ruleInfo.exhibitName,
          source: {
            type: ruleInfo.candidate.type,
            name: ruleInfo.candidate.name,
            versionRange: ruleInfo.candidate.versionRange && ruleInfo.candidate.versionRange !== 'latest' ? ruleInfo.candidate.versionRange : undefined,
          },
        } : undefined,
        alter: ruleInfo.operation === 'alter' ? ruleInfo.exhibitName : undefined,
        // $version: r.candidate.versionRange,
        cover: ruleInfo.cover,
        title: ruleInfo.title,
        online: ruleInfo.online === true,
        offline: ruleInfo.online === false,
        labels: ruleInfo.labels,
        // replaces: r.replaces,
        replaces: ruleInfo.replaces && (ruleInfo.replaces as any[]).map((rr: any) => {
          // console.log(rr, 'rr!!@#$#$@#$@#$444444');
          return {
            replaced: {
              ...rr.replaced,
              versionRange: (rr.replaced.versionRange && rr.replaced.versionRange !== '*') ? rr.replaced.versionRange : undefined,
            },
            replacer: {
              ...rr.replacer,
              versionRange: (rr.replacer.versionRange && rr.replacer.versionRange !== 'latest') ? rr.replacer.versionRange : undefined,
            },
            scopes: rr.scopes && (rr.scopes as any[])
              .map((ss: any) => {
                // console.log(ss, 'ss!!!!@@@@##');
                return ss.map((sss: any) => {
                  return {
                    ...sss,
                    versionRange: (sss.versionRange && sss.versionRange !== 'latest') ? sss.versionRange : undefined,
                  };
                });
              }),
          };
        }),
        attrs: ruleInfo.attrs?.map((a: any) => {
          return {
            type: a.operation,
            theKey: a.key,
            value: a.value,
            description: a.description,
          };
        }),
      };
    }
    return {
      ...rule,
      theRule,
    };
  });

  async function onChange(payload: Partial<InformalNodeManagerPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'informalNodeManagerPage/change',
      payload,
    });
  }

  return (<>
    <Prompt
      when={informalNodeManagerPage.codeIsDirty && informalNodeManagerPage.promptLeavePath === ''}
      message={(location: H.Location) => {
        const locationHref: string = location.pathname + location.search;
        if (locationHref === FUtil.LinkTo.informNodeManagement({
          nodeID: informalNodeManagerPage.nodeID,
          showPage: 'mappingRule'
        })) {
          return true;
        }
        onChange({promptLeavePath: locationHref});
        fConfirmModal({
          message: '编辑后的映射规则尚未保存，现在离开会导致信息丢失',
          onOk() {
            router.push(locationHref);
          },
          onCancel() {
            onChange({promptLeavePath: ''});
          },
        });
        // console.log(location, 'location1234234124324##########');
        return false;
      }}
    />
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <FTitleText text={'映射规则管理'}/>
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
                  codeInput: exportText + '\n' + informalNodeManagerPage.codeInput,
                  isCodeEditing: true,
                  codeIsDirty: true,
                  codeCompileErrors: null,
                  codeExecutionError: null,
                  codeSaveSuccess: false,
                });
              };
              return false;
            }}
            showUploadList={false}
          >
            <FTextBtn type="primary"><FImport/> <span>导入</span></FTextBtn>
          </FUpload>
          <FTextBtn
            type="primary"
            onClick={() => {
              const fileName = `测试节点.映射规则.${informalNodeManagerPage.nodeID}.txt`;
              const blob = new Blob([informalNodeManagerPage.codeInput], {type: "text/plain;charset=utf-8"});
              FileSaver.saveAs(blob, fileName);
            }}
          ><FExport/> <span>导出</span></FTextBtn>
          {/*<a style={{}}><FDelete/> <span>删除</span></a>*/}
        </Space>
      </div>

      {
        informalNodeManagerPage.isCodeEditing
          ? (<FTextBtn
            onClick={() => {
              onChange({
                isCodeEditing: false,
              });
            }}>
            <Space size={5}>
              <FExit/>
              <span>退出代码模式</span>
            </Space>
          </FTextBtn>)
          : (<FTextBtn
            onClick={() => {
              onChange({
                isCodeEditing: true,
              });
            }}>
            <Space size={5}>
              <FCode/>
              <span>进入代码模式</span>
            </Space>
          </FTextBtn>)
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
                  codeCompileErrors: null,
                  codeExecutionError: null,
                  codeSaveSuccess: false,
                });
              }}
            />
            <div style={{height: 15}}/>
            <FRectBtn
              // loading={informalNodeManagerPage.codeIsChecking}
              disabled={!informalNodeManagerPage.codeIsDirty || informalNodeManagerPage.codeIsChecking}
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
            >{informalNodeManagerPage.codeIsChecking ? FUtil1.I18n.message('msg_verifying_code') : '校验并保存'}</FRectBtn>
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
              ruleObjList.map(({theRule, ...rule}, index: number) => {
                return (<div
                  key={rule.id}
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
                    {theRule.add && <AddRule {...theRule.add}/>}
                    {theRule.alter && <AlterRule alter={theRule.alter}/>}
                    {theRule.active && <ActiveRule active={theRule.active}/>}

                    {
                      rule.matchErrors.length > 0 && (<FTooltip title={rule.matchErrors.map((mE,iinn) => {
                        return (<div key={iinn}>{mE}</div>);
                      })}>
                        <div><FWarning/></div>
                      </FTooltip>)
                    }

                  </div>
                  {
                    !(!theRule.cover && !theRule.title && !theRule.labels && !theRule.online && !theRule.offline && !theRule.replaces && !theRule.attrs)
                    && (<div className={styles.ruleCardBody}>
                      <Space
                        className={styles.ruleCardBodyList}
                        size={15}
                        direction="vertical"
                      >
                        {/*{theRule.version && <VersionRule version={theRule.version}/>}*/}
                        {theRule.cover &&
                        <div className={styles.ruleCardBodyListItem}><CoverRule cover={theRule.cover}/></div>}
                        {theRule.title &&
                        <div className={styles.ruleCardBodyListItem}><TitleRule title={theRule.title}/></div>}
                        {theRule.labels &&
                        <div className={styles.ruleCardBodyListItem}><LabelRule labels={theRule.labels}/></div>}
                        {theRule.online &&
                        <div className={styles.ruleCardBodyListItem}><OnlineRule online={theRule.online}/></div>}
                        {theRule.offline &&
                        <div className={styles.ruleCardBodyListItem}><OfflineRule offline={theRule.offline}/></div>}
                        {theRule.replaces && theRule.replaces.map((replace: any, replaceIndex: any) => {
                          return (<div key={replaceIndex} className={styles.ruleCardBodyListItem}><ReplaceRule
                            {...replace}
                          /></div>);
                        })}
                        {theRule.attrs && theRule.attrs.map((attr: any, attrIndex: any) => {
                          return (
                            <div key={attrIndex} className={styles.ruleCardBodyListItem}><AttrRule {...attr}/></div>);
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
