import * as React from 'react';
import styles from './index.less';
import { FUtil } from '@freelog/tools-lib';
import { RcFile } from 'antd/lib/upload/interface';
import Task from './Task';
import * as AHooks from 'ahooks';

interface FResourceBatchUploadProps {
  resourceTypeCode: string;

  onSuccess?(successFiles: {
    uid: string;
    name: string;
    sha1: string;
  }[]): void;
}

interface TaskHandler {
  addTask(files: RcFile[]): void;
}

let taskHandler: TaskHandler | null = null;

function FResourceBatchUpload({ resourceTypeCode, onSuccess }: FResourceBatchUploadProps) {

  const [$files, set$files, get$files] = FUtil.Hook.useGetState<RcFile[]>([]);

  const [$successFiles, set$successFiles, get$successFiles] = FUtil.Hook.useGetState<{
    uid: string;
    name: string;
    sha1: string;
  }[]>([]);
  const [$failFiles, set$failFiles, get$failFiles] = FUtil.Hook.useGetState<{
    uid: string;
    name: string;
    sha1: string;
  }[]>([]);

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
    if (get$files().length > 0 && (get$successFiles().length + get$failFiles().length === get$files().length)) {
      onSuccess && onSuccess(get$successFiles());
      set$files([]);
      set$failFiles([]);
      set$successFiles([]);
    }

    if (get$files().length > 0 && get$failFiles().length === get$files().length) {
      set$files([]);
      set$failFiles([]);
      set$successFiles([]);
    }
  }, [$files, $successFiles, $failFiles], {
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
          key={file.uid}
          file={file}
          onFail={(value) => {
            // console.log(value, 'value sdifjsdlkjflksdjflkjl');
            set$failFiles([
              ...get$failFiles(),
              value,
            ]);
            // console.log(get$failFiles(), 'get$failFiles() sdjflksdjlfkjlkjl');
          }}
          onSuccess={(value) => {
            // console.log(value, 'value sdifjsldkfjlksdjfklsdjlkfjlkj');
            set$successFiles([
              ...get$successFiles(),
              value,
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