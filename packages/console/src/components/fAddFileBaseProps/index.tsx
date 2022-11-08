import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FAddFileBasePropsDrawer from './FAddFileBasePropsDrawer';

interface fAddFileBasePropsProps {

}

type ReturnData = { objID: string; objName: string; sha1: string } | null;

function fAddFileBaseProps({}: fAddFileBasePropsProps = {}): Promise<ReturnData> {
  return new Promise<ReturnData>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render((<FAddFileBasePropsDrawer
      onSelect={(obj) => {
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
