import * as React from 'react';
import styles from './index.less';
// import FInput from '@/components/FInput';
import FBraftEditor from '@/components/FBraftEditor';
import { Space } from 'antd';
// import FDepPanel from './FDepPanel';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import {
  ConnectState,
  ResourceInfoModelState,
  ResourceVersionCreatorPageModelState,
} from '@/models/connect';
import {
  ChangeAction,
  OnClick_SaveCacheBtn_Action,
  OnClick_CreateVersionBtn_Action,
  OnDelete_ObjectFile_Action,
  OnMountPageAction,
  OnPromptPageLeaveAction,
  OnPromptPageLeaveCancelAction,
  OnPromptPageLeaveConfirmAction,
  OnSuccess_ObjectFile_Action,
  OnUnmountPageAction, ImportLastVersionDataAction,
  // VerifyVersionInputAction,
} from '@/models/resourceVersionCreatorPage';
import { Prompt } from 'umi';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Sider from '@/pages/resource/containers/Sider';
import FFormLayout from '@/components/FFormLayout';
import * as H from 'history';
import fConfirmModal from '@/components/fConfirmModal';
import { RouteComponentProps } from 'react-router';
import * as AHooks from 'ahooks';
import CustomOptions from './CustomOptions';
import { Helmet } from 'react-helmet';
import { FI18n, FServiceAPI } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { EditorState } from 'braft-editor';
import FPublishObjectFile from '@/components/FPublishObjectFile';
import { MarkdownEditor } from '@/pages/resource/md-editor';
import FResourceAuthorizationProcessor, { getProcessor } from '@/components/FResourceAuthorizationProcessor';
import VersionInput from './VersionInput';
import Market from '@/pages/resource/version/creator/$id/FDepPanel/Market';
import FDrawer from '@/components/FDrawer';

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
  const [show, setShow] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

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

  React.useEffect(() => {
    // const func = () => 1234;
    // console.log('#######89iowkejsldfjl')
    if (resourceVersionCreatorPage.dataIsDirty) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
  }, [resourceVersionCreatorPage.dataIsDirty]);

  async function onChange(payload: ChangeAction['payload']) {
    await dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload,
      caller: '2345324343452===-0-9--34324534%#$%#$%#$%#$#$',
    });
  }

  const hasError: boolean =
    // 版本
    !resourceVersionCreatorPage.version ||
    // !!resourceVersionCreatorPage.versionErrorText ||
    // 选择的文件对象
    !resourceVersionCreatorPage.selectedFileInfo ||
    resourceVersionCreatorPage.rawPropertiesState !== 'success';
  // ||
  // 依赖
  // resourceVersionCreatorPage.dependencies.some((dd) => {
  //   return (
  //     !dd.upthrow &&
  //     !dd.enableReuseContracts.some((erc) => erc.checked) &&
  //     !dd.enabledPolicies.some((ep) => ep.checked)
  //   );
  // });

  return (
    <>
      <MarkdownEditor
        resourceId={match.params.id}
        show={show}
        close={() => {
          setShow(false);
        }}
        setSaved={setSaved}
      />

      <div
        style={{ position: 'absolute', left: '300px', top: '80px' }}
        onClick={() => setShow(true)}
      >
        打开编辑器
      </div>

      <Helmet>
        <title>{`创建版本 · ${
          resourceInfo.info?.resourceName || ''
        }  - Freelog`}</title>
      </Helmet>

      <Prompt
        when={
          resourceVersionCreatorPage.promptLeavePath === '' &&
          resourceVersionCreatorPage.dataIsDirty
        }
        message={(location: H.Location, action: H.Action) => {
          // console.log(location, action, 'LAAAAL');
          // return window.confirm('还没有保存草稿或发行，现在离开会导致信息丢失');
          const locationHref: string = location.pathname + location.search;

          dispatch<OnPromptPageLeaveAction>({
            type: 'resourceVersionCreatorPage/onPromptPageLeave',
            payload: {
              href: locationHref,
            },
          });

          fConfirmModal({
            message: '还没有保存草稿或发行，现在离开会导致信息丢失',
            onOk() {
              dispatch<OnPromptPageLeaveConfirmAction>({
                type: 'resourceVersionCreatorPage/onPromptPageLeaveConfirm',
              });
            },
            onCancel() {
              dispatch<OnPromptPageLeaveCancelAction>({
                type: 'resourceVersionCreatorPage/onPromptPageLeaveCancel',
              });
            },
          });
          return false;
        }}
      />
      <FLeftSiderLayout
        sider={<Sider />}
        header={
          <Header
            onClickCreate={() => {
              // window.onbeforeunload = null;
              dispatch<OnClick_CreateVersionBtn_Action>({
                type: 'resourceVersionCreatorPage/onClick_CreateVersionBtn',
              });
            }}
            onClickCache={() => {
              dispatch<OnClick_SaveCacheBtn_Action>({
                type: 'resourceVersionCreatorPage/onClick_SaveCacheBtn',
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
              value={resourceVersionCreatorPage.version}
              resourceLatestVersion={resourceVersionCreatorPage.latestVersion}
              onChange={(value) => {
                dispatch<ChangeAction>({
                  type: 'resourceVersionCreatorPage/change',
                  payload: {
                    version: value,
                    // dataIsDirty: true,
                  },
                });
              }}
            />
            {/*<FInput*/}
            {/*  value={resourceVersionCreatorPage.version}*/}
            {/*  onChange={(e) => {*/}
            {/*    dispatch<ChangeAction>({*/}
            {/*      type: 'resourceVersionCreatorPage/change',*/}
            {/*      payload: {*/}
            {/*        version: e.target.value,*/}
            {/*        dataIsDirty: true,*/}
            {/*      },*/}
            {/*    });*/}
            {/*  }}*/}
            {/*  onBlur={() => {*/}
            {/*    dispatch<VerifyVersionInputAction>({*/}
            {/*      type: 'resourceVersionCreatorPage/verifyVersionInput',*/}
            {/*      // payload: e.target.value,*/}
            {/*    });*/}
            {/*  }}*/}
            {/*  className={styles.versionInput}*/}
            {/*  errorText={resourceVersionCreatorPage.versionErrorText}*/}
            {/*/>*/}
          </FFormLayout.FBlock>

          <FFormLayout.FBlock
            dot={true}
            title={FI18n.i18nNext.t('release_object')}
          >
            <FPublishObjectFile
              fileInfo={resourceVersionCreatorPage.selectedFileInfo}
              onSucceed_UploadFile={(file) => {
                // console.log(file, 'onSucceed_UploadFile390oisjdf');
                dispatch<OnSuccess_ObjectFile_Action>({
                  type: 'resourceVersionCreatorPage/onSuccess_ObjectFile',
                  payload: {
                    name: file.fileName,
                    sha1: file.sha1,
                    from: '本地上传',
                  },
                });
              }}
              onSucceed_ImportObject={async (obj) => {
                // console.log(obj, 'onSucceed_ImportObject390oisjdf');
                dispatch<OnSuccess_ObjectFile_Action>({
                  type: 'resourceVersionCreatorPage/onSuccess_ObjectFile',
                  payload: {
                    name: obj.objName,
                    sha1: obj.sha1,
                    from: '存储空间',
                  },
                });

                const params: Parameters<typeof FServiceAPI.Storage.objectDetails>[0] = {
                  objectIdOrName: obj.objID,
                };
                const { data: data_objectDetails }: {
                  data: {
                    dependencies: {
                      name: string;
                      type: 'resource' | 'object';
                      versionRange?: string;
                    }[];
                  }
                } = await FServiceAPI.Storage.objectDetails(params);

                // console.log(data_objectDetails, 'datasdoipejflskdfjlsdjflskj');
                const resourceNames: string[] = data_objectDetails.dependencies
                  .filter((d) => {
                    return d.type === 'resource';
                  })
                  .map((d) => {
                    return d.name;
                  });

                const objNames: string[] = data_objectDetails.dependencies
                  .filter((d) => {
                    return d.type === 'object';
                  })
                  .map((d) => {
                    return d.name;
                  });

                let addR: {
                  id: string;
                  name: string;
                  type: 'resource';
                  versionRange: string;
                }[] = [];
                let addO: {
                  id: string;
                  name: string;
                  type: 'object';
                }[] = [];
                if (resourceNames.length > 0) {
                  const { data: data_resources }: {
                    data: {
                      resourceId: string;
                      resourceName: string;
                      latestVersion: string;
                    }[];
                  } = await FServiceAPI.Resource.batchInfo({
                    resourceNames: resourceNames.join(),
                  });
                  // console.log(data_resources, 'resourceiojlkdsjflsdjflk');
                  addR = data_resources.map((r) => {
                    return {
                      id: r.resourceId,
                      name: r.resourceName,
                      type: 'resource',
                      versionRange: '^' + r.latestVersion,
                    };
                  });
                }

                if (objNames.length > 0) {
                  const { data: data_objs }: {
                    data: {
                      objectId: string;
                      objectName: string;
                    }[];
                  } = await FServiceAPI.Storage.batchObjectList({
                    fullObjectNames: objNames.map((o) => {
                      return encodeURIComponent(o);
                    }).join(','),
                  });

                  // console.log(data_objs, 'objsoisjdlfksjfljsdlkfjsdlfjl');
                  addO = data_objs.map((o) => {
                    return {
                      id: o.objectId,
                      name: o.objectName,
                      type: 'object',
                    };
                  });
                }

                const processor = await getProcessor();
                await processor.addTargets([
                  ...addR,
                  ...addO,
                ]);

              }}
              onClick_DeleteBtn={() => {
                dispatch<OnDelete_ObjectFile_Action>({
                  type: 'resourceVersionCreatorPage/onDelete_ObjectFile',
                });
              }}
            />
            {/*<FSelectObject />*/}

            <CustomOptions />
          </FFormLayout.FBlock>

          <FFormLayout.FBlock dot={false} title={FI18n.i18nNext.t('rely')}>
            {/*<FDepPanel />*/}

            <Space size={15}>
              <FComponentsLib.FRectBtn
                onClick={() => {

                }}
                type='default'
              >添加依赖</FComponentsLib.FRectBtn>
              <FDrawer
                // title={FUtil.I18n.message('add_rely_resource')}
                title={'添加依赖'}
                // onClose={() => setModalVisible(false)}
                // open={modalVisible}
                width={820}
              >
                <Market />
              </FDrawer>
              {
                resourceVersionCreatorPage.preVersionDirectDependencies.length !== 0 &&
                <FComponentsLib.FRectBtn
                  type='default'
                  onClick={() => {
                    dispatch<ImportLastVersionDataAction>({
                      type: 'resourceVersionCreatorPage/importLastVersionData',
                      payload: 'deps',
                    });
                    dispatch<ChangeAction>({
                      type: 'resourceVersionCreatorPage/change',
                      payload: {
                        dataIsDirty: true,
                      },
                      caller: '23453243434(((()00005234324534%#$%#$%#$%#$#$',
                    });
                  }}
                >{FI18n.i18nNext.t('import_from_previous_version')}</FComponentsLib.FRectBtn>
              }

            </Space>

            <FResourceAuthorizationProcessor
              resourceID={resourceVersionCreatorPage.resourceId}
              onMount={(processor) => {

              }}
            />
          </FFormLayout.FBlock>

          <FFormLayout.FBlock
            dot={false}
            title={FI18n.i18nNext.t('version_description')}
          >
            <FBraftEditor
              value={resourceVersionCreatorPage.description}
              onChange={(value: EditorState) => {
                // console.log('######!!~@#@!#!@');
                onChange({
                  description: value,
                  dataIsDirty: true,
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
