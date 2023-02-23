import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, StorageHomePageModelState } from '@/models/connect';
import Task from '@/pages/storage/containers/FUploadTasksPanel/Task';
import {
  ChangeAction,
  CreateObjectAction,
  FetchBucketsAction,
  FetchObjectsAction,
  FetchSpaceStatisticAction,
} from '@/models/storageHomePage';
import * as AHooks from 'ahooks';
import fConfirmModal from '@/components/fConfirmModal';
import FLoadingTip from '@/components/FLoadingTip';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

export interface FUploadTasksPanelProps {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
}

let successUids: string[] = [];
let failedUids: string[] = [];

function FUploadTasksPanel({ dispatch, storageHomePage }: FUploadTasksPanelProps) {

  const { run } = AHooks.useDebounceFn(() => {
      dispatch<FetchObjectsAction>({
        type: 'storageHomePage/fetchObjects',
        payload: 'insert',
      });
      dispatch<FetchSpaceStatisticAction>({
        type: 'storageHomePage/fetchSpaceStatistic',
      });
      dispatch<FetchBucketsAction>({
        type: 'storageHomePage/fetchBuckets',
      });
    }, {
      wait: 300,
    },
  );

  const { run: run1 } = AHooks.useDebounceFn(async () => {
    // console.log(successUids, failedUids, 'successUids!Q@#$@#$@!#$@#$#$');
    await dispatch<ChangeAction>({
      type: 'storageHomePage/change',
      payload: {
        uploadTaskQueue: storageHomePage.uploadTaskQueue.map<StorageHomePageModelState['uploadTaskQueue'][number]>((utq) => {
          // console.log(utq.uid, uid, 'f.file.uid !== uid');
          if (successUids.includes(utq.uid)) {
            return {
              ...utq,
              state: 1,
            };
          }
          if (failedUids.includes(utq.uid)) {
            return {
              ...utq,
              state: -1,
            };
          }
          return utq;
        }),
      },
    });
    successUids = [];
    failedUids = [];
  }, {
    wait: 300,
  });

  function closeAll() {
    dispatch<ChangeAction>({
      type: 'storageHomePage/change',
      payload: {
        uploadPanelVisible: false,
      },
    });

    setTimeout(() => {
      dispatch<ChangeAction>({
        type: 'storageHomePage/change',
        payload: {
          uploadTaskQueue: [],
        },
      });
    });
  }

  if (!storageHomePage.uploadPanelVisible && storageHomePage.uploadTaskQueue.length === 0) {
    return null;
  }

  return (<div
    className={styles.UploadingTasks}
    // style={{display: !storage.uploadPanelVisible ? 'none' : 'block'}}
  >
    <div className={styles.title}>
      <FComponentsLib.FContentText text={'任务列表'} />
      <Space size={20}>
        <FComponentsLib.FTextBtn
          onClick={() => {
            dispatch<ChangeAction>({
              type: 'storageHomePage/change',
              payload: {
                uploadPanelOpen: !storageHomePage.uploadPanelOpen,
              },
            });
          }}
          type='default'
        >
          {
            storageHomePage.uploadPanelOpen
              ? (<FComponentsLib.FIcons.FDown style={{ fontSize: 12 }} />)
              : (<FComponentsLib.FIcons.FUp style={{ fontSize: 12 }} />)
          }
        </FComponentsLib.FTextBtn>
        <FComponentsLib.FTextBtn
          onClick={() => {
            const exits: undefined | StorageHomePageModelState['uploadTaskQueue'][number] = storageHomePage.uploadTaskQueue.find((i) => i.state !== 1);
            if (exits) {
              fConfirmModal({
                message: FI18n.i18nNext.t('bucket_msg_cancel_all_uploading_task'),
                cancelText: FI18n.i18nNext.t('bucket_btn_countinue_upload'),
                okText: FI18n.i18nNext.t('bucket_btn_cancel_upload'),
                onOk() {
                  closeAll();
                },
              });
              return;
            }
            closeAll();
          }}
          type='default'
        ><FComponentsLib.FIcons.FClose style={{ fontSize: 12 }} /></FComponentsLib.FTextBtn>
      </Space>
    </div>


    {/*{*/}
    {/*  storageHomePage.uploadTaskQueue.length === 0*/}
    {/*    ? (<FLoadingTip height={370} />)*/}
    {/*    : ()*/}
    {/*}*/}

    <div className={styles.body} style={{ display: storageHomePage.uploadPanelOpen ? 'block' : 'none' }}>
      {
        storageHomePage.uploadTaskQueue.filter((utq) => utq.state === 1).length > 0 && (<div
          className={styles.successCount}>有{storageHomePage.uploadTaskQueue.filter((utq) => utq.state === 1).length}个文件上传成功
        </div>)
      }

      {
        storageHomePage.uploadTaskQueue.map((f, index, uploadTaskQueue) => {
          // console.log(f, 'fffffFFFFFFF2390ueoifjasdf');
          return (<Task
            key={f.uid}
            file={f}
            bucketName={storageHomePage.activatedBucket}
            onSucceed={async ({ objectName, sha1, uid }) => {
              // console.log(objectName, '2309jasdf;lkfjasd;lfkjsadf');
              successUids = [
                ...successUids,
                uid,
              ];
              await dispatch<CreateObjectAction>({
                type: 'storageHomePage/createObject',
                payload: {
                  objectName,
                  sha1,
                },
              });

              run();
              run1();
            }}
            onFail={({ objectName, uid }) => {
              failedUids = [
                ...failedUids,
                uid,
              ];
              run1();
            }}
          />);
        })
      }
    </div>

  </div>);
}

export default connect(({ storageHomePage }: ConnectState) => ({
  storageHomePage: storageHomePage,
}))(FUploadTasksPanel);
