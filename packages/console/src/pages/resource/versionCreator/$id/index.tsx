import * as React from 'react';
import styles from './index.less';
import LocalUpload from '@/pages/resource/creator/Step2/LocalUpload';
import StorageSpace from '@/pages/resource/creator/Step2/StorageSpace';
import MarkdownEditor from '@/pages/resource/creator/Step2/MarkdownEditor';
import CartoonEditor from '@/pages/resource/creator/Step2/CartoonEditor';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FUtil } from '@freelog/tools-lib';
import img from '@/assets/file-object.svg';
import FTooltip from '@/components/FTooltip';
import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
import FResourceProperties from '@/components/FResourceProperties';
import { Progress, Space } from 'antd';
import fResourceOptionEditor from '@/components/fResourceOptionEditor';
import FResourceOptions from '@/components/FResourceOptions';
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
  OnChange_IsOpenCartoon_Action,
  OnChange_VersionInput_Action,
  OnClick_CreateVersionBtn_Action,
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
import { ComicTool } from '@/components/fComicTool/FComicToolModal';
import FReleaseTip from '@/components/FReleaseTip';
import fAddFileBaseProps from '@/components/fAddFileBaseProps';
import fAddCustomOptions from '@/components/fAddCustomOptions';
import FVersionInput from '@/components/FVersionInput';
import FPrompt from '@/components/FPrompt';
import FSkeletonNode from '@/components/FSkeletonNode';
import { withRouter, history } from 'umi';
import FMicroApp_MarkdownEditorDrawer from '@/components/FMicroApp_MarkdownEditorDrawer';
import { getFilesSha1Info } from '@/utils/service';
import fMessage from '@/components/fMessage';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';
import FMicroAPP_Authorization from '@/components/FMicroAPP_Authorization';

interface VersionCreatorProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function VersionCreator({ match, dispatch, resourceVersionCreatorPage }: VersionCreatorProps) {

  // const ref = React.useRef(null);
  // const size = AHooks.useSize(ref);
  const [$showMore, set$ShowMore, get$ShowMore] = useGetState<boolean>(false);
  const [$versionInputHasError, set$versionInputHasError] = React.useState<boolean>(false);
  const [isMarkdownEditorDirty, set_isMarkdownEditorDirty] = React.useState<boolean>(false);

  const [$uploadingInfo, set$uploadingInfo, get$uploadingInfo] = useGetState<null | {
    name: string;
    percent: number;
    cancelHandler: any;
  }>(null);

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

    if (resourceVersionCreatorPage.selectedFileInfo) {
      const { result } = await getFilesSha1Info({
        sha1: [resourceVersionCreatorPage.selectedFileInfo?.sha1 || ''],
        resourceTypeCode: '',
      });

      if (result[0].fileSize > 2 * 1024 * 1024) {
        fMessage(FI18n.i18nNext.t('mdeditor_import_error_lengthlimitation'), 'error');
        return;
      }
    }
    await dispatch<OnTrigger_SaveDraft_Action>({
      type: 'resourceVersionCreatorPage/onTrigger_SaveDraft',
      payload: {
        showSuccessTip: false,
      },
    });
    dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload: {
        isOpenMarkdown: true,
      },
    });
  }

  async function onClose_EditMarkdown() {
    dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload: {
        isOpenMarkdown: false,
      },
    });
    await set_isMarkdownEditorDirty(false);
    await dispatch<OnClose_MarkdownEditor_Action>({
      type: 'resourceVersionCreatorPage/onClose_MarkdownEditor',
    });
  }

  // if (!resourceVersionCreatorPage.selectedFileInfo) {
  //   return ();
  // }

  const hasError: boolean =
    resourceVersionCreatorPage.versionInput === '' ||
    $versionInputHasError ||
    !resourceVersionCreatorPage.selectedFileInfo ||
    resourceVersionCreatorPage.selectedFile_UsedResources.length > 0 ||
    resourceVersionCreatorPage.rawPropertiesState !== 'success' ||
    !resourceVersionCreatorPage.isCompleteAuthorization;

  return (<>

    <div
      className={styles.noSelectedFileInfo}
      style={{ display: !resourceVersionCreatorPage.selectedFileInfo ? 'flex' : 'none' }}
    >
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
            style={{
              maxWidth: 490,
              // overflowWrap: 'break-word',
            }}
            singleRow
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
          maxWidth: 240,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}>{resourceVersionCreatorPage.resourceInfo?.resourceType.join('/')}</label>
        <div style={{ width: 10 }} />
        <FComponentsLib.FTitleText text={'/'} type={'h1'} />
        <div style={{ width: 10 }} />
        <FComponentsLib.FTitleText text={'新建版本'} type={'h1'} />
      </div>
      <div style={{ height: 100 }} />
      {
        !!$uploadingInfo && (<div style={{ width: 920 }}>
          <div className={styles.fileInfo}>
            <div className={styles.card}>
              <img src={img} className={styles.img} alt='' />
              <div style={{ width: 20 }} />
              <div>
                <FComponentsLib.FContentText
                  type='highlight'
                  text={$uploadingInfo?.name || ''}
                  style={{ maxWidth: 600 }}
                  singleRow
                />
                <div style={{ height: 18 }} />
                <div className={styles.info}>
                  <FComponentsLib.FContentText
                    className={styles.infoSize}
                    type='additional1'
                    text={'本地上传'}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', width: 270 }}>
              <FComponentsLib.FContentText
                text={`${$uploadingInfo?.percent || 0}%`}
                type={'additional1'}
                style={{ color: '#222' }}
              />
              <div style={{ width: 10 }} />
              <Progress
                percent={$uploadingInfo?.percent || 0}
                showInfo={false}
                style={{ width: 140 }}
              />
              <div style={{ width: 20 }} />
              {
                $uploadingInfo?.percent === 100
                  ? (<FComponentsLib.FTextBtn
                    style={{ fontSize: 12 }}
                    type={'primary'}
                  >正在解析</FComponentsLib.FTextBtn>)
                  : (<FComponentsLib.FTextBtn
                    style={{ fontSize: 12 }}
                    type={'danger'}
                    onClick={() => {
                      const uploadingInfo = get$uploadingInfo();
                      uploadingInfo && uploadingInfo.cancelHandler();
                      set$uploadingInfo(null);
                    }}
                  >取消上传</FComponentsLib.FTextBtn>)
              }

            </div>
          </div>
        </div>)
      }

      {
        !$uploadingInfo && (<div className={styles.styles}>
          {
            !isCartoon && (<LocalUpload
              resourceType={resourceVersionCreatorPage.resourceInfo?.resourceType || []}
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
              onChange_uploadingInfo={(value) => {
                set$uploadingInfo(value);
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

                // dispatch<ChangeAction>({
                //   type: 'resourceVersionCreatorPage/change',
                //   payload: {
                //     isOpenMarkdown: true,
                //   },
                // });
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

        </div>)
      }


      <div style={{ height: 100 }} />

      <FReleaseTip
        visible={resourceVersionCreatorPage.releaseTipVisible}
      />

      {/*<ComicTool*/}
      {/*  resourceId={resourceVersionCreatorPage.resourceInfo?.resourceID || ''}*/}
      {/*  show={resourceVersionCreatorPage.isOpenCartoon}*/}
      {/*  setSaved={(saved) => {*/}
      {/*    // set_isfComicToolDirty(!saved);*/}
      {/*    dispatch<ChangeAction>({*/}
      {/*      type: 'resourceVersionCreatorPage/change',*/}
      {/*      payload: {*/}
      {/*        isDirtyCartoonEditor: !saved,*/}
      {/*      },*/}
      {/*    });*/}
      {/*  }}*/}
      {/*  close={() => {*/}
      {/*    dispatch<OnClose_CartoonEditor_Action>({*/}
      {/*      type: 'resourceVersionCreatorPage/onClose_CartoonEditor',*/}
      {/*    });*/}
      {/*  }}*/}
      {/*/>*/}
    </div>
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

    <div
      className={styles.selectedFileInfo}
      style={{ display: resourceVersionCreatorPage.selectedFileInfo ? 'flex' : 'none' }}
    >
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
        <FVersionInput
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
                text={resourceVersionCreatorPage.selectedFileInfo?.name || ''}
                style={{ maxWidth: 600 }}
                singleRow
              />
              <div style={{ height: 18 }} />
              <div className={styles.info}>
                <FComponentsLib.FContentText
                  className={styles.infoSize}
                  type='additional1'
                  text={resourceVersionCreatorPage.selectedFileInfo?.from || ''}
                />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {
              resourceVersionCreatorPage.resourceInfo?.resourceType[0] === '阅读'
              && resourceVersionCreatorPage.resourceInfo?.resourceType[1] === '文章' && (<>
                <FComponentsLib.FTextBtn
                  disabled={resourceVersionCreatorPage.rawPropertiesState === 'parsing'}
                  type='primary'
                  style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
                  onClick={async () => {
                    onClick_EditMarkdownBtn();
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
                    self.location.href = FUtil.Format.completeUrlByDomain('api')
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
                  const bool: boolean = await fPromiseModalConfirm({
                    title: '提示',
                    description: FI18n.i18nNext.t('createversion_remove_file_confirmation'),
                    okText: FI18n.i18nNext.t('createversion_remove_file_btn_remove'),
                    cancelText: FI18n.i18nNext.t('btn_cancel'),
                  });
                  if (bool) {
                    dispatch<OnDelete_ObjectFile_Action>({
                      type: 'resourceVersionCreatorPage/onDelete_ObjectFile',
                    });
                  }
                  // fConfirmModal({
                  //   message: FI18n.i18nNext.t('createversion_remove_file_confirmation'),
                  //   okText: FI18n.i18nNext.t('createversion_remove_file_btn_remove'),
                  //   cancelText: FI18n.i18nNext.t('btn_cancel'),
                  //   onOk() {
                  //     dispatch<OnDelete_ObjectFile_Action>({
                  //       type: 'resourceVersionCreatorPage/onDelete_ObjectFile',
                  //     });
                  //   },
                  // });
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


        {
          $showMore && (<div>
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
              {
                // resourceVersionCreatorPage.resourceInfo && (<FMicroAPP_Authorization
                resourceVersionCreatorPage.resourceInfo && (<FMicroAPP_Authorization
                  // name={'Authorization'}
                  reload={resourceVersionCreatorPage.authReload}
                  licenseeId={resourceVersionCreatorPage.resourceInfo.resourceID}
                  mainAppType={'resourceInVersionUpdate'}
                  depList={resourceVersionCreatorPage.directDependencies}
                  upcastList={resourceVersionCreatorPage.baseUpcastResources}
                  update={(data: any) => {
                    // console.log(data, 'resourceInVersionUpdate ____________________ data sdifjlskdfjlkjlk');
                    dispatch<ChangeAction>({
                      type: 'resourceVersionCreatorPage/change',
                      payload: {
                        directDependencies: data.depList,
                        resolveResources: data.resolveResources,
                        baseUpcastResources: data.upcastList,
                        isCompleteAuthorization: data.isAllAuthComplete,
                        dataIsDirty: true,
                      },
                    });
                  }}
                />)
              }
            </div>
          </div>)
        }


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

    <FMicroApp_MarkdownEditorDrawer
      open={resourceVersionCreatorPage.isOpenMarkdown}
      resourceID={resourceVersionCreatorPage.resourceInfo?.resourceID || ''}
      onChange_Saved={(saved) => {
        dispatch<ChangeAction>({
          type: 'resourceVersionCreatorPage/change',
          payload: {
            isDirtyMarkdownEditor: !saved,
          },
        });
      }}
      onClose={() => {
        // dispatch<ChangeAction>({
        //   type: 'resourceVersionCreatorPage/change',
        //   payload: {
        //     isOpenMarkdown: false,
        //   },
        // });
        onClose_EditMarkdown();
      }}
    />
  </>);
}

export default withRouter(connect(({ resourceVersionCreatorPage }: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(VersionCreator));


