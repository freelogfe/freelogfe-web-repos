import * as React from 'react';
import styles from './index.less';
import { OnChange_Page_Action, OnMount_Page_Action as OnMount_Sidebar_Action } from '@/models/resourceSider';
import { withRouter } from 'umi';
import { connect } from 'dva';
import { ConnectState, ResourceVersionEditorPageModelState } from '@/models/connect';
import { RouteComponentProps } from 'react-router/index';
import { Dispatch } from 'redux';
import * as AHooks from 'ahooks';
import useUrlState from '@ahooksjs/use-url-state';
import FNoDataTip from '@/components/FNoDataTip';
import FComponentsLib from '@freelog/components-lib';
import { Space } from 'antd';
import { FI18n, FUtil } from '@freelog/tools-lib';
import FDropdownMenu from '@/components/FDropdownMenu';
import FTooltip from '@/components/FTooltip';
import {
  ChangeAction,
  FetchDataSourceAction,
  SyncAllPropertiesAction,
  UpdateDataSourceAction,
} from '@/models/resourceVersionEditorPage';
import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
import FResourceProperties from '@/components/FResourceProperties';
import fResourceOptionEditor from '@/components/fResourceOptionEditor';
import FResourceOptions from '@/components/FResourceOptions';
import FPolicyList from '@/components/FPolicyList';
import FBraftEditor from '@/components/FBraftEditor';
import BraftEditor, { EditorState } from 'braft-editor';
import FDivider from '@/components/FDivider';
import FMenu from '@/components/FMenu';
import { OnChangeStatusAction } from '@/models/resourceListPage';
import FViewportCards_Resource from '@/components/FAntvG6/FViewportCards_Resource';


interface VersionInfoProps extends RouteComponentProps<{
  id: string;
}> {
  dispatch: Dispatch;
  resourceVersionEditorPage: ResourceVersionEditorPageModelState;
}

function VersionInfo({ dispatch, resourceVersionEditorPage, match }: VersionInfoProps) {

  const [$urlState, set$urlState] = useUrlState<{ version: string }>({ version: '' });
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [editor, setEditor] = React.useState<EditorState>(BraftEditor.createEditorState(resourceVersionEditorPage.description));

  // console.log(editor.toHTML(), 'editor wsei8dfjsd;olkfjl;skdfjl;dsjfldskjfl');

  AHooks.useMount(async () => {
    dispatch<OnMount_Sidebar_Action>({
      type: 'resourceSider/onMount_Page',
      payload: {
        resourceID: match.params.id,
      },
    });
    dispatch<OnChange_Page_Action>({
      type: 'resourceSider/onChange_Page',
      payload: {
        page: 'versionInfo',
      },
    });
  });

  AHooks.useDebounceEffect(() => {
    // console.log($urlState, '$urlState wsedf9iojsdlkfjsldkjlkjl');
    init();
  }, [$urlState.version, match.params.id], {
    wait: 100,
  });

  React.useEffect(() => {
    setEditor(BraftEditor.createEditorState(resourceVersionEditorPage.description));
  }, [resourceVersionEditorPage.description]);

  async function init() {
    await onChange({
      resourceID: match.params.id,
      version: $urlState.version,
    });
    // console.log('8******88888*)OIIIIII');
    await dispatch<FetchDataSourceAction>({
      type: 'resourceVersionEditorPage/fetchDataSource',
    });
  }

  async function onChange(payload: Partial<ResourceVersionEditorPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'resourceVersionEditorPage/change',
      payload,
    });
  }


  if (resourceVersionEditorPage.version === '') {
    return (<FNoDataTip
      height={'calc(100vh - 70px)'}
      tipText={'上传资源，开启授权之旅'}
      btnText={'上传资源'}
      onClick={() => {
        self.open(FUtil.LinkTo.resourceVersionCreator({ resourceID: match.params.id }));
      }}
    />);
  }

  return (<>
    <div>
      <div style={{ height: 40 }} />
      <Header
        versions={resourceVersionEditorPage.versions}
        version={resourceVersionEditorPage.version}
        signingDate={resourceVersionEditorPage.resourceVersionInfo?.createData || ''}
        resourceID={resourceVersionEditorPage.resourceID}
        sha1={resourceVersionEditorPage.resourceVersionInfo?.sha1 || ''}
        isCartoon={resourceVersionEditorPage.resourceInfo?.resourceType[0] === '阅读' && resourceVersionEditorPage.resourceInfo?.resourceType[1] === '漫画'}
        onClickDownload={(extension) => {
          if (!extension) {
            self.location.href = FUtil.Format.completeUrlByDomain('qi')
              + `/v2/resources/${resourceVersionEditorPage.resourceID}/versions/${resourceVersionEditorPage.version}/download`;
            return;
          }

          self.location.href = FUtil.Format.completeUrlByDomain('qi')
            + `/v2/resources/${resourceVersionEditorPage.resourceID}/versions/${resourceVersionEditorPage.version}/download?fileSuffix=${extension}`;
        }}
        onChangeVersion={(version) => {
          // console.log(version, 'version 9ewiofjksdfjlsdkjflkdsjflkjl');
          set$urlState({ version: version });
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
                // return $customOptionsExpansion || f2 < 3;
                return true;
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
                style={{ height: 500 }}
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
              graphShow={['relationship', 'authorization', 'dependency']}
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
  </>);
}

// export default VersionInfo;

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

  onClickDownload?(type?: string): void;

  onChangeVersion?(version: string): void;
}

function Header({
                  versions,
                  version,
                  resourceID,
                  sha1,
                  signingDate,
                  onClickDownload,
                  isCartoon,
                  onChangeVersion,
                }: HeaderProps) {

  return (
    <div className={styles.Header}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FComponentsLib.FTitleText
          text={`当前版本 ${version}`}
          type='h1'
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
        <FComponentsLib.FTextBtn onClick={() => {
          self.open(FUtil.LinkTo.resourceVersionCreator({ resourceID: resourceID }));
        }}>新建版本</FComponentsLib.FTextBtn>
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
                    style={{ fontSize: 16, fontWeight: 600 }}
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
                    style={{ fontSize: 16, fontWeight: 600 }}
                  />
                </FComponentsLib.FTextBtn>
              </div>
            </FTooltip>)
        }
        {/*<FTooltip title={'下载'}>*/}

        {/*</FTooltip>*/}
      </Space>
    </div>
  );
}
