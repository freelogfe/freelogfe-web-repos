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
                                 }: fResourcePropertyEditorProps): Promise<ReturnData> {
  return new Promise<ReturnData>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render(<FResourcePropertyEditorDrawer
      defaultData={defaultData || null}
      disabledKeys={disabledKeys}
      disabledNames={disabledNames}
      onOk={(obj) => {
        resolve(obj);
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

export default fResourcePropertyEditor;
