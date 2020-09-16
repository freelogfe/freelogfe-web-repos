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

interface TaskProps {
  file: RcFile;
  sameName?: boolean;

  onSuccess?({fileName, sha1}: { fileName: string; sha1: string; }): void;
}

interface TaskStates {
  status: 'uploading' | 'success' | 'canceled' | 'failed' | 'sameName';
  progress: number;
}

function Task({file, sameName, onSuccess}: TaskProps) {

  const [status, setStatus] = React.useState<TaskStates['status']>('uploading');
  const [progress, setProgress] = React.useState<TaskStates['progress']>(0);

  React.useEffect(() => {
    startUploadFile();
  }, []);

  async function startUploadFile() {
    const {data} = await uploadFile({file}, {
      onUploadProgress(progressEvent) {
        setProgress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
      },
    });
    // console.log(data);
    setStatus('success');
    onSuccess && onSuccess({fileName: file.name, sha1: data.sha1});
  }

  return (<div className={styles.taskItem}>
    <div className={styles.taskInfo}>
      <FContentText text={file.name} singleRow={true}/>
      <div style={{height: 2}}/>
      <FContentText text={humanizeSize(file.size)}/>
    </div>
    {
      status === 'uploading' && (<Uploading progress={progress}/>)
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
