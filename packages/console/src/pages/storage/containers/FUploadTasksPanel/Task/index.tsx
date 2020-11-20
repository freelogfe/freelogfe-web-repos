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

interface TaskProps {
  file: RcFile;
  name: string;
  sameName?: boolean;

  onSuccess?({objectName, sha1}: { objectName: string; sha1: string; }): void;
}

interface TaskStates {
  status: 'uploading' | 'success' | 'canceled' | 'failed' | 'sameName';
  progress: number;
}

let cancels: {
  [key: string]: Canceler;
} = {};

function Task({name, file, sameName, onSuccess}: TaskProps) {

  const [status, setStatus] = React.useState<TaskStates['status']>('uploading');
  const [progress, setProgress] = React.useState<TaskStates['progress']>(0);
  // const [cancel, setCancel] = React.useState<Canceler | null>(null);

  React.useEffect(() => {
    startUploadFile();
  }, []);

  async function startUploadFile() {
    const [promise, cancel]: any = uploadFile({file}, {
      onUploadProgress(progressEvent) {
        setProgress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
      },
    }, true);
    // setCancel(c);
    cancels[file.uid] = cancel;

    // setTimeout(() => {
    //   c()
    // }, 2000);

    const {data} = await promise;

    setStatus('success');
    onSuccess && onSuccess({objectName: name, sha1: data.sha1});
  }

  return (<div className={styles.taskItem}>
    <div className={styles.taskInfo}>
      <FContentText text={name} singleRow={true}/>
      <div style={{height: 2}}/>
      <FContentText text={humanizeSize(file.size)}/>
    </div>
    {
      status === 'uploading' && (<Uploading
        progress={progress}
        cancel={() => {
          console.log(name, file, cancels, '#########');
          cancels[file.uid] && cancels[file.uid](file.uid)
        }}
      />)
    }
    {
      status === 'success' && (<UploadSuccess/>)
    }
    {
      status === 'canceled' && (<UploadCancel/>)
    }
    {
      status === 'sameName' && (<UploadSameName/>)
    }
    {
      status === 'failed' && (<UploadFailed/>)
    }
  </div>);
}

export default Task;

interface TaskInfo {
  uid: string;
  file: RcFile;
  state: 'uploading' | 'success' | 'canceled' | 'failure' | ' duplication';
  canceler: Canceler;
  progress: number;
}
