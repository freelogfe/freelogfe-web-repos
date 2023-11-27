import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorBatchPageState } from '@/models/connect';
import ResourceType from './ResourceType';
import UploadFile from './UploadFile';
import ResourceList from './ResourceList';
import Finish from './Finish';

interface CreatorBatchProps {
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
}

function CreatorBatch({ resourceCreatorBatchPage }: CreatorBatchProps) {

  if (resourceCreatorBatchPage.showPage === 'resourceType') {
    return (<ResourceType />);
  }


  if (resourceCreatorBatchPage.showPage === 'uploadFile') {
    return (<UploadFile />);
  }

  if (resourceCreatorBatchPage.showPage === 'resourceList') {
    return (<ResourceList />);
  }

  return <Finish />;
}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(CreatorBatch);
