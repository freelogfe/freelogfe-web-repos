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
import {FTextButton} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceInfoPageModelState} from '@/models/connect';
import {
  OnChangeCoverAction,
  OnChangeEditorAction,
  OnChangeIsEditingAction,
  OnChangeLabelsAction
} from "@/models/resourceInfoPage";

interface InfoProps {
  dispatch: Dispatch;
  resource: ResourceInfoPageModelState,
}

function Info({dispatch, resource: {info, isEditing, editor, cover, labels}}: InfoProps) {
  function onChangeIsEditing(bool: boolean) {
    dispatch<OnChangeIsEditingAction>({
      type: 'resourceInfoPage/onChangeIsEditing',
      payload: bool
    });
  }

  return (<FInfoLayout>
    <FContentLayout header={<FTitleText text={'资源信息'} type={'h2'}/>}>
      <FEditorCard title={'资源名称'}>
        <FContentText text={info.name}/>
      </FEditorCard>
      <FEditorCard title={'资源类型'}>
        <FContentText text={info.resourceType}/>
      </FEditorCard>
      <FEditorCard title={'基础上抛'}>
        <div className={styles.upthrow}>
          {
            info.upthrows.map((i) => <label key={i}>{i}</label>)
          }
        </div>
      </FEditorCard>
      <FEditorCard title={'资源简介'}>
        <FHorn className={styles.about} extra={<>
          {isEditing
            ? (<Space size={10}><FTextButton onClick={() => onChangeIsEditing(false)}>取消</FTextButton><FTextButton
              theme="primary">保存</FTextButton></Space>)
            : <FTextButton
              theme="primary"
              onClick={() => onChangeIsEditing(true)}
            >编辑</FTextButton>}
        </>}>

          {isEditing
            ? (<FIntroductionEditor value={editor} onChange={(e) => dispatch<OnChangeEditorAction>({
              type: 'resourceInfoPage/onChangeEditor',
              payload: e.target.value,
            })}/>)
            : (<div className={styles.aboutPanel}>
              <FContentText text={info.introduction}/>
            </div>)}
        </FHorn>
      </FEditorCard>
      <FEditorCard title={'资源封面'}>
        <FUploadResourceCover
          value={cover}
          onChange={(value) => dispatch<OnChangeCoverAction>({
            type: 'resourceInfoPage/onChangeCover',
            payload: value,
          })}
        />
      </FEditorCard>
      <FEditorCard title={'资源标签'}>
        <FLabelEditor
          value={labels}
          onChange={(value) => dispatch<OnChangeLabelsAction>({
            type: 'resourceInfoPage/onChangeLabels',
            payload: value,
          })}
        />
      </FEditorCard>
    </FContentLayout>
  </FInfoLayout>)
}

export default connect(({resourceInfoPage}: ConnectState) => ({
  resource: resourceInfoPage,
}))(Info);
