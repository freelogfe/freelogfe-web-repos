import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FTextButton} from '@/components/FButton';
import {DownOutlined, UpOutlined, CloseOutlined} from '@ant-design/icons';
import {Modal, Space} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageHomePageModelState} from '@/models/connect';
import Task from '@/pages/storage/containers/FUploadTasksPanel/Task';
import {
  ChangeAction,
  CreateObjectAction, DeleteBucketByNameAction, FetchBucketsAction,
  FetchObjectsAction,
  FetchSpaceStatisticAction
} from '@/models/storageHomePage';
import * as ahooks from 'ahooks';
import FModal from '@/components/FModal';
import {FTipText} from '@/components/FText';
import {i18nMessage} from "@/utils/i18n";
import {FWarning} from "@/components/FIcons";

export interface FUploadTasksPanelProps {
  dispatch: Dispatch;
  storage: StorageHomePageModelState;
}

function FUploadTasksPanel({dispatch, storage}: FUploadTasksPanelProps) {

  // const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  const {run} = ahooks.useDebounceFn(
    () => {
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
    },
    {
      wait: 300,
    },
  );

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

  if (!storage.uploadPanelVisible) {
    return null;
  }

  return (<div
    className={styles.UploadingTasks}
    // style={{display: !storage.uploadPanelVisible ? 'none' : 'block'}}
  >
    <div className={styles.title}>
      <FContentText text={'任务列表'}/>
      <Space size={20}>
        <FTextButton onClick={() => {
          dispatch<ChangeAction>({
            type: 'storageHomePage/change',
            payload: {
              uploadPanelOpen: !storage.uploadPanelOpen,
            }
          });
        }}>
          {storage.uploadPanelOpen ? <DownOutlined style={{fontSize: 12}}/> : <UpOutlined style={{fontSize: 12}}/>}
        </FTextButton>
        <FTextButton onClick={() => {
          const exits: undefined | StorageHomePageModelState['uploadTaskQueue'][number] = storage.uploadTaskQueue.find((i) => i.state !== 1);
          if (exits) {
            // setModalVisible(true);
            Modal.confirm({
              // title: <div></div>,
              // icon: <FWarning style={{display: 'inline-block'}}/>,
              icon: null,
              content: (<Space size={10}>
                <FWarning style={{display: 'inline-block'}}/>
                <span>{i18nMessage('cancel_all_uploading_task')}</span>
              </Space>),
              onOk() {
                closeAll();
              },
            });
            return;
          }
          closeAll();
        }}><CloseOutlined style={{fontSize: 12}}/></FTextButton>
      </Space>
    </div>
    <div className={styles.body} style={{display: storage.uploadPanelOpen ? 'block' : 'none'}}>
      {
        storage.uploadTaskQueue.map((f) => (<Task
          key={f.uid}
          file={f}
          bucketName={storage.activatedBucket}
          onSucceed={async ({objectName, sha1, uid}) => {
            // console.log('!!!!!!######09jop23efwl;k');
            dispatch<ChangeAction>({
              type: 'storageHomePage/change',
              payload: {
                uploadTaskQueue: storage.uploadTaskQueue.map<StorageHomePageModelState['uploadTaskQueue'][number]>((utq) => {
                  if (f.file.uid !== uid) {
                    return utq;
                  }
                  return {
                    ...utq,
                    state: 1,
                  };
                }),
              }
            });
            await dispatch<CreateObjectAction>({
              type: 'storageHomePage/createObject',
              payload: {
                objectName,
                sha1,
              },
            });
            // console.log('######!!!!!!asdfdsafasdf');
            run();
          }}
          onFail={({objectName, uid}) => {
            dispatch<ChangeAction>({
              type: 'storageHomePage/change',
              payload: {
                uploadTaskQueue: storage.uploadTaskQueue.map<StorageHomePageModelState['uploadTaskQueue'][number]>((utq) => {
                  if (f.file.uid !== uid) {
                    return utq;
                  }
                  return {
                    ...utq,
                    state: -1,
                  };
                }),
              }
            });
          }}
        />))
      }
    </div>

    {/*<FModal*/}
    {/*  visible={modalVisible}*/}
    {/*  title={'提示'}*/}
    {/*  onOk={() => {*/}
    {/*    closeAll();*/}
    {/*    setModalVisible(false);*/}
    {/*  }}*/}
    {/*  onCancel={() => {*/}
    {/*    setModalVisible(false);*/}
    {/*  }}*/}
    {/*  cancelText={i18nMessage('countinue_upload')}*/}
    {/*  okText={i18nMessage('cancel_upload')}*/}
    {/*>*/}
    {/*  <div className={styles.modalContent}>*/}
    {/*    /!*<FTipText text={'关闭任务列表会使未上传的数据丢失，是否关闭？'}/>*!/*/}
    {/*    <FTipText text={i18nMessage('cancel_all_uploading_task')}/>*/}
    {/*  </div>*/}
    {/*</FModal>*/}
  </div>);
}

export default connect(({storageHomePage}: ConnectState) => ({
  storage: storageHomePage,
}))(FUploadTasksPanel);
