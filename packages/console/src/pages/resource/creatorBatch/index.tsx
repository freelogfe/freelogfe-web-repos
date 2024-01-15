import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorBatchPageState } from '@/models/connect';
import ResourceType from './ResourceType';
import Finish from './Finish';
import * as AHooks from 'ahooks';
import { Dispatch } from 'redux';
import { OnMount_Page_Action, OnUnmount_Page_Action } from '@/models/resourceCreatorBatchPage';
import Handle from '@/pages/resource/creatorBatch/Handle';

interface CreatorBatchProps {
  dispatch: Dispatch;
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
}

function CreatorBatch({ dispatch, resourceCreatorBatchPage }: CreatorBatchProps) {

  AHooks.useMount(() => {
    dispatch<OnMount_Page_Action>({
      type: 'resourceCreatorBatchPage/onMount_Page',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmount_Page_Action>({
      type: 'resourceCreatorBatchPage/onUnmount_Page',
    });
  });

  return (<>

    {
      resourceCreatorBatchPage.showPage === 'resourceType' && (<ResourceType />)
    }

    {
      resourceCreatorBatchPage.showPage === 'uploadFile' && (<Handle />)
    }

    {
      resourceCreatorBatchPage.showPage === 'finish' && (<Finish />)
    }
  </>);
}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(CreatorBatch);
