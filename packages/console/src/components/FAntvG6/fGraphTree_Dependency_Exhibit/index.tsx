import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import FGraph_Tree_Dependency_Exhibit from '@/components/FAntvG6/FGraph_Tree_Dependency_Exhibit';
import * as ReactDOM from 'react-dom/client';

interface fGraphTree_Dependency_Exhibit_Props {
  exhibitID: string;
  version: string;
}

function fGraphTree_Dependency_Exhibit({ exhibitID, version }: fGraphTree_Dependency_Exhibit_Props) {
  return new Promise<boolean>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render(<Temp
      exhibitID={exhibitID}
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

export default fGraphTree_Dependency_Exhibit;

interface TempProps {
  exhibitID: string;
  version: string;

  onClose?(): void;
}

function Temp({ exhibitID, version, onClose }: TempProps) {

  const [visible, set_visible] = React.useState<boolean>(true);

  return (<FDrawer
    open={visible}
    title={'依赖树'}
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
    <FGraph_Tree_Dependency_Exhibit
      exhibitID={exhibitID}
      version={version}
      width={window.innerWidth - 60}
      height={window.innerHeight - 60 - 50}
    />
  </FDrawer>);
}
