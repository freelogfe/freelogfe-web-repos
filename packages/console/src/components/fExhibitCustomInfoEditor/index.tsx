import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FExhibitCustomInfoEditorDrawer from './FExhibitCustomInfoEditorDrawer';

interface fExhibitCustomInfoEditorProps {
  disabledKeys: string[];
  disabledNames: string[];
  defaultData?: {
    key: string;
    name: string;
    input: string;
    description: string;
  } | null;
}

type ReturnData = {
  key: string;
  name: string;
  input: string;
  description: string;
} | null;

function fExhibitCustomInfoEditor({
                                    disabledKeys,
                                    disabledNames,
                                    defaultData,
                                  }: fExhibitCustomInfoEditorProps): Promise<ReturnData> {
  return new Promise<ReturnData>((resolve) => {
    const divRoot = self.document.body;
    const div = self.document.createElement('div') as HTMLDivElement;
    divRoot.appendChild(div);
    const root = ReactDOM.createRoot(div);
    return root.render(<FExhibitCustomInfoEditorDrawer
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
          div.remove();
        }, .1);
      }}
    />);
  });

}

export default fExhibitCustomInfoEditor;
