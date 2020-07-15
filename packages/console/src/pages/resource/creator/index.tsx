import * as React from 'react';
import styles from './index.less';
import FLayout from '@/layouts/FLayout';
import {FTitleText, FContentText} from '@/components/FText';
import FEditorCard from '@/components/FEditorCard';
import FInput from '@/components/FInput';
import FSelect from '@/components/FSelect';
import {FNormalButton, FTextButton} from '@/components/FButton';
import FLabelEditor from '@/pages/resource/components/FLabelEditor';
import FUploadResourceCover from '@/pages/resource/components/FUploadResourceCover';
import FIntroductionEditor from '@/pages/resource/components/FIntroductionEditor';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';
import {Space, AutoComplete} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceCreatorPageModelState} from '@/models/connect';
import {
  OnChangeCoverAction,
  OnChangeIntroductionAction,
  OnChangeLabelsAction,
  OnChangeNameAction,
  OnChangeResourceTypeAction
} from '@/models/resourceCreatorPage';

interface ResourceCreatorProps {
  dispatch: Dispatch;
  resource: ResourceCreatorPageModelState;
}

const resourceTypes = ['json', 'widget', 'image', 'audio', 'markdown', 'page_build', 'reveal_slide', 'license', 'video', 'catalog'].map((i: string) => ({value: i}));

function ResourceCreator({dispatch, resource}: ResourceCreatorProps) {
  return (<FLayout>
    <FContentLayout header={<Header onClickCache={() => null} onClickCreate={() => null}/>}>
      <div className={styles.workspace}>
        <FEditorCard title={'资源名称'} dot={true}>
          <div className={styles.resourceName}>
            <FContentText text={'yanghongtian /'}/>
            &nbsp;
            <FInput
              value={resource.name}
              onChange={(e) => dispatch<OnChangeNameAction>({
                type: 'resourceCreatorPage/onChangeName',
                payload: e.target.value
              })}
              className={styles.FInput}
              placeholder={'输入资源名称'}
              suffix={<span className={styles.FInputWordCount}>{resource.name.length}</span>}
            />
          </div>
        </FEditorCard>

        <FEditorCard title={'资源类型'} dot={true}>
          <AutoComplete
            value={resource.resourceType}
            onChange={(value) => dispatch<OnChangeResourceTypeAction>({
              type: 'resourceCreatorPage/onChangeResourceType',
              payload: value,
            })}
            className={styles.FSelect}
            placeholder={'资源类型'}
            options={resourceTypes}
          />
        </FEditorCard>

        <FEditorCard title={'资源简介'}>
          <FIntroductionEditor
            value={resource.introduction}
            onChange={(e) => dispatch<OnChangeIntroductionAction>({
              type: 'resourceCreatorPage/onChangeIntroduction',
              payload: e.target.value
            })}
          />
        </FEditorCard>

        <FEditorCard title={'资源封面'}>
          <FUploadResourceCover
            value={resource.cover}
            onChange={(value) => dispatch<OnChangeCoverAction>({
              type: 'resourceCreatorPage/onChangeCover',
              payload: value,
            })}
          />
        </FEditorCard>

        <FEditorCard title={'资源标签'}>
          <FLabelEditor
            value={resource.labels}
            onChange={(value) => dispatch<OnChangeLabelsAction>({
              type: 'resourceCreatorPage/onChangeLabels',
              payload: value
            })}
          />
        </FEditorCard>
      </div>
    </FContentLayout>
  </FLayout>);
}

interface HeaderProps {
  onClickCache: () => void;
  onClickCreate: () => void;
}

function Header({onClickCache, onClickCreate}: HeaderProps) {
  return (<div className={styles.Header}>
    <FTitleText text={'创建资源'} type={'h2'}/>

    <Space size={30}>
      <FTextButton onClick={onClickCache}>暂存草稿</FTextButton>
      <FNormalButton onClick={onClickCreate} style={{width: 108}}>创建</FNormalButton>
    </Space>
  </div>);
}

export default connect(({resourceCreatorPage}: ConnectState) => ({
  resource: resourceCreatorPage,
}))(ResourceCreator);
