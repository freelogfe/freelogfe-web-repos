import * as React from 'react';
import styles from './index.less';
import {FNormalButton} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketResourcePageState} from '@/models/connect';
import {router} from 'umi';
import {ChangeAction} from "@/models/marketResourcePage";

interface BottomProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState;
}

function Bottom({dispatch, marketResourcePage}: BottomProps) {

  return (<div className={styles.signBottom}>
    {
      !marketResourcePage.signedNodeIDs.includes(marketResourcePage.selectedNodeID)
        ? (<FNormalButton
          className={styles.signButton}
          disabled={
            marketResourcePage.selectedNodeID === -1
            || marketResourcePage.signResources.map((sr) => sr.policies.filter((srp) => srp.checked).length).includes(0)
          }
          onClick={() => {
            dispatch<ChangeAction>({
              type: 'marketResourcePage/change',
              payload: {
                signExhibitName: marketResourcePage.resourceInfo?.name?.split('/')[1] || '',
                signExhibitNameErrorTip: '',
              }
            });
            router.push(`/resource/${marketResourcePage.resourceId}/sign`);
          }}
        >签约</FNormalButton>)
        : (<span>该资源已签约，可进入<a onClick={() => router.push(`/node/exhibit/${marketResourcePage.signedResourceExhibitId}`)}>展品管理</a>进行授权管理</span>)
    }

  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({
  marketResourcePage,
}))(Bottom);
