import * as React from 'react';
import styles from './index.less';
import sharedStyles from '../../index.less';
import {FContentText} from "@/components/FText";
import {FRectBtn} from "@/components/FButton";
import FMenu from "@/components/FMenu";
import {
  ChangeAction,
  StorageHomePageModelState
} from "@/models/storageHomePage";
import {router} from "umi";
import {FPlus} from "@/components/FIcons";
import FDropdown from "@/components/FDropdown";
import {connect, Dispatch} from 'dva';
import {ConnectState, GlobalModelState} from "@/models/connect";
import FNavLink from "@/layouts/FLayout/components/FNavLink";
import FUtil1 from "@/utils";
import {FUtil} from '@freelog/tools-lib';

interface StorageProps {
  dispatch: Dispatch;

  storageHomePage: StorageHomePageModelState;
  router: {
    location: Location;
  };
}

function Storage({dispatch, storageHomePage, router: routerObj}: StorageProps) {
  // const cRoute = global.routerHistories[global.routerHistories.length - 1];
  const isCurrent: boolean = routerObj.location.pathname.startsWith('/storage');

  // React.useEffect(() => {
  //   // console.log(storageHomePage.bucketList, 'storageHomePage.bucketList!@#$@#$#');
  //   if (storageHomePage.bucketList) {
  //     return;
  //   }
  //   dispatch<FetchBucketsAction>({
  //     type: 'storageHomePage/fetchBuckets',
  //     payload: {
  //       from: 'header',
  //     },
  //   });
  // }, []);

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
        <FPlus style={{fontSize: 14}}/>
      </a>
    </div>)
  }>
    <FNavLink
      active={isCurrent}
      text={FUtil1.I18n.message('storage')}
      to={FUtil.LinkTo.storageSpace({
        bucketName: storageHomePage.bucketList && storageHomePage.bucketList.length > 0
          ? storageHomePage.bucketList[0].bucketName
          : '',
      })}
    />
  </FDropdown>);
}

export default connect(({storageHomePage, router}: ConnectState) => ({
  storageHomePage,
  router,
}))(Storage);
