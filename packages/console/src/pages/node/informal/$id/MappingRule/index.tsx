import * as React from 'react';
import styles from './index.less';
import {FTitleText} from "@/components/FText";
import {Space} from "antd";
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
  AddRule
} from "../components/MappingRules";
import FCodemirror from "@/components/FCodemirror";
import {FNormalButton} from "@/components/FButton";
import {RouteComponentProps} from "react-router";
import {connect, Dispatch} from 'dva';
import {ConnectState, InformalNodeManagerPageModelState} from "@/models/connect";
import {ChangeAction, FetchRulesAction, SaveRulesAction} from "@/models/informalNodeManagerPage";

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

  return (<>
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <FTitleText text={'展品管理'}/>
        <div style={{width: 10}}/>
        <TypesCaption/>
        <div style={{width: 50}}/>
        <Space size={30}>
          <a><FImport/> <span>导入</span></a>
          <a><FExport/> <span>导入</span></a>
          <a style={{}}><FDelete/> <span>删除</span></a>
        </Space>
      </div>

      {
        informalNodeManagerPage.isCodeEditing
          ? (<a onClick={() => {
            dispatch<ChangeAction>({
              type: 'informalNodeManagerPage/change',
              payload: {
                isCodeEditing: false,
              },
            });
          }}><FExit/> 退出代码模式</a>)
          : (<a onClick={() => {
            dispatch<ChangeAction>({
              type: 'informalNodeManagerPage/change',
              payload: {
                isCodeEditing: true,
              },
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
                dispatch<ChangeAction>({
                  type: 'informalNodeManagerPage/change',
                  payload: {
                    codeInput: value,
                    codeIsDirty: true,
                  },
                });
              }}
            />
            <div style={{height: 15}}/>
            <FNormalButton
              loading={informalNodeManagerPage.codeIsChecking}
              disabled={!informalNodeManagerPage.codeIsDirty && !informalNodeManagerPage.codeIsChecking}
              onClick={() => {
                dispatch<ChangeAction>({
                  type: 'informalNodeManagerPage/change',
                  payload: {
                    codeIsDirty: false,
                  },
                });
                const {errors, rules, errorObjects} = compile(informalNodeManagerPage.codeInput);
                if (errorObjects.length > 0) {
                  return dispatch<ChangeAction>({
                    type: 'informalNodeManagerPage/change',
                    payload: {
                      codeCompileErrors: errorObjects,
                    },
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
          <Space className={styles.ruleList} direction="vertical">
            <div className={styles.ruleCard}>
              <div className={styles.ruleCardHeader}>
                {/*<AddRule source={{}}/>*/}
                <FWarning/>
              </div>
              <div className={styles.ruleCardBody}>
                <Space className={styles.ruleCardBodyList} size={15} direction="vertical">
                  <div className={styles.ruleCardBodyListItem}>
                    {/*<ReplaceRule/>*/}
                    <FWarning/>
                  </div>
                </Space>
              </div>
            </div>

            <div className={styles.ruleCard}>
              <div className={styles.ruleCardHeader}>
                {/*<AddRule/>*/}
                <FWarning/>
              </div>
              <div className={styles.ruleCardBody}>
                <Space className={styles.ruleCardBodyList} size={15} direction="vertical">
                  <div className={styles.ruleCardBodyListItem}>
                    {/*<ReplaceRule/>*/}
                    <FWarning/>
                  </div>
                </Space>
              </div>
            </div>
          </Space>
        </div>)
    }

  </>);
}

export default connect(({informalNodeManagerPage}: ConnectState) => ({
  informalNodeManagerPage,
}))(MappingRule);

// interface HeaderProps {
//   onClickInCode?(): void;
// }
//
// function Header({onClickInCode}: HeaderProps) {
//   return ();
// }
