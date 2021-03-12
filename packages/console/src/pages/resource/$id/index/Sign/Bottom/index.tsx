import * as React from 'react';
import styles from './index.less';
import {FNormalButton} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ConnectState, MarketResourcePageModelState} from '@/models/connect';
import {router} from 'umi';
import {ChangeAction} from "@/models/marketResourcePage";
import {exhibitManagement} from "@/utils/path-assembler";
import {FComponent} from "@/components";
import {FApiServer} from "@/services";
import FLink from "@/components/FLink";

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
          onClick={async () => {
            const signExhibitName: string = await getAvailableExhibitName({
              nodeID: marketResourcePage.selectedNodeID,
              exhibitName: marketResourcePage.resourceInfo?.name.split('/')[1] || '',
            });
            await dispatch<ChangeAction>({
              type: 'marketResourcePage/change',
              payload: {
                signExhibitName: signExhibitName,
                signExhibitNameErrorTip: '',
                isSignPage: true,
              }
            });
          }}
        >签约</FNormalButton>)
        : (<span>该资源已签约，可进入<FLink
          to={exhibitManagement({exhibitID: marketResourcePage.signedResourceExhibitId})}
          className={styles.gotoExhibitLink}
        >展品管理</FLink>进行授权管理</span>)
    }

  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({
  marketResourcePage,
}))(Bottom);

interface GetAvailableExhibitNameParamType {
  nodeID: number;
  exhibitName: string;
  suffixNum?: number;
}

async function getAvailableExhibitName({nodeID, exhibitName, suffixNum = 0}: GetAvailableExhibitNameParamType): Promise<string> {
  const name: string = exhibitName + (suffixNum ? `_${suffixNum}` : '');
  const params: Parameters<typeof FApiServer.Exhibit.presentableDetails>[0] = {
    nodeId: nodeID,
    presentableName: name,
  };
  const {data} = await FApiServer.Exhibit.presentableDetails(params);
  if (data) {
    return await getAvailableExhibitName({
      nodeID,
      exhibitName,
      suffixNum: suffixNum + 1,
    });
  }

  return name;
}
