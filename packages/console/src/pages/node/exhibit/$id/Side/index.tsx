import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import {FClose, FDelete, FEdit} from "@/components/FIcons";
import {Space} from "antd";
import FInput from "@/components/FInput";
import {FNormalButton, FTextButton, FCircleButton} from "@/components/FButton";
import FSelect from "@/components/FSelect";
import FModal from "@/components/FModal";
import {connect, Dispatch} from 'dva';
import {ConnectState, ExhibitInfoPageModelState} from "@/models/connect";
import {ChangeAction, UpdateBaseInfoAction, UpdateRewriteAction} from "@/models/exhibitInfoPage";
import FUploadImage from "@/components/FUploadImage";
import {RcFile, UploadChangeParam} from "antd/lib/upload/interface";
import FRedo from "@/components/FIcons/FRedo";

interface SideProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState,
}

function Side({dispatch, exhibitInfoPage}: SideProps) {

  function onChangePInputTitle(value: string | null) {
    dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload: {
        pInputTitle: value,
      },
    });
  }

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

  return (<div className={styles.side}>
    <div className={styles.base}>
      <FTitleText text={'基础信息'} type="h4"/>
      <div style={{height: 20}}/>

      <FUploadImage
        onUploadSuccess={(url: string) => dispatch<UpdateBaseInfoAction>({
          type: 'exhibitInfoPage/updateBaseInfo',
          payload: {
            pCover: url,
          },
        })}>
        <div className={styles.cover}>
          <img
            alt=""
            src={exhibitInfoPage.pCover || imgSrc}
          />
          <div>
            <FEdit style={{fontSize: 32}}/>
            <div style={{height: 10}}/>
            <div>修改封面</div>
          </div>
        </div>
      </FUploadImage>

      <div style={{height: 20}}/>

      <FTitleText text={'展品标题'} type="form"/>
      <div style={{height: 15}}/>
      {
        exhibitInfoPage.pInputTitle === null
          ? (<Space size={10}>
            <FContentText text={exhibitInfoPage.pTitle}/>
            <a onClick={() => onChangePInputTitle(exhibitInfoPage.pTitle)}><FEdit/></a>
          </Space>)
          : (<>
            <FInput
              className={styles.Input}
              value={exhibitInfoPage.pInputTitle || ''}
              onChange={(e) => onChangePInputTitle(e.target.value)}
            />
            <div style={{height: 10}}/>
            <div className={styles.btn}>
              <FTextButton
                size="small"
                onClick={() => onChangePInputTitle(null)}
              >取消</FTextButton>
              <div style={{width: 15}}/>
              <FNormalButton
                size="small"
                onClick={() => {
                  dispatch<UpdateBaseInfoAction>({
                    type: 'exhibitInfoPage/updateBaseInfo',
                    payload: {
                      pTitle: exhibitInfoPage.pInputTitle || '',
                    },
                  });
                  onChangePInputTitle(null);
                }}
              >确定</FNormalButton>
            </div>
          </>)
      }

      <div style={{height: 30}}/>

      <FTitleText text={'展品标签'} type="form"/>
      <div style={{height: 15}}/>
      <div className={styles.tags}>
        {
          exhibitInfoPage.pTags.map((t) => (<label key={t}>
            <span>{t}</span>
            <FTextButton onClick={() => {
              dispatch<UpdateBaseInfoAction>({
                type: 'exhibitInfoPage/updateBaseInfo',
                payload: {
                  pTags: exhibitInfoPage.pTags.filter((tag) => tag !== t),
                },
              });
            }}><FClose/></FTextButton>
          </label>))
        }
      </div>
      <div style={{height: 15}}/>
      <FInput
        placeholder={'回车添加标签，esc取消'}
        className={styles.Input}
        value={exhibitInfoPage.pTagInput}
        onChange={(e) => dispatch<ChangeAction>({
          type: 'exhibitInfoPage/change',
          payload: {
            pTagInput: e.target.value,
          },
        })}
        onPressEnter={() => {
          dispatch<UpdateBaseInfoAction>({
            type: 'exhibitInfoPage/updateBaseInfo',
            payload: {
              pTags: [
                ...exhibitInfoPage.pTags,
                exhibitInfoPage.pTagInput,
              ],
            },
          });
          dispatch<ChangeAction>({
            type: 'exhibitInfoPage/change',
            payload: {
              pTagInput: '',
            },
          })
        }}
      />
      <div style={{height: 30}}/>

      <FTitleText text={'高级设置'} type="h4"/>
      <div style={{height: 20}}/>

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
                        // onChangeCustomAttrs({key: pc.key, value: pc.defaultValue || ''}, true);
                      }}
                    ><FEdit/></FTextButton>
                    <FDelete
                      style={{color: '#EE4040', cursor: 'pointer'}}
                      onClick={() => {
                        dispatch<ChangeAction>({
                          type: 'exhibitInfoPage/change',
                          payload: {
                            pCustomAttrs:exhibitInfoPage.pCustomAttrs.filter((pCustomAttr) => {
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
    </div>
    <div style={{height: 10}}/>
    <div className={styles.info}>
      <FTitleText text={'关联资源'} type="h4"/>
      <div style={{height: 20}}/>
      <div className={styles.cover} style={{cursor: 'default'}}>
        <img
          alt=""
          src={imgSrc}
        />
      </div>

      <div style={{height: 12}}/>
      <FContentText singleRow text={exhibitInfoPage.resourceName}/>
      <div style={{height: 10}}/>
      <div style={{fontSize: 12, color: '#666'}}>{exhibitInfoPage.resourceType}</div>
    </div>

    <FModal
      title={'添加自定义选项'}
      width={560}
      visible={exhibitInfoPage.pAddCustomModalVisible}
      okText={'添加'}
      onCancel={() => dispatch<ChangeAction>({
        type: 'exhibitInfoPage/change',
        payload: {
          pAddCustomModalVisible: false,
        },
      })}
      onOk={() => {

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
            ]
          }
        });
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
  </div>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Side);
