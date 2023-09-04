import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FUploadResourceCover from '@/pages/resource/components/FUploadResourceCover';
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
  OnChange_Cover_Action,
  OnChange_IntroductionEditor_Action,
  OnClick_EditTitleBtn_Action,
  OnClick_CancelEditTitleBtn_Action,
  OnClick_SaveTitleBtn_Action, OnChange_TitleInput_Action,
} from '@/models/resourceInfoPage';
import { OnChange_Page_Action, OnMount_Page_Action as OnMount_Sidebar_Action } from '@/models/resourceSider';
import FFormLayout from '@/components/FFormLayout';
import { RouteComponentProps } from 'react-router';
import { Helmet } from 'react-helmet';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import FSkeletonNode from '@/components/FSkeletonNode';
import * as AHooks from 'ahooks';
import FResourceLabelEditor from '@/components/FResourceLabelEditor';
import fMessage from '@/components/fMessage';
import FUploadCover from '@/components/FUploadCover';
import FCoverImage from '@/components/FCoverImage';

interface InfoProps extends RouteComponentProps<{ id: string; }> {
  dispatch: Dispatch;
  resourceInfoPage: ResourceInfoPageModelState,
}

function Info({ dispatch, resourceInfoPage, match }: InfoProps) {

  AHooks.useMount(async () => {
    dispatch<OnMount_Sidebar_Action>({
      type: 'resourceSider/onMount_Page',
      payload: {
        resourceID: match.params.id,
      },
    });
    dispatch<OnChange_Page_Action>({
      type: 'resourceSider/onChange_Page',
      payload: {
        page: 'info',
      },
    });
    dispatch<OnMount_Page_Action>({
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
    {/*<FLeftSiderLayout*/}
    {/*  sider={<Sider />}*/}
    {/*  header={<FComponentsLib.FTitleText*/}
    {/*    text={FI18n.i18nNext.t('resource_information')}*/}
    {/*    type='h1'*/}
    {/*  />}*/}
    {/*>*/}
    {
      resourceInfoPage.pageState === 'loading' && (<div>
        <div style={{ height: 40 }} />
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
      !!resourceInfoPage.resourceInfo && resourceInfoPage.pageState === 'loaded' && (<div>
        <div style={{ height: 40 }} />
        <div className={styles.block}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FComponentsLib.FContentText text={'资源标题'} type={'highlight'} />

            {
              resourceInfoPage.title_IsEditing
                ? (<Space size={10}>
                  <FComponentsLib.FTextBtn
                    type={'default'}
                    onClick={() => {
                      dispatch<OnClick_CancelEditTitleBtn_Action>({
                        type: 'resourceInfoPage/onClick_CancelEditTitleBtn',
                      });
                    }}
                  >取消</FComponentsLib.FTextBtn>
                  <FComponentsLib.FTextBtn
                    disabled={resourceInfoPage.title_Input.length > 100}
                    type={'primary'}
                    onClick={() => {
                      dispatch<OnClick_SaveTitleBtn_Action>({
                        type: 'resourceInfoPage/onClick_SaveEditTitleBtn',
                      });
                    }}
                  >保存</FComponentsLib.FTextBtn>
                </Space>)
                : (<FComponentsLib.FTextBtn
                  type={'primary'}
                  onClick={() => {
                    dispatch<OnClick_EditTitleBtn_Action>({
                      type: 'resourceInfoPage/onClick_EditTitleBtn',
                    });
                  }}
                >编辑</FComponentsLib.FTextBtn>)
            }

          </div>
          <div style={{ height: 5 }} />
          <FComponentsLib.FContentText
            text={'标题直接影响商品的搜索曝光机会，建议在标题中加入品牌/内容主旨，例如，《大明风华：明朝人的城市生活》；标题长度不超过100个字符。'}
            type={'additional2'}
          />
          <div style={{ height: 20 }} />
          {
            resourceInfoPage.title_IsEditing ? (<FComponentsLib.FInput.FSingleLine
                value={resourceInfoPage.title_Input || ''}
                lengthLimit={100}
                style={{ width: '100%' }}
                // placeholder={FI18n.i18nNext.t('输入资源授权标识')}
                // placeholder={FI18n.i18nNext.t('rqr_input_resourceauthid_hint')}
                placeholder={resourceInfoPage.resourceInfo.resourceName || FI18n.i18nNext.t('rqr_input_resourceauthid_hint')}
                onChange={(e) => {
                  dispatch<OnChange_TitleInput_Action>({
                    type: 'resourceInfoPage/onChange_TitleInput',
                    payload: {
                      value: e.target.value,
                    },
                  });
                }}
              />)
              : (<div className={styles.resourceTitle}>
                {/*{*/}
                {/*  nodeManagerPage.setting_nodeInfo.title*/}
                {/*    ? (<FComponentsLib.FContentText*/}
                {/*      text={nodeManagerPage.setting_nodeInfo.title}*/}
                {/*      type={'normal'}*/}
                {/*    />)*/}
                {/*    : (<i style={{ color: '#999' }}>暂无无内容...</i>)*/}
                {/*}*/}

                {/*<i style={{ color: '#999' }}>暂无无内容...</i>*/}

                <FComponentsLib.FContentText
                  text={resourceInfoPage.resourceInfo.resourceTitle || resourceInfoPage.resourceInfo.resourceName || ''}
                  type={'normal'}
                />
              </div>)
          }

        </div>

        <div style={{ height: 5 }} />

        <div className={styles.block}>
          <FComponentsLib.FContentText text={FI18n.i18nNext.t('rqr_input_resouce_image')} type={'highlight'} />
          <div style={{ height: 5 }} />
          <FComponentsLib.FContentText
            text={FI18n.i18nNext.t('rqr_input_resouce_image_help')}
            type={'additional2'}
          />
          <div style={{ height: 20 }} />
          <FUploadCover
            onUploadSuccess={(url) => {
              // dispatch<OnChange_step4_resourceCover_Action>({
              //   type: 'resourceCreatorPage/onChange_step4_resourceCover',
              //   payload: {
              //     value: url,
              //   },
              // });
              dispatch<OnChange_Cover_Action>({
                type: 'resourceInfoPage/onChange_Cover',
                payload: {
                  value: url,
                },
              });
            }}
            onError={(err) => {
              fMessage(err, 'error');
            }}
          >
            {/*<a className={styles.FUploadImageChildren}>*/}
            {/*  <FComponentsLib.FIcons.FCloudUpload />*/}
            {/*  <span>{FI18n.i18nNext.t('upload_image')}</span>*/}
            {/*</a>*/}
            {
              resourceInfoPage.resourceInfo.coverImages.length === 0 && (<a className={styles.FUploadImageChildren}>
                <FComponentsLib.FIcons.FCloudUpload />
                <span>{FI18n.i18nNext.t('upload_image')}</span>
              </a>)
            }

            {
              resourceInfoPage.resourceInfo.coverImages.length > 0 && (<div className={styles.cover}>
                <FCoverImage src={resourceInfoPage.resourceInfo.coverImages[0]} width={200}
                             style={{ borderRadius: 4 }} />
                <div className={styles.coverEdit}>
                  <FComponentsLib.FIcons.FEdit style={{ fontSize: 32 }} />
                  <div style={{ height: 10 }} />
                  <div>{FI18n.i18nNext.t('btn_edit_cover')}</div>
                </div>
              </div>)
            }
          </FUploadCover>
        </div>

        <div style={{ height: 5 }} />

        <div className={styles.block}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FComponentsLib.FContentText text={FI18n.i18nNext.t('resource_short_description')} type={'highlight'} />

            <Space size={10}>
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
                    disabled={resourceInfoPage.introduction_EditorText_Error !== ''}
                  >{FI18n.i18nNext.t('save')}</FComponentsLib.FTextBtn>
                </>)
              }
            </Space>
          </div>

          <div style={{ height: 20 }} />
          {
            resourceInfoPage.introduction_IsEditing
              ? (<div>
                <FComponentsLib.FInput.FMultiLine
                  value={resourceInfoPage.introduction_EditorText}
                  lengthLimit={200}
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
                  <pre>{resourceInfoPage.resourceInfo.intro}</pre>
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
                  添加简介
                </FComponentsLib.FRectBtn>)
          }
        </div>

        <div style={{ height: 5 }} />

        <div className={styles.block}>
          <FComponentsLib.FContentText text={FI18n.i18nNext.t('resource_tag')} type={'highlight'} />
          <div style={{ height: 20 }} />

          <FResourceLabelEditor
            value={resourceInfoPage.resourceInfo.tags}
            resourceType={resourceInfoPage.resourceInfo.resourceType[resourceInfoPage.resourceInfo.resourceType.length - 1 || 0]}
            onChange={(value) => {
              dispatch<OnChange_Labels_Action>({
                type: 'resourceInfoPage/onChange_Labels',
                payload: {
                  value: value,
                },
              });
            }}
          />
        </div>

        <div style={{ height: 100 }} />
      </div>)
    }

    {/*{*/}
    {/*  !!resourceInfoPage.resourceInfo && resourceInfoPage.pageState === 'loaded' && <FFormLayout>*/}
    {/*    /!*<div className={styles.styles}>*!/*/}
    {/*    <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_name')}>*/}
    {/*      <FComponentsLib.FContentText type='highlight' text={resourceInfoPage.resourceInfo.resourceName || ''} />*/}
    {/*    </FFormLayout.FBlock>*/}
    {/*    <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_type')}>*/}
    {/*      <FComponentsLib.FContentText*/}
    {/*        type='highlight'*/}
    {/*        text={resourceInfoPage.resourceInfo.resourceType.join(' / ')}*/}
    {/*      />*/}
    {/*    </FFormLayout.FBlock>*/}
    {/*    <FFormLayout.FBlock*/}
    {/*      title={FI18n.i18nNext.t('resource_short_description')}*/}
    {/*      extra={<Space size={10}>*/}
    {/*        {*/}
    {/*          resourceInfoPage.resourceInfo.intro !== '' && !resourceInfoPage.introduction_IsEditing*/}
    {/*          && (<FComponentsLib.FTextBtn*/}
    {/*            onClick={() => {*/}
    {/*              // onChangeIsEditing(true);*/}
    {/*              dispatch<OnClick_EditIntroductionBtn_Action>({*/}
    {/*                type: 'resourceInfoPage/onClick_EditIntroductionBtn',*/}
    {/*              });*/}
    {/*            }}*/}
    {/*          >{FI18n.i18nNext.t('edit')}</FComponentsLib.FTextBtn>)*/}
    {/*        }*/}
    {/*        {*/}
    {/*          resourceInfoPage.introduction_IsEditing && (<>*/}
    {/*            <FComponentsLib.FTextBtn*/}
    {/*              type='default'*/}
    {/*              onClick={() => {*/}
    {/*                // onChangeIsEditing(false);*/}
    {/*                dispatch<OnClick_CancelEditIntroductionBtn_Action>({*/}
    {/*                  type: 'resourceInfoPage/onClick_CancelEditIntroductionBtn',*/}
    {/*                });*/}
    {/*              }}*/}
    {/*            >{FI18n.i18nNext.t('cancel')}</FComponentsLib.FTextBtn>*/}
    {/*            <FComponentsLib.FTextBtn*/}
    {/*              onClick={() => {*/}
    {/*                dispatch<OnClick_SaveIntroductionBtn_Action>({*/}
    {/*                  type: 'resourceInfoPage/onClick_SaveIntroductionBtn',*/}
    {/*                });*/}
    {/*              }}*/}
    {/*              disabled={resourceInfoPage.introduction_EditorText_Error !== ''}*/}
    {/*            >{FI18n.i18nNext.t('save')}</FComponentsLib.FTextBtn>*/}
    {/*          </>)*/}
    {/*        }*/}
    {/*      </Space>}*/}
    {/*    >*/}

    {/*      {*/}
    {/*        resourceInfoPage.introduction_IsEditing*/}
    {/*          ? (<div>*/}
    {/*            <FComponentsLib.FInput.FMultiLine*/}
    {/*              value={resourceInfoPage.introduction_EditorText}*/}
    {/*              lengthLimit={1000}*/}
    {/*              onChange={(e) => {*/}
    {/*                dispatch<OnChange_IntroductionEditor_Action>({*/}
    {/*                  type: 'resourceInfoPage/onChange_IntroductionEditor',*/}
    {/*                  payload: {*/}
    {/*                    value: e.target.value,*/}
    {/*                  },*/}
    {/*                });*/}
    {/*              }}*/}
    {/*            />*/}

    {/*            {*/}
    {/*              resourceInfoPage.introduction_EditorText_Error !== '' && (<>*/}
    {/*                <div style={{ height: 5 }} />*/}
    {/*                <div style={{ color: '#EE4040' }}>{resourceInfoPage.introduction_EditorText_Error}</div>*/}
    {/*              </>)*/}
    {/*            }*/}

    {/*          </div>)*/}
    {/*          : resourceInfoPage.resourceInfo.intro !== ''*/}
    {/*            ? (<div className={styles.aboutPanel}>*/}
    {/*              <pre>{resourceInfoPage.resourceInfo.intro}</pre>*/}
    {/*            </div>)*/}
    {/*            : (<FComponentsLib.FRectBtn*/}
    {/*              type='default'*/}
    {/*              onClick={() => {*/}
    {/*                dispatch<OnClick_AddIntroductionBtn_Action>({*/}
    {/*                  type: 'resourceInfoPage/onClick_AddIntroductionBtn',*/}
    {/*                });*/}
    {/*                // onChangeIsEditing(true);*/}
    {/*              }}*/}
    {/*            >*/}
    {/*              添加简介*/}
    {/*            </FComponentsLib.FRectBtn>)*/}
    {/*      }*/}

    {/*    </FFormLayout.FBlock>*/}
    {/*    <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_image')}>*/}
    {/*      <FUploadResourceCover*/}
    {/*        value={resourceInfoPage.resourceInfo.coverImages.length > 0*/}
    {/*          ? resourceInfoPage.resourceInfo.coverImages[0]*/}
    {/*          : ''}*/}
    {/*        onChange={(value) => {*/}
    {/*          dispatch<OnChange_Cover_Action>({*/}
    {/*            type: 'resourceInfoPage/onChange_Cover',*/}
    {/*            payload: {*/}
    {/*              value: value,*/}
    {/*            },*/}
    {/*          });*/}
    {/*        }}*/}
    {/*      />*/}
    {/*    </FFormLayout.FBlock>*/}
    {/*    /!*<FFormLayout.FBlock title={FI18n.i18nNext.t('resource_tag')}>*!/*/}
    {/*    /!*  <FLabelEditor*!/*/}
    {/*    /!*    // showRecommendation={true}*!/*/}
    {/*    /!*    resourceType={resourceInfoPage.resourceInfo.resourceType[resourceInfoPage.resourceInfo.resourceType.length - 1 || 0]}*!/*/}
    {/*    /!*    values={resourceInfoPage.resourceInfo.tags}*!/*/}
    {/*    /!*    onChange={(value) => {*!/*/}
    {/*    /!*      dispatch<OnChange_Labels_Action>({*!/*/}
    {/*    /!*        type: 'resourceInfoPage/onChange_Labels',*!/*/}
    {/*    /!*        payload: {*!/*/}
    {/*    /!*          value: value,*!/*/}
    {/*    /!*        },*!/*/}
    {/*    /!*      });*!/*/}
    {/*    /!*    }}*!/*/}
    {/*    /!*  />*!/*/}
    {/*    /!*</FFormLayout.FBlock>*!/*/}
    {/*    <FFormLayout.FBlock title={FI18n.i18nNext.t('resource_tag')}>*/}
    {/*      <FResourceLabelEditor*/}
    {/*        value={resourceInfoPage.resourceInfo.tags}*/}
    {/*        resourceType={resourceInfoPage.resourceInfo.resourceType[resourceInfoPage.resourceInfo.resourceType.length - 1 || 0]}*/}
    {/*        onChange={(value) => {*/}
    {/*          dispatch<OnChange_Labels_Action>({*/}
    {/*            type: 'resourceInfoPage/onChange_Labels',*/}
    {/*            payload: {*/}
    {/*              value: value,*/}
    {/*            },*/}
    {/*          });*/}
    {/*        }}*/}
    {/*      />*/}
    {/*    </FFormLayout.FBlock>*/}
    {/*  </FFormLayout>}*/}
    {/*</FLeftSiderLayout>*/}
  </>);
}

export default connect(({ resourceInfoPage }: ConnectState) => ({
  resourceInfoPage: resourceInfoPage,
}))(Info);
