import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import Uploading from '../Uploading';
import UploadSuccess from '../UploadSuccess';
import UploadCancel from '../UploadCancel';
import UploadSameName from '../UploadSameName';
import UploadFailed from '../UploadFailed';
import {humanizeSize} from '@/utils/format';
import {Canceler} from "axios";
import {StorageHomePageModelState} from "@/models/storageHomePage";
import {FApiServer} from "@/services";
import {Modal, Space} from "antd";
import {FWarning} from "@/components/FIcons";
import {i18nMessage} from "@/utils/i18n";

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
    const params1: Parameters<typeof FApiServer.Storage.batchObjectList>[0] = {
      fullObjectNames: bucketName + '/' + file.name,
      projection: 'objectId,objectName',
    };
    const {data: data1} = await FApiServer.Storage.batchObjectList(params1);
    // console.log(data1, 'dddd09283jadfslk');
    if (data1.length === 0) {
      startUploadFile();
    } else {
      setStatus('sameName');
    }
  }

  async function startUploadFile(isVerifyTypeCompatible: boolean = false) {
    if (file.exist) {
      if (isVerifyTypeCompatible) {
        if (await verifyTypeCompatible({
          objectName: bucketName + '/' + file.name,
          sha1: file.sha1,
        })) {
          setStatus('success');
          onSucceed && onSucceed({uid: file.uid, objectName: file.name, sha1: file.sha1});
        } else {
          Modal.confirm({
            icon: null,
            content: (<Space size={10}>
              <FWarning style={{display: 'inline-block'}}/>
              <span>文件格式与对象的资源类型冲突，更新操作将会清空对象的各项设置，包括资源类型、依赖、自定义属性、自定义选项等，是否继续？</span>
            </Space>),
            onOk() {
              setStatus('success');
              onSucceed && onSucceed({uid: file.uid, objectName: file.name, sha1: file.sha1});
            },
          });
        }
      } else {
        setStatus('success');
        onSucceed && onSucceed({uid: file.uid, objectName: file.name, sha1: file.sha1});
      }

    } else {
      const params: Parameters<typeof FApiServer.Storage.uploadFile>[0] = {
        file: file.file
      };
      const [promise, cancel]: any = FApiServer.Storage.uploadFile(params, {
        onUploadProgress(progressEvent) {
          setProgress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
        },
      }, true);

      cancels.set(file.uid, cancel);
      setStatus('uploading');
      setProgress(0);
      try {
        const {data} = await promise;

        if (isVerifyTypeCompatible) {
          if (await verifyTypeCompatible({
            objectName: bucketName + '/' + file.name,
            sha1: file.sha1,
          })) {
            setStatus('success');
            onSucceed && onSucceed({uid: file.uid, objectName: file.name, sha1: file.sha1});
          } else {
            Modal.confirm({
              icon: null,
              content: (<Space size={10}>
                <FWarning style={{display: 'inline-block'}}/>
                <span>文件格式与对象的资源类型冲突，更新操作将会清空对象的各项设置，包括资源类型、依赖、自定义属性、自定义选项等，是否继续？</span>
              </Space>),
              onOk() {
                setStatus('success');
                onSucceed && onSucceed({uid: file.uid, objectName: file.name, sha1: file.sha1});
              },
              onCancel() {
                setStatus('failed');
              },
            });
          }
        } else {
          setStatus('success');
          onSucceed && onSucceed({uid: file.uid, objectName: file.name, sha1: file.sha1});
        }
        // setStatus('success');
        // onSucceed && onSucceed({uid: file.uid, objectName: file.name, sha1: data.sha1});
      } catch (e) {
        if (status !== 'uploading') {
          setStatus('failed');
          onFail && onFail({uid: file.uid, objectName: file.name});
        }
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
        startUploadFile(true);
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

interface VerifyTypeCompatibleParamsType {
  objectName: string;
  sha1: string;
}

async function verifyTypeCompatible({objectName, sha1}: VerifyTypeCompatibleParamsType): Promise<boolean> {
  const params: Parameters<typeof FApiServer.Storage.objectDetails>[0] = {
    objectIdOrName: objectName,
  };

  const {data} = await FApiServer.Storage.objectDetails(params);
  if (!data.resourceType) {
    return true;
  }

  const params1: Parameters<typeof FApiServer.Storage.fileProperty>[0] = {
    sha1: sha1,
    resourceType: data.resourceType,
  };

  const {data: data1} = await FApiServer.Storage.fileProperty(params1);
  return !!data1;
}
