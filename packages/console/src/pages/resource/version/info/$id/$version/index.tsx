import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FBraftEditor from '@/components/FBraftEditor';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceInfoModelState, ResourceVersionEditorPageModelState } from '@/models/connect';
import {
  UpdateDataSourceAction,
  ChangeAction,
  FetchDataSourceAction,
  SyncAllPropertiesAction,
} from '@/models/resourceVersionEditorPage';
import BraftEditor, { EditorState } from 'braft-editor';
import { withRouter } from 'umi';
// import FInput from '@/components/FInput';
import FTooltip from '@/components/FTooltip';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Sider from '@/pages/resource/containers/Sider';
import FFormLayout from '@/components/FFormLayout';
import FDrawer from '@/components/FDrawer';
import { FServiceAPI, FI18n, FUtil } from '@freelog/tools-lib';
import FDivider from '@/components/FDivider';
import { RouteComponentProps } from 'react-router';
import { Helmet } from 'react-helmet';
import FComponentsLib from '@freelog/components-lib';
import FViewportCards_Resource from '@/components/FAntvG6/FViewportCards_Resource';
import FResourceProperties from '@/components/FResourceProperties';
import FResourceOptions from '@/components/FResourceOptions';
import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
import fResourceOptionEditor from '@/components/fResourceOptionEditor';
import FDropdownMenu from '@/components/FDropdownMenu';

interface VersionEditorProps extends RouteComponentProps<{
  id: string;
  version: string;
}> {
  dispatch: Dispatch;
  resourceVersionEditorPage: ResourceVersionEditorPageModelState;
  // resourceInfo: ResourceInfoModelState,
}

function VersionEditor({ dispatch, resourceVersionEditorPage, match }: VersionEditorProps) {

  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [editor, setEditor] = React.useState<EditorState>(BraftEditor.createEditorState(resourceVersionEditorPage.description));

  React.useEffect(() => {
    init();
  }, [match.params.id, match.params.version]);

  async function init() {
    await onChange({
      resourceID: match.params.id,
      version: match.params.version,
    });
    // console.log('8******88888*)OIIIIII');
    await dispatch<FetchDataSourceAction>({
      type: 'resourceVersionEditorPage/fetchDataSource',
    });
  }

  React.useEffect(() => {
    setEditor(BraftEditor.createEditorState(resourceVersionEditorPage.description));
  }, [resourceVersionEditorPage.description]);

  function onUpdateEditorText() {
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
  }

  async function onChange(payload: Partial<ResourceVersionEditorPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'resourceVersionEditorPage/change',
      payload,
    });
  }

  return (<>
    <Helmet>
      <title>{`版本 ${resourceVersionEditorPage.version} · ${resourceVersionEditorPage.resourceInfo?.resourceName || ''}  - Freelog`}</title>
    </Helmet>

    <FLeftSiderLayout
      sider={<Sider />}
      header={<Header
        version={resourceVersionEditorPage.version}
        signingDate={resourceVersionEditorPage.resourceVersionInfo?.createData || ''}
        resourceID={resourceVersionEditorPage.resourceID}
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
      />}>
      <FFormLayout>
        <FFormLayout.FBlock
          title={FI18n.i18nNext.t('version_description')}
          extra={<Space size={10}>
            {
              isEditing
                ? (<>
                  <FComponentsLib.FTextBtn
                    type='default'
                    onClick={() => {
                      onChange({ descriptionFullScreen: true });
                    }}
                  >全屏编辑</FComponentsLib.FTextBtn>
                  <FDivider />
                  <FComponentsLib.FTextBtn
                    type='default'
                    onClick={() => setIsEditing(false)}
                  >{FI18n.i18nNext.t('cancel')}</FComponentsLib.FTextBtn>
                  <FComponentsLib.FTextBtn
                    type='primary'
                    onClick={onUpdateEditorText}
                  >{FI18n.i18nNext.t('save')}</FComponentsLib.FTextBtn>
                </>)
                : resourceVersionEditorPage.description !== ''
                  ? (<>
                    <FComponentsLib.FTextBtn
                      type='default'
                      onClick={() => {
                        onChange({ descriptionFullScreen: true });
                        // const s = self.open();
                        // s.document.write(buildPreviewHtml(resourceVersionEditorPage.description))
                      }}
                    >全屏查看</FComponentsLib.FTextBtn>
                    <FDivider />
                    <FComponentsLib.FTextBtn
                      type='primary'
                      onClick={() => setIsEditing(true)}
                    >编辑</FComponentsLib.FTextBtn>
                  </>)
                  : undefined
            }
          </Space>}
        >

          {
            !resourceVersionEditorPage.description && !isEditing
            && (<div className={styles.noDescription}>
              <FComponentsLib.FTipText
                text={'动动手，让你的资源看起来更丰富多彩吧～'}
                type='second'
              />
              <div style={{ height: 20 }} />
              <FComponentsLib.FRectBtn onClick={() => {
                setIsEditing(true);
              }}>添加版本描述</FComponentsLib.FRectBtn>
            </div>)
          }

          {
            isEditing
              ? (<FBraftEditor
                value={editor}
                // defaultValue={editorText}
                onChange={(value: EditorState) => setEditor(value)}
                style={{ height: 500 }}
              />)
              : (resourceVersionEditorPage.description && (
                <div className={styles.description}>
                  <div
                    className={styles.container}
                    dangerouslySetInnerHTML={{ __html: resourceVersionEditorPage.description }}
                  />
                </div>))
          }
        </FFormLayout.FBlock>
        {
          resourceVersionEditorPage.graphShow && (<FFormLayout.FBlock
            title={'相关视图'}
          >

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

          </FFormLayout.FBlock>)
        }


        <FFormLayout.FBlock title={'基础属性'}>
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

        </FFormLayout.FBlock>

        {
          resourceVersionEditorPage.customConfigurations.length > 0 && (<FFormLayout.FBlock title={'自定义选项'}>
            {/*<div style={{ padding: 15, backgroundColor: '#F7F8F9' }}>*/}
            <FResourceOptions
              theme={'dark'}
              dataSource={resourceVersionEditorPage.customConfigurations}
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
            {/*</div>*/}
          </FFormLayout.FBlock>)
        }

      </FFormLayout>
    </FLeftSiderLayout>

    <FDrawer
      open={resourceVersionEditorPage.descriptionFullScreen}
      title={'版本描述'}
      destroyOnClose
      mask={false}
      onClose={() => {
        onChange({ descriptionFullScreen: false });
      }}
      width={'100%'}
      topRight={<Space size={25}>
        {isEditing
          ? (<>
            <FComponentsLib.FTextBtn
              type='default'
              onClick={() => {
                onChange({ descriptionFullScreen: false });
              }}
            >取消全屏</FComponentsLib.FTextBtn>
            <FDivider />
            <FComponentsLib.FTextBtn
              type='default'
              onClick={() => {
                setIsEditing(false);
                if (!resourceVersionEditorPage.description) {
                  onChange({ descriptionFullScreen: false });
                }
              }}
            >{FI18n.i18nNext.t('cancel')}</FComponentsLib.FTextBtn>
            <FComponentsLib.FTextBtn
              type='primary'
              onClick={onUpdateEditorText}
            >{FI18n.i18nNext.t('save')}</FComponentsLib.FTextBtn>
          </>)
          : (<>
            <FComponentsLib.FTextBtn
              type='default'
              onClick={() => {
                onChange({ descriptionFullScreen: false });
              }}
            >取消全屏</FComponentsLib.FTextBtn>
            <FDivider />
            <FComponentsLib.FTextBtn
              type='primary'
              onClick={() => setIsEditing(true)}
            >编辑</FComponentsLib.FTextBtn>
          </>)}
      </Space>}
    >
      <div className={styles.fullScreenContent}>
        {
          isEditing
            ? (<FBraftEditor
              value={editor}
              style={{
                height: 'calc(100vh - 130px)',
                width: 950,
              }}
              // defaultValue={editorText}
              onChange={(value: EditorState) => setEditor(value)}
            />)
            : (resourceVersionEditorPage.description && (
              <div
                className={styles.description}
                style={{
                  height: 'calc(100vh - 130px)',
                }}
              >
                <div
                  className={styles.container}
                  dangerouslySetInnerHTML={{ __html: resourceVersionEditorPage.description }}
                />
              </div>))
        }
      </div>
    </FDrawer>
  </>);
}

export default withRouter(connect(({ resourceVersionEditorPage, resourceInfo }: ConnectState) => ({
  // $version: resourceVersionEditorPage,
  resourceVersionEditorPage: resourceVersionEditorPage,
  resourceInfo: resourceInfo,
}))(VersionEditor));

interface HeaderProps {
  version: string;
  resourceID: string;
  signingDate: string;
  isCartoon: boolean;

  onClickDownload?(type?: string): void;
}

function Header({
                  version,
                  resourceID,
                  signingDate,
                  onClickDownload,
                  isCartoon,
                }: HeaderProps) {

  return (
    <div className={styles.Header}>
      <FComponentsLib.FTitleText text={version} type='h1' />
      <div style={{ height: 10 }} />
      <Space size={0}>
        <FComponentsLib.FContentText type='additional2' text={FI18n.i18nNext.t('release_date') + '：' + signingDate} />
        <div style={{ width: 40 }} />
        <FComponentsLib.FContentText type='additional2' text={FI18n.i18nNext.t('object_id') + '：' + resourceID} />
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

// interface FieldProps {
//   dot?: boolean;
//   title: string;
//   topRight?: React.ReactNode;
//   children?: React.ReactNode;
//   className?: string;
// }
//
// function Field({ className, dot = false, title, topRight, children }: FieldProps) {
//   return (<div className={styles.Field + ' ' + (className || '')}>
//       <div className={styles.header}>
//         <div className={styles.FieldTitle}>
//           {dot && <i className={styles.dot} />}
//           <span>{title}</span>
//         </div>
//         <div>{topRight}</div>
//       </div>
//       <div style={{ height: 5 }} />
//       {children}
//     </div>
//   );
// }

// 富文本内容预览
/**
 <!Doctype html>
 <html>
 <head>
 <title>Preview Content</title>
 <style>
 html,body{
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: auto;
            background-color: #f1f2f3;
          }
 .container{
            box - sizing: border-box;
            width: 1000px;
            max-width: 100%;
            min-height: 100%;
            margin: 0 auto;
            padding: 30px 20px;
            overflow: hidden;
            background-color: #fff;
            border-right: solid 1px #eee;
            border-left: solid 1px #eee;
          }
 .container img,
 .container audio,
 .container video{
            max - width: 100%;
            height: auto;
          }
 .container p{
            white - space: pre-wrap;
            min-height: 1em;
          }
 .container pre{
            padding: 15px;
            background-color: #f1f1f1;
            border-radius: 5px;
          }
 .container blockquote{
            margin: 0;
            padding: 15px;
            background-color: #f1f1f1;
            border-left: 3px solid #d1d1d1;
          }
 </style>
 </head>
 <body>
 <div class="container">${this.state.editorState.toHTML()}</div>
 </body>
 </html>
 **/


function buildPreviewHtml(htmlStr: string) {

  return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class='container'>${htmlStr}</div>
        </body>
      </html>
    `;
}
