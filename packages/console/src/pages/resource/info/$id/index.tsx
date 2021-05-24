import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import {Space} from 'antd';
import FLabelEditor from '@/pages/resource/components/FLabelEditor';
import FUploadResourceCover from '@/pages/resource/components/FUploadResourceCover';
import FIntroductionEditor from '@/pages/resource/components/FIntroductionEditor';
import {FRectBtn, FTextBtn} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceInfoModelState, ResourceInfoPageModelState, UserModelState} from '@/models/connect';
import {OnChangeInfoAction, ChangeAction, InitModelStatesAction} from "@/models/resourceInfoPage";
import {ChangeAction as GlobalChangeAction} from "@/models/global";
import {RouterTypes} from "umi";
import FLeftSiderLayout from "@/layouts/FLeftSiderLayout";
import Sider from "@/pages/resource/containers/Sider";
import FFormLayout from "@/components/FFormLayout";
import FUtil from "@/utils";
import {RouteComponentProps} from "react-router";

interface InfoProps extends RouteComponentProps<{ id: string; }> {
  dispatch: Dispatch;
  resourceInfo: ResourceInfoModelState,
  resourceInfoPage: ResourceInfoPageModelState,
  user: UserModelState;
}

function Info({dispatch, route, resourceInfoPage, resourceInfo, user, match}: InfoProps & RouterTypes) {

  React.useEffect(() => {
    dispatch<GlobalChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });

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
  }, [route]);

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

  return (
    <FLeftSiderLayout
      sider={<Sider/>}
      header={<FTitleText
        text={FUtil.I18n.message('resource_information')}
        type="h1"
      />}
    >
      {resourceInfo.info && <FFormLayout>
        {/*<div className={styles.styles}>*/}
        <FFormLayout.FBlock title={FUtil.I18n.message('resource_name')}>
          <FContentText type="highlight" text={resourceInfo.info?.resourceName}/>
        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={FUtil.I18n.message('resource_type')}>
          <FContentText type="highlight" text={resourceInfo.info.resourceType}/>
        </FFormLayout.FBlock>
        <FFormLayout.FBlock
          title={FUtil.I18n.message('resource_short_description')}
          extra={<Space size={10}>
            {
              resourceInfo.info?.intro && !resourceInfoPage.isEditing
              && (<FTextBtn onClick={() => {
                onChangeIsEditing(true)
              }}>{FUtil.I18n.message('edit')}</FTextBtn>)
            }
            {
              resourceInfoPage.isEditing && (<>
                <FTextBtn
                  type="default"
                  onClick={() => {
                    onChangeIsEditing(false);
                  }}
                >{FUtil.I18n.message('cancel')}</FTextBtn>
                <FTextBtn
                  onClick={() => {
                    onChangeIsEditing(false);
                    dispatch<OnChangeInfoAction>({
                      type: 'resourceInfoPage/onChangeInfo',
                      // payload: {intro: resourceInfoPage.editor},
                      payload: {intro: resourceInfoPage.editorText},
                      id: resourceInfo.info?.resourceId || '',
                    });
                  }}
                >{FUtil.I18n.message('save')}</FTextBtn>
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
                <FContentText text={resourceInfo.info?.intro}/>
              </div>)
              : (<FRectBtn
                type="default"
                onClick={() => onChangeIsEditing(true)}
              >
                {/*{FUtil.I18n.message('resource_short_description')}*/}
                添加简介
              </FRectBtn>)
          }

        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={FUtil.I18n.message('resource_image')}>
          <FUploadResourceCover
            value={resourceInfo.info?.coverImages.length > 0 ? resourceInfo.info?.coverImages[0] : ''}
            onChange={(value) => dispatch<OnChangeInfoAction>({
              type: 'resourceInfoPage/onChangeInfo',
              payload: {coverImages: [value]},
              id: resourceInfo.info?.resourceId || ''
            })}
          />
        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={FUtil.I18n.message('resource_tag')}>
          <FLabelEditor
            values={resourceInfo.info?.tags}
            onChange={(value) => dispatch<OnChangeInfoAction>({
              type: 'resourceInfoPage/onChangeInfo',
              payload: {tags: value},
              id: resourceInfo.info?.resourceId || '',
            })}
          />
        </FFormLayout.FBlock>
      </FFormLayout>}
    </FLeftSiderLayout>)
}

export default connect(({resourceInfo, resourceInfoPage, user}: ConnectState) => ({
  resourceInfo: resourceInfo,
  resourceInfoPage: resourceInfoPage,
  user: user,
}))(Info);
