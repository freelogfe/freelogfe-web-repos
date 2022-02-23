import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import { Space } from 'antd';
import { FDelete, FEdit, FRedo, FSwap } from '@/components/FIcons';
import { FCircleBtn, FTextBtn } from '@/components/FButton';
import {
  OnBlur_Side_Exhibit_EditDeleteAttrInput_Action,
  OnBlur_Side_Exhibit_OnlyEditAttrInput_Action,
  OnBlur_Side_Exhibit_OnlyEditAttrSelect_Action,
  OnCancel_CustomOptionDrawer_Action,
  OnCancel_CustomOptionsDrawer_Action,
  OnChange_Side_Exhibit_OnlyEditAttrInput_Action,
  OnChange_Side_Exhibit_OnlyEditAttrSelect_Action,
  OnChange_Side_Exhibit_Version_Action,
  OnClick_DeleteAttrBtn_Action,
  OnClick_Side_Exhibit_OnlyEditAttrInputOrSelect_ResetBtn_Action,
  OnConfirm_CustomOptionDrawer_Action,
  OnConfirm_CustomOptionsDrawer_Action,
  OnHandleAttrModalAction,
} from '@/models/informExhibitInfoPage';
import FInput from '@/components/FInput';
import { connect, Dispatch } from 'dva';
import { ConnectState, InformExhibitInfoPageModelState } from '@/models/connect';
import FDropdownMenu from '@/components/FDropdownMenu';
import FCustomOptionsEditorDrawer from '@/components/FCustomOptionsEditorDrawer';
import FCustomOptionEditorDrawer from '@/components/FCustomOptionEditorDrawer';
import FSelect from '@/components/FSelect';

interface SettingProps {
  dispatch: Dispatch;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
}

function Setting({ dispatch, informExhibitInfoPage }: SettingProps) {

  return (<>
    <FContentText
      text={'高级设置'}
      type='highlight'
    />

    <div style={{ height: 20 }} />

    {
      informExhibitInfoPage.side_Exhibit_AllVersions.length > 0 && (<>


        <FTitleText text={'展示版本'} type='h4' />
        <div style={{ height: 15 }} />
        <FDropdownMenu
          options={informExhibitInfoPage.side_Exhibit_AllVersions.map((av: string) => ({ value: av, text: av }))}
          onChange={(value) => {
            dispatch<OnChange_Side_Exhibit_Version_Action>({
              type: 'informExhibitInfoPage/onChange_Side_Exhibit_Version',
              payload: {
                value: value,
              },
            });
          }}
        >
          <Space style={{ cursor: 'pointer' }} size={15}><FContentText
            text={informExhibitInfoPage.side_Exhibit_Version} /><FSwap /></Space>
        </FDropdownMenu>
        <div style={{ height: 30 }} />
      </>)
    }

    {/*{*/}
    {/*  informExhibitInfoPage.settingUnfold && (<>*/}


    <FTitleText text={'基础属性'} type='h4' />
    <div style={{ height: 15 }} />
    <div className={styles.attr}>
      <table>
        <tbody>
        {
          informExhibitInfoPage.side_Exhibit_OnlyReadAttrs.map((pb) => (<tr key={pb.theKey}>
            <td><FContentText style={{ width: 80 }} singleRow text={pb.theKey} /></td>
            <td><FContentText style={{ width: 100 }} singleRow text={pb.value} /></td>
          </tr>))
        }
        </tbody>
      </table>
    </div>
    <div style={{ height: 30 }} />

    <FTitleText
      text={'自定义选项'}
      type='h4'
    />

    <div style={{ height: 15 }} />

    <div className={styles.options}>
      {
        informExhibitInfoPage.side_Exhibit_OnlyEditAttrs.map((pc) => (<div key={pc.theKey}>
          <div className={styles.optionTitle}>
            <FContentText text={pc.theKey} />

            <Space size={10}>
              <FTextBtn
                type='primary'
                onClick={() => {
                  dispatch<OnClick_Side_Exhibit_OnlyEditAttrInputOrSelect_ResetBtn_Action>({
                    type: 'informExhibitInfoPage/onClick_Side_Exhibit_OnlyEditAttrInputOrSelect_ResetBtn',
                    payload: {
                      theKey: pc.theKey,
                    },
                  });

                }}
              ><FRedo /></FTextBtn>

            </Space>

          </div>
          <div style={{ height: 5 }} />
          {
            pc.selectOptions.length > 0
              ? (<FSelect
                className={styles.FSelect}
                value={pc.theValue}
                dataSource={pc.selectOptions.map((d) => ({ value: d, title: d }))}
                onChange={(value: string) => {
                  // onChangeCustomAttrs({ key: pc.key, value: value }, true);
                  dispatch<OnChange_Side_Exhibit_OnlyEditAttrSelect_Action>({
                    type: 'informExhibitInfoPage/onChange_Side_Exhibit_OnlyEditAttrSelect',
                    payload: {
                      theKey: pc.theKey,
                      theValue: value,
                    },
                  });
                }}
                onBlur={() => {
                  dispatch<OnBlur_Side_Exhibit_OnlyEditAttrSelect_Action>({
                    type: 'informExhibitInfoPage/onBlur_Side_Exhibit_OnlyEditAttrSelect',
                    payload: {
                      theKey: pc.theKey,
                      theValue: pc.theValue,
                      theDescription: pc.remark,
                    },
                  });
                }}
              />)
              : (<FInput
                className={styles.FInput}
                value={pc.theValue}
                errorText={pc.theValueError}
                onChange={(e) => {
                  dispatch<OnChange_Side_Exhibit_OnlyEditAttrInput_Action>({
                    type: 'informExhibitInfoPage/onChange_Side_Exhibit_OnlyEditAttrInput',
                    payload: {
                      theKey: pc.theKey,
                      theValue: e.target.value,
                    },
                  });
                }}
                onBlur={(event) => {
                  // console.log(pc.theKey, 'pc.theKeypc.theKeypc.theKeypc.theKey');
                  dispatch<OnBlur_Side_Exhibit_OnlyEditAttrInput_Action>({
                    type: 'informExhibitInfoPage/onBlur_Side_Exhibit_OnlyEditAttrInput',
                    payload: {
                      theKey: pc.theKey,
                      theValue: pc.theValue,
                      theDescription: pc.remark,
                    },
                  });
                }}
              />)
          }

        </div>))
      }

      {
        informExhibitInfoPage.side_Exhibit_EditDeleteAttrs.map((pc) => (<div key={pc.theKey}>
          <div className={styles.optionTitle}>
            <FContentText text={pc.theKey} />

            <Space size={10}>
              <FTextBtn
                type='primary'
                onClick={() => {
                  dispatch<OnHandleAttrModalAction>({
                    type: 'informExhibitInfoPage/onHandleAttrModal',
                    payload: {
                      type: 'edit',
                      theKey: pc.theKey,
                    },
                  });
                }}
              ><FEdit /></FTextBtn>
              <FDelete
                style={{ color: '#EE4040', cursor: 'pointer' }}
                onClick={() => {
                  dispatch<OnClick_DeleteAttrBtn_Action>({
                    type: 'informExhibitInfoPage/onClick_DeleteAttrBtn',
                    payload: {
                      theKey: pc.theKey,
                    },
                  });
                }}
              />
            </Space>

          </div>
          <div style={{ height: 5 }} />
          <FInput
            className={styles.FInput}
            value={pc.theValue}
            errorText={pc.theValueError}
            onChange={(e) => {
              dispatch<OnChange_Side_Exhibit_OnlyEditAttrInput_Action>({
                type: 'informExhibitInfoPage/onChange_Side_Exhibit_OnlyEditAttrInput',
                payload: {
                  theKey: pc.theKey,
                  theValue: e.target.value,
                },
              });
            }}
            onBlur={(event) => {
              dispatch<OnBlur_Side_Exhibit_EditDeleteAttrInput_Action>({
                type: 'informExhibitInfoPage/onBlur_Side_Exhibit_EditDeleteAttrInput',
                payload: {
                  theKey: pc.theKey,
                  theValue: pc.theValue,
                  theDescription: pc.remark,
                },
              });
            }}
          />
        </div>))
      }
    </div>
    <div style={{ height: 20 }} />
    <Space className={styles.addCustomTitle}>
      <FCircleBtn
        // type='transparent'
        size='small'
        onClick={() => {
          dispatch<OnHandleAttrModalAction>({
            type: 'informExhibitInfoPage/onHandleAttrModal',
            payload: {
              type: 'add',
            },
          });
        }}
      />
      <span
        style={{ cursor: 'pointer', display: 'inline-block' }}
        onClick={() => {
          dispatch<OnHandleAttrModalAction>({
            type: 'informExhibitInfoPage/onHandleAttrModal',
            payload: {
              type: 'add',
            },
          });
        }}
      >添加自定义选项</span>
    </Space>

    <FCustomOptionsEditorDrawer
      visible={informExhibitInfoPage.side_CustomOptionsDrawer_Visible}
      disabledKeys={[
        ...informExhibitInfoPage.side_Exhibit_OnlyReadAttrs.map((or) => or.theKey),
        ...informExhibitInfoPage.side_Exhibit_OnlyEditAttrs.map((oe) => oe.theKey),
        ...informExhibitInfoPage.side_Exhibit_EditDeleteAttrs.map((ed) => ed.theKey),
      ]}
      hideTypeSelect
      onCancel={() => {
        dispatch<OnCancel_CustomOptionsDrawer_Action>({
          type: 'informExhibitInfoPage/onCancel_CustomOptionsDrawer',
        });
      }}
      onConfirm={(value) => {
        dispatch<OnConfirm_CustomOptionsDrawer_Action>({
          type: 'informExhibitInfoPage/onConfirm_CustomOptionsDrawer',
          payload: {
            value: value,
          },
        });
      }}
    />

    <FCustomOptionEditorDrawer
      visible={informExhibitInfoPage.side_CustomOptionDrawer_Visible}
      dataSource={{
        key: informExhibitInfoPage.side_CustomOptionDrawer_DataSource?.key || '',
        value: informExhibitInfoPage.side_CustomOptionDrawer_DataSource?.value || '',
        description: informExhibitInfoPage.side_CustomOptionDrawer_DataSource?.description || '',
        valueType: 'input',
      }}
      disabledKeyInput
      disabledValueTypeSelect
      hideValueTypeSelect
      onConfirm={(value) => {
        dispatch<OnConfirm_CustomOptionDrawer_Action>({
          type: 'informExhibitInfoPage/onConfirm_CustomOptionDrawer',
          payload: {
            value: value,
          },
        });
      }}
      onCancel={() => {
        dispatch<OnCancel_CustomOptionDrawer_Action>({
          type: 'informExhibitInfoPage/onCancel_CustomOptionDrawer',
        });
      }}
    />
    {/*  </>)*/}
    {/*}*/}

    {/*<div style={{height: 30}}/>*/}
    {/*<div style={{display: 'flex', justifyContent: 'center'}}>*/}
    {/*  <FTextButton onClick={() => {*/}
    {/*    dispatch<ChangeAction>({*/}
    {/*      type: 'informExhibitInfoPage/change',*/}
    {/*      payload: {*/}
    {/*        settingUnfold: !informExhibitInfoPage.settingUnfold,*/}
    {/*      },*/}
    {/*    });*/}
    {/*  }}>{informExhibitInfoPage.settingUnfold ? <>收起 <FDoubleUp/></> : <>更多 <FDoubleDown/></>}</FTextButton>*/}
    {/*</div>*/}

    {/*<FModal*/}
    {/*  // title={'添加自定义选项'}*/}
    {/*  title={informExhibitInfoPage.pCustomModalTitle}*/}
    {/*  width={560}*/}
    {/*  visible={informExhibitInfoPage.pCustomModalVisible}*/}
    {/*  okText={'添加'}*/}
    {/*  okButtonProps={{*/}
    {/*    disabled: informExhibitInfoPage.pCustomModalConfirmButtonDisabled*/}
    {/*  }}*/}
    {/*  onCancel={() => {*/}
    {/*    dispatch<OnCancelHandleAttrModalAction>({*/}
    {/*      type: 'informExhibitInfoPage/onCancelHandleAttrModal',*/}
    {/*    });*/}
    {/*  }}*/}
    {/*  onOk={() => {*/}
    {/*    dispatch<OnClickAttrModalConfirmBtnAction>({*/}
    {/*      type: 'informExhibitInfoPage/onClickAttrModalConfirmBtn',*/}
    {/*    });*/}
    {/*  }}*/}
    {/*>*/}
    {/*  <div className={styles.modalBody}>*/}
    {/*    <div className={styles.modalBodyTitle}>*/}
    {/*      <i/>*/}
    {/*      <div style={{width: 5}}/>*/}
    {/*      <FTitleText type="h4">key</FTitleText>*/}
    {/*    </div>*/}
    {/*    <div style={{height: 5}}/>*/}
    {/*    <FInput*/}
    {/*      disabled={informExhibitInfoPage.pCustomKeyDisabled}*/}
    {/*      className={styles.modalBodyInput}*/}
    {/*      value={informExhibitInfoPage.pCustomKey}*/}
    {/*      errorText={informExhibitInfoPage.pCustomKeyError}*/}
    {/*      onChange={(e) => {*/}
    {/*        dispatch<OnAttrModalChangeAction>({*/}
    {/*          type: 'informExhibitInfoPage/onAttrModalChange',*/}
    {/*          payload: {*/}
    {/*            theKey: e.target.value,*/}
    {/*          },*/}
    {/*        });*/}
    {/*      }}*/}
    {/*    />*/}
    {/*    <div style={{height: 20}}/>*/}
    {/*    <div className={styles.modalBodyTitle}>*/}
    {/*      <i/>*/}
    {/*      <div style={{width: 5}}/>*/}
    {/*      <FTitleText type="h4">value</FTitleText>*/}
    {/*    </div>*/}
    {/*    <div style={{height: 5}}/>*/}
    {/*    <FInput*/}
    {/*      className={styles.modalBodyInput}*/}
    {/*      value={informExhibitInfoPage.pCustomValue}*/}
    {/*      errorText={informExhibitInfoPage.pCustomValueError}*/}
    {/*      onChange={(e) => {*/}
    {/*        dispatch<OnAttrModalChangeAction>({*/}
    {/*          type: 'informExhibitInfoPage/onAttrModalChange',*/}
    {/*          payload: {*/}
    {/*            value: e.target.value,*/}
    {/*          },*/}
    {/*        });*/}
    {/*      }}*/}
    {/*    />*/}
    {/*    <div style={{height: 20}}/>*/}
    {/*    <div>*/}
    {/*      <FTitleText type="h4">属性说明</FTitleText>*/}
    {/*    </div>*/}
    {/*    <div style={{height: 5}}/>*/}
    {/*    <FInput*/}
    {/*      className={styles.modalBodyInput}*/}
    {/*      value={informExhibitInfoPage.pCustomDescription}*/}
    {/*      errorText={informExhibitInfoPage.pCustomDescriptionError}*/}
    {/*      onChange={(e) => {*/}
    {/*        dispatch<OnAttrModalChangeAction>({*/}
    {/*          type: 'informExhibitInfoPage/onAttrModalChange',*/}
    {/*          payload: {*/}
    {/*            remark: e.target.value,*/}
    {/*          },*/}
    {/*        });*/}
    {/*      }}*/}
    {/*    />*/}
    {/*  </div>*/}
    {/*</FModal>*/}
  </>);
}

export default connect(({ informExhibitInfoPage }: ConnectState) => ({
  informExhibitInfoPage,
}))(Setting);
