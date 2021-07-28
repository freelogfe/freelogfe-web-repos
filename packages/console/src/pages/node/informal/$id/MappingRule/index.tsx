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
  ChangeAction, OnCancelRulePageLeaveAction, OnChangeRuleCheckedAction, OnChangeRuleIndeterminateCheckboxAction,
  OnClickDeleteRulesBtnAction,
  OnClickEntryCodingBtnAction,
  OnClickExitCodingBtnAction, OnClickExitCodingCancelBtnAction, OnClickExitCodingConfirmBtnAction,
  OnClickExportRulesBtnAction, OnConfirmRulePageLeaveAction,
  OnImportRulesBtnAction,
  OnMountRulePageAction, OnPromptRulePageLeaveAction, OnUnmountRulePageAction,
  SaveRulesAction,
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
    if (informalNodeManagerPage.rulePageCodeIsDirty) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }

  }, [informalNodeManagerPage.rulePageCodeIsDirty]);

  // const {rules} = compile(informalNodeManagerPage.ruleText);
  // console.log(rules, '@#$RASDF)(JULK');
  const ruleObjList = informalNodeManagerPage.rulePageRuleList.map((rule) => {
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
      when={informalNodeManagerPage.rulePageCodeIsDirty && informalNodeManagerPage.rulePagePromptLeavePath === ''}
      message={(location: H.Location) => {
        console.log(location, 'location12341234123411111111@@@@@@');
        const locationHref: string = location.pathname + location.search;
        if (locationHref === FUtil.LinkTo.informNodeManagement({
          nodeID: informalNodeManagerPage.nodeID,
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
          informalNodeManagerPage.rulePageStatus === 'normal' && (<Space size={30}>
            <FUpload
              accept={'text/plain'}
              beforeUpload={(file) => {
                // console.log(file, 'file@Q#asdf-juLK(*)YHOjkf');
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = function(evt: any) {
                  dispatch<OnImportRulesBtnAction>({
                    type: 'informalNodeManagerPage/onImportRulesBtn',
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
                dispatch<OnClickExportRulesBtnAction>({
                  type: 'informalNodeManagerPage/onClickExportRulesBtn',
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
                dispatch<OnClickDeleteRulesBtnAction>({
                  type: 'informalNodeManagerPage/onClickDeleteRulesBtn',
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
        informalNodeManagerPage.rulePageStatus === 'normal' && (<FTextBtn
          onClick={() => {
            dispatch<OnClickEntryCodingBtnAction>({
              type: 'informalNodeManagerPage/onClickEntryCodingBtn',
            });
          }}>
          <Space size={5}>
            <FCode />
            <span>进入代码模式</span>
          </Space>
        </FTextBtn>)
      }

      {
        informalNodeManagerPage.rulePageStatus === 'coding'
        && (<FTextBtn
          onClick={() => {
            if (informalNodeManagerPage.rulePageCodeIsDirty) {
              fConfirmModal({
                message: '编辑后的映射规则尚未保存，现在离开会导致信息丢失',
                onOk() {
                  dispatch<OnClickExitCodingConfirmBtnAction>({
                    type: 'informalNodeManagerPage/onClickExitCodingConfirmBtn',
                  });
                },
                onCancel() {
                  dispatch<OnClickExitCodingCancelBtnAction>({
                    type: 'informalNodeManagerPage/onClickExitCodingCancelBtn',
                  });
                },
              });
              return;
            }
            dispatch<OnClickExitCodingBtnAction>({
              type: 'informalNodeManagerPage/onClickExitCodingBtn',
            });
          }}>
          <Space size={5}>
            <FExit />
            <span>退出代码模式</span>
          </Space>
        </FTextBtn>)
      }

      {
        informalNodeManagerPage.rulePageStatus === 'export'
        && (<Space size={30}>
          <FTextBtn
            type='default'
            onClick={() => {
              onChange({
                rulePageStatus: 'normal',
              });
            }}
          >取消</FTextBtn>
          <FRectBtn
            type='primary'
            onClick={() => {
              const fileName = `测试节点.映射规则.${informalNodeManagerPage.nodeID}.txt`;
              const text: string = informalNodeManagerPage.rulePageRuleList
                .filter((rl) => rl.checked)
                .map((rl) => {
                  return rl.ruleInfo.text;
                })
                .join('\n\n');
              const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
              FileSaver.saveAs(blob, fileName);
            }}
          >导出</FRectBtn>
        </Space>)
      }

      {
        informalNodeManagerPage.rulePageStatus === 'delete'
        && (<Space size={30}>
          <FTextBtn
            type='default'
            onClick={() => {
              onChange({
                rulePageStatus: 'normal',
              });
            }}
          >{FUtil1.I18n.message('btn_cancel')}</FTextBtn>
          <FRectBtn
            type='danger1'
            onClick={async () => {
              const text: string = informalNodeManagerPage.rulePageRuleList
                .filter((rl) => !rl.checked)
                .map((rl) => {
                  return rl.ruleInfo.text;
                })
                .join('\n\n');
              await onChange({
                rulePageCodeInput: text,
              });
              await dispatch<SaveRulesAction>({
                type: 'informalNodeManagerPage/saveRules',
              });
            }}
          >删除</FRectBtn>
        </Space>)
      }
    </div>

    {
      informalNodeManagerPage.rulePageStatus === 'coding'
        ? (<div className={styles.codeMirrorBody}>
          <div>
            <FCodemirror
              value={informalNodeManagerPage.rulePageCodeInput}
              onChange={(value) => {
                onChange({
                  rulePageCodeInput: value,
                  rulePageCodeIsDirty: true,
                  rulePageCodeCompileErrors: null,
                  rulePageCodeExecutionError: null,
                  rulePageCodeSaveSuccess: false,
                });
              }}
            />
            <div style={{ height: 15 }} />
            <FRectBtn
              // loading={informalNodeManagerPage.codeIsChecking}
              disabled={!informalNodeManagerPage.rulePageCodeIsDirty || informalNodeManagerPage.rulePageCodeIsChecking}
              onClick={() => {
                // onChange({
                //   codeIsDirty: false,
                // });
                const { errors, rules, errorObjects } = compile(informalNodeManagerPage.rulePageCodeInput);
                if (errorObjects.length > 0) {
                  // return dispatch<ChangeAction>({
                  //   type: 'informalNodeManagerPage/change',
                  //   payload: {
                  //     codeCompileErrors: errorObjects,
                  //   },
                  // });
                  return onChange({
                    rulePageCodeCompileErrors: errorObjects,
                  });
                }
                dispatch<SaveRulesAction>({
                  type: 'informalNodeManagerPage/saveRules',
                });
              }}
            >{informalNodeManagerPage.rulePageCodeIsChecking ? FUtil1.I18n.message('msg_verifying') : '校验并保存'}</FRectBtn>
            {
              informalNodeManagerPage.rulePageCodeCompileErrors && (<div className={styles.codeCompileErrors}>
                <div style={{ height: 20 }} />
                <div className={styles.errorTitle}>编译错误，请检查更正后提交。</div>
                <div style={{ height: 20 }} />
                <Space className={styles.errorList} size={5} direction='vertical'>
                  {
                    informalNodeManagerPage.rulePageCodeCompileErrors.map((cme, index) => {
                      return (<div key={index} className={styles.errorListItem}>
                        <div>•</div>
                        <div style={{ width: 5 }} />
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
              informalNodeManagerPage.rulePageCodeExecutionError && (<div className={styles.codeExecutionError}>
                <div style={{ height: 20 }} />
                <div className={styles.errorTitle}>校验并保存成功，但存在预执行错误。</div>
                <div style={{ height: 20 }} />
                <Space className={styles.errorList} size={5} direction='vertical'>
                  {
                    informalNodeManagerPage.rulePageCodeExecutionError.map((cme, index) => {
                      return (<div key={index} className={styles.errorListItem}>
                        <div>•</div>
                        <div style={{ width: 5 }} />
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
              informalNodeManagerPage.rulePageCodeSaveSuccess && (<>
                <div style={{ height: 20 }} />
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
            direction='vertical'
          >
            {
              informalNodeManagerPage.rulePageStatus !== 'normal' && (<div style={{ paddingLeft: 20 }}>
                <Space size={10}>
                  <FCheckbox
                    indeterminate={informalNodeManagerPage.ruleIndeterminate}
                    checked={informalNodeManagerPage.ruleIndeterminateChecked}
                    onChange={(e) => {
                      dispatch<OnChangeRuleIndeterminateCheckboxAction>({
                        type: 'informalNodeManagerPage/onChangeRuleIndeterminateCheckbox',
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
                          informalNodeManagerPage.rulePageStatus !== 'normal' && (<FCheckbox
                            checked={rule.checked}
                            onChange={(e) => {
                              dispatch<OnChangeRuleCheckedAction>({
                                type: 'informalNodeManagerPage/onChangeRuleChecked',
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
