import * as React from 'react';
import styles from './index.less';
import { FRectBtn } from '@/components/FButton';
import { connect, Dispatch } from 'dva';
import { ConnectState, MarketResourcePageModelState } from '@/models/connect';
import { OnClick_SignBtn_Action } from '@/models/marketResourcePage';
import FLink from '@/components/FLink';
import { FUtil } from '@freelog/tools-lib';

interface BottomProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState;
}

function Bottom({ dispatch, marketResourcePage }: BottomProps) {

  return (<div className={styles.signBottom}>
    {
      !marketResourcePage.signedNodeIDs.includes(marketResourcePage.selectedNodeID)
        ? (<FRectBtn
          className={styles.signButton}
          disabled={
            marketResourcePage.selectedNodeID === -1
            || marketResourcePage.version === ''
            || marketResourcePage.signResources.map((sr) => {
              return sr.policies.filter((srp) => srp.checked).length + sr.contracts.filter((srp) => srp.checked).length;
            }).includes(0)
            // || !!marketResourcePage.signResources.find((sr) => {
            //   return sr.status === 0;
            // })
          }
          onClick={async () => {
            dispatch<OnClick_SignBtn_Action>({
              type: 'marketResourcePage/onClick_SignBtn',
            });
          }}
        >立即签约</FRectBtn>)
        : (<span>该资源已签约，可进入<FLink
          to={FUtil.LinkTo.exhibitManagement({ exhibitID: marketResourcePage.signedResourceExhibitID })}
          className={styles.gotoExhibitLink}
        >展品管理</FLink>进行授权管理</span>)
    }

  </div>);
}

export default connect(({ marketResourcePage }: ConnectState) => ({
  marketResourcePage,
}))(Bottom);


