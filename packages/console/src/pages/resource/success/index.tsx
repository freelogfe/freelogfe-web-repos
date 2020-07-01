import * as React from 'react';
import styles from './index.less';
import FLayout from '@/layouts/FLayout';
import {FTipText} from '@/components/FText';
import {FNormalButton} from '@/components/FButton';

export default function () {
  return (<FLayout>
    <div style={{height: 100}}/>
    <div className={styles.modal}>
      <i className={'freelog fl-icon-shenqingchenggong'}/>
      <div style={{height: 20}}/>
      <FTipText type={'secondary'} text={'资源创建成功'}/>
      <div style={{height: 40}}/>
      <FTipText type={'modal'} text={'未发行版本的资源，不会出现在资源市场中'}/>
      <div style={{height: 20}}/>
      <FNormalButton>为资源创建第一个版本</FNormalButton>
    </div>
    <div style={{height: 100}}/>
  </FLayout>)
}
