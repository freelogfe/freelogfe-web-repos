import * as React from 'react';
import styles from './index.less';
import sharedStyles from '../../index.less';
import {FContentText} from "@/components/FText";
import {FNormalButton} from "@/components/FButton";
import FMenu from "@/components/FMenu";
import {
  ChangeAction,
  FetchBucketsAction,
  OnChangeActivatedBucketAction,
  StorageHomePageModelState
} from "@/models/storageHomePage";
import {router} from "umi";
import {FPlus} from "@/components/FIcons";
import {i18nMessage} from "@/utils/i18n";
import FDropdown from "@/components/FDropdown";
import {connect, Dispatch} from 'dva';
import {ConnectState, GlobalModelState} from "@/models/connect";
import Nav from "../../components/Nav";

interface StorageProps {
  dispatch: Dispatch;

  storageHomePage: StorageHomePageModelState;
  global: GlobalModelState;
}

function Storage({dispatch, storageHomePage, global}: StorageProps) {

  const cRoute = global.routerHistories[global.routerHistories.length - 1];
  const isCurrent: boolean = cRoute.pathname.startsWith('/storage');

  React.useEffect(() => {
    dispatch<FetchBucketsAction>({
      type: 'storageHomePage/fetchBuckets',
    });
  }, []);

  function onClickStorage() {
    if (!isCurrent) {
      return router.push('/storage');
    }
  }

  return (<FDropdown overlay={storageHomePage.bucketList.length === 0
    ? (<div className={styles.emptyDropdown}>
      <FContentText text={'自由创作从Freelog开始'}/>
      <div style={{height: 30}}/>
      <FNormalButton
        onClick={() => {
          dispatch<ChangeAction>({
            type: 'storageHomePage/change',
            payload: {
              newBucketName: '',
              newBucketNameError: false,
              newBucketModalVisible: true,
            },
          });
          router.push('/storage');
        }}
        size="small"
      >创建Bucket</FNormalButton>
    </div>)
    : (<div>
      <FMenu
        value={isCurrent ? storageHomePage.activatedBucket : ''}
        onClick={(value) => {
          dispatch<OnChangeActivatedBucketAction>({
            type: 'storageHomePage/onChangeActivatedBucket',
            payload: value,
          });
          onClickStorage();
        }}
        options={storageHomePage.bucketList.map((b) => ({
          text: b.bucketName,
          // value: n.nodeDomain,
          value: b.bucketName,
        }))}
      />
      <a
        onClick={() => {
          dispatch<ChangeAction>({
            type: 'storageHomePage/change',
            payload: {
              newBucketName: '',
              newBucketNameError: false,
              newBucketModalVisible: true,
            },
          });
          onClickStorage();
        }}
        className={sharedStyles.newButton}>
        <FPlus/>
      </a>
    </div>)
  }>
    <Nav active={isCurrent} onClick={onClickStorage}>{i18nMessage('storage')}</Nav>
  </FDropdown>);
}

export default connect(({storageHomePage, global}: ConnectState) => ({
  storageHomePage,
  global,
}))(Storage);
