import * as React from 'react';
import styles from './index.less';
import FInput from '@/components/FInput';
import FBraftEditor from '@/components/FBraftEditor';
import { Space } from 'antd';
import FSelectObject from '@/pages/resource/components/FSelectObject';
import FDepPanel from './FDepPanel';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import {
  ConnectState,
  ResourceInfoModelState,
  ResourceVersionCreatorPageModelState,
} from '@/models/connect';
import {
  ChangeAction,
  OnClickCacheBtnAction,
  OnClickCreateBtnAction, OnDelete_ObjectFile_Action,
  OnMountPageAction,
  OnPromptPageLeaveAction,
  OnPromptPageLeaveCancelAction,
  OnPromptPageLeaveConfirmAction, OnSuccess_ObjectFile_Action,
  OnUnmountPageAction,
  VerifyVersionInputAction,
} from '@/models/resourceVersionCreatorPage';
import { withRouter, Prompt } from 'umi';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Sider from '@/pages/resource/containers/Sider';
import FFormLayout from '@/components/FFormLayout';
import * as H from 'history';
import fConfirmModal from '@/components/fConfirmModal';
import { RouteComponentProps } from 'react-router';
import * as AHooks from 'ahooks';
import CustomOptions from './CustomOptions';
import { Helmet } from 'react-helmet';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { EditorState } from 'braft-editor';
import FPublishObjectFile from '@/components/FPublishObjectFile';

interface VersionCreatorProps extends RouteComponentProps<{ id: string; }> {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState,
  resourceInfo: ResourceInfoModelState,
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
    !resourceVersionCreatorPage.version || !!resourceVersionCreatorPage.versionErrorText
    // 选择的文件对象
    || !resourceVersionCreatorPage.selectedFileInfo
    || resourceVersionCreatorPage.rawPropertiesState !== 'success'
    // 依赖
    || resourceVersionCreatorPage.dependencies.some((dd) => {
      return !dd.upthrow && !dd.enableReuseContracts.some((erc) => erc.checked) && !dd.enabledPolicies.some((ep) => ep.checked);
    });

  return (<>
      <Helmet>
        <title>{`创建版本 · ${resourceInfo.info?.resourceName || ''}  - Freelog`}</title>
      </Helmet>

      <Prompt
        when={resourceVersionCreatorPage.promptLeavePath === '' && resourceVersionCreatorPage.dataIsDirty}
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
        header={<Header
          onClickCreate={() => {
            // window.onbeforeunload = null;
            dispatch<OnClickCreateBtnAction>({
              type: 'resourceVersionCreatorPage/onClickCreateBtn',
            });
          }}
          onClickCache={() => {
            dispatch<OnClickCacheBtnAction>({
              type: 'resourceVersionCreatorPage/onClickCacheBtn',
            });
          }}
          disabledCreate={hasError}
        />}
      >
        <FFormLayout>
          <FFormLayout.FBlock
            dot={true}
            title={FI18n.i18nNext.t('version_number')}
          >
            <FInput
              value={resourceVersionCreatorPage.version}
              onChange={(e) => {
                dispatch<ChangeAction>({
                  type: 'resourceVersionCreatorPage/change',
                  payload: {
                    version: e.target.value,
                    dataIsDirty: true,
                  },
                  caller: '23$^%%%%^&^&&4532434345234324534%#$%#$%#$%#$#$',
                });
              }}
              onBlur={() => {
                dispatch<VerifyVersionInputAction>({
                  type: 'resourceVersionCreatorPage/verifyVersionInput',
                  // payload: e.target.value,
                });
              }}
              className={styles.versionInput}
              errorText={resourceVersionCreatorPage.versionErrorText}
            />
          </FFormLayout.FBlock>

          <FFormLayout.FBlock dot={true} title={FI18n.i18nNext.t('release_object')}>
            <FPublishObjectFile
              fileInfo={resourceVersionCreatorPage.selectedFileInfo}
              onSucceed_UploadFile={(file) => {
                console.log(file, 'onSucceed_UploadFile390oisjdf');
                dispatch<OnSuccess_ObjectFile_Action>({
                  type: 'resourceVersionCreatorPage/onSuccess_ObjectFile',
                  payload: {
                    name: file.fileName,
                    sha1: file.sha1,
                    from: '本地上传',
                  },
                });
              }}
              onSucceed_ImportObject={(obj) => {
                console.log(obj, 'onSucceed_ImportObject390oisjdf');
                dispatch<OnSuccess_ObjectFile_Action>({
                  type: 'resourceVersionCreatorPage/onSuccess_ObjectFile',
                  payload: {
                    name: obj.objName,
                    sha1: obj.sha1,
                    from: '存储空间',
                  },
                });
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
            <FDepPanel />
          </FFormLayout.FBlock>

          <FFormLayout.FBlock dot={false} title={FI18n.i18nNext.t('version_description')}>
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

function Header({ onClickCache, onClickCreate, disabledCreate = false }: HeaderProps) {
  return (<div className={styles.Header}>
    {/*<FTitleText text={FUtil.I18n.message('create_new_version')} type="h1"/>*/}
    <FComponentsLib.FTitleText text={'创建版本'} type='h1' />

    <Space size={30}>
      <FComponentsLib.FTextBtn
        type='default'
        onClick={onClickCache}
      >{FI18n.i18nNext.t('save_as_draft')}</FComponentsLib.FTextBtn>
      <FComponentsLib.FRectBtn
        style={{ display: 'flex', alignItems: 'center' }}
        onClick={onClickCreate}
        disabled={disabledCreate}
      >
        <FComponentsLib.FIcons.FPaperPlane style={{ fontWeight: 400, fontSize: 16 }} />
        <div style={{ width: 5 }} />
        {FI18n.i18nNext.t('release_to_market')}
      </FComponentsLib.FRectBtn>
    </Space>
  </div>);
}

export default withRouter(connect(({ resourceVersionCreatorPage, resourceInfo }: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
  resourceInfo: resourceInfo,
}))(VersionCreator));
