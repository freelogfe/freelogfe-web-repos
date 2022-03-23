import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import { FTextBtn, FRectBtn } from '@/components/FButton';
import { Space } from 'antd';
import FBraftEditor from '@/components/FBraftEditor';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceInfoModelState, ResourceVersionEditorPageModelState } from '@/models/connect';
import {
  UpdateDataSourceAction,
  ChangeAction,
  FetchDataSourceAction,
  SyncAllPropertiesAction,
} from '@/models/resourceVersionEditorPage';
import BraftEditor, { EditorState } from 'braft-editor';
import RouterTypes from 'umi/routerTypes';
import { withRouter } from 'umi';
import FInput from '@/components/FInput';
import FTooltip from '@/components/FTooltip';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Sider from '@/pages/resource/containers/Sider';
import FFormLayout from '@/components/FFormLayout';
import FDrawer from '@/components/FDrawer';
import FDownload from '@/components/FIcons/FDownload';
import {
  // FAntvG6AuthorizationGraph,
  // FAntvG6DependencyGraph,
  // FAntvG6RelationshipGraph,
  FViewportTabs,
} from '@/components/FAntvG6';
import FUtil1 from '@/utils';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import FDivider from '@/components/FDivider';
import { FTipText } from '@/components/FText';
import FCustomOptionsCards from '@/components/FCustomOptionsCards';
import { RouteComponentProps } from 'react-router';
import FBasePropertiesCards from '@/components/FBasePropertiesCards';
import FCustomOptionEditorDrawer from '@/components/FCustomOptionEditorDrawer';
import { Helmet } from 'react-helmet';
import FGraph_Tree_Relationship_Resource from '@/components/FAntvG6/FGraph_Tree_Relationship_Resource';
import FGraph_Tree_Authorization_Resource from '@/components/FAntvG6/FGraph_Tree_Authorization_Resource';
import FGraph_Tree_Dependency_Resource from '@/components/FAntvG6/FGraph_Tree_Dependency_Resource';

interface VersionEditorProps extends RouteComponentProps<{
  id: string;
  version: string;
}> {
  dispatch: Dispatch;
  // $version: ResourceVersionEditorPageModelState;
  resourceVersionEditorPage: ResourceVersionEditorPageModelState;
  resourceInfo: ResourceInfoModelState,
}

function VersionEditor({ dispatch, resourceInfo, resourceVersionEditorPage, match }: VersionEditorProps & RouterTypes) {
  // console.log(route, 'route!@#$@!#$@!#42134');

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

  function onUpdateProperties(data: any[]) {
    dispatch<UpdateDataSourceAction>({
      type: 'resourceVersionEditorPage/updateDataSource',
      payload: {
        customPropertyDescriptors: data.map((i) => ({
          key: i.key as string,
          defaultValue: i.value as string,
          type: !i.allowCustom ? 'readonlyText' : i.custom === 'input' ? 'editableText' : 'select',
          candidateItems: i.customOption ? i.customOption.split(',') : [],
          remark: i.description,
        })),
      },
    });
  }

  function onCloseCustomOptionDrawer() {
    onChange({
      customOptionEditorVisible: false,
      customOptionKey: '',
      customOptionDescription: '',
      customOptionDescriptionError: '',
      customOptionCustom: 'input',
      customOptionDefaultValue: '',
      customOptionDefaultValueError: '',
      customOptionCustomOption: '',
      customOptionCustomOptionError: '',
    });
  }

  async function onChange(payload: Partial<ResourceVersionEditorPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'resourceVersionEditorPage/change',
      payload,
    });
  }

  function onCloseBaseAttrDrawer() {
    onChange({
      basePEditorVisible: false,
      basePKeyInput: '',
      basePValueInput: '',
      basePDescriptionInput: '',
      basePDescriptionInputError: '',
    });
  }

  return (<>
    <Helmet>
      <title>{`版本 ${resourceVersionEditorPage.version} · ${resourceInfo.info?.resourceName || ''}  - Freelog`}</title>
    </Helmet>

    <FLeftSiderLayout
      sider={<Sider />}
      header={<Header
        version={resourceVersionEditorPage.version}
        signingDate={resourceVersionEditorPage.signingDate}
        resourceID={resourceVersionEditorPage.resourceID}
        // onClickDownload={() => window.location.href = apiHost + `/v2/resources/${match.params.id}/versions/${match.params.$version}/download`}
        onClickDownload={() => {
          // FUtil.Format.completeUrlByDomain('qi') +
          FServiceAPI.Resource.resourcesDownload({
            resourceId: match.params.id,
            version: match.params.version,
          });
          // console.log(FUtil.Format.completeUrlByDomain('qi'), '1111111');
          // const href = FUtil.Format.completeUrlByDomain('qi') + `/v2/resources/${match.params.id}/versions/${match.params.version}/download`;
          // console.log(href, '!@#$@!#$');
          // return window.location.href;
        }}
      />}>
      <FFormLayout>
        <FFormLayout.FBlock
          title={FUtil1.I18n.message('version_description')}
          extra={<Space size={10}>
            {
              isEditing
                ? (<>
                  <FTextBtn
                    type='default'
                    onClick={() => {
                      onChange({ descriptionFullScreen: true });
                    }}
                  >全屏编辑</FTextBtn>
                  <FDivider />
                  <FTextBtn
                    type='default'
                    onClick={() => setIsEditing(false)}
                  >{FUtil1.I18n.message('cancel')}</FTextBtn>
                  <FTextBtn
                    type='primary'
                    onClick={onUpdateEditorText}
                  >{FUtil1.I18n.message('save')}</FTextBtn>
                </>)
                : !!resourceVersionEditorPage.description
                  ? (<>
                    <FTextBtn
                      type='default'
                      onClick={() => {
                        onChange({ descriptionFullScreen: true });
                      }}
                    >全屏查看</FTextBtn>
                    <FDivider />
                    <FTextBtn
                      type='primary'
                      onClick={() => setIsEditing(true)}
                    >编辑</FTextBtn>
                  </>)
                  : undefined
            }
          </Space>}
        >

          {
            !resourceVersionEditorPage.description && !isEditing
            && (<div className={styles.noDescription}>
              <FTipText
                text={'动动手，让你的资源看起来更丰富多彩吧～'}
                type='second'
              />
              <div style={{ height: 20 }} />
              <FRectBtn onClick={() => {
                setIsEditing(true);
              }}>添加版本描述</FRectBtn>
            </div>)
          }

          {
            isEditing
              ? (<FBraftEditor
                value={editor}
                // defaultValue={editorText}
                onChange={(value) => setEditor(value)}
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
        <FFormLayout.FBlock
          title={'相关视图'}
          extra={<FTextBtn
            type='default'
            onClick={() => {
              onChange({
                graphFullScreen: true,
              });
            }}
          >全屏查看</FTextBtn>}
        >
          <FViewportTabs
            options={[
              { label: '关系树', value: 'relationship' },
              { label: '授权链', value: 'authorization' },
              { label: '依赖树', value: 'dependency' },
            ]}
            value={resourceVersionEditorPage.viewportGraphShow}
            onChange={(value) => {
              onChange({
                viewportGraphShow: value as 'relationship',
              });
            }}
          >

            {
              resourceVersionEditorPage.graphFullScreen
                ? (<div style={{ height: 500 }} />)
                : (<>
                  {/*{*/}
                  {/*  resourceVersionEditorPage.viewportGraphShow === 'relationship' && (<FAntvG6RelationshipGraph*/}
                  {/*    nodes={resourceVersionEditorPage.relationGraphNodes}*/}
                  {/*    edges={resourceVersionEditorPage.relationGraphEdges}*/}
                  {/*    width={860}*/}
                  {/*  />)*/}
                  {/*}*/}
                  {
                    resourceVersionEditorPage.viewportGraphShow === 'relationship' && (<FGraph_Tree_Relationship_Resource
                      resourceID={resourceVersionEditorPage.resourceID}
                      version={resourceVersionEditorPage.version}
                      width={860}
                      height={500}
                    />)
                  }

                  {/*{*/}
                  {/*  resourceVersionEditorPage.viewportGraphShow === 'authorization' && (<FAntvG6AuthorizationGraph*/}
                  {/*    nodes={resourceVersionEditorPage.authorizationGraphNodes}*/}
                  {/*    edges={resourceVersionEditorPage.authorizationGraphEdges}*/}
                  {/*    width={860}*/}
                  {/*  />)*/}
                  {/*}*/}

                  {
                    resourceVersionEditorPage.viewportGraphShow === 'authorization' && (<FGraph_Tree_Authorization_Resource
                      resourceID={resourceVersionEditorPage.resourceID}
                      version={resourceVersionEditorPage.version}
                      width={860}
                      height={500}
                    />)
                  }

                  {/*{*/}
                  {/*  resourceVersionEditorPage.viewportGraphShow === 'dependency' && (<FAntvG6DependencyGraph*/}
                  {/*    nodes={resourceVersionEditorPage.dependencyGraphNodes}*/}
                  {/*    edges={resourceVersionEditorPage.dependencyGraphEdges}*/}
                  {/*    width={860}*/}
                  {/*  />)*/}
                  {/*}*/}

                  {
                    resourceVersionEditorPage.viewportGraphShow === 'dependency' && (<FGraph_Tree_Dependency_Resource
                      resourceID={resourceVersionEditorPage.resourceID}
                      version={resourceVersionEditorPage.version}
                      width={860}
                      height={500}
                    />)
                  }
                </>)
            }

          </FViewportTabs>

        </FFormLayout.FBlock>

        <FFormLayout.FBlock title={'基础属性'}>
          <FBasePropertiesCards
            rawProperties={resourceVersionEditorPage.rawProperties.map((rp) => {
              return {
                theKey: rp.key,
                value: rp.value,
              };
            })}
            baseProperties={resourceVersionEditorPage.baseProperties.map((bp) => {
              return {
                theKey: bp.key,
                description: bp.description,
                value: bp.value,
              };
            })}
            onEdit={(theKey) => {
              const baseP = resourceVersionEditorPage.baseProperties.find((bp) => {
                return bp.key === theKey;
              });
              if (!baseP) {
                return;
              }
              onChange({
                basePEditorVisible: true,
                basePKeyInput: baseP.key,
                basePValueInput: baseP.value,
                basePDescriptionInput: baseP.description,
                basePDescriptionInputError: '',
              });
            }}
          />

        </FFormLayout.FBlock>

        {
          resourceVersionEditorPage.customOptions?.length > 0 && (<FFormLayout.FBlock title={'自定义选项'}>
            <FCustomOptionsCards
              dataSource={resourceVersionEditorPage.customOptions.map((cos) => {
                return {
                  theKey: cos.key,
                  description: cos.description,
                  type: cos.custom,
                  value: cos.custom === 'select' ? cos.customOption : cos.defaultValue,
                };
              })}
              onEdit={(theKey) => {
                const customOption = resourceVersionEditorPage.customOptions.find((cos) => {
                  return cos.key === theKey;
                });
                if (!customOption) {
                  return;
                }
                onChange({
                  customOptionEditorVisible: true,
                  customOptionKey: customOption.key,
                  customOptionDescription: customOption.description,
                  customOptionDescriptionError: '',
                  customOptionCustom: customOption.custom,
                  customOptionDefaultValue: customOption.defaultValue,
                  customOptionDefaultValueError: '',
                  customOptionCustomOption: customOption.customOption,
                  customOptionCustomOptionError: '',
                });
              }}
            />
          </FFormLayout.FBlock>)
        }

      </FFormLayout>
    </FLeftSiderLayout>

    <FDrawer
      title={'编辑基础属性'}
      onClose={() => {
        onCloseBaseAttrDrawer();
      }}
      visible={resourceVersionEditorPage.basePEditorVisible}
      width={720}
      topRight={<Space size={30}>
        <FTextBtn
          type='default'
          onClick={() => {
            onCloseBaseAttrDrawer();
          }}
        >取消</FTextBtn>

        <FRectBtn
          type='primary'
          disabled={!!resourceVersionEditorPage.basePDescriptionInputError || !!resourceVersionEditorPage.basePValueInputError}
          onClick={async () => {
            await onChange({
              baseProperties: resourceVersionEditorPage.baseProperties.map((bp) => {
                if (bp.key !== resourceVersionEditorPage.basePKeyInput) {
                  return bp;
                }
                return {
                  ...bp,
                  value: resourceVersionEditorPage.basePValueInput,
                  description: resourceVersionEditorPage.basePDescriptionInput,
                };
              }),
              basePEditorVisible: false,
              basePKeyInput: '',
              basePValueInput: '',
              basePDescriptionInput: '',
              basePDescriptionInputError: '',
            });
            await dispatch<SyncAllPropertiesAction>({
              type: 'resourceVersionEditorPage/syncAllProperties',
            });
          }}
        >保存</FRectBtn>
      </Space>}
    >
      <Space
        size={20}
        direction='vertical'
        style={{ width: '100%' }}
      >
        <div className={styles.input}>
          <div className={styles.title}>
            <i className={styles.dot} />
            <FTitleText type='h4'>key</FTitleText>
          </div>
          <div style={{ height: 5 }} />
          <FInput
            disabled={true}
            value={resourceVersionEditorPage.basePKeyInput}
            className={styles.input}
          />
        </div>

        <div className={styles.input}>
          <div className={styles.title}>
            <i className={styles.dot} />
            <FTitleText type='h4'>value</FTitleText>
          </div>
          <div style={{ height: 5 }} />
          <FInput
            value={resourceVersionEditorPage.basePValueInput}
            // errorText={}
            className={styles.input}
            onChange={(e) => {
              const value: string = e.target.value;
              let valueError: string = '';
              if (value === '') {
                valueError = '请输入';
              } else if (value.length > 30) {
                valueError = '不超过30个字符';
              }
              onChange({
                basePValueInput: value,
                basePValueInputError: valueError,
              });
            }}
            placeholder={'输入value'}
          />
          {resourceVersionEditorPage.basePValueInputError && (<>
            <div style={{ height: 5 }} />
            <div className={styles.errorTip}>{resourceVersionEditorPage.basePValueInputError}</div>
          </>)}
        </div>

        <div className={styles.input}>
          <div className={styles.title}>
            <FTitleText type='h4'>属性说明</FTitleText>
          </div>
          <div style={{ height: 5 }} />
          <FInput
            value={resourceVersionEditorPage.basePDescriptionInput}
            errorText={resourceVersionEditorPage.basePDescriptionInputError}
            className={styles.input}
            onChange={(e) => {
              const value: string = e.target.value;
              let descriptionError: string = '';
              if (value.length > 50) {
                descriptionError = '不超过50个字符';
              }
              onChange({
                basePDescriptionInput: value,
                basePDescriptionInputError: descriptionError,
              });
            }}
            placeholder={'输入属性说明'}
          />
        </div>

      </Space>
    </FDrawer>

    <FCustomOptionEditorDrawer
      disabledKeyInput
      disabledValueTypeSelect
      visible={resourceVersionEditorPage.customOptionEditorVisible}
      dataSource={{
        key: resourceVersionEditorPage.customOptionKey,
        value: (resourceVersionEditorPage.customOptionCustom === 'input' ? resourceVersionEditorPage.customOptionDefaultValue : resourceVersionEditorPage.customOptionCustomOption) || '',
        description: resourceVersionEditorPage.customOptionDescription,
        valueType: resourceVersionEditorPage.customOptionCustom || 'input',
      }}
      onCancel={() => {
        onCloseCustomOptionDrawer();
      }}
      onConfirm={async (value) => {
        await onChange({
          customOptions: resourceVersionEditorPage.customOptions
            .map<ResourceVersionEditorPageModelState['customOptions'][number]>((bp) => {
              if (bp.key !== resourceVersionEditorPage.customOptionKey) {
                return bp;
              }
              return {
                ...bp,
                description: value.description,
                defaultValue: value.value,
                customOption: value.value,
              };
            }),
          customOptionEditorVisible: false,
          customOptionKey: '',
          customOptionDescription: '',
          customOptionDescriptionError: '',
          customOptionCustom: 'input',
          customOptionDefaultValue: '',
          customOptionDefaultValueError: '',
          customOptionCustomOption: '',
          customOptionCustomOptionError: '',
        });
        await dispatch<SyncAllPropertiesAction>({
          type: 'resourceVersionEditorPage/syncAllProperties',
        });
      }}
    />

    <FDrawer
      visible={resourceVersionEditorPage.graphFullScreen}
      title={'相关视图'}
      destroyOnClose
      width={'100%'}
      onClose={() => {
        onChange({
          graphFullScreen: false,
        });
      }}
    >

      <FViewportTabs
        options={[
          { label: '关系树', value: 'relationship' },
          { label: '授权链', value: 'authorization' },
          { label: '依赖树', value: 'dependency' },
        ]}
        value={resourceVersionEditorPage.viewportGraphShow}
        onChange={(value) => {
          onChange({
            viewportGraphShow: value as 'relationship',
          });
        }}
      >

        {/*{*/}
        {/*  resourceVersionEditorPage.viewportGraphShow === 'relationship' && (<FAntvG6RelationshipGraph*/}
        {/*    nodes={resourceVersionEditorPage.relationGraphNodes}*/}
        {/*    edges={resourceVersionEditorPage.relationGraphEdges}*/}
        {/*    width={window.innerWidth - 60}*/}
        {/*    height={window.innerHeight - 60 - 70 - 50}*/}
        {/*  />)*/}
        {/*}*/}

        {
          resourceVersionEditorPage.viewportGraphShow === 'relationship' && (<FGraph_Tree_Relationship_Resource
            resourceID={resourceVersionEditorPage.resourceID}
            version={resourceVersionEditorPage.version}
            width={window.innerWidth - 60}
            height={window.innerHeight - 60 - 70 - 50}
          />)
        }

        {/*{*/}
        {/*  resourceVersionEditorPage.viewportGraphShow === 'authorization' && (<FAntvG6AuthorizationGraph*/}
        {/*    nodes={resourceVersionEditorPage.authorizationGraphNodes}*/}
        {/*    edges={resourceVersionEditorPage.authorizationGraphEdges}*/}
        {/*    width={window.innerWidth - 60}*/}
        {/*    height={window.innerHeight - 60 - 70 - 50}*/}
        {/*  />)*/}
        {/*}*/}
        {
          resourceVersionEditorPage.viewportGraphShow === 'authorization' && (<FGraph_Tree_Authorization_Resource
            resourceID={resourceVersionEditorPage.resourceID}
            version={resourceVersionEditorPage.version}
            width={window.innerWidth - 60}
            height={window.innerHeight - 60 - 70 - 50}
          />)
        }

        {/*{*/}
        {/*  resourceVersionEditorPage.viewportGraphShow === 'dependency' && (<FAntvG6DependencyGraph*/}
        {/*    nodes={resourceVersionEditorPage.dependencyGraphNodes}*/}
        {/*    edges={resourceVersionEditorPage.dependencyGraphEdges}*/}
        {/*    width={window.innerWidth - 60}*/}
        {/*    height={window.innerHeight - 60 - 70 - 50}*/}
        {/*  />)*/}
        {/*}*/}

        {
          resourceVersionEditorPage.viewportGraphShow === 'dependency' && (<FGraph_Tree_Dependency_Resource
            resourceID={resourceVersionEditorPage.resourceID}
            version={resourceVersionEditorPage.version}
            width={window.innerWidth - 60}
            height={window.innerHeight - 60 - 70 - 50}
          />)
        }
      </FViewportTabs>
    </FDrawer>

    <FDrawer
      visible={resourceVersionEditorPage.descriptionFullScreen}
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
            <FTextBtn
              type='default'
              onClick={() => {
                onChange({ descriptionFullScreen: false });
              }}
            >取消全屏</FTextBtn>
            <FDivider />
            <FTextBtn
              type='default'
              onClick={() => {
                setIsEditing(false);
                if (!resourceVersionEditorPage.description) {
                  onChange({ descriptionFullScreen: false });
                }
              }}
            >{FUtil1.I18n.message('cancel')}</FTextBtn>
            <FTextBtn
              type='primary'
              onClick={onUpdateEditorText}
            >{FUtil1.I18n.message('save')}</FTextBtn>
          </>)
          : (<>
            <FTextBtn
              type='default'
              onClick={() => {
                onChange({ descriptionFullScreen: false });
              }}
            >取消全屏</FTextBtn>
            <FDivider />
            <FTextBtn
              type='primary'
              onClick={() => setIsEditing(true)}
            >编辑</FTextBtn>
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
              onChange={(value) => setEditor(value)}
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

  onClickDownload?(): void;
}

function Header({ version, resourceID, signingDate, onClickDownload }: HeaderProps) {

  return (
    <div className={styles.Header}>
      <FTitleText text={version} type='h1' />
      <div style={{ height: 10 }} />
      <Space size={0}>
        <FContentText type='additional2' text={FUtil1.I18n.message('release_date') + '：' + signingDate} />
        <div style={{ width: 40 }} />
        <FContentText type='additional2' text={FUtil1.I18n.message('object_id') + '：' + resourceID} />
        <div style={{ width: 20 }} />
        <FTooltip title={'下载'}>
          <div>
            <FTextBtn
              type='primary'
              onClick={() => onClickDownload && onClickDownload()}
            >
              <FDownload
                style={{ fontSize: 16, fontWeight: 600 }}
              />
            </FTextBtn>
          </div>
        </FTooltip>
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
