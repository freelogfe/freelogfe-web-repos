import * as React from 'react';
import styles from './index.less';
import Sider from './Sider';
import Content from './Content';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Header from './Header';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, StorageHomePageModelState, StorageObjectEditorModelState } from '@/models/connect';
import {
  OnChangeActivatedBucketAction,
  OnSucceed_CreateBucket_Action,
} from '@/models/storageHomePage';
import { withRouter } from 'umi';
import { RouteComponentProps } from 'react-router';
import { ChangeAction, FetchInfoAction, storageObjectEditorInitData } from '@/models/storageObjectEditor';
import Details from '@/pages/storage/Content/Details';
import useUrlState from '@ahooksjs/use-url-state';
import { FUtil, FI18n } from '@freelog/tools-lib';
import fCreateBucket from '@/components/fCreateBucket';
import * as AHooks from 'ahooks';

interface StorageProps extends RouteComponentProps<{}> {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
  storageObjectEditor: StorageObjectEditorModelState;
}

function Storage({ match, history, storageHomePage, storageObjectEditor, dispatch }: StorageProps) {

  const [state] = useUrlState<{ bucketName: string; objectID: string; createBucket: string }>();

  React.useEffect(() => {

    if (!state.bucketName) {
      return;
    }
    dispatch<OnChangeActivatedBucketAction>({
      type: 'storageHomePage/onChangeActivatedBucket',
      payload: (history.location as any).query.bucketName,
    });
  }, [state.bucketName]);

  AHooks.useAsyncEffect(async () => {
    if (state.createBucket) {
      const bucketName: string | null = await fCreateBucket();
      if (!bucketName) {
        history.replace(FUtil.LinkTo.storageSpace({
          bucketName: storageHomePage.activatedBucket,
        }));
        return;
      }
      dispatch<OnSucceed_CreateBucket_Action>({
        type: 'storageHomePage/onSucceed_CreateBucket',
        payload: {
          newBucketName: bucketName,
        },
      });
    }
  }, [state.createBucket]);

  // async function onCreateBucket() {
  //
  // }

  React.useEffect(() => {
    handleObject();

    return () => {
      dispatch<ChangeAction>({
        type: 'storageObjectEditor/change',
        payload: {
          ...storageObjectEditorInitData,
        },
      });
    };
  }, [state.objectID]);

  async function handleObject() {
    await dispatch<ChangeAction>({
      type: 'storageObjectEditor/change',
      payload: {
        objectId: state.objectID || '',
      },
    });

    await dispatch<FetchInfoAction>({
      type: 'storageObjectEditor/fetchInfo',
    });
  }

  if (!storageHomePage.bucketList) {
    return null;
  }

  return (<>
    <FLeftSiderLayout
      header={storageHomePage.bucketList?.length === 0 ? null : <Header />}
      sider={<Sider />}
      type='table'
      contentStyles={{
        backgroundColor: storageHomePage.object_List.length === 0 ? 'transparent' : undefined,
        boxShadow: storageHomePage.object_List.length === 0 ? 'none' : undefined,
      }}
      hasBottom={storageHomePage.object_List.length !== 0}
    >
      <Content />
    </FLeftSiderLayout>

    <Details />
  </>);
}

export default withRouter(connect(({
                                     storageHomePage,
                                     storageObjectEditor,
                                   }: ConnectState) => ({
  storageHomePage,
  storageObjectEditor,
}))(Storage));
