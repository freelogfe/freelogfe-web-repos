import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ComicTool } from './FComicToolModal';
import * as AHooks from 'ahooks';

interface fComicToolProps {
  resourceID: string;

  onChange_Saved?(saved: boolean): void;
}

function fComicTool({ resourceID, onChange_Saved }: fComicToolProps): Promise<null> {
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

export default fComicTool;

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

  return (<ComicTool
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
