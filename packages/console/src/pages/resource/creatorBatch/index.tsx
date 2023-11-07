import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import FResourceTypeInput from '@/components/FResourceTypeInput';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorBatchPageState } from '@/models/connect';
import fObjectSelectorDrawer from '@/components/fObjectSelectorDrawer';
import fMessage from '@/components/fMessage';
import { Space } from 'antd';
import ResourceType from './ResourceType';
import UploadFile from './UploadFile';
import ResourceList from './ResourceList';

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

  return (<ResourceList />);

}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(CreatorBatch);
