import * as React from 'react';
import styles from './index.less';
import { FTitleText } from '@/components/FText';
import FInput from '@/components/FInput';
import FBraftEditor from '@/components/FBraftEditor';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import { Space } from 'antd';
import FSelectObject from '@/pages/resource/components/FSelectObject';
import FDepPanel from './FDepPanel';
import { connect, Dispatch } from 'dva';
import {
  ConnectState,
  ResourceInfoModelState,
  ResourceVersionCreatorPageModelState,
} from '@/models/connect';
import {
  ChangeAction,
  OnClickCacheBtnAction,
  OnClickCreateBtnAction,
  OnMountPageAction,
  OnPromptPageLeaveAction,
  OnPromptPageLeaveCancelAction,
  OnPromptPageLeaveConfirmAction,
  OnUnmountPageAction,
  VerifyVersionInputAction,
} from '@/models/resourceVersionCreatorPage';
import { withRouter } from 'umi';
import RouterTypes from 'umi/routerTypes';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Sider from '@/pages/resource/containers/Sider';
import FFormLayout from '@/components/FFormLayout';
import Prompt from 'umi/prompt';
import * as H from 'history';
import fConfirmModal from '@/components/fConfirmModal';
// import FUtil1 from '@/utils';
import { RouteComponentProps } from 'react-router';
import * as AHooks from 'ahooks';
import CustomOptions from './CustomOptions';
import { Helmet } from 'react-helmet';
import FPaperPlane from '@/components/FIcons/FPaperPlane';
import { fI18nNext } from '@freelog/tools-lib';

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
                        }: VersionCreatorProps & RouterTypes) {

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
    || resourceVersionCreatorPage.selectedFileStatus !== -3
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
            title={fI18nNext.t('version_number')}
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

          <FFormLayout.FBlock dot={true} title={fI18nNext.t('release_object')}>
            <FSelectObject />

            <CustomOptions />
          </FFormLayout.FBlock>

          <FFormLayout.FBlock dot={false} title={fI18nNext.t('rely')}>
            <FDepPanel />
          </FFormLayout.FBlock>

          <FFormLayout.FBlock dot={false} title={fI18nNext.t('version_description')}>
            <FBraftEditor
              value={resourceVersionCreatorPage.description}
              onChange={(value) => {
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
    <FTitleText text={'创建版本'} type='h1' />

    <Space size={30}>
      <FTextBtn
        type='default'
        onClick={onClickCache}
      >{fI18nNext.t('save_as_draft')}</FTextBtn>
      <FRectBtn
        style={{ display: 'flex', alignItems: 'center' }}
        onClick={onClickCreate}
        disabled={disabledCreate}
      >
        <FPaperPlane style={{ fontWeight: 400, fontSize: 16 }} />
        <div style={{ width: 5 }} />
        {fI18nNext.t('release_to_market')}
      </FRectBtn>
    </Space>
  </div>);
}

export default withRouter(connect(({ resourceVersionCreatorPage, resourceInfo }: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
  resourceInfo: resourceInfo,
}))(VersionCreator));
