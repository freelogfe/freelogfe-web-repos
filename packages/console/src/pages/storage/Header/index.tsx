import * as React from 'react';
import styles from './index.less';
import {FTitleText} from '@/components/FText';
import {Space} from 'antd';
import {FNormalButton} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {StorageHomePageModelState} from '@/models/storageHomePage';
import {ConnectState} from '@/models/connect';

interface HeaderProps {
  dispatch: Dispatch;
  storage: StorageHomePageModelState;
}

function Header({dispatch, storage}: HeaderProps) {

  const bucket = storage.bucketList.find((b) => b.bucketName === storage.activatedBucket);
  if (!bucket) {
    return null;
  }

  return (<div className={styles.header}>
    <div className={styles.headerLeft}>
      <FTitleText type="h1" text={bucket.bucketName}/>
      <div style={{height: 5}}/>
      <Space size={40}>
        {/*<div>创建时间 2020.05.30</div>*/}
        <div>创建时间 {bucket.createDate}</div>
        <div>存储对象 {bucket.totalFileQuantity}</div>
      </Space>
    </div>
    <FNormalButton
      // onClick={() => dispatch<CreateBucketAction>({
      //   type: 'storageHomePage/createBucket',
      // })}
    >上传对象</FNormalButton>
  </div>);
}


export default connect(({storageHomePage}: ConnectState) => ({
  storage: storageHomePage,
}))(Header);
