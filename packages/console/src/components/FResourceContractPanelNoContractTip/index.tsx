import * as React from 'react';
import styles from './index.less';
// import { FWarning } from '@/components/FIcons';
import FComponentsLib from '@freelog/components-lib';

interface FResourceContractPanelNoContractTipProps {

}

function FResourceContractPanelNoContractTip({}: FResourceContractPanelNoContractTipProps) {
  return (<div className={styles.withoutValidContract}>
    <FComponentsLib.FIcons.FWarning style={{ fontSize: 14 }} />
    <span style={{ paddingLeft: 5 }}>当前授权链上无有效合约</span>
  </div>);
}

export default FResourceContractPanelNoContractTip;
