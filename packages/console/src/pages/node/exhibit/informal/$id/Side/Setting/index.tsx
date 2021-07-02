import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from "@/components/FText";
import {Space} from "antd";
import {FDelete, FEdit, FRedo, FSwap} from "@/components/FIcons";
import {FCircleBtn, FTextBtn} from "@/components/FButton";
import {
  ChangeAction, OnCancelHandleAttrModalAction, OnHandleAttrModalAction, SyncRulesAction,
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

  function onChangeCustomAttrs({key, value}: { key: string; value: string }, update: boolean = false) {
    // dispatch<ChangeAction>({
    //   type: 'informExhibitInfoPage/change',
    //   payload: {
    //     pCustomAttrs: informExhibitInfoPage.pCustomAttrs.map((pCustomAttr) => {
    //       if (pCustomAttr.key !== key) {
    //         return pCustomAttr;
    //       }
    //       return {
    //         ...pCustomAttr,
    //         newValue: value,
    //         newValueError: (value.length > 30 || value === '') ? '1~30个字符' : '',
    //       };
    //     }),
    //   }
    // });
    // if (update) {
    //   dispatch<UpdateRewriteAction>({
    //     type: 'informExhibitInfoPage/updateRewrite',
    //   });
    // }
  }

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
        // dispatch<ChangeVersionAction>({
        //   type: 'informExhibitInfoPage/changeVersion',
        //   payload: value,
        // });
      }}
    >
      <Space style={{cursor: 'pointer'}} size={15}><FContentText text={'1.1.1'}/><FSwap/></Space>
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
                  // const editing = informExhibitInfoPage.pCustomAttrs.find((pCustomAttr) => pCustomAttr.key === pc.key);
                  // if (!editing) {
                  //   return;
                  // }
                  // dispatch<ChangeAction>({
                  //   type: 'informExhibitInfoPage/change',
                  //   payload: {
                  //     pCustomAttrs: informExhibitInfoPage.pCustomAttrs.map((pCustomAttr) => ({
                  //       ...pCustomAttr,
                  //       isEditing: pCustomAttr.key === pc.key,
                  //     })),
                  //     pAddCustomKey: editing.key,
                  //     pAddCustomValue: editing.value,
                  //     pAddCustomDescription: editing.remark,
                  //   },
                  // });
                }}
              ><FRedo/></FTextBtn>

            </Space>

          </div>
          <div style={{height: 5}}/>
          <FInput
            className={styles.FInput}
            value={pc.value}
            // errorText={pc.newValueError}
            onChange={(e) => {
              onChangeCustomAttrs({key: pc.theKey, value: e.target.value});
            }}
            // onBlur={() => dispatch<UpdateRewriteAction>({
            //   type: 'informExhibitInfoPage/updateRewrite',
            // })}
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
                  // const editing = informExhibitInfoPage.pCustomAttrs.find((pCustomAttr) => pCustomAttr.key === pc.key);
                  // if (!editing) {
                  //   return;
                  // }
                  // dispatch<ChangeAction>({
                  //   type: 'informExhibitInfoPage/change',
                  //   payload: {
                  //     pCustomAttrs: informExhibitInfoPage.pCustomAttrs.map((pCustomAttr) => ({
                  //       ...pCustomAttr,
                  //       isEditing: pCustomAttr.key === pc.key,
                  //     })),
                  //     pAddCustomKey: editing.key,
                  //     pAddCustomValue: editing.value,
                  //     pAddCustomDescription: editing.remark,
                  //   },
                  // });
                }}
              ><FEdit/></FTextBtn>
              <FDelete
                style={{color: '#EE4040', cursor: 'pointer'}}
                onClick={() => {
                  const currentRule = informExhibitInfoPage.allRuleResult.find((rr: any) => {
                    return rr.id === informExhibitInfoPage.theRuleID;
                  });

                  let attrs = [];

                  if (currentRule) {
                    attrs = currentRule.ruleInfo.attrs;
                  }

                  dispatch<SyncRulesAction>({
                    type: 'informExhibitInfoPage/syncRules',
                    payload: {
                      attrs: [
                        ...attrs,
                        {
                          operation: 'delete',
                          key: pc.theKey,
                        },
                      ],
                    },
                  });
                }}
              />
            </Space>

          </div>
          <div style={{height: 5}}/>
          <FInput
            className={styles.FInput}
            value={pc.value}
            // errorText={pc.newValueError}
            onChange={(e) => {
              onChangeCustomAttrs({key: pc.theKey, value: e.target.value});
            }}
            // onBlur={() => dispatch<UpdateRewriteAction>({
            //   type: 'informExhibitInfoPage/updateRewrite',
            // })}
          />
        </div>))
      }
    </div>
    <div style={{height: 20}}/>
    <Space className={styles.addCustomTitle}>
      <FCircleBtn
        type="transparent"
        onClick={() => {
          // dispatch<ChangeAction>({
          //   type: 'informExhibitInfoPage/change',
          //   payload: {
          //     pAddCustomModalVisible: true,
          //     pAddCustomKey: '',
          //     pAddCustomKeyError: '',
          //     pAddCustomValue: '',
          //     pAddCustomValueError: '',
          //     pAddCustomDescription: '',
          //     pAddCustomDescriptionError: '',
          //   },
          // });
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
      // visible={informExhibitInfoPage.pAddCustomModalVisible || !!informExhibitInfoPage.pCustomAttrs.find((pca) => pca.isEditing)}
      visible={informExhibitInfoPage.pCustomModalVisible}
      okText={'添加'}
      // okButtonProps={{
      //   disabled:
      //     !!informExhibitInfoPage.pAddCustomKeyError || informExhibitInfoPage.pAddCustomKey === ''
      //     || !!informExhibitInfoPage.pAddCustomValueError || informExhibitInfoPage.pAddCustomValue === ''
      //     || !!informExhibitInfoPage.pAddCustomDescriptionError
      // }}
      okButtonProps={{
        disabled: informExhibitInfoPage.pCustomModalConfirmButtonDisabled
      }}
      onCancel={() => {
        // dispatch<ChangeAction>({
        //   type: 'informExhibitInfoPage/change',
        //   payload: {
        //     pAddCustomModalVisible: false,
        //     pCustomAttrs: informExhibitInfoPage.pCustomAttrs.map((pCustomAttr) => ({
        //       ...pCustomAttr,
        //       isEditing: false,
        //     })),
        //   },
        // });
        dispatch<OnCancelHandleAttrModalAction>({
          type: 'informExhibitInfoPage/onCancelHandleAttrModal',
        });
      }}
      onOk={() => {
        // const editing = informExhibitInfoPage.pCustomAttrs.find((pca) => pca.isEditing);
        //
        // let pCustomAttrs;
        // if (editing) {
        //   pCustomAttrs = informExhibitInfoPage.pCustomAttrs
        //     // .filter((pCustomAttr) => pCustomAttr.key !== exhibitInfoPage.pAddCustomKey)
        //     .map<InformExhibitInfoPageModelState['pCustomAttrs'][number]>((pCustomAtt) => {
        //       if (!pCustomAtt.isEditing) {
        //         return pCustomAtt;
        //       }
        //       return {
        //         ...pCustomAtt,
        //         key: informExhibitInfoPage.pAddCustomKey,
        //         value: informExhibitInfoPage.pAddCustomValue,
        //         // newValue: informExhibitInfoPage.pAddCustomValue,
        //         // newValueError: '',
        //         remark: informExhibitInfoPage.pAddCustomDescription,
        //         isEditing: false,
        //       };
        //     });
        // } else {
        //   pCustomAttrs = [
        //     ...informExhibitInfoPage.pCustomAttrs
        //       .filter((pCustomAttr) => pCustomAttr.key !== informExhibitInfoPage.pAddCustomKey),
        //     {
        //       key: informExhibitInfoPage.pAddCustomKey,
        //       value: informExhibitInfoPage.pAddCustomValue,
        //       // newValue: informExhibitInfoPage.pAddCustomValue,
        //       // newValueError: '',
        //       remark: informExhibitInfoPage.pAddCustomDescription,
        //       isEditing: false,
        //     }
        //   ];
        // }
        //
        // dispatch<ChangeAction>({
        //   type: 'informExhibitInfoPage/change',
        //   payload: {
        //     pCustomAttrs: pCustomAttrs,
        //     pAddCustomModalVisible: false,
        //   }
        // });
        //
        // dispatch<SyncRulesAction>({
        //   type: 'informExhibitInfoPage/syncRules',
        //   payload: {
        //     attrs: pCustomAttrs.map((pca) => {
        //       return {
        //         operation: 'add',
        //         key: pca.key,
        //         value: pca.value,
        //         description: pca.remark,
        //       };
        //     }),
        //   },
        // });
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
          className={styles.modalBodyInput}
          value={informExhibitInfoPage.pCustomKey}
          errorText={informExhibitInfoPage.pCustomKeyError}
          onChange={(e) => {
            // const baseKeys: string[] = informExhibitInfoPage.pBaseAttrs.map<string>((pb) => pb.key);
            // const customKeys: string[] = informExhibitInfoPage.pCustomAttrs
            //   .filter((pc) => !pc.isEditing)
            //   .map<string>((pc) => pc.key);
            // const value: string = e.target.value;
            // let pAddCustomKeyError: string = '';
            // if (!/^[a-zA-Z0-9_]{1,20}$/.test(value)) {
            //   pAddCustomKeyError = `需要符合正则^[a-zA-Z0-9_]{1,20}$`;
            // } else if ([...customKeys].includes(value)) {
            //   pAddCustomKeyError = 'key不能与基础属性和其他自定义属性相同';
            // }
            // dispatch<ChangeAction>({
            //   type: 'informExhibitInfoPage/change',
            //   payload: {
            //     pAddCustomKey: value,
            //     pAddCustomKeyError: pAddCustomKeyError,
            //   },
            // });
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
            // const value: string = e.target.value;
            // dispatch<ChangeAction>({
            //   type: 'informExhibitInfoPage/change',
            //   payload: {
            //     pAddCustomValue: value,
            //     pAddCustomValueError: (value.length > 30 || value === '') ? '1~30个字符' : '',
            //   },
            // });
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
            // const value: string = e.target.value;
            // dispatch<ChangeAction>({
            //   type: 'informExhibitInfoPage/change',
            //   payload: {
            //     pAddCustomDescription: value,
            //     pAddCustomDescriptionError: (value.length > 50) ? '0~50个字符' : '',
            //   },
            // });
          }}
        />
      </div>
    </FModal>
  </>);
}

export default connect(({informExhibitInfoPage}: ConnectState) => ({
  informExhibitInfoPage,
}))(Setting);
