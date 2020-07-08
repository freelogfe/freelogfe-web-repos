import * as React from 'react';

import styles from './index.less';
import FInfoLayout from '@/pages/resource/layouts/FInfoLayout';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';
import {FTitleText} from '@/components/FText';

export default function () {
  return (<FInfoLayout>
    <FContentLayout header={<FTitleText text={'授权信息'} type={'h2'}/>}>
      1234
    </FContentLayout>
  </FInfoLayout>);
}
