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
import {uploadFile} from '@/services/storages';
import {Canceler} from "axios";
import {StorageHomePageModelState} from "@/models/storageHomePage";

interface TaskProps {
  // file: RcFile;
  // name: string;
  // sameName?: boolean;
  info: StorageHomePageModelState['uploadTaskQueue'][number];
  allObjectNames: string[];

  onSuccess?({objectName, sha1}: { objectName: string; sha1: string; }): void;
}

interface TaskStates {
  status: 'uploading' | 'success' | 'canceled' | 'failed' | 'sameName';
  progress: number;
}

let cancels: Map<string, Canceler> = new Map<string, Canceler>();

function Task({info: {name, file, sha1, exist}, allObjectNames, onSuccess}: TaskProps) {

  const [status, setStatus] = React.useState<TaskStates['status']>('uploading');
  const [progress, setProgress] = React.useState<TaskStates['progress']>(0);

  React.useEffect(() => {
    // if (sameName) {
    //   return setStatus('sameName');
    // }

    verifySameName();
    return () => {
      const c = cancels.get(file.uid);
      c && c();
      cancels.delete(file.uid);
    };
  }, []);

  function verifySameName() {
    if (allObjectNames.includes(name)) {
      setStatus('sameName');
      return;
    }
    startUploadFile();
  }

  async function startUploadFile() {
    if (exist) {
      setStatus('success');
      onSuccess && onSuccess({objectName: name, sha1: sha1});
      return;
    }
    const [promise, cancel]: any = uploadFile({file}, {
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
      onSuccess && onSuccess({objectName: name, sha1: data.sha1});
    } catch (e) {
      if (status !== 'uploading') {
        setStatus('failed');
      }
    }
  }

  return (<div className={styles.taskItem}>
    <div className={styles.taskInfo}>
      <FContentText text={name} singleRow={true}/>
      <div style={{height: 2}}/>
      <FContentText
        text={humanizeSize(file.size)}
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
