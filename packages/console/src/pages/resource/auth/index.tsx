import * as React from 'react';

import styles from './index.less';
import FInfoLayout from '@/pages/resource/layouts/FInfoLayout';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';
import {FTitleText} from '@/components/FText';
import FEditorCard from '@/components/FEditorCard';

export default function () {
  return (<FInfoLayout>
    <FContentLayout header={<FTitleText text={'授权信息'} type={'h2'}/>}>
      <FEditorCard title={'授权策略'}>
        授权策略
      </FEditorCard>
      <FEditorCard title={'被授权合约'}>
        被授权合约
      </FEditorCard>
      <FEditorCard title={'授权合约'}>
        授权合约
      </FEditorCard>
    </FContentLayout>
  </FInfoLayout>);
}
