import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FSignResourceToNodeDrawer from './FSignResourceToNodeDrawer';

interface fSignResourceToNodeProps {
  resourceIDs: string[];
}

type ReturnData = {
  nodeID: number;
} | null;

function fSignResourceToNode({ resourceIDs }: fSignResourceToNodeProps): Promise<ReturnData> {

  return new Promise<ReturnData>((resolve) => {
    const divRoot = self.document.body;
    const div = self.document.createElement('div') as HTMLDivElement;
    divRoot.appendChild(div);
    const root = ReactDOM.createRoot(div);
    return root.render(<FSignResourceToNodeDrawer
      resourceIDs={resourceIDs}
      onOk={({ nodeID }) => {
        resolve({ nodeID });
      }}
      onClose={() => {
        resolve(null);
        root.unmount();
      }}
    />);
  });
}

export default fSignResourceToNode;
