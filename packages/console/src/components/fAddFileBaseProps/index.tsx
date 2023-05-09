import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FAddFileBasePropsDrawer from './FAddFileBasePropsDrawer';

interface fAddFileBasePropsProps {
  disabledKeys: string[];
  disabledNames: string[];
  defaultData?: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
}

type ReturnData = {
  key: string;
  name: string;
  value: string;
  description: string;
}[] | null;

function fAddFileBaseProps({ disabledKeys, disabledNames, defaultData }: fAddFileBasePropsProps): Promise<ReturnData> {
  return new Promise<ReturnData>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render(<FAddFileBasePropsDrawer
      defaultData={defaultData}
      disabledNames={disabledNames}
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

export default fAddFileBaseProps;
