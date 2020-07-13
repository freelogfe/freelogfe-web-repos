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
import {Space} from 'antd';
import {ResourceCreatorPageModelState} from "@/models/resourceCreatorPage";
import {connect, Dispatch} from "dva";
import {ConnectState, ResourcePageModelState} from "@/models/connect";

const resourceType = [
  {
    value: 1,
    title: 'image',
  },
  {
    value: 2,
    title: 'zip',
  },
];

interface ResourceCreatorProps {
  dispatch: Dispatch;
  resource: ResourceCreatorPageModelState;
}

function ResourceCreator({dispatch, resource}: ResourceCreatorProps) {
  return (<FLayout>
    <FContentLayout header={<Header/>}>
      <div className={styles.workspace}>
        <FEditorCard title={'资源名称'} dot={true}>
          <div className={styles.resourceName}>
            <FContentText text={'yanghongtian /'}/>
            &nbsp;
            <FInput
              value={resource.name}
              className={styles.FInput}
              placeholder={'输入资源名称'}
              suffix={<span className={styles.FInputWordCount}>40</span>}
            />
          </div>
        </FEditorCard>

        <FEditorCard title={'资源类型'} dot={true}>
          <FSelect className={styles.FSelect} dataSource={resourceType} value={1}/>
        </FEditorCard>

        <FEditorCard title={'资源简介'}>
          <FIntroductionEditor/>
        </FEditorCard>

        <FEditorCard title={'资源封面'}>
          <FUploadResourceCover/>
        </FEditorCard>

        <FEditorCard title={'资源标签'}>
          <FLabelEditor/>
        </FEditorCard>
      </div>
    </FContentLayout>
  </FLayout>);
}

function Header() {
  return (<div className={styles.Header}>
    <FTitleText text={'创建资源'} type={'h2'}/>

    <Space size={30}>
      <FTextButton>暂存草稿</FTextButton>
      <FNormalButton style={{width: 108}}>创建</FNormalButton>
    </Space>
  </div>);
}

export default connect(({resourceCreatorPage}: ConnectState) => ({
  resource: resourceCreatorPage,
}))(ResourceCreator);
