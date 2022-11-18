import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FTerminatedContractListDrawer from './FTerminatedContractListDrawer';

interface fViewTerminatedContractsProps {
  terminatedContractIDs: string[];
}

type ReturnData = null;

function fViewTerminatedContracts({terminatedContractIDs}: fViewTerminatedContractsProps) {
  return new Promise<ReturnData>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render(<FTerminatedContractListDrawer
      terminatedContractIDs={terminatedContractIDs}
      // onOk={() => {
      //   resolve(null);
      // }}
      onClose={() => {
        resolve(null);
        setTimeout(() => {
          root.unmount();
        }, 300);
      }}
    />);
  });
}

export default fViewTerminatedContracts;
