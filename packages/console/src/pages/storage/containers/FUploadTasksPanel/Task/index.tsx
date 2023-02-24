import * as React from 'react';
import styles from './index.less';
import Uploading from '../Uploading';
import UploadSuccess from '../UploadSuccess';
import UploadCancel from '../UploadCancel';
import UploadSameName from '../UploadSameName';
import UploadFailed from '../UploadFailed';
import { Canceler } from 'axios';
import { StorageHomePageModelState } from '@/models/storageHomePage';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { getFilesSha1Info } from '@/utils/service';
import * as AHooks from 'ahooks';

interface TaskProps {
  file: StorageHomePageModelState['uploadTaskQueue'][number];
  bucketName: string;

  onSucceed?({ uid, objectName, sha1 }: { uid: string; objectName: string; sha1: string; }): void;

  onFail?({ uid, objectName }: { uid: string; objectName: string; }): void;
}

interface TaskStates {
  status: 'uploading' | 'success' | 'canceled' | 'failed' | 'sameName';
  progress: number;
}

let cancels: Map<string, Canceler> = new Map<string, Canceler>();

function Task({
                file,
                bucketName,
                onSucceed,
                onFail,
              }: TaskProps) {

  const [status, setStatus] = React.useState<TaskStates['status']>('uploading');
  const [progress, setProgress] = React.useState<TaskStates['progress']>(0);

  React.useEffect(() => {
    if (file.sameName) {
      setStatus('sameName');
      onFail && onFail({ uid: file.uid, objectName: file.name });
      return;
    }
    startUploadFile();
  }, []);

  AHooks.useUnmount(() => {
    const c = cancels.get(file.uid);
    c && c();
    cancels.delete(file.uid);
  });

  async function verifySameName() {
    // console.log(file, 'file9iojslkfjdslfkjsdlfkjsdlkfjl');
    const params1: Parameters<typeof FServiceAPI.Storage.batchObjectList>[0] = {
      // .replace(new RegExp(/\\|\/|:|\*|\?|"|<|>|\||@|#|\$|\s/, 'g'), '_')
      fullObjectNames: bucketName + '/' + file.name,
      projection: 'objectId,objectName',
    };
    const { data: data1 } = await FServiceAPI.Storage.batchObjectList(params1);
    // console.log(data1, 'dddd09283jadfslk');
    if (data1.length === 0) {
      startUploadFile();
    } else {
      setStatus('sameName');
    }
  }

  // async function startUploadFile(isVerifyTypeCompatible: boolean = false) {
  async function startUploadFile() {
    if (!file.exist) {
      const params: Parameters<typeof FServiceAPI.Storage.uploadFile>[0] = {
        file: file.file,
      };
      const [promise, cancel]: any = FServiceAPI.Storage.uploadFile(params, {
        onUploadProgress(progressEvent) {
          setProgress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
        },
      }, true);

      cancels.set(file.uid, cancel);
      setStatus('uploading');
      setProgress(0);
      try {
        const { data } = await promise;
        // setStatus('success');
        // onSucceed && onSucceed({ uid: file.uid, objectName: file.name, sha1: file.sha1 });
      } catch (e) {
        if (status !== 'uploading') {
          setStatus('failed');
          onFail && onFail({ uid: file.uid, objectName: file.name });
          return;
        }
      }
    }

    const { result } = await getFilesSha1Info({
      sha1: [file.sha1],
    });

    if (result[0].state === 'success') {
      setStatus('success');
      onSucceed && onSucceed({ uid: file.uid, objectName: file.name, sha1: file.sha1 });
      return;
    }
    setStatus('failed');
    onFail && onFail({ uid: file.uid, objectName: file.name });
  }

  return (<div className={styles.taskItem}>
    <div className={styles.taskInfo}>
      <FComponentsLib.FContentText
        text={file.name}
        singleRow={true}
      />
      <div style={{ height: 2 }} />
      <FComponentsLib.FContentText
        text={FUtil.Format.humanizeSize(file.file.size)}
      />
    </div>
    {
      status === 'uploading' && (<Uploading
        progress={progress}
        cancel={() => {
          // console.log(name, file, cancels, '#########');
          const c = cancels.get(file.uid);
          c && c();
          setStatus('canceled');
          setProgress(0);
          onFail && onFail({ uid: file.uid, objectName: file.name });
        }}
      />)
    }
    {
      status === 'success' && (<UploadSuccess />)
    }
    {
      status === 'canceled' && (<UploadCancel onClick={() => {
        verifySameName();
      }} />)
    }
    {
      status === 'sameName' && (<UploadSameName onClick={() => {
        startUploadFile();
      }} />)
    }
    {
      status === 'failed' && (<UploadFailed onClick={() => {
        verifySameName();
      }} />)
    }
  </div>);
}

export default Task;

interface VerifyTypeCompatibleParamsType {
  objectName: string;
  sha1: string;
}

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
