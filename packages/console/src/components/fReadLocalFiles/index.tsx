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
        // console.log(fileList, 'fReadLocalFiles onReadonReadonReadonReadonReadonReadonRead');
        resolve(fileList);
        root.unmount();
        div.remove();
      }}
      onCancel={() => {
        // console.log('fReadLocalFiles onCancelonCancelonCancelonCancelonCancelonCancel');
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

  onCancel?(): void;
}

function ReadFiles({ multiple, accept, onRead, onCancel }: ReadFilesProps) {

  const refDiv = React.useRef<any>();
  const uploaderContainer = React.useRef<any>();

  AHooks.useMount(() => {
    refDiv.current.click();
    // self.document.getElementById('read-file-root')
    uploaderContainer.current
      ?.querySelector('input[type=file]')
      ?.addEventListener('cancel', (event: any) => {
        // 处理取消事件的逻辑
        // console.log('cancel cancel dfcancel');
        onCancel && onCancel();
      });
  });

  // AHooks.useTimeout(() => {
  //   // console.log(uploader.current, '##############');
  //
  //   //   .addEventListener('cancel', (event: any) => {
  //   //   // 处理取消事件的逻辑
  //   //   console.log('cancel cancel dfcancel');
  //   // });
  //
  //
  //   // console.log(input, 'input w34098uijfosdkfjsdl;kjflkjlk');
  // }, 1000);

  // function close() {
  //   setTimeout(() => {
  //     onClose && onClose();
  //   }, 1000);
  // }

  return (<div
    style={{ width: 0, height: 0, overflow: 'hidden' }}
    ref={uploaderContainer}
  >
    <Upload
      // openFileDialogOnClick={true}
      // ref={uploaderContainer}
      multiple={multiple}
      accept={accept}
      showUploadList={false}
      beforeUpload={(file: RcFile, fileList: RcFile[]) => {
        // console.log(fileList, 'fildiosdfjhlksdjflksdjflsdjflkdsjflkjsdlkfjlksdjflsdjflkjkkkkkkkkj');
        onRead && onRead(fileList);
        // close();
        return false;
      }}
      openFileDialogOnClick
    >
      <div
        ref={refDiv}
        // onClick={() => {
        //   self.addEventListener(
        //     'focus',
        //     () => {
        //       close();
        //     },
        //     { once: true },
        //   );
        // }}
      />
    </Upload>
  </div>);
}
