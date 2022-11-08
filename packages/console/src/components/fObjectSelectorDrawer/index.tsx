import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FObjectSelectorDrawer from './FObjectSelectorDrawer';

interface fObjectSelectorDrawerProps {

}

type ReturnData = { objID: string; objName: string; sha1: string } | null;

function fObjectSelectorDrawer({}: fObjectSelectorDrawerProps = {}): Promise<ReturnData> {
  return new Promise<ReturnData>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render((<FObjectSelectorDrawer
      onSelect={(obj) => {
        resolve(obj);
      }}
      onClose={() => {
        resolve(null);
        setTimeout(() => {
          root.unmount();
        }, 300);
      }}
    />));
  });

}

export default fObjectSelectorDrawer;
