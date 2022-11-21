import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FAddDependenciesDrawer from './FAddDependenciesDrawer';

interface fAddDependenciesProps {
  existingResourceIDs: string[];
  baseUpcastResourceIDs: string[];

  onSelect_Resource?(value: {
    resourceID: string;
    resourceNme: string;
  }): void;

  onDeselect_Resource?(value: {
    resourceID: string;
    resourceNme: string;
  }): void;
}

async function fAddDependencies({
                                  existingResourceIDs,
                                  baseUpcastResourceIDs,
                                  onSelect_Resource,
                                  onDeselect_Resource,
                                }: fAddDependenciesProps): Promise<void> {
  return new Promise<void>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render(<FAddDependenciesDrawer
      existingResourceIDs={existingResourceIDs}
      baseUpcastResourceIDs={baseUpcastResourceIDs}
      onSelect_Resource={(value) => {
        onSelect_Resource && onSelect_Resource(value);
      }}
      onDeselect_Resource={(value) => {
        onDeselect_Resource && onDeselect_Resource(value);
      }}
      onClose={() => {
        resolve();
        setTimeout(() => {
          root.unmount();
        }, 300);
      }}
    />);
  });
}

export default fAddDependencies;
