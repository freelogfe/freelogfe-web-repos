import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText, FTipText} from '@/components/FText';
import FInput from '@/components/FInput';
import {FNormalButton, FTextButton} from '@/components/FButton';
import FLabelEditor from '@/pages/resource/components/FLabelEditor';
import FUploadResourceCover from '@/pages/resource/components/FUploadResourceCover';
import FIntroductionEditor from '@/pages/resource/components/FIntroductionEditor';
import FContentLayout from '@/layouts/FContentLayout';
import {Space, Modal} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceCreatorPageModelState, UserModelState} from '@/models/connect';
import {
  OnCreateAction,
  ChangeAction,
  OnChangeNameAction,
  OnChangeResourceTypeAction, ClearDataAction
} from '@/models/resourceCreatorPage';
import {ChangeAction as GlobalChangeAction} from '@/models/global';
import FAutoComplete from '@/components/FAutoComplete';
import {router, RouterTypes} from 'umi';
import {resourceTypes} from '@/utils/globals';
import {FCheck, FLoading} from '@/components/FIcons';
import FFormLayout from "@/layouts/FFormLayout";
import * as H from "history";
import Prompt from "umi/prompt";
import fConfirmModal from "@/components/fConfirmModal";
import FUtil from "@/utils";

interface ResourceCreatorProps {
  dispatch: Dispatch;
  resourceCreatorPage: ResourceCreatorPageModelState;
  user: UserModelState;
}

function ResourceCreator({dispatch, route, resourceCreatorPage, user}: ResourceCreatorProps & RouterTypes) {

  React.useEffect(() => {
    dispatch<GlobalChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

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
    if (resourceCreatorPage.name !== '' || resourceCreatorPage.resourceType !== '' || resourceCreatorPage.introduction !== '' || resourceCreatorPage.cover !== '' || resourceCreatorPage.labels.length !== 0) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }

  }, [resourceCreatorPage.name, resourceCreatorPage.resourceType, resourceCreatorPage.introduction, resourceCreatorPage.cover, resourceCreatorPage.labels]);

  function onClickCreate() {
    // console.log('onClickCreate', '0932jdlfsf');
    dispatch<OnCreateAction>({
      type: 'resourceCreatorPage/create',
    });
  }

  function onChange(payload: ChangeAction['payload']) {
    dispatch<ChangeAction>({
      type: 'resourceCreatorPage/change',
      payload,
    });
  }

  return (<>
    <Prompt
      when={resourceCreatorPage.promptLeavePath === '' && (resourceCreatorPage.name !== '' || resourceCreatorPage.resourceType !== '' || resourceCreatorPage.introduction !== '' || resourceCreatorPage.cover !== '' || resourceCreatorPage.labels.length !== 0)}
      message={(location: H.Location, action: H.Action) => {
        // console.log(location, action, 'LAAAAL');
        // return window.confirm('还没有创建资源，现在离开会导致信息丢失');
        dispatch<ChangeAction>({
          type: 'resourceCreatorPage/change',
          payload: {
            promptLeavePath: location.pathname,
          }
        });
        fConfirmModal({
          message: '还没有创建资源，现在离开会导致信息丢失',
          onOk() {
            // console.log('OK');
            router.push(location.pathname);
          },
          onCancel() {
            // console.log('Cancel');
            dispatch<ChangeAction>({
              type: 'resourceCreatorPage/change',
              payload: {
                promptLeavePath: '',
              }
            });
          },
        });
        return false;
      }}
    />
    <FContentLayout header={<Header
      disabled={resourceCreatorPage.nameVerify !== 2 || resourceCreatorPage.resourceTypeVerify !== 2
      || !!resourceCreatorPage.nameErrorText || !!resourceCreatorPage.resourceTypeErrorText || !!resourceCreatorPage.introductionErrorText}
      onClickCreate={onClickCreate}
    />}>
      <FFormLayout>
        <FFormLayout.FBlock
          title={FUtil.I18n.message('resource_name')}
          dot={true}
        >
          <div className={styles.resourceName}>
            <FContentText text={`${user.info?.username} /`}/>
            &nbsp;
            <FInput
              errorText={resourceCreatorPage.nameErrorText}
              value={resourceCreatorPage.name}
              debounce={300}
              onDebounceChange={(value) => {
                dispatch<OnChangeNameAction>({
                  type: 'resourceCreatorPage/onChangeName',
                  payload: value,
                });
              }}
              className={styles.FInput}
              placeholder={FUtil.I18n.message('hint_enter_resource_name')}
              lengthLimit={60}
            />
            <div style={{width: 10}}/>
            {resourceCreatorPage.nameVerify === 1 && <FLoading/>}
            {resourceCreatorPage.nameVerify === 2 && !resourceCreatorPage.nameErrorText && <FCheck/>}
          </div>
        </FFormLayout.FBlock>

        <FFormLayout.FBlock title={FUtil.I18n.message('resource_type')} dot={true}>
          <FAutoComplete
            errorText={resourceCreatorPage.resourceTypeErrorText}
            value={resourceCreatorPage.resourceType}
            onChange={(value) => dispatch<OnChangeResourceTypeAction>({
              type: 'resourceCreatorPage/onChangeResourceType',
              payload: value,
            })}
            className={styles.FSelect}
            placeholder={FUtil.I18n.message('hint_choose_resource_type')}
            options={resourceTypes.map((i: string) => ({value: i}))}
          />
        </FFormLayout.FBlock>

        <FFormLayout.FBlock title={FUtil.I18n.message('resource_short_description')}>
          <FIntroductionEditor
            value={resourceCreatorPage.introduction}
            onChange={(e) => onChange({
              introductionErrorText: e.target.value.length > 1000 ? '不多于1000个字符' : '',
              introduction: e.target.value
            })}
            placeholder={FUtil.I18n.message('hint_enter_resource_short_description')}
          />
        </FFormLayout.FBlock>

        <FFormLayout.FBlock title={FUtil.I18n.message('resource_image')}>
          <FUploadResourceCover
            value={resourceCreatorPage.cover}
            onChange={(value) => onChange({
              cover: value
            })}
          />
        </FFormLayout.FBlock>

        <FFormLayout.FBlock title={FUtil.I18n.message('resource_tag')}>
          <FLabelEditor
            values={resourceCreatorPage.labels}
            onChange={(value) => onChange({
              labels: value,
            })}
          />
        </FFormLayout.FBlock>
      </FFormLayout>
    </FContentLayout>
  </>);
}

interface HeaderProps {
  onClickCreate: () => void;
  disabled?: boolean;
}

function Header({onClickCreate, disabled = false}: HeaderProps) {
  return (<div className={styles.Header}>
    <FTitleText
      text={FUtil.I18n.message('create_resource')}
      type="h1"
    />

    <Space size={30}>
      {/*<FTextButton onClick={onClickCache}>暂存草稿</FTextButton>*/}
      <FNormalButton
        onClick={onClickCreate}
        style={{width: 108}}
        disabled={disabled}
      >{FUtil.I18n.message('create')}</FNormalButton>
    </Space>
  </div>);
}

export default connect(({resourceCreatorPage, user}: ConnectState) => ({
  resourceCreatorPage: resourceCreatorPage,
  user: user,
}))(ResourceCreator);
