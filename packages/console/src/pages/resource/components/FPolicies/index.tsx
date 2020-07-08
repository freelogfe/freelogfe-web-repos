import * as React from 'react';
import {FTipText} from '@/components/FText';
import {FNormalButton} from '@/components/FButton';

import styles from './index.less';

export default function () {
  return (<div className={styles.FPoliciesStyles}>
    <div className={styles.empty}>
      <FTipText type="secondary" text={'未添加策略的资源不会出现在资源市场中'}/>
      <div style={{height: 20}}/>
      <FNormalButton>立即添加策略</FNormalButton>
    </div>
  </div>);
}
