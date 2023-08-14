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
import { OnClick_step4_preBtn_Action } from '@/models/resourceCreatorPage';

interface Step4Props {
  dispatch: Dispatch;
  resourceCreatorPage: ResourceCreatorPageModelState;
}

function Step4({ dispatch, resourceCreatorPage }: Step4Props) {
  return (<>
    <div style={{ height: 40 }} />
    <div className={styles.block}>
      <FComponentsLib.FContentText text={'资源标题'} type={'highlight'} />
      {/*<FComponentsLib.FContentText text={FI18n.i18nNext.t('rqr_input_resouce_title')} type={'highlight'}/>*/}
      <div style={{ height: 5 }} />
      <FComponentsLib.FContentText text={'标题直接影响商品的搜索曝光机会，建议在标题中加入品牌/内容主旨，例如，《大明风华：明朝人的城市生活》；标题长度不超过100个字符。'}
                                   type={'additional2'} />
      {/*<FComponentsLib.FContentText text={FI18n.i18nNext.t('rqr_input_resouce_title_help')} type={'additional2'} />*/}
      <div style={{ height: 20 }} />
      <FComponentsLib.FInput.FSingleLine
        value={''}
        lengthLimit={100}
        style={{ width: '100%' }}
        placeholder={FI18n.i18nNext.t('输入资源授权标识')}
        // placeholder={FI18n.i18nNext.t('rqr_input_resourceauthid_hint')}
        onChange={(e) => {

        }}
      />
    </div>

    <div style={{ height: 5 }} />

    <div className={styles.block}>
      <FComponentsLib.FContentText text={'资源封面'} type={'highlight'} />
      {/*<FComponentsLib.FContentText text={FI18n.i18nNext.t('rqr_input_resouce_image')} type={'highlight'}/>*/}
      <div style={{ height: 5 }} />
      <FComponentsLib.FContentText text={'只支持JPG/PNG/GIF，GIF文件不能动画化，大小不超过5M，建议尺寸为800X600；未上传封面时，默认使用系统封面。'}
                                   type={'additional2'} />
      {/*<FComponentsLib.FContentText text={FI18n.i18nNext.t('rqr_input_resouce_image_help')} type={'additional2'} />*/}
      <div style={{ height: 20 }} />
      <FUploadCover
        // onUploadSuccess={(url) => onChange && onChange(url)}
        onError={(err) => {
          fMessage(err, 'error');
        }}
      >
        <a className={styles.FUploadImageChildren}>
          <FComponentsLib.FIcons.FCloudUpload />
          <span>{FI18n.i18nNext.t('upload_image')}</span>
        </a>
      </FUploadCover>
    </div>

    <div style={{ height: 5 }} />

    <div className={styles.block}>
      <FComponentsLib.FContentText text={'资源标签'} type={'highlight'} />
      {/*<FComponentsLib.FContentText text={FI18n.i18nNext.t('rqr_input_resouce_tag')} type={'highlight'}/>*/}
      <div style={{ height: 20 }} />

      <FResourceLabelEditor
        value={[]}
        // resourceType={resourceInfoPage.resourceInfo.resourceType[resourceInfoPage.resourceInfo.resourceType.length - 1 || 0]}
        resourceType={''}
        onChange={(value) => {
          // dispatch<OnChange_Labels_Action>({
          //   type: 'resourceInfoPage/onChange_Labels',
          //   payload: {
          //     value: value,
          //   },
          // });
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
      >上一步</FComponentsLib.FTextBtn>

      {/*{FI18n.i18nNext.t('rqr_step4_btn_release')}*/}
      <FComponentsLib.FRectBtn
        disabled={true}
        type={'primary'}
        onClick={() => {

        }}
      >现在上架</FComponentsLib.FRectBtn>
    </div>
    <div style={{ height: 100 }} />
  </>);
}

export default connect(({ resourceCreatorPage }: ConnectState) => ({
  resourceCreatorPage: resourceCreatorPage,
}))(Step4);
