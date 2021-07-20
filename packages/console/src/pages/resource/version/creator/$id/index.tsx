import * as React from 'react';
import styles from './index.less';
import {FTitleText} from '@/components/FText';
import FInput from '@/components/FInput';
import FBraftEditor from '@/components/FBraftEditor';
import {FRectBtn, FTextBtn} from '@/components/FButton';
import {Space} from 'antd';
import FSelectObject from '@/pages/resource/components/FSelectObject';
import FDepPanel from './FDepPanel';
import {connect, Dispatch} from "dva";
import {
  ConnectState,
  ResourceVersionCreatorPageModelState,
} from '@/models/connect';
import {
  ChangeAction,
  CreateVersionAction,
  InitModelStatesAction, OnClickCacheBtnAction, OnClickCreateBtnAction,
  OnMountPageAction,
  OnUnmountPageAction,
  SaveDraftAction,
  VerifyVersionInputAction,
} from '@/models/resourceVersionCreatorPage';
import {ChangeAction as GlobalChangeAction} from '@/models/global';
import {router, withRouter} from 'umi';
import RouterTypes from 'umi/routerTypes';
import {FetchDraftDataAction} from "@/models/resourceInfo";
import FLeftSiderLayout from "@/layouts/FLeftSiderLayout";
import Sider from "@/pages/resource/containers/Sider";
import FFormLayout from "@/components/FFormLayout";
import Prompt from 'umi/prompt';
import * as H from "history";
import fConfirmModal from "@/components/fConfirmModal";
import FUtil1 from "@/utils";
import {FUtil} from '@freelog/tools-lib';
import {RouteComponentProps} from 'react-router';
import * as AHooks from "ahooks";
import CustomOptions from "./CustomOptions";

interface VersionCreatorProps extends RouteComponentProps<{ id: string; }> {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState,
}

function VersionCreator({dispatch, route, resourceVersionCreatorPage, match}: VersionCreatorProps & RouterTypes) {

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

  React.useEffect(() => {
    dispatch<GlobalChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });

    return () => {
      dispatch<InitModelStatesAction>({
        type: 'resourceVersionCreatorPage/initModelStates',
      });
    };
  }, [route]);

  // React.useEffect(() => {
  //   // console.log(match, 'creator902jfsadlk');
  //   init();
  //
  //   // return () => {
  //   //   // console.log(match.params.id, 'match.param90823u947890234890s.id');
  //   //   dispatch<LeaveAndClearDataAction>({
  //   //     type: 'resourceVersionCreatorPage/leaveAndClearData',
  //   //   });
  //   // }
  // }, []);

  // async function init() {
  //   await onChange({resourceId: match.params.id});
  //   await dispatch<FetchResourceInfoAction>({
  //     type: 'resourceVersionCreatorPage/fetchResourceInfo',
  //   });
  //   await dispatch<FetchDraftAction>({
  //     type: 'resourceVersionCreatorPage/fetchDraft',
  //   });
  // }

  // async function onClickCache() {
  //   await dispatch<SaveDraftAction>({
  //     type: 'resourceVersionCreatorPage/saveDraft',
  //   });
  //   await dispatch<FetchDraftDataAction>({
  //     type: 'resourceInfo/fetchDraftData',
  //   });
  // }
  //
  // async function onClickCreate() {
  //   await dispatch<CreateVersionAction>({
  //     type: 'resourceVersionCreatorPage/createVersion',
  //     // payload: match.params.id,
  //   });
  //   await dispatch<FetchDraftDataAction>({
  //     type: 'resourceInfo/fetchDraftData',
  //   });
  // }

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
      <Prompt
        when={resourceVersionCreatorPage.promptLeavePath === '' && resourceVersionCreatorPage.dataIsDirty}
        message={(location: H.Location, action: H.Action) => {
          // console.log(location, action, 'LAAAAL');
          // return window.confirm('还没有保存草稿或发行，现在离开会导致信息丢失');
          dispatch<ChangeAction>({
            type: 'resourceVersionCreatorPage/change',
            payload: {
              promptLeavePath: location.pathname + location.search,
            },
            caller: '2345$#%%#$%#$%#$532434345234324534%#$%#$%#$%#$#$',
          });
          fConfirmModal({
            message: '还没有保存草稿或发行，现在离开会导致信息丢失',
            onOk() {
              // console.log('OK');
              router.push(location.pathname + location.search);
            },
            onCancel() {
              // console.log('Cancel');
              dispatch<ChangeAction>({
                type: 'resourceVersionCreatorPage/change',
                payload: {
                  promptLeavePath: '',
                },
                caller: '234532434()))(*())(()345234324534%#$%#$%#$%#$#$',
              });
            },
          });
          return false;
        }}
      />
      <FLeftSiderLayout
        sider={<Sider/>}
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
            title={FUtil1.I18n.message('version_number')}
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

          <FFormLayout.FBlock dot={true} title={FUtil1.I18n.message('release_object')}>
            <FSelectObject/>

            <CustomOptions/>
          </FFormLayout.FBlock>

          <FFormLayout.FBlock dot={false} title={FUtil1.I18n.message('rely')}>
            <FDepPanel/>
          </FFormLayout.FBlock>

          <FFormLayout.FBlock dot={false} title={FUtil1.I18n.message('version_description')}>
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

function Header({onClickCache, onClickCreate, disabledCreate = false}: HeaderProps) {
  return (<div className={styles.Header}>
    {/*<FTitleText text={FUtil.I18n.message('create_new_version')} type="h1"/>*/}
    <FTitleText text={'创建版本'} type="h1"/>

    <Space size={30}>
      <FTextBtn
        type="default"
        onClick={onClickCache}
      >{FUtil1.I18n.message('save_as_draft')}</FTextBtn>
      <FRectBtn
        style={{width: 108}}
        onClick={onClickCreate}
        disabled={disabledCreate}
      >{FUtil1.I18n.message('release_to_market')}</FRectBtn>
    </Space>
  </div>);
}

export default withRouter(connect(({resourceVersionCreatorPage}: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(VersionCreator));
