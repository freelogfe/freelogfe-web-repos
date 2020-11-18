import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from "@/components/FText";
import FDropdownMenu from "@/components/FDropdownMenu";
import {Space} from "antd";
import {FDelete, FEdit, FSwap} from "@/components/FIcons";
import {FCircleButton, FTextButton} from "@/components/FButton";
import FRedo from "@/components/FIcons/FRedo";
import {ChangeAction, ExhibitInfoPageModelState, UpdateRewriteAction} from "@/models/exhibitInfoPage";
import FSelect from "@/components/FSelect";
import FInput from "@/components/FInput";
import {connect, Dispatch} from "dva";
import {ConnectState} from "@/models/connect";
import FModal from "@/components/FModal";

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
            value: value,
          };
        })
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
    <FDropdownMenu options={[{value: '0.0.1', text: '0.0.1'}]}>
      <Space style={{cursor: 'pointer'}} size={15}><FContentText text={'1.1.1'}/><FSwap/></Space>
    </FDropdownMenu>
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
                value={pc.value}
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
          },
        })}
      />
      <span>添加自定义选项</span>
    </Space>

    <FModal
      title={'添加自定义选项'}
      width={560}
      visible={exhibitInfoPage.pAddCustomModalVisible || !!exhibitInfoPage.pCustomAttrs.find((pca) => pca.isEditing)}
      okText={'添加'}
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
                .filter((pCustomAttr) => pCustomAttr.key !== exhibitInfoPage.pAddCustomKey)
                .map((pCustomAtt) => {
                  if (!pCustomAtt.isEditing) {
                    return pCustomAtt;
                  }
                  return {
                    ...pCustomAtt,
                    key: exhibitInfoPage.pAddCustomKey,
                    value: exhibitInfoPage.pAddCustomValue,
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
                  // defaultValue?: string;
                  // option?: string[];
                  remark: exhibitInfoPage.pAddCustomDescription,
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
          onChange={(e) => dispatch<ChangeAction>({
            type: 'exhibitInfoPage/change',
            payload: {
              pAddCustomKey: e.target.value,
            },
          })}
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
          onChange={(e) => dispatch<ChangeAction>({
            type: 'exhibitInfoPage/change',
            payload: {
              pAddCustomValue: e.target.value,
            },
          })}
        />
        <div style={{height: 20}}/>
        <div>
          <FTitleText type="form">属性说明</FTitleText>
        </div>
        <div style={{height: 5}}/>
        <FInput
          className={styles.modalBodyInput}
          value={exhibitInfoPage.pAddCustomDescription}
          onChange={(e) => dispatch<ChangeAction>({
            type: 'exhibitInfoPage/change',
            payload: {
              pAddCustomDescription: e.target.value,
            },
          })}
        />
      </div>
    </FModal>
  </>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Setting);
