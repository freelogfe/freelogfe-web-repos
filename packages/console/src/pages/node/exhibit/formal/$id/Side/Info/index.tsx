import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from "@/components/FText";
import FUploadImage from "@/components/FUploadImage";
import {ChangeAction, ExhibitInfoPageModelState, UpdateBaseInfoAction} from "@/models/exhibitInfoPage";
import * as imgSrc from "@/assets/default-resource-cover.jpg";
import {FEdit} from "@/components/FIcons";
import {Space} from "antd";
import FInput from "@/components/FInput";
import {FRectBtn, FTextBtn} from "@/components/FButton";
import FLabelEditor from "@/pages/resource/components/FLabelEditor";
import {connect, Dispatch} from 'dva';
import {ConnectState} from "@/models/connect";
import fMessage from "@/components/fMessage";
import FTooltip from "@/components/FTooltip";

interface InfoProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Info({dispatch, exhibitInfoPage}: InfoProps) {
  function onChangePInputTitle(value: string | null) {
    dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload: {
        pInputTitle: value,
      },
    });
  }

  if (exhibitInfoPage.resourceType === 'theme') {
    return null;
  }

  return (<>
    <FContentText text={'基础信息'} type="highlight"/>
    <div style={{height: 20}}/>

    <FUploadImage
      onError={(err) => {
        fMessage(err, 'error');
      }}
      onUploadSuccess={(url: string) => {
        console.log(url, 'url@#$!@#$@#@#$@#');
        dispatch<UpdateBaseInfoAction>({
          type: 'exhibitInfoPage/updateBaseInfo',
          payload: {
            pCover: url,
          },
        })
      }}>
      <div className={styles.cover}>
        <img
          alt=""
          src={exhibitInfoPage.pCover || imgSrc}
        />
        <div>

          <FEdit style={{fontSize: 32}}/>
          <div style={{height: 10}}/>
          <div>修改封面</div>
        </div>
      </div>
    </FUploadImage>

    <div style={{height: 20}}/>

    <FTitleText text={'展品标题'} type="h4"/>
    <div style={{height: 15}}/>
    {
      exhibitInfoPage.pInputTitle === null
        ? (<Space size={10}>
          <FContentText text={exhibitInfoPage.pTitle}/>
          <FTooltip title={'编辑'}>
            <div>
              <FTextBtn onClick={() => onChangePInputTitle(exhibitInfoPage.pTitle)}><FEdit/></FTextBtn>
            </div>
          </FTooltip>
        </Space>)
        : (<>
          <FInput
            className={styles.Input}
            value={exhibitInfoPage.pInputTitle || ''}
            onChange={(e) => onChangePInputTitle(e.target.value)}
          />
          <div style={{height: 10}}/>
          <div className={styles.btn}>
            <FTextBtn
              type="default"
              // size="small"
              onClick={() => onChangePInputTitle(null)}
            >取消</FTextBtn>
            <div style={{width: 15}}/>
            <FRectBtn
              size="small"
              onClick={() => {
                dispatch<UpdateBaseInfoAction>({
                  type: 'exhibitInfoPage/updateBaseInfo',
                  payload: {
                    pTitle: exhibitInfoPage.pInputTitle || '',
                  },
                });
                onChangePInputTitle(null);
              }}
            >确定</FRectBtn>
          </div>

        </>)
    }
    <div style={{height: 30}}/>

    <FTitleText text={'展品标签'} type="h4"/>
    <div style={{height: 15}}/>
    <FLabelEditor
      values={exhibitInfoPage.pTags as string[]}
      onChange={(value) => {
        dispatch<UpdateBaseInfoAction>({
          type: 'exhibitInfoPage/updateBaseInfo',
          payload: {
            pTags: value,
          },
        });
      }}
    />
    <div style={{height: 30}}/>
  </>);
}

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Info);
