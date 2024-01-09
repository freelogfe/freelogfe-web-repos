import * as React from 'react';
import styles from './index.less';
import { RcFile } from 'antd/lib/upload/interface';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { Progress, Space } from 'antd';
import { CheckCircleFilled, CloseOutlined, RedoOutlined } from '@ant-design/icons';
import * as AHooks from 'ahooks';
import { getFilesSha1Info } from '@/utils/service';
import { Canceler } from 'axios';
import img from '@/assets/file-object.svg';
import fMessage from '@/components/fMessage';
import {
  OnClick_step2_editCartoonBtn_Action,
  OnClick_step2_editMarkdownBtn_Action, OnRemove_step2_file_Action,
} from '@/models/resourceCreatorPage';

// import UploadCancel from '@/components/FStorageUploadTasksPanel/UploadCancel';

interface TaskProps {
  file: RcFile;
  resourceTypeCode: string;
  resourceType: string[];

  onSuccess?(value: {
    uid: string;
    name: string;
    sha1: string;
  }): void;

  onFail?(value: {
    uid: string;
    name: string;
    sha1: string;
    reason: string;
  }): void;
}

function Task({ file, resourceTypeCode,resourceType, onSuccess, onFail }: TaskProps) {
  const canceler = React.useRef<Canceler | null>(null);
  const [$taskState, set$taskState, get$taskState] = FUtil.Hook.useGetState<'loading' | 'uploading' | 'parsing' | 'success' | 'failed' | 'canceled'>('loading');
  const [$progress, set$progress, get$progress] = FUtil.Hook.useGetState<number>(0);

  AHooks.useMount(async () => {

    if (resourceType[0] === '视频' && file.size > 1024 * 1024 * 1024) {
      // fMessage('文件大小不能超过1GB', 'error');
      onFail && onFail({
        uid: file.uid,
        name: file.name,
        sha1: '',
        reason: '文件大小不能超过1GB',
      });
      return;
    }

    if (resourceType[0] !== '视频' && file.size > 200 * 1024 * 1024) {
      // fMessage('文件大小不能超过200MB', 'error');
      onFail && onFail({
        uid: file.uid,
        name: file.name,
        sha1: '',
        reason: '文件大小不能超过200MB',
      });
      return;
    }

    const fileSha1: string = await FUtil.Tool.getSHA1Hash(file);
    const params0: Parameters<typeof FServiceAPI.Storage.fileIsExist>[0] = {
      sha1: fileSha1,
    };
    const { data: data_fileIsExist } = await FServiceAPI.Storage.fileIsExist(params0);

    if (!data_fileIsExist[0].isExisting) {

      const params3: Parameters<typeof FServiceAPI.Resource.getResourceBySha1>[0] = {
        fileSha1: fileSha1,
      };

      const { data: data_ResourcesBySha1 }: {
        data: {
          userId: number;
          resourceId: string;
          resourceName: string;
          resourceType: string[];
          version: string;
          resourceVersions: {
            version: string;
          }[];
        }[];
      } = await FServiceAPI.Resource.getResourceBySha1(params3);

      if (data_ResourcesBySha1.length > 0 && data_ResourcesBySha1[0].userId !== FUtil.Tool.getUserIDByCookies()) {
        onFail && onFail({
          uid: file.uid,
          name: file.name,
          sha1: '',
          reason: '资源被他人占用',
        });
        return;
      }

      const params: Parameters<typeof FServiceAPI.Storage.uploadFile>[0] = {
        file: file,
      };
      set$taskState('uploading');
      const [promise, cancel]: any = FServiceAPI.Storage.uploadFile(params, {
        onUploadProgress(progressEvent) {
          set$progress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
        },
      }, true);

      canceler.current = cancel;

      // try {
      //   const { data } = await promise;
      // } catch (e) {
      //   onFail && onFail({
      //     uid: file.uid,
      //     name: file.name,
      //     sha1: fileSha1,
      //
      //   });
      //   return;
      // }
    }

    set$taskState('parsing');
    const { result } = await getFilesSha1Info({
      sha1: [fileSha1],
      resourceTypeCode: resourceTypeCode,
    });

    if (result[0].state === 'success') {
      set$taskState('success');
      onSuccess && onSuccess({
        uid: file.uid,
        name: file.name,
        sha1: fileSha1,
      });
      return;
    }
    set$taskState('failed');
    onFail && onFail({
      uid: file.uid,
      name: file.name,
      sha1: fileSha1,
      reason: '未知',
    });
  });

  AHooks.useUnmount(() => {

  });

  if ($taskState === 'canceled') {
    return null;
  }

  return (<div className={styles.fileInfo}>
    <div className={styles.card}>
      <img src={img} className={styles.img} alt='' />
      <div style={{ width: 20 }} />
      <div>
        <FComponentsLib.FContentText
          type='highlight'
          text={file.name}
          style={{ maxWidth: 600 }}
          singleRow
        />
        <div style={{ height: 18 }} />
        <div className={styles.info}>
          <FComponentsLib.FContentText
            className={styles.infoSize}
            type='additional1'
            text={'本地上传'}
          />
        </div>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', width: 270 }}>
      <FComponentsLib.FContentText
        text={`${$progress}%`}
        type={'additional1'}
        style={{ color: '#222' }}
      />
      <div style={{ width: 10 }} />
      <Progress
        percent={$progress}
        showInfo={false}
        style={{ width: 140 }}
      />
      <div style={{ width: 20 }} />
      <FComponentsLib.FTextBtn
        style={{ fontSize: 12 }}
        type={'danger'}
        onClick={() => {
          canceler.current && canceler.current();
          set$taskState('canceled');
          // set_progress(0);
          onFail && onFail({
            uid: file.uid,
            name: file.name,
            sha1: '',
            reason: '取消上传',
          });
        }}
      >取消上传</FComponentsLib.FTextBtn>

    </div>
  </div>);

  // return (<div className={styles.taskItem}>
  //   <div className={styles.taskInfo}>
  //     <FComponentsLib.FContentText
  //       text={file.name}
  //       singleRow={true}
  //     />
  //     <div style={{ height: 2 }} />
  //     <FComponentsLib.FContentText
  //       text={FUtil.Format.humanizeSize(file.size)}
  //     />
  //   </div>
  //
  //   {
  //     $taskState === 'loading' && (<FComponentsLib.FTextBtn>加载中...</FComponentsLib.FTextBtn>)
  //   }
  //
  //   {
  //     $taskState === 'parsing' && (<FComponentsLib.FTextBtn>解析中...</FComponentsLib.FTextBtn>)
  //   }
  //   {/*{*/}
  //   {/*  $taskState === 'uploading' && (<Uploading*/}
  //   {/*    progress={progress}*/}
  //   {/*    cancel={() => {*/}
  //   {/*      canceler.current && canceler.current();*/}
  //   {/*      set_taskState('canceled');*/}
  //   {/*      set_progress(0);*/}
  //   {/*      onFail && onFail({ uid: task.uid, objectName: task.name });*/}
  //   {/*    }}*/}
  //   {/*  />)*/}
  //   {/*}*/}
  //   {
  //     $taskState === 'uploading' && (<div className={styles.Uploading}>
  //       <Space
  //         className={styles.status}
  //         size={10}
  //       >
  //         <FComponentsLib.FContentText text={$progress + '%'} />
  //         <div style={{ width: 100 }}>
  //           <Progress
  //             type={'line'}
  //             percent={$progress}
  //             showInfo={false}
  //           />
  //         </div>
  //       </Space>
  //       <div className={styles.action}>
  //         <FComponentsLib.FTextBtn
  //           type='default'
  //           onClick={async () => {
  //             set$taskState('canceled');
  //             canceler.current && canceler.current();
  //             // const fileSha1: string = await FUtil.Tool.getSHA1Hash(file);
  //             // onFail && onFail({
  //             //   uid: file.uid,
  //             //   name: file.name,
  //             //   sha1: fileSha1,
  //             // });
  //           }}
  //           disabled={$progress === 100}
  //         >
  //           <CloseOutlined />
  //         </FComponentsLib.FTextBtn>
  //       </div>
  //     </div>)
  //   }
  //   {/*{*/}
  //   {/*  $taskState === 'success' && (<UploadSuccess />)*/}
  //   {/*}*/}
  //   {
  //     $taskState === 'success' && (<div className={styles.UploadSuccess}>
  //       <div>上传成功</div>
  //       <CheckCircleFilled />
  //     </div>)
  //   }
  //   {/*{*/}
  //   {/*  $taskState === 'canceled' && (<UploadCancel*/}
  //   {/*    onClick={async () => {*/}
  //   {/*      // console.log('的尺寸的方式打发士大夫');*/}
  //   {/*      // await verifySameName();*/}
  //   {/*    }}*/}
  //   {/*  />)*/}
  //   {/*}*/}
  //   {
  //     $taskState === 'canceled' && (<div className={styles.UploadFailed}>
  //       <span>取消上传</span>
  //       {/*<FComponentsLib.FTextBtn*/}
  //       {/*  type='primary'*/}
  //       {/*  onClick={() => {*/}
  //
  //       {/*  }}>*/}
  //       {/*  <RedoOutlined />*/}
  //       {/*</FComponentsLib.FTextBtn>*/}
  //     </div>)
  //   }
  //   {/*{*/}
  //   {/*  taskState === 'sameName' && (<UploadSameName*/}
  //   {/*    onClick={async () => {*/}
  //   {/*      // console.log('startUploadFile we9oifjsdkifjsdl;fjlksdjflk');*/}
  //   {/*      await startUploadFile();*/}
  //   {/*    }}*/}
  //   {/*  />)*/}
  //   {/*}*/}
  //   {/*{*/}
  //   {/*  $taskState === 'failed' && (<UploadFailed*/}
  //   {/*    onClick={async () => {*/}
  //   {/*      await verifySameName();*/}
  //   {/*    }}*/}
  //   {/*  />)*/}
  //   {/*}*/}
  //   {
  //     $taskState === 'failed' && (<div className={styles.UploadFailed}>
  //       <span>上传失败</span>
  //       {/*<FComponentsLib.FTextBtn*/}
  //       {/*  type='primary'*/}
  //       {/*  onClick={() => {*/}
  //
  //       {/*  }}>*/}
  //       {/*  <RedoOutlined />*/}
  //       {/*</FComponentsLib.FTextBtn>*/}
  //     </div>)
  //   }
  // </div>);
}

export default Task;
