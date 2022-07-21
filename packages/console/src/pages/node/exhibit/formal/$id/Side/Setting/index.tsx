import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import FDropdownMenu from '@/components/FDropdownMenu';
import { Space } from 'antd';
import { FDelete, FSwap, FRedo, FDoubleDown, FDoubleUp, FInfo } from '@/components/FIcons';
import {
  ChangeAction,
  ChangeVersionAction,
  ExhibitInfoPageModelState,
  OnBlur_Side_CustomOptions_ValueInput_Action,
  OnBlur_Side_InheritOptions_ValueInput_Action,
  OnCancel_AddCustomOptionsDrawer_Action,
  OnCancel_CustomOptionDrawer_Action,
  OnChange_Side_CustomOptions_ValueInput_Action,
  OnChange_Side_InheritOptions_ValueInput_Action,
  OnClick_Side_AddCustomOptionsBtn_Action,
  OnClick_Side_CustomOptions_DeleteBtn_Action,
  OnClick_Side_CustomOptions_EditBtn_Action,
  OnClick_Side_InheritOptions_ResetBtn_Action,
  OnConfirm_AddCustomOptionsDrawer_Action, OnConfirm_CustomOptionDrawer_Action,
} from '@/models/exhibitInfoPage';
import FSelect from '@/components/FSelect';
import FInput from '@/components/FInput';
import { connect, Dispatch } from 'dva';
import { ConnectState } from '@/models/connect';
import FTooltip from '@/components/FTooltip';
import FCustomOptionsEditorDrawer from '@/components/FCustomOptionsEditorDrawer';
import FCustomOptionEditorDrawer from '@/components/FCustomOptionEditorDrawer';
import fConfirmModal from '@/components/fConfirmModal';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface SettingProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Setting({ dispatch, exhibitInfoPage }: SettingProps) {

  return (<>
    <FContentText text={FI18n.i18nNext.t('advanced_setting')} type='highlight' />
    <div style={{ height: 20 }} />

    <FTitleText text={FI18n.i18nNext.t('exhibit_version')} type='h4' />
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

        <FTitleText text={FI18n.i18nNext.t('resource_property')} type='h4' />
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
          text={FI18n.i18nNext.t('custom_option')}
          type='h4'
        />

        <div style={{ height: 15 }} />

        <div className={styles.options}>
          {
            exhibitInfoPage.side_InheritOptions.map((io, index) => {
              return (<div key={io.key}>
                <div className={styles.optionTitle}>
                  <Space size={10}>
                    <FContentText text={io.key} />
                    {
                      io.description && (<FTooltip
                        title={io.description}
                        color={'#fff'}
                      >
                        <FInfo
                          style={{ cursor: 'pointer', fontSize: 14 }}
                        />
                      </FTooltip>)
                    }
                  </Space>

                  <FTooltip title={FI18n.i18nNext.t('tip_reset_value')}>
                    <div>
                      <FComponentsLib.FTextBtn
                        onClick={() => {
                          // onChangeCustomAttrs({ key: pc.key, value: pc.defaultValue || '' }, true);
                          dispatch<OnClick_Side_InheritOptions_ResetBtn_Action>({
                            type: 'exhibitInfoPage/onClick_Side_InheritOptions_ResetBtn',
                            payload: {
                              index: index,
                            },
                          });
                        }}
                      ><FRedo /></FComponentsLib.FTextBtn>
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
                    : (<div>
                      <FInput
                        className={styles.FInput}
                        value={io.valueInput}
                        // errorText={io.valueInputError}
                        placeholder={'输入自定义选项'}
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
                      />
                      {
                        io.valueInputError !== '' && (<div style={{ color: '#EE4040' }}>{io.valueInputError}</div>)
                      }

                    </div>)
                }
              </div>);
            })
          }
          {
            exhibitInfoPage.side_CustomOptions.map((co, index) => {
              return (<div key={co.key}>
                <div className={styles.optionTitle}>
                  <Space size={10}>
                    <FContentText text={co.key} />
                    {
                      co.description && (<FTooltip
                        title={co.description}
                        color={'#fff'}
                      >
                        <FInfo
                          style={{ cursor: 'pointer', fontSize: 14 }}
                        />
                      </FTooltip>)
                    }
                  </Space>
                  <Space size={10}>
                    <FTooltip title={FI18n.i18nNext.t('tips_edit')}>
                      <div>
                        <FComponentsLib.FTextBtn
                          // theme="primary"
                          onClick={() => {
                            dispatch<OnClick_Side_CustomOptions_EditBtn_Action>({
                              type: 'exhibitInfoPage/onClick_Side_CustomOptions_EditBtn',
                              payload: {
                                index: index,
                              },
                            });
                          }}
                        ><FComponentsLib.FIcons.FEdit /></FComponentsLib.FTextBtn>
                      </div>
                    </FTooltip>
                    <FTooltip title={FI18n.i18nNext.t('tip_delete_custom_option')}>
                      <div>
                        <FDelete
                          style={{ color: '#EE4040', cursor: 'pointer' }}
                          onClick={() => {
                            fConfirmModal({
                              message: '一旦删除则无法恢复，确认删除吗？',
                              onOk() {
                                dispatch<OnClick_Side_CustomOptions_DeleteBtn_Action>({
                                  type: 'exhibitInfoPage/onClick_Side_CustomOptions_DeleteBtn',
                                  payload: {
                                    index: index,
                                  },
                                });
                              },
                            });
                          }}
                        />
                      </div>
                    </FTooltip>
                  </Space>
                </div>
                <div style={{ height: 5 }} />
                <FInput
                  placeholder={FI18n.i18nNext.t('hint_value_null')}
                  className={styles.FInput}
                  value={co.valueInput}
                  // errorText={co.valueInputError}
                  onChange={(e) => {
                    // console.log(e, 'eEEEEeeeeeEEE');
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
                {
                  co.valueInputError !== '' && (<div style={{ color: '#EE4040' }}>{co.valueInputError}</div>)
                }
              </div>);
            })
          }
        </div>
        <div style={{ height: 20 }} />
        <Space className={styles.addCustomTitle}>
          <FComponentsLib.FCircleBtn
            // theme="text"
            size='small'
            onClick={() => {
              dispatch<OnClick_Side_AddCustomOptionsBtn_Action>({
                type: 'exhibitInfoPage/onClick_Side_AddCustomOptionsBtn',
              });
            }}
          />
          <span
            style={{ cursor: 'pointer', display: 'inline-block' }}
            onClick={() => {
              dispatch<OnClick_Side_AddCustomOptionsBtn_Action>({
                type: 'exhibitInfoPage/onClick_Side_AddCustomOptionsBtn',
              });
            }}
          >添加自定义选项</span>
        </Space>
      </>)
    }

    <div style={{ height: 30 }} />
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <FComponentsLib.FTextBtn
        type='default'
        onClick={() => {
          dispatch<ChangeAction>({
            type: 'exhibitInfoPage/change',
            payload: {
              side_SettingUnfold: !exhibitInfoPage.side_SettingUnfold,
            },
          });
        }}
      >{exhibitInfoPage.side_SettingUnfold ? <>{FI18n.i18nNext.t('btn_show_less')}
        <FDoubleUp /></> : <>更多 <FDoubleDown /></>}</FComponentsLib.FTextBtn>
    </div>

    <FCustomOptionsEditorDrawer
      hideTypeSelect
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
      visible={exhibitInfoPage.side_CustomOptionDrawer_Visible}
      disabledKeyInput
      disabledValueTypeSelect
      hideValueTypeSelect
      dataSource={{
        key: exhibitInfoPage.side_CustomOptionDrawer_DataSource?.key || '',
        value: exhibitInfoPage.side_CustomOptionDrawer_DataSource?.value || '',
        description: exhibitInfoPage.side_CustomOptionDrawer_DataSource?.description || '',
        valueType: 'input',
      }}
      onConfirm={(value) => {
        dispatch<OnConfirm_CustomOptionDrawer_Action>({
          type: 'exhibitInfoPage/onConfirm_CustomOptionDrawer',
          payload: {
            value: value,
          },
        });
      }}
      onCancel={() => {
        dispatch<OnCancel_CustomOptionDrawer_Action>({
          type: 'exhibitInfoPage/onCancel_CustomOptionDrawer',
        });
      }}
    />

  </>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Setting);
