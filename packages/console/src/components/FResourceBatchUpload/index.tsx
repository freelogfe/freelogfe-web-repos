import * as React from 'react';
import styles from './index.less';
import { FUtil } from '@freelog/tools-lib';
import { RcFile } from 'antd/lib/upload/interface';
import Task from './Task';
import * as AHooks from 'ahooks';

interface FResourceBatchUploadProps {
  resourceTypeCode: string;
  resourceType: string[];

  onFinish?(finishFiles: {
    uid: string;
    name: string;
    sha1: string;
    error: string;
  }[]): void;
}

interface TaskHandler {
  addTask(files: RcFile[]): void;
}

let taskHandler: TaskHandler | null = null;

function FResourceBatchUpload({ resourceTypeCode, resourceType, onFinish }: FResourceBatchUploadProps) {

  const [$files, set$files, get$files] = FUtil.Hook.useGetState<RcFile[]>([]);

  const [$finishFiles, set$finishFiles, get$finishFiles] = FUtil.Hook.useGetState<{
    uid: string;
    name: string;
    sha1: string;
    error: string;
  }[]>([]);
  // const [$failFiles, set$failFiles, get$failFiles] = FUtil.Hook.useGetState<{
  //   uid: string;
  //   name: string;
  //   sha1: string;
  // }[]>([]);

  AHooks.useMount(() => {
    const panel = {
      addTask,
    };
    taskHandler = panel;
  });

  AHooks.useUnmount(() => {
    taskHandler = null;
  });

  AHooks.useDebounceEffect(() => {
    if (get$files().length > 0 && (get$finishFiles().length === get$files().length)) {
      const finishFile = get$files().map((f) => {
        return get$finishFiles().find((file) => {
          return file.uid === f.uid;
        }) || { uid: '', name: '', sha1: '', error: '' };
      }).filter((f) => {
        return f.error !== '取消上传';
      });
      if (finishFile.length > 0) {
        onFinish && onFinish(finishFile);
      }
      set$files([]);
      // set$failFiles([]);
      set$finishFiles([]);
    }
  }, [$files, $finishFiles], {
    wait: 300,
  });

  function addTask(files: RcFile[]) {
    set$files([
      ...get$files(),
      ...files,
    ]);
  }

  return (<div>
    {
      $files.map((file) => {
        // console.log(file, 'sdFSDFSDFSDFSAFsdfsdalkjflkjl');
        return (<Task
          resourceTypeCode={resourceTypeCode}
          resourceType={resourceType}
          key={file.uid}
          file={file}
          onFail={(value) => {
            // console.log(value, 'value sdifjsdlkjflksdjflkjl');
            set$finishFiles([
              ...get$finishFiles(),
              {
                ...value,
                error: value.reason,
              },
            ]);
            // console.log(get$failFiles(), 'get$failFiles() sdjflksdjlfkjlkjl');
          }}
          onSuccess={(value) => {
            // console.log(value, 'value sdifjsldkfjlksdjfklsdjlkfjlkj');
            set$finishFiles([
              ...get$finishFiles(),
              {
                ...value,
                error: '',
              },
            ]);
          }}
        />);
      })
    }
  </div>);
}

export default FResourceBatchUpload;

export async function getTaskHandler(): Promise<TaskHandler> {
  while (true) {
    if (taskHandler) {
      return taskHandler;
    }
    await FUtil.Tool.promiseSleep(300);
  }
}
