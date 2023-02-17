import * as React from 'react';
import styles from './index.less';
import { Space, Skeleton } from 'antd';
import FLabelEditor from '@/components/FLabelEditor';
import FUploadResourceCover from '@/pages/resource/components/FUploadResourceCover';
import FIntroductionEditor from '@/pages/resource/components/FIntroductionEditor';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceInfoModelState, ResourceInfoPageModelState, UserModelState } from '@/models/connect';
import { OnChangeInfoAction, ChangeAction, InitModelStatesAction } from '@/models/resourceInfoPage';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Sider from '@/pages/resource/containers/Sider';
import FFormLayout from '@/components/FFormLayout';
import { RouteComponentProps } from 'react-router';
import { Helmet } from 'react-helmet';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import FSkeletonNode from '@/components/FSkeletonNode';

interface InfoProps extends RouteComponentProps<{ id: string; }> {
  dispatch: Dispatch;
  resourceInfo: ResourceInfoModelState,
  resourceInfoPage: ResourceInfoPageModelState,
  user: UserModelState;
}

function Info({ dispatch, resourceInfoPage, resourceInfo, user, match }: InfoProps) {

  React.useEffect(() => {
    // dispatch<GlobalChangeAction>({
    //   type: 'global/change',
    //   payload: {
    //     route: route,
    //   },
    // });

    dispatch<ChangeAction>({
      type: 'resourceInfoPage/change',
      payload: {
        resourceID: match.params.id,
      },
    });

    return () => {
      dispatch<InitModelStatesAction>({
        type: 'resourceInfoPage/initModelStates',
      });
    };
  }, []);

  function onChangeIsEditing(bool: boolean) {
    // console.log(bool, '0293jdsfl;kjf;lasd');
    // console.log(info?.intro, 'info?.intro');
    dispatch<ChangeAction>({
      type: 'resourceInfoPage/change',
      payload: {
        editorText: bool ? resourceInfo.info?.intro : '',
        isEditing: bool,
        introductionErrorText: '',
      },
    });
  }

  return (<>
    <Helmet>
      <title>{`资源信息 · ${resourceInfo.info?.resourceName || ''}  - Freelog`}</title>
    </Helmet>
    <FLeftSiderLayout
      sider={<Sider />}
      header={<FComponentsLib.FTitleText
        text={FI18n.i18nNext.t('resource_information')}
        type='h1'
      />}
    >
      {
        !resourceInfo.info && (<div>
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

      {resourceInfo.info && <FFormLayout>
        {/*<div className={styles.styles}>*/}
        <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_name')}>
          <FComponentsLib.FContentText type='highlight' text={resourceInfo.info?.resourceName || ''} />
        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_type')}>
          <FComponentsLib.FContentText
            type='highlight'
            text={resourceInfo.info.resourceType.join(' / ')}
          />
        </FFormLayout.FBlock>
        <FFormLayout.FBlock
          title={FI18n.i18nNext.t('resource_short_description')}
          extra={<Space size={10}>
            {
              resourceInfo.info?.intro && !resourceInfoPage.isEditing
              && (<FComponentsLib.FTextBtn onClick={() => {
                onChangeIsEditing(true);
              }}>{FI18n.i18nNext.t('edit')}</FComponentsLib.FTextBtn>)
            }
            {
              resourceInfoPage.isEditing && (<>
                <FComponentsLib.FTextBtn
                  type='default'
                  onClick={() => {
                    onChangeIsEditing(false);
                  }}
                >{FI18n.i18nNext.t('cancel')}</FComponentsLib.FTextBtn>
                <FComponentsLib.FTextBtn
                  onClick={() => {
                    onChangeIsEditing(false);
                    dispatch<OnChangeInfoAction>({
                      type: 'resourceInfoPage/onChangeInfo',
                      // payload: {intro: resourceInfoPage.editor},
                      payload: { intro: resourceInfoPage.editorText },
                      id: resourceInfo.info?.resourceId || '',
                    });
                  }}
                >{FI18n.i18nNext.t('save')}</FComponentsLib.FTextBtn>
              </>)
            }
          </Space>}
        >

          {
            resourceInfoPage.isEditing
              ? (<FIntroductionEditor
                value={resourceInfoPage.editorText}
                errorText={resourceInfoPage.introductionErrorText}
                onChange={(e) => dispatch<ChangeAction>({
                  type: 'resourceInfoPage/change',
                  payload: {
                    editorText: e.target.value,
                    introductionErrorText: e.target.value.length > 1000 ? '不多于1000个字符' : '',
                  },
                })}
              />)
              : resourceInfo.info?.intro
                ? (<div className={styles.aboutPanel}>
                  <FComponentsLib.FContentText text={resourceInfo.info?.intro} />
                </div>)
                : (<FComponentsLib.FRectBtn
                  type='default'
                  onClick={() => onChangeIsEditing(true)}
                >
                  {/*{FUtil.I18n.message('resource_short_description')}*/}
                  添加简介
                </FComponentsLib.FRectBtn>)
          }

        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_image')}>
          <FUploadResourceCover
            value={resourceInfo.info?.coverImages.length > 0 ? resourceInfo.info?.coverImages[0] : ''}
            onChange={(value) => dispatch<OnChangeInfoAction>({
              type: 'resourceInfoPage/onChangeInfo',
              payload: { coverImages: [value] },
              id: resourceInfo.info?.resourceId || '',
            })}
          />
        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_tag')}>
          <FLabelEditor
            // showRecommendation={true}
            resourceType={resourceInfo.info?.resourceType[resourceInfo.info?.resourceType.length - 1 || 0]}
            values={resourceInfo.info?.tags}
            onChange={(value) => dispatch<OnChangeInfoAction>({
              type: 'resourceInfoPage/onChangeInfo',
              payload: { tags: value },
              id: resourceInfo.info?.resourceId || '',
            })}
          />
        </FFormLayout.FBlock>
      </FFormLayout>}
    </FLeftSiderLayout>
  </>);
}

export default connect(({ resourceInfo, resourceInfoPage, user }: ConnectState) => ({
  resourceInfo: resourceInfo,
  resourceInfoPage: resourceInfoPage,
  user: user,
}))(Info);
