import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FUpload from '@/components/FUpload';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { OnChange_FilterInput_Action, StorageHomePageModelState, UploadFilesAction } from '@/models/storageHomePage';
import { ConnectState } from '@/models/connect';
import { RcFile } from 'antd/lib/upload/interface';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import FInput from '@/components/FInput';
import * as AHooks from 'ahooks';

interface HeaderProps {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
}

interface HeaderStates {
  // fileObjects: FUploadTasksPanelProps['fileObjects'];
}

function Header({ dispatch, storageHomePage }: HeaderProps) {

  const bucket = storageHomePage.bucketList?.find((b) => b.bucketName === storageHomePage.activatedBucket);
  if (!bucket) {
    return null;
  }
  const isUserDataBucket = storageHomePage.activatedBucket === '.UserNodeData';

  return (<div className={styles.header}>
    <div className={styles.headerLeft}>
      <FComponentsLib.FTitleText type='h1' text={bucket.bucketName} />
      <div style={{ height: 5 }} />
      <Space size={40}>
        <div>{FI18n.i18nNext.t('created_time')} {bucket.createDate}</div>
        <div>{FI18n.i18nNext.t('object_quantity')} {bucket.totalFileQuantity}</div>
      </Space>
    </div>
    {
      !isUserDataBucket && storageHomePage.total !== 0 && (<Space size={30}>
        <FInput
          value={''}
          theme={'dark'}
          debounce={300}
          onDebounceChange={(value) => {
            dispatch<OnChange_FilterInput_Action>({
              type: 'storageHomePage/onChange_FilterInput',
              payload: {
                value: value,
              },
            });
          }}
          placeholder={'支持对象名称'}
        />
        <FUpload
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
          <FComponentsLib.FRectBtn
            type='primary'
          >{FI18n.i18nNext.t('upload_object')}</FComponentsLib.FRectBtn>
        </FUpload>
      </Space>)
    }

  </div>);
}


export default connect(({ storageHomePage }: ConnectState) => ({
  storageHomePage: storageHomePage,
}))(Header);
