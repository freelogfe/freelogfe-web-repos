import * as React from 'react';
import styles from './index.less';
import { RcFile } from 'antd/lib/upload/interface';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { Progress, Space } from 'antd';
import { CheckCircleFilled, CloseOutlined, RedoOutlined } from '@ant-design/icons';
import * as AHooks from 'ahooks';
import { getFilesSha1Info } from '@/utils/service';
import { Canceler } from 'axios';
import UploadCancel from '@/components/FStorageUploadTasksPanel/UploadCancel';

interface TaskProps {
  file: RcFile;
  resourceTypeCode: string;

  onSuccess?(value: {
    uid: string;
    name: string;
    sha1: string;
  }): void;

  onFail?(value: {
    uid: string;
    name: string;
    sha1: string;
  }): void;
}

function Task({ file, resourceTypeCode, onSuccess, onFail }: TaskProps) {
  const canceler = React.useRef<Canceler | null>(null);
  const [$taskState, set$taskState, get$taskState] = FUtil.Hook.useGetState<'loading' | 'uploading' | 'parsing' | 'success' | 'failed' >('loading');
  const [$progress, set$progress, get$progress] = FUtil.Hook.useGetState<number>(0);

  AHooks.useMount(async () => {

    const fileSha1: string = await FUtil.Tool.getSHA1Hash(file);
    const params0: Parameters<typeof FServiceAPI.Storage.fileIsExist>[0] = {
      sha1: fileSha1,
    };
    const { data: data_fileIsExist } = await FServiceAPI.Storage.fileIsExist(params0);

    if (!data_fileIsExist[0].isExisting) {
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

      try {
        const { data } = await promise;
      } catch (e) {
        onFail && onFail({
          uid: file.uid,
          name: file.name,
          sha1: fileSha1,
        });
        return;
      }
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
    });
  });

  AHooks.useUnmount(() => {

  });

  return (<div className={styles.taskItem}>
    <div className={styles.taskInfo}>
      <FComponentsLib.FContentText
        text={file.name}
        singleRow={true}
      />
      <div style={{ height: 2 }} />
      <FComponentsLib.FContentText
        text={FUtil.Format.humanizeSize(file.size)}
      />
    </div>

    {
      $taskState === 'loading' && (<FComponentsLib.FTextBtn>加载中...</FComponentsLib.FTextBtn>)
    }

    {
      $taskState === 'parsing' && (<FComponentsLib.FTextBtn>解析中...</FComponentsLib.FTextBtn>)
    }
    {/*{*/}
    {/*  $taskState === 'uploading' && (<Uploading*/}
    {/*    progress={progress}*/}
    {/*    cancel={() => {*/}
    {/*      canceler.current && canceler.current();*/}
    {/*      set_taskState('canceled');*/}
    {/*      set_progress(0);*/}
    {/*      onFail && onFail({ uid: task.uid, objectName: task.name });*/}
    {/*    }}*/}
    {/*  />)*/}
    {/*}*/}
    {
      $taskState === 'uploading' && (<div className={styles.Uploading}>
        <Space
          className={styles.status}
          size={10}
        >
          <FComponentsLib.FContentText text={$progress + '%'} />
          <div style={{ width: 100 }}>
            <Progress
              type={'line'}
              percent={$progress}
              showInfo={false}
            />
          </div>
        </Space>
        <div className={styles.action}>
          <FComponentsLib.FTextBtn
            type='default'
            onClick={async () => {
              set$taskState('failed');
              canceler.current && canceler.current();
              // const fileSha1: string = await FUtil.Tool.getSHA1Hash(file);
              // onFail && onFail({
              //   uid: file.uid,
              //   name: file.name,
              //   sha1: fileSha1,
              // });
            }}
            disabled={$progress === 100}
          >
            <CloseOutlined />
          </FComponentsLib.FTextBtn>
        </div>
      </div>)
    }
    {/*{*/}
    {/*  $taskState === 'success' && (<UploadSuccess />)*/}
    {/*}*/}
    {
      $taskState === 'success' && (<div className={styles.UploadSuccess}>
        <div>上传成功</div>
        <CheckCircleFilled />
      </div>)
    }
    {/*{*/}
    {/*  $taskState === 'canceled' && (<UploadCancel*/}
    {/*    onClick={async () => {*/}
    {/*      // console.log('的尺寸的方式打发士大夫');*/}
    {/*      // await verifySameName();*/}
    {/*    }}*/}
    {/*  />)*/}
    {/*}*/}
    {/*{*/}
    {/*  taskState === 'sameName' && (<UploadSameName*/}
    {/*    onClick={async () => {*/}
    {/*      // console.log('startUploadFile we9oifjsdkifjsdl;fjlksdjflk');*/}
    {/*      await startUploadFile();*/}
    {/*    }}*/}
    {/*  />)*/}
    {/*}*/}
    {/*{*/}
    {/*  $taskState === 'failed' && (<UploadFailed*/}
    {/*    onClick={async () => {*/}
    {/*      await verifySameName();*/}
    {/*    }}*/}
    {/*  />)*/}
    {/*}*/}
    {
      $taskState === 'failed' && (<div className={styles.UploadFailed}>
        <span>上传失败</span>
        {/*<FComponentsLib.FTextBtn*/}
        {/*  type='primary'*/}
        {/*  onClick={() => {*/}

        {/*  }}>*/}
        {/*  <RedoOutlined />*/}
        {/*</FComponentsLib.FTextBtn>*/}
      </div>)
    }
  </div>);
}

export default Task;
