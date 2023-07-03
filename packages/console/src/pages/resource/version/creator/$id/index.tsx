import * as React from 'react';
import styles from './index.less';
import FBraftEditor from '@/components/FBraftEditor';
import { Modal, Progress, Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import {
  ConnectState,
  // ResourceInfoModelState,
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
  OnSucceed_ImportObject_Action,
  OnClose_MarkdownEditor_Action,
  OnTrigger_SaveDraft_Action,
  OnChange_DataIsDirty_Action,
} from '@/models/resourceVersionCreatorPage';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Sider from '@/pages/resource/containers/Sider';
import FFormLayout from '@/components/FFormLayout';
import * as AHooks from 'ahooks';
import CustomOptions from './CustomOptions';
import { Helmet } from 'react-helmet';
import { FI18n, FUtil } from '@freelog/tools-lib';
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
import FSkeletonNode from '@/components/FSkeletonNode';
import FTable from '@/components/FTable';
import fComicTool from '@/components/fComicTool';
import { ComicTool } from '@/components/fComicTool/FComicToolModal';

// import { useLocation } from 'umi';

interface VersionCreatorProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function VersionCreator({
                          dispatch,
                          // resourceInfo,
                          resourceVersionCreatorPage,
                          match,
                        }: VersionCreatorProps) {

  const [isMarkdownEditorDirty, set_isMarkdownEditorDirty] = React.useState<boolean>(false);
  const [isOpenCartoon, set_isOpenCartoon] = React.useState<boolean>(false);
  const [isfComicToolDirty, set_isfComicToolDirty] = React.useState<boolean>(false);

  // const location = useLocation();
  // React.useEffect(() => {
  //   console.log(location, 'location 908weifjusdkjflsdjfljsdlfkjsdlfjlkj');
  // }, [location.pathname]);

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

  AHooks.useDebounceEffect(
    () => {
      if (resourceVersionCreatorPage.dataIsDirty) {
        dispatch<OnTrigger_SaveDraft_Action>({
          type: 'resourceVersionCreatorPage/onTrigger_SaveDraft',
          payload: {
            showSuccessTip: false,
          },
        });
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
    resourceVersionCreatorPage.selectedFile_UsedResources.length > 0 ||
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
        set_isMarkdownEditorDirty(!saved);
      },
    });
    await set_isMarkdownEditorDirty(false);
    await dispatch<OnClose_MarkdownEditor_Action>({
      type: 'resourceVersionCreatorPage/onClose_MarkdownEditor',
    });
  }

  async function onClick_EditCartoonBtn() {
    await dispatch<OnTrigger_SaveDraft_Action>({
      type: 'resourceVersionCreatorPage/onTrigger_SaveDraft',
      payload: {
        showSuccessTip: false,
      },
    });
    await fComicTool({
      resourceID: resourceVersionCreatorPage.resourceInfo?.resourceID || '',
      async onChange_Saved(saved: boolean) {
        set_isfComicToolDirty(!saved);
      },
    });
    await set_isfComicToolDirty(false);
    await dispatch<OnClose_MarkdownEditor_Action>({
      type: 'resourceVersionCreatorPage/onClose_MarkdownEditor',
    });

  }

  if (!hasError) {
    FComponentsLib.fSetHotspotTooltipVisible('createResourceVersionPage.createBtn', {
      value: true,
      effectiveImmediately: true,
      onlyNullish: true,
    });

    setTimeout(() => {
      FComponentsLib.fSetHotspotTooltipVisible('createResourceVersionPage.createBtn', {
        value: false,
        effectiveImmediately: false,
        onlyNullish: false,
      });
    });
  }

  return (
    <>
      <Helmet>
        <title>{`创建版本 · ${resourceVersionCreatorPage.resourceInfo?.resourceName || ''
        } - Freelog`}</title>
      </Helmet>

      <FPrompt
        watch={resourceVersionCreatorPage.dataIsDirty || isMarkdownEditorDirty || isfComicToolDirty}
        messageText={'还没有保存草稿或发行，现在离开会导致信息丢失'}
      />
      <FLeftSiderLayout
        // hasBottom={false}
        sider={<Sider />}
        header={<div className={styles.Header}>
          {/*<FTitleText text={FUtil.I18n.message('create_new_version')} type="h1"/>*/}
          <FComponentsLib.FTitleText text={'创建版本'} type='h1' />

          <Space size={30}>

            {
              resourceVersionCreatorPage.draftSaveTime && (<FComponentsLib.FContentText
                text={`已保存 ${resourceVersionCreatorPage.draftSaveTime}`}
                type={'additional2'}
              />)
            }

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

            <FComponentsLib.FHotspotTooltip
              id={'createResourceVersionPage.createBtn'}
              style={{ left: '50%', marginLeft: -16, bottom: -42 }}
              text={FI18n.i18nNext.t('hotpots_createversion_btn_release')}
              zIndex={1}
            >
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
            </FComponentsLib.FHotspotTooltip>
          </Space>
        </div>}
      >
        {
          resourceVersionCreatorPage.pageState === 'loading' && (<div>
            <FSkeletonNode width={120} height={22} />
            <div style={{ height: 20 }} />
            <FSkeletonNode width={340} height={38} />
            <div style={{ height: 50 }} />
            <FSkeletonNode width={120} height={22} />
            <div style={{ height: 20 }} />
            <FSkeletonNode width={860} height={38} />
            <div style={{ height: 20 }} />
            <FSkeletonNode width={340} height={38} />
            <div style={{ height: 50 }} />
            <FSkeletonNode width={120} height={22} />
            <div style={{ height: 20 }} />
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
              <FSkeletonNode width={340} height={38} />
              <FSkeletonNode width={500} height={38} />
            </div>
            <div style={{ height: 20 }} />
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 180 }}>
              <FSkeletonNode width={180} height={38} />
              <FSkeletonNode width={220} height={38} />
            </div>
            <div style={{ height: 50 }} />
            <FSkeletonNode width={120} height={22} />
            <div style={{ height: 20 }} />
            <FSkeletonNode width={860} height={38} />
            <div style={{ height: 20 }} />
            <FSkeletonNode width={340} height={38} />
          </div>)
        }

        <div style={{ display: resourceVersionCreatorPage.pageState === 'loaded' ? 'block' : 'none' }}>
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
                  resourceVersionCreatorPage.selectedFile_UsedResources.length > 0 && (<>
                    <div style={{ color: '#EE4040' }}>{FI18n.i18nNext.t('resource_exist')}</div>
                    <FTable
                      rowClassName={styles.tableRowClassName}
                      scroll={{ y: resourceVersionCreatorPage.selectedFile_UsedResources.length > 5 ? 350 : undefined }}
                      columns={[
                        {
                          title: '资源',
                          dataIndex: 'resourceName',
                          width: 400,
                          render(value: any, record: any, index: number) {
                            return (<FComponentsLib.FContentText
                              text={record.resourceName}
                              style={{ maxWidth: 370 }}
                            />);
                          },
                        },
                        {
                          title: '类型',
                          dataIndex: 'resourceType',
                          width: 100,
                          render(value: any, record: any, index: number) {
                            return (<FComponentsLib.FContentText
                              text={record.resourceType.join(' / ')}
                            />);
                          },
                        },
                        {
                          title: '版本',
                          dataIndex: 'resourceVersion',
                          render(value: any, record: any, index: number) {
                            return (<FComponentsLib.FContentText
                              text={record.resourceVersion}
                            />);
                          },
                        },
                        {
                          title: '操作',
                          dataIndex: 'operation',
                          render(value: any, record: any, index: number) {
                            return (<FComponentsLib.FTextBtn onClick={() => {
                              window.open(record.url);
                            }}>查看</FComponentsLib.FTextBtn>);
                          },
                        },
                      ]}
                      dataSource={resourceVersionCreatorPage.selectedFile_UsedResources.map((sfur) => {
                        return {
                          key: sfur.url,
                          ...sfur,
                        };
                      })}
                    />
                  </>)
                }

                <FPublishObjectFile
                  showEditBtnAfterSucceed={true}
                  // resourceID={resourceVersionCreatorPage.resourceInfo.resourceID}
                  resourceType={{
                    code: resourceVersionCreatorPage.resourceInfo.resourceTypeCode,
                    names: resourceVersionCreatorPage.resourceInfo.resourceType,
                  }}
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
                    if (resourceVersionCreatorPage.customProperties.length > 0 || resourceVersionCreatorPage.customConfigurations.length > 0) {
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
                  showOpenMarkdownEditor={resourceVersionCreatorPage.resourceInfo.resourceType[0] === '阅读' && resourceVersionCreatorPage.resourceInfo.resourceType[1] === '文章'}
                  showOpenCartoonEditor={resourceVersionCreatorPage.resourceInfo.resourceType[0] === '阅读' && resourceVersionCreatorPage.resourceInfo.resourceType[1] === '漫画'}
                  // showOpenCartoonEditor={false}
                  onClick_OpenMarkdownBtn={async () => {
                    // console.log('OOOOOOOOOO ((((((((');
                    await onClick_EditMarkdownBtn();
                    // console.log('CCCCCCCCC ))))))))');

                  }}
                  onClick_OpenCartoonBtn={async () => {
                    // await onClick_EditCartoonBtn();
                    set_isOpenCartoon(true);
                  }}
                  onClick_EditBtn={async () => {
                    if (resourceVersionCreatorPage.resourceInfo?.resourceType[0] === '阅读' && resourceVersionCreatorPage.resourceInfo?.resourceType[1] === '文章') {
                      await onClick_EditMarkdownBtn();
                    }

                    if (resourceVersionCreatorPage.resourceInfo?.resourceType.includes('漫画')) {
                      await onClick_EditCartoonBtn();
                    }

                  }}
                  onClick_DownloadBtn={(extension = '') => {
                    if (!resourceVersionCreatorPage.selectedFileInfo) {
                      return;
                    }
                    // console.log(type, '98ieowjfkldjflksdjflksjdflkjsdlfkjsdlkj');
                    self.location.href = FUtil.Format.completeUrlByDomain('qi')
                      + `/v2/storages/files/${resourceVersionCreatorPage.selectedFileInfo.sha1}/download?attachmentName=${resourceVersionCreatorPage.selectedFileInfo.name}${extension}`;
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
                        // resourceTypeCode: resourceVersionCreatorPage.resourceInfo?.resourceTypeCode || '',
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
                          });
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
                      onClick={async () => {
                        dispatch<OnClick_ImportLastVersionDependents_Btn_Action>({
                          type: 'resourceVersionCreatorPage/onClick_ImportLastVersionDependents_Btn',
                        });
                      }}
                    >{FI18n.i18nNext.t('import_from_previous_version')}</FComponentsLib.FRectBtn>
                  }
                </Space>

                <FResourceAuthorizationProcessor
                  width={860}
                  height={600}
                  resourceID={resourceVersionCreatorPage.resourceInfo.resourceID}
                  processorIdentifier={'resourceVersionCreator'}
                  onChanged={() => {
                    dispatch<OnChange_DataIsDirty_Action>({
                      type: 'resourceVersionCreatorPage/onChange_DataIsDirty',
                      payload: {
                        value: true,
                      },
                    });
                  }}
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
                  minHeight: 500,
                }}
              />
            </FFormLayout.FBlock>
          </FFormLayout>
        </div>
      </FLeftSiderLayout>

      <ReleaseTip
        visible={resourceVersionCreatorPage.releaseTipVisible}
      />


      <ComicTool
        resourceId={resourceVersionCreatorPage.resourceInfo.resourceID || ''}
        show={isOpenCartoon}
        setSaved={(saved) => {
          // onChange_Saved && onChange_Saved(saved);

          set_isfComicToolDirty(!saved);
        }}
        close={() => {
          // set_visible(false);
          // setTimeout(() => {
          //   onClose && onClose();
          // }, 300);
          console.log('******** u98wueoirfuoisdjflsjdlfsdjl');
          set_isOpenCartoon(false);
          set_isfComicToolDirty(false);
          dispatch<OnClose_MarkdownEditor_Action>({
            type: 'resourceVersionCreatorPage/onClose_MarkdownEditor',
          });
        }}
      />
    </>
  );
}

export default connect(({ resourceVersionCreatorPage }: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(VersionCreator);

interface ReleaseTipProps {
  visible: boolean;
}

function ReleaseTip({ visible }: ReleaseTipProps) {

  const [percent, set_percent] = React.useState(0);

  AHooks.useInterval(() => {
    set_percent(Math.min(percent + 1, 99));
  }, visible ? 8 : undefined);

  return (<Modal
    open={visible}
    closable={false}
    footer={null}
    width={920}
  >
    <div style={{
      height: 452,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}>
      <div style={{ fontSize: 20, color: '#222', lineHeight: '28px' }}>{percent}%</div>
      <div style={{ height: 20 }} />
      <div style={{ width: 300 }}>
        <Progress percent={percent} showInfo={false} />
      </div>
      <div style={{ height: 40 }} />
      <div style={{ fontSize: 16, color: '#666', lineHeight: '22px' }}>资源版本正在发布，请稍后</div>

    </div>
  </Modal>);
}
