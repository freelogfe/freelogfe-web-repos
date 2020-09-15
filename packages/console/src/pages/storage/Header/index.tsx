import * as React from 'react';
import styles from './index.less';
import {FTitleText} from '@/components/FText';
import {Space} from 'antd';
import {FNormalButton} from '@/components/FButton';
import FUpload from '@/components/FUpload';
import {connect, Dispatch} from 'dva';
import {StorageHomePageModelState} from '@/models/storageHomePage';
import {ConnectState} from '@/models/connect';
import {RcFile} from "antd/lib/upload/interface";
import FUploadTasksPanel from "@/pages/storage/components/FUploadTasksPanel";

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
    <FUpload
      showUploadList={false}
      multiple={true}
      beforeUpload={(file: RcFile, fileList: RcFile[]) => {
        // console.log(file, FileList, 'beforeUpload 24ew890sio;');
        if (file === fileList[fileList.length - 1]) {
          console.log(fileList, 'FFFFFFF');
        }
        return false;
      }}
    >
      <FNormalButton
        // onClick={() => dispatch<CreateBucketAction>({
        //   type: 'storageHomePage/createBucket',
        // })}
      >上传对象</FNormalButton>
    </FUpload>

    <FUploadTasksPanel/>
  </div>);
}


export default connect(({storageHomePage}: ConnectState) => ({
  storage: storageHomePage,
}))(Header);
