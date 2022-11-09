import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FAddFileBasePropsDrawer from './FAddFileBasePropsDrawer';

interface fAddFileBasePropsProps {
  disabledKeys: string[];
}

type ReturnData = {
  key: string;
  value: string;
  description: string;
}[] | null;

function fAddFileBaseProps({ disabledKeys }: fAddFileBasePropsProps): Promise<ReturnData> {
  return new Promise<ReturnData>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render((<FAddFileBasePropsDrawer
      disabledKeys={[]}
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

export default fAddFileBaseProps;
