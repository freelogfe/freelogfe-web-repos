import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
// import FUploadImage from '@/components/FUploadImage';
import {
  // ChangeAction,
  OnChange_Side_Exhibit_Cover_Action, OnChange_Side_Exhibit_Tags_Action,
  OnChangePTitleInputAction,
  OnClick_Side_Exhibit_Title_Action,
  OnClickPTitleCancelBtnAction,
  OnClickPTitleEditBtnAction,
} from '@/models/informExhibitInfoPage';
import { FEdit } from '@/components/FIcons';
import { Space } from 'antd';
import FInput from '@/components/FInput';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import FLabelEditor from '@/pages/resource/components/FLabelEditor';
import { connect, Dispatch } from 'dva';
import { ConnectState, InformExhibitInfoPageModelState } from '@/models/connect';
import fMessage from '@/components/fMessage';
import FCoverImage from '@/components/FCoverImage';
import FUploadCover from '@/components/FUploadCover';
import FComponentsLib from '@freelog/components-lib';

interface InfoProps {
  dispatch: Dispatch;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
}

function Info({ dispatch, informExhibitInfoPage }: InfoProps) {

  if (informExhibitInfoPage.exhibit_ResourceType === 'theme') {
    return null;
  }

  return (<>
      <FContentText text={'基础信息'} type='highlight' />
      <div style={{ height: 20 }} />

      <FUploadCover
        onError={(err) => {
          fMessage(err, 'error');
        }}
        onUploadSuccess={async (url: string) => {
          dispatch<OnChange_Side_Exhibit_Cover_Action>({
            type: 'informExhibitInfoPage/onChange_Side_Exhibit_Cover',
            payload: {
              value: url,
            },
          });
        }}>
        <div className={styles.cover}>
          <FCoverImage src={informExhibitInfoPage.side_Exhibit_Cover || ''} width={220} style={{ borderRadius: 10 }} />
          <div className={styles.coverEdit}>
            <FComponentsLib.FIcons.FEdit style={{ fontSize: 32 }} />
            <div style={{ height: 10 }} />
            <div>修改封面</div>
          </div>
        </div>
      </FUploadCover>

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
            }}><FComponentsLib.FIcons.FEdit /></a>
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
                  dispatch<OnClick_Side_Exhibit_Title_Action>({
                    type: 'informExhibitInfoPage/onClick_Side_Exhibit_Title',
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
          dispatch<OnChange_Side_Exhibit_Tags_Action>({
            type: 'informExhibitInfoPage/onChange_Side_Exhibit_Tags',
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
