import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { FI18n } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';
import FUploadCover from '@/components/FUploadCover';
import FResourceLabelEditor from '@/components/FResourceLabelEditor';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorPageModelState } from '@/models/connect';
import { Dispatch } from 'redux';
import {
  OnChange_step4_resourceCover_Action, OnChange_step4_resourceLabels_Action,
  OnChange_step4_resourceTitle_Action,
  OnClick_step4_preBtn_Action, OnClick_step4_submitBtn_Action,
} from '@/models/resourceCreatorPage';
import FCoverImage from '@/components/FCoverImage';

interface Step4Props {
  dispatch: Dispatch;
  resourceCreatorPage: ResourceCreatorPageModelState;
}

function Step4({ dispatch, resourceCreatorPage }: Step4Props) {
  return (<>
    <div style={{ height: 40 }} />
    <div className={styles.block}>
      {/*<FComponentsLib.FContentText text={'资源标题'} type={'highlight'} />*/}
      <FComponentsLib.FContentText text={FI18n.i18nNext.t('rqr_input_resouce_title')} type={'highlight'} />
      <div style={{ height: 5 }} />
      {/*<FComponentsLib.FContentText*/}
      {/*  text={'标题直接影响商品的搜索曝光机会，建议在标题中加入品牌/内容主旨，例如，《大明风华：明朝人的城市生活》；标题长度不超过100个字符。'}*/}
      {/*  type={'additional2'}*/}
      {/*/>*/}
      <FComponentsLib.FContentText text={FI18n.i18nNext.t('rqr_input_resouce_title_help')} type={'additional2'} />
      <div style={{ height: 20 }} />
      <FComponentsLib.FInput.FSingleLine
        value={resourceCreatorPage.step4_resourceTitle}
        lengthLimit={100}
        style={{ width: '100%' }}
        // placeholder={FI18n.i18nNext.t('输入资源授权标识')}
        placeholder={FI18n.i18nNext.t('rqr_input_resourceauthid_hint')}
        onChange={(e) => {
          dispatch<OnChange_step4_resourceTitle_Action>({
            type: 'resourceCreatorPage/onChange_step4_resourceTitle',
            payload: {
              value: e.target.value,
            },
          });
        }}
      />
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
          dispatch<OnChange_step4_resourceCover_Action>({
            type: 'resourceCreatorPage/onChange_step4_resourceCover',
            payload: {
              value: url,
            },
          });
        }}
        onError={(err) => {
          fMessage(err, 'error');
        }}
      >
        {
          resourceCreatorPage.step4_resourceCover === '' && (<a className={styles.FUploadImageChildren}>
            <FComponentsLib.FIcons.FCloudUpload />
            <span>{FI18n.i18nNext.t('upload_image')}</span>
          </a>)
        }

        {
          resourceCreatorPage.step4_resourceCover !== '' && (<div className={styles.cover}>
            <FCoverImage src={resourceCreatorPage.step4_resourceCover} width={200} style={{ borderRadius: 4 }} />
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
      <FComponentsLib.FContentText text={'资源标签'} type={'highlight'} />
      {/*<FComponentsLib.FContentText text={FI18n.i18nNext.t('rqr_input_resouce_tag')} type={'highlight'}/>*/}
      <div style={{ height: 20 }} />

      <FResourceLabelEditor
        value={resourceCreatorPage.step4_resourceLabels}
        // resourceType={resourceInfoPage.resourceInfo.resourceType[resourceInfoPage.resourceInfo.resourceType.length - 1 || 0]}
        resourceType={resourceCreatorPage.step1_createdResourceInfo?.resourceType[resourceCreatorPage.step1_createdResourceInfo.resourceType.length - 1 || 0] || ''}
        onChange={(value) => {
          dispatch<OnChange_step4_resourceLabels_Action>({
            type: 'resourceCreatorPage/onChange_step4_resourceLabels',
            payload: {
              value: value,
            },
          });
        }}
      />
    </div>

    <div style={{ height: 30 }} />

    <div className={styles.btn}>

      {/*{FI18n.i18nNext.t('rqr_step4_btn_back')}*/}
      <FComponentsLib.FTextBtn
        type={'default'}
        onClick={() => {
          dispatch<OnClick_step4_preBtn_Action>({
            type: 'resourceCreatorPage/onClick_step4_preBtn',
          });
        }}
      >{FI18n.i18nNext.t('rqr_step4_btn_back')}</FComponentsLib.FTextBtn>

      {/*{FI18n.i18nNext.t('rqr_step4_btn_release')}*/}
      <FComponentsLib.FRectBtn
        // disabled={true}
        type={'primary'}
        onClick={() => {
          dispatch<OnClick_step4_submitBtn_Action>({
            type: 'resourceCreatorPage/onClick_step4_submitBtn',
          });
        }}
      >{FI18n.i18nNext.t('rqr_step4_btn_release')}</FComponentsLib.FRectBtn>
    </div>
    <div style={{ height: 100 }} />
  </>);
}

export default connect(({ resourceCreatorPage }: ConnectState) => ({
  resourceCreatorPage: resourceCreatorPage,
}))(Step4);
