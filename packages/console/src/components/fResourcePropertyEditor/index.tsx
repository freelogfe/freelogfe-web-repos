import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FResourcePropertyEditorDrawer from './FResourcePropertyEditorDrawer';

interface fResourcePropertyEditorProps {
  disabledKeys: string[];
  disabledNames: string[];
  defaultData?: {
    key: string;
    name: string;
    value: string;
    description: string;
  } | null;
  noneEditableFields?: Array<'key' | 'name' | 'value' | 'description'>;
}

type ReturnData = {
  key: string;
  name: string;
  value: string;
  description: string;
} | null;

function fResourcePropertyEditor({
                                   disabledKeys,
                                   disabledNames,
                                   defaultData,
                                   noneEditableFields = [],
                                 }: fResourcePropertyEditorProps): Promise<ReturnData> {
  return new Promise<ReturnData>((resolve) => {
    const drawerRoot: HTMLDivElement | null = self.document.getElementById('drawer-root') as HTMLDivElement;
    const rootDiv: HTMLDivElement = self.document.createElement('div');
    drawerRoot.appendChild(rootDiv);
    const root = ReactDOM.createRoot(rootDiv);
    return root.render(<FResourcePropertyEditorDrawer
      defaultData={defaultData || null}
      disabledKeys={disabledKeys}
      disabledNames={disabledNames}
      noneEditableFields={noneEditableFields}
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

export default fResourcePropertyEditor;
