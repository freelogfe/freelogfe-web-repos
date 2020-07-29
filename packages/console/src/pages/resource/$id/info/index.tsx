import * as React from 'react';
import styles from './index.less';
import FEditorCard from '@/components/FEditorCard';
import {FContentText, FTitleText} from '@/components/FText';
import {Space} from 'antd';
import FLabelEditor from '@/pages/resource/components/FLabelEditor';
import FUploadResourceCover from '@/pages/resource/components/FUploadResourceCover';
import FIntroductionEditor from '@/pages/resource/components/FIntroductionEditor';
import FInfoLayout from '@/pages/resource/layouts/FInfoLayout';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';
import FHorn from '@/pages/resource/components/FHorn';
import {FCircleButton, FTextButton} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceInfoModelState, ResourceInfoPageModelState} from '@/models/connect';
import {
  // OnChangeCoverAction,
  OnChangeEditorAction, OnChangeInfoAction,
  OnChangeIsEditingAction,
  // OnChangeLabelsAction
} from "@/models/resourceInfoPage";

interface InfoProps {
  dispatch: Dispatch;
  resourceInfo: ResourceInfoModelState,
  resourceInfoPage: ResourceInfoPageModelState,
}

function Info({dispatch, resourceInfoPage, resourceInfo: {info}}: InfoProps) {

  // React.useEffect(() => {
  //   dispatch<OnChangeEditorAction>({
  //     type: 'resourceInfoPage/onChangeEditor',
  //     payload: info?.intro,
  //   })
  // },[]);
  const [editorText, setEditorText] = React.useState<string>('');
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  React.useEffect(() => {
    // console.log(info?.intro, 'info?.intro');
    setEditorText(info?.intro || '');
  }, [info]);

  function onChangeIsEditing(bool: boolean) {
    // dispatch<OnChangeIsEditingAction>({
    //   type: 'resourceInfoPage/onChangeIsEditing',
    //   payload: bool
    // });
    setIsEditing(bool)
  }

  return (<FInfoLayout>
    {info && <FContentLayout header={<FTitleText text={'资源信息'} type={'h2'}/>}>
      <FEditorCard title={'资源名称'}>
        <FContentText text={info?.resourceName}/>
      </FEditorCard>
      <FEditorCard title={'资源类型'}>
        <FContentText text={info.resourceType}/>
      </FEditorCard>
      {info?.baseUpcastResources.length > 0 && <FEditorCard title={'基础上抛'}>
        <div className={styles.upthrow}>
          {
            info?.baseUpcastResources.map((i) => <label key={i.resourceId}>{i.resourceName}</label>)
          }
        </div>
      </FEditorCard>}
      <FEditorCard title={'资源简介'}>

        {!info?.intro && !resourceInfoPage.isEditing && (<Space size={10}>
          <FCircleButton
            onClick={() => onChangeIsEditing(true)}
            theme="weaken"
          />
          <FContentText text={'添加'}/>
        </Space>)}

        <FHorn className={styles.about} extra={<>
          {isEditing
            ? (<Space size={10}>
              <FTextButton
                onClick={() => onChangeIsEditing(false)}
              >取消</FTextButton>
              <FTextButton
                theme="primary"
                onClick={() => {
                  onChangeIsEditing(false);
                  dispatch<OnChangeInfoAction>({
                    type: 'resourceInfoPage/onChangeInfo',
                    // payload: {intro: resourceInfoPage.editor},
                    payload: {intro: editorText},
                    id: info?.resourceId,
                  });
                }}
              >保存</FTextButton>
            </Space>)
            : info?.intro ? <FTextButton
              theme="primary"
              onClick={() => onChangeIsEditing(true)}
            >编辑</FTextButton> : null}
        </>}>

          {isEditing
            ? (<FIntroductionEditor
              // value={resourceInfoPage.editor}
              value={editorText}
              // onChange={(e) => dispatch<OnChangeEditorAction>({
              //   type: 'resourceInfoPage/onChangeEditor',
              //   payload: e.target.value,
              // })}
              onChange={(e) => setEditorText(e.target.value)}
              // onBlur={() => onChangeIsEditing(false)}
            />)
            : info?.intro ? (<div className={styles.aboutPanel}>
              <FContentText text={info?.intro}/>
            </div>) : null}
        </FHorn>

      </FEditorCard>
      <FEditorCard title={'资源封面'}>
        <FUploadResourceCover
          value={info?.coverImages.length > 0 ? info?.coverImages[0] : ''}
          // onChange={(value) => dispatch<OnChangeCoverAction>({
          //   type: 'resourceInfoPage/onChangeCover',
          //   payload: value,
          // })}
          onChange={(value) => dispatch<OnChangeInfoAction>({
            type: 'resourceInfoPage/onChangeInfo',
            payload: {coverImages: [value]},
            id: info?.resourceId,
          })}
        />
      </FEditorCard>
      <FEditorCard title={'资源标签'}>
        <FLabelEditor
          values={info?.tags}
          // onChange={(value) => dispatch<OnChangeLabelsAction>({
          //   type: 'resourceInfoPage/onChangeLabels',
          //   payload: value,
          // })}
          onChange={(value) => dispatch<OnChangeInfoAction>({
            type: 'resourceInfoPage/onChangeInfo',
            payload: {tags: value},
            id: info?.resourceId,
          })}
        />
      </FEditorCard>
    </FContentLayout>}
  </FInfoLayout>)
}

export default connect(({resourceInfo, resourceInfoPage}: ConnectState) => ({
  resourceInfo: resourceInfo,
  resourceInfoPage: resourceInfoPage,
}))(Info);
