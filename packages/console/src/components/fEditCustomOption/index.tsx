import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FEditCustomOptionDrawer from './FEditCustomOptionDrawer';

interface fEditCustomOptionsProps {
  disabledKeys: string[];
  defaultData: {
    key: string;
    description: string;
    custom: 'input' | 'select';
    defaultValue: string;
    customOption: string;
  };
}

type ReturnData = {
  key: string;
  description: string;
  custom: 'input' | 'select';
  defaultValue: string;
  customOption: string;
} | null;

function fEditCustomOptions({ disabledKeys, defaultData }: fEditCustomOptionsProps): Promise<ReturnData> {
  return new Promise<ReturnData>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render(<FEditCustomOptionDrawer
      defaultData={defaultData}
      disabledKeys={disabledKeys}
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

export default fEditCustomOptions;
