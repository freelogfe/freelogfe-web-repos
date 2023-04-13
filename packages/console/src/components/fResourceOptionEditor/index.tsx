import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FResourcePropertyEditorDrawer from './FResourceOptionEditorDrawer';
import FResourceOptionEditorDrawer from './FResourceOptionEditorDrawer';

interface fResourceOptionEditorProps {
  disabledKeys: string[];
  disabledNames: string[];
  defaultData?: {
    key: string;
    name: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
    description: string;
  } | null;
  noneEditableFields?: Array<'key' | 'name' | 'description' | 'type' | 'input' | 'select'>;
}

type ReturnData = {
  key: string;
  name: string;
  type: 'input' | 'select';
  input: string;
  select: string[];
  description: string;
} | null;

function fResourceOptionEditor({
                                 disabledKeys,
                                 disabledNames,
                                 defaultData,
                                 noneEditableFields = [],
                               }: fResourceOptionEditorProps): Promise<ReturnData> {
  return new Promise<ReturnData>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render(<FResourceOptionEditorDrawer
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
        }, 300);
      }}
    />);
  });

}

export default fResourceOptionEditor;
