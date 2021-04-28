import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import FInput from '@/components/FInput';
import FBraftEditor from '@/components/FBraftEditor';
import {FRectBtn, FTextBtn} from '@/components/FButton';
import {Space} from 'antd';
import FSelectObject from '@/pages/resource/components/FSelectObject';
import FDepPanel from '@/pages/resource/containers/FDepPanel';
import {connect, Dispatch} from "dva";
import {
  ConnectState,
  ResourceVersionCreatorPageModelState,
  StorageObjectEditorModelState,
} from '@/models/connect';
import {
  ChangeAction,
  CreateVersionAction,
  FetchDraftAction,
  // FetchRawPropsAction,
  FetchResourceInfoAction,
  // GoToResourceDetailsBySha1,
  // HandleObjectInfoAction,
  ImportLastVersionDataAction,
  InitModelStatesAction,
  LeaveAndClearDataAction,
  SaveDraftAction,
  VerifyVersionInputAction,
} from '@/models/resourceVersionCreatorPage';
import {ChangeAction as GlobalChangeAction} from '@/models/global';
import {router, withRouter} from 'umi';
import RouterTypes from 'umi/routerTypes';
import {FDown, FInfo} from "@/components/FIcons";
import FBaseProperties from "@/components/FBaseProperties";
import FBasePropsEditorDrawer from "@/components/FBasePropsEditorDrawer";
import FUp from "@/components/FIcons/FUp";
import {FetchDraftDataAction} from "@/models/resourceInfo";
import FLeftSiderLayout from "@/layouts/FLeftSiderLayout";
import Sider from "@/pages/resource/layouts/FInfoLayout/Sider";
import FFormLayout from "@/layouts/FFormLayout";
import Prompt from 'umi/prompt';
import * as H from "history";
import FCustomOptionsCard from "@/components/FCustomOptionsCard";
import FCustomOptionsEditorDrawer from "@/components/FCustomOptionsEditorDrawer";
import fConfirmModal from "@/components/fConfirmModal";
import FUtil from "@/utils";
import FTooltip from "@/components/FTooltip";
import {RouteComponentProps} from 'react-router';
import * as AHooks from "ahooks";
import {ClearDataDataAction} from "@/models/marketResourcePage";

interface VersionCreatorProps extends RouteComponentProps<{ id: string; }> {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState,
}

function VersionCreator({dispatch, route, resourceVersionCreatorPage, match}: VersionCreatorProps & RouterTypes) {

  React.useEffect(() => {
    // const func = () => 1234;
    if (resourceVersionCreatorPage.dataIsDirty) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }

  }, [resourceVersionCreatorPage.dataIsDirty]);

  AHooks.useUnmount(() => {
    window.onbeforeunload = null;
  });

  React.useEffect(() => {
    dispatch<GlobalChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });

    return () => {
      dispatch<InitModelStatesAction>({
        type: 'resourceVersionCreatorPage/initModelStates',
      });
    };
  }, [route]);

  React.useEffect(() => {
    // console.log(match, 'creator902jfsadlk');
    init();

    return () => {
      console.log(match.params.id, 'match.params.id');
      dispatch<LeaveAndClearDataAction>({
        type: 'resourceVersionCreatorPage/leaveAndClearData',
      });
    }
  }, []);

  async function init() {
    await onChange({resourceId: match.params.id});
    await dispatch<FetchResourceInfoAction>({
      type: 'resourceVersionCreatorPage/fetchResourceInfo',
    });
    await dispatch<FetchDraftAction>({
      type: 'resourceVersionCreatorPage/fetchDraft',
    });
  }

  async function onClickCache() {
    await dispatch<SaveDraftAction>({
      type: 'resourceVersionCreatorPage/saveDraft',
    });
    await dispatch<FetchDraftDataAction>({
      type: 'resourceInfo/fetchDraftData',
    });
  }

  async function onClickCreate() {
    await dispatch<CreateVersionAction>({
      type: 'resourceVersionCreatorPage/createVersion',
      // payload: match.params.id,
    });
    await dispatch<FetchDraftDataAction>({
      type: 'resourceInfo/fetchDraftData',
    });
  }

  async function onChange(payload: ChangeAction['payload']) {
    await dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload,
      caller: '2345324343452===-0-9--34324534%#$%#$%#$%#$#$',
    });
  }

  const hasError: boolean =
    // 版本
    !resourceVersionCreatorPage.version || !!resourceVersionCreatorPage.versionErrorText
    // 选择的文件对象
    || resourceVersionCreatorPage.selectedFileStatus !== -3
    // 依赖
    || resourceVersionCreatorPage.dependencies.some((dd) => {
      return !dd.upthrow && !dd.enableReuseContracts.some((erc) => erc.checked) && !dd.enabledPolicies.some((ep) => ep.checked);
    });
  // 自定义属性
  // || !!resourceVersionCreatorPage.properties.find((ep) => {
  //   return ep.key === '' || !!ep.keyError
  //     // || ep.value === '' || !!ep.valueError
  //     || !!ep.descriptionError
  //     || (ep.custom === 'select' ? (ep.customOption === '' || !!ep.customOptionError) : (ep.defaultValue === '' || !!ep.defaultValueError))
  // });

  return (<>
      <Prompt
        when={resourceVersionCreatorPage.promptLeavePath === '' && resourceVersionCreatorPage.dataIsDirty}
        message={(location: H.Location, action: H.Action) => {
          console.log(location, action, 'LAAAAL');
          // return window.confirm('还没有保存草稿或发行，现在离开会导致信息丢失');
          dispatch<ChangeAction>({
            type: 'resourceVersionCreatorPage/change',
            payload: {
              promptLeavePath: location.pathname + location.search,
            },
            caller: '2345$#%%#$%#$%#$532434345234324534%#$%#$%#$%#$#$',
          });
          fConfirmModal({
            message: '还没有保存草稿或发行，现在离开会导致信息丢失',
            onOk() {
              // console.log('OK');
              router.push(location.pathname + location.search,);
            },
            onCancel() {
              // console.log('Cancel');
              dispatch<ChangeAction>({
                type: 'resourceVersionCreatorPage/change',
                payload: {
                  promptLeavePath: '',
                },
                caller: '234532434()))(*())(()345234324534%#$%#$%#$%#$#$',
              });
            },
          });
          return false;
        }}
      />
      <FLeftSiderLayout
        sider={<Sider/>}
        header={<Header
          onClickCreate={onClickCreate}
          onClickCache={onClickCache}
          disabledCreate={hasError}
        />}
      >
        <FFormLayout>
          <FFormLayout.FBlock
            dot={true}
            title={FUtil.I18n.message('version_number')}
          >
            <FInput
              value={resourceVersionCreatorPage.version}
              onChange={(e) => {
                dispatch<ChangeAction>({
                  type: 'resourceVersionCreatorPage/change',
                  payload: {
                    version: e.target.value,
                    dataIsDirty: true,
                  },
                  caller: '23$^%%%%^&^&&4532434345234324534%#$%#$%#$%#$#$',
                });
              }}
              onBlur={() => {
                dispatch<VerifyVersionInputAction>({
                  type: 'resourceVersionCreatorPage/verifyVersionInput',
                  // payload: e.target.value,
                });
              }}
              className={styles.versionInput}
              errorText={resourceVersionCreatorPage.versionErrorText}
            />
          </FFormLayout.FBlock>

          <FFormLayout.FBlock dot={true} title={FUtil.I18n.message('release_object')}>
            <FSelectObject/>

            {
              resourceVersionCreatorPage.selectedFileStatus === -3 && (<>
                <div style={{height: 5}}/>
                <FBaseProperties
                  basics={resourceVersionCreatorPage.rawProperties}
                  additions={resourceVersionCreatorPage.baseProperties}
                  onChangeAdditions={(value) => {
                    onChange({
                      baseProperties: value,
                      dataIsDirty: true,
                    });
                  }}
                  rightTop={<Space size={20}>
                    <FTextBtn
                      type="primary"
                      onClick={() => {
                        onChange({
                          basePropertiesEditorVisible: true,
                          basePropertiesEditorData: resourceVersionCreatorPage.baseProperties.map((bp) => {
                            return {
                              ...bp,
                              keyError: '',
                              valueError: '',
                              descriptionError: '',
                            };
                          }),
                        });
                      }}
                    >补充属性</FTextBtn>
                    {
                      resourceVersionCreatorPage.preVersionBaseProperties.length > 0
                        ? (<FTextBtn
                          type="primary"
                          onClick={() => {
                            dispatch<ImportLastVersionDataAction>({
                              type: 'resourceVersionCreatorPage/importLastVersionData',
                              payload: 'baseProps',
                            });
                            onChange({dataIsDirty: true})
                          }}
                        >从上个版本导入</FTextBtn>)
                        : undefined
                    }
                  </Space>}
                />

                <div style={{height: 20}}/>

                <Space size={5}>
                  <FTextBtn
                    type="default"
                    onClick={() => {
                      onChange({
                        customOptionsDataVisible: !resourceVersionCreatorPage.customOptionsDataVisible,
                      });
                    }}
                  >
                    <span>自定义选项（高级）</span>
                    {resourceVersionCreatorPage.customOptionsDataVisible ? (<FUp/>) : (<FDown/>)}
                  </FTextBtn>
                  <FTooltip title={FUtil.I18n.message('info_versionoptions')}>
                    <div><FInfo/></div>
                  </FTooltip>
                </Space>

                {
                  resourceVersionCreatorPage.customOptionsDataVisible && (<>

                    <div style={{height: 20}}/>

                    <Space size={40}>
                      <FTextBtn
                        onClick={() => {
                          onChange({
                            customOptionsEditorDataSource: resourceVersionCreatorPage.customOptionsData.map<ResourceVersionCreatorPageModelState['customOptionsEditorDataSource'][number]>((cod) => {
                              return {
                                key: cod.key,
                                keyError: '',
                                description: cod.description,
                                descriptionError: '',
                                custom: cod.custom,
                                customOption: cod.customOption,
                                customOptionError: '',
                                defaultValue: cod.defaultValue,
                                defaultValueError: '',
                              };
                            }),
                            customOptionsEditorVisible: true,
                          });
                        }}
                      >添加选项</FTextBtn>
                      {
                        resourceVersionCreatorPage.preVersionOptionProperties.length > 0 && (<FTextBtn
                          onClick={() => {
                            dispatch<ImportLastVersionDataAction>({
                              type: 'resourceVersionCreatorPage/importLastVersionData',
                              payload: 'optionProps',
                            });
                            onChange({dataIsDirty: true,});
                          }}>从上个版本导入</FTextBtn>)
                      }

                    </Space>

                    <div style={{height: 20}}/>

                    {
                      resourceVersionCreatorPage.customOptionsData.length > 0 ? (
                          <FCustomOptionsCard
                            dataSource={resourceVersionCreatorPage.customOptionsData.map((cod) => {
                              return {
                                key: cod.key,
                                type: cod.custom === 'input' ? '输入框' : '选择框',
                                description: cod.description,
                                value: cod.custom === 'input' ? cod.defaultValue : cod.customOption,
                              };
                            })}
                            onDeleteKey={(value) => {
                              dispatch<ChangeAction>({
                                type: 'resourceVersionCreatorPage/change',
                                payload: {
                                  customOptionsData: resourceVersionCreatorPage.customOptionsData.filter((cod) => {
                                    return cod.key !== value;
                                  }),
                                },
                                caller: '23453243434523432453___(*)(*)(*4%#$%#$%#$%#$#$',
                              })
                            }}
                          />
                        )
                        : (<FContentText text={'暂无自定义选项…'} type="negative"/>)
                    }

                  </>)
                }

              </>)
            }

          </FFormLayout.FBlock>

          <FFormLayout.FBlock dot={false} title={FUtil.I18n.message('rely')}>
            <FDepPanel/>
          </FFormLayout.FBlock>

          <FFormLayout.FBlock dot={false} title={FUtil.I18n.message('version_description')}>
            <FBraftEditor
              value={resourceVersionCreatorPage.description}
              onChange={(value) => {
                // console.log('######!!~@#@!#!@');
                onChange({
                  description: value,
                  dataIsDirty: true,
                });
              }}
              style={{
                height: 500,
              }}
            />
          </FFormLayout.FBlock>
        </FFormLayout>
      </FLeftSiderLayout>

      <FBasePropsEditorDrawer
        visible={resourceVersionCreatorPage.basePropertiesEditorVisible}
        dataSource={resourceVersionCreatorPage.basePropertiesEditorData}
        disabledKeys={[
          ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
          ...resourceVersionCreatorPage.customOptionsData.map<string>((pp) => pp.key),
        ]}
        onChange={(value) => {
          onChange({
            basePropertiesEditorData: value,
          });
        }}
        onCancel={() => {
          onChange({
            basePropertiesEditorData: [],
            basePropertiesEditorVisible: false,
          });
        }}
        onConfirm={() => {
          onChange({
            basePropertiesEditorData: [],
            basePropertiesEditorVisible: false,
            baseProperties: resourceVersionCreatorPage.basePropertiesEditorData.map<ResourceVersionCreatorPageModelState['baseProperties'][number]>((bped) => {
              return {
                key: bped.key,
                value: bped.value,
                description: bped.description,
              };
            }),
          });
        }}
      />

      <FCustomOptionsEditorDrawer
        visible={resourceVersionCreatorPage.customOptionsEditorVisible}
        onCancel={() => {
          dispatch<ChangeAction>({
            type: 'resourceVersionCreatorPage/change',
            payload: {
              customOptionsEditorVisible: false,
              customOptionsEditorDataSource: [],
            },
            caller: '234532&*^*(&^*(&^*(&434345234324534%#$%#$%#$%#$#$',
          });
        }}
        dataSource={resourceVersionCreatorPage.customOptionsEditorDataSource}
        disabledKeys={[
          ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
          ...resourceVersionCreatorPage.baseProperties.map<string>((pp) => pp.key),
        ]}
        onChange={(value) => {
          dispatch<ChangeAction>({
            type: 'resourceVersionCreatorPage/change',
            payload: {customOptionsEditorDataSource: value},
            caller: '23453243434523432hjkjsdhfkjhajsdf4534%#$%#$%#$%#$#$',
          });
        }}
        onConfirm={() => {
          dispatch<ChangeAction>({
            type: 'resourceVersionCreatorPage/change',
            payload: {
              customOptionsData: resourceVersionCreatorPage.customOptionsEditorDataSource.map<StorageObjectEditorModelState['customOptionsData'][number]>((coeds) => {
                return {
                  key: coeds.key,
                  defaultValue: coeds.defaultValue,
                  description: coeds.description,
                  custom: coeds.custom,
                  customOption: coeds.customOption,
                };
              }),
              customOptionsEditorDataSource: [],
              customOptionsEditorVisible: false,
            },
            caller: '23453[]p[pop[iooiiop2434345234324534%#$%#$%#$%#$#$',
          })
        }}
      />
    </>
  );
}

interface HeaderProps {
  onClickCache: () => void;
  onClickCreate: () => void;
  disabledCreate?: boolean;
}

function Header({onClickCache, onClickCreate, disabledCreate = false}: HeaderProps) {
  return (<div className={styles.Header}>
    {/*<FTitleText text={FUtil.I18n.message('create_new_version')} type="h1"/>*/}
    <FTitleText text={'创建版本'} type="h1"/>

    <Space size={30}>
      <FTextBtn
        type="default"
        onClick={onClickCache}
      >{FUtil.I18n.message('save_as_draft')}</FTextBtn>
      <FRectBtn
        style={{width: 108}}
        onClick={onClickCreate}
        disabled={disabledCreate}
      >{FUtil.I18n.message('release_to_market')}</FRectBtn>
    </Space>
  </div>);
}

export default withRouter(connect(({resourceVersionCreatorPage}: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(VersionCreator));
