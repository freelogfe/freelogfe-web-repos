import * as React from 'react';
import styles from './index.less';
import {FNormalButton, FTextButton} from '@/components/FButton';
import {router} from 'umi';
import FLeft from '@/components/FIcons/FLeft';
import {connect, Dispatch} from 'dva';
import {SignContractAction} from "@/models/marketResourcePage";

interface FixedFooterProps {
  dispatch: Dispatch;
}

function FixedFooter({dispatch}: FixedFooterProps) {
  return (<div className={styles.footer}>
    <div>
      <FTextButton onClick={() => router.goBack()}>
        <FLeft/>
        <>返回上一步</>
      </FTextButton>
      <div style={{width: 30}}/>
      <FNormalButton onClick={() => dispatch<SignContractAction>({
        type: 'marketResourcePage/signContract',
      })}>确认签约</FNormalButton>
    </div>
  </div>);
}

export default connect()(FixedFooter);
