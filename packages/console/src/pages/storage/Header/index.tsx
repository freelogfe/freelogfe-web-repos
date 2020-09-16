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
import FUploadTasksPanel from "@/pages/storage/containers/FUploadTasksPanel";
import fMessage from "@/components/fMessage";

interface HeaderProps {
  dispatch: Dispatch;
  storage: StorageHomePageModelState;
}

interface HeaderStates {
  files: RcFile[];
}

function Header({dispatch, storage}: HeaderProps) {

  const bucket = storage.bucketList.find((b) => b.bucketName === storage.activatedBucket);
  if (!bucket) {
    return null;
  }

  const [files, setFiles] = React.useState<HeaderStates['files']>([]);

  return (<div className={styles.header}>
    <div className={styles.headerLeft}>
      <FTitleText type="h1" text={bucket.bucketName}/>
      <div style={{height: 5}}/>
      <Space size={40}>
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
          const totalSize: number = fileList.map((f) => f.size).reduce((p, c) => p + c, 0);
          if (storage.totalStorage - storage.usedStorage < totalSize) {
            fMessage('超出储存', 'warning');
          } else {
            // for (const f of fileList) {
            //   f.objectName = 'f.name'
            // }
            setFiles([
              ...fileList,
              ...files,
            ]);
          }
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

    <FUploadTasksPanel
      files={files}
    />
  </div>);
}


export default connect(({storageHomePage}: ConnectState) => ({
  storage: storageHomePage,
}))(Header);
