import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
// import FResourcePropertyEditorDrawer from './FResourceOptionEditorDrawer';
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
  hideTypeSelect?: boolean;
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
                                 hideTypeSelect = false,
                                 noneEditableFields = [],
                               }: fResourceOptionEditorProps): Promise<ReturnData> {
  return new Promise<ReturnData>((resolve) => {
    // const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    // const drawerRoot: HTMLDivElement | null = self.document.getElementById('drawer-root') as HTMLDivElement;
    // const rootDiv: HTMLDivElement = self.document.createElement('div');
    // drawerRoot.appendChild(rootDiv);

    const divRoot = self.document.body;
    const div = self.document.createElement('div') as HTMLDivElement;
    divRoot.appendChild(div);
    const root = ReactDOM.createRoot(div);
    // const root = ReactDOM.createRoot(rootDiv);
    return root.render(<FResourceOptionEditorDrawer
      defaultData={defaultData || null}
      disabledKeys={disabledKeys}
      disabledNames={disabledNames}
      noneEditableFields={noneEditableFields}
      hideTypeSelect={hideTypeSelect}
      onOk={(obj) => {
        resolve(obj);
      }}
      onClose={() => {
        resolve(null);
        setTimeout(() => {
          root.unmount();
          div.remove();
        }, .1);
      }}
    />);
  });

}

export default fResourceOptionEditor;
