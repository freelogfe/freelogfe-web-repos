import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FAddCustomOptionsDrawer from './FAddCustomOptionsDrawer';

interface fAddCustomOptionsProps {
  disabledKeys: string[];
  defaultData?: {
    key: string;
    name: string;
    description: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
  }[];
  hideTypeSelect?: boolean;
}

type ReturnData = {
  key: string;
  name: string;
  description: string;
  type: 'input' | 'select';
  input: string;
  select: string[];
}[] | null;

function fAddCustomOptions({
                             disabledKeys,
                             defaultData,
                             hideTypeSelect = false,
                           }: fAddCustomOptionsProps): Promise<ReturnData> {
  return new Promise<ReturnData>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render(<FAddCustomOptionsDrawer
      defaultData={defaultData}
      disabledKeys={disabledKeys}
      onOk={(obj) => {
        resolve(obj);
      }}
      hideTypeSelect={hideTypeSelect}
      onClose={() => {
        resolve(null);
        setTimeout(() => {
          root.unmount();
        }, 300);
      }}
    />);
  });
}

export default fAddCustomOptions;
