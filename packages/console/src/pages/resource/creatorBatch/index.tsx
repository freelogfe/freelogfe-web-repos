import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorBatchPageState } from '@/models/connect';
import ResourceType from './ResourceType';
import UploadFile from './UploadFile';
import ResourceList from './ResourceList';
import Finish from './Finish';
import * as AHooks from 'ahooks';
import { Dispatch } from 'redux';
import { OnMount_Page_Action, OnUnmount_Page_Action } from '@/models/resourceCreatorBatchPage';
import { history } from '@@/core/history';
import { OnChange_IsOpenCartoon_Action } from '@/models/resourceVersionCreatorPage';
import FPrompt from '@/components/FPrompt';

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
    <FPrompt
      watch={resourceCreatorBatchPage.resourceListInfo.length > 0}
      messageText={'还没有保存，现在离开会导致信息丢失'}
      onOk={(locationHref) => {
        history.push(locationHref);
      }}
    />

    {
      resourceCreatorBatchPage.showPage === 'resourceType' && (<ResourceType />)
    }

    {
      resourceCreatorBatchPage.showPage === 'uploadFile' && (<UploadFile />)
    }

    {
      resourceCreatorBatchPage.showPage === 'resourceList' && (<ResourceList />)
    }

    {
      resourceCreatorBatchPage.showPage === 'finish' && (<Finish />)
    }

  </>);
}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(CreatorBatch);
