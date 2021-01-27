import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from "@/components/FText";
import FUploadImage from "@/components/FUploadImage";
import {ChangeAction, UpdateBaseInfoAction} from "@/models/informExhibitInfoPage";
import * as imgSrc from "@/assets/default-resource-cover.jpg";
import {FEdit} from "@/components/FIcons";
import {Space} from "antd";
import FInput from "@/components/FInput";
import {FNormalButton, FTextButton} from "@/components/FButton";
import FLabelEditor from "@/pages/resource/components/FLabelEditor";
import {connect, Dispatch} from 'dva';
import {ConnectState, InformExhibitInfoPageModelState} from "@/models/connect";

interface InfoProps {
  dispatch: Dispatch;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
}

function Info({dispatch, informExhibitInfoPage}: InfoProps) {
  function onChangePInputTitle(value: string | null) {
    dispatch<ChangeAction>({
      type: 'informExhibitInfoPage/change',
      payload: {
        pInputTitle: value,
      },
    });
  }

  if (informExhibitInfoPage.resourceType === 'theme') {
    return null;
  }

  return (<>
    <FTitleText text={'基础信息'} type="h4"/>
    <div style={{height: 20}}/>

    <FUploadImage
      onUploadSuccess={(url: string) => dispatch<UpdateBaseInfoAction>({
        type: 'informExhibitInfoPage/updateBaseInfo',
        payload: {
          pCover: url,
        },
      })}>
      <div className={styles.cover}>
        <img
          alt=""
          src={informExhibitInfoPage.pCover || imgSrc}
        />
        <div>
          <FEdit style={{fontSize: 32}}/>
          <div style={{height: 10}}/>
          <div>修改封面</div>
        </div>
      </div>
    </FUploadImage>

    <div style={{height: 20}}/>

    <FTitleText text={'展品标题'} type="form"/>
    <div style={{height: 15}}/>
    {
      informExhibitInfoPage.pInputTitle === null
        ? (<Space size={10}>
          <FContentText text={informExhibitInfoPage.pTitle}/>
          <a onClick={() => onChangePInputTitle(informExhibitInfoPage.pTitle)}><FEdit/></a>
        </Space>)
        : (<>
          <FInput
            className={styles.Input}
            value={informExhibitInfoPage.pInputTitle || ''}
            onChange={(e) => onChangePInputTitle(e.target.value)}
          />
          <div style={{height: 10}}/>
          <div className={styles.btn}>
            <FTextButton
              size="small"
              onClick={() => onChangePInputTitle(null)}
            >取消</FTextButton>
            <div style={{width: 15}}/>
            <FNormalButton
              size="small"
              onClick={() => {
                dispatch<UpdateBaseInfoAction>({
                  type: 'informExhibitInfoPage/updateBaseInfo',
                  payload: {
                    pTitle: informExhibitInfoPage.pInputTitle || '',
                  },
                });
                onChangePInputTitle(null);
              }}
            >确定</FNormalButton>
          </div>

        </>)
    }
    <div style={{height: 30}}/>

    <FTitleText text={'展品标签'} type="form"/>
    <div style={{height: 15}}/>
    <FLabelEditor
      values={informExhibitInfoPage.pTags}
      onChange={(value) => {
        dispatch<UpdateBaseInfoAction>({
          type: 'informExhibitInfoPage/updateBaseInfo',
          payload: {
            pTags: value,
          },
        });
      }}
    />
    <div style={{height: 30}}/>
  </>);
}

export default connect(({informExhibitInfoPage}: ConnectState) => ({
  informExhibitInfoPage,
}))(Info);
