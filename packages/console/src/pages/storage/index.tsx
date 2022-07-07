import * as React from 'react';
import styles from './index.less';
import Sider from './Sider';
import Content from './Content';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Header from './Header';
import { connect, Dispatch } from 'dva';
import { ConnectState, StorageHomePageModelState, StorageObjectEditorModelState } from '@/models/connect';
import { CreateBucketAction, OnChangeActivatedBucketAction, OnChangeNewBucketAction } from '@/models/storageHomePage';
import { router, withRouter } from 'umi';
import { RouteComponentProps } from 'react-router';
import { ChangeAction, FetchInfoAction, storageObjectEditorInitData } from '@/models/storageObjectEditor';
import Details from '@/pages/storage/Content/Details';
import useUrlState from '@ahooksjs/use-url-state';
import FInput from '@/components/FInput';
import { ChangeAction as StorageHomePageChangeAction } from '@/models/storageHomePage';
// import FUtil1 from '@/utils';
import { FUtil, FI18n } from '@freelog/tools-lib';
import FModal from '@/components/FModal';
import { FTitleText } from '@/components/FText';

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

  React.useEffect(() => {
    if (state.createBucket) {
      dispatch<StorageHomePageChangeAction>({
        type: 'storageHomePage/change',
        payload: {
          newBucketModalVisible: true,
        },
      });
    } else {
      dispatch<StorageHomePageChangeAction>({
        type: 'storageHomePage/change',
        payload: {
          newBucketName: '',
          newBucketNameError: false,
          newBucketModalVisible: false,
        },
      });
    }

  }, [state.createBucket]);

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

    <FModal
      title={null}
      visible={storageHomePage.newBucketModalVisible}
      width={640}
      okButtonProps={{
        disabled: !storageHomePage.newBucketName || storageHomePage.newBucketNameError,
        // disabled: true,
      }}
      cancelText={FI18n.i18nNext.t('btn_cancel')}
      onOk={() => {
        dispatch<CreateBucketAction>({
          type: 'storageHomePage/createBucket',
        });
        // setModalVisible(false);
      }}
      onCancel={() => {
        router.replace(FUtil.LinkTo.storageSpace({
          bucketName: storageHomePage.activatedBucket,
        }));
      }}
    >
      {/*<div style={{ height: 20 }} />*/}
      <div style={{ padding: 20 }}>
        <FTitleText text={FI18n.i18nNext.t('create_bucket_popup_title')} type='h2' />
      </div>

      <div className={styles.FModalBody}>
        <div style={{ height: 50 }} />
        <div className={styles.tip}>
          {
            FI18n.i18nNext.t('create_bucket_popup_msg')
              .split('\n')
              .map((s, i) => {
                return (<div key={i}>{s}</div>);
              })
          }
        </div>
        <div style={{ height: 10 }} />
        <FInput
          value={storageHomePage.newBucketName}
          // onChange={(e) => {
          //
          // }}
          placeholder={FI18n.i18nNext.t('enter_bucket_name')}
          debounce={300}
          onDebounceChange={(value) => {
            dispatch<OnChangeNewBucketAction>({
              type: 'storageHomePage/onChangeNewBucket',
              payload: value,
            });
          }}
          wrapClassName={styles.wrapClassName}
          className={styles.FInput}
          errorText={storageHomePage.newBucketNameError ? (<div>
            {
              FI18n.i18nNext.t('naming_convention_bucket_name')
                .split('\n')
                .map((s, i) => {
                  return (<div key={i}>{s}</div>);
                })
            }

          </div>) : ''}
        />
        <div style={{ height: 100 }} />
      </div>
    </FModal>
  </>);
}

export default withRouter(connect(({
                                     storageHomePage,
                                     storageObjectEditor,
                                   }: ConnectState) => ({
  storageHomePage,
  storageObjectEditor,
}))(Storage));
