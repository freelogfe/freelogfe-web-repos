import * as React from 'react';

import styles from './index.less';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';
import {FContentText, FTitleText} from '@/components/FText';
import FInfoLayout from '@/pages/resource/layouts/FInfoLayout';
import FEditorCard from '@/components/FEditorCard';
import {FTextButton} from '@/components/FButton';
import {Space} from 'antd';
import {DownloadOutlined} from '@ant-design/icons';

export default function () {
  return (<FInfoLayout>
    <FContentLayout header={<Header/>}>
      <FEditorCard title={'版本描述'}>
        版本描述
      </FEditorCard>
      <FEditorCard title={'相关视图'}>
        相关视图
      </FEditorCard>
      <FEditorCard title={'自定义属性'}>
        自定义属性
      </FEditorCard>
    </FContentLayout>
  </FInfoLayout>);
}

function Header() {
  return (<div className={styles.Header}>
    <FTitleText text={'10.15.4'} type="h2"/>
    <div style={{height: 10}}/>
    <Space size={20}>
      <Space size={40}>
        <FContentText type="additional2" text={'合约ID：adhjtyrghgjhxdfthgasdhdflgkftr'}/>
        <FContentText type="additional2" text={'签约时间：2019-10-10'}/>
      </Space>
      <FTextButton theme="primary"><DownloadOutlined style={{fontSize: 16, fontWeight: 600}}/></FTextButton>
    </Space>
  </div>);
}
