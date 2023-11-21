import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
// import FResourcePropertyEditorDrawer from '@/components/fResourcePropertyEditor/FResourcePropertyEditorDrawer';
import ResourceTypeInputDrawer from './ResourceTypeInputDrawer';

type ReturnDataType = {
  value: string;
  labels: string[];
  customInput?: string;
} | null;

interface fResourceTypeInputDrawerProps {

}

function fResourceTypeInputDrawer({}: fResourceTypeInputDrawerProps = {}): Promise<ReturnDataType> {
  return new Promise<ReturnDataType>((resolve) => {
    const drawerRoot: HTMLDivElement | null = self.document.getElementById('drawer-root') as HTMLDivElement;
    const rootDiv: HTMLDivElement = self.document.createElement('div');
    drawerRoot.appendChild(rootDiv);
    const root = ReactDOM.createRoot(rootDiv);
    return root.render(<ResourceTypeInputDrawer
      onOk={(obj) => {
        resolve(obj);
      }}
      onClose={() => {
        resolve(null);
        setTimeout(() => {
          root.unmount();
          rootDiv.remove();
        }, 300);
      }}
    />);
  });
}

export default fResourceTypeInputDrawer;
