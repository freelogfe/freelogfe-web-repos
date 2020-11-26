import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import Uploading from '../Uploading';
import UploadSuccess from '../UploadSuccess';
import UploadCancel from '../UploadCancel';
import UploadSameName from '../UploadSameName';
import UploadFailed from '../UploadFailed';
import {RcFile} from 'antd/lib/upload/interface';
import {humanizeSize} from '@/utils/format';
import {batchObjectList, BatchObjectListParamsType, uploadFile} from '@/services/storages';
import {Canceler} from "axios";
import {StorageHomePageModelState} from "@/models/storageHomePage";

interface TaskProps {
  file: StorageHomePageModelState['uploadTaskQueue'][number];
  bucketName: string;

  onSucceed?({uid, objectName, sha1}: { uid: string; objectName: string; sha1: string; }): void;

  onFail?({uid, objectName}: { uid: string; objectName: string; }): void;
}

interface TaskStates {
  status: 'uploading' | 'success' | 'canceled' | 'failed' | 'sameName';
  progress: number;
}

let cancels: Map<string, Canceler> = new Map<string, Canceler>();

function Task({
                file, bucketName,
                onSucceed, onFail
              }: TaskProps) {

  const [status, setStatus] = React.useState<TaskStates['status']>('uploading');
  const [progress, setProgress] = React.useState<TaskStates['progress']>(0);

  React.useEffect(() => {

    if (file.sameName) {
      setStatus('sameName');
      onFail && onFail({uid: file.uid, objectName: file.name});
      return;
    }
    startUploadFile();

    return () => {
      const c = cancels.get(file.uid);
      c && c();
      cancels.delete(file.uid);
    };
  }, []);

  async function verifySameName() {
    const params1: BatchObjectListParamsType = {
      fullObjectNames: bucketName + '/' + file.name,
      projection: 'objectId,objectName',
    };
    const {data: data1} = await batchObjectList(params1);
    // console.log(data1, 'dddd09283jadfslk');
    if (data1.length === 0) {
      startUploadFile();
    } else {
      setStatus('sameName');
    }
  }

  async function startUploadFile() {
    if (file.exist) {
      setStatus('success');
      onSucceed && onSucceed({uid: file.uid, objectName: file.name, sha1: file.sha1});
      return;
    }
    const [promise, cancel]: any = uploadFile({file: file.file}, {
      onUploadProgress(progressEvent) {
        setProgress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
      },
    }, true);

    cancels.set(file.uid, cancel);
    setStatus('uploading');
    setProgress(0);
    try {
      const {data} = await promise;
      setStatus('success');
      onSucceed && onSucceed({uid: file.uid, objectName: file.name, sha1: data.sha1});
    } catch (e) {
      if (status !== 'uploading') {
        setStatus('failed');
        onFail && onFail({uid: file.uid, objectName: file.name});
      }
    }
  }

  return (<div className={styles.taskItem}>
    <div className={styles.taskInfo}>
      <FContentText
        text={file.name}
        singleRow={true}
      />
      <div style={{height: 2}}/>
      <FContentText
        text={humanizeSize(file.file.size)}
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
          onFail && onFail({uid: file.uid, objectName: file.name});
        }}
      />)
    }
    {
      status === 'success' && (<UploadSuccess/>)
    }
    {
      status === 'canceled' && (<UploadCancel onClick={() => {
        verifySameName();
      }}/>)
    }
    {
      status === 'sameName' && (<UploadSameName onClick={() => {
        startUploadFile();
        // verifySameName();
      }}/>)
    }
    {
      status === 'failed' && (<UploadFailed onClick={() => {
        verifySameName();
      }}/>)
    }
  </div>);
}

export default Task;

// interface TaskInfo {
//   uid: string;
//   file: RcFile;
//   state: 'uploading' | 'success' | 'canceled' | 'failure' | ' duplication';
//   canceler: Canceler;
//   progress: number;
// }
