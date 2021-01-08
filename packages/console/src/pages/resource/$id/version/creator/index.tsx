import * as React from 'react';
import styles from './index.less';
import {FTitleText} from '@/components/FText';
import FInput from '@/components/FInput';
import FBraftEditor from '@/components/FBraftEditor';
import {FNormalButton, FTextButton} from '@/components/FButton';
import {Space} from 'antd';
import FSelectObject from '@/pages/resource/components/FSelectObject';
import FCustomProperties from '@/components/FCustomProperties';
import FDepPanel from '@/pages/resource/containers/FDepPanel';
import {connect, Dispatch} from "dva";
import {ConnectState, ResourceInfoModelState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {
  ChangeAction,
  ChangeVersionInputAction,
  CreateVersionAction,
  FetchDraftAction,
  FetchRawPropsAction,
  FetchResourceInfoAction, GoToResourceDetailsBySha1,
  HandleObjectInfoAction,
  ImportLastVersionDataAction, InitModelStatesAction, LeaveAndClearDataAction,
  SaveDraftAction,
} from '@/models/resourceVersionCreatorPage';
import {ChangeAction as GlobalChangeAction} from '@/models/global';
import {router, withRouter} from 'umi';
import {i18nMessage} from '@/utils/i18n';
import RouterTypes from 'umi/routerTypes';
import {FDown, FInfo} from "@/components/FIcons";
import FBaseProperties from "@/components/FBaseProperties";
import FBasePropsEditorDrawer from "@/components/FBasePropsEditorDrawer";
import FUp from "@/components/FIcons/FUp";
import {FetchDraftDataAction} from "@/models/resourceInfo";
import FLeftSiderLayout from "@/layouts/FLeftSiderLayout";
import Sider from "@/pages/resource/layouts/FInfoLayout/Sider";
import FFormLayout from "@/layouts/FFormLayout";

interface VersionCreatorProps {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState,
  resourceInfo: ResourceInfoModelState,
  match: {
    params: {
      id: string;
    };
  };
}

function VersionCreator({dispatch, route, resourceVersionCreatorPage, match, resourceInfo}: VersionCreatorProps & RouterTypes) {

  const [minHeight, setMinHeight] = React.useState<number>(window.innerHeight - 70);

  React.useEffect(() => {
    window.addEventListener('resize', setHeight);

    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, []);

  function setHeight() {
    setMinHeight(window.innerHeight - 70);
  }

  // if (!resourceInfo.hasPermission) {
  //   return (<div>
  //     <FNoDataTip
  //       height={minHeight}
  //       tipText={'403,没权限访问'}
  //       btnText={'将前往首页'}
  //       onClick={() => {
  //         router.replace('/');
  //       }}
  //     />
  //   </div>);
  // }

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
      dispatch<LeaveAndClearDataAction>({
        type: 'resourceVersionCreatorPage/leaveAndClearData',
      });
    }
  }, [match.params.id]);

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
      payload: match.params.id,
    });
    await dispatch<FetchDraftDataAction>({
      type: 'resourceInfo/fetchDraftData',
    });
  }

  async function onChange(payload: ChangeAction['payload']) {
    await dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload,
    });
  }

  const hasError: boolean =
    // 版本
    !resourceVersionCreatorPage.version || !!resourceVersionCreatorPage.versionErrorText
    // 对象
    || !resourceVersionCreatorPage.resourceObject || !!resourceVersionCreatorPage.resourceObjectErrorText
    // 依赖
    || !!resourceVersionCreatorPage.dependencies.find((dd) => {
      return !dd.upthrow && !dd.enableReuseContracts.find((erc) => erc.checked) && !dd.enabledPolicies.find((ep) => ep.checked);
    })
    // 自定义属性
    || !!resourceVersionCreatorPage.properties.find((ep) => {
      return ep.key === '' || !!ep.keyError
        // || ep.value === '' || !!ep.valueError
        || !!ep.descriptionError
        || (ep.custom === 'select' ? (ep.customOption === '' || !!ep.customOptionError) : (ep.defaultValue === '' || !!ep.defaultValueError))
    });

  return (<>
      <FLeftSiderLayout
        sider={<Sider/>}
        header={<Header
          onClickCreate={onClickCreate}
          onClickCache={onClickCache}
          disabledCreate={hasError}
        />}
      >
        <FFormLayout>
          <FFormLayout.FBlock dot={true} title={i18nMessage('version_number')}>
            <FInput
              value={resourceVersionCreatorPage.version}
              onChange={(e) => {
                dispatch<ChangeVersionInputAction>({
                  type: 'resourceVersionCreatorPage/changeVersionInputAction',
                  payload: e.target.value,
                });
              }}
              className={styles.versionInput}
              errorText={resourceVersionCreatorPage.versionErrorText}
            />
          </FFormLayout.FBlock>

          <FFormLayout.FBlock dot={true} title={i18nMessage('release_object')}>
            <FSelectObject
              onError={(value) => {
                dispatch<ChangeAction>({
                  type: 'resourceVersionCreatorPage/change',
                  payload: {
                    resourceUsedSha1: value.sha1,
                    resourceObjectErrorText: ''
                  },
                });
              }}
              resourceType={resourceInfo.info?.resourceType || ''}
              resourceObject={resourceVersionCreatorPage.resourceObject}
              onChange={async (value, deps) => {
                // console.log(value, '#@ERWADFSASDFSADF');
                if (!value) {
                  return onChange({
                    resourceObject: null,
                    resourceObjectErrorText: '',
                    rawProperties: [],
                    baseProperties: [],
                    properties: [],
                  });
                }
                await onChange({resourceObject: value, resourceObjectErrorText: ''});
                await dispatch<FetchRawPropsAction>({
                  type: 'resourceVersionCreatorPage/fetchRawProps',
                });

                if (value.objectId) {
                  dispatch<HandleObjectInfoAction>({
                    type: 'resourceVersionCreatorPage/handleObjectInfo',
                    payload: value.objectId,
                  });
                }
              }}
              errorText={resourceVersionCreatorPage.resourceObjectErrorText}
              onChangeErrorText={(text) => onChange({resourceObjectErrorText: text})}
            />
            {/*{*/}
            {/*  resourceVersionCreatorPage.resourceUsedSha1 && (<>*/}
            {/*    <span className={styles.resourceError}>该资源已存在,请重新选择。</span>*/}
            {/*    /!*<FTextButton onClick={() => {*!/*/}
            {/*    /!*  dispatch<GoToResourceDetailsBySha1>({*!/*/}
            {/*    /!*    type: 'resourceVersionCreatorPage/goToResourceDetailsBySha1',*!/*/}
            {/*    /!*  });*!/*/}
            {/*    /!*}}>查看</FTextButton>*!/*/}
            {/*  </>)*/}
            {/*}*/}

            {
              resourceVersionCreatorPage.resourceObject && (<>
                <div style={{height: 5}}/>
                <FBaseProperties
                  basics={resourceVersionCreatorPage.rawProperties}
                  additions={resourceVersionCreatorPage.baseProperties}
                  onChangeAdditions={(value) => {
                    onChange({baseProperties: value});
                  }}
                  rightTop={<Space size={20}>
                    <FTextButton
                      theme="primary"
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
                    >补充属性</FTextButton>
                    {
                      resourceVersionCreatorPage.preVersionBaseProperties.length > 0
                        ? (<FTextButton
                          theme="primary"
                          onClick={() => {
                            dispatch<ImportLastVersionDataAction>({
                              type: 'resourceVersionCreatorPage/importLastVersionData',
                              payload: 'baseProps',
                            });
                          }}
                        >从上个版本导入</FTextButton>)
                        : undefined
                    }
                  </Space>}
                />

                <div style={{height: 20}}/>

                <Space>
                  <a onClick={() => {
                    onChange({
                      propertiesDataVisible: !resourceVersionCreatorPage.propertiesDataVisible,
                    });
                  }}>
                    <span>自定义选项（高级）</span>
                    {resourceVersionCreatorPage.propertiesDataVisible ? (<FUp/>) : (<FDown/>)}
                  </a>
                  <FInfo/>
                </Space>

                {
                  resourceVersionCreatorPage.propertiesDataVisible && (<>

                    <div style={{height: 20}}/>

                    <Space size={40}>
                      <a
                        onClick={() => {
                          onChange({
                            properties: [
                              ...resourceVersionCreatorPage.properties,
                              {
                                key: '',
                                keyError: '',
                                description: '',
                                descriptionError: '',
                                custom: 'input',
                                customOption: '',
                                customOptionError: '',
                                defaultValue: '',
                                defaultValueError: '',
                              },
                            ],
                          });
                        }}
                      >添加选项</a>
                      {
                        resourceVersionCreatorPage.preVersionOptionProperties.length > 0 && (<a onClick={() => {
                          dispatch<ImportLastVersionDataAction>({
                            type: 'resourceVersionCreatorPage/importLastVersionData',
                            payload: 'optionProps',
                          });
                        }}>从上个版本导入</a>)
                      }

                    </Space>

                    <div style={{height: 30}}/>

                    <FCustomProperties
                      dataSource={resourceVersionCreatorPage.properties}
                      disabledKeys={[
                        ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
                        ...resourceVersionCreatorPage.baseProperties.map<string>((pp) => pp.key),
                      ]}
                      onChange={(value) => onChange({properties: value})}
                    />
                  </>)
                }

              </>)
            }

          </FFormLayout.FBlock>

          <FFormLayout.FBlock dot={false} title={i18nMessage('rely')}>
            <FDepPanel/>
          </FFormLayout.FBlock>

          <FFormLayout.FBlock dot={false} title={i18nMessage('version_description')}>
            <FBraftEditor
              value={resourceVersionCreatorPage.description}
              onChange={(value) => onChange({description: value})}
            />
          </FFormLayout.FBlock>
        </FFormLayout>
      </FLeftSiderLayout>

      <FBasePropsEditorDrawer
        visible={resourceVersionCreatorPage.basePropertiesEditorVisible}
        dataSource={resourceVersionCreatorPage.basePropertiesEditorData}
        disabledKeys={[
          ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
          ...resourceVersionCreatorPage.properties.map<string>((pp) => pp.key),
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
    <FTitleText text={i18nMessage('create_new_version')} type="h1"/>

    <Space size={30}>
      <FTextButton onClick={onClickCache}>{i18nMessage('save_as_draft')}</FTextButton>
      <FNormalButton
        style={{width: 108}}
        onClick={onClickCreate}
        disabled={disabledCreate}
      >{i18nMessage('release_to_market')}</FNormalButton>
    </Space>
  </div>);
}

export default withRouter(connect(({resourceVersionCreatorPage, resourceInfo}: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
  resourceInfo: resourceInfo,
}))(VersionCreator));
