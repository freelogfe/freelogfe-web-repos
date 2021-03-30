import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import {FCircleButton, FTextButton, FNormalButton} from '@/components/FButton';
import {Col, Row, Space} from 'antd';
import FBraftEditor from '@/components/FBraftEditor';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceInfoModelState, ResourceVersionEditorPageModelState} from '@/models/connect';
import FHorn from '@/pages/resource/components/FHorn';
import {
  UpdateDataSourceAction,
  ChangeAction,
  FetchDataSourceAction,
  SyncAllPropertiesAction
} from '@/models/resourceVersionEditorPage';
import BraftEditor, {EditorState} from 'braft-editor';
import {i18nMessage} from '@/utils/i18n';
import {ChangeAction as GlobalChangeAction} from '@/models/global';
import RouterTypes from 'umi/routerTypes';
import {router, withRouter} from 'umi';
import {resourcesDownload} from "@/services/resources";
import FInput from "@/components/FInput";
import FSelect from "@/components/FSelect";
import FTooltip from "@/components/FTooltip";
import {FEdit, FInfo} from "@/components/FIcons";
import {CUSTOM_KEY} from "@/utils/regexp";
import FLeftSiderLayout from "@/layouts/FLeftSiderLayout";
import Sider from "@/pages/resource/layouts/FInfoLayout/Sider";
import FFormLayout from "@/layouts/FFormLayout";
import FNoDataTip from "@/components/FNoDataTip";
import FDrawer from "@/components/FDrawer";
import FDownload from "@/components/FIcons/FDownload";
import {
  FAntvG6AuthorizationGraph,
  FAntvG6DependencyGraph,
  FAntvG6RelationshipGraph,
  FViewportTabs
} from "@/components/FAntvG6";

interface VersionEditorProps {
  dispatch: Dispatch;
  // version: ResourceVersionEditorPageModelState;
  resourceVersionEditorPage: ResourceVersionEditorPageModelState;
  match: {
    params: {
      id: string;
      version: string;
    }
  }
}

function VersionEditor({dispatch, route, resourceVersionEditorPage, match}: VersionEditorProps & RouterTypes) {

  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [editor, setEditor] = React.useState<EditorState>(BraftEditor.createEditorState(resourceVersionEditorPage.description));

  // if (!resourceInfo.hasPermission) {
  //   return (<div>
  //     <FNoDataTip
  //       height={}
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
  }, [route]);

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

  // React.useEffect(() => {
  //   setProperties(version.properties);
  // }, [version.properties]);

  function onUpdateEditorText() {
    dispatch<UpdateDataSourceAction>({
      type: 'resourceVersionEditorPage/updateDataSource',
      payload: {
        description: editor.toHTML(),
      }
    });
    setIsEditing(false);
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
      }
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
    <FLeftSiderLayout
      sider={<Sider/>}
      header={<Header
        version={resourceVersionEditorPage.version}
        signingDate={resourceVersionEditorPage.signingDate}
        resourceID={resourceVersionEditorPage.resourceID}
        // onClickDownload={() => window.location.href = apiHost + `/v2/resources/${match.params.id}/versions/${match.params.version}/download`}
        onClickDownload={() => resourcesDownload({resourceId: match.params.id, version: match.params.version})}
      />}>
      <FFormLayout>
        <FFormLayout.FBlock title={i18nMessage('version_description')}>

          {!resourceVersionEditorPage.description && !isEditing && (<Space size={10}>
            <FCircleButton
              onClick={() => setIsEditing(true)}
              theme="weaken"
            />
            <FContentText text={'添加'}/>
          </Space>)}

          {isEditing
            ? (<FHorn extra={<Space size={10}>
              <FTextButton onClick={() => setIsEditing(false)}>{i18nMessage('cancel')}</FTextButton>
              <FTextButton onClick={onUpdateEditorText} theme="primary">{i18nMessage('save')}</FTextButton>
            </Space>}>
              <FBraftEditor
                value={editor}
                // defaultValue={editorText}
                onChange={(value) => setEditor(value)}
              />
            </FHorn>)
            : (resourceVersionEditorPage.description && (<FHorn extra={<FTextButton
              onClick={() => setIsEditing(true)}
              theme="primary"
            >编辑</FTextButton>}>
              <div className={styles.description}>
                <div
                  className={styles.container}
                  dangerouslySetInnerHTML={{__html: resourceVersionEditorPage.description}}
                />
              </div>
            </FHorn>))
          }
        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={i18nMessage('version_maps')}>
          <FViewportTabs
            options={[
              {label: '关系树', value: 'relationship'},
              {label: '授权链', value: 'authorization'},
              {label: '依赖树', value: 'dependency'},
            ]}
            value={resourceVersionEditorPage.viewportGraphShow}
            onChange={(value) => {
              onChange({
                viewportGraphShow: value as 'relationship',
              });
            }}
          >
            {
              resourceVersionEditorPage.viewportGraphShow === 'relationship' && (<FAntvG6RelationshipGraph
                nodes={resourceVersionEditorPage.relationGraphNodes}
                edges={resourceVersionEditorPage.relationGraphEdges}
                width={860}
              />)
            }

            {
              resourceVersionEditorPage.viewportGraphShow === 'authorization' && (<FAntvG6AuthorizationGraph
                nodes={resourceVersionEditorPage.authorizationGraphNodes}
                edges={resourceVersionEditorPage.authorizationGraphEdges}
                width={860}
              />)
            }

            {
              resourceVersionEditorPage.viewportGraphShow === 'dependency' && (<FAntvG6DependencyGraph
                nodes={resourceVersionEditorPage.dependencyGraphNodes}
                edges={resourceVersionEditorPage.dependencyGraphEdges}
                width={860}
              />)
            }
          </FViewportTabs>
        </FFormLayout.FBlock>

        <FFormLayout.FBlock title={'基础属性'}>
          <div className={styles.attributesBody}>
            <Row gutter={[20, 20]}>
              {
                resourceVersionEditorPage.rawProperties.map((rp) => {
                  return (<Col key={rp.key} span={6}>
                    <FContentText text={rp.key} type="additional2"/>
                    <div style={{height: 10}}/>
                    <FContentText singleRow text={rp.value}/>
                  </Col>)
                })
              }

              {
                resourceVersionEditorPage.baseProperties.map((bp) => {
                  return (<Col
                    key={bp.key}
                    span={6}
                  >
                    <div className={styles.baseProperty}>
                      <div>
                        <Space size={5}>
                          <FContentText text={bp.key} type="additional2"/>
                          {bp.description && (<FTooltip title={bp.description}><FInfo/></FTooltip>)}
                        </Space>
                        <div style={{height: 10}}/>
                        <FContentText singleRow text={bp.value}/>
                      </div>
                      <FTextButton onClick={() => {
                        onChange({
                          basePEditorVisible: true,
                          basePKeyInput: bp.key,
                          basePValueInput: bp.value,
                          basePDescriptionInput: bp.description,
                          basePDescriptionInputError: '',
                        });
                      }}>
                        <FEdit/>
                      </FTextButton>
                    </div>
                  </Col>)
                })
              }

            </Row>
          </div>
        </FFormLayout.FBlock>

        {
          resourceVersionEditorPage.customOptions?.length > 0 && <FFormLayout.FBlock title={'自定义选项'}>
            <Space
              className={styles.properties}
              size={15}
              direction="vertical"
            >
              {
                resourceVersionEditorPage.customOptions.map((ppp) => {
                  return (<Space className={styles.customOption} key={ppp.key}>
                    <div className={styles.Content}>
                      <div style={{height: 10}}/>
                      <Space size={20} className={styles.row}>
                        <Field title={i18nMessage('key')} dot={true}>
                          <FInput
                            disabled
                            wrapClassName={styles.FInputWrap}
                            value={ppp.key}
                          />
                        </Field>
                        <Field title={i18nMessage('property_remark')}>
                          <FInput
                            wrapClassName={styles.FInputWrap}
                            value={ppp.description}
                            disabled
                          />
                        </Field>
                      </Space>

                      <div style={{height: 15}}/>
                      <Space style={{padding: '0 20px', alignItems: 'flex-start'}} size={20}>
                        <Field
                          className={styles.FSelect}
                          title={i18nMessage('value_input_mode')}
                        >
                          <FSelect
                            disabled
                            value={ppp.custom}
                            className={styles.FSelect}
                            dataSource={[
                              {value: 'input', title: i18nMessage('textfield')},
                              {value: 'select', title: i18nMessage('dropdownlist')},
                            ]}
                          />
                        </Field>

                        {
                          ppp.custom === 'select'
                            ? (<Field
                              dot={true}
                              title={'自定义选项(首个选项为默认值)'}
                              className={styles.customOptions}
                            >
                              <FInput
                                disabled
                                wrapClassName={styles.FInputWrap}
                                value={ppp.customOption}
                              />
                            </Field>)
                            : (<Field
                              // title={i18nMessage('value')}
                              title={'自定义选项(填写一个默认值)'}
                              dot={true}
                            >
                              <FInput
                                disabled
                                wrapClassName={styles.FInputWrap}
                                value={ppp.defaultValue}
                              />
                            </Field>)
                        }

                      </Space>
                      <div style={{height: 15}}/>
                    </div>

                    <div>
                      <FTextButton onClick={() => {
                        onChange({
                          customOptionEditorVisible: true,
                          customOptionKey: ppp.key,
                          customOptionDescription: ppp.description,
                          customOptionDescriptionError: '',
                          customOptionCustom: ppp.custom,
                          customOptionDefaultValue: ppp.defaultValue,
                          customOptionDefaultValueError: '',
                          customOptionCustomOption: ppp.customOption,
                          customOptionCustomOptionError: '',
                        });
                      }}><FEdit/></FTextButton>
                    </div>
                  </Space>)
                })
              }
            </Space>
          </FFormLayout.FBlock>}
      </FFormLayout>
      {/*</FContentLayout>*/}
    </FLeftSiderLayout>

    <FDrawer
      title={'编辑基础属性'}
      onClose={() => {
        onCloseBaseAttrDrawer();
      }}
      visible={resourceVersionEditorPage.basePEditorVisible}
      width={720}
      topRight={<Space size={30}>
        <FTextButton
          onClick={() => {
            onCloseBaseAttrDrawer();
          }}
        >取消</FTextButton>

        <FNormalButton
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
        >保存</FNormalButton>
      </Space>}
    >
      <Space
        size={20}
        direction="vertical"
        style={{width: '100%'}}
      >
        <div className={styles.input}>
          <div className={styles.title}>
            <i className={styles.dot}/>
            <FTitleText type="form">key</FTitleText>
          </div>
          <div style={{height: 5}}/>
          <FInput
            disabled={true}
            value={resourceVersionEditorPage.basePKeyInput}
            className={styles.input}
          />
        </div>

        <div className={styles.input}>
          <div className={styles.title}>
            <i className={styles.dot}/>
            <FTitleText type="form">value</FTitleText>
          </div>
          <div style={{height: 5}}/>
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
            <div style={{height: 5}}/>
            <div className={styles.errorTip}>{resourceVersionEditorPage.basePValueInputError}</div>
          </>)}
        </div>

        <div className={styles.input}>
          <div className={styles.title}>
            <FTitleText type="form">属性说明</FTitleText>
          </div>
          <div style={{height: 5}}/>
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

      {/*<div style={{height: 20}}/>*/}
      {/*<div className={styles.save}>*/}
      {/*  */}
      {/*</div>*/}
    </FDrawer>

    <FDrawer
      title={'编辑自定义属性'}
      onClose={() => {
        onCloseCustomOptionDrawer();
      }}
      visible={resourceVersionEditorPage.customOptionEditorVisible}
      width={720}
      topRight={<Space size={30}>
        <FTextButton
          onClick={() => {
            onCloseCustomOptionDrawer();
          }}
        >取消</FTextButton>
        <FNormalButton
          disabled={!!resourceVersionEditorPage.customOptionDescriptionError || (resourceVersionEditorPage.customOptionCustom === 'input' ? !!resourceVersionEditorPage.customOptionDefaultValueError : !!resourceVersionEditorPage.customOptionCustomOptionError)}
          onClick={async () => {
            await onChange({
              customOptions: resourceVersionEditorPage.customOptions
                .map<ResourceVersionEditorPageModelState['customOptions'][number]>((bp) => {
                  if (bp.key !== resourceVersionEditorPage.customOptionKey) {
                    return bp;
                  }
                  return {
                    ...bp,
                    description: resourceVersionEditorPage.customOptionDescription,
                    defaultValue: resourceVersionEditorPage.customOptionDefaultValue,
                    customOption: resourceVersionEditorPage.customOptionCustomOption,
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
        >保存</FNormalButton>
      </Space>}
    >
      <Space
        className={styles.properties}
        size={15}
        direction="vertical"
      >
        <div>
          <div className={styles.Content}>
            <div style={{height: 10}}/>
            <Space size={20} className={styles.row}>
              <Field title={i18nMessage('key')} dot={true}>
                <FInput
                  disabled
                  wrapClassName={styles.FInputWrap}
                  value={resourceVersionEditorPage.customOptionKey}
                />
              </Field>
              <Field title={i18nMessage('property_remark')}>
                <FInput
                  wrapClassName={styles.FInputWrap}
                  // errorText={resourceVersionEditorPage.customOptionDescriptionError}
                  value={resourceVersionEditorPage.customOptionDescription}
                  onChange={(e) => {
                    const value: string = e.target.value;
                    let descriptionError: string = '';
                    if (value.length > 50) {
                      descriptionError = '不超过50个字符';
                    }
                    onChange({
                      customOptionDescription: value,
                      customOptionDescriptionError: descriptionError,
                    });
                  }}
                />
                {resourceVersionEditorPage.customOptionDescriptionError && (<>
                  <div style={{height: 5}}/>
                  <div className={styles.errorTip}>{resourceVersionEditorPage.customOptionDescriptionError}</div>
                </>)}
              </Field>
            </Space>

            <div style={{height: 15}}/>
            <Space style={{padding: '0 20px', alignItems: 'flex-start'}} size={20}>
              <Field
                className={styles.FSelect}
                title={i18nMessage('value_input_mode')}
              >
                <FSelect
                  disabled
                  value={resourceVersionEditorPage.customOptionCustom}
                  className={styles.FSelect}
                  dataSource={[
                    {value: 'input', title: i18nMessage('textfield')},
                    {value: 'select', title: i18nMessage('dropdownlist')},
                  ]}
                />
              </Field>

              {
                resourceVersionEditorPage.customOptionCustom === 'select'
                  ? (<Field
                    dot={true}
                    title={'自定义选项(首个选项为默认值)'}
                    className={styles.customOptions}
                  >
                    <FInput
                      wrapClassName={styles.FInputWrap}
                      value={resourceVersionEditorPage.customOptionCustomOption}
                      onChange={(e) => {
                        const value: string = e.target.value;
                        let customOptionError: string = '';

                        if (value === '') {
                          customOptionError = '请输入';
                        } else if (value.length > 500) {
                          customOptionError = '不超过500个字符';
                        }

                        if (!customOptionError) {
                          const allOptions = value.split(',');
                          const setS = new Set(allOptions);
                          if (setS.size !== allOptions.length) {
                            customOptionError = '选项不能重复';
                          }
                        }

                        onChange({
                          customOptionCustomOption: value,
                          customOptionCustomOptionError: customOptionError,
                        });
                      }}
                    />
                    {resourceVersionEditorPage.customOptionCustomOptionError && (<>
                      <div style={{height: 5}}/>
                      <div className={styles.errorTip}>{resourceVersionEditorPage.customOptionCustomOptionError}</div>
                    </>)}
                  </Field>)
                  : (<Field
                    // title={i18nMessage('value')}
                    title={'自定义选项(填写一个默认值)'}
                    dot={true}
                  >
                    <FInput
                      wrapClassName={styles.FInputWrap}
                      value={resourceVersionEditorPage.customOptionDefaultValue}
                      onChange={(e) => {
                        const value: string = e.target.value;
                        let valueError: string = '';
                        if (value === '') {
                          valueError = '请输入';
                        } else if (value.length > 30) {
                          valueError = '不超过30个字符';
                        }
                        onChange({
                          customOptionDefaultValue: value,
                          customOptionDefaultValueError: valueError,
                        });
                      }}
                    />
                    {resourceVersionEditorPage.customOptionDefaultValueError && (<>
                      <div style={{height: 5}}/>
                      <div className={styles.errorTip}>{resourceVersionEditorPage.customOptionDefaultValueError}</div>
                    </>)}
                  </Field>)
              }

            </Space>
            <div style={{height: 15}}/>
          </div>
        </div>
      </Space>

      <div style={{height: 20}}/>
      {/*<div className={styles.save}>*/}
      {/*  */}
      {/*</div>*/}
    </FDrawer>
  </>);
}

export default withRouter(connect(({resourceVersionEditorPage, resourceInfo}: ConnectState) => ({
  // version: resourceVersionEditorPage,
  resourceVersionEditorPage: resourceVersionEditorPage,
}))(VersionEditor));

interface HeaderProps {
  version: string;
  resourceID: string;
  signingDate: string;

  onClickDownload?(): void;
}

function Header({version, resourceID, signingDate, onClickDownload}: HeaderProps) {

  return (
    <div className={styles.Header}>
      <FTitleText text={version} type="h1"/>
      <div style={{height: 10}}/>
      <Space size={0}>
        <FContentText type="additional2" text={i18nMessage('release_date') + '：' + signingDate}/>
        <div style={{width: 40}}/>
        <FContentText type="additional2" text={i18nMessage('object_id') + '：' + resourceID}/>
        <div style={{width: 20}}/>
        <FTextButton theme="primary">
          <FDownload
            onClick={() => onClickDownload && onClickDownload()}
            style={{fontSize: 16, fontWeight: 600}}
          />
        </FTextButton>
      </Space>
    </div>
  );
}

interface FieldProps {
  dot?: boolean;
  title: string;
  topRight?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

function Field({className, dot = false, title, topRight, children}: FieldProps) {
  return (<div className={styles.Field + ' ' + (className || '')}>
      <div className={styles.header}>
        <div className={styles.FieldTitle}>
          {dot && <i className={styles.dot}/>}
          <span>{title}</span>
        </div>
        <div>{topRight}</div>
      </div>
      <div style={{height: 5}}/>
      {children}
    </div>
  );
}

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
