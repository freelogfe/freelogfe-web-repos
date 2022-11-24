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
  OnTrigger_SaveCache_Action,
  OnClick_CreateVersionBtn_Action,
  OnDelete_ObjectFile_Action,
  OnMountPageAction,
  // OnPromptPageLeaveAction,
  // OnPromptPageLeaveCancelAction,
  // OnPromptPageLeaveConfirmAction,
  OnUnmountPageAction,
  OnChange_VersionInput_Action,
  OnClick_ImportLastVersionDependents_Btn_Action,
  OnChange_DescriptionEditorState_Action,
  OnSucceed_UploadFile_Action,
  OnSucceed_ImportObject_Action,
} from '@/models/resourceVersionCreatorPage';
// import { Prompt } from 'umi';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Sider from '@/pages/resource/containers/Sider';
import FFormLayout from '@/components/FFormLayout';
// import * as H from 'history';
// import fConfirmModal from '@/components/fConfirmModal';
import { RouteComponentProps } from 'react-router';
import * as AHooks from 'ahooks';
import CustomOptions from './CustomOptions';
import { Helmet } from 'react-helmet';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { EditorState } from 'braft-editor';
import FPublishObjectFile from '@/components/FPublishObjectFile';
// import { MarkdownEditor } from '@/components/fResourceMarkdownEditor/FResourceMarkdownEditorModal';
import FResourceAuthorizationProcessor, { getProcessor, Processor } from '@/components/FResourceAuthorizationProcessor';
import VersionInput from './VersionInput';
import fAddDependencies from '@/components/fAddDependencies';
// import { history } from '@@/core/history';
import FPrompt from '@/components/FPrompt';
import fResourceMarkdownEditor from '@/components/fResourceMarkdownEditor';

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

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'resourceVersionCreatorPage/onMountPage',
      payload: {
        resourceID: match.params.id,
      },
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'resourceVersionCreatorPage/onUnmountPage',
    });
  });

  // React.useEffect(() => {
  //   if (resourceVersionCreatorPage.dataIsDirty) {
  //     window.onbeforeunload = () => true;
  //   } else {
  //     window.onbeforeunload = null;
  //   }
  // }, [resourceVersionCreatorPage.dataIsDirty]);

  const hasError: boolean =
    !resourceVersionCreatorPage.versionInput ||
    !resourceVersionCreatorPage.selectedFileInfo ||
    resourceVersionCreatorPage.rawPropertiesState !== 'success';

  if (!resourceVersionCreatorPage.resourceInfo) {
    return null;
  }

  return (
    <>
      {/*<MarkdownEditor*/}
      {/*  resourceId={match.params.id}*/}
      {/*  show={true}*/}
      {/*  // close={() => {*/}
      {/*  //   setShow(false);*/}
      {/*  // }}*/}
      {/*  // setSaved={setSaved}*/}
      {/*/>*/}

      <Helmet>
        <title>{`创建版本 · ${
          resourceInfo.info?.resourceName || ''
        }  - Freelog`}</title>
      </Helmet>

      <FPrompt
        watch={false}
        messageText={'还没有保存草稿或发行，现在离开会导致信息丢失'}
      />
      <FLeftSiderLayout
        sider={<Sider />}
        header={
          <Header
            onClickCreate={async () => {
              dispatch<OnClick_CreateVersionBtn_Action>({
                type: 'resourceVersionCreatorPage/onClick_CreateVersionBtn',
              });
            }}
            onClickCache={async () => {
              dispatch<OnTrigger_SaveCache_Action>({
                type: 'resourceVersionCreatorPage/onTrigger_SaveCache',
              });
            }}
            disabledCreate={hasError}
          />
        }
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
                });
              }}
            />
          </FFormLayout.FBlock>

          <FFormLayout.FBlock
            dot={true}
            title={FI18n.i18nNext.t('release_object')}
          >
            <Space size={20} direction={'vertical'} style={{ width: '100%' }}>

              {
                resourceVersionCreatorPage.resourceInfo.resourceType[0] === '阅读' && resourceVersionCreatorPage.resourceInfo.resourceType[1] === '文章' && !resourceVersionCreatorPage.selectedFileInfo && (
                  <div className={styles.markdownRecommended}>
                    <div className={styles.markdownRecommended_tip}>
                      <FComponentsLib.FTitleText text={'Freelog Markdown'} type={'h3'} />
                      <div style={{ height: 8 }} />
                      <FComponentsLib.FContentText text={'在线新建和编辑文章，无需导出本地，快速生产资源'} type={'additional2'} />
                    </div>
                    <FComponentsLib.FRectBtn
                      type={'secondary'}
                      onClick={async () => {
                        await fResourceMarkdownEditor({
                          resourceID: resourceVersionCreatorPage.resourceInfo?.resourceID || '',
                        });
                      }}
                    >立即体验</FComponentsLib.FRectBtn>
                  </div>)
              }


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
                  dispatch<OnDelete_ObjectFile_Action>({
                    type: 'resourceVersionCreatorPage/onDelete_ObjectFile',
                  });
                }}
                showEditBtnAfterSucceed={resourceVersionCreatorPage.resourceInfo.resourceType[0] === '阅读' && resourceVersionCreatorPage.resourceInfo.resourceType[1] === '文章'}
                onClick_EditMarkdownBtn={async () => {
                  await fResourceMarkdownEditor({
                    resourceID: resourceVersionCreatorPage.resourceInfo?.resourceID || '',
                  });
                }}
              />
            </Space>
            <CustomOptions />

          </FFormLayout.FBlock>

          <FFormLayout.FBlock dot={false} title={FI18n.i18nNext.t('rely')}>
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
                      },
                      async onDeselect_Resource({ resourceID, resourceName }) {
                        const p = await getProcessor('resourceVersionCreator');
                        await p.removeTarget({
                          id: resourceID,
                          name: resourceName,
                          type: 'resource',
                        });
                      },
                    });
                  }}
                  type='default'
                >添加依赖</FComponentsLib.FRectBtn>

                {
                  resourceVersionCreatorPage.preVersionDirectDependencies.length !== 0 &&
                  <FComponentsLib.FRectBtn
                    type='default'
                    onClick={() => {
                      dispatch<OnClick_ImportLastVersionDependents_Btn_Action>({
                        type: 'resourceVersionCreatorPage/onClick_ImportLastVersionDependents_Btn',
                      });
                    }}
                  >{FI18n.i18nNext.t('import_from_previous_version')}</FComponentsLib.FRectBtn>
                }

              </Space>

              <FResourceAuthorizationProcessor
                resourceID={resourceVersionCreatorPage.resourceInfo.resourceID}
                processorIdentifier={'resourceVersionCreator'}
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
                });
              }}
              style={{
                height: 500,
              }}
            />
          </FFormLayout.FBlock>
        </FFormLayout>
      </FLeftSiderLayout>
    </>
  );
}

interface HeaderProps {
  onClickCache: () => void;
  onClickCreate: () => void;
  disabledCreate?: boolean;
}

function Header({
                  onClickCache,
                  onClickCreate,
                  disabledCreate = false,
                }: HeaderProps) {
  return (
    <div className={styles.Header}>
      {/*<FTitleText text={FUtil.I18n.message('create_new_version')} type="h1"/>*/}
      <FComponentsLib.FTitleText text={'创建版本'} type='h1' />

      <Space size={30}>
        <FComponentsLib.FTextBtn type='default' onClick={onClickCache}>
          {FI18n.i18nNext.t('save_as_draft')}
        </FComponentsLib.FTextBtn>
        <FComponentsLib.FRectBtn
          style={{ display: 'flex', alignItems: 'center' }}
          onClick={onClickCreate}
          disabled={disabledCreate}
        >
          <FComponentsLib.FIcons.FPaperPlane
            style={{ fontWeight: 400, fontSize: 16 }}
          />
          <div style={{ width: 5 }} />
          {FI18n.i18nNext.t('release_to_market')}
        </FComponentsLib.FRectBtn>
      </Space>
    </div>
  );
}

export default connect(({ resourceVersionCreatorPage, resourceInfo }: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
  resourceInfo: resourceInfo,
}))(VersionCreator);
