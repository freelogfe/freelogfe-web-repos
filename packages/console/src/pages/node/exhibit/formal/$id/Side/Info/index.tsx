import * as React from 'react';
import styles from './index.less';
import { ChangeAction, ExhibitInfoPageModelState, UpdateBaseInfoAction } from '@/models/exhibitInfoPage';
import { Space } from 'antd';
import FInput from '@/components/FInput';
import FLabelEditor from '@/components/FLabelEditor';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import fMessage from '@/components/fMessage';
import FTooltip from '@/components/FTooltip';
import { FI18n } from '@freelog/tools-lib';
import FCoverImage from '@/components/FCoverImage';
import FUploadCover from '@/components/FUploadCover';
import FComponentsLib from '@freelog/components-lib';

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

  if (exhibitInfoPage.side_ResourceType.includes('主题')) {
    return null;
  }

  return (<>

    <FComponentsLib.FContentText
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
        <FCoverImage src={exhibitInfoPage.side_ExhibitCover || ''} width={220} style={{ borderRadius: 10 }} />
        <div className={styles.coverEdit}>

          <FComponentsLib.FIcons.FEdit style={{ fontSize: 32 }} />
          <div style={{ height: 10 }} />
          <div>{FI18n.i18nNext.t('btn_edit_cover')}</div>
        </div>
      </div>
    </FUploadCover>

    <div style={{ height: 20 }} />

    <FComponentsLib.FTitleText text={FI18n.i18nNext.t('exhibit_title')} type='h4' />
    <div style={{ height: 15 }} />
    {
      exhibitInfoPage.side_ExhibitInputTitle === null
        ? (<Space size={10}>
          <FComponentsLib.FContentText text={exhibitInfoPage.side_ExhibitTitle} />
          <FTooltip title={'编辑'}>
            <div>
              <FComponentsLib.FTextBtn onClick={() => {
                onChangePInputTitle(exhibitInfoPage.side_ExhibitTitle);
              }}><FComponentsLib.FIcons.FEdit /></FComponentsLib.FTextBtn>
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
            <FComponentsLib.FTextBtn
              type='default'
              // size="small"
              onClick={() => onChangePInputTitle(null)}
            >{FI18n.i18nNext.t('btn_cancel')}</FComponentsLib.FTextBtn>
            <div style={{ width: 15 }} />
            <FComponentsLib.FRectBtn
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
            >{FI18n.i18nNext.t('btn_save')}</FComponentsLib.FRectBtn>
          </div>

        </>)
    }
    <div style={{ height: 30 }} />

    <FComponentsLib.FTitleText text={FI18n.i18nNext.t('exhibit_tag')} type='h4' />
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
