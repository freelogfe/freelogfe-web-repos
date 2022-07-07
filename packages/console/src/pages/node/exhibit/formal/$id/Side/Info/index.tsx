import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
// import FUploadImage from '@/components/FUploadImage';
import { ChangeAction, ExhibitInfoPageModelState, UpdateBaseInfoAction } from '@/models/exhibitInfoPage';
import { FEdit } from '@/components/FIcons';
import { Space } from 'antd';
import FInput from '@/components/FInput';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import FLabelEditor from '@/pages/resource/components/FLabelEditor';
import { connect, Dispatch } from 'dva';
import { ConnectState } from '@/models/connect';
import fMessage from '@/components/fMessage';
import FTooltip from '@/components/FTooltip';
// import FUtil1 from '@/utils';
import { FI18n } from '@freelog/tools-lib';
import FCoverImage from '@/components/FCoverImage';
import FUploadCover from '@/components/FUploadCover';

interface InfoProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Info({ dispatch, exhibitInfoPage }: InfoProps) {
  function onChangePInputTitle(value: string | null) {
    dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload: {
        side_ExhibitInputTitle: value,
      },
    });
  }

  if (exhibitInfoPage.side_ResourceType === 'theme') {
    return null;
  }

  return (<>

    <FContentText
      text={FI18n.i18nNext.t('exhibit_info')}
      type='highlight'
    />

    <div style={{ height: 20 }} />

    <FUploadCover
      onError={(err) => {
        fMessage(err, 'error');
      }}
      onUploadSuccess={(url: string) => {
        // console.log(url, 'url@#$!@#$@#@#$@#');
        dispatch<UpdateBaseInfoAction>({
          type: 'exhibitInfoPage/updateBaseInfo',
          payload: {
            side_ExhibitCover: url,
          },
        });
      }}>
      <div className={styles.cover}>
        {/*<img*/}
        {/*  alt=''*/}
        {/*  src={exhibitInfoPage.side_ExhibitCover || imgSrc}*/}
        {/*/>*/}
        <FCoverImage src={exhibitInfoPage.side_ExhibitCover || ''} width={220} style={{ borderRadius: 10 }} />
        <div className={styles.coverEdit}>

          <FEdit style={{ fontSize: 32 }} />
          <div style={{ height: 10 }} />
          <div>{FI18n.i18nNext.t('btn_edit_cover')}</div>
        </div>
      </div>
    </FUploadCover>

    <div style={{ height: 20 }} />

    <FTitleText text={FI18n.i18nNext.t('exhibit_title')} type='h4' />
    <div style={{ height: 15 }} />
    {
      exhibitInfoPage.side_ExhibitInputTitle === null
        ? (<Space size={10}>
          <FContentText text={exhibitInfoPage.side_ExhibitTitle} />
          <FTooltip title={'编辑'}>
            <div>
              <FTextBtn onClick={() => {
                onChangePInputTitle(exhibitInfoPage.side_ExhibitTitle);
              }}><FEdit /></FTextBtn>
            </div>
          </FTooltip>
        </Space>)
        : (<>
          <FInput
            className={styles.FInput}
            wrapClassName={styles.FInput}
            value={exhibitInfoPage.side_ExhibitInputTitle || ''}
            onChange={(e) => onChangePInputTitle(e.target.value)}
          />
          <div style={{ height: 10 }} />
          <div className={styles.btn}>
            <FTextBtn
              type='default'
              // size="small"
              onClick={() => onChangePInputTitle(null)}
            >{FI18n.i18nNext.t('btn_cancel')}</FTextBtn>
            <div style={{ width: 15 }} />
            <FRectBtn
              size='small'
              onClick={() => {
                dispatch<UpdateBaseInfoAction>({
                  type: 'exhibitInfoPage/updateBaseInfo',
                  payload: {
                    side_ExhibitTitle: exhibitInfoPage.side_ExhibitInputTitle || '',
                  },
                });
                onChangePInputTitle(null);
              }}
            >{FI18n.i18nNext.t('btn_save')}</FRectBtn>
          </div>

        </>)
    }
    <div style={{ height: 30 }} />

    <FTitleText text={FI18n.i18nNext.t('exhibit_tag')} type='h4' />
    <div style={{ height: 15 }} />
    <FLabelEditor
      values={exhibitInfoPage.side_ExhibitTags}
      onChange={(value) => {
        dispatch<UpdateBaseInfoAction>({
          type: 'exhibitInfoPage/updateBaseInfo',
          payload: {
            side_ExhibitTags: value,
          },
        });
      }}
    />
    <div style={{ height: 30 }} />
  </>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Info);
