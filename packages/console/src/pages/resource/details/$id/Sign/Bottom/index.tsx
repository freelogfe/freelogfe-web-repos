import * as React from 'react';
import styles from './index.less';
import { FRectBtn } from '@/components/FButton';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceDetailPageModelState } from '@/models/connect';
import { OnClick_SignBtn_Action } from '@/models/resourceDetailPage';
import FLink from '@/components/FLink';
import { FUtil } from '@freelog/tools-lib';

interface BottomProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState;
}

function Bottom({ dispatch, resourceDetailPage }: BottomProps) {

  return (<div className={styles.signBottom}>
    {
      !resourceDetailPage.sign_SignedNodeIDs.includes(resourceDetailPage.sign_SelectedNodeID)
        ? (<FRectBtn
          className={styles.signButton}
          disabled={
            resourceDetailPage.sign_SelectedNodeID === -1
            || resourceDetailPage.version === ''
            || resourceDetailPage.sign_SignResources.map((sr) => {
              return sr.policies.filter((srp) => srp.checked).length + sr.contracts.filter((srp) => srp.checked).length;
            }).includes(0)
            // || !!marketResourcePage.signResources.find((sr) => {
            //   return sr.status === 0;
            // })
          }
          onClick={async () => {
            dispatch<OnClick_SignBtn_Action>({
              type: 'resourceDetailPage/onClick_SignBtn',
            });
          }}
        >立即签约</FRectBtn>)
        : (<span>该资源已签约，可进入<FLink
          to={FUtil.LinkTo.exhibitManagement({ exhibitID: resourceDetailPage.sign_SignedResourceExhibitID })}
          className={styles.gotoExhibitLink}
        >展品管理</FLink>进行授权管理</span>)
    }

  </div>);
}

export default connect(({ resourceDetailPage }: ConnectState) => ({
  resourceDetailPage,
}))(Bottom);


