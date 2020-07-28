import * as React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import {FTipText} from '@/components/FText';
import {FNormalButton} from '@/components/FButton';
import {withRouter, router} from 'umi';
import RouterTypes from "umi/routerTypes";


interface SuccessProps {
  match: {
    params: {
      id: string;
    };
  };
}

function Success({match}: RouterTypes & SuccessProps) {

  function goto() {
    // /resource/:id/version/creator
    router.replace(`/resource/${match.params.id}/version/creator`)
  }

  return (<FCenterLayout>
    <div style={{height: 100}}/>
    <div className={styles.modal}>
      <i className={'freelog fl-icon-shenqingchenggong'}/>
      <div style={{height: 20}}/>
      <FTipText type={'secondary'} text={'资源创建成功'}/>
      <div style={{height: 40}}/>
      <FTipText type={'modal'} text={'未发行版本的资源，不会出现在资源市场中'}/>
      <div style={{height: 20}}/>
      <FNormalButton onClick={goto}>为资源创建第一个版本</FNormalButton>
    </div>
  </FCenterLayout>)
}

export default withRouter(Success);
