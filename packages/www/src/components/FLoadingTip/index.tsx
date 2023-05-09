import * as React from 'react';
import styles from './index.less';
// import {FLoading} from "../FIcons";

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
      {/* <FLoading className={styles.icon}/> */}
    </div>
    <div/>
  </div>);
}

export default FLoadingTip;
