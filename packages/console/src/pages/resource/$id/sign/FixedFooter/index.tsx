import * as React from 'react';
import styles from './index.less';
import {FNormalButton, FTextButton} from '@/components/FButton';
import {router} from 'umi';
import FLeft from '@/components/FIcons/FLeft';
import {connect, Dispatch} from 'dva';
import {MarketResourcePageModelState, SignContractAction} from "@/models/marketResourcePage";
import {EXHIBIT_NAME} from "@/utils/regexp";
import {ConnectState} from "@/models/connect";

interface FixedFooterProps {
  dispatch: Dispatch;

  marketResourcePage: MarketResourcePageModelState;
}

function FixedFooter({dispatch, marketResourcePage}: FixedFooterProps) {


  return (<div className={styles.footer}>
    <div>
      <FTextButton onClick={() => router.goBack()}>
        <FLeft/>
        <>返回上一步</>
      </FTextButton>
      <div style={{width: 30}}/>
      <FNormalButton
        onClick={() => dispatch<SignContractAction>({
          type: 'marketResourcePage/signContract',
        })}
        // disabled={!EXHIBIT_NAME.test(marketResourcePage.signExhibitName)}
      >确认签约</FNormalButton>
    </div>
  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({
  marketResourcePage,
}))(FixedFooter);
