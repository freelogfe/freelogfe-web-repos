import * as React from 'react';
import styles from './index.less';
import {
  FetchInfoAction,
  OnChange_Page_Action,
  OnMount_Page_Action as OnMount_Sidebar_Action, OnUpdate_Data_Action,
} from '@/models/resourceSider';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { ConnectState, ResourceVersionEditorPageModelState } from '@/models/connect';
import { RouteComponentProps } from 'react-router/index';
import { Dispatch } from 'redux';
import * as AHooks from 'ahooks';
import useUrlState from '@ahooksjs/use-url-state';
import FNoDataTip from '@/components/FNoDataTip';
import FComponentsLib from '@freelog/components-lib';
import { Space, Badge } from 'antd';
import { FI18n, FUtil } from '@freelog/tools-lib';
import FDropdownMenu from '@/components/FDropdownMenu';
import FTooltip from '@/components/FTooltip';
import {
  ChangeAction,
  FetchDataSourceAction,
  SyncAllPropertiesAction,
  UpdateDataSourceAction,
  OnMount_Page_Action,
  OnUnmount_Page_Action, OnChange_Version_Action,
} from '@/models/resourceVersionEditorPage';
import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
import FResourceProperties from '@/components/FResourceProperties';
import fResourceOptionEditor from '@/components/fResourceOptionEditor';
import FResourceOptions from '@/components/FResourceOptions';
import FBraftEditor from '@/components/FBraftEditor';
import BraftEditor, { EditorState } from 'braft-editor';
import FMenu from '@/components/FMenu';
import FViewportCards_Resource from '@/components/FAntvG6/FViewportCards_Resource';
import { OnMount_PolicyPage_Action } from '@/models/resourceAuthPage';
import FMicroAPP_Authorization from '@/components/FMicroAPP_Authorization';
import FSkeletonNode from '@/components/FSkeletonNode';

interface VersionInfoProps extends RouteComponentProps<{ id: string; }> {
  dispatch: Dispatch;
  resourceVersionEditorPage: ResourceVersionEditorPageModelState;
}

function VersionInfo({ dispatch, resourceVersionEditorPage, match }: VersionInfoProps) {

  const [$urlState, set$urlState] = useUrlState<{ version: string }>({ version: '' });
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [editor, setEditor] = React.useState<EditorState>(BraftEditor.createEditorState(resourceVersionEditorPage.description));
  const [$customOptionsExpansion, set$customOptionsExpansion] = React.useState<boolean>(false);

  // const [$isSavingDescription, set$isSavingDescription] = FUtil.Hook.useGetState<boolean>(false);

  AHooks.useMount(async () => {
    dispatch<OnMount_Sidebar_Action>({
      type: 'resourceSider/onMount_Page',
      payload: {
        resourceID: match.params.id,
      },
    });
    // dispatch<OnMount_PolicyPage_Action>({
    //   type: 'resourceAuthPage/onMount_PolicyPage',
    //   payload: {
    //     resourceID: match.params.id,
    //   },
    // });
    dispatch<OnChange_Page_Action>({
      type: 'resourceSider/onChange_Page',
      payload: {
        page: 'versionInfo',
      },
    });
    dispatch<OnMount_Page_Action>({
      type: 'resourceVersionEditorPage/onMount_Page',
      payload: {
        resourceID: match.params.id,
        version: $urlState.version,
      },
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmount_Page_Action>({
      type: 'resourceVersionEditorPage/onUnmount_Page',
    });
  });

  // AHooks.useDebounceEffect(() => {
  //   // console.log($urlState, '$urlState wsedf9iojsdlkfjsldkjlkjl');
  //   init();
  // }, [$urlState.version, match.params.id], {
  //   wait: 100,
  // });

  React.useEffect(() => {
    setEditor(BraftEditor.createEditorState(resourceVersionEditorPage.description));
  }, [resourceVersionEditorPage.description]);

  // async function init() {
  //   await onChange({
  //     resourceID: match.params.id,
  //     version: $urlState.version,
  //   });
  //   if ($urlState.version === '') {
  //     onChange({
  //       pageState: 'loaded',
  //     });
  //   } else {
  //     await dispatch<FetchDataSourceAction>({
  //       type: 'resourceVersionEditorPage/fetchDataSource',
  //     });
  //   }
  // }

  async function onChange(payload: Partial<ResourceVersionEditorPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'resourceVersionEditorPage/change',
      payload,
    });
  }

  return (<>
    {
      resourceVersionEditorPage.pageState === 'loading' && (<div>
        <div style={{ height: 40 }} />
        <FSkeletonNode width={120} height={22} />
        <div style={{ height: 20 }} />
        <FSkeletonNode width={340} height={38} />
        <div style={{ height: 50 }} />
        <FSkeletonNode width={120} height={22} />
        <div style={{ height: 20 }} />
        <FSkeletonNode width={340} height={38} />
        <div style={{ height: 50 }} />
        <FSkeletonNode width={120} height={22} />
        <div style={{ height: 20 }} />
        <FSkeletonNode width={860} height={38} />
        <div style={{ height: 50 }} />
        <FSkeletonNode width={120} height={22} />
        <div style={{ height: 20 }} />
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
          <FSkeletonNode width={200} height={150} />
          <FSkeletonNode width={460} height={40} />
        </div>
        <div style={{ height: 50 }} />
        <FSkeletonNode width={120} height={22} />
        <div style={{ height: 20 }} />
        <FSkeletonNode width={340} height={38} />
      </div>)
    }
    {
      resourceVersionEditorPage.version === '' ? (<div
          className={styles.noData}
          style={{
            height: 'calc(100vh - 70px)',
            display: resourceVersionEditorPage.pageState === 'loaded' ? 'block' : 'none',
          }}
        >
          <div />
          <div>
            <FComponentsLib.FTipText
              type='first'
              text={'上传资源，开启授权之旅'}
            />

            <div style={{ height: 30 }} />
            <FComponentsLib.FHotspotTooltip
              id={'resourceVersionEditorPage.noVersionAndCreateVersion'}
              style={{ left: -44, top: 8 }}
              text={FI18n.i18nNext.t('hotpots_editresource_btn_createnewversion')}
              onMount={() => {
                FComponentsLib.fSetHotspotTooltipVisible('resourceVersionEditorPage.noVersionAndCreateVersion', {
                  value: false,
                  effectiveImmediately: false,
                  onlyNullish: false,
                });
              }}
            >
              <FComponentsLib.FRectBtn
                size='large'
                className={styles.btn}
                onClick={() => {
                  self.open(FUtil.LinkTo.resourceVersionCreator({ resourceID: match.params.id }));
                }}
              >上传资源</FComponentsLib.FRectBtn>
            </FComponentsLib.FHotspotTooltip>
          </div>
          <div />
        </div>)
        : (<div style={{ display: resourceVersionEditorPage.pageState === 'loaded' ? 'block' : 'none' }}>
          <div>
            <div style={{ height: 40 }} />
            <Header
              versions={resourceVersionEditorPage.versions}
              version={resourceVersionEditorPage.version}
              signingDate={resourceVersionEditorPage.resourceVersionInfo?.createData || ''}
              resourceID={resourceVersionEditorPage.resourceID}
              sha1={resourceVersionEditorPage.resourceVersionInfo?.sha1 || ''}
              isCartoon={resourceVersionEditorPage.resourceInfo?.resourceType[0] === '阅读' && resourceVersionEditorPage.resourceInfo?.resourceType[1] === '漫画'}
              hasDraft={!!resourceVersionEditorPage.draft}
              onClickDownload={(extension) => {
                if (!extension) {
                  self.location.href = FUtil.Format.completeUrlByDomain('api')
                    + `/v2/resources/${resourceVersionEditorPage.resourceID}/versions/${resourceVersionEditorPage.version}/download`;
                  return;
                }

                self.location.href = FUtil.Format.completeUrlByDomain('api')
                  + `/v2/resources/${resourceVersionEditorPage.resourceID}/versions/${resourceVersionEditorPage.version}/download?fileSuffix=${extension}`;
              }}
              onChangeVersion={(version) => {
                // console.log(version, 'version 9ewiofjksdfjlsdkjflkdsjflkjl');
                // set$urlState({ version: version });
                if (version !== resourceVersionEditorPage.version) {
                  dispatch<OnChange_Version_Action>({
                    type: 'resourceVersionEditorPage/onChange_Version',
                    payload: {
                      version: version,
                    },
                  });
                }
                
              }}
            />

            <div style={{ height: 40 }} />

            <div className={styles.block}>
              <FComponentsLib.FContentText text={'基础属性'} type={'highlight'} />
              <div style={{ height: 20 }} />
              <FResourceProperties
                immutableData={resourceVersionEditorPage.rawProperties}
                onlyEditValueData={resourceVersionEditorPage.additionalProperties}
                onEdit_onlyEditValueData={async (data) => {
                  const index: number = resourceVersionEditorPage.additionalProperties.findIndex((p) => {
                    return p === data;
                  });
                  const dataSource: {
                    key: string;
                    name: string;
                    value: string;
                    description: string;
                  } | null = await fResourcePropertyEditor({
                    disabledKeys: [
                      ...resourceVersionEditorPage.rawProperties.map<string>((rp) => rp.key),
                      ...resourceVersionEditorPage.additionalProperties.map<string>((rp) => rp.key),
                      ...resourceVersionEditorPage.customProperties.map<string>((bp) => bp.key),
                      ...resourceVersionEditorPage.customConfigurations.map<string>((pp) => pp.key),
                    ],
                    disabledNames: [
                      ...resourceVersionEditorPage.rawProperties.map<string>((bp) => bp.name),
                      ...resourceVersionEditorPage.additionalProperties.map<string>((bp) => bp.name),
                      ...resourceVersionEditorPage.customProperties.map<string>((bp) => bp.name),
                      ...resourceVersionEditorPage.customConfigurations.map<string>((pp) => pp.name),
                    ],
                    defaultData: data,
                    noneEditableFields: ['key', 'name', 'description'],
                  });
                  if (!dataSource) {
                    return;
                  }

                  await onChange({
                    additionalProperties: resourceVersionEditorPage.additionalProperties.map((bp, i) => {
                      if (index !== i) {
                        return bp;
                      }
                      return dataSource;
                    }),
                  });
                  await dispatch<SyncAllPropertiesAction>({
                    type: 'resourceVersionEditorPage/syncAllProperties',
                  });
                }}
                alterableData={resourceVersionEditorPage.customProperties}
                onEdit_alterableData={async (data) => {
                  const index: number = resourceVersionEditorPage.customProperties.findIndex((p) => {
                    return p === data;
                  });
                  const dataSource: {
                    key: string;
                    name: string;
                    value: string;
                    description: string;
                  } | null = await fResourcePropertyEditor({
                    disabledKeys: [
                      ...resourceVersionEditorPage.rawProperties.map<string>((rp) => rp.key),
                      ...resourceVersionEditorPage.additionalProperties.map<string>((rp) => rp.key),
                      ...resourceVersionEditorPage.customProperties.map<string>((bp) => bp.key),
                      ...resourceVersionEditorPage.customConfigurations.map<string>((pp) => pp.key),
                    ],
                    disabledNames: [
                      ...resourceVersionEditorPage.rawProperties.map<string>((bp) => bp.name),
                      ...resourceVersionEditorPage.additionalProperties.map<string>((bp) => bp.name),
                      ...resourceVersionEditorPage.customProperties.map<string>((bp) => bp.name),
                      ...resourceVersionEditorPage.customConfigurations.map<string>((pp) => pp.name),
                    ],
                    defaultData: data,
                    noneEditableFields: ['key', 'name'],
                  });
                  if (!dataSource) {
                    return;
                  }

                  await onChange({
                    customProperties: resourceVersionEditorPage.customProperties.map((bp, i) => {
                      if (index !== i) {
                        return bp;
                      }
                      return dataSource;
                    }),
                  });
                  await dispatch<SyncAllPropertiesAction>({
                    type: 'resourceVersionEditorPage/syncAllProperties',
                  });
                }}
              />
            </div>

            {
              resourceVersionEditorPage.customConfigurations.length > 0 && (<>
                <div style={{ height: 5 }} />
                <div className={styles.block}>
                  <FComponentsLib.FContentText text={FI18n.i18nNext.t('resourceoptions_title')} type={'highlight'} />
                  <div style={{ height: 20 }} />
                  <FResourceOptions
                    theme={'dark'}
                    dataSource={resourceVersionEditorPage.customConfigurations.filter((f1, f2) => {
                      return $customOptionsExpansion || f2 < 3;
                      // return true;
                    })}
                    onEdit={async (data) => {
                      const index: number = resourceVersionEditorPage.customConfigurations.findIndex((p) => {
                        return p === data;
                      });

                      const dataSource: {
                        key: string;
                        name: string;
                        type: 'input' | 'select';
                        input: string;
                        select: string[];
                        description: string;
                      } | null = await fResourceOptionEditor({
                        disabledKeys: [
                          ...resourceVersionEditorPage.rawProperties.map<string>((rp) => rp.key),
                          ...resourceVersionEditorPage.additionalProperties.map<string>((rp) => rp.key),
                          ...resourceVersionEditorPage.customProperties.map<string>((bp) => bp.key),
                          ...resourceVersionEditorPage.customConfigurations.map<string>((pp) => pp.key),
                        ],
                        disabledNames: [
                          ...resourceVersionEditorPage.rawProperties.map<string>((rp) => rp.name),
                          ...resourceVersionEditorPage.additionalProperties.map<string>((rp) => rp.name),
                          ...resourceVersionEditorPage.customProperties.map<string>((bp) => bp.name),
                          ...resourceVersionEditorPage.customConfigurations.map<string>((pp) => pp.name),
                        ],
                        defaultData: data,
                        noneEditableFields: ['key', 'name', 'type'],
                      });

                      if (!dataSource) {
                        return;
                      }
                      await onChange({
                        customConfigurations: resourceVersionEditorPage.customConfigurations
                          .map<ResourceVersionEditorPageModelState['customConfigurations'][number]>((bp, i) => {
                            if (index !== i) {
                              return bp;
                            }
                            return dataSource;
                          }),
                      });
                      await dispatch<SyncAllPropertiesAction>({
                        type: 'resourceVersionEditorPage/syncAllProperties',
                      });

                    }}
                  />
                  {
                    resourceVersionEditorPage.customConfigurations.length > 3 && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5 }}>
                        {
                          $customOptionsExpansion
                            ? (<FComponentsLib.FTextBtn
                              onClick={() => {
                                set$customOptionsExpansion(false);
                              }}
                              style={{ fontSize: 12 }}
                              type={'primary'}>{FI18n.i18nNext.t('resourceoptions_btn_showless', {
                              OptionsQty: resourceVersionEditorPage.customConfigurations.length,
                            })}</FComponentsLib.FTextBtn>)
                            : (<>
                              <FComponentsLib.FContentText
                                text={'可配置项目较多，已折叠显示'}
                                type={'additional2'}
                              />
                              <FComponentsLib.FTextBtn
                                onClick={() => {
                                  set$customOptionsExpansion(true);
                                }}
                                style={{ fontSize: 12 }}
                                type={'primary'}>{FI18n.i18nNext.t('resourceoptions_btn_showall', {
                                OptionsQty: resourceVersionEditorPage.customConfigurations.length,
                              })}</FComponentsLib.FTextBtn>
                            </>)
                        }

                      </div>)
                  }
                </div>
              </>)
            }

            {
              resourceVersionEditorPage.reload > 0 && (<>
                <div style={{ height: 5 }} />
                <div className={styles.block}>
                  <FMicroAPP_Authorization
                    licenseeId={resourceVersionEditorPage.resourceID}
                    mainAppType={'resourceInfo'}
                    depList={resourceVersionEditorPage.directDependencies}
                    upcastList={resourceVersionEditorPage.baseUpcastResources}
                    reload={resourceVersionEditorPage.reload}
                    update={(value) => {
                      dispatch<OnUpdate_Data_Action>({
                        type: 'resourceSider/onUpdate_Data',
                        // payload: resourceAuthPage.resourceID,
                      });
                    }}
                  />
                </div>
              </>)
            }

            <div style={{ height: 5 }} />

            <div className={styles.block}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FComponentsLib.FContentText text={FI18n.i18nNext.t('version_description')} type={'highlight'} />

                <Space size={10}>
                  {
                    isEditing
                      ? (<>
                        {/*<FComponentsLib.FTextBtn*/}
                        {/*  type='default'*/}
                        {/*  onClick={() => {*/}
                        {/*    onChange({ descriptionFullScreen: true });*/}
                        {/*  }}*/}
                        {/*>全屏编辑</FComponentsLib.FTextBtn>*/}
                        {/*<FDivider />*/}
                        <FComponentsLib.FTextBtn
                          type='default'
                          onClick={() => setIsEditing(false)}
                        >{FI18n.i18nNext.t('cancel')}</FComponentsLib.FTextBtn>
                        <FComponentsLib.FTextBtn
                          type='primary'
                          onClick={() => {
                            const html: string = editor.toHTML();
                            const description: string = html === '<p></p>' ? '' : html;
                            dispatch<ChangeAction>({
                              type: 'resourceVersionEditorPage/change',
                              payload: {
                                description: description,
                              },
                            });
                            dispatch<UpdateDataSourceAction>({
                              type: 'resourceVersionEditorPage/updateDataSource',
                              payload: {
                                description: description,
                              },
                            });
                            setIsEditing(false);
                            if (!description) {
                              onChange({
                                descriptionFullScreen: false,
                              });
                            }
                          }}
                        >{FI18n.i18nNext.t('save')}</FComponentsLib.FTextBtn>
                      </>)
                      : resourceVersionEditorPage.description !== ''
                        ? (<>
                          {/*<FComponentsLib.FTextBtn*/}
                          {/*  type='default'*/}
                          {/*  onClick={() => {*/}
                          {/*    onChange({ descriptionFullScreen: true });*/}
                          {/*    // const s = self.open();*/}
                          {/*    // s.document.write(buildPreviewHtml(resourceVersionEditorPage.description))*/}
                          {/*  }}*/}
                          {/*>全屏查看</FComponentsLib.FTextBtn>*/}
                          {/*<FDivider />*/}
                          <FComponentsLib.FTextBtn
                            type='primary'
                            onClick={() => {
                              setIsEditing(true);
                            }}
                          >编辑</FComponentsLib.FTextBtn>
                        </>)
                        : undefined
                  }
                </Space>
              </div>

              {
                !resourceVersionEditorPage.description && !isEditing && (<>
                  <div style={{ height: 10 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FComponentsLib.FContentText
                      text={'动动手，让你的资源看起来更丰富～'}
                      type={'additional2'}
                    />
                    <div style={{ height: 20 }} />

                    <FComponentsLib.FRectBtn
                      type={'primary'}
                      onClick={() => {
                        setIsEditing(true);
                      }}
                    >添加版本描述</FComponentsLib.FRectBtn>
                  </div>
                </>)
              }

              {
                isEditing
                  ? (<>
                    <div style={{ height: 20 }} />

                    <FBraftEditor
                      value={editor}
                      // defaultValue={editorText}
                      onChange={(value: EditorState) => setEditor(value)}
                      style={{ minHeight: 500 }}
                    />
                  </>)
                  : (resourceVersionEditorPage.description && (
                    <>
                      <div style={{ height: 20 }} />
                      <div className={styles.description}>
                        <div
                          className={styles.container}
                          dangerouslySetInnerHTML={{ __html: resourceVersionEditorPage.description }}
                        />
                      </div>
                    </>))
              }
            </div>

            {
              resourceVersionEditorPage.graphShow && (<>
                <div style={{ height: 5 }} />
                <div className={styles.block}>
                  <FComponentsLib.FContentText text={'相关视图'} type={'highlight'} />
                  <div style={{ height: 20 }} />

                  <FViewportCards_Resource
                    resourceID={resourceVersionEditorPage.resourceID}
                    version={resourceVersionEditorPage.version}
                    graphShow={['authorization', 'dependency']}
                    onMount={({ hasData }) => {
                      // console.log(hasData, 'hasDataiosdjflkjsdflkjlk');
                      dispatch<ChangeAction>({
                        type: 'resourceVersionEditorPage/change',
                        payload: {
                          graphShow: hasData,
                        },
                      });
                    }}
                  />
                </div>
              </>)
            }


          </div>
          <div style={{ height: 100 }} />
        </div>)
    }
  </>);
}

export default withRouter(connect(({ resourceVersionEditorPage }: ConnectState) => ({
  resourceVersionEditorPage: resourceVersionEditorPage,
}))(VersionInfo));

interface HeaderProps {
  versions: string[];
  version: string;
  resourceID: string;
  sha1: string;
  signingDate: string;
  isCartoon: boolean;
  hasDraft: boolean;

  onClickDownload?(type?: string): void;

  onChangeVersion?(version: string): void;
}

function Header({
                  versions,
                  version,
                  resourceID,
                  sha1,
                  signingDate,
                  hasDraft,
                  onClickDownload,
                  isCartoon,
                  onChangeVersion,
                }: HeaderProps) {

  return (
    <div className={styles.Header}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FComponentsLib.FContentText
          text={`当前版本 ${version}`}
          type={'highlight'}
          singleRow
          style={{ maxWidth: 750, fontSize: 16 }}
        />
        <div style={{ width: 8 }} />
        <FComponentsLib.FDropdown
          overlay={
            <FMenu
              options={versions.map((v) => {
                return {
                  value: v,
                  text: v,
                };
              })}
              onClick={(value) => {
                // onChangeResourceStatus && onChangeResourceStatus(value === '#' ? value : Number(value) as 0)
                // dispatch<OnChangeStatusAction>({
                //   type: 'resourceListPage/onChangeStatus',
                //   payload: {
                //     value: value === '#' ? value : Number(value) as 0,
                //   },
                // });
                onChangeVersion && onChangeVersion(value);
              }}
            />
          }
        >
          <FComponentsLib.FIcons.FDown style={{ fontSize: 12 }} />
        </FComponentsLib.FDropdown>
        <div style={{ width: 30 }} />
        <Badge count={hasDraft ? '草稿' : 0} size={'small'} offset={[20, 0]}>
          <FComponentsLib.FTextBtn
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}
            onClick={() => {
              self.open(FUtil.LinkTo.resourceVersionCreator({ resourceID: resourceID }));
            }}
          >
            <FComponentsLib.FIcons.FUpdateVersion style={{ fontSize: 14 }} />
            <span>更新版本</span>
          </FComponentsLib.FTextBtn>
        </Badge>
      </div>
      <div style={{ height: 10 }} />
      <Space size={0}>
        <FComponentsLib.FContentText
          type='additional2'
          text={FI18n.i18nNext.t('release_date') + '：' + signingDate}
        />
        <div style={{ width: 40 }} />
        <FComponentsLib.FContentText
          type='additional2'
          text={FI18n.i18nNext.t('object_id') + '：' + sha1}
        />
        <div style={{ width: 20 }} />

        {
          isCartoon ? (<FDropdownMenu
              options={[{
                text: 'ZIP格式文件',
                value: 'zip',
              }, {
                text: 'CBZ格式文件',
                value: 'cbz',
              }]}
              onChange={(value) => {
                // $prop.onClick_DownloadBtn && $prop.onClick_DownloadBtn('.' + value);

                onClickDownload && onClickDownload('.' + value);
              }}
            >
              <div>
                <FComponentsLib.FTextBtn
                  type='primary'
                  // onClick={() => onClickDownload && onClickDownload()}
                >
                  <FComponentsLib.FIcons.FDownload
                    style={{ fontSize: 12, fontWeight: 600 }}
                  />
                </FComponentsLib.FTextBtn>
              </div>
            </FDropdownMenu>)
            : (<FTooltip title={'下载'}>
              <div>
                <FComponentsLib.FTextBtn
                  type='primary'
                  onClick={() => onClickDownload && onClickDownload()}
                >
                  <FComponentsLib.FIcons.FDownload
                    style={{ fontSize: 12, fontWeight: 600 }}
                  />
                </FComponentsLib.FTextBtn>
              </div>
            </FTooltip>)
        }
      </Space>
    </div>
  );
}
