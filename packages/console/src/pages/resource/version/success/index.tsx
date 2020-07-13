import * as React from 'react';
import styles from './index.less';
import FLayout from '@/layouts/FLayout';
import {FTipText} from '@/components/FText';
import {FTextButton} from '@/components/FButton';

export default function () {
  return (<FLayout>
    <div style={{height: 100}}/>
    <div className={styles.modal}>
      <i className={'freelog fl-icon-shenqingchenggong'}/>
      <div style={{height: 20}}/>
      <FTipText type={'secondary'} text={'版本 10.5.2 创建成功'}/>
      <div style={{height: 40}}/>
      <div className={styles.goto}>
        <FTipText type={'modal'} text={'3秒 后跳转至资源信息-最新版本编辑页；'}/>
        <div style={{width: 10}}/>
        <FTextButton theme={'primary'}>立即跳转</FTextButton>
      </div>
    </div>
  </FLayout>)
}
