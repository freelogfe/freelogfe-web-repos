import * as React from 'react';
import styles from './index.less';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';
import {FContentText, FTitleText} from '@/components/FText';
import FInfoLayout from '@/pages/resource/layouts/FInfoLayout';
import FEditorCard from '@/components/FEditorCard';
import {FCircleButton, FTextButton, FNormalButton} from '@/components/FButton';
import {Col, Drawer, Row, Space} from 'antd';
import {DownloadOutlined, CloseCircleFilled} from '@ant-design/icons';
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


interface VersionEditorProps {
  dispatch: Dispatch;
  version: ResourceVersionEditorPageModelState;
  resourceVersionEditorPage: ResourceVersionEditorPageModelState;
  resourceInfo: ResourceInfoModelState;
  match: {
    params: {
      id: string;
      version: string;
    }
  }
}

function VersionEditor({dispatch, route, version, resourceVersionEditorPage, match, resourceInfo}: VersionEditorProps & RouterTypes) {

  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [editor, setEditor] = React.useState<EditorState>(BraftEditor.createEditorState(version.description));
  // const [properties, setProperties] = React.useState<ResourceVersionEditorPageModelState['properties']>([]);

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
  }, [route]);

  React.useEffect(() => {
    init();
  }, [match.params.id, match.params.version]);

  async function init() {
    await dispatch<ChangeAction>({
      type: 'resourceVersionEditorPage/change',
      payload: {
        resourceID: match.params.id,
        version: match.params.version,
      },
    });
    console.log('8******88888*)OIIIIII');
    await dispatch<FetchDataSourceAction>({
      type: 'resourceVersionEditorPage/fetchDataSource',
    });
  }

  React.useEffect(() => {
    setEditor(BraftEditor.createEditorState(version.description));
  }, [version.description]);

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

  return (<>
    <FLeftSiderLayout
      sider={<Sider/>}
      header={<Header
        version={version.version}
        signingDate={version.signingDate}
        resourceID={version.resourceID}
        // onClickDownload={() => window.location.href = apiHost + `/v2/resources/${match.params.id}/versions/${match.params.version}/download`}
        onClickDownload={() => resourcesDownload({resourceId: match.params.id, version: match.params.version})}
      />}>
      {/*<FContentLayout*/}
      {/*  header={<Header*/}
      {/*    version={version.version}*/}
      {/*    signingDate={version.signingDate}*/}
      {/*    resourceID={version.resourceID}*/}
      {/*    // onClickDownload={() => window.location.href = apiHost + `/v2/resources/${match.params.id}/versions/${match.params.version}/download`}*/}
      {/*    onClickDownload={() => resourcesDownload({resourceId: match.params.id, version: match.params.version})}*/}
      {/*  />}>*/}
      <FFormLayout>
        <FFormLayout.FBlock title={i18nMessage('version_description')}>

          {!version.description && !isEditing && (<Space size={10}>
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
            : (version.description && (<FHorn extra={<FTextButton
              onClick={() => setIsEditing(true)}
              theme="primary"
            >编辑</FTextButton>}>
              <div className={styles.description}>
                <div
                  className={styles.container}
                  dangerouslySetInnerHTML={{__html: version.description}}
                />
              </div>
            </FHorn>))
          }
        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={i18nMessage('version_maps')}>
          <div className={styles.diagram}/>
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
                        dispatch<ChangeAction>({
                          type: 'resourceVersionEditorPage/change',
                          payload: {
                            basePEditorVisible: true,
                            basePKeyInput: bp.key,
                            basePValueInput: bp.value,
                            basePDescriptionInput: bp.description,
                            basePDescriptionInputError: '',
                          },
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

        {/*{properties?.length > 0 && <FEditorCard title={i18nMessage('object_property')}>*/}
        {
          resourceVersionEditorPage.properties?.length > 0 && <FFormLayout.FBlock title={'自定义选项'}>
            <Space
              className={styles.properties}
              size={15}
              direction="vertical"
            >
              {
                resourceVersionEditorPage.properties.map((ppp) => {
                  return (<div key={ppp.key}>
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
                        <Field
                          title={i18nMessage('property_remark')}
                          topRight={!ppp.descriptionIsEditing ? (<FTextButton
                            onClick={() => {
                              dispatch<ChangeAction>({
                                type: 'resourceVersionEditorPage/change',
                                payload: {
                                  properties: resourceVersionEditorPage.properties.map((pt) => {
                                    if (pt.key !== ppp.key) {
                                      return pt;
                                    }
                                    return {
                                      ...pt,
                                      descriptionIsEditing: true,
                                    };
                                  })
                                }
                              });
                            }}
                          ><FEdit/></FTextButton>) : (<Space size={5}>
                            <FTextButton onClick={() => {
                              dispatch<ChangeAction>({
                                type: 'resourceVersionEditorPage/change',
                                payload: {
                                  properties: resourceVersionEditorPage.properties.map((pt) => {
                                    if (pt.key !== ppp.key) {
                                      return pt;
                                    }
                                    return {
                                      ...pt,
                                      descriptionIsEditing: false,
                                    };
                                  })
                                }
                              });
                            }}>取消</FTextButton>
                            <FTextButton
                              disabled={!!ppp.descriptionError}
                              theme="primary"
                              onClick={async () => {
                                await dispatch<ChangeAction>({
                                  type: 'resourceVersionEditorPage/change',
                                  payload: {
                                    properties: resourceVersionEditorPage.properties.map((pt) => {
                                      if (pt.key !== ppp.key) {
                                        return pt;
                                      }
                                      return {
                                        ...pt,
                                        description: pt.descriptionInput,
                                        descriptionIsEditing: false,
                                      };
                                    })
                                  }
                                });
                                await dispatch<SyncAllPropertiesAction>({
                                  type: 'resourceVersionEditorPage/syncAllProperties',
                                });
                              }}
                            >保存</FTextButton>
                          </Space>)}
                        >
                          <FInput
                            wrapClassName={styles.FInputWrap}
                            value={ppp.descriptionIsEditing ? ppp.descriptionInput : ppp.description}
                            disabled={!ppp.descriptionIsEditing}
                            errorText={ppp.descriptionError}
                            onChange={(e) => {
                              const value: string = e.target.value;
                              let descriptionError: string = '';
                              if (value.length > 50) {
                                descriptionError = '不超过50个字符';
                              }
                              dispatch<ChangeAction>({
                                type: 'resourceVersionEditorPage/change',
                                payload: {
                                  properties: resourceVersionEditorPage.properties.map((pt) => {
                                    if (pt.key !== ppp.key) {
                                      return pt;
                                    }
                                    return {
                                      ...pt,
                                      descriptionInput: value,
                                      descriptionError: descriptionError,
                                    };
                                  })
                                }
                              });
                            }}
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
                                onChange={(e) => {
                                  const value: string = e.target.value;
                                  let customOptionError: string = '';

                                  if (value === '') {
                                    customOptionError = '请输入';
                                  } else if (value.length > 500) {
                                    customOptionError = '不超过500个字符';
                                  }

                                }}
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
                                onChange={(e) => {
                                  const value: string = e.target.value;
                                  let valueError: string = '';
                                  if (value === '') {
                                    valueError = '请输入';
                                  } else if (value.length > 30) {
                                    valueError = '不超过30个字符';
                                  }
                                }}
                              />
                            </Field>)
                        }

                      </Space>
                      <div style={{height: 15}}/>
                    </div>
                  </div>)
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
        dispatch<ChangeAction>({
          type: 'resourceVersionEditorPage/change',
          payload: {
            basePEditorVisible: false,
            basePKeyInput: '',
            basePValueInput: '',
            basePDescriptionInput: '',
            basePDescriptionInputError: '',
          }
        });
      }}
      visible={resourceVersionEditorPage.basePEditorVisible}
      width={720}
      // className={styles}
      // bodyStyle={{paddingLeft: 40, paddingRight: 40, overflow: 'auto'}}
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
            // errorText={'ds.keyError'}
            className={styles.input}
            onChange={(e) => {
              const value: string = e.target.value;
              let keyError: string = '';
              if (value === '') {
                keyError = '请输入';
              } else if (value.length > 15) {
                keyError = '不超过15个字符';
              } else if (!CUSTOM_KEY.test(value)) {
                keyError = `不符合${CUSTOM_KEY}`;
              }
              // onChangeData({
              //   key: value,
              //   keyError: keyError,
              // }, index);
            }}
            placeholder={'输入key'}
          />
        </div>

        <div className={styles.input}>
          <div className={styles.title}>
            <i className={styles.dot}/>
            <FTitleText type="form">value</FTitleText>
          </div>
          <div style={{height: 5}}/>
          <FInput
            disabled={true}
            value={resourceVersionEditorPage.basePValueInput}
            // errorText={ds.valueError}
            className={styles.input}
            onChange={(e) => {
              const value: string = e.target.value;
              let valueError: string = '';
              if (value === '') {
                valueError = '请输入';
              } else if (value.length > 30) {
                valueError = '不超过30个字符';
              }

            }}
            placeholder={'输入value'}
          />
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
              dispatch<ChangeAction>({
                type: 'resourceVersionEditorPage/change',
                payload: {
                  basePDescriptionInput: value,
                  basePDescriptionInputError: descriptionError,
                },
              });
            }}
            placeholder={'输入属性说明'}
          />
        </div>

        <div style={{height: 20}}/>
        <div className={styles.save}>
          <FNormalButton
            disabled={!!resourceVersionEditorPage.basePDescriptionInputError}
            onClick={async () => {
              await dispatch<ChangeAction>({
                type: 'resourceVersionEditorPage/change',
                payload: {
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
                }
              });
              await dispatch<SyncAllPropertiesAction>({
                type: 'resourceVersionEditorPage/syncAllProperties',
              });
            }}
          >保存</FNormalButton>
        </div>
      </Space>
    </FDrawer>
  </>);
}

export default withRouter(connect(({resourceVersionEditorPage, resourceInfo}: ConnectState) => ({
  version: resourceVersionEditorPage,
  resourceVersionEditorPage: resourceVersionEditorPage,
  resourceInfo: resourceInfo,
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
          <DownloadOutlined
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
