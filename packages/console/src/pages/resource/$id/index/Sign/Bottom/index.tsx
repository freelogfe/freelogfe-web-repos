import * as React from 'react';
import styles from './index.less';
import {FNormalButton} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketResourcePageModelState} from '@/models/connect';
import {router} from 'umi';
import {ChangeAction} from "@/models/marketResourcePage";
import {exhibitManagement} from "@/utils/path-assembler";
import {FComponent} from "@/components";

interface BottomProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState;
}

function Bottom({dispatch, marketResourcePage}: BottomProps) {

  return (<div className={styles.signBottom}>
    {
      !marketResourcePage.signedNodeIDs.includes(marketResourcePage.selectedNodeID)
        ? (<FNormalButton
          className={styles.signButton}
          disabled={
            marketResourcePage.selectedNodeID === -1
            || marketResourcePage.version === ''
            || marketResourcePage.signResources.map((sr) => sr.policies.filter((srp) => srp.checked).length).includes(0)
          }
          onClick={() => {
            dispatch<ChangeAction>({
              type: 'marketResourcePage/change',
              payload: {
                signExhibitName: marketResourcePage.resourceInfo?.name?.split('/')[1] || '',
                signExhibitNameErrorTip: '',
                isSignPage: true,
              }
            });
          }}
        >签约</FNormalButton>)
        : (<span>该资源已签约，可进入<FComponent.FLink
          to={exhibitManagement({exhibitID: marketResourcePage.signedResourceExhibitId})}
          className={styles.gotoExhibitLink}
        >展品管理</FComponent.FLink>进行授权管理</span>)
    }

  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({
  marketResourcePage,
}))(Bottom);

