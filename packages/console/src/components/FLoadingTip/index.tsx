import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

interface FLoadingTipProps {
  height: number | string;
  // tipText: string;
  // btnText?: string;

  // onClick?(): void;
}

function FLoadingTip({height}: FLoadingTipProps) {
  return (<div
    className={styles.styles}
    style={{height}}
  >
    <div/>
    <div>
      <FComponentsLib.FIcons.FLoading className={styles.icon}/>
    </div>
    <div/>
  </div>);
}

export default FLoadingTip;
