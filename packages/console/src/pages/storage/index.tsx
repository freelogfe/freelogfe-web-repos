import * as React from 'react';
import styles from './index.less';
import Sider from './Sider';
import Content from './Content';
import FLeftSiderLayout from '@/layouts/FLeftSiderLayout';
import Header from './Header';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageHomePageModelState, StorageObjectEditorModelState} from '@/models/connect';
import {CreateBucketAction, OnChangeActivatedBucketAction, OnChangeNewBucketAction} from "@/models/storageHomePage";
import {withRouter} from 'umi';
import {RouteComponentProps} from "react-router";
import {ChangeAction, FetchInfoAction, storageObjectEditorInitData} from "@/models/storageObjectEditor";
import Details from "@/pages/storage/Content/Details";
import useUrlState from '@ahooksjs/use-url-state';
import FInput from "@/components/FInput";
import FModal from "@/components/FModal";
import {ChangeAction as StorageHomePageChangeAction} from '@/models/storageHomePage';
import FUtil from "@/utils";

interface StorageProps extends RouteComponentProps<{}> {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
  storageObjectEditor: StorageObjectEditorModelState;
}

function Storage({match, history, storageHomePage, storageObjectEditor, dispatch}: StorageProps) {

  const [state] = useUrlState<{ bucketName: string; objectID: string }>();

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
    handleObject();

    return () => {
      dispatch<ChangeAction>({
        type: 'storageObjectEditor/change',
        payload: {
          ...storageObjectEditorInitData,
        }
      });
    };
  }, [state.objectID]);

  async function handleObject() {
    await dispatch<ChangeAction>({
      type: 'storageObjectEditor/change',
      payload: {
        objectId: state.objectID || ''
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
      header={storageHomePage.bucketList?.length === 0 ? null : <Header/>}
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

    <FModal
      title={FUtil.I18n.message('create_bucket_popup_title')}
      visible={storageHomePage.newBucketModalVisible}
      width={640}
      okButtonProps={{
        disabled: !storageHomePage.newBucketName || storageHomePage.newBucketNameError,
        // disabled: true,
      }}
      cancelText={FUtil.I18n.message('btn_cancel')}
      onOk={() => {
        dispatch<CreateBucketAction>({
          type: 'storageHomePage/createBucket',
        });
        // setModalVisible(false);
      }}
      onCancel={() => {
        dispatch<StorageHomePageChangeAction>({
          type: 'storageHomePage/change',
          payload: {
            newBucketModalVisible: false,
          },
        });
      }}
    >
      <div className={styles.FModalBody}>
        <div style={{height: 50}}/>
        <ul className={styles.tip}>
          {/*<li>请注意存储空间的名称一但创建则不可修改</li>*/}
          {/*<li>Freelog为每个用户提供2GB的免费存储空间</li>*/}
          {FUtil.I18n.message('create_bucket_popup_msg')}
        </ul>
        <div style={{height: 10}}/>
        <FInput
          value={storageHomePage.newBucketName}
          // onChange={(e) => {
          //
          // }}
          placeholder={FUtil.I18n.message('enter_bucket_name')}
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
            {/*<div>名称全局唯一；</div>*/}
            {/*<div>只能包括小写字母、数字和短横线（-）；</div>*/}
            {/*<div>必须以小写字母或者数字开头和结尾 ；</div>*/}
            {/*<div>长度必须在 1–63 字符之间。</div>*/}
            <div>{FUtil.I18n.message('naming_convention_bucket_name')}</div>
          </div>) : ''}
        />
        <div style={{height: 100}}/>
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
