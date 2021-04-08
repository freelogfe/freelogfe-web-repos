import * as React from 'react';
import styles from './index.less';
import Sider from './Sider';
import Content from './Content';
import NoBucket from './NoBucket';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Header from './Header';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageHomePageModelState, StorageObjectEditorModelState} from '@/models/connect';
import {OnChangeActivatedBucketAction} from "@/models/storageHomePage";
import {withRouter} from 'umi';
import {RouteComponentProps} from "react-router";
import {ChangeAction, FetchInfoAction, storageObjectEditorInitData} from "@/models/storageObjectEditor";
import Details from "@/pages/storage/Content/Details";

interface StorageProps extends RouteComponentProps<{}> {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
  storageObjectEditor: StorageObjectEditorModelState;
}

function Storage({match, history, storageHomePage, storageObjectEditor, dispatch}: StorageProps) {

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
    handleObject();

    return () => {
      dispatch<ChangeAction>({
        type: 'storageObjectEditor/change',
        payload: {
          ...storageObjectEditorInitData,
        }
      });
    };
  }, [(history.location as any).query.objectID]);

  async function handleObject() {
    await dispatch<ChangeAction>({
      type: 'storageObjectEditor/change',
      payload: {
        objectId: (history.location as any).query.objectID || ''
      },
    });

    await dispatch<FetchInfoAction>({
      type: 'storageObjectEditor/fetchInfo',
    });
  }

  // async function initObjectDetails() {
  //   // await dispatch<ChangeAction>({
  //   //   type: 'storageObjectEditor/change',
  //   //   payload: {objectId: (history.location as any).query.objectID || ''},
  //   // });
  //   await dispatch<FetchInfoAction>({
  //     type: 'storageObjectEditor/fetchInfo',
  //   });
  // }

  if (!storageHomePage.bucketList) {
    return null;
  }

  if (storageHomePage.bucketList.length === 0) {
    return (<NoBucket/>);
  }

  return (<>
    <FLeftSiderLayout
      // contentClassName={storageHomePage.objectList.length === 0 ? styles.backgroundTransparent : ''}
      header={<Header/>}
      sider={<Sider/>}
      type="table"
      contentStyles={{
        backgroundColor: storageHomePage.objectList.length === 0 ? 'transparent' : undefined,
        boxShadow: storageHomePage.objectList.length === 0 ? 'none' : undefined,
      }}
      hasBottom={storageHomePage.objectList.length !== 0}
    >
      <Content/>
    </FLeftSiderLayout>
    <Details/>
  </>);
}

export default withRouter(connect(({storageHomePage, storageObjectEditor}: ConnectState) => ({
  storageHomePage,
  storageObjectEditor,
}))(Storage));
