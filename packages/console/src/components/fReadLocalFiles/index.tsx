import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import { Upload } from 'antd';
import { RcFile } from 'antd/lib/upload/interface';
import * as AHooks from 'ahooks';

interface FReadLocalFilesProps {
  multiple?: boolean;
  accept?: string;
}

type ReturnData = RcFile[] | null;

function fReadLocalFiles({ multiple = false, accept }: FReadLocalFilesProps = {}): Promise<ReturnData> {
  return new Promise<ReturnData>((resolve) => {
    const divRoot = document.getElementById('read-file-root') as HTMLDivElement;
    const div = document.createElement('div') as HTMLDivElement;
    divRoot.appendChild(div);
    const root = ReactDOM.createRoot(div);
    return root.render(<ReadFiles
      multiple={multiple}
      accept={accept}
      onRead={(fileList: RcFile[]) => {
        // console.log(fileList, 'fileListsdf3w2efesadrfas');
        resolve(fileList);
      }}
      onClose={() => {
        resolve(null);
        root.unmount();
        div.remove();
      }}
    />);
  });
}

export default fReadLocalFiles;

interface ReadFilesProps {
  multiple?: boolean;
  accept?: string;

  onRead?(fileList: RcFile[]): void;

  onClose?(): void;
}

function ReadFiles({ multiple, accept, onRead, onClose }: ReadFilesProps) {

  const refDiv = React.useRef<any>();

  AHooks.useMount(() => {
    refDiv.current.click();
  });

  return (<div style={{ width: 0, height: 0, overflow: 'hidden' }}>
    <Upload
      multiple={multiple}
      accept={accept}
      showUploadList={false}
      beforeUpload={(file: RcFile, fileList: RcFile[]) => {
        // console.log(fileList, 'fildiosdfjhlksdjflksdjflsdjflkdsjflkjsdlkfjlksdjflsdjflkjkkkkkkkkj');
        onRead && onRead(fileList);
        return false;
      }}
      openFileDialogOnClick
    >
      <div
        ref={refDiv}
        onClick={() => {
          self.addEventListener(
            'focus',
            () => {
              setTimeout(() => {
                onClose && onClose();
              }, 300);
            },
            { once: true },
          );
        }}
      />
    </Upload>
  </div>);
}
