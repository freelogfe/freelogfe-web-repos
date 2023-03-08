import * as React from 'react';
import styles from './index.less';
import Uploading from '../Uploading';
import UploadSuccess from '../UploadSuccess';
import UploadCancel from '../UploadCancel';
import UploadSameName from '../UploadSameName';
import UploadFailed from '../UploadFailed';
import { Canceler } from 'axios';
// import { StorageHomePageModelState } from '@/models/storageHomePage';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { getFilesSha1Info } from '@/utils/service';
import * as AHooks from 'ahooks';
import { RcFile } from 'antd/lib/upload/interface';

interface TaskProps {
  task: {
    uid: string;
    file: RcFile
    name: string;
    state: 'loading' | 'success' | 'failed';
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
    // const startTime = Date.now();
    fileSha1.current = await getSHA1Hash(task.file);
    console.log(fileSha1.current, 'fileSha1.currentsdifjsldkfjlkj');
    // const endTime = Date.now();
    // console.log(endTime - startTime, '*(**(*(***********(9999999');
    await verifySameName();
  });

  // React.useEffect(() => {
  //   // if (file.sameName) {
  //   //   setStatus('sameName');
  //   //   onFail && onFail({ uid: file.uid, objectName: file.name });
  //   //   return;
  //   // }
  //   if (task.state === 'uploading') {
  //     startUploadFile();
  //   }
  //
  //   if (task.state === 'loading') {
  //     verifySameName();
  //   }
  //
  // }, [task]);

  AHooks.useUnmount(() => {
    // const cancel = canceler.current.get(task.uid);
    canceler.current && canceler.current();
    // cancels.current.delete(task.uid);
  });

  async function verifySameName() {
    // console.log(file, 'file9iojslkfjdslfkjsdlfkjsdlkfjl');
    const params1: Parameters<typeof FServiceAPI.Storage.batchObjectList>[0] = {
      // .replace(new RegExp(/\\|\/|:|\*|\?|"|<|>|\||@|#|\$|\s/, 'g'), '_')
      fullObjectNames: bucketName + '/' + task.name,
      projection: 'objectId,objectName',
    };
    const { data: data1 } = await FServiceAPI.Storage.batchObjectList(params1);
    // console.log(data1, 'dddd09283jadfslk');
    if (data1.length === 0) {
      set_taskState('uploading');
      await startUploadFile();
    } else {
      set_taskState('sameName');
    }
  }

  // async function startUploadFile(isVerifyTypeCompatible: boolean = false) {
  async function startUploadFile() {

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

      // cancels.set(file.uid, cancel);
      canceler.current = cancel;
      // setStatus('uploading');
      set_progress(0);
      try {
        const { data } = await promise;
        // setStatus('success');
        // onSucceed && onSucceed({ uid: file.uid, objectName: file.name, sha1: file.sha1 });
      } catch (e) {
        if (taskState !== 'uploading') {
          set_taskState('failed');
          set_progress(0);
          onFail && onFail({ uid: task.uid, objectName: task.name });
          return;
        }
      }
    }

    const { result } = await getFilesSha1Info({
      sha1: [fileSha1.current],
    });

    if (result[0].state === 'success') {
      set_taskState('success');
      set_progress(0);
      onSucceed && onSucceed({ uid: task.uid, objectName: task.name, sha1: fileSha1.current });
      return;
    }
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
      taskState === 'loading' && (<FComponentsLib.FIcons.FLoading />)
    }
    {
      taskState === 'uploading' && (<Uploading
        progress={progress}
        cancel={() => {
          // console.log(name, file, cancels, '#########');
          // const c = canceler.get(file.uid);
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
      taskState === 'canceled' && (<UploadCancel onClick={async () => {
        await verifySameName();
      }} />)
    }
    {
      taskState === 'sameName' && (<UploadSameName onClick={async () => {
        await startUploadFile();
      }} />)
    }
    {
      taskState === 'failed' && (<UploadFailed onClick={async () => {
        await verifySameName();
      }} />)
    }
  </div>);
}

export default Task;

// interface VerifyTypeCompatibleParamsType {
//   objectName: string;
//   sha1: string;
// }

// async function verifyTypeCompatible({ objectName, sha1 }: VerifyTypeCompatibleParamsType): Promise<boolean> {
//   const params: Parameters<typeof FServiceAPI.Storage.objectDetails>[0] = {
//     objectIdOrName: objectName,
//   };
//
//   const { data } = await FServiceAPI.Storage.objectDetails(params);
//   if (!data.resourceType) {
//     return true;
//   }
//
//   const params1: Parameters<typeof FServiceAPI.Storage.fileProperty>[0] = {
//     sha1: sha1,
//     resourceType: data.resourceType,
//   };
//
//   const { data: data1 } = await FServiceAPI.Storage.fileProperty(params1);
//   return !!data1;
// }

function getSHA1Hash(file: File): Promise<string> {
  // /static/banner1.1d11598d.png
  return new Promise(async (resolve) => {
    const worker = new Worker('/js/getSHA1Hash.js');
    const ab: ArrayBuffer = await file.arrayBuffer();
    worker.postMessage(ab, [ab]);

    worker.addEventListener('message', (e) => {
      resolve(e.data.sha1);
      worker.terminate();
    });
  });

}
