import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from "@/components/FText";
import {Space} from "antd";
import {FDelete, FEdit, FRedo, FSwap} from "@/components/FIcons";
import {FCircleBtn, FTextBtn} from "@/components/FButton";
import {
  OnAttrBlurAction,
  OnAttrModalChangeAction,
  OnCancelHandleAttrModalAction,
  OnChangeAttrsAction,
  OnChangePVersionAction,
  OnClickAttrModalConfirmBtnAction,
  OnClickDeleteAttrAction,
  OnClickResetAttrAction,
  OnHandleAttrModalAction,
} from "@/models/informExhibitInfoPage";
import FInput from "@/components/FInput";
import {connect, Dispatch} from "dva";
import {ConnectState, InformExhibitInfoPageModelState} from "@/models/connect";
import FModal from "@/components/FModal";
import FDropdownMenu from "@/components/FDropdownMenu";

interface SettingProps {
  dispatch: Dispatch;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
}

function Setting({dispatch, informExhibitInfoPage}: SettingProps) {

  return (<>
    <FContentText
      text={'高级设置'}
      type="highlight"
    />

    <div style={{height: 20}}/>

    <FTitleText text={'展示版本'} type="h4"/>
    <div style={{height: 15}}/>
    <FDropdownMenu
      options={informExhibitInfoPage.pAllVersions.map((av: string) => ({value: av, text: av}))}
      onChange={(value) => {
        dispatch<OnChangePVersionAction>({
          type: 'informExhibitInfoPage/onChangePVersion',
          payload: {
            value: value,
          },
        });
      }}
    >
      <Space style={{cursor: 'pointer'}} size={15}><FContentText text={informExhibitInfoPage.pVersion}/><FSwap/></Space>
    </FDropdownMenu>

    {/*{*/}
    {/*  informExhibitInfoPage.settingUnfold && (<>*/}
    <div style={{height: 30}}/>

    <FTitleText text={'基础属性'} type="h4"/>
    <div style={{height: 15}}/>
    <div className={styles.attr}>
      <table>
        <tbody>
        {
          informExhibitInfoPage.pOnlyReadAttrs.map((pb) => (<tr key={pb.theKey}>
            <td><FContentText text={pb.theKey}/></td>
            <td><FContentText text={pb.value}/></td>
          </tr>))
        }
        </tbody>
      </table>
    </div>
    <div style={{height: 30}}/>

    <FTitleText
      text={'自定义选项'}
      type="h4"
    />

    <div style={{height: 15}}/>

    <div className={styles.options}>
      {
        informExhibitInfoPage.pOnlyEditAttrs.map((pc) => (<div key={pc.theKey}>
          <div className={styles.optionTitle}>
            <FContentText text={pc.theKey}/>

            <Space size={10}>
              <FTextBtn
                type="primary"
                onClick={() => {
                  dispatch<OnClickResetAttrAction>({
                    type: 'informExhibitInfoPage/onClickResetAttr',
                    payload: {
                      theKey: pc.theKey
                    },
                  })

                }}
              ><FRedo/></FTextBtn>

            </Space>

          </div>
          <div style={{height: 5}}/>
          <FInput
            className={styles.FInput}
            value={pc.theValue}
            errorText={pc.theValueError}
            onChange={(e) => {
              dispatch<OnChangeAttrsAction>({
                type: 'informExhibitInfoPage/onChangeAttrs',
                payload: {
                  theKey: pc.theKey,
                  theValue: e.target.value,
                },
              });
            }}
            onBlur={(event) => {
              console.log(pc.theKey, 'pc.theKeypc.theKeypc.theKeypc.theKey');
              dispatch<OnAttrBlurAction>({
                type: 'informExhibitInfoPage/onAttrBlur',
                payload: {
                  theKey: pc.theKey,
                },
              });
            }}
          />
        </div>))
      }

      {
        informExhibitInfoPage.pEditDeleteAttrs.map((pc) => (<div key={pc.theKey}>
          <div className={styles.optionTitle}>
            <FContentText text={pc.theKey}/>

            <Space size={10}>
              <FTextBtn
                type="primary"
                onClick={() => {
                  dispatch<OnHandleAttrModalAction>({
                    type: 'informExhibitInfoPage/onHandleAttrModal',
                    payload: {
                      type: 'edit',
                      theKey: pc.theKey,
                    },
                  });
                }}
              ><FEdit/></FTextBtn>
              <FDelete
                style={{color: '#EE4040', cursor: 'pointer'}}
                onClick={() => {
                  dispatch<OnClickDeleteAttrAction>({
                    type: 'informExhibitInfoPage/onClickDeleteAttr',
                    payload: {
                      theKey: pc.theKey
                    },
                  });
                }}
              />
            </Space>

          </div>
          <div style={{height: 5}}/>
          <FInput
            className={styles.FInput}
            value={pc.theValue}
            errorText={pc.theValueError}
            onChange={(e) => {
              dispatch<OnChangeAttrsAction>({
                type: 'informExhibitInfoPage/onChangeAttrs',
                payload: {
                  theKey: pc.theKey,
                  theValue: e.target.value,
                },
              });
            }}
            onBlur={(event) => {
              dispatch<OnAttrBlurAction>({
                type: 'informExhibitInfoPage/onAttrBlur',
                payload: {
                  theKey: pc.theKey,
                },
              });
            }}
          />
        </div>))
      }
    </div>
    <div style={{height: 20}}/>
    <Space className={styles.addCustomTitle}>
      <FCircleBtn
        type="transparent"
        onClick={() => {
          dispatch<OnHandleAttrModalAction>({
            type: 'informExhibitInfoPage/onHandleAttrModal',
            payload: {
              type: 'add',
            },
          });
        }}
      />
      <span>添加自定义选项</span>
    </Space>
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

    <FModal
      // title={'添加自定义选项'}
      title={informExhibitInfoPage.pCustomModalTitle}
      width={560}
      visible={informExhibitInfoPage.pCustomModalVisible}
      okText={'添加'}
      okButtonProps={{
        disabled: informExhibitInfoPage.pCustomModalConfirmButtonDisabled
      }}
      onCancel={() => {
        dispatch<OnCancelHandleAttrModalAction>({
          type: 'informExhibitInfoPage/onCancelHandleAttrModal',
        });
      }}
      onOk={() => {
        dispatch<OnClickAttrModalConfirmBtnAction>({
          type: 'informExhibitInfoPage/onClickAttrModalConfirmBtn',
        });
      }}
    >
      <div className={styles.modalBody}>
        <div className={styles.modalBodyTitle}>
          <i/>
          <div style={{width: 5}}/>
          <FTitleText type="h4">key</FTitleText>
        </div>
        <div style={{height: 5}}/>
        <FInput
          disabled={informExhibitInfoPage.pCustomKeyDisabled}
          className={styles.modalBodyInput}
          value={informExhibitInfoPage.pCustomKey}
          errorText={informExhibitInfoPage.pCustomKeyError}
          onChange={(e) => {
            dispatch<OnAttrModalChangeAction>({
              type: 'informExhibitInfoPage/onAttrModalChange',
              payload: {
                theKey: e.target.value,
              },
            });
          }}
        />
        <div style={{height: 20}}/>
        <div className={styles.modalBodyTitle}>
          <i/>
          <div style={{width: 5}}/>
          <FTitleText type="h4">value</FTitleText>
        </div>
        <div style={{height: 5}}/>
        <FInput
          className={styles.modalBodyInput}
          value={informExhibitInfoPage.pCustomValue}
          errorText={informExhibitInfoPage.pCustomValueError}
          onChange={(e) => {
            dispatch<OnAttrModalChangeAction>({
              type: 'informExhibitInfoPage/onAttrModalChange',
              payload: {
                value: e.target.value,
              },
            });
          }}
        />
        <div style={{height: 20}}/>
        <div>
          <FTitleText type="h4">属性说明</FTitleText>
        </div>
        <div style={{height: 5}}/>
        <FInput
          className={styles.modalBodyInput}
          value={informExhibitInfoPage.pCustomDescription}
          errorText={informExhibitInfoPage.pCustomDescriptionError}
          onChange={(e) => {
            dispatch<OnAttrModalChangeAction>({
              type: 'informExhibitInfoPage/onAttrModalChange',
              payload: {
                remark: e.target.value,
              },
            });
          }}
        />
      </div>
    </FModal>
  </>);
}

export default connect(({informExhibitInfoPage}: ConnectState) => ({
  informExhibitInfoPage,
}))(Setting);
