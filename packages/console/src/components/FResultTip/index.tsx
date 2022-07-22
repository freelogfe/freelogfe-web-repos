import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

interface FResultTipProps {
  h1: string;
  h2?: string;
  btnText?: string;

  onClickBtn?(): void;
}

function FResultTip({ h1, h2, btnText, onClickBtn }: FResultTipProps) {

  const h1Text: string[] = h1.split('\n');
  const h2Text: string[] = h2?.split('\n') || [];

  return (<div className={styles.modal}>

    {
      h1Text.map((h, i) => {
        return (<FComponentsLib.FTipText key={i} type='first' text={h} />);
      })
    }

    {
      h2Text.length > 0 && (<>
        <div style={{ height: 30 }} />
        {
          h2Text.map((h, i) => {
            return (<FComponentsLib.FTipText key={i} type='second' text={h} />);
          })
        }
      </>)
    }

    {
      btnText && (<>
        <div style={{ height: 30 }} />
        <FComponentsLib.FRectBtn
          className={styles.btn}
          size='large'
          onClick={() => {
            onClickBtn && onClickBtn();
          }}
        >{btnText}</FComponentsLib.FRectBtn>
      </>)
    }

  </div>);
}

export default FResultTip;
