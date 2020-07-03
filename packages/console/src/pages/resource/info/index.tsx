import * as React from 'react';
import styles from './index.less';
import FLayout from '@/layouts/FLayout';
import FResourceCover from '@/components/FResourceCover';
import FEditorCard from '@/components/FEditorCard';
import {FContentText, FTitleText} from '@/components/FText';
import {Space} from 'antd';
import FLabelEditor from '@/pages/resource/components/FLabelEditor';
import FUploadResourceCover from '@/pages/resource/components/FUploadResourceCover';
import FIntroductionEditor from '@/pages/resource/components/FIntroductionEditor';
import FInfoLayout from '@/pages/resource/layouts/FInfoLayout';
import {FTextButton} from '@/components/FButton';

export default function () {
  return (<FInfoLayout>
    <div style={{height: 36}}/>
    <FTitleText text={'资源信息'} type={'h2'}/>
    <div style={{height: 36}}/>
    <div className={styles.content}>
      <FEditorCard title={'资源名称'}>
        <FContentText text={'ww-zh/freelog-waterfall-picture'}/>
      </FEditorCard>
      <FEditorCard title={'资源类型'}>
        <FContentText text={'image'}/>
      </FEditorCard>
      <FEditorCard title={'基础上抛'}>
        <div className={styles.upthrow}>
          <label>ww-zh/PB-markdown</label>
        </div>
      </FEditorCard>
      <FEditorCard title={'资源简介'}>
        <div className={styles.about}>
          <div className={styles.aboutPanelButtons}>
            {/*<FTextButton theme="primary">编辑</FTextButton>*/}
            <Space size={10}><FTextButton>取消</FTextButton><FTextButton theme="primary">保存</FTextButton></Space>
          </div>
          <div className={styles.aboutPanel}>
            <FContentText
              text={'在经济学界中流传着一篇著名的文章，这篇文章用独特的视角把精彩纷呈的社会分工呈现给大众，这篇文章深刻的阐述了高度的专业化如何带来人类总体福祉的提升，这篇文章揭示了自由选择在人类生产创造过程中的重要意义，这篇文章是Leonard E. Read发表于1958年的《我，铅笔》。在这篇不可多得的经济学科普瑰宝中，Read以第一人称视角解构了一支铅笔的生产制作过程，向读者展示了一件简单日用品背后所凝结的深度与广度惊人的人类智慧结晶集合。'}/>
          </div>
          <FIntroductionEditor/>
        </div>
      </FEditorCard>
      <FEditorCard title={'资源封面'}>
        <FUploadResourceCover/>
      </FEditorCard>
      <FEditorCard title={'资源封面'}>
        <FLabelEditor/>
      </FEditorCard>
    </div>
  </FInfoLayout>)
};
