import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FObjectSelectorDrawer from './FObjectsSelectorDrawer';

interface fObjectsSelectorDrawerProps {
  resourceTypeCode: string;
}

function fObjectsSelectorDrawer({ resourceTypeCode }: fObjectsSelectorDrawerProps): Promise<string[] | null> {
  return new Promise<string[] | null>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render((<FObjectSelectorDrawer
      resourceTypeCode={resourceTypeCode}
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

export default fObjectsSelectorDrawer;
