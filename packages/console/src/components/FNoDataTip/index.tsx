import * as React from 'react';
import styles from './index.less';
import {FTipText} from "../FText";
import {FRectBtn} from "../FButton";

interface FNoDataTipProps {
  height: number | string;
  tipText: string;
  btnText?: string;
  btn?: React.ReactNode;

  onClick?(): void;
}

function FNoDataTip({height, tipText, btnText, btn, onClick}: FNoDataTipProps) {
  return (<div
    className={styles.noData}
    style={{height}}
  >
    <div/>
    <div>
      <FTipText
        type="first"
        text={tipText}
      />

      {
        btnText && (<>
          <div style={{height: 30}}/>
          <FRectBtn
            className={styles.btn}
            onClick={() => onClick && onClick()}
          >{btnText}</FRectBtn>
        </>)
      }

      {
        btn && (<>
          <div style={{height: 30}}/>
          {btn}
        </>)
      }
    </div>
    <div/>
  </div>);
}

export default FNoDataTip;
