import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import FDropdownMenu from '@/components/FDropdownMenu';
import { Space } from 'antd';
import { FDelete, FEdit, FSwap, FRedo, FDoubleDown, FDoubleUp } from '@/components/FIcons';
import { FCircleBtn, FRectBtn, FTextBtn } from '@/components/FButton';
import {
  ChangeAction,
  ChangeVersionAction,
  ExhibitInfoPageModelState, OnBlur_Side_CustomOptions_ValueInput_Action,
  OnBlur_Side_InheritOptions_ValueInput_Action,
  OnCancel_AddCustomOptionsDrawer_Action, OnChange_Side_CustomOptions_ValueInput_Action,
  OnChange_Side_InheritOptions_ValueInput_Action,
  OnClick_Side_AddCustomOptionsBtn_Action, OnClick_Side_CustomOptions_DeleteBtn_Action,
  OnClick_Side_CustomOptions_EditBtn_Action,
  OnClick_Side_InheritOptions_ResetBtn_Action,
  OnConfirm_AddCustomOptionsDrawer_Action,
  UpdateRewriteAction,
} from '@/models/exhibitInfoPage';
import FSelect from '@/components/FSelect';
import FInput from '@/components/FInput';
import { connect, Dispatch } from 'dva';
import { ConnectState } from '@/models/connect';
import FModal from '@/components/FModal';
import FTooltip from '@/components/FTooltip';
import FUtil1 from '@/utils';
import FDrawer from '@/components/FDrawer';
import {
  OnAddExhibitDrawerCancelChangeAction,
  OnAddExhibitDrawerConfirmChangeAction,
} from '@/models/informalNodeManagerPage';
import FCustomOptionsEditorDrawer from '@/components/FCustomOptionsEditorDrawer';
import FCustomOptionEditorDrawer from '@/components/FCustomOptionEditorDrawer';

interface SettingProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Setting({ dispatch, exhibitInfoPage }: SettingProps) {

  // function onChangeCustomAttrs({ key, value }: { key: string; value: string }, update: boolean = false) {
  //   dispatch<ChangeAction>({
  //     type: 'exhibitInfoPage/change',
  //     payload: {
  //       side_CustomOptions: exhibitInfoPage.side_CustomOptions.map((pCustomAttr) => {
  //         if (pCustomAttr.key !== key) {
  //           return pCustomAttr;
  //         }
  //         return {
  //           ...pCustomAttr,
  //           newValue: value,
  //           newValueError: (value.length > 30 || value === '') ? '1~30个字符' : '',
  //         };
  //       }),
  //     },
  //   });
  //   if (update) {
  //     dispatch<UpdateRewriteAction>({
  //       type: 'exhibitInfoPage/updateRewrite',
  //     });
  //   }
  // }

  return (<>
    <FContentText text={FUtil1.I18n.message('advanced_setting')} type='highlight' />
    <div style={{ height: 20 }} />

    <FTitleText text={FUtil1.I18n.message('exhibit_version')} type='h4' />
    <div style={{ height: 15 }} />
    <FDropdownMenu
      options={[...exhibitInfoPage.side_AllVersions].reverse().map((av: string) => ({ value: av, text: av }))}
      onChange={(value) => {
        dispatch<ChangeVersionAction>({
          type: 'exhibitInfoPage/changeVersion',
          payload: value,
        });
      }}
    >
      <Space style={{ cursor: 'pointer' }} size={15}><FContentText
        text={exhibitInfoPage.side_Version} /><FSwap /></Space>
    </FDropdownMenu>

    {
      exhibitInfoPage.side_SettingUnfold && (<>
        <div style={{ height: 30 }} />

        <FTitleText text={FUtil1.I18n.message('resource_property')} type='h4' />
        <div style={{ height: 15 }} />
        <div className={styles.attr}>
          <table>
            <tbody>
            {
              exhibitInfoPage.side_BaseAttrs.map((pb) => (<tr key={pb.key}>
                <td><FContentText text={pb.key} /></td>
                <td><FContentText text={pb.value} /></td>
              </tr>))
            }
            </tbody>
          </table>
        </div>
        <div style={{ height: 30 }} />

        <FTitleText
          text={FUtil1.I18n.message('custom_option')}
          type='h4'
        />

        <div style={{ height: 15 }} />

        <div className={styles.options}>
          {
            exhibitInfoPage.side_InheritOptions.map((io, index) => {
              return (<div key={io.key}>
                <div className={styles.optionTitle}>
                  <FContentText text={io.key} />
                  <FTooltip title={FUtil1.I18n.message('tip_reset_value')}>
                    <div>
                      <FTextBtn
                        onClick={() => {
                          // onChangeCustomAttrs({ key: pc.key, value: pc.defaultValue || '' }, true);
                          dispatch<OnClick_Side_InheritOptions_ResetBtn_Action>({
                            type: 'exhibitInfoPage/onClick_Side_InheritOptions_ResetBtn',
                            payload: {
                              index: index,
                            },
                          });
                        }}
                      ><FRedo /></FTextBtn>
                    </div>
                  </FTooltip>
                </div>
                <div style={{ height: 5 }} />
                {
                  io.type === 'select'
                    ? (<FSelect
                      className={styles.FSelect}
                      value={io.valueInput}
                      dataSource={io.options.map((d) => ({ value: d, title: d }))}
                      onChange={(value: string) => {
                        // onChangeCustomAttrs({ key: pc.key, value: value }, true);
                        dispatch<OnChange_Side_InheritOptions_ValueInput_Action>({
                          type: 'exhibitInfoPage/onChange_Side_InheritOptions_ValueInput',
                          payload: {
                            index: index,
                            value: value,
                          },
                        });
                      }}
                      onBlur={() => {
                        dispatch<OnBlur_Side_InheritOptions_ValueInput_Action>({
                          type: 'exhibitInfoPage/onBlur_Side_InheritOptions_ValueInput',
                          payload: {
                            index: index,
                          },
                        });
                      }}
                    />)
                    : (<FInput
                      className={styles.FInput}
                      value={io.valueInput}
                      errorText={io.valueInputError}
                      onChange={(e) => {
                        // onChangeCustomAttrs({ key: pc.key, value: e.target.value });
                        dispatch<OnChange_Side_InheritOptions_ValueInput_Action>({
                          type: 'exhibitInfoPage/onChange_Side_InheritOptions_ValueInput',
                          payload: {
                            index: index,
                            value: e.target.value,
                          },
                        });
                      }}
                      onBlur={() => {
                        dispatch<OnBlur_Side_InheritOptions_ValueInput_Action>({
                          type: 'exhibitInfoPage/onBlur_Side_InheritOptions_ValueInput',
                          payload: {
                            index: index,
                          },
                        });
                      }}
                    />)
                }
              </div>);
            })
          }
          {
            exhibitInfoPage.side_CustomOptions.map((co, index) => {
              return (<div key={co.key}>
                <div className={styles.optionTitle}>
                  <FContentText text={co.key} />
                  <Space size={10}>
                    <FTooltip title={FUtil1.I18n.message('tips_edit')}>
                      <div>
                        <FTextBtn
                          // theme="primary"
                          onClick={() => {
                            dispatch<OnClick_Side_CustomOptions_EditBtn_Action>({
                              type: 'exhibitInfoPage/onClick_Side_CustomOptions_EditBtn',
                              payload: {
                                index: index,
                              },
                            });
                            // const editing = exhibitInfoPage.side_CustomOptions.find((pCustomAttr) => pCustomAttr.key === pc.key);
                            // if (!editing) {
                            //   return;
                            // }
                            // dispatch<ChangeAction>({
                            //   type: 'exhibitInfoPage/change',
                            //   payload: {
                            //     side_BaseAttrs: exhibitInfoPage.side_CustomOptions.map((pCustomAttr) => ({
                            //       ...pCustomAttr,
                            //       isEditing: pCustomAttr.key === pc.key,
                            //     })),
                            //     // pAddCustomKey: editing.key,
                            //     // pAddCustomValue: editing.value,
                            //     // pAddCustomDescription: editing.remark,
                            //   },
                            // });
                          }}
                        ><FEdit /></FTextBtn>
                      </div>
                    </FTooltip>
                    <FTooltip title={FUtil1.I18n.message('tip_delete_custom_option')}>
                      <div>
                        <FDelete
                          style={{ color: '#EE4040', cursor: 'pointer' }}
                          onClick={() => {
                            dispatch<OnClick_Side_CustomOptions_DeleteBtn_Action>({
                              type: 'exhibitInfoPage/onClick_Side_CustomOptions_DeleteBtn',
                              payload: {
                                index: index,
                              },
                            });
                            // dispatch<ChangeAction>({
                            //   type: 'exhibitInfoPage/change',
                            //   payload: {
                            //     side_CustomOptions: exhibitInfoPage.side_CustomOptions.filter((pCustomAttr) => {
                            //       return pc.key !== pCustomAttr.key;
                            //     }),
                            //   },
                            // });
                            // dispatch<UpdateRewriteAction>({
                            //   type: 'exhibitInfoPage/updateRewrite',
                            // });
                          }}
                        />
                      </div>
                    </FTooltip>
                  </Space>
                </div>
                <div style={{ height: 5 }} />
                <FInput
                  className={styles.FInput}
                  value={co.valueInput}
                  errorText={co.valueInputError}
                  onChange={(e) => {
                    // onChangeCustomAttrs({ key: pc.key, value: e.target.value });
                    dispatch<OnChange_Side_CustomOptions_ValueInput_Action>({
                      type: 'exhibitInfoPage/onChange_Side_CustomOptions_ValueInput',
                      payload: {
                        index: index,
                        value: e.target.value,
                      },
                    });
                  }}
                  onBlur={() => {
                    dispatch<OnBlur_Side_CustomOptions_ValueInput_Action>({
                      type: 'exhibitInfoPage/onBlur_Side_CustomOptions_ValueInput',
                      payload: {
                        index: index,
                      },
                    });
                  }}
                />
              </div>);
            })
          }
        </div>
        <div style={{ height: 20 }} />
        <Space className={styles.addCustomTitle}>
          <FCircleBtn
            // theme="text"
            size='small'
            onClick={() => {
              dispatch<OnClick_Side_AddCustomOptionsBtn_Action>({
                type: 'exhibitInfoPage/onClick_Side_AddCustomOptionsBtn',
              });
            }}
          />
          <span>添加自定义选项</span>
        </Space>
      </>)
    }

    <div style={{ height: 30 }} />
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <FTextBtn
        type='default'
        onClick={() => {
          dispatch<ChangeAction>({
            type: 'exhibitInfoPage/change',
            payload: {
              side_SettingUnfold: !exhibitInfoPage.side_SettingUnfold,
            },
          });
        }}
      >{exhibitInfoPage.side_SettingUnfold ? <>{FUtil1.I18n.message('btn_show_less')}
        <FDoubleUp /></> : <>更多 <FDoubleDown /></>}</FTextBtn>
    </div>

    <FCustomOptionsEditorDrawer
      hideTypeSelect={true}
      visible={exhibitInfoPage.side_CustomOptionsDrawer_Visible}
      // dataSource={exhibitInfoPage.side_CustomOptionsDrawer_DataSource}
      disabledKeys={[
        ...exhibitInfoPage.side_BaseAttrs.map((ba) => ba.key),
        ...exhibitInfoPage.side_InheritOptions.map((io) => io.key),
        ...exhibitInfoPage.side_CustomOptions.map((co) => co.key),
      ]}
      onConfirm={(value) => {
        dispatch<OnConfirm_AddCustomOptionsDrawer_Action>({
          type: 'exhibitInfoPage/onConfirm_AddCustomOptionsDrawer',
          payload: {
            value: value,
          },
        });
      }}
      onCancel={() => {
        dispatch<OnCancel_AddCustomOptionsDrawer_Action>({
          type: 'exhibitInfoPage/onCancel_AddCustomOptionsDrawer',
        });
      }}
    />

    <FCustomOptionEditorDrawer
      keyInput={''}
      keyInputError={''}
      descriptionInput={''}
      descriptionInputError={''}
      typeSelect={'input'}
      valueInput={''}
      valueInputError={''}
      optionsInput={''}
      optionsInputError={''}
    />

    {/*<FDrawer*/}
    {/*  visible={exhibitInfoPage.pAddCustomModalVisible || !!exhibitInfoPage.pCustomAttrs.find((pca) => pca.isEditing)}*/}
    {/*  title={<FTitleText*/}
    {/*    text={exhibitInfoPage.pCustomAttrs.some((pca) => pca.isEditing) ? FUtil1.I18n.message('edit_custom_option') : FUtil1.I18n.message('add_custom_options')}*/}
    {/*    type='popup'*/}
    {/*  />}*/}
    {/*  topRight={<Space size={30}>*/}
    {/*    <FTextBtn type='default' onClick={() => {*/}
    {/*      dispatch<ChangeAction>({*/}
    {/*        type: 'exhibitInfoPage/change',*/}
    {/*        payload: {*/}
    {/*          pAddCustomModalVisible: false,*/}
    {/*          pCustomAttrs: exhibitInfoPage.pCustomAttrs.map((pCustomAttr) => ({*/}
    {/*            ...pCustomAttr,*/}
    {/*            isEditing: false,*/}
    {/*          })),*/}
    {/*        },*/}
    {/*      })*/}
    {/*    }}>{FUtil1.I18n.message('btn_cancel')}</FTextBtn>*/}
    {/*    <FRectBtn*/}
    {/*      disabled={!!exhibitInfoPage.pAddCustomKeyError || exhibitInfoPage.pAddCustomKey === ''*/}
    {/*      || !!exhibitInfoPage.pAddCustomValueError || exhibitInfoPage.pAddCustomValue === ''*/}
    {/*      || !!exhibitInfoPage.pAddCustomDescriptionError}*/}
    {/*      onClick={() => {*/}
    {/*        const editing = exhibitInfoPage.pCustomAttrs.some((pca) => pca.isEditing);*/}
    {/*        if (editing) {*/}
    {/*          dispatch<ChangeAction>({*/}
    {/*            type: 'exhibitInfoPage/change',*/}
    {/*            payload: {*/}
    {/*              pCustomAttrs: exhibitInfoPage.pCustomAttrs*/}
    {/*                // .filter((pCustomAttr) => pCustomAttr.key !== exhibitInfoPage.pAddCustomKey)*/}
    {/*                .map<ExhibitInfoPageModelState['pCustomAttrs'][number]>((pCustomAtt) => {*/}
    {/*                  if (!pCustomAtt.isEditing) {*/}
    {/*                    return pCustomAtt;*/}
    {/*                  }*/}
    {/*                  return {*/}
    {/*                    ...pCustomAtt,*/}
    {/*                    key: exhibitInfoPage.pAddCustomKey,*/}
    {/*                    value: exhibitInfoPage.pAddCustomValue,*/}
    {/*                    newValue: exhibitInfoPage.pAddCustomValue,*/}
    {/*                    newValueError: '',*/}
    {/*                    remark: exhibitInfoPage.pAddCustomDescription,*/}
    {/*                    isEditing: false,*/}
    {/*                  };*/}
    {/*                }),*/}
    {/*            },*/}
    {/*          });*/}
    {/*        } else {*/}
    {/*          dispatch<ChangeAction>({*/}
    {/*            type: 'exhibitInfoPage/change',*/}
    {/*            payload: {*/}
    {/*              pCustomAttrs: [*/}
    {/*                ...exhibitInfoPage.pCustomAttrs*/}
    {/*                  .filter((pCustomAttr) => pCustomAttr.key !== exhibitInfoPage.pAddCustomKey),*/}
    {/*                {*/}
    {/*                  key: exhibitInfoPage.pAddCustomKey,*/}
    {/*                  value: exhibitInfoPage.pAddCustomValue,*/}
    {/*                  newValue: exhibitInfoPage.pAddCustomValue,*/}
    {/*                  newValueError: '',*/}
    {/*                  remark: exhibitInfoPage.pAddCustomDescription,*/}
    {/*                  isEditing: false,*/}
    {/*                },*/}
    {/*              ],*/}
    {/*              pAddCustomModalVisible: false,*/}
    {/*            },*/}
    {/*          });*/}
    {/*        }*/}
    {/*        dispatch<UpdateRewriteAction>({*/}
    {/*          type: 'exhibitInfoPage/updateRewrite',*/}
    {/*        });*/}
    {/*      }}*/}
    {/*      type='primary'*/}
    {/*    >{exhibitInfoPage.pCustomAttrs.some((pca) => pca.isEditing) ? FUtil1.I18n.message('btn_save') : FUtil1.I18n.message('btn_add')}</FRectBtn>*/}
    {/*  </Space>}*/}
    {/*>*/}
    {/*  <div className={styles.modalBody}>*/}
    {/*    <div className={styles.modalBodyTitle}>*/}
    {/*      <i />*/}
    {/*      <div style={{ width: 5 }} />*/}
    {/*      <FTitleText type='h4'>{FUtil1.I18n.message('filed_key')}</FTitleText>*/}
    {/*    </div>*/}
    {/*    <div style={{ height: 5 }} />*/}
    {/*    <FInput*/}
    {/*      className={styles.modalBodyInput}*/}
    {/*      value={exhibitInfoPage.pAddCustomKey}*/}
    {/*      errorText={exhibitInfoPage.pAddCustomKeyError}*/}
    {/*      onChange={(e) => {*/}
    {/*        const baseKeys: string[] = exhibitInfoPage.pBaseAttrs.map<string>((pb) => pb.key);*/}
    {/*        const customKeys: string[] = exhibitInfoPage.pCustomAttrs*/}
    {/*          .filter((pc) => !pc.isEditing)*/}
    {/*          .map<string>((pc) => pc.key);*/}
    {/*        const value: string = e.target.value;*/}
    {/*        let pAddCustomKeyError: string = '';*/}
    {/*        if (!/^[a-zA-Z0-9_]{1,20}$/.test(value)) {*/}
    {/*          pAddCustomKeyError = `需要符合正则^[a-zA-Z0-9_]{1,20}$`;*/}
    {/*        } else if ([...baseKeys, ...customKeys].includes(value)) {*/}
    {/*          pAddCustomKeyError = 'key不能与基础属性和其他自定义属性相同';*/}
    {/*        }*/}
    {/*        dispatch<ChangeAction>({*/}
    {/*          type: 'exhibitInfoPage/change',*/}
    {/*          payload: {*/}
    {/*            pAddCustomKey: value,*/}
    {/*            pAddCustomKeyError: pAddCustomKeyError,*/}
    {/*          },*/}
    {/*        });*/}
    {/*      }}*/}
    {/*    />*/}
    {/*    <div style={{ height: 20 }} />*/}
    {/*    <div className={styles.modalBodyTitle}>*/}
    {/*      <i />*/}
    {/*      <div style={{ width: 5 }} />*/}
    {/*      <FTitleText type='h4'>{FUtil1.I18n.message('filed_value')}</FTitleText>*/}
    {/*    </div>*/}
    {/*    <div style={{ height: 5 }} />*/}
    {/*    <FInput*/}
    {/*      className={styles.modalBodyInput}*/}
    {/*      value={exhibitInfoPage.pAddCustomValue}*/}
    {/*      errorText={exhibitInfoPage.pAddCustomValueError}*/}
    {/*      onChange={(e) => {*/}
    {/*        const value: string = e.target.value;*/}
    {/*        dispatch<ChangeAction>({*/}
    {/*          type: 'exhibitInfoPage/change',*/}
    {/*          payload: {*/}
    {/*            pAddCustomValue: value,*/}
    {/*            pAddCustomValueError: (value.length > 30 || value === '') ? '1~30个字符' : '',*/}
    {/*          },*/}
    {/*        });*/}
    {/*      }}*/}
    {/*    />*/}
    {/*    <div style={{ height: 20 }} />*/}
    {/*    <div>*/}
    {/*      <FTitleText type='h4'>{FUtil1.I18n.message('filed_remark')}</FTitleText>*/}
    {/*    </div>*/}
    {/*    <div style={{ height: 5 }} />*/}
    {/*    <FInput*/}
    {/*      className={styles.modalBodyInput}*/}
    {/*      value={exhibitInfoPage.pAddCustomDescription}*/}
    {/*      errorText={exhibitInfoPage.pAddCustomDescriptionError}*/}
    {/*      onChange={(e) => {*/}
    {/*        const value: string = e.target.value;*/}
    {/*        dispatch<ChangeAction>({*/}
    {/*          type: 'exhibitInfoPage/change',*/}
    {/*          payload: {*/}
    {/*            pAddCustomDescription: value,*/}
    {/*            pAddCustomDescriptionError: (value.length > 50) ? '0~50个字符' : '',*/}
    {/*          },*/}
    {/*        });*/}
    {/*      }}*/}
    {/*    />*/}
    {/*  </div>*/}
    {/*</FDrawer>*/}

    {/*<FModal*/}
    {/*  title={<FTitleText*/}
    {/*    text={exhibitInfoPage.pCustomAttrs.some((pca) => pca.isEditing) ? FUtil1.I18n.message('edit_custom_option') : FUtil1.I18n.message('add_custom_options')}*/}
    {/*    type='popup'*/}
    {/*  />}*/}
    {/*  width={560}*/}
    {/*  // visible={exhibitInfoPage.pAddCustomModalVisible || !!exhibitInfoPage.pCustomAttrs.find((pca) => pca.isEditing)}*/}
    {/*  okText={exhibitInfoPage.pCustomAttrs.some((pca) => pca.isEditing) ? FUtil1.I18n.message('btn_save') : FUtil1.I18n.message('btn_add')}*/}
    {/*  cancelText={FUtil1.I18n.message('btn_cancel')}*/}
    {/*  okButtonProps={{*/}
    {/*    disabled:*/}
    {/*      !!exhibitInfoPage.pAddCustomKeyError || exhibitInfoPage.pAddCustomKey === ''*/}
    {/*      || !!exhibitInfoPage.pAddCustomValueError || exhibitInfoPage.pAddCustomValue === ''*/}
    {/*      || !!exhibitInfoPage.pAddCustomDescriptionError,*/}
    {/*  }}*/}
    {/*  onCancel={() => dispatch<ChangeAction>({*/}
    {/*    type: 'exhibitInfoPage/change',*/}
    {/*    payload: {*/}
    {/*      pAddCustomModalVisible: false,*/}
    {/*      pCustomAttrs: exhibitInfoPage.pCustomAttrs.map((pCustomAttr) => ({*/}
    {/*        ...pCustomAttr,*/}
    {/*        isEditing: false,*/}
    {/*      })),*/}
    {/*    },*/}
    {/*  })}*/}
    {/*  onOk={() => {*/}
    {/*    const editing = exhibitInfoPage.pCustomAttrs.some((pca) => pca.isEditing);*/}
    {/*    if (editing) {*/}
    {/*      dispatch<ChangeAction>({*/}
    {/*        type: 'exhibitInfoPage/change',*/}
    {/*        payload: {*/}
    {/*          pCustomAttrs: exhibitInfoPage.pCustomAttrs*/}
    {/*            // .filter((pCustomAttr) => pCustomAttr.key !== exhibitInfoPage.pAddCustomKey)*/}
    {/*            .map<ExhibitInfoPageModelState['pCustomAttrs'][number]>((pCustomAtt) => {*/}
    {/*              if (!pCustomAtt.isEditing) {*/}
    {/*                return pCustomAtt;*/}
    {/*              }*/}
    {/*              return {*/}
    {/*                ...pCustomAtt,*/}
    {/*                key: exhibitInfoPage.pAddCustomKey,*/}
    {/*                value: exhibitInfoPage.pAddCustomValue,*/}
    {/*                newValue: exhibitInfoPage.pAddCustomValue,*/}
    {/*                newValueError: '',*/}
    {/*                remark: exhibitInfoPage.pAddCustomDescription,*/}
    {/*                isEditing: false,*/}
    {/*              };*/}
    {/*            }),*/}
    {/*        },*/}
    {/*      });*/}
    {/*    } else {*/}
    {/*      dispatch<ChangeAction>({*/}
    {/*        type: 'exhibitInfoPage/change',*/}
    {/*        payload: {*/}
    {/*          pCustomAttrs: [*/}
    {/*            ...exhibitInfoPage.pCustomAttrs*/}
    {/*              .filter((pCustomAttr) => pCustomAttr.key !== exhibitInfoPage.pAddCustomKey),*/}
    {/*            {*/}
    {/*              key: exhibitInfoPage.pAddCustomKey,*/}
    {/*              value: exhibitInfoPage.pAddCustomValue,*/}
    {/*              newValue: exhibitInfoPage.pAddCustomValue,*/}
    {/*              newValueError: '',*/}
    {/*              remark: exhibitInfoPage.pAddCustomDescription,*/}
    {/*              isEditing: false,*/}
    {/*            },*/}
    {/*          ],*/}
    {/*          pAddCustomModalVisible: false,*/}
    {/*        },*/}
    {/*      });*/}
    {/*    }*/}
    {/*    dispatch<UpdateRewriteAction>({*/}
    {/*      type: 'exhibitInfoPage/updateRewrite',*/}
    {/*    });*/}
    {/*  }}*/}
    {/*>*/}
    {/*  <div className={styles.modalBody}>*/}
    {/*    <div className={styles.modalBodyTitle}>*/}
    {/*      <i />*/}
    {/*      <div style={{ width: 5 }} />*/}
    {/*      <FTitleText type='h4'>{FUtil1.I18n.message('filed_key')}</FTitleText>*/}
    {/*    </div>*/}
    {/*    <div style={{ height: 5 }} />*/}
    {/*    <FInput*/}
    {/*      className={styles.modalBodyInput}*/}
    {/*      value={exhibitInfoPage.pAddCustomKey}*/}
    {/*      errorText={exhibitInfoPage.pAddCustomKeyError}*/}
    {/*      onChange={(e) => {*/}
    {/*        const baseKeys: string[] = exhibitInfoPage.pBaseAttrs.map<string>((pb) => pb.key);*/}
    {/*        const customKeys: string[] = exhibitInfoPage.pCustomAttrs*/}
    {/*          .filter((pc) => !pc.isEditing)*/}
    {/*          .map<string>((pc) => pc.key);*/}
    {/*        const value: string = e.target.value;*/}
    {/*        let pAddCustomKeyError: string = '';*/}
    {/*        if (!/^[a-zA-Z0-9_]{1,20}$/.test(value)) {*/}
    {/*          pAddCustomKeyError = `需要符合正则^[a-zA-Z0-9_]{1,20}$`;*/}
    {/*        } else if ([...baseKeys, ...customKeys].includes(value)) {*/}
    {/*          pAddCustomKeyError = 'key不能与基础属性和其他自定义属性相同';*/}
    {/*        }*/}
    {/*        dispatch<ChangeAction>({*/}
    {/*          type: 'exhibitInfoPage/change',*/}
    {/*          payload: {*/}
    {/*            pAddCustomKey: value,*/}
    {/*            pAddCustomKeyError: pAddCustomKeyError,*/}
    {/*          },*/}
    {/*        });*/}
    {/*      }}*/}
    {/*    />*/}
    {/*    <div style={{ height: 20 }} />*/}
    {/*    <div className={styles.modalBodyTitle}>*/}
    {/*      <i />*/}
    {/*      <div style={{ width: 5 }} />*/}
    {/*      <FTitleText type='h4'>{FUtil1.I18n.message('filed_value')}</FTitleText>*/}
    {/*    </div>*/}
    {/*    <div style={{ height: 5 }} />*/}
    {/*    <FInput*/}
    {/*      className={styles.modalBodyInput}*/}
    {/*      value={exhibitInfoPage.pAddCustomValue}*/}
    {/*      errorText={exhibitInfoPage.pAddCustomValueError}*/}
    {/*      onChange={(e) => {*/}
    {/*        const value: string = e.target.value;*/}
    {/*        dispatch<ChangeAction>({*/}
    {/*          type: 'exhibitInfoPage/change',*/}
    {/*          payload: {*/}
    {/*            pAddCustomValue: value,*/}
    {/*            pAddCustomValueError: (value.length > 30 || value === '') ? '1~30个字符' : '',*/}
    {/*          },*/}
    {/*        });*/}
    {/*      }}*/}
    {/*    />*/}
    {/*    <div style={{ height: 20 }} />*/}
    {/*    <div>*/}
    {/*      <FTitleText type='h4'>{FUtil1.I18n.message('filed_remark')}</FTitleText>*/}
    {/*    </div>*/}
    {/*    <div style={{ height: 5 }} />*/}
    {/*    <FInput*/}
    {/*      className={styles.modalBodyInput}*/}
    {/*      value={exhibitInfoPage.pAddCustomDescription}*/}
    {/*      errorText={exhibitInfoPage.pAddCustomDescriptionError}*/}
    {/*      onChange={(e) => {*/}
    {/*        const value: string = e.target.value;*/}
    {/*        dispatch<ChangeAction>({*/}
    {/*          type: 'exhibitInfoPage/change',*/}
    {/*          payload: {*/}
    {/*            pAddCustomDescription: value,*/}
    {/*            pAddCustomDescriptionError: (value.length > 50) ? '0~50个字符' : '',*/}
    {/*          },*/}
    {/*        });*/}
    {/*      }}*/}
    {/*    />*/}
    {/*  </div>*/}
    {/*</FModal>*/}
  </>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Setting);
