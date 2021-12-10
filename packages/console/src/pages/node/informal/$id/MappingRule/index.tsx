import * as React from 'react';
import styles from './index.less';
import { FTitleText } from '@/components/FText';
import { Space } from 'antd';
import { FImport, FExport, FCode, FExit, FInfo, FWarning, FDelete } from '@/components/FIcons';
import TypesCaption from '../components/TypesCaption';
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
  AddRule, ActiveRule,
} from '../components/MappingRules';
import FCodemirror from '@/components/FCodemirror';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import { connect, Dispatch } from 'dva';
import { ConnectState, InformalNodeManagerPageModelState } from '@/models/connect';
import {
  ChangeAction,
  OnCancelRulePageLeaveAction,
  OnChange_Rule_ListCheckbox_Action,
  OnChange_Rule_CheckAllCheckbox_Action,
  OnClick_Rule_DeleteBtn_Action,
  OnClick_Rule_EntryCodingBtn_Action,
  OnClick_Rule_ExportBtn_Action,
  OnClick_Rule_ExitCoding_CancelBtn_Action,
  OnClick_Rule_ExitCoding_ConfirmBtn_Action,
  OnConfirmRulePageLeaveAction,
  OnLoad_Rule_ImportFileInput_Action,
  OnMountRulePageAction,
  OnPromptRulePageLeaveAction,
  OnUnmountRulePageAction,
  SaveRulesAction,
  OnClick_Rule_ExitCodingBtn_Action,
  OnClick_Rule_Export_CancelBtn_Action,
  OnClick_Rule_Export_ConfirmBtn_Action,
  OnClick_Rule_Delete_CancelBtn_Action,
  OnClick_Rule_Delete_ConfirmBtn_Action,
  OnChange_Rule_Codemirror_Action,
  OnClick_Rule_SaveBtn_Action,
} from '@/models/informalNodeManagerPage';
import FileSaver from 'file-saver';
import FUpload from '@/components/FUpload';
import FUtil1 from '@/utils';
import Prompt from 'umi/prompt';
import * as H from 'history';
import * as AHooks from 'ahooks';
import fConfirmModal from '@/components/fConfirmModal';
import { router } from 'umi';
import { FUtil } from '@freelog/tools-lib';
import FTooltip from '@/components/FTooltip';
import FCheckbox from '@/components/FCheckbox';
import FNoDataTip from '@/components/FNoDataTip';
import moment from 'moment';
import FMonacoEditor from '@/components/FMonacoEditor';

const { compile } = require('@freelog/nmr_translator');

interface MappingRuleProps {
  dispatch: Dispatch;

  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function MappingRule({ dispatch, informalNodeManagerPage }: MappingRuleProps) {

  AHooks.useMount(() => {
    dispatch<OnMountRulePageAction>({
      type: 'informalNodeManagerPage/onMountRulePage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountRulePageAction>({
      type: 'informalNodeManagerPage/onUnmountRulePage',
    });
  });

  React.useEffect(() => {
    if (informalNodeManagerPage.rule_CodeIsDirty) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }

  }, [informalNodeManagerPage.rule_CodeIsDirty]);

  // const {rules} = compile(informalNodeManagerPage.ruleText);
  // console.log(rules, '@#$RASDF)(JULK');
  const ruleObjList = informalNodeManagerPage.rule_RuleList.map((rule) => {
    // console.log(rule, '##@$@#$');
    const { ruleInfo } = rule;

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
      when={informalNodeManagerPage.rule_CodeIsDirty && informalNodeManagerPage.rule_PromptLeavePath === ''}
      message={(location: H.Location) => {
        console.log(location, 'location12341234123411111111@@@@@@');
        const locationHref: string = location.pathname + location.search;
        if (locationHref === FUtil.LinkTo.informNodeManagement({
          nodeID: informalNodeManagerPage.node_ID,
          showPage: 'mappingRule',
        })) {
          return true;
        }
        dispatch<OnPromptRulePageLeaveAction>({
          type: 'informalNodeManagerPage/onPromptRulePageLeave',
          payload: {
            href: locationHref,
          },
        });
        fConfirmModal({
          message: '编辑后的映射规则尚未保存，现在离开会导致信息丢失',
          onOk() {
            dispatch<OnConfirmRulePageLeaveAction>({
              type: 'informalNodeManagerPage/onConfirmRulePageLeave',
            });
          },
          onCancel() {
            dispatch<OnCancelRulePageLeaveAction>({
              type: 'informalNodeManagerPage/onCancelRulePageLeave',
            });
          },
        });
        return false;
      }}
    />
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <FTitleText text={'映射规则管理'} />
        <div style={{ width: 10 }} />
        <TypesCaption />
        <div style={{ width: 50 }} />
        {
          informalNodeManagerPage.rule_PageStatus === 'normal' && (<Space size={30}>
            <FUpload
              accept={'text/plain'}
              beforeUpload={(file) => {
                // console.log(file, 'file@Q#asdf-juLK(*)YHOjkf');
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = function(evt: any) {
                  dispatch<OnLoad_Rule_ImportFileInput_Action>({
                    type: 'informalNodeManagerPage/onLoad_Rule_ImportFileInput',
                    payload: {
                      value: evt.target.result,
                    },
                  });
                };
                return false;
              }}
              showUploadList={false}
            >
              <FTextBtn type='primary'>
                <Space size={5}>
                  <FImport />
                  <span>导入</span>
                </Space>
              </FTextBtn>
            </FUpload>
            <FTextBtn
              type='primary'
              onClick={() => {
                dispatch<OnClick_Rule_ExportBtn_Action>({
                  type: 'informalNodeManagerPage/onClick_Rule_ExportBtn',
                });
              }}
            >
              <Space size={5}>
                <FExport />
                <span>导出</span>
              </Space>
            </FTextBtn>
            <FTextBtn
              type='danger'
              onClick={() => {
                dispatch<OnClick_Rule_DeleteBtn_Action>({
                  type: 'informalNodeManagerPage/onClick_Rule_DeleteBtn',
                });
              }}
            >
              <Space size={5}>
                <FDelete />
                <span>删除</span>
              </Space>
            </FTextBtn>
          </Space>)
        }

      </div>

      {
        informalNodeManagerPage.rule_PageStatus === 'normal' && (<FTextBtn
          onClick={() => {
            dispatch<OnClick_Rule_EntryCodingBtn_Action>({
              type: 'informalNodeManagerPage/onClick_Rule_EntryCodingBtn',
            });
          }}>
          <Space size={5}>
            <FCode />
            <span>进入代码模式</span>
          </Space>
        </FTextBtn>)
      }

      {
        informalNodeManagerPage.rule_PageStatus === 'coding'
        && (<FTextBtn
          onClick={() => {
            if (informalNodeManagerPage.rule_CodeIsDirty) {
              fConfirmModal({
                message: '编辑后的映射规则尚未保存，现在离开会导致信息丢失',
                onOk() {
                  dispatch<OnClick_Rule_ExitCoding_ConfirmBtn_Action>({
                    type: 'informalNodeManagerPage/onClick_Rule_ExitCoding_ConfirmBtn',
                  });
                },
                onCancel() {
                  dispatch<OnClick_Rule_ExitCoding_CancelBtn_Action>({
                    type: 'informalNodeManagerPage/onClick_Rule_ExitCoding_CancelBtn',
                  });
                },
              });
              return;
            }
            dispatch<OnClick_Rule_ExitCodingBtn_Action>({
              type: 'informalNodeManagerPage/onClick_Rule_ExitCodingBtn',
            });
          }}>
          <Space size={5}>
            <FExit />
            <span>退出代码模式</span>
          </Space>
        </FTextBtn>)
      }

      {
        informalNodeManagerPage.rule_PageStatus === 'export'
        && (<Space size={30}>
          <FTextBtn
            type='default'
            onClick={() => {
              dispatch<OnClick_Rule_Export_CancelBtn_Action>({
                type: 'informalNodeManagerPage/onClick_Rule_Export_CancelBtn',
              });
            }}
          >取消</FTextBtn>
          <FRectBtn
            type='primary'
            onClick={() => {
              dispatch<OnClick_Rule_Export_ConfirmBtn_Action>({
                type: 'informalNodeManagerPage/onClick_Rule_Export_ConfirmBtn',
              });
            }}
          >导出</FRectBtn>
        </Space>)
      }

      {
        informalNodeManagerPage.rule_PageStatus === 'delete'
        && (<Space size={30}>
          <FTextBtn
            type='default'
            onClick={() => {
              dispatch<OnClick_Rule_Delete_CancelBtn_Action>({
                type: 'informalNodeManagerPage/onClick_Rule_Delete_CancelBtn',
              });
            }}
          >{FUtil1.I18n.message('btn_cancel')}</FTextBtn>
          <FRectBtn
            type='danger1'
            onClick={async () => {
              dispatch<OnClick_Rule_Delete_ConfirmBtn_Action>({
                type: 'informalNodeManagerPage/onClick_Rule_Delete_ConfirmBtn',
              });
            }}
          >删除</FRectBtn>
        </Space>)
      }
    </div>

    {
      informalNodeManagerPage.rule_PageStatus === 'coding'
        ? (<div className={styles.codeMirrorBody}>
          <div>
            {/*<FCodemirror*/}
            {/*  value={informalNodeManagerPage.rule_CodeInput}*/}
            {/*  onChange={(value) => {*/}
            {/*    dispatch<OnChange_Rule_Codemirror_Action>({*/}
            {/*      type: 'informalNodeManagerPage/onChange_Rule_Codemirror',*/}
            {/*      payload: {*/}
            {/*        value: value,*/}
            {/*      },*/}
            {/*    });*/}
            {/*  }}*/}
            {/*/>*/}
            <FMonacoEditor
              width={'100%'}
              value={informalNodeManagerPage.rule_CodeInput}
              onChange={(value) => {
                dispatch<OnChange_Rule_Codemirror_Action>({
                  type: 'informalNodeManagerPage/onChange_Rule_Codemirror',
                  payload: {
                    value: value,
                  },
                });
              }}
            />

            <div style={{ height: 15 }} />
            <FRectBtn
              // loading={informalNodeManagerPage.codeIsChecking}
              disabled={!informalNodeManagerPage.rule_CodeIsDirty || informalNodeManagerPage.rule_CodeState === 'checking'}
              onClick={() => {
                dispatch<OnClick_Rule_SaveBtn_Action>({
                  type: 'informalNodeManagerPage/onClick_Rule_SaveBtn',
                });
              }}
            >{informalNodeManagerPage.rule_CodeState === 'checking' ? FUtil1.I18n.message('msg_verifying') : '校验并保存'}</FRectBtn>

            <div style={{ height: 20 }} />

            {
              informalNodeManagerPage.rule_CodeState === 'compileError' && (<>
                <div className={styles.CompileErrorTip}>编译错误，请检查更正后提交。</div>
                <div style={{ height: 20 }} />
                <ResultList
                  list={informalNodeManagerPage.rule_CodeCompileErrors.map((cce) => {
                    return [
                      {
                        label: '错误提示：',
                        content: cce.msg,
                      },
                    ];
                  })}
                />
              </>)
            }

            {
              informalNodeManagerPage.rule_CodeState === 'executionError' && (<>
                <div className={styles.CodeExecutionErrorTip}>校验并保存成功，但存在预执行错误。</div>
                {
                  informalNodeManagerPage.rule_CodeEfficients.length > 0 && (<>
                    <div style={{ height: 20 }} />
                    <div className={styles.CodeExecutionErrorTip1}>有效预执行结果：</div>
                    <div style={{ height: 15 }} />
                    <ResultList
                      list={informalNodeManagerPage.rule_CodeEfficients.map((ce) => {
                        return [
                          {
                            label: '规则语句：',
                            content: ce.ruleText,
                          },
                          {
                            label: '匹配数量：',
                            content: String(ce.matchCount),
                          },
                        ];
                      })}
                    />
                  </>)
                }

                <div style={{ height: 20 }} />
                <div className={styles.CodeExecutionErrorTip2}>无效预执行结果：</div>
                <div style={{ height: 15 }} />
                <ResultList
                  list={informalNodeManagerPage.rule_CodeExecutionErrors.map((cee) => {
                    return [
                      {
                        label: '规则语句：',
                        content: cee.ruleText,
                      },
                      {
                        label: '错误提示：',
                        content: cee.errors,
                      },
                    ];
                  })}
                />
              </>)
            }

            {
              informalNodeManagerPage.rule_CodeState === 'noError' && (<>
                <div className={styles.CodeEfficientTip}>校验并保存成功。</div>
                <div style={{ height: 20 }} />
                <ResultList
                  list={informalNodeManagerPage.rule_CodeEfficients.map((ce) => {
                    return [
                      {
                        label: '规则语句：',
                        content: ce.ruleText,
                      },
                      {
                        label: '匹配数量：',
                        content: String(ce.matchCount),
                      },
                    ];
                  })}
                />
              </>)
            }

          </div>
        </div>)
        : (<div className={styles.ruleListBody}>
          <Space
            className={styles.ruleList}
            direction='vertical'
          >
            {
              ruleObjList.length > 0 && informalNodeManagerPage.rule_PageStatus !== 'normal' && (
                <div style={{ paddingLeft: 20 }}>
                  <Space size={10}>
                    <FCheckbox
                      indeterminate={!(ruleObjList.every((ro) => ro.checked) || ruleObjList.every((ro) => !ro.checked))}
                      checked={ruleObjList.every((ro) => ro.checked)}
                      onChange={(e) => {
                        dispatch<OnChange_Rule_CheckAllCheckbox_Action>({
                          type: 'informalNodeManagerPage/OoChange_Rule_CheckAllCheckbox',
                          payload: {
                            checked: e.target.checked,
                          },
                        });
                      }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>全选</span>
                  </Space>
                </div>)
            }

            {
              ruleObjList.length === 0
                ? (<FNoDataTip height={'calc(100vh - 70px - 24px - 200px)'} tipText={'没有测试规则'} />)
                : ruleObjList.map(({ theRule, ...rule }, index: number, ruleObjListArray) => {
                  return (<div
                    key={rule.id}
                    className={styles.ruleCard}
                  >
                    <div className={styles.ruleCardHeader}>
                      <Space size={20}>
                        {
                          informalNodeManagerPage.rule_PageStatus !== 'normal' && (<FCheckbox
                            checked={rule.checked}
                            onChange={(e) => {
                              dispatch<OnChange_Rule_ListCheckbox_Action>({
                                type: 'informalNodeManagerPage/onChange_Rule_ListCheckbox',
                                payload: {
                                  ruleID: rule.id,
                                  checked: e.target.checked,
                                },
                              });
                            }}
                          />)
                        }

                        {theRule.add && <AddRule {...theRule.add} />}
                        {theRule.alter && <AlterRule alter={theRule.alter} />}
                        {theRule.active && <ActiveRule active={theRule.active} />}
                      </Space>
                      {
                        rule.matchErrors.length > 0 && (<FTooltip title={rule.matchErrors.map((mE, iinn) => {
                          return (<div key={iinn}>{mE}</div>);
                        })}>
                          <div><FWarning /></div>
                        </FTooltip>)
                      }

                    </div>
                    {
                      !(!theRule.cover && !theRule.title && !theRule.labels && !theRule.online && !theRule.offline && !theRule.replaces && !theRule.attrs)
                      && (<div className={styles.ruleCardBody}>
                        <Space
                          className={styles.ruleCardBodyList}
                          size={15}
                          direction='vertical'
                        >
                          {/*{theRule.version && <VersionRule version={theRule.version}/>}*/}
                          {theRule.cover &&
                          <div className={styles.ruleCardBodyListItem}><CoverRule cover={theRule.cover} /></div>}
                          {theRule.title &&
                          <div className={styles.ruleCardBodyListItem}><TitleRule title={theRule.title} /></div>}
                          {theRule.labels &&
                          <div className={styles.ruleCardBodyListItem}><LabelRule labels={theRule.labels} /></div>}
                          {theRule.online &&
                          <div className={styles.ruleCardBodyListItem}><OnlineRule online={theRule.online} /></div>}
                          {theRule.offline &&
                          <div className={styles.ruleCardBodyListItem}><OfflineRule offline={theRule.offline} /></div>}
                          {theRule.replaces && theRule.replaces.map((replace: any, replaceIndex: any) => {
                            return (<div key={replaceIndex} className={styles.ruleCardBodyListItem}><ReplaceRule
                              {...replace}
                            /></div>);
                          })}
                          {theRule.attrs && theRule.attrs.map((attr: any, attrIndex: any) => {
                            return (
                              <div key={attrIndex} className={styles.ruleCardBodyListItem}><AttrRule {...attr} /></div>);
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

export default connect(({ informalNodeManagerPage }: ConnectState) => ({
  informalNodeManagerPage,
}))(MappingRule);

interface ResultListProps {
  list: {
    label: string;
    content: string | string[]
  }[][];
}

function ResultList({ list }: ResultListProps) {
  return (<Space size={10} className={styles.ResultListContainer} direction='vertical'>
    {
      list.map((l, i) => {
        return (<div className={styles.ResultListItem} key={i}>
          <div className={styles.dot}>•</div>
          <div style={{ width: 5, flexShrink: 0 }} />
          <Space direction='vertical' size={5} className={styles.right}>
            {
              l.map((ll, ii) => {
                return (<div key={ii} className={styles.rightItem}>
                  <div className={styles.label}>{ll.label}</div>
                  <Space className={styles.content} direction='vertical' size={5}>
                    {
                      typeof ll.content === 'string'
                        ? (<div>{ll.content}</div>)
                        : ll.content.map((c, iii) => {
                          return (<div key={iii}>{c}</div>);
                        })
                    }
                  </Space>
                </div>);
              })
            }

          </Space>
        </div>);
      })
    }

  </Space>);
}
