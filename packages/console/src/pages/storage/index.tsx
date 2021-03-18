import * as React from 'react';
import styles from './index.less';
// import FSiderLayout from '@/layouts/FSiderLayout';
import Sider from './Sider';
import Content from './Content';
import NoBucket from './NoBucket';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
// import FContentLayout from '@/layouts/FContentLayout';
import Header from './Header';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageHomePageModelState} from '@/models/connect';
import {OnChangeActivatedBucketAction} from "@/models/storageHomePage";
import {withRouter} from 'umi';
import {RouteComponentProps} from "react-router";
import {ChangeAction, FetchInfoAction, storageObjectEditorInitData} from "@/models/storageObjectEditor";

interface StorageProps extends RouteComponentProps<{}> {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
}

function Storage({match, history, storageHomePage, dispatch}: StorageProps) {

  // console.log(history, 'match@#$RQSfjk908u09ujadsfasd');
  React.useEffect(() => {
    // console.log((history.location as any).query.bucketName, 'history.location.query.bucketName');
    // console.log()
    if (!(history.location as any).query.bucketName) {
      return;
    }
    dispatch<OnChangeActivatedBucketAction>({
      type: 'storageHomePage/onChangeActivatedBucket',
      payload: (history.location as any).query.bucketName,
    });
  }, [(history.location as any).query.bucketName]);

  React.useEffect(() => {
    initObjectDetails();

    return () => {
      dispatch<ChangeAction>({
        type: 'storageObjectEditor/change',
        payload: {
          ...storageObjectEditorInitData,
        }
      });
    };
  }, [(history.location as any).query.objectID]);

  async function initObjectDetails() {
    await dispatch<ChangeAction>({
      type: 'storageObjectEditor/change',
      payload: {objectId: (history.location as any).query.objectID || ''},
    });
    await dispatch<FetchInfoAction>({
      type: 'storageObjectEditor/fetchInfo',
    });
  }

  if (!storageHomePage.bucketList) {
    return null;
  }

  if (storageHomePage.bucketList.length === 0) {
    return (<NoBucket/>);
  }

  return (<FLeftSiderLayout
    // contentClassName={storageHomePage.objectList.length === 0 ? styles.backgroundTransparent : ''}
    header={<Header/>}
    sider={<Sider/>}
    type="table"
    contentStyles={{
      backgroundColor: storageHomePage.objectList.length === 0 ? 'transparent' : undefined,
      boxShadow: storageHomePage.objectList.length === 0 ? 'none' : undefined,
    }}
    hasBottom={storageHomePage.objectList.length !== 0}
  ><Content/></FLeftSiderLayout>);
}

export default withRouter(connect(({storageHomePage}: ConnectState) => ({
  storageHomePage,
}))(Storage));
