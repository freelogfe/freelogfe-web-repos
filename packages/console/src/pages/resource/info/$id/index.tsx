import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FLabelEditor from '@/components/FLabelEditor';
import FUploadResourceCover from '@/pages/resource/components/FUploadResourceCover';
import FIntroductionEditor from '@/pages/resource/components/FIntroductionEditor';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceInfoPageModelState } from '@/models/connect';
import {
  OnUnmount_Page_Action,
  OnMount_Page_Action,
  OnClick_AddIntroductionBtn_Action,
  OnClick_EditIntroductionBtn_Action,
  OnClick_CancelEditIntroductionBtn_Action,
  OnClick_SaveIntroductionBtn_Action,
  OnChange_Labels_Action,
  OnChange_Cover_Action, OnChange_IntroductionEditor_Action,
} from '@/models/resourceInfoPage';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Sider from '@/pages/resource/containers/Sider';
import FFormLayout from '@/components/FFormLayout';
import { RouteComponentProps } from 'react-router';
import { Helmet } from 'react-helmet';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import FSkeletonNode from '@/components/FSkeletonNode';
import * as AHooks from 'ahooks';
import FInput_MultiLine from '@/components/FInput_MultiLine';

interface InfoProps extends RouteComponentProps<{ id: string; }> {
  dispatch: Dispatch;
  resourceInfoPage: ResourceInfoPageModelState,
}

function Info({ dispatch, resourceInfoPage, match }: InfoProps) {

  AHooks.useMount(async () => {

    await dispatch<OnMount_Page_Action>({
      type: 'resourceInfoPage/onMount_Page',
      payload: {
        resourceID: match.params.id,
        // pageState: 'loading',
      },
    });
  });

  AHooks.useUnmount(async () => {
    await dispatch<OnUnmount_Page_Action>({
      type: 'resourceInfoPage/onUnmount_Page',
    });
  });

  return (<>
    <Helmet>
      <title>{`资源信息 · ${resourceInfoPage.resourceInfo?.resourceName || ''}  - Freelog`}</title>
    </Helmet>
    <FLeftSiderLayout
      sider={<Sider />}
      header={<FComponentsLib.FTitleText
        text={FI18n.i18nNext.t('resource_information')}
        type='h1'
      />}
    >
      {
        resourceInfoPage.pageState === 'loading' && (<div>
          <FSkeletonNode width={120} height={22} />
          <div style={{ height: 20 }} />
          <FSkeletonNode width={340} height={38} />
          <div style={{ height: 50 }} />
          <FSkeletonNode width={120} height={22} />
          <div style={{ height: 20 }} />
          <FSkeletonNode width={340} height={38} />
          <div style={{ height: 50 }} />
          <FSkeletonNode width={120} height={22} />
          <div style={{ height: 20 }} />
          <FSkeletonNode width={860} height={38} />
          <div style={{ height: 50 }} />
          <FSkeletonNode width={120} height={22} />
          <div style={{ height: 20 }} />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
            <FSkeletonNode width={200} height={150} />
            <FSkeletonNode width={460} height={40} />
          </div>
          <div style={{ height: 50 }} />
          <FSkeletonNode width={120} height={22} />
          <div style={{ height: 20 }} />
          <FSkeletonNode width={340} height={38} />
        </div>)
      }

      {
        !!resourceInfoPage.resourceInfo && resourceInfoPage.pageState === 'loaded' && <FFormLayout>
          {/*<div className={styles.styles}>*/}
          <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_name')}>
            <FComponentsLib.FContentText type='highlight' text={resourceInfoPage.resourceInfo.resourceName || ''} />
          </FFormLayout.FBlock>
          <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_type')}>
            <FComponentsLib.FContentText
              type='highlight'
              text={resourceInfoPage.resourceInfo.resourceType.join(' / ')}
            />
          </FFormLayout.FBlock>
          <FFormLayout.FBlock
            title={FI18n.i18nNext.t('resource_short_description')}
            extra={<Space size={10}>
              {
                resourceInfoPage.resourceInfo.intro !== '' && !resourceInfoPage.introduction_IsEditing
                && (<FComponentsLib.FTextBtn
                  onClick={() => {
                    // onChangeIsEditing(true);
                    dispatch<OnClick_EditIntroductionBtn_Action>({
                      type: 'resourceInfoPage/onClick_EditIntroductionBtn',
                    });
                  }}
                >{FI18n.i18nNext.t('edit')}</FComponentsLib.FTextBtn>)
              }
              {
                resourceInfoPage.introduction_IsEditing && (<>
                  <FComponentsLib.FTextBtn
                    type='default'
                    onClick={() => {
                      // onChangeIsEditing(false);
                      dispatch<OnClick_CancelEditIntroductionBtn_Action>({
                        type: 'resourceInfoPage/onClick_CancelEditIntroductionBtn',
                      });
                    }}
                  >{FI18n.i18nNext.t('cancel')}</FComponentsLib.FTextBtn>
                  <FComponentsLib.FTextBtn
                    onClick={() => {
                      dispatch<OnClick_SaveIntroductionBtn_Action>({
                        type: 'resourceInfoPage/onClick_SaveIntroductionBtn',
                      });
                    }}
                  >{FI18n.i18nNext.t('save')}</FComponentsLib.FTextBtn>
                </>)
              }
            </Space>}
          >

            {
              resourceInfoPage.introduction_IsEditing
                // ? (<FIntroductionEditor
                //   value={resourceInfoPage.introduction_EditorText}
                //   errorText={resourceInfoPage.introduction_EditorText_Error}
                //   onChange={(e) => {
                //     dispatch<OnChange_IntroductionEditor_Action>({
                //       type: 'resourceInfoPage/onChange_IntroductionEditor',
                //       payload: {
                //         value: e.target.value,
                //       },
                //     });
                //   }
                //
                //   }
                // />)
                ? (<div>
                  <FInput_MultiLine
                    value={resourceInfoPage.introduction_EditorText}
                    lengthLimit={1000}
                    onChange={(e) => {
                      dispatch<OnChange_IntroductionEditor_Action>({
                        type: 'resourceInfoPage/onChange_IntroductionEditor',
                        payload: {
                          value: e.target.value,
                        },
                      });
                    }}
                  />

                  {
                    resourceInfoPage.introduction_EditorText_Error !== '' && (<>
                      <div style={{ height: 5 }} />
                      <div style={{ color: '#EE4040' }}>{resourceInfoPage.introduction_EditorText_Error}</div>
                    </>)
                  }
                </div>)
                : resourceInfoPage.resourceInfo.intro !== ''
                  ? (<div className={styles.aboutPanel}>
                    <FComponentsLib.FContentText text={resourceInfoPage.resourceInfo.intro} />
                  </div>)
                  : (<FComponentsLib.FRectBtn
                    type='default'
                    onClick={() => {
                      dispatch<OnClick_AddIntroductionBtn_Action>({
                        type: 'resourceInfoPage/onClick_AddIntroductionBtn',
                      });
                      // onChangeIsEditing(true);
                    }}
                  >
                    {/*{FUtil.I18n.message('resource_short_description')}*/}
                    添加简介
                  </FComponentsLib.FRectBtn>)
            }

          </FFormLayout.FBlock>
          <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_image')}>
            <FUploadResourceCover
              value={resourceInfoPage.resourceInfo.coverImages.length > 0
                ? resourceInfoPage.resourceInfo.coverImages[0]
                : ''}
              onChange={(value) => {
                dispatch<OnChange_Cover_Action>({
                  type: 'resourceInfoPage/onChange_Cover',
                  payload: {
                    value: value,
                  },
                });
              }}
            />
          </FFormLayout.FBlock>
          <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_tag')}>
            <FLabelEditor
              // showRecommendation={true}
              resourceType={resourceInfoPage.resourceInfo.resourceType[resourceInfoPage.resourceInfo.resourceType.length - 1 || 0]}
              values={resourceInfoPage.resourceInfo.tags}
              onChange={(value) => {
                dispatch<OnChange_Labels_Action>({
                  type: 'resourceInfoPage/onChange_Labels',
                  payload: {
                    value: value,
                  },
                });
              }}
            />
          </FFormLayout.FBlock>
        </FFormLayout>}
    </FLeftSiderLayout>
  </>);
}

export default connect(({ resourceInfo, resourceInfoPage, user }: ConnectState) => ({
  resourceInfoPage: resourceInfoPage,
}))(Info);
