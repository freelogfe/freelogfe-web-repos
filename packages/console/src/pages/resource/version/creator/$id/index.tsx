import * as React from 'react';
import styles from './index.less';
import FBraftEditor from '@/components/FBraftEditor';
import { Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import {
  ConnectState,
  ResourceInfoModelState,
  ResourceVersionCreatorPageModelState,
} from '@/models/connect';
import {
  OnClick_CreateVersionBtn_Action,
  OnDelete_ObjectFile_Action,
  OnMountPageAction,
  OnUnmountPageAction,
  OnChange_VersionInput_Action,
  OnClick_ImportLastVersionDependents_Btn_Action,
  OnChange_DescriptionEditorState_Action,
  OnSucceed_UploadFile_Action,
  OnSucceed_ImportObject_Action, OnClose_MarkdownEditor_Action, OnTrigger_SaveDraft_Action, OnChange_DataIsDirty_Action,
} from '@/models/resourceVersionCreatorPage';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Sider from '@/pages/resource/containers/Sider';
import FFormLayout from '@/components/FFormLayout';
import * as AHooks from 'ahooks';
import CustomOptions from './CustomOptions';
import { Helmet } from 'react-helmet';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { EditorState } from 'braft-editor';
import FPublishObjectFile from '@/components/FPublishObjectFile';
import FResourceAuthorizationProcessor, { getProcessor } from '@/components/FResourceAuthorizationProcessor';
import VersionInput from './VersionInput';
import fAddDependencies from '@/components/fAddDependencies';
import FPrompt from '@/components/FPrompt';
import fResourceMarkdownEditor from '@/components/fResourceMarkdownEditor';
import { RouteComponentProps } from 'react-router';
import fConfirmModal from '@/components/fConfirmModal';
import FTooltip from '@/components/FTooltip';

interface VersionCreatorProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
  resourceInfo: ResourceInfoModelState;
}

function VersionCreator({
                          dispatch,
                          resourceInfo,
                          resourceVersionCreatorPage,
                          match,
                        }: VersionCreatorProps) {
  // console.log(match, 'matchoisjdflkjsdflkjsdkljl');

  const [isMarkdownEditorDirty, set_isMarkdownEditorDirty] = React.useState<boolean>(false);

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'resourceVersionCreatorPage/onMountPage',
      payload: {
        resourceID: match.params.id,
      },
    } as const);
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'resourceVersionCreatorPage/onUnmountPage',
    } as const);
  });

  AHooks.useDebounceEffect(
    () => {
      if (resourceVersionCreatorPage.dataIsDirty) {
        dispatch<OnTrigger_SaveDraft_Action>({
          type: 'resourceVersionCreatorPage/onTrigger_SaveDraft',
          payload: {
            showSuccessTip: false,
          },
        } as const);
      }

    },
    [resourceVersionCreatorPage.dataIsDirty, resourceVersionCreatorPage.descriptionEditorState],
    {
      wait: 300,
    },
  );

  const hasError: boolean =
    !resourceVersionCreatorPage.versionInput ||
    !resourceVersionCreatorPage.selectedFileInfo ||
    resourceVersionCreatorPage.rawPropertiesState !== 'success';

  if (!resourceVersionCreatorPage.resourceInfo) {
    return null;
  }

  async function onClick_EditMarkdownBtn() {
    await dispatch<OnTrigger_SaveDraft_Action>({
      type: 'resourceVersionCreatorPage/onTrigger_SaveDraft',
      payload: {
        showSuccessTip: false,
      },
    });
    await fResourceMarkdownEditor({
      resourceID: resourceVersionCreatorPage.resourceInfo?.resourceID || '',
      async onChange_Saved(saved: boolean) {
        // await dispatch<OnChange_DataIsDirty_Action>({
        //   type: 'resourceVersionCreatorPage/onChange_DataIsDirty',
        //   payload: {
        //     value: saved,
        //   },
        // } as const);
        // console.log(saved, 'savedsavedsavedsaveddiosfjslkdfjlsdkjlk');
        set_isMarkdownEditorDirty(!saved);
      },
    });
    await dispatch<OnClose_MarkdownEditor_Action>({
      type: 'resourceVersionCreatorPage/onClose_MarkdownEditor',
    } as const);

  }

  return (
    <>
      <Helmet>
        <title>{`创建版本 · ${resourceVersionCreatorPage.resourceInfo?.resourceName || ''
        } - Freelog`}</title>
      </Helmet>

      <FPrompt
        watch={resourceVersionCreatorPage.dataIsDirty || isMarkdownEditorDirty}
        messageText={'还没有保存草稿或发行，现在离开会导致信息丢失'}
      />
      <FLeftSiderLayout
        // hasBottom={false}
        sider={<Sider />}
        header={<div className={styles.Header}>
          {/*<FTitleText text={FUtil.I18n.message('create_new_version')} type="h1"/>*/}
          <FComponentsLib.FTitleText text={'创建版本'} type='h1' />

          <Space size={30}>

            {resourceVersionCreatorPage.draftSaveTime && (<FComponentsLib.FContentText
              text={`已保存 ${resourceVersionCreatorPage.draftSaveTime}`}
              type={'additional2'}
            />)}

            <FComponentsLib.FTextBtn
              type='default'
              onClick={() => {
                dispatch<OnTrigger_SaveDraft_Action>({
                  type: 'resourceVersionCreatorPage/onTrigger_SaveDraft',
                  payload: {
                    showSuccessTip: true,
                  },
                });
              }}
            >
              {FI18n.i18nNext.t('save_as_draft')}
            </FComponentsLib.FTextBtn>
            <FComponentsLib.FRectBtn
              style={{ display: 'flex', alignItems: 'center' }}
              onClick={() => {
                dispatch<OnClick_CreateVersionBtn_Action>({
                  type: 'resourceVersionCreatorPage/onClick_CreateVersionBtn',
                });
              }}
              disabled={hasError}
            >
              <FComponentsLib.FIcons.FPaperPlane
                style={{ fontWeight: 400, fontSize: 16 }}
              />
              <div style={{ width: 5 }} />
              {FI18n.i18nNext.t('release_to_market')}
            </FComponentsLib.FRectBtn>
          </Space>
        </div>}
      >
        <FFormLayout>
          <FFormLayout.FBlock
            dot={true}
            title={FI18n.i18nNext.t('version_number')}
          >
            <VersionInput
              value={resourceVersionCreatorPage.versionInput}
              resourceLatestVersion={resourceVersionCreatorPage.resourceInfo.latestVersion}
              onChange={(value) => {
                dispatch<OnChange_VersionInput_Action>({
                  type: 'resourceVersionCreatorPage/onChange_VersionInput',
                  payload: {
                    value: value,
                  },
                } as const);
              }}
            />
          </FFormLayout.FBlock>

          <FFormLayout.FBlock
            dot={true}
            title={FI18n.i18nNext.t('release_object')}
          >
            <Space size={20} direction={'vertical'} style={{ width: '100%' }}>

              <FPublishObjectFile
                fileInfo={resourceVersionCreatorPage.selectedFileInfo}
                onSucceed_UploadFile={(file) => {
                  // console.log(file, 'onSucceed_UploadFile390oisjdf');
                  dispatch<OnSucceed_UploadFile_Action>({
                    type: 'resourceVersionCreatorPage/onSucceed_UploadFile',
                    payload: {
                      name: file.fileName,
                      sha1: file.sha1,
                      // from: '本地上传',
                    },
                  });
                }}
                onSucceed_ImportObject={async (obj) => {
                  // console.log(obj, 'onSucceed_ImportObject390oisjdf');
                  dispatch<OnSucceed_ImportObject_Action>({
                    type: 'resourceVersionCreatorPage/onSucceed_ImportObject',
                    payload: {
                      name: obj.objName,
                      sha1: obj.sha1,
                      objID: obj.objID,
                    },
                  });

                }}
                onClick_DeleteBtn={() => {
                  if (resourceVersionCreatorPage.baseProperties.length > 0 || resourceVersionCreatorPage.customOptionsData.length > 0) {
                    fConfirmModal({
                      message: FI18n.i18nNext.t('createversion_remove_file_confirmation'),
                      okText: FI18n.i18nNext.t('createversion_remove_file_btn_remove'),
                      cancelText: FI18n.i18nNext.t('btn_cancel'),
                      onOk() {
                        dispatch<OnDelete_ObjectFile_Action>({
                          type: 'resourceVersionCreatorPage/onDelete_ObjectFile',
                        });
                      },
                    });
                  } else {
                    dispatch<OnDelete_ObjectFile_Action>({
                      type: 'resourceVersionCreatorPage/onDelete_ObjectFile',
                    });
                  }

                }}

                showOpenMarkdownEditor={resourceVersionCreatorPage.resourceInfo.resourceType[0] === '阅读' && resourceVersionCreatorPage.resourceInfo.resourceType[1] === '文章' && !resourceVersionCreatorPage.selectedFileInfo}
                onClick_OpenMarkdownBtn={async () => {
                  await onClick_EditMarkdownBtn();
                }}
                showEditBtnAfterSucceed={resourceVersionCreatorPage.resourceInfo.resourceType[0] === '阅读'
                && resourceVersionCreatorPage.resourceInfo.resourceType[1] === '文章'
                && resourceVersionCreatorPage.rawProperties.some((b) => {
                  return b.key === 'mime' && (b.value === 'text/markdown' || b.value === 'text/plain');
                })}
                onClick_EditMarkdownBtn={async () => {
                  await onClick_EditMarkdownBtn();
                }}
              />
            </Space>
            <CustomOptions />

          </FFormLayout.FBlock>

          <FFormLayout.FBlock
            dot={false}
            title={FI18n.i18nNext.t('rely')}
            subtitle={<FTooltip title={FI18n.i18nNext.t('info_versionrely')}>
              <div><FComponentsLib.FIcons.FInfo style={{ fontSize: 14 }} /></div>
            </FTooltip>}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 15 }}>
              <Space size={15}>
                <FComponentsLib.FRectBtn
                  onClick={async () => {
                    const p = await getProcessor('resourceVersionCreator');
                    await fAddDependencies({
                      existingResources: (await p.getAllTargets()).map((t) => {
                        return {
                          resourceID: t.id,
                          resourceNme: t.name,
                        };
                      }),
                      baseUpcastResources: resourceVersionCreatorPage.resourceInfo?.baseUpcastResources.map((r) => {
                        return {
                          resourceID: r.resourceID,
                          resourceNme: r.resourceName,
                        };
                      }) || [],
                      async onSelect_Resource({ resourceID, resourceName }) {
                        // console.log('8***********8sdflksdjlkj');
                        const p = await getProcessor('resourceVersionCreator');
                        await p.addTargets([{
                          id: resourceID,
                          name: resourceName,
                          type: 'resource',
                          // versionRange: '^0.1.0',
                        }]);
                        await dispatch<OnChange_DataIsDirty_Action>({
                          type: 'resourceVersionCreatorPage/onChange_DataIsDirty',
                          payload: {
                            value: true,
                          },
                        } as const);
                      },
                      async onDeselect_Resource({ resourceID, resourceName }) {
                        const p = await getProcessor('resourceVersionCreator');
                        await p.removeTarget({
                          id: resourceID,
                          name: resourceName,
                          type: 'resource',
                        });
                        await dispatch<OnChange_DataIsDirty_Action>({
                          type: 'resourceVersionCreatorPage/onChange_DataIsDirty',
                          payload: {
                            value: true,
                          },
                        } as const);
                      },
                    });
                    // await dispatch<OnTrigger_SaveDraft_Action>({
                    //   type: 'resourceVersionCreatorPage/onTrigger_SaveDraft',
                    //   payload: {
                    //     showSuccessTip: false,
                    //   },
                    // } as const);
                  }}
                  type='default'
                >添加依赖</FComponentsLib.FRectBtn>

                {
                  resourceVersionCreatorPage.preVersionDirectDependencies.length !== 0 &&
                  <FComponentsLib.FRectBtn
                    type='default'
                    onClick={async () => {
                      dispatch<OnClick_ImportLastVersionDependents_Btn_Action>({
                        type: 'resourceVersionCreatorPage/onClick_ImportLastVersionDependents_Btn',
                      } as const);
                      // await dispatch<OnTrigger_SaveDraft_Action>({
                      //   type: 'resourceVersionCreatorPage/onTrigger_SaveDraft',
                      //   payload: {
                      //     showSuccessTip: false,
                      //   },
                      // } as const);
                    }}
                  >{FI18n.i18nNext.t('import_from_previous_version')}</FComponentsLib.FRectBtn>
                }

              </Space>

              <FResourceAuthorizationProcessor
                resourceID={resourceVersionCreatorPage.resourceInfo.resourceID}
                processorIdentifier={'resourceVersionCreator'}
                onChanged={() => {
                  dispatch<OnChange_DataIsDirty_Action>({
                    type: 'resourceVersionCreatorPage/onChange_DataIsDirty',
                    payload: {
                      value: true,
                    },
                  } as const);
                }}
                // width={1100}
                // onMount={(p) => {
                //   processor = p;
                // }}
              />
            </div>
          </FFormLayout.FBlock>

          <FFormLayout.FBlock
            dot={false}
            title={FI18n.i18nNext.t('version_description')}
          >
            <FBraftEditor
              value={resourceVersionCreatorPage.descriptionEditorState}
              onChange={(value: EditorState) => {
                dispatch<OnChange_DescriptionEditorState_Action>({
                  type: 'resourceVersionCreatorPage/onChange_DescriptionEditorState',
                  payload: {
                    state: value,
                  },
                } as const);
              }}
              style={{
                height: 500,
              }}
            />
          </FFormLayout.FBlock>
        </FFormLayout>
        {/*<div style={{ position: 'relative' }}>*/}
        {/*  <div style={{ position: 'absolute', right: -30, top: 60 }}>*/}

        {/*  </div>*/}
        {/*</div>*/}
      </FLeftSiderLayout>
    </>
  );
}

export default connect(({ resourceVersionCreatorPage, resourceInfo }: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
  resourceInfo: resourceInfo,
}))(VersionCreator);
