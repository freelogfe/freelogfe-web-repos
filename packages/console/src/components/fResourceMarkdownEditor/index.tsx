import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import { MarkdownEditor } from './FResourceMarkdownEditorModal';

interface fResourceMarkdownEditorProps {
  resourceID: string;

  onChange_Saved?(saved: boolean): void;
}

function fResourceMarkdownEditor({ resourceID, onChange_Saved }: fResourceMarkdownEditorProps): Promise<null> {
  return new Promise<null>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render(<MarkdownEditor
      resourceId={resourceID}
      show={true}
      setSaved={(saved) => {
        onChange_Saved && onChange_Saved(saved);
      }}
      close={() => {
        resolve(null);
        setTimeout(() => {
          root.unmount();
        }, 1000);
      }}
    />);
  });
}

export default fResourceMarkdownEditor;
