import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import FUploadImage from '@/components/FUploadImage';
import {
  ChangeAction,
  OnChangePCoverAction,
  OnChangePLabelsAction,
  OnChangePTitleInputAction,
  OnClickPTitleCancelBtnAction,
  OnClickPTitleConfirmBtnAction,
  OnClickPTitleEditBtnAction,
} from '@/models/informExhibitInfoPage';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import { FEdit } from '@/components/FIcons';
import { Space } from 'antd';
import FInput from '@/components/FInput';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import FLabelEditor from '@/pages/resource/components/FLabelEditor';
import { connect, Dispatch } from 'dva';
import { ConnectState, InformExhibitInfoPageModelState } from '@/models/connect';
import fMessage from '@/components/fMessage';
import FCoverImage from '@/components/FCoverImage';

interface InfoProps {
  dispatch: Dispatch;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
}

function Info({ dispatch, informExhibitInfoPage }: InfoProps) {

  if (informExhibitInfoPage.exhibit_ResourceType === 'theme') {
    return null;
  }

  async function onChange(payload: Partial<InformExhibitInfoPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'informExhibitInfoPage/change',
      payload,
    });
  }

  return (<>
      <FContentText text={'基础信息'} type='highlight' />
      <div style={{ height: 20 }} />

      <FUploadImage
        onError={(err) => {
          fMessage(err, 'error');
        }}
        onUploadSuccess={async (url: string) => {
          dispatch<OnChangePCoverAction>({
            type: 'informExhibitInfoPage/onChangePCover',
            payload: {
              value: url,
            },
          });
        }}>
        <div className={styles.cover}>
          {/*<img*/}
          {/*  alt=''*/}
          {/*  src={informExhibitInfoPage.side_Exhibit_Cover || imgSrc}*/}
          {/*/>*/}
          <FCoverImage src={informExhibitInfoPage.side_Exhibit_Cover || ''} width={220} style={{ borderRadius: 10 }} />
          <div className={styles.coverEdit}>
            <FEdit style={{ fontSize: 32 }} />
            <div style={{ height: 10 }} />
            <div>修改封面</div>
          </div>
        </div>
      </FUploadImage>

      <div style={{ height: 20 }} />

      <FTitleText
        text={'展品标题'}
        type='h4'
      />
      <div style={{ height: 15 }} />
      {
        informExhibitInfoPage.side_Exhibit_InputTitle === null
          ? (<Space size={10}>
            <div style={{
              maxWidth: 192,
              overflowWrap: 'break-word',
            }}>
              <FContentText text={informExhibitInfoPage.side_Exhibit_Title} />
            </div>
            <a onClick={() => {
              dispatch<OnClickPTitleEditBtnAction>({
                type: 'informExhibitInfoPage/onClickPTitleEditBtn',
              });
            }}><FEdit /></a>
          </Space>)
          : (<>
            <FInput
              className={styles.FInput}
              value={informExhibitInfoPage.side_Exhibit_InputTitle || ''}
              onChange={(e) => {
                dispatch<OnChangePTitleInputAction>({
                  type: 'informExhibitInfoPage/onChangePTitleInput',
                  payload: {
                    value: e.target.value,
                  },
                });
              }}
            />
            <div style={{ height: 10 }} />
            <div className={styles.btn}>
              <FTextBtn
                type='default'
                onClick={() => {
                  dispatch<OnClickPTitleCancelBtnAction>({
                    type: 'informExhibitInfoPage/onClickPTitleCancelBtn',
                  });
                }}
              >取消</FTextBtn>
              <div style={{ width: 15 }} />
              <FRectBtn
                size='small'
                onClick={async () => {
                  dispatch<OnClickPTitleConfirmBtnAction>({
                    type: 'informExhibitInfoPage/onClickPTitleConfirmBtn',
                  });
                }}
                type='primary'
              >确定</FRectBtn>
            </div>

          </>)
      }
      <div style={{ height: 30 }} />

      <FTitleText
        text={'展品标签'}
        type='h4'
      />

      <div style={{ height: 15 }} />

      <FLabelEditor
        values={informExhibitInfoPage.side_Exhibit_Tags as string[]}
        onChange={async (value) => {
          dispatch<OnChangePLabelsAction>({
            type: 'informExhibitInfoPage/onChangePLabels',
            payload: {
              value: value,
            },
          });
        }}
      />

      <div
        style={{ height: 30 }}
      />
    </>
  );
}

export default connect(({ informExhibitInfoPage }: ConnectState) => ({
  informExhibitInfoPage,
}))(Info);
