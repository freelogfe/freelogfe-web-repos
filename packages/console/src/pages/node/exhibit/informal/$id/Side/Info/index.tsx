import * as React from 'react';
import styles from './index.less';
import {
  OnChange_Side_Exhibit_Cover_Action,
  OnChange_Side_Exhibit_Tags_Action,
  OnChangePTitleInputAction,
  OnClick_Side_Exhibit_Title_Action,
  OnClickPTitleCancelBtnAction,
  OnClickPTitleEditBtnAction,
} from '@/models/informExhibitInfoPage';
import { Space } from 'antd';
import FInput from '@/components/FInput';
import FLabelEditor from '@/components/FLabelEditor';
import { connect } from 'dva';
import { Dispatch } from 'redux';
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

  if (informExhibitInfoPage.exhibit_ResourceType.includes('主题')) {
    return null;
  }

  return (<>
      <FComponentsLib.FContentText text={'基础信息'} type='highlight' />
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

      <FComponentsLib.FTitleText
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
              <FComponentsLib.FContentText text={informExhibitInfoPage.side_Exhibit_Title} />
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
              <FComponentsLib.FTextBtn
                type='default'
                onClick={() => {
                  dispatch<OnClickPTitleCancelBtnAction>({
                    type: 'informExhibitInfoPage/onClickPTitleCancelBtn',
                  });
                }}
              >取消</FComponentsLib.FTextBtn>
              <div style={{ width: 15 }} />
              <FComponentsLib.FRectBtn
                size='small'
                onClick={async () => {
                  dispatch<OnClick_Side_Exhibit_Title_Action>({
                    type: 'informExhibitInfoPage/onClick_Side_Exhibit_Title',
                  });
                }}
                type='primary'
              >确定</FComponentsLib.FRectBtn>
            </div>

          </>)
      }
      <div style={{ height: 30 }} />

      <FComponentsLib.FTitleText
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
