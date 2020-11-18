import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from "@/components/FText";
import FDropdownMenu from "@/components/FDropdownMenu";
import {Space} from "antd";
import {FDelete, FEdit, FSwap} from "@/components/FIcons";
import {FCircleButton, FTextButton} from "@/components/FButton";
import FRedo from "@/components/FIcons/FRedo";
import {
  ChangeAction,
  ChangeVersionAction,
  ExhibitInfoPageModelState,
  UpdateRewriteAction
} from "@/models/exhibitInfoPage";
import FSelect from "@/components/FSelect";
import FInput from "@/components/FInput";
import {connect, Dispatch} from "dva";
import {ConnectState} from "@/models/connect";
import FModal from "@/components/FModal";
import {FDoubleDown, FDoubleUp} from "@/components/FIcons";

interface SettingProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Setting({dispatch, exhibitInfoPage}: SettingProps) {

  function onChangeCustomAttrs({key, value}: { key: string; value: string }, update: boolean = false) {
    dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload: {
        pCustomAttrs: exhibitInfoPage.pCustomAttrs.map((pCustomAttr) => {
          if (pCustomAttr.key !== key) {
            return pCustomAttr;
          }
          return {
            ...pCustomAttr,
            newValue: value,
            newValueError: (value.length > 30 || value === '') ? '1~30个字符' : '',
          };
        }),
      }
    });
    if (update) {
      dispatch<UpdateRewriteAction>({
        type: 'exhibitInfoPage/updateRewrite',
      });
    }
  }

  return (<>
    <FTitleText text={'高级设置'} type="h4"/>
    <div style={{height: 20}}/>

    <FTitleText text={'展示版本'} type="form"/>
    <div style={{height: 15}}/>
    <FDropdownMenu
      options={[...exhibitInfoPage.allVersions].reverse().map((av: string) => ({value: av, text: av}))}
      onChange={(value) => {
        dispatch<ChangeVersionAction>({
          type: 'exhibitInfoPage/changeVersion',
          payload: value,
        });
      }}
    >
      <Space style={{cursor: 'pointer'}} size={15}><FContentText text={exhibitInfoPage.version}/><FSwap/></Space>
    </FDropdownMenu>

    {
      exhibitInfoPage.settingUnfold && (<>
        <div style={{height: 30}}/>

        <FTitleText text={'基础属性'} type="form"/>
        <div style={{height: 15}}/>
        <div className={styles.attr}>
          <table>
            <tbody>
            {
              exhibitInfoPage.pBaseAttrs.map((pb) => (<tr key={pb.key}>
                <td><FContentText text={pb.key}/></td>
                <td><FContentText text={pb.value}/></td>
              </tr>))
            }
            </tbody>
          </table>
        </div>
        <div style={{height: 30}}/>

        <FTitleText text={'自定义选项'} type="form"/>

        <div style={{height: 15}}/>

        <div className={styles.options}>
          {
            exhibitInfoPage.pCustomAttrs.map((pc) => (<div key={pc.key}>
              <div className={styles.optionTitle}>
                <FContentText text={pc.key}/>
                {
                  pc.defaultValue
                    ? (<FTextButton
                      theme="primary"
                      onClick={() => {
                        onChangeCustomAttrs({key: pc.key, value: pc.defaultValue || ''}, true);
                      }}
                    ><FRedo/></FTextButton>)
                    : (<Space size={10}>
                      <FTextButton
                        theme="primary"
                        onClick={() => {
                          const editing = exhibitInfoPage.pCustomAttrs.find((pCustomAttr) => pCustomAttr.key === pc.key);
                          if (!editing) {
                            return;
                          }
                          dispatch<ChangeAction>({
                            type: 'exhibitInfoPage/change',
                            payload: {
                              pCustomAttrs: exhibitInfoPage.pCustomAttrs.map((pCustomAttr) => ({
                                ...pCustomAttr,
                                isEditing: pCustomAttr.key === pc.key,
                              })),
                              pAddCustomKey: editing.key,
                              pAddCustomValue: editing.value,
                              pAddCustomDescription: editing.remark,
                            },
                          });
                        }}
                      ><FEdit/></FTextButton>
                      <FDelete
                        style={{color: '#EE4040', cursor: 'pointer'}}
                        onClick={() => {
                          dispatch<ChangeAction>({
                            type: 'exhibitInfoPage/change',
                            payload: {
                              pCustomAttrs: exhibitInfoPage.pCustomAttrs.filter((pCustomAttr) => {
                                return pc.key !== pCustomAttr.key;
                              }),
                            },
                          });
                          dispatch<UpdateRewriteAction>({
                            type: 'exhibitInfoPage/updateRewrite',
                          });
                        }}
                      />
                    </Space>)
                }
              </div>
              <div style={{height: 5}}/>
              {
                (pc.option && pc.option.length > 0)
                  ? (<FSelect
                    className={styles.FSelect}
                    value={pc.value}
                    dataSource={pc.option.map((d) => ({value: d, title: d}))}
                    onChange={(value) => {
                      onChangeCustomAttrs({key: pc.key, value: value}, true);
                    }}
                  />)
                  : (<FInput
                    className={styles.FInput}
                    value={pc.newValue}
                    errorText={pc.newValueError}
                    onChange={(e) => {
                      onChangeCustomAttrs({key: pc.key, value: e.target.value});
                    }}
                    onBlur={() => dispatch<UpdateRewriteAction>({
                      type: 'exhibitInfoPage/updateRewrite',
                    })}
                  />)
              }
            </div>))
          }

        </div>
        <div style={{height: 20}}/>
        <Space className={styles.addCustomTitle}>
          <FCircleButton
            theme="text"
            onClick={() => dispatch<ChangeAction>({
              type: 'exhibitInfoPage/change',
              payload: {
                pAddCustomModalVisible: true,
                pAddCustomKey: '',
                pAddCustomKeyError: '',
                pAddCustomValue: '',
                pAddCustomValueError: '',
                pAddCustomDescription: '',
                pAddCustomDescriptionError: '',
              },
            })}
          />
          <span>添加自定义选项</span>
        </Space>
      </>)
    }

    <div style={{height: 30}}/>
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <FTextButton onClick={() => {
        dispatch<ChangeAction>({
          type: 'exhibitInfoPage/change',
          payload: {
            settingUnfold: !exhibitInfoPage.settingUnfold,
          },
        });
      }}>{exhibitInfoPage.settingUnfold ? <>收起 <FDoubleUp/></> : <>更多 <FDoubleDown/></>}</FTextButton>
    </div>

    <FModal
      title={'添加自定义选项'}
      width={560}
      visible={exhibitInfoPage.pAddCustomModalVisible || !!exhibitInfoPage.pCustomAttrs.find((pca) => pca.isEditing)}
      okText={'添加'}
      okButtonProps={{
        disabled:
          !!exhibitInfoPage.pAddCustomKeyError || exhibitInfoPage.pAddCustomKey === ''
          || !!exhibitInfoPage.pAddCustomValueError || exhibitInfoPage.pAddCustomValue === ''
          || !!exhibitInfoPage.pAddCustomDescriptionError
      }}
      onCancel={() => dispatch<ChangeAction>({
        type: 'exhibitInfoPage/change',
        payload: {
          pAddCustomModalVisible: false,
          pCustomAttrs: exhibitInfoPage.pCustomAttrs.map((pCustomAttr) => ({
            ...pCustomAttr,
            isEditing: false,
          })),
        },
      })}
      onOk={() => {
        const editing = exhibitInfoPage.pCustomAttrs.find((pca) => pca.isEditing);
        if (editing) {
          dispatch<ChangeAction>({
            type: 'exhibitInfoPage/change',
            payload: {
              pCustomAttrs: exhibitInfoPage.pCustomAttrs
                // .filter((pCustomAttr) => pCustomAttr.key !== exhibitInfoPage.pAddCustomKey)
                .map<ExhibitInfoPageModelState['pCustomAttrs'][number]>((pCustomAtt) => {
                  if (!pCustomAtt.isEditing) {
                    return pCustomAtt;
                  }
                  return {
                    ...pCustomAtt,
                    key: exhibitInfoPage.pAddCustomKey,
                    value: exhibitInfoPage.pAddCustomValue,
                    newValue: exhibitInfoPage.pAddCustomValue,
                    newValueError: '',
                    remark: exhibitInfoPage.pAddCustomDescription,
                    isEditing: false,
                  };
                }),
            }
          });
        } else {
          dispatch<ChangeAction>({
            type: 'exhibitInfoPage/change',
            payload: {
              pCustomAttrs: [
                ...exhibitInfoPage.pCustomAttrs
                  .filter((pCustomAttr) => pCustomAttr.key !== exhibitInfoPage.pAddCustomKey),
                {
                  key: exhibitInfoPage.pAddCustomKey,
                  value: exhibitInfoPage.pAddCustomValue,
                  newValue: exhibitInfoPage.pAddCustomValue,
                  newValueError: '',
                  remark: exhibitInfoPage.pAddCustomDescription,
                  isEditing: false,
                }
              ],
              pAddCustomModalVisible: false,
            },
          });
        }
        dispatch<UpdateRewriteAction>({
          type: 'exhibitInfoPage/updateRewrite',
        });
      }}
    >
      <div className={styles.modalBody}>
        <div className={styles.modalBodyTitle}>
          <i/>
          <div style={{width: 5}}/>
          <FTitleText type="form">key</FTitleText>
        </div>
        <div style={{height: 5}}/>
        <FInput
          className={styles.modalBodyInput}
          value={exhibitInfoPage.pAddCustomKey}
          errorText={exhibitInfoPage.pAddCustomKeyError}
          onChange={(e) => {
            const baseKeys: string[] = exhibitInfoPage.pBaseAttrs.map<string>((pb) => pb.key);
            const customKeys: string[] = exhibitInfoPage.pCustomAttrs
              .filter((pc) => !pc.isEditing)
              .map<string>((pc) => pc.key);
            const value: string = e.target.value;
            let pAddCustomKeyError: string = '';
            if (!/^[a-zA-Z0-9_]{1,20}$/.test(value)) {
              pAddCustomKeyError = `需要符合正则^[a-zA-Z0-9_]{1,20}$`;
            } else if ([...baseKeys, ...customKeys].includes(value)) {
              pAddCustomKeyError = 'key不能与基础属性和其他自定义属性相同';
            }
            dispatch<ChangeAction>({
              type: 'exhibitInfoPage/change',
              payload: {
                pAddCustomKey: value,
                pAddCustomKeyError: pAddCustomKeyError,
              },
            });
          }}
        />
        <div style={{height: 20}}/>
        <div className={styles.modalBodyTitle}>
          <i/>
          <div style={{width: 5}}/>
          <FTitleText type="form">value</FTitleText>
        </div>
        <div style={{height: 5}}/>
        <FInput
          className={styles.modalBodyInput}
          value={exhibitInfoPage.pAddCustomValue}
          errorText={exhibitInfoPage.pAddCustomValueError}
          onChange={(e) => {
            const value: string = e.target.value;
            dispatch<ChangeAction>({
              type: 'exhibitInfoPage/change',
              payload: {
                pAddCustomValue: value,
                pAddCustomValueError: (value.length > 30 || value === '') ? '1~30个字符' : '',
              },
            });
          }}
        />
        <div style={{height: 20}}/>
        <div>
          <FTitleText type="form">属性说明</FTitleText>
        </div>
        <div style={{height: 5}}/>
        <FInput
          className={styles.modalBodyInput}
          value={exhibitInfoPage.pAddCustomDescription}
          errorText={exhibitInfoPage.pAddCustomDescriptionError}
          onChange={(e) => {
            const value: string = e.target.value;
            dispatch<ChangeAction>({
              type: 'exhibitInfoPage/change',
              payload: {
                pAddCustomDescription: value,
                pAddCustomDescriptionError: (value.length > 50) ? '0~50个字符' : '',
              },
            });
          }}
        />
      </div>
    </FModal>
  </>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Setting);
