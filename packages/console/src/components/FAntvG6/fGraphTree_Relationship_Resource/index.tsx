import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import FGraph_Tree_Relationship_Resource from '@/components/FAntvG6/FGraph_Tree_Relationship_Resource';
import * as ReactDOM from 'react-dom/client';

interface fGraphTree_Relationship_Resource_Props {
  resourceID: string;
  version: string;
}

function fGraphTree_Relationship_Resource({
                                            resourceID,
                                            version,
                                          }: fGraphTree_Relationship_Resource_Props): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render(<Temp
      resourceID={resourceID}
      version={version}
      onClose={() => {
        resolve(true);
        setTimeout(() => {
          root.unmount();
        }, 300);
      }}
    />);
  });
}

export default fGraphTree_Relationship_Resource;

interface TempProps {
  resourceID: string;
  version: string;

  onClose?(): void;
}

function Temp({ resourceID, version, onClose }: TempProps) {

  const [visible, set_visible] = React.useState<boolean>(true);

  return (<FDrawer
    open={visible}
    title={'关系树'}
    destroyOnClose
    width={'100%'}
    onClose={() => {
      set_visible(false);
    }}
    afterOpenChange={(visible) => {
      if (!visible) {
        onClose && onClose();
      }
    }}
  >
    <FGraph_Tree_Relationship_Resource
      resourceID={resourceID}
      version={version}
      width={window.innerWidth - 60}
      height={window.innerHeight - 60 - 50}
    />
  </FDrawer>);
}
