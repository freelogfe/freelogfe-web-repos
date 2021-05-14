import * as React from 'react';
import styles from './index.less';
import {FTitleText} from '@/components/FText';
import {Space} from 'antd';
import {FRectBtn} from '@/components/FButton';
import FUpload from '@/components/FUpload';
import {connect, Dispatch} from 'dva';
import {ChangeAction, StorageHomePageModelState, UploadFilesAction} from '@/models/storageHomePage';
import {ConnectState} from '@/models/connect';
import {RcFile} from "antd/lib/upload/interface";
import FUploadTasksPanel, {FUploadTasksPanelProps} from "@/pages/storage/containers/FUploadTasksPanel";
import fMessage from "@/components/fMessage";
import FUtil from "@/utils";

interface HeaderProps {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
}

interface HeaderStates {
  // fileObjects: FUploadTasksPanelProps['fileObjects'];
}

function Header({dispatch, storageHomePage}: HeaderProps) {

  const bucket = storageHomePage.bucketList?.find((b) => b.bucketName === storageHomePage.activatedBucket);
  if (!bucket) {
    return null;
  }
  const isUserDataBucket = storageHomePage.activatedBucket === '.UserNodeData';

  // const [fileObjects, setFileObjects] = React.useState<HeaderStates['fileObjects']>([]);

  return (<div className={styles.header}>
    <div className={styles.headerLeft}>
      <FTitleText type="h1" text={bucket.bucketName}/>
      <div style={{height: 5}}/>
      <Space size={40}>
        <div>{FUtil.I18n.message('created_time')} {bucket.createDate}</div>
        <div>{FUtil.I18n.message('object_quantity')} {bucket.totalFileQuantity}</div>
      </Space>
    </div>
    {
      !isUserDataBucket && storageHomePage.total !== 0 && (<FUpload
          showUploadList={false}
          multiple={true}
          beforeUpload={(file: RcFile, fileList: RcFile[]) => {
            // console.log(file, FileList, 'beforeUpload 24ew890sio;');
            if (file === fileList[fileList.length - 1]) {
              // console.log('0923uiojfdaslk');
              dispatch<UploadFilesAction>({
                type: 'storageHomePage/uploadFiles',
                payload: fileList,
              });
            }
            return false;
          }}
        >
          <FRectBtn
            type="primary"
          >{FUtil.I18n.message('upload_object')}</FRectBtn>
        </FUpload>
      )
    }

  </div>);
}


export default connect(({storageHomePage}: ConnectState) => ({
  storageHomePage: storageHomePage,
}))(Header);
