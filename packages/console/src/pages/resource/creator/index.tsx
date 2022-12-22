import * as React from 'react';
import styles from './index.less';
import FInput from '@/components/FInput';
import FLabelEditor from '@/pages/resource/components/FLabelEditor';
import FUploadResourceCover from '@/pages/resource/components/FUploadResourceCover';
import FIntroductionEditor from '@/pages/resource/components/FIntroductionEditor';
import FContentLayout from '@/layouts/FContentLayout';
import { Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceCreatorPageModelState, UserModelState } from '@/models/connect';
import {
  // OnCreateAction,
  ChangeAction,
  OnChange_NameInput_Action,
  // OnChangeResourceTypeAction,
  // ClearDataAction,
  OnMount_Page_Action,
  OnUnmount_Page_Action,
  OnChange_Resource_Type_Action,
  initStates,
  OnClick_CreateBtn_Action,
  OnChange_IntroductionInput_Action,
  OnChange_Cover_Action,
  OnChange_Labels_Action,
} from '@/models/resourceCreatorPage';
// import { history } from 'umi';
// import { FLoading } from '@/components/FIcons';
import FFormLayout from '@/components/FFormLayout';
// import * as H from 'history';
// import { Prompt } from 'umi';
// import fConfirmModal from '@/components/fConfirmModal';
import { FUtil, FI18n } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FResourceTypeInput from '@/components/FResourceTypeInput';
import FComponentsLib from '@freelog/components-lib';
import FPrompt from '@/components/FPrompt';
// import FHotspotTooltip from '@/components/FHotspotTooltip';

interface ResourceCreatorProps {
  dispatch: Dispatch;
  resourceCreatorPage: ResourceCreatorPageModelState;
  user: UserModelState;
}

function ResourceCreator({
                           dispatch,
                           resourceCreatorPage,
                           user,
                         }: ResourceCreatorProps) {

  AHooks.useMount(() => {
    self._czc?.push(['_trackPageview', self.location.pathname]);
    dispatch<OnMount_Page_Action>({
      type: 'resourceCreatorPage/onMount_Page',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmount_Page_Action>({
      type: 'resourceCreatorPage/onUnmount_Page',
    });
  });

  function onChange(payload: ChangeAction['payload']) {
    dispatch<ChangeAction>({
      type: 'resourceCreatorPage/change',
      payload,
    });
  }

  return (
    <>
      <FPrompt
        watch={resourceCreatorPage.dataIsDirty}
        messageText={'还没有创建资源，现在离开会导致信息丢失'}
      />
      <FContentLayout
        header={<div className={styles.Header}>
          <FComponentsLib.FTitleText
            // text={FUtil.I18n.message('create_resource')}
            text={'创建资源'}
            type='h1'
          />

          <FComponentsLib.FHotspotTooltip
            id={'createResourcePage.createBtn'}
            style={{ left: -52, top: 4 }}
            text={FI18n.i18nNext.t('hotpots_createresource_btn_create')}
          >
            <FComponentsLib.FRectBtn
              disabled={resourceCreatorPage.name === '' ||
              resourceCreatorPage.nameVerify !== 2 ||
              // resourceCreatorPage.resourceTypeVerify !== 2 ||
              resourceCreatorPage.nameErrorText !== '' ||
              // !!resourceCreatorPage.resourceTypeErrorText ||
              resourceCreatorPage.resource_Type[resourceCreatorPage.resource_Type.length - 1].value === '' ||
              resourceCreatorPage.resource_Type[resourceCreatorPage.resource_Type.length - 1].valueError !== '' ||
              !!resourceCreatorPage.introductionErrorText}
              onClick={() => {
                dispatch<OnClick_CreateBtn_Action>({
                  type: 'resourceCreatorPage/onClick_CreateBtn',
                });
              }}
            >
              {FI18n.i18nNext.t('create')}
            </FComponentsLib.FRectBtn>
          </FComponentsLib.FHotspotTooltip>
        </div>}
      >
        <FFormLayout>
          <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_name')} asterisk={true}>
            <div className={styles.resourceName}>
              <FComponentsLib.FContentText text={`${resourceCreatorPage.userName} /`} />
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
                  dispatch<OnChange_NameInput_Action>({
                    type: 'resourceCreatorPage/onChange_NameInput',
                    payload: value,
                  });
                }}
                className={styles.FInput}
                placeholder={FI18n.i18nNext.t('hint_enter_resource_name')}
                lengthLimit={60}
              />
              <div style={{ width: 10 }} />
              {resourceCreatorPage.nameVerify === 1 && <FComponentsLib.FIcons.FLoading />}
              {resourceCreatorPage.nameVerify === 2 && !resourceCreatorPage.nameErrorText && (
                <FComponentsLib.FIcons.FCheck />
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

          {/*  <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_short_description')}>*/}
          {/*    <FIntroductionEditor*/}
          {/*      value={resourceCreatorPage.introduction}*/}
          {/*      onChange={(e) => {*/}
          {/*        // onChange({*/}
          {/*        //   introductionErrorText: e.target.value.length > 1000 ? '不多于1000个字符' : '',*/}
          {/*        //   introduction: e.target.value,*/}
          {/*        // })*/}
          {/*        dispatch<OnChange_IntroductionInput_Action>({*/}
          {/*          type: 'resourceCreatorPage/onChange_IntroductionInput',*/}
          {/*          payload: {*/}
          {/*            value: e.target.value,*/}
          {/*          },*/}
          {/*        });*/}
          {/*      }}*/}
          {/*      placeholder={FI18n.i18nNext.t('hint_enter_resource_short_description')}*/}
          {/*    />*/}
          {/*  </FFormLayout.FBlock>*/}

          {/*  <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_image')}>*/}
          {/*    <FUploadResourceCover*/}
          {/*      value={resourceCreatorPage.cover}*/}
          {/*      onChange={(value) => {*/}
          {/*        // onChange({*/}
          {/*        //   cover: value,*/}
          {/*        // })*/}
          {/*        dispatch<OnChange_Cover_Action>({*/}
          {/*          type: 'resourceCreatorPage/onChange_Cover',*/}
          {/*          payload: {*/}
          {/*            value: value,*/}
          {/*          },*/}
          {/*        });*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  </FFormLayout.FBlock>*/}

          {/*  <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_tag')}>*/}
          {/*    <FLabelEditor*/}
          {/*      values={resourceCreatorPage.labels}*/}
          {/*      onChange={(value) => {*/}
          {/*        // onChange({*/}
          {/*        //   labels: value,*/}
          {/*        // })*/}
          {/*        dispatch<OnChange_Labels_Action>({*/}
          {/*          type: 'resourceCreatorPage/onChange_Labels',*/}
          {/*          payload: {*/}
          {/*            value: value,*/}
          {/*          },*/}
          {/*        });*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  </FFormLayout.FBlock>*/}
        </FFormLayout>
      </FContentLayout>

      <div style={{ height: 100 }} />
    </>
  );
}

export default connect(({ resourceCreatorPage, user }: ConnectState) => ({
  resourceCreatorPage: resourceCreatorPage,
  user: user,
}))(ResourceCreator);
