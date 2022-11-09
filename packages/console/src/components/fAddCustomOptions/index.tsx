import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FAddFileBasePropsDrawer from '@/components/fAddFileBaseProps/FAddFileBasePropsDrawer';

interface fAddCustomOptionsProps {
  disabledKeys: string[];
  defaultData?: {
    key: string;
    description: string;
    custom: 'input' | 'select';
    defaultValue: string;
    customOption: string;
  }[];
}

type ReturnData = {
  key: string;
  value: string;
  description: string;
}[] | null;

function fAddCustomOptions({disabledKeys, defaultData}: fAddCustomOptionsProps) {
  return new Promise<ReturnData>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render((<FAddFileBasePropsDrawer
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
    />));
  });
}

export default fAddCustomOptions;
