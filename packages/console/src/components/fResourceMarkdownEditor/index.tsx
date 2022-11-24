import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import { MarkdownEditor } from './FResourceMarkdownEditorModal';
import * as AHooks from 'ahooks';
import { getDependences } from './FResourceMarkdownEditorModal/custom/dom/resource/utils';

interface fResourceMarkdownEditorProps {
  resourceID: string;

  onChange_Saved?(saved: boolean): void;
}

function fResourceMarkdownEditor({ resourceID, onChange_Saved }: fResourceMarkdownEditorProps): Promise<null> {
  return new Promise<null>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render(<BufferModal
      resourceID={resourceID}
      onChange_Saved={(saved) => {
        onChange_Saved && onChange_Saved(saved);
      }}
      onClose={() => {
        resolve(null);
        setTimeout(() => {
          root.unmount();
        }, 300);
      }}
    />);
  });
}

export default fResourceMarkdownEditor;

interface BufferModalProps {
  resourceID: string;

  onChange_Saved?(saved: boolean): void;

  onClose?(): void;
}

function BufferModal({ resourceID, onChange_Saved, onClose }: BufferModalProps) {

  const [visible, set_visible] = React.useState<boolean>(false);

  AHooks.useMount(() => {
    setTimeout(() => {
      set_visible(true);
    }, 30);
  });

  return (<MarkdownEditor
    resourceId={resourceID}
    show={visible}
    setSaved={(saved) => {
      onChange_Saved && onChange_Saved(saved);
    }}
    close={() => {
      set_visible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300);
    }}
  />);
}

export async function getDependenciesBySha1(sha1: string): Promise<string[]> {
  return await getDependences(sha1);
}
