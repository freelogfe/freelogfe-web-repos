import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

interface PolicyTemplatesProps {

}

function PolicyTemplates() {
  return (<div className={styles.policyTemplates}>
    <a className={styles.policyTemplate}>
      <FComponentsLib.FTitleText text={'免费试用后订阅'} type={'h1'} />
      <div style={{ height: 15 }} />
      <FComponentsLib.FContentText text={'公开（所有缔约方可签约）'} />
      <FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'} />
      <FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'} />
    </a>
    <a className={styles.policyTemplate}>
      <FComponentsLib.FTitleText text={'免费试用后订阅'} type={'h1'} />
      <div style={{ height: 15 }} />
      <FComponentsLib.FContentText text={'公开（所有缔约方可签约）'} />
      <FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'} />
      {/*<FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'}/>*/}
    </a>
    <a className={styles.policyTemplate}>
      <FComponentsLib.FTitleText text={'免费试用后订阅'} type={'h1'} />
      <div style={{ height: 15 }} />
      <FComponentsLib.FContentText text={'公开（所有缔约方可签约）'} />
      <FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'} />
      {/*<FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'}/>*/}
    </a>
    <a className={styles.policyTemplate}>
      <FComponentsLib.FTitleText text={'免费试用后订阅'} type={'h1'} />
      <div style={{ height: 15 }} />
      <FComponentsLib.FContentText text={'公开（所有缔约方可签约）'} />
      <FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'} />
      <FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'} />
    </a>
  </div>);
}

export default PolicyTemplates;
