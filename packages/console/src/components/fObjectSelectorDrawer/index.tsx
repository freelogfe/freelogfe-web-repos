import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FObjectSelectorDrawer from './FObjectSelectorDrawer';

interface fObjectSelectorDrawerProps {
  resourceType: string[];
}

type ReturnData = {
  bucketID: string;
  bucketName: string;
  objID: string;
  objName: string;
  sha1: string
} | null;

function fObjectSelectorDrawer({ resourceType }: fObjectSelectorDrawerProps): Promise<ReturnData> {
  return new Promise<ReturnData>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render((<FObjectSelectorDrawer
      resourceType={resourceType}
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
