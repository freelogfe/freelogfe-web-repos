import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import TypesCaption from '../components/TypesCaption';
import {
  AttrRule,
  TitleRule,
  ReplaceRule,
  OnlineRule,
  OfflineRule,
  LabelRule,
  CoverRule,
  AlterRule,
  AddRule, ActiveRule,
} from '../components/MappingRules';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, InformalNodeManagerPageModelState } from '@/models/connect';
import {
  OnChange_Rule_ListCheckbox_Action,
  OnChange_Rule_CheckAllCheckbox_Action,
  OnClick_Rule_DeleteBtn_Action,
  OnClick_Rule_EntryCodingBtn_Action,
  OnClick_Rule_ExportBtn_Action,
  OnClick_Rule_ExitCoding_CancelBtn_Action,
  OnClick_Rule_ExitCoding_ConfirmBtn_Action,
  OnLoad_Rule_ImportFileInput_Action,
  OnMountRulePageAction,
  OnUnmountRulePageAction,
  OnClick_Rule_ExitCodingBtn_Action,
  OnClick_Rule_Export_CancelBtn_Action,
  OnClick_Rule_Export_ConfirmBtn_Action,
  OnClick_Rule_Delete_CancelBtn_Action,
  OnClick_Rule_Delete_ConfirmBtn_Action,
  OnChange_Rule_Codemirror_Action,
  OnClick_Rule_SaveBtn_Action,
} from '@/models/informalNodeManagerPage';
import * as AHooks from 'ahooks';
import fConfirmModal from '@/components/fConfirmModal';
import { FI18n } from '@freelog/tools-lib';
import FTooltip from '@/components/FTooltip';
import FCheckbox from '@/components/FCheckbox';
import FNoDataTip from '@/components/FNoDataTip';
import FMonacoEditor from '@/components/FMonacoEditor';
import { Helmet } from 'react-helmet';
import FComponentsLib from '@freelog/components-lib';
import FPrompt from '@/components/FPrompt';
import fReadLocalFiles from '@/components/fReadLocalFiles';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';

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

  return (<>
    <Helmet>
      <title>{`映射规则管理 · ${informalNodeManagerPage.node_Name} - Freelog`}</title>
    </Helmet>
    <FPrompt watch={informalNodeManagerPage.rule_CodeIsDirty} messageText={'编辑后的映射规则尚未保存，现在离开会导致信息丢失'} />
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <FComponentsLib.FTitleText text={'映射规则管理'} />
        <div style={{ width: 10 }} />
        <TypesCaption />
        <div style={{ width: 50 }} />
        {
          informalNodeManagerPage.rule_PageStatus === 'normal' && (<Space size={30}>
            <FComponentsLib.FTextBtn
              onClick={async () => {
                const files = await fReadLocalFiles({
                  multiple: true,
                  accept: 'text/plain',
                });

                if (!files) {
                  return;
                }
                const reader = new FileReader();
                reader.readAsText(files[0]);
                reader.onload = function(evt: any) {
                  // console.log(evt, 'evt2222090900980989080980988');
                  dispatch<OnLoad_Rule_ImportFileInput_Action>({
                    type: 'informalNodeManagerPage/onLoad_Rule_ImportFileInput',
                    payload: {
                      value: evt.target.result,
                    },
                  });
                };
              }}
              type='primary'>
              <Space size={5}>
                <FComponentsLib.FIcons.FImport />
                <span>导入</span>
              </Space>
            </FComponentsLib.FTextBtn>
            {
              informalNodeManagerPage.rule_RuleList.length > 0 && (<>
                <FComponentsLib.FTextBtn
                  type='primary'
                  onClick={() => {
                    dispatch<OnClick_Rule_ExportBtn_Action>({
                      type: 'informalNodeManagerPage/onClick_Rule_ExportBtn',
                    });
                  }}
                >
                  <Space size={5}>
                    <FComponentsLib.FIcons.FExport />
                    <span>导出</span>
                  </Space>
                </FComponentsLib.FTextBtn>
                <FComponentsLib.FTextBtn
                  type='danger'
                  onClick={() => {
                    dispatch<OnClick_Rule_DeleteBtn_Action>({
                      type: 'informalNodeManagerPage/onClick_Rule_DeleteBtn',
                    });
                  }}
                >
                  <Space size={5}>
                    <FComponentsLib.FIcons.FDelete />
                    <span>删除</span>
                  </Space>
                </FComponentsLib.FTextBtn>
              </>)
            }

          </Space>)
        }

      </div>

      {
        informalNodeManagerPage.rule_PageStatus === 'normal' && (<FComponentsLib.FTextBtn
          onClick={() => {
            dispatch<OnClick_Rule_EntryCodingBtn_Action>({
              type: 'informalNodeManagerPage/onClick_Rule_EntryCodingBtn',
            });
          }}>
          <Space size={5}>
            <FComponentsLib.FIcons.FCode />
            <span>进入代码模式</span>
          </Space>
        </FComponentsLib.FTextBtn>)
      }

      {
        informalNodeManagerPage.rule_PageStatus === 'coding'
        && (<FComponentsLib.FTextBtn
          onClick={async () => {
            if (informalNodeManagerPage.rule_CodeIsDirty) {
              const bool: boolean = await fPromiseModalConfirm({
                title: '提示',
                description: '编辑后的映射规则尚未保存，现在离开会导致信息丢失',
              });

              if (bool) {
                dispatch<OnClick_Rule_ExitCoding_ConfirmBtn_Action>({
                  type: 'informalNodeManagerPage/onClick_Rule_ExitCoding_ConfirmBtn',
                });
              } else {
                dispatch<OnClick_Rule_ExitCoding_CancelBtn_Action>({
                  type: 'informalNodeManagerPage/onClick_Rule_ExitCoding_CancelBtn',
                });
              }
              // fConfirmModal({
              //   message: '编辑后的映射规则尚未保存，现在离开会导致信息丢失',
              //   onOk() {
              //     dispatch<OnClick_Rule_ExitCoding_ConfirmBtn_Action>({
              //       type: 'informalNodeManagerPage/onClick_Rule_ExitCoding_ConfirmBtn',
              //     });
              //   },
              //   onCancel() {
              //     dispatch<OnClick_Rule_ExitCoding_CancelBtn_Action>({
              //       type: 'informalNodeManagerPage/onClick_Rule_ExitCoding_CancelBtn',
              //     });
              //   },
              // });
              return;
            }
            dispatch<OnClick_Rule_ExitCodingBtn_Action>({
              type: 'informalNodeManagerPage/onClick_Rule_ExitCodingBtn',
            });
          }}>
          <Space size={5}>
            <FComponentsLib.FIcons.FExit />
            <span>退出代码模式</span>
          </Space>
        </FComponentsLib.FTextBtn>)
      }

      {
        informalNodeManagerPage.rule_PageStatus === 'export'
        && (<Space size={30}>
          <FComponentsLib.FTextBtn
            type='default'
            onClick={() => {
              dispatch<OnClick_Rule_Export_CancelBtn_Action>({
                type: 'informalNodeManagerPage/onClick_Rule_Export_CancelBtn',
              });
            }}
          >取消</FComponentsLib.FTextBtn>
          <FComponentsLib.FRectBtn
            type='primary'
            onClick={() => {
              dispatch<OnClick_Rule_Export_ConfirmBtn_Action>({
                type: 'informalNodeManagerPage/onClick_Rule_Export_ConfirmBtn',
              });
            }}
          >导出</FComponentsLib.FRectBtn>
        </Space>)
      }

      {
        informalNodeManagerPage.rule_PageStatus === 'delete'
        && (<Space size={30}>
          <FComponentsLib.FTextBtn
            type='default'
            onClick={() => {
              dispatch<OnClick_Rule_Delete_CancelBtn_Action>({
                type: 'informalNodeManagerPage/onClick_Rule_Delete_CancelBtn',
              });
            }}
          >{FI18n.i18nNext.t('btn_cancel')}</FComponentsLib.FTextBtn>
          <FComponentsLib.FRectBtn
            type='danger1'
            onClick={async () => {
              dispatch<OnClick_Rule_Delete_ConfirmBtn_Action>({
                type: 'informalNodeManagerPage/onClick_Rule_Delete_ConfirmBtn',
              });
            }}
          >删除</FComponentsLib.FRectBtn>
        </Space>)
      }
    </div>

    {
      informalNodeManagerPage.rule_PageStatus === 'coding'
        ? (<div className={styles.codeMirrorBody}>
          <div>
            <FMonacoEditor
              width={'100%'}
              value={informalNodeManagerPage.rule_CodeInput}
              options={{
                selectOnLineNumbers: true,
                minimap: {
                  enabled: false,
                },
              }}
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
            <FComponentsLib.FRectBtn
              disabled={!informalNodeManagerPage.rule_CodeIsDirty || informalNodeManagerPage.rule_CodeState === 'checking'}
              onClick={() => {
                dispatch<OnClick_Rule_SaveBtn_Action>({
                  type: 'informalNodeManagerPage/onClick_Rule_SaveBtn',
                });
              }}
            >{informalNodeManagerPage.rule_CodeState === 'checking' ? FI18n.i18nNext.t('msg_verifying') : '校验并保存'}</FComponentsLib.FRectBtn>

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
              informalNodeManagerPage.rule_RuleList.length > 0 && informalNodeManagerPage.rule_PageStatus !== 'normal' && (
                <div style={{ paddingLeft: 20 }}>
                  <Space size={10}>
                    <FCheckbox
                      indeterminate={!(informalNodeManagerPage.rule_RuleList.every((ro) => ro.checked) || informalNodeManagerPage.rule_RuleList.every((ro) => !ro.checked))}
                      checked={informalNodeManagerPage.rule_RuleList.every((ro) => ro.checked)}
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
              informalNodeManagerPage.rule_RuleList
                .filter((r) => {
                  return r.ruleInfo.operation !== 'comment';
                }).length === 0
                ? (<>
                  <FNoDataTip
                    height={'calc(100vh - 70px - 24px - 200px)'}
                    // tipText={'没有测试规则'}
                    tipText={FI18n.i18nNext.t('testnode_reflectrules_msg_empty')}
                  />
                  {/*<div>*/}
                  {/*  <FComponentsLib.FRectBtn>1234</FComponentsLib.FRectBtn>*/}
                  {/*  <FComponentsLib.FRectBtn>1234</FComponentsLib.FRectBtn>*/}
                  {/*</div>*/}
                </>)
                : informalNodeManagerPage.rule_RuleList
                  .filter((r) => {
                    return r.ruleInfo.operation !== 'comment';
                  })
                  .map((rule, index: number, ruleObjListArray) => {
                    return (<div
                      key={index}
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

                          {rule.ruleInfo.operation === 'add' && <AddRule
                            exhibit={rule.ruleInfo.exhibitName}
                            source={rule.ruleInfo.candidate}
                          />}
                          {rule.ruleInfo.operation === 'alter' && <AlterRule
                            alter={rule.ruleInfo.exhibitName}
                          />}
                          {rule.ruleInfo.operation === 'activate_theme' && <ActiveRule
                            active={rule.ruleInfo.exhibitName}
                          />}
                        </Space>

                        {
                          (rule as any).ruleInfo?.errorMsg && (<FTooltip
                            title={(rule as any).ruleInfo?.errorMsg}
                            placement='left'
                          >
                            <div><FComponentsLib.FIcons.FFail style={{ color: '#EE4040' }} /></div>
                          </FTooltip>)
                        }
                        {
                          !(rule as any).ruleInfo?.errorMsg && (rule as any).ruleInfo?.warningMsg && (<FTooltip
                            title={(rule as any).ruleInfo?.warningMsg}
                            placement='left'
                          >
                            <div><FComponentsLib.FIcons.FWarning /></div>
                          </FTooltip>)
                        }

                      </div>
                      {
                        (rule.ruleInfo.operation === 'add' || rule.ruleInfo.operation === 'alter')
                        && rule.ruleInfo.actions.filter((r) => {
                          return r.operation !== 'comment';
                        }).length > 0 && (<div className={styles.ruleCardBody}>
                          <Space
                            className={styles.ruleCardBodyList}
                            size={15}
                            direction='vertical'
                          >
                            {
                              rule.ruleInfo.actions
                                .filter((r) => {
                                  return r.operation !== 'comment';
                                })
                                .map((ruleAction, ind) => {
                                  // console.log(ruleAction, 'ruleAction@#$@#$@809i');
                                  return (<div className={styles.ruleCardBodyListItem} key={ind}>
                                    {
                                      ruleAction.operation === 'set_cover' && (<CoverRule cover={ruleAction.content} />)
                                    }
                                    {
                                      ruleAction.operation === 'set_title' && (<TitleRule title={ruleAction.content} />)
                                    }
                                    {
                                      ruleAction.operation === 'set_labels' && (<LabelRule labels={ruleAction.content} />)
                                    }
                                    {
                                      ruleAction.operation === 'online' && (<>
                                        {ruleAction.content
                                          ? (<OnlineRule online />)
                                          : (<OfflineRule offline />)}
                                      </>)
                                    }
                                    {
                                      ruleAction.operation === 'replace' && (<ReplaceRule
                                        replaced={ruleAction.content.replaced}
                                        replacer={ruleAction.content.replacer}
                                        scopes={ruleAction.content.scopes}
                                      />)
                                    }
                                    {
                                      ruleAction.operation === 'add_attr' && (<AttrRule
                                        type={'add'}
                                        theKey={ruleAction.content.key}
                                        value={ruleAction.content.value}
                                        description={ruleAction.content.description}
                                      />)
                                    }
                                    {
                                      ruleAction.operation === 'delete_attr' && (<AttrRule
                                        type={'delete'}
                                        theKey={ruleAction.content.key}
                                      />)
                                    }

                                    {
                                      ruleAction.errorMsg && (<FTooltip
                                        title={ruleAction.errorMsg}
                                        placement='left'
                                      >
                                        <div><FComponentsLib.FIcons.FFail style={{ color: '#EE4040' }} /></div>
                                      </FTooltip>)
                                    }

                                    {
                                      !ruleAction.errorMsg && ruleAction.warningMsg && (<FTooltip
                                        title={ruleAction.warningMsg}
                                        placement='left'
                                      >
                                        <div><FComponentsLib.FIcons.FWarning /></div>
                                      </FTooltip>)
                                    }

                                  </div>);

                                })
                            }

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
