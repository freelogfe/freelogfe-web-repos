import * as React from 'react';
import styles from './index.less';
import {
  ExhibitInfoPageModelState, OnChange_Side_ExhibitInputIntroduction_Action,
  OnChange_Side_InputTitle_Action, OnSave_Side_ExhibitIntroduction_Action,
  UpdateBaseInfoAction,
} from '@/models/exhibitInfoPage';
import { Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import fMessage from '@/components/fMessage';
import FTooltip from '@/components/FTooltip';
import { FI18n } from '@freelog/tools-lib';
import FCoverImage from '@/components/FCoverImage';
import FUploadCover from '@/components/FUploadCover';
import FComponentsLib from '@freelog/components-lib';
import FExhibitLabelEditor from '@/components/FExhibitLabelEditor';

interface InfoProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Info({ dispatch, exhibitInfoPage }: InfoProps) {
  function onChangePInputTitle(value: string | null) {
    dispatch<OnChange_Side_InputTitle_Action>({
      type: 'exhibitInfoPage/onChange_Side_InputTitle',
      payload: {
        value: value,
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
          {
            exhibitInfoPage.side_ExhibitTitle === ''
              ? (<>
                <FComponentsLib.FTextBtn onClick={() => {
                  onChangePInputTitle(exhibitInfoPage.side_ExhibitTitle);
                }}><FComponentsLib.FIcons.FAdd /></FComponentsLib.FTextBtn>
                <FComponentsLib.FTextBtn onClick={() => {
                  onChangePInputTitle(exhibitInfoPage.side_ExhibitTitle);
                }}>添加标题</FComponentsLib.FTextBtn>
              </>)
              : (<>
                <FComponentsLib.FContentText
                  text={exhibitInfoPage.side_ExhibitTitle}
                  style={{ overflowWrap: 'anywhere' }}
                />
                <FTooltip title={'编辑'}>
                  <div>
                    <FComponentsLib.FTextBtn onClick={() => {
                      onChangePInputTitle(exhibitInfoPage.side_ExhibitTitle);
                    }}><FComponentsLib.FIcons.FEdit /></FComponentsLib.FTextBtn>
                  </div>
                </FTooltip>
              </>)
          }


        </Space>)
        : (<>
          <FComponentsLib.FInput.FSingleLine
            lengthLimit={-1}
            className={styles.FInput}
            // wrapClassName={styles.FInput}
            value={exhibitInfoPage.side_ExhibitInputTitle || ''}
            onChange={(e) => {
              onChangePInputTitle(e.target.value);
            }}
          />
          {
            exhibitInfoPage.side_ExhibitInputTitle_Error !== '' && (<>
              <div style={{ height: 5 }} />
              <div style={{ color: '#EE4040' }}>{exhibitInfoPage.side_ExhibitInputTitle_Error}</div>
            </>)
          }

          <div style={{ height: 10 }} />
          <div className={styles.btn}>
            <FComponentsLib.FTextBtn
              type='default'
              // size="small"
              onClick={() => onChangePInputTitle(null)}
            >{FI18n.i18nNext.t('btn_cancel')}</FComponentsLib.FTextBtn>
            <div style={{ width: 15 }} />
            <FComponentsLib.FRectBtn
              disabled={exhibitInfoPage.side_ExhibitInputTitle_Error !== ''}
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

    <div style={{ height: 20 }} />

    <FComponentsLib.FTitleText text={'展品简介'} type='h4' />
    <div style={{ height: 15 }} />

    {
      exhibitInfoPage.side_ExhibitInputIntroduction === null
        ? (<Space size={10}>
          {
            exhibitInfoPage.side_ExhibitIntroduction === ''
              ? (<>
                <FComponentsLib.FTextBtn onClick={() => {
                  dispatch<OnChange_Side_ExhibitInputIntroduction_Action>({
                    type: 'exhibitInfoPage/onChange_Side_ExhibitInputIntroduction',
                    payload: {
                      value: '',
                    },
                  });
                }}><FComponentsLib.FIcons.FAdd /></FComponentsLib.FTextBtn>
                <FComponentsLib.FTextBtn onClick={() => {
                  dispatch<OnChange_Side_ExhibitInputIntroduction_Action>({
                    type: 'exhibitInfoPage/onChange_Side_ExhibitInputIntroduction',
                    payload: {
                      value: '',
                    },
                  });
                }}>展品简介</FComponentsLib.FTextBtn>
              </>)
              : (<>
                <FComponentsLib.FContentText
                  text={exhibitInfoPage.side_ExhibitIntroduction}
                  style={{ overflowWrap: 'anywhere' }}
                />
                <FTooltip title={'编辑'}>
                  <div>
                    <FComponentsLib.FTextBtn onClick={() => {
                      dispatch<OnChange_Side_ExhibitInputIntroduction_Action>({
                        type: 'exhibitInfoPage/onChange_Side_ExhibitInputIntroduction',
                        payload: {
                          value: exhibitInfoPage.side_ExhibitIntroduction,
                        },
                      });
                    }}><FComponentsLib.FIcons.FEdit /></FComponentsLib.FTextBtn>
                  </div>
                </FTooltip>
              </>)
          }

        </Space>)
        : (<>
          <FComponentsLib.FInput.FMultiLine
            lengthLimit={200}
            value={exhibitInfoPage.side_ExhibitInputIntroduction}
            onChange={(e) => {
              dispatch<OnChange_Side_ExhibitInputIntroduction_Action>({
                type: 'exhibitInfoPage/onChange_Side_ExhibitInputIntroduction',
                payload: {
                  value: e.target.value,
                },
              });
            }}
          />
          <div style={{ height: 10 }} />
          <div className={styles.btn}>
            <FComponentsLib.FTextBtn
              type='default'
              // size="small"
              onClick={() => {
                dispatch<OnChange_Side_ExhibitInputIntroduction_Action>({
                  type: 'exhibitInfoPage/onChange_Side_ExhibitInputIntroduction',
                  payload: {
                    value: null,
                  },
                });
              }}
            >{FI18n.i18nNext.t('btn_cancel')}</FComponentsLib.FTextBtn>
            <div style={{ width: 15 }} />
            <FComponentsLib.FRectBtn
              disabled={exhibitInfoPage.side_ExhibitInputIntroduction.length > 200}
              size='small'
              onClick={() => {
                dispatch<OnSave_Side_ExhibitIntroduction_Action>({
                  type: 'exhibitInfoPage/onSave_Side_ExhibitIntroduction',
                });
                dispatch<OnChange_Side_ExhibitInputIntroduction_Action>({
                  type: 'exhibitInfoPage/onChange_Side_ExhibitInputIntroduction',
                  payload: {
                    value: null,
                  },
                });
              }}
            >{FI18n.i18nNext.t('btn_save')}</FComponentsLib.FRectBtn>
          </div>
        </>)
    }


    <div style={{ height: 30 }} />

    <FComponentsLib.FTitleText text={FI18n.i18nNext.t('exhibit_tag')} type='h4' />
    <div style={{ height: 15 }} />
    <FExhibitLabelEditor
      value={exhibitInfoPage.side_ExhibitTags}
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
