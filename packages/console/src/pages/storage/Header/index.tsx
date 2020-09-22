import * as React from 'react';
import styles from './index.less';
import {FTitleText} from '@/components/FText';
import {Space} from 'antd';
import {FNormalButton} from '@/components/FButton';
import FUpload from '@/components/FUpload';
import {connect, Dispatch} from 'dva';
import {ChangeAction, StorageHomePageModelState} from '@/models/storageHomePage';
import {ConnectState} from '@/models/connect';
import {RcFile} from "antd/lib/upload/interface";
import FUploadTasksPanel, {FUploadTasksPanelProps} from "@/pages/storage/containers/FUploadTasksPanel";
import fMessage from "@/components/fMessage";

interface HeaderProps {
  dispatch: Dispatch;
  storage: StorageHomePageModelState;
}

interface HeaderStates {
  // fileObjects: FUploadTasksPanelProps['fileObjects'];
}

function Header({dispatch, storage}: HeaderProps) {

  const bucket = storage.bucketList.find((b) => b.bucketName === storage.activatedBucket);
  if (!bucket) {
    return null;
  }

  // const [fileObjects, setFileObjects] = React.useState<HeaderStates['fileObjects']>([]);

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
            dispatch<ChangeAction>({
              type: 'storageHomePage/change',
              payload: {
                uploadTaskQueue: [
                  ...fileList.map((fo) => ({
                    name: fo.name.replace(/[\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#]/g, '_'),
                    file: fo,
                  })),
                  ...storage.uploadTaskQueue,
                ],
                uploadPanelOpen: true,
                uploadPanelVisible: true,
              }
            });
          }
        }
        return false;
      }}
    >
      <FNormalButton>上传对象</FNormalButton>
    </FUpload>

    <FUploadTasksPanel/>
  </div>);
}


export default connect(({storageHomePage}: ConnectState) => ({
  storage: storageHomePage,
}))(Header);
