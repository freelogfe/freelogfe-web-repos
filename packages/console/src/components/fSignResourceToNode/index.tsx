import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FSignResourceToNodeDrawer from './FSignResourceToNodeDrawer';

interface fSignResourceToNodeProps {
  resourceIDs: string[];
}

function fSignResourceToNode({ resourceIDs }: fSignResourceToNodeProps) {

  return new Promise<void>((resolve) => {
    const divRoot = self.document.body;
    const div = self.document.createElement('div') as HTMLDivElement;
    divRoot.appendChild(div);
    const root = ReactDOM.createRoot(div);
    return root.render(<FSignResourceToNodeDrawer
      resourceIDs={resourceIDs}
      onClose={() => {
        resolve();
        setTimeout(() => {
          root.unmount();
        }, 30);
      }}
    />);
  });
}

export default fSignResourceToNode;

