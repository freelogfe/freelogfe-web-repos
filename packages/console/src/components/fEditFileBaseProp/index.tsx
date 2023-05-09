import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FEditFileBasePropDrawer from './FEditFileBasePropDrawer';

interface fEditFileBasePropProps {
  disabledKeys: string[];
  defaultData: {
    key: string;
    value: string;
    description: string;
  };
}

type ReturnData = {
  key: string;
  value: string;
  description: string;
} | null;

function fEditFileBaseProp({disabledKeys, defaultData}: fEditFileBasePropProps): Promise<ReturnData> {
  return new Promise<ReturnData>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render(<FEditFileBasePropDrawer
      defaultData={defaultData || []}
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

export default fEditFileBaseProp;
