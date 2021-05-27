import * as React from 'react';
import styles from './index.less';
import {FTipText, FTitleText} from '@/components/FText';
import {FRectBtn} from '@/components/FButton';
interface WalletProps {

}

function Wallet({}: WalletProps) {
  return (<div className={styles.styles}>
    <div style={{height: 40}}/>
    <FTitleText type="h1" text={'羽币账户'}/>
    <div style={{height: 20}}/>
    <div className={styles.Inactive}>
      <FTipText text={'账户未激活，激活后可获得 100 枚羽币'} type="second"/>
      <div style={{width: 30}}/>
      <FRectBtn type="primary">激活账户</FRectBtn>
    </div>
  </div>);
}

export default Wallet;
