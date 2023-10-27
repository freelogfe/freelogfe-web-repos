import * as React from 'react';
import styles from './index.less';
import Uploading from '../Uploading';
import UploadSuccess from '../UploadSuccess';
import UploadCancel from '../UploadCancel';
import UploadSameName from '../UploadSameName';
import UploadFailed from '../UploadFailed';
import { Canceler } from 'axios';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { getFilesSha1Info } from '@/utils/service';
import * as AHooks from 'ahooks';
import type { RcFile } from 'antd/lib/upload';
// import fileSha1Queue from '@/utils/FileSha1Queue';

interface TaskProps {
  task: {
    uid: string;
    file: RcFile
    name: string;
    state: 'loading' | 'success' | 'failed' | 'cancel';
  };
  bucketName: string;

  onSucceed?({ uid, objectName, sha1 }: { uid: string; objectName: string; sha1: string; }): void;

  onFail?({ uid, objectName }: { uid: string; objectName: string; }): void;
}

interface TaskStates {
  taskState: 'loading' | 'uploading' | 'success' | 'sameName' | 'failed' | 'canceled';
  progress: number;
}

function Task({
                task,
                bucketName,
                onSucceed,
                onFail,
              }: TaskProps) {

  const canceler = React.useRef<Canceler | null>(null);
  const fileSha1 = React.useRef<string>('');

  const [taskState, set_taskState] = React.useState<TaskStates['taskState']>('loading');
  const [progress, set_progress] = React.useState<TaskStates['progress']>(0);

  AHooks.useMount(async () => {
    fileSha1.current = await fileSha1Queue.getSha1(task.file);
    // fileSha1.current = await FUtil.Tool.getSHA1Hash(task.file);
    await verifySameName();
  });

  AHooks.useUnmount(() => {
    canceler.current && canceler.current();
  });

  async function verifySameName() {
    const params1: Parameters<typeof FServiceAPI.Storage.batchObjectList>[0] = {
      fullObjectNames: bucketName + '/' + task.name,
      projection: 'objectId,objectName',
    };
    const { data: data1 } = await FServiceAPI.Storage.batchObjectList(params1);
    // console.log(data1, 'dddd09283jadfslk');
    if (data1.length === 0) {
      set_taskState('uploading');
      // console.log('startUploadFile sdfu0-9w3284uroijsedflksdjflksdjlkj');
      await startUploadFile();
    } else {
      set_taskState('sameName');
    }
  }

  async function startUploadFile() {
    // console.log('startUploadFile dsff sdf sdfsdf');
    const params0: Parameters<typeof FServiceAPI.Storage.fileIsExist>[0] = {
      sha1: fileSha1.current,
    };
    const { data: data_fileIsExist } = await FServiceAPI.Storage.fileIsExist(params0);

    if (!data_fileIsExist[0].isExisting) {
      const params: Parameters<typeof FServiceAPI.Storage.uploadFile>[0] = {
        file: task.file,
      };
      const [promise, cancel]: any = FServiceAPI.Storage.uploadFile(params, {
        onUploadProgress(progressEvent) {
          set_progress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
        },
      }, true);

      canceler.current = cancel;
      set_progress(0);
      try {
        const { data } = await promise;
      } catch (e) {
        if (taskState !== 'uploading') {
          onFail && onFail({ uid: task.uid, objectName: task.name });
          return;
        }
      }
    }

    const { result } = await getFilesSha1Info({
      sha1: [fileSha1.current],
      resourceTypeCode: '',
    });

    if (result[0].state === 'success') {
      set_taskState('success');
      set_progress(0);
      onSucceed && onSucceed({ uid: task.uid, objectName: task.name, sha1: fileSha1.current });
      return;
    }
    // console.log('failed  dsifojmsdklfjsda;lfkjsdl;kfj;lksdjflsdjflkjsdlkj');
    set_taskState('failed');
    set_progress(0);
    onFail && onFail({ uid: task.uid, objectName: task.name });
  }

  return (<div className={styles.taskItem}>
    <div className={styles.taskInfo}>
      <FComponentsLib.FContentText
        text={task.name}
        singleRow={true}
      />
      <div style={{ height: 2 }} />
      <FComponentsLib.FContentText
        text={FUtil.Format.humanizeSize(task.file.size)}
      />
    </div>

    {
      taskState === 'loading' && (<FComponentsLib.FTextBtn>加载中...</FComponentsLib.FTextBtn>)
    }
    {
      taskState === 'uploading' && (<Uploading
        progress={progress}
        cancel={() => {
          canceler.current && canceler.current();
          set_taskState('canceled');
          set_progress(0);
          onFail && onFail({ uid: task.uid, objectName: task.name });
        }}
      />)
    }
    {
      taskState === 'success' && (<UploadSuccess />)
    }
    {
      taskState === 'canceled' && (<UploadCancel
        onClick={async () => {
          console.log('的尺寸的方式打发士大夫');
          await verifySameName();
        }}
      />)
    }
    {
      taskState === 'sameName' && (<UploadSameName
        onClick={async () => {
          console.log('startUploadFile we9oifjsdkifjsdl;fjlksdjflk');
          await startUploadFile();
        }}
      />)
    }
    {
      taskState === 'failed' && (<UploadFailed
        onClick={async () => {
          await verifySameName();
        }}
      />)
    }
  </div>);
}

export default Task;

// const data = [
//   {
//     key: 'fileSize',
//     name: '文件大小',
//     description: '文件占用的存储',
//     value: 1024,
//     valueUnit: 'b',
//     valueDisplay: '1kb',
//   },
// ];
