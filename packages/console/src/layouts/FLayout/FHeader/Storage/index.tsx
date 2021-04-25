import * as React from 'react';
import styles from './index.less';
import sharedStyles from '../../index.less';
import {FContentText} from "@/components/FText";
import {FRectBtn} from "@/components/FButton";
import FMenu from "@/components/FMenu";
import {
  ChangeAction,
  FetchBucketsAction,
  StorageHomePageModelState
} from "@/models/storageHomePage";
import {router} from "umi";
import {FPlus} from "@/components/FIcons";
import FDropdown from "@/components/FDropdown";
import {connect, Dispatch} from 'dva';
import {ConnectState, GlobalModelState} from "@/models/connect";
import FNavLink from "@/layouts/FLayout/components/FNavLink";
import FUtil from "@/utils";

interface StorageProps {
  dispatch: Dispatch;

  storageHomePage: StorageHomePageModelState;
  global: GlobalModelState;
}

function Storage({dispatch, storageHomePage, global}: StorageProps) {
  const cRoute = global.routerHistories[global.routerHistories.length - 1];
  const isCurrent: boolean = cRoute.pathname.startsWith('/storage');

  React.useEffect(() => {
    // console.log(storageHomePage.bucketList, 'storageHomePage.bucketList!@#$@#$#');
    if (storageHomePage.bucketList) {
      return;
    }
    dispatch<FetchBucketsAction>({
      type: 'storageHomePage/fetchBuckets',
      payload: {
        from: 'header',
      },
    });
  }, []);

  function onClickStorage() {

    if (!isCurrent) {
      // console.log('@$!@#$@!#$!@#$onClickStorage');
      return router.push(FUtil.LinkTo.storageSpace({
        bucketName: (storageHomePage.bucketList
          && storageHomePage.bucketList[0]
          && storageHomePage.bucketList[0].bucketName)
          || '',
      }));
    }
  }

  return (<FDropdown overlay={(storageHomePage.bucketList || []).length === 0
    ? (<div className={styles.emptyDropdown}>
      <FContentText text={'自由创作从Freelog开始'}/>
      <div style={{height: 30}}/>
      <FRectBtn
        onClick={() => {
          dispatch<ChangeAction>({
            type: 'storageHomePage/change',
            payload: {
              newBucketName: '',
              newBucketNameError: false,
              newBucketModalVisible: true,
            },
          });
          // console.log('2222222@@#$@#$T09djsg');
          router.push(FUtil.LinkTo.storageSpace({}));
        }}
        size="small"
      >创建Bucket</FRectBtn>
    </div>)
    : (<div>
      <FMenu
        value={isCurrent ? storageHomePage.activatedBucket : ''}
        onClick={(value) => {
          router.push(FUtil.LinkTo.storageSpace({
            bucketName: value,
          }));
        }}
        options={(storageHomePage.bucketList || []).map((b) => ({
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
    <FNavLink
      active={isCurrent}
      text={FUtil.I18n.message('storage')}
      to={FUtil.LinkTo.storageSpace({
        bucketName: storageHomePage.bucketList && storageHomePage.bucketList.length > 0
          ? storageHomePage.bucketList[0].bucketName
          : '',
      })}
    />
  </FDropdown>);
}

export default connect(({storageHomePage, global}: ConnectState) => ({
  storageHomePage,
  global,
}))(Storage);
