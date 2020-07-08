import * as React from 'react';
import styles from './index.less';
import FLayout from '@/layouts/FLayout';
import {FTitleText, FContentText} from '@/components/FText';
import FEditorCard from '@/components/FEditorCard';
import FInput from '@/components/FInput';
import FSelect from '@/components/FSelect';
import FLabelEditor from '@/pages/resource/components/FLabelEditor';
import FUploadResourceCover from '@/pages/resource/components/FUploadResourceCover';
import FIntroductionEditor from '@/pages/resource/components/FIntroductionEditor';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';

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

export default function () {
  return (<FLayout>
    {/*<div style={{height: 36}}/>*/}
    {/*<FTitleText text={'创建资源'} type={'h2'}/>*/}
    {/*<div style={{height: 36}}/>*/}
    <FContentLayout header={<FTitleText text={'创建资源'} type={'h2'}/>}>
      <div className={styles.workspace}>
        <FEditorCard title={'资源名称'} dot={true}>
          <div className={styles.resourceName}>
            <FContentText text={'yanghongtian /'}/>
            &nbsp;
            <FInput
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
