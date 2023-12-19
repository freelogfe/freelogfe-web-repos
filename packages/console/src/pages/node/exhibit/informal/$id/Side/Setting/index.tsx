import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
// import { FRedo, FSwap } from '@/components/FIcons';
import {
  OnBlur_Side_Exhibit_EditDeleteAttrInput_Action,
  OnBlur_Side_Exhibit_OnlyEditAttrInput_Action,
  OnBlur_Side_Exhibit_OnlyEditAttrSelect_Action,
  OnCancel_CustomOptionDrawer_Action,
  OnCancel_CustomOptionsDrawer_Action, OnChange_Side_Exhibit_EditDeleteAttrInput_Action,
  OnChange_Side_Exhibit_OnlyEditAttrInput_Action,
  OnChange_Side_Exhibit_OnlyEditAttrSelect_Action,
  OnChange_Side_Exhibit_Version_Action, OnClick_Side_Exhibit_EditDeleteAttr_DeleteBtn_Action,
  // OnClick_DeleteAttrBtn_Action,
  OnClick_Side_Exhibit_OnlyEditAttrInputOrSelect_ResetBtn_Action,
  OnConfirm_CustomOptionDrawer_Action,
  OnConfirm_CustomOptionsDrawer_Action,
  OnHandleAttrModalAction,
} from '@/models/informExhibitInfoPage';
import FInput from '@/components/FInput';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, InformExhibitInfoPageModelState } from '@/models/connect';
import FDropdownMenu from '@/components/FDropdownMenu';
import FCustomOptionsEditorDrawer from '@/components/FCustomOptionsEditorDrawer';
import FCustomOptionEditorDrawer from '@/components/FCustomOptionEditorDrawer';
import FSelect from '@/components/FSelect';
import fConfirmModal from '@/components/fConfirmModal';
import FComponentsLib from '@freelog/components-lib';
import FOverflowTooltip from '@/components/FOverflowTooltip';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';

interface SettingProps {
  dispatch: Dispatch;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
}

function Setting({ dispatch, informExhibitInfoPage }: SettingProps) {

  return (<>
    <FComponentsLib.FContentText
      text={'高级设置'}
      type='highlight'
    />

    <div style={{ height: 20 }} />

    {
      informExhibitInfoPage.side_Exhibit_AllVersions.length > 0 && (<>


        <FComponentsLib.FTitleText text={'展示版本'} type='h4' />
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
          <Space style={{ cursor: 'pointer' }} size={15}><FComponentsLib.FContentText
            text={informExhibitInfoPage.side_Exhibit_Version} /><FComponentsLib.FIcons.FSwap /></Space>
        </FDropdownMenu>
        <div style={{ height: 30 }} />
      </>)
    }

    <FComponentsLib.FTitleText text={'基础属性'} type='h4' />
    <div style={{ height: 15 }} />
    <div className={styles.attr}>
      <table>
        <tbody>
        {
          informExhibitInfoPage.side_Exhibit_OnlyReadAttrs.map((pb) => (<tr key={pb.theKey}>
            {/*<td><FComponentsLib.FContentText style={{ width: 80 }} singleRow text={pb.theKey} /></td>*/}
            <td><FOverflowTooltip
              text={pb.theKey}
              style={{
                fontWeight: 400,
                lineHeight: '20px',
                color: '#222',
                fontSize: 14,
                maxWidth: 90,
              }}
            /></td>
            {/*<td><FComponentsLib.FContentText style={{ width: 100 }} singleRow text={pb.value} /></td>*/}
            <td><FOverflowTooltip
              text={pb.value}
              style={{
                fontWeight: 400,
                lineHeight: '20px',
                color: '#222',
                fontSize: 14,
                maxWidth: 90,
              }}
            /></td>
          </tr>))
        }
        </tbody>
      </table>
    </div>
    <div style={{ height: 30 }} />

    <FComponentsLib.FTitleText
      text={'自定义选项'}
      type='h4'
    />

    <div style={{ height: 15 }} />

    <div className={styles.options}>
      {
        informExhibitInfoPage.side_Exhibit_OnlyEditAttrs.map((pc) => (<div key={pc.theKey}>
          <div className={styles.optionTitle}>
            <FComponentsLib.FContentText text={pc.theKey} />

            <Space size={10}>
              <FComponentsLib.FTextBtn
                type='primary'
                onClick={() => {
                  dispatch<OnClick_Side_Exhibit_OnlyEditAttrInputOrSelect_ResetBtn_Action>({
                    type: 'informExhibitInfoPage/onClick_Side_Exhibit_OnlyEditAttrInputOrSelect_ResetBtn',
                    payload: {
                      theKey: pc.theKey,
                    },
                  });

                }}
              ><FComponentsLib.FIcons.FRedo /></FComponentsLib.FTextBtn>

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
            <FComponentsLib.FContentText text={pc.theKey} />

            <Space size={10}>
              <FComponentsLib.FTextBtn
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
              ><FComponentsLib.FIcons.FEdit /></FComponentsLib.FTextBtn>
              <FComponentsLib.FIcons.FDelete
                style={{ color: '#EE4040', cursor: 'pointer' }}
                onClick={async () => {
                  const bool: boolean = await fPromiseModalConfirm({
                    title: '提示',
                    description: '一旦删除则无法恢复，确认删除吗？',
                  });
                  if (bool) {
                    dispatch<OnClick_Side_Exhibit_EditDeleteAttr_DeleteBtn_Action>({
                      type: 'informExhibitInfoPage/onClick_Side_Exhibit_EditDeleteAttr_DeleteBtn',
                      payload: {
                        theKey: pc.theKey,
                      },
                    });
                  }
                  // fConfirmModal({
                  //   message: '一旦删除则无法恢复，确认删除吗？',
                  //   onOk() {
                  //     dispatch<OnClick_Side_Exhibit_EditDeleteAttr_DeleteBtn_Action>({
                  //       type: 'informExhibitInfoPage/onClick_Side_Exhibit_EditDeleteAttr_DeleteBtn',
                  //       payload: {
                  //         theKey: pc.theKey,
                  //       },
                  //     });
                  //   },
                  // });
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
              dispatch<OnChange_Side_Exhibit_EditDeleteAttrInput_Action>({
                type: 'informExhibitInfoPage/onChange_Side_Exhibit_EditDeleteAttrInput',
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
      <FComponentsLib.FCircleBtn
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
  </>);
}

export default connect(({ informExhibitInfoPage }: ConnectState) => ({
  informExhibitInfoPage,
}))(Setting);
