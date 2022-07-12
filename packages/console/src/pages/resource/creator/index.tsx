import * as React from 'react';
import styles from './index.less';
import { FTitleText, FContentText } from '@/components/FText';
import FInput from '@/components/FInput';
import { FRectBtn } from '@/components/FButton';
import FLabelEditor from '@/pages/resource/components/FLabelEditor';
import FUploadResourceCover from '@/pages/resource/components/FUploadResourceCover';
import FIntroductionEditor from '@/pages/resource/components/FIntroductionEditor';
import FContentLayout from '@/layouts/FContentLayout';
import { Space } from 'antd';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceCreatorPageModelState, UserModelState } from '@/models/connect';
import {
  // OnCreateAction,
  ChangeAction,
  OnChangeNameAction,
  // OnChangeResourceTypeAction,
  ClearDataAction,
  OnMount_Page_Action,
  OnUnmount_Page_Action,
  OnChange_Resource_Type_Action,
  initStates, OnClick_CreateBtn_Action,
} from '@/models/resourceCreatorPage';
// import FAutoComplete from '@/components/FAutoComplete';
import { router, RouterTypes } from 'umi';
import { FCheck, FInfo, FLoading } from '@/components/FIcons';
import FFormLayout from '@/components/FFormLayout';
import * as H from 'history';
import Prompt from 'umi/prompt';
import fConfirmModal from '@/components/fConfirmModal';
import { FUtil, FI18n } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FResourceTypeInput from '@/components/FResourceTypeInput';

interface ResourceCreatorProps {
  dispatch: Dispatch;
  resourceCreatorPage: ResourceCreatorPageModelState;
  user: UserModelState;
}

function ResourceCreator({
                           dispatch,
                           resourceCreatorPage,
                           user,
                         }: ResourceCreatorProps & RouterTypes) {

  AHooks.useMount(() => {
    dispatch<OnMount_Page_Action>({
      type: 'resourceCreatorPage/onMount_Page',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmount_Page_Action>({
      type: 'resourceCreatorPage/onUnmount_Page',
    });
  });
  React.useEffect(() => {
    return () => {
      dispatch<ClearDataAction>({
        type: 'resourceCreatorPage/clearData',
      });
      window.onbeforeunload = null;
    };
  }, []);

  React.useEffect(() => {
    // const func = () => 1234;
    if (
      resourceCreatorPage.name !== initStates['name'] ||
      resourceCreatorPage.resource_Type !== initStates['resource_Type'] ||
      resourceCreatorPage.introduction !== initStates['introduction'] ||
      resourceCreatorPage.cover !== initStates['cover'] ||
      resourceCreatorPage.labels !== initStates['labels']
    ) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
  }, [
    resourceCreatorPage.name,
    resourceCreatorPage.resource_Type,
    resourceCreatorPage.introduction,
    resourceCreatorPage.cover,
    resourceCreatorPage.labels,
  ]);

  // function onClickCreate() {
  //   // console.log('onClickCreate', '0932jdlfsf');
  //   dispatch<OnCreateAction>({
  //     type: 'resourceCreatorPage/create',
  //   });
  // }

  function onChange(payload: ChangeAction['payload']) {
    dispatch<ChangeAction>({
      type: 'resourceCreatorPage/change',
      payload,
    });
  }

  return (
    <>
      <Prompt
        when={
          resourceCreatorPage.promptLeavePath === initStates['promptLeavePath'] &&
          (resourceCreatorPage.name !== initStates['name'] ||
            resourceCreatorPage.resource_Type !== initStates['resource_Type'] ||
            resourceCreatorPage.introduction !== initStates['introduction'] ||
            resourceCreatorPage.cover !== initStates['cover'] ||
            resourceCreatorPage.labels !== initStates['labels'])
        }
        message={(location: H.Location, action: H.Action) => {
          // console.log(location, action, 'LAAAAL');
          // return window.confirm('还没有创建资源，现在离开会导致信息丢失');
          if (location.pathname === FUtil.LinkTo.resourceCreator()) {
            return true;
          }
          dispatch<ChangeAction>({
            type: 'resourceCreatorPage/change',
            payload: {
              promptLeavePath: location.pathname + location.search,
            },
          });
          fConfirmModal({
            message: '还没有创建资源，现在离开会导致信息丢失',
            onOk() {
              // console.log('OK');
              router.push(location.pathname + location.search);
            },
            onCancel() {
              // console.log('Cancel');
              dispatch<ChangeAction>({
                type: 'resourceCreatorPage/change',
                payload: {
                  promptLeavePath: '',
                },
              });
            },
          });
          return false;
        }}
      />
      <FContentLayout
        header={
          <Header
            disabled={
              resourceCreatorPage.name === '' ||
              resourceCreatorPage.nameVerify !== 2 ||
              // resourceCreatorPage.resourceTypeVerify !== 2 ||
              resourceCreatorPage.nameErrorText !== '' ||
              // !!resourceCreatorPage.resourceTypeErrorText ||
              resourceCreatorPage.resource_Type[resourceCreatorPage.resource_Type.length - 1].value === '' ||
              resourceCreatorPage.resource_Type[resourceCreatorPage.resource_Type.length - 1].valueError !== '' ||
              !!resourceCreatorPage.introductionErrorText
            }
            onClickCreate={() => {
              window.onbeforeunload = null;
              dispatch<OnClick_CreateBtn_Action>({
                type: 'resourceCreatorPage/onClick_CreateBtn',
              });
            }}
          />
        }
      >
        <FFormLayout>
          <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_name')} asterisk={true}>
            <div className={styles.resourceName}>
              <FContentText text={`${user.info?.username} /`} />
              &nbsp;
              <FInput
                errorText={resourceCreatorPage.nameErrorText}
                value={resourceCreatorPage.name}
                onChange={(e) => {
                }}
                debounce={300}
                onDebounceChange={(value) => {
                  onChange({
                    name: value,
                  });
                  // console.log(value, value.length, '!@#$!@#$!!!!!!');
                  dispatch<OnChangeNameAction>({
                    type: 'resourceCreatorPage/onChangeName',
                    payload: value,
                  });
                }}
                className={styles.FInput}
                placeholder={FI18n.i18nNext.t('hint_enter_resource_name')}
                lengthLimit={60}
              />
              <div style={{ width: 10 }} />
              {resourceCreatorPage.nameVerify === 1 && <FLoading />}
              {resourceCreatorPage.nameVerify === 2 && !resourceCreatorPage.nameErrorText && (
                <FCheck />
              )}
            </div>
          </FFormLayout.FBlock>

          <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_type')} asterisk={true}>
            <FResourceTypeInput
              dataSource={resourceCreatorPage.resource_Type}
              onChange={(value) => {
                dispatch<OnChange_Resource_Type_Action>({
                  type: 'resourceCreatorPage/onChange_Resource_Type',
                  payload: {
                    value,
                  },
                });
              }}
            />
          </FFormLayout.FBlock>

          <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_short_description')}>
            <FIntroductionEditor
              value={resourceCreatorPage.introduction}
              onChange={(e) =>
                onChange({
                  introductionErrorText: e.target.value.length > 1000 ? '不多于1000个字符' : '',
                  introduction: e.target.value,
                })
              }
              placeholder={FI18n.i18nNext.t('hint_enter_resource_short_description')}
            />
          </FFormLayout.FBlock>

          <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_image')}>
            <FUploadResourceCover
              value={resourceCreatorPage.cover}
              onChange={(value) =>
                onChange({
                  cover: value,
                })
              }
            />
          </FFormLayout.FBlock>

          <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_tag')}>
            <FLabelEditor
              values={resourceCreatorPage.labels}
              onChange={(value) =>
                onChange({
                  labels: value,
                })
              }
            />
          </FFormLayout.FBlock>
        </FFormLayout>
      </FContentLayout>
    </>
  );
}

interface HeaderProps {
  onClickCreate: () => void;
  disabled?: boolean;
}

function Header({ onClickCreate, disabled = false }: HeaderProps) {
  return (
    <div className={styles.Header}>
      <FTitleText
        // text={FUtil.I18n.message('create_resource')}
        text={'创建资源'}
        type='h1'
      />

      <Space size={30}>
        <FRectBtn disabled={disabled} onClick={onClickCreate}>
          {FI18n.i18nNext.t('create')}
        </FRectBtn>
      </Space>
    </div>
  );
}

export default connect(({ resourceCreatorPage, user }: ConnectState) => ({
  resourceCreatorPage: resourceCreatorPage,
  user: user,
}))(ResourceCreator);
