import * as React from 'react';
import styles from './index.less';
import LocalUpload from '@/pages/resource/creator/Step2/LocalUpload';
import StorageSpace from '@/pages/resource/creator/Step2/StorageSpace';
import MarkdownEditor from '@/pages/resource/creator/Step2/MarkdownEditor';
import CartoonEditor from '@/pages/resource/creator/Step2/CartoonEditor';
import FComponentsLib from '@freelog/components-lib';
import { history } from 'umi';
import { FI18n, FUtil } from '@freelog/tools-lib';
import img from '@/assets/file-object.svg';
import FTooltip from '@/components/FTooltip';
import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
import FResourceProperties from '@/components/FResourceProperties';
import { Space } from 'antd';
import fResourceOptionEditor from '@/components/fResourceOptionEditor';
import FResourceOptions from '@/components/FResourceOptions';
import FResourceAuthorizationProcessor, { getProcessor } from '@/components/FResourceAuthorizationProcessor';
import fAddDependencies from '@/components/fAddDependencies';
import { connect } from 'dva';
import { ConnectState, ResourceVersionCreatorPageModelState } from '@/models/connect';
import { Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router/index';
import { useGetState } from '@/utils/hooks';
import * as AHooks from 'ahooks';
import FCoverImage from '@/components/FCoverImage';
import {
  ChangeAction,
  OnChange_AdditionalProperties_Action,
  OnChange_CustomConfigurations_Action,
  OnChange_CustomProperties_Action,
  OnChange_DataIsDirty_Action,
  OnChange_IsOpenCartoon_Action,
  OnChange_VersionInput_Action,
  OnClick_CreateVersionBtn_Action,
  OnClick_ImportLastVersionDependents_Btn_Action,
  OnClick_OpenCartoonBtn_Action,
  OnClose_CartoonEditor_Action,
  OnClose_MarkdownEditor_Action,
  OnDelete_ObjectFile_Action,
  OnMountPageAction,
  OnSucceed_ImportObject_Action,
  OnSucceed_UploadFile_Action,
  OnTrigger_SaveDraft_Action,
  OnUnmountPageAction,
} from '@/models/resourceVersionCreatorPage';
import fResourceMarkdownEditor from '@/components/fResourceMarkdownEditor';
import { ComicTool } from '@/components/fComicTool/FComicToolModal';
import { ReleaseTip } from '@/pages/resource/version/creator/$id';
import fConfirmModal from '@/components/fConfirmModal';
import fAddFileBaseProps from '@/components/fAddFileBaseProps';
import fAddCustomOptions from '@/components/fAddCustomOptions';
import VersionInput from '@/pages/resource/version/creator/$id/VersionInput';
import FPrompt from '@/components/FPrompt';
import FSkeletonNode from '@/components/FSkeletonNode';

interface VersionCreatorProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function VersionCreator({ match, dispatch, resourceVersionCreatorPage }: VersionCreatorProps) {

  const ref = React.useRef(null);
  const size = AHooks.useSize(ref);
  const [$showMore, set$ShowMore, get$ShowMore] = useGetState<boolean>(false);
  const [$versionInputHasError, set$versionInputHasError] = React.useState<boolean>(false);
  const [isMarkdownEditorDirty, set_isMarkdownEditorDirty] = React.useState<boolean>(false);

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'resourceVersionCreatorPage/onMountPage',
      payload: {
        resourceID: match.params.id,
      },
    });
  });

  AHooks.useUnmount(() => {
    // set_isMarkdownEditorDirty(false);
    dispatch<OnUnmountPageAction>({
      type: 'resourceVersionCreatorPage/onUnmountPage',
    });
  });

  AHooks.useDebounceEffect(
    () => {
      // console.log(resourceVersionCreatorPage.dataIsDirty, 'resourceVersionCreatorPage.dataIsDirtydsjlkfjlkjlsfoisdj woeisjflsk');
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

  const isCartoon = resourceVersionCreatorPage.resourceInfo?.resourceType[0] === '阅读'
    && resourceVersionCreatorPage.resourceInfo?.resourceType[1] === '漫画'
    && (resourceVersionCreatorPage.resourceInfo?.resourceType[2] === '条漫'
      || resourceVersionCreatorPage.resourceInfo?.resourceType[2] === '页漫');

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

  if (!resourceVersionCreatorPage.selectedFileInfo) {
    return (<div className={styles.noSelectedFileInfo}>
      <div style={{ height: 40 }} />
      <div style={{ display: 'flex', alignItems: 'center', width: 920 }}>
        <a onClick={() => {
          self.open(FUtil.LinkTo.resourceVersionInfo({
            resourceID: resourceVersionCreatorPage.resourceInfo?.resourceID || '',
            version: resourceVersionCreatorPage.resourceInfo?.latestVersion || undefined,
          }));
        }} style={{ display: 'flex', alignItems: 'center' }}>
          <FCoverImage
            src={resourceVersionCreatorPage.resourceInfo?.cover || ''}
            width={36}
            style={{ borderRadius: 4 }}
          />
          <div style={{ width: 10 }} />
          <FComponentsLib.FContentText
            text={resourceVersionCreatorPage.resourceInfo?.resourceName || ''}
            type={'highlight'}
          />
        </a>
        <div style={{ width: 5 }} />
        <label style={{
          backgroundColor: '#E4E7EB',
          borderRadius: 4,
          fontSize: 12,
          color: '#666',
          padding: '0 5px',
          lineHeight: '18px',
          display: 'inline-block',
        }}>{resourceVersionCreatorPage.resourceInfo?.resourceType.join('/')}</label>
        <div style={{ width: 10 }} />
        <FComponentsLib.FTitleText text={'/'} type={'h1'} />
        <div style={{ width: 10 }} />
        <FComponentsLib.FTitleText text={'新建版本'} type={'h1'} />
      </div>
      <div style={{ height: 100 }} />
      <div className={styles.styles}>
        {
          !isCartoon && (<LocalUpload
            style={{ width: '100%', flexGrow: 1 }}
            resourceTypeCode={resourceVersionCreatorPage.resourceInfo?.resourceTypeCode || ''}
            onSucceed={(value) => {
              dispatch<OnSucceed_UploadFile_Action>({
                type: 'resourceVersionCreatorPage/onSucceed_UploadFile',
                payload: {
                  name: value.fileName,
                  sha1: value.sha1,
                },
              });
            }}
          />)
        }

        {
          !isCartoon && (<StorageSpace
            style={{ width: '100%', flexGrow: 1 }}
            resourceTypeCode={resourceVersionCreatorPage.resourceInfo?.resourceTypeCode || ''}
            onSucceed={(value) => {
              dispatch<OnSucceed_ImportObject_Action>({
                type: 'resourceVersionCreatorPage/onSucceed_ImportObject',
                payload: {
                  name: value.objectName,
                  sha1: value.sha1,
                  objID: value.objectID,
                },
              });
            }}
          />)
        }


        {
          !isCartoon && resourceVersionCreatorPage.resourceInfo?.resourceType[0] === '阅读'
          && resourceVersionCreatorPage.resourceInfo?.resourceType[1] === '文章'
          && (<MarkdownEditor
            style={{ width: '100%', flexGrow: 1 }}
            onClickBtn={() => {
              // dispatch<OnClick_step2_editMarkdownBtn_Action>({
              //   type: 'resourceCreatorPage/onClick_step2_editMarkdownBtn',
              // });
              onClick_EditMarkdownBtn();
            }}
          />)
        }

        {
          isCartoon && (<CartoonEditor
            style={{ width: '100%', flexGrow: 1 }}
            onClickBtn={() => {
              // dispatch<OnClick_step2_editCartoonBtn_Action>({
              //   type: 'resourceCreatorPage/onClick_step2_editCartoonBtn',
              // });
              dispatch<OnClick_OpenCartoonBtn_Action>({
                type: 'resourceVersionCreatorPage/onClick_OpenCartoonBtn',
              });
            }}
          />)
        }

      </div>

      <div style={{ height: 100 }} />

      <ReleaseTip
        visible={resourceVersionCreatorPage.releaseTipVisible}
      />

      <ComicTool
        resourceId={resourceVersionCreatorPage.resourceInfo?.resourceID || ''}
        show={resourceVersionCreatorPage.isOpenCartoon}
        setSaved={(saved) => {
          // set_isfComicToolDirty(!saved);
          dispatch<ChangeAction>({
            type: 'resourceVersionCreatorPage/change',
            payload: {
              isDirtyCartoonEditor: !saved,
            },
          });
        }}
        close={() => {
          dispatch<OnClose_CartoonEditor_Action>({
            type: 'resourceVersionCreatorPage/onClose_CartoonEditor',
          });
        }}
      />

    </div>);
  }

  const hasError: boolean =
    resourceVersionCreatorPage.versionInput === '' ||
    $versionInputHasError ||
    !resourceVersionCreatorPage.selectedFileInfo ||
    resourceVersionCreatorPage.selectedFile_UsedResources.length > 0 ||
    resourceVersionCreatorPage.rawPropertiesState !== 'success';

  return (<>

    <FPrompt
      watch={resourceVersionCreatorPage.dataIsDirty || isMarkdownEditorDirty || resourceVersionCreatorPage.isDirtyCartoonEditor}
      messageText={'还没有保存草稿或发行，现在离开会导致信息丢失'}
      onOk={(locationHref) => {
        console.log('还没有保存草稿或发行 Ok');
        history.push(locationHref);
        // set_isOpenCartoon(false);
        // console.log('+++++++++++++++++++++++++还没有保存草稿或发行 w9e0opfjsdlk;fjlk');
        dispatch<OnChange_IsOpenCartoon_Action>({
          type: 'resourceVersionCreatorPage/onChange_IsOpenCartoon',
          payload: {
            value: false,
          },
        });
      }}
    />

    <div className={styles.selectedFileInfo}>
      <div style={{ width: 920 }}>
        <div style={{ height: 40 }} />
        <div style={{ display: 'flex', alignItems: 'center', width: 920 }}>
          <FCoverImage
            src={resourceVersionCreatorPage.resourceInfo?.cover || ''}
            width={36}
            style={{ borderRadius: 4 }}
          />
          <div style={{ width: 10 }} />
          <FComponentsLib.FContentText
            text={resourceVersionCreatorPage.resourceInfo?.resourceName || ''}
            type={'highlight'}
          />
          <div style={{ width: 5 }} />
          <label style={{
            backgroundColor: '#E4E7EB',
            borderRadius: 4,
            fontSize: 12,
            color: '#666',
            padding: '0 5px',
            lineHeight: '18px',
            display: 'inline-block',
          }}>{resourceVersionCreatorPage.resourceInfo?.resourceType.join('/')}</label>
          <div style={{ width: 10 }} />
          <FComponentsLib.FTitleText text={'/'} type={'h1'} />
          <div style={{ width: 10 }} />
          <FComponentsLib.FTitleText text={'新建版本'} type={'h1'} />
        </div>
        <div style={{ height: 30 }} />
        <VersionInput
          value={resourceVersionCreatorPage.versionInput}
          resourceLatestVersion={resourceVersionCreatorPage.resourceInfo?.latestVersion || '1.0.0'}
          onChange={(value) => {
            dispatch<OnChange_VersionInput_Action>({
              type: 'resourceVersionCreatorPage/onChange_VersionInput',
              payload: {
                value: value,
              },
            });
          }}
          onChangeError={(hasError) => {
            console.log(hasError, 'hasErroriosdjflkjsdlkfjlk sdlkfjlkj');
            set$versionInputHasError(hasError);
          }}
        />

        <div style={{ height: 30 }} />

        <div className={styles.fileInfo}>
          <div className={styles.card}>
            <img src={img} className={styles.img} alt='' />
            <div style={{ width: 20 }} />
            <div>
              <FComponentsLib.FContentText
                type='highlight'
                text={resourceVersionCreatorPage.selectedFileInfo.name}
                style={{ maxWidth: 600 }}
                singleRow
              />
              <div style={{ height: 18 }} />
              <div className={styles.info}>
                <FComponentsLib.FContentText
                  className={styles.infoSize}
                  type='additional1'
                  text={resourceVersionCreatorPage.selectedFileInfo.from}
                />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/*{*/}
            {/*  $prop.showEditBtnAfterSucceed && (<FComponentsLib.FTextBtn*/}
            {/*    disabled={$prop.disabledOperations?.includes('edit')}*/}
            {/*    type='primary'*/}
            {/*    onClick={() => {*/}
            {/*      $prop.onClick_EditBtn && $prop.onClick_EditBtn();*/}
            {/*    }}*/}
            {/*    // className={styles.delete}*/}
            {/*  >编辑</FComponentsLib.FTextBtn>)*/}
            {/*}*/}

            {/*{*/}
            {/*  $prop.showDownloadBtnAfterSucceed && (<FComponentsLib.FTextBtn*/}
            {/*    type='primary'*/}
            {/*    disabled={$prop.disabledOperations?.includes('download')}*/}
            {/*    onClick={() => {*/}
            {/*      // self.location.href = FUtil.Format.completeUrlByDomain('qi')*/}
            {/*      //   + `/v2/storages/files/${$prop.fileInfo?.sha1}/download?attachmentName=${$prop.fileInfo?.name}`;*/}
            {/*      $prop.onClick_DownloadBtn && $prop.onClick_DownloadBtn();*/}
            {/*    }}*/}
            {/*  >下载</FComponentsLib.FTextBtn>)*/}
            {/*}*/}

            {
              resourceVersionCreatorPage.resourceInfo?.resourceType[0] === '阅读'
              && resourceVersionCreatorPage.resourceInfo?.resourceType[1] === '文章' && (<>
                <FComponentsLib.FTextBtn
                  disabled={resourceVersionCreatorPage.rawPropertiesState === 'parsing'}
                  type='primary'
                  style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
                  onClick={async () => {
                    // dispatch<OnClick_OpenMarkdownBtn_Action>({
                    //   type: 'resourceVersionCreatorPage/onClick_OpenMarkdownBtn',
                    // });

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

                  }}
                >
                  <FComponentsLib.FIcons.FEdit style={{ fontSize: 12 }} />
                  <span>编辑</span>
                </FComponentsLib.FTextBtn>

                <FComponentsLib.FTextBtn
                  type='primary'
                  disabled={resourceVersionCreatorPage.rawPropertiesState === 'parsing'}
                  style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
                  onClick={() => {
                    // self.location.href = FUtil.Format.completeUrlByDomain('qi')
                    //   + `/v2/storages/files/${$prop.fileInfo?.sha1}/download?attachmentName=${$prop.fileInfo?.name}`;
                    if (!resourceVersionCreatorPage.selectedFileInfo) {
                      return;
                    }
                    // console.log(type, '98ieowjfkldjflksdjflksjdflkjsdlfkjsdlkj');
                    self.location.href = FUtil.Format.completeUrlByDomain('qi')
                      + `/v2/storages/files/${resourceVersionCreatorPage.selectedFileInfo?.sha1 || ''}/download?attachmentName=${resourceVersionCreatorPage.selectedFileInfo?.name || 'download'}`;
                  }}
                >
                  <FComponentsLib.FIcons.FDownload style={{ fontSize: 12 }} />
                  <span>下载</span>
                </FComponentsLib.FTextBtn>
              </>)
            }

            {
              resourceVersionCreatorPage.resourceInfo?.resourceType[1] === '漫画'
              && (resourceVersionCreatorPage.resourceInfo?.resourceType[2] === '条漫'
                || resourceVersionCreatorPage.resourceInfo?.resourceType[2] === '页漫') && (<FComponentsLib.FTextBtn
                disabled={resourceVersionCreatorPage.rawPropertiesState === 'parsing'}
                type='primary'
                style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
                onClick={() => {
                  // dispatch<OnClick_OpenCartoonBtn_Action>({
                  //   type: 'resourceVersionCreatorPage/onClick_OpenCartoonBtn',
                  // });
                  dispatch<OnClick_OpenCartoonBtn_Action>({
                    type: 'resourceVersionCreatorPage/onClick_OpenCartoonBtn',
                  });
                }}
              >
                <FComponentsLib.FIcons.FEdit style={{ fontSize: 12 }} />
                <span>编辑</span>
              </FComponentsLib.FTextBtn>)
            }


            <FComponentsLib.FTextBtn
              type='danger'
              style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
              // disabled={$prop.disabledOperations?.includes('remove')}
              onClick={async () => {
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
              // className={styles.delete}
            >
              <FComponentsLib.FIcons.FDelete style={{ fontSize: 12 }} />
              <span>{FI18n.i18nNext.t('remove')}</span>
            </FComponentsLib.FTextBtn>
          </div>
        </div>

        <div style={{ height: 5 }} />

        {
          resourceVersionCreatorPage.rawPropertiesState === 'parsing' && (<>
            <div style={{ height: 20 }} />
            <FSkeletonNode width={920} height={38} />
            <div style={{ height: 20 }} />
            <FSkeletonNode width={340} height={38} />
          </>)
        }

        {
          resourceVersionCreatorPage.rawPropertiesState === 'success' && (<>
            <div className={styles.block}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FComponentsLib.FContentText text={'基础属性'} type={'highlight'} />
                {/*<FComponentsLib.FContentText text={''} type={'highlight'}/>*/}
                {
                  resourceVersionCreatorPage.customProperties.length < 30 && (<Space size={10}>
                    <FTooltip title={FI18n.i18nNext.t('resourceinfo_add_btn_info')}>
                      <div>
                        <FComponentsLib.FTextBtn
                          style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
                          type='primary'
                          onClick={async () => {
                            const dataSource: {
                              key: string;
                              name: string;
                              value: string;
                              description: string;
                            } | null = await fResourcePropertyEditor({
                              disabledKeys: [
                                ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
                                ...resourceVersionCreatorPage.additionalProperties.map<string>((bp) => bp.key),
                                ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
                                ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
                              ],
                              disabledNames: [
                                ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.name),
                                ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.name),
                                ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
                                ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
                              ],
                            });
                            // console.log(dataSource, 'dataSource9iojskldjflksdjflk');
                            if (!dataSource) {
                              return;
                            }

                            await dispatch<OnChange_CustomProperties_Action>({
                              type: 'resourceVersionCreatorPage/onChange_CustomProperties',
                              payload: {
                                value: [
                                  ...resourceVersionCreatorPage.customProperties,
                                  dataSource,
                                ],
                              },
                            });
                          }}
                        >
                          <FComponentsLib.FIcons.FProperty style={{ fontSize: 14 }} />
                          <span>补充属性</span>
                        </FComponentsLib.FTextBtn>
                      </div>
                    </FTooltip>

                    {
                      (resourceVersionCreatorPage.preVersion_additionalProperties.length > 0
                        || resourceVersionCreatorPage.preVersion_customProperties.length > 0) &&
                      (<FComponentsLib.FTextBtn
                        style={{ fontSize: 12, fontWeight: 600 }}
                        type='primary'
                        onClick={async () => {
                          if (resourceVersionCreatorPage.preVersion_additionalProperties.length > 0) {
                            const dataSource_additionalProperties: {
                              key: string;
                              name: string;
                              value: string;
                              description: string;
                            }[] = resourceVersionCreatorPage.additionalProperties.map((ap) => {
                              const ap1 = resourceVersionCreatorPage.preVersion_additionalProperties.find((a) => {
                                return a.key === ap.key;
                              });

                              if (!ap1) {
                                return ap;
                              }

                              return {
                                ...ap,
                                value: ap1.value,
                              };
                            });

                            await dispatch<OnChange_AdditionalProperties_Action>({
                              type: 'resourceVersionCreatorPage/onChange_AdditionalProperties',
                              payload: {
                                value: dataSource_additionalProperties,
                              },
                            });
                          }

                          if (resourceVersionCreatorPage.preVersion_customProperties.length > 0) {
                            const dataSource: {
                              key: string;
                              name: string;
                              value: string;
                              description: string;
                            }[] | null = await fAddFileBaseProps({
                              defaultData: resourceVersionCreatorPage.preVersion_customProperties,
                              disabledKeys: [
                                ...resourceVersionCreatorPage.rawProperties.map((rp) => {
                                  return rp.key;
                                }),
                                ...resourceVersionCreatorPage.additionalProperties.map((rp) => {
                                  return rp.key;
                                }),
                                ...resourceVersionCreatorPage.customProperties.map((pp) => {
                                  return pp.key;
                                }),
                                ...resourceVersionCreatorPage.customConfigurations.map((pp) => {
                                  return pp.key;
                                }),
                              ],
                              disabledNames: [
                                ...resourceVersionCreatorPage.rawProperties.map((rp) => {
                                  return rp.name;
                                }),
                                ...resourceVersionCreatorPage.additionalProperties.map((rp) => {
                                  return rp.name;
                                }),
                                ...resourceVersionCreatorPage.customProperties.map((pp) => {
                                  return pp.name;
                                }),
                                ...resourceVersionCreatorPage.customConfigurations.map((pp) => {
                                  return pp.name;
                                }),
                              ],
                            });
                            if (!dataSource) {
                              return;
                            }

                            await dispatch<OnChange_CustomProperties_Action>({
                              type: 'resourceVersionCreatorPage/onChange_CustomProperties',
                              payload: {
                                value: [
                                  ...resourceVersionCreatorPage.customProperties,
                                  ...dataSource.map<ResourceVersionCreatorPageModelState['customProperties'][number]>((ds) => {
                                    return {
                                      key: ds.key,
                                      name: ds.name,
                                      value: ds.value,
                                      description: ds.description,
                                    };
                                  }),
                                ],
                              },
                            });
                          }

                        }}
                      >从上个版本导入</FComponentsLib.FTextBtn>)
                    }
                  </Space>)
                }
              </div>
              <div style={{ height: 20 }} />

              <FResourceProperties
                immutableData={resourceVersionCreatorPage.rawProperties}
                onlyEditValueData={resourceVersionCreatorPage.additionalProperties}
                alterableData={resourceVersionCreatorPage.customProperties}
                onEdit_onlyEditValueData={async (value) => {
                  // console.log(value, 'value sidjfoikjo sd value sdiofjlkj');
                  const index: number = resourceVersionCreatorPage.additionalProperties.findIndex((p) => {
                    return p === value;
                  });
                  const dataSource: {
                    key: string;
                    name: string;
                    value: string;
                    description: string;
                  } | null = await fResourcePropertyEditor({
                    disabledKeys: [
                      ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
                      ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.key),
                      ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
                      ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
                    ],
                    disabledNames: [
                      ...resourceVersionCreatorPage.rawProperties.map<string>((bp) => bp.name),
                      ...resourceVersionCreatorPage.additionalProperties.map<string>((bp) => bp.name),
                      ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
                      ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
                    ],
                    defaultData: value,
                    noneEditableFields: ['key', 'description', 'name'],
                    valueAcceptNull: true,
                  });
                  if (!dataSource) {
                    return;
                  }

                  await dispatch<OnChange_AdditionalProperties_Action>({
                    type: 'resourceVersionCreatorPage/onChange_AdditionalProperties',
                    payload: {
                      value: resourceVersionCreatorPage.additionalProperties.map((v, i) => {
                        if (i !== index) {
                          return v;
                        }
                        return dataSource;
                      }),
                    },
                  });
                }}
                onEdit_alterableData={async (value) => {
                  // console.log(value, 'valuesdijflksdjflk jlkjl');
                  const index: number = resourceVersionCreatorPage.customProperties.findIndex((p) => {
                    return p === value;
                  });
                  const dataSource: {
                    key: string;
                    name: string;
                    value: string;
                    description: string;
                  } | null = await fResourcePropertyEditor({
                    disabledKeys: [
                      ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
                      ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.key),
                      ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
                      ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
                    ],
                    disabledNames: [
                      ...resourceVersionCreatorPage.rawProperties.map<string>((bp) => bp.name),
                      ...resourceVersionCreatorPage.additionalProperties.map<string>((bp) => bp.name),
                      ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
                      ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
                    ],
                    defaultData: value,
                  });
                  if (!dataSource) {
                    return;
                  }

                  await dispatch<OnChange_CustomProperties_Action>({
                    type: 'resourceVersionCreatorPage/onChange_CustomProperties',
                    payload: {
                      value: resourceVersionCreatorPage.customProperties.map((v, i) => {
                        if (i !== index) {
                          return v;
                        }
                        return dataSource;
                      }),
                    },
                  });
                }}
                onDelete_alterableData={async (value) => {
                  // console.log(value, 'AAAAAAsdofijsdflksdjfldsjlkj');
                  await dispatch<OnChange_CustomProperties_Action>({
                    type: 'resourceVersionCreatorPage/onChange_CustomProperties',
                    payload: {
                      value: resourceVersionCreatorPage.customProperties.filter((v, i) => {
                        return v.key !== value.key && v.name !== value.name;
                      }),
                    },
                  });
                }}
              />
            </div>

            <div style={{ height: 15 }} />

            {
              $showMore
                ? (<FComponentsLib.FTextBtn
                  style={{ fontSize: 12 }}
                  type={'primary'}
                  onClick={() => {
                    set$ShowMore(false);
                  }}
                >{FI18n.i18nNext.t('create_new_version_btn_showless')}</FComponentsLib.FTextBtn>)
                : (<Space size={10}>
                  {/*{FI18n.i18nNext.t('create_new_version_btn_moresetting')}*/}
                  <FComponentsLib.FTextBtn
                    style={{ fontSize: 12 }}
                    type={'primary'}
                    onClick={() => {
                      set$ShowMore(true);
                    }}
                  >更多设置</FComponentsLib.FTextBtn>
                  <FComponentsLib.FContentText
                    text={FI18n.i18nNext.t('create_new_version_btn_moresetting_help')}
                    type={'additional2'}
                  />
                  {/*<FComponentsLib.FContentText text={'可以为资源文件添加可选配置，或进行依赖资源的声明'} type={'additional2'} />*/}
                </Space>)
            }
          </>)
        }


        <div style={{ display: $showMore ? 'block' : 'none' }}>
          {/*<div style={{ display: 'block' }}>*/}
          <div style={{ height: 10 }} />

          {
            (resourceVersionCreatorPage.resourceInfo?.resourceType.includes('插件')
              || resourceVersionCreatorPage.resourceInfo?.resourceType.includes('主题'))
            && (<>
              <div className={styles.block}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <FComponentsLib.FContentText text={FI18n.i18nNext.t('resourceoptions_title')} type={'highlight'} />

                  {
                    resourceVersionCreatorPage.customConfigurations.length < 30 && (<Space size={10}>
                      <FTooltip title={FI18n.i18nNext.t('info_versionoptions')}>
                        <div>
                          <FComponentsLib.FTextBtn
                            style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
                            type='primary'
                            onClick={async () => {
                              const dataSource: {
                                key: string;
                                name: string;
                                type: 'input' | 'select';
                                input: string;
                                select: string[];
                                description: string;
                              } | null = await fResourceOptionEditor({
                                disabledKeys: [
                                  ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
                                  ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.key),
                                  ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
                                  ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
                                ],
                                disabledNames: [
                                  ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.name),
                                  ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.name),
                                  ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
                                  ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
                                ],
                              });

                              if (!dataSource) {
                                return;
                              }

                              await dispatch<OnChange_CustomConfigurations_Action>({
                                type: 'resourceVersionCreatorPage/onChange_CustomConfigurations',
                                payload: {
                                  value: [
                                    ...resourceVersionCreatorPage.customConfigurations,
                                    dataSource,
                                  ],
                                },
                              });
                            }}
                          >
                            <FComponentsLib.FIcons.FConfiguration style={{ fontSize: 14 }} />
                            <span>{FI18n.i18nNext.t('resourceoptions_add_btn')}</span>
                          </FComponentsLib.FTextBtn>
                        </div>
                      </FTooltip>

                      {
                        resourceVersionCreatorPage.preVersion_customConfigurations.length > 0 && (
                          <FComponentsLib.FTextBtn
                            type='primary'
                            style={{ fontSize: 12 }}
                            onClick={async () => {
                              const data: {
                                key: string;
                                name: string;
                                description: string;
                                type: 'input' | 'select';
                                input: string;
                                select: string[];
                              }[] | null = await fAddCustomOptions({
                                disabledKeys: [
                                  ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
                                  ...resourceVersionCreatorPage.additionalProperties.map<string>((pp) => pp.key),
                                  ...resourceVersionCreatorPage.customProperties.map<string>((pp) => pp.key),
                                  ...resourceVersionCreatorPage.customConfigurations.map<string>((cod) => cod.key),
                                ],
                                disabledNames: [
                                  ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.name),
                                  ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.name),
                                  ...resourceVersionCreatorPage.customProperties.map<string>((pp) => pp.name),
                                  ...resourceVersionCreatorPage.customConfigurations.map<string>((cod) => cod.name),
                                ],
                                defaultData: resourceVersionCreatorPage.preVersion_customConfigurations,
                              });
                              // console.log(data, 'data09weeisojfsdlkfjsldkjflk');
                              if (!data) {
                                return;
                              }

                              await dispatch<OnChange_CustomConfigurations_Action>({
                                type: 'resourceVersionCreatorPage/onChange_CustomConfigurations',
                                payload: {
                                  value: [
                                    ...resourceVersionCreatorPage.customConfigurations,
                                    ...data,
                                  ],
                                },
                              });
                            }}
                          >从上个版本导入</FComponentsLib.FTextBtn>)
                      }
                    </Space>)
                  }
                </div>

                {
                  resourceVersionCreatorPage.customConfigurations.length === 0 && (<>
                    <div style={{ height: 10 }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {/*<span>{FI18n.i18nNext.t('resourceoptions_list_empty')}</span>*/}
                      <FComponentsLib.FContentText
                        text={FI18n.i18nNext.t('resourceoptions_list_empty')}
                        type={'additional2'}
                      />
                    </div>
                    <div style={{ height: 20 }} />
                  </>)
                }

                {
                  resourceVersionCreatorPage.customConfigurations.length > 0 && (<>
                    <div style={{ height: 20 }} />
                    <FResourceOptions
                      theme={'dark'}
                      // dataSource={resourceVersionCreatorPage.customOptionsData}
                      dataSource={resourceVersionCreatorPage.customConfigurations}
                      onEdit={async (value) => {
                        const index: number = resourceVersionCreatorPage.customConfigurations.findIndex((p) => {
                          return p === value;
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
                            ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
                            ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.key),
                            ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
                            ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
                          ],
                          disabledNames: [
                            ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.name),
                            ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.name),
                            ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
                            ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
                          ],
                          defaultData: value,
                        });

                        if (!dataSource) {
                          return;
                        }

                        await dispatch<OnChange_CustomConfigurations_Action>({
                          type: 'resourceVersionCreatorPage/onChange_CustomConfigurations',
                          payload: {
                            value: resourceVersionCreatorPage.customConfigurations.map((a, b) => {
                              if (b !== index) {
                                return a;
                              }
                              return dataSource;
                            }),
                          },
                        });
                      }}
                      onDelete={async (value) => {
                        await dispatch<OnChange_CustomConfigurations_Action>({
                          type: 'resourceVersionCreatorPage/onChange_CustomConfigurations',
                          payload: {
                            value: resourceVersionCreatorPage.customConfigurations.filter((a) => {
                              return a.key !== value.key && a.name !== value.name;
                            }),
                          },
                        });
                      }}
                    />
                  </>)
                }

              </div>

              <div style={{ height: 5 }} />
            </>)
          }

          <div className={styles.block}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/*{FI18n.i18nNext.t('claim_rely_title')}*/}
              <FComponentsLib.FContentText text={FI18n.i18nNext.t('claim_rely_title')} type={'highlight'} />
              <Space size={10}>
                {/*<FTooltip title={FI18n.i18nNext.t('resourceinfo_add_btn_info')}>*/}
                <FTooltip title={FI18n.i18nNext.t('info_versionrely')}>
                  <div>
                    <FComponentsLib.FTextBtn
                      style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
                      type='primary'
                      onClick={async () => {
                        const p = await getProcessor('resourceVersionCreator');
                        // console.log(p, 'psoidfjlskdjflsdjlkj');
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
                              resourceName: r.resourceName,
                            };
                          }) || [],
                          async onSelect_Resource({ resourceID, resourceName }) {
                            // console.log('8***********8sdflksdjlkj');
                            // const p = await getProcessor('resourceVersionCreator');
                            // console.log(p, 'asdiolfj;lksdjflkdsjflkjdslkfjlksdjlkf');
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
                            // const p = await getProcessor('resourceVersionCreator');
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
                    >
                      <FComponentsLib.FIcons.FConfiguration style={{ fontSize: 14 }} />
                      <span>{FI18n.i18nNext.t('claim_rely_add_btn')}</span>
                    </FComponentsLib.FTextBtn>
                  </div>
                </FTooltip>

                {
                  resourceVersionCreatorPage.preVersionDirectDependencies.length !== 0 &&
                  <FComponentsLib.FTextBtn
                    style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}
                    type='primary'
                    onClick={async () => {
                      dispatch<OnClick_ImportLastVersionDependents_Btn_Action>({
                        type: 'resourceVersionCreatorPage/onClick_ImportLastVersionDependents_Btn',
                      });
                    }}
                  >{FI18n.i18nNext.t('import_from_previous_version')}</FComponentsLib.FTextBtn>
                }
              </Space>
            </div>

            {
              size && size.height === 0 && (<>
                <div style={{ height: 10 }} />
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  {
                    FI18n.i18nNext.t('claim_rely_list_empty').split('\n').map((i, j) => {
                      return (<FComponentsLib.FContentText key={j} text={i} type={'additional2'} />);
                    })
                  }
                </div>
                <div style={{ height: 20 }} />
              </>)
            }

            <>
              {
                size && size.height > 0 && (<div style={{ height: 20 }} />)
              }
              <div ref={ref}>
                <FResourceAuthorizationProcessor
                  width={860}
                  height={600}
                  resourceID={resourceVersionCreatorPage.resourceInfo?.resourceID || ''}
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
            </>
          </div>
        </div>

        <div style={{ height: 30 }} />

        <div className={styles.btn}>

          {
            resourceVersionCreatorPage.draftSaveTime && (<FComponentsLib.FContentText
              text={`已保存 ${resourceVersionCreatorPage.draftSaveTime}`}
              type={'additional2'}
            />)
          }

          {/*{FI18n.i18nNext.t('rqr_step3_btn_later')}*/}
          <FComponentsLib.FTextBtn
            type={'default'}
            onClick={() => {
              dispatch<OnTrigger_SaveDraft_Action>({
                type: 'resourceVersionCreatorPage/onTrigger_SaveDraft',
                payload: {
                  showSuccessTip: true,
                },
              });
            }}
          >{FI18n.i18nNext.t('save_as_draft')}</FComponentsLib.FTextBtn>
          {/*{FI18n.i18nNext.t('rqr_step3_btn_next')}*/}
          <FComponentsLib.FRectBtn
            disabled={hasError}
            type={'primary'}
            onClick={() => {
              dispatch<OnClick_CreateVersionBtn_Action>({
                type: 'resourceVersionCreatorPage/onClick_CreateVersionBtn',
              });
            }}
          >{FI18n.i18nNext.t('release_to_market')}</FComponentsLib.FRectBtn>
        </div>

        <div style={{ height: 100 }} />
      </div>
    </div>

    <ComicTool
      resourceId={resourceVersionCreatorPage.resourceInfo?.resourceID || ''}
      show={resourceVersionCreatorPage.isOpenCartoon}
      setSaved={(saved) => {
        // set_isfComicToolDirty(!saved);
        dispatch<ChangeAction>({
          type: 'resourceVersionCreatorPage/change',
          payload: {
            isDirtyCartoonEditor: !saved,
          },
        });
      }}
      close={() => {
        // dispatch<OnChange_IsOpenCartoon_Action>({
        //   type: 'resourceVersionCreatorPage/onChange_IsOpenCartoon',
        //   payload: {
        //     value: false,
        //   },
        // });
        // set_isfComicToolDirty(false);
        dispatch<OnClose_CartoonEditor_Action>({
          type: 'resourceVersionCreatorPage/onClose_CartoonEditor',
        });
      }}
    />
  </>);
}

export default connect(({ resourceVersionCreatorPage }: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(VersionCreator);
