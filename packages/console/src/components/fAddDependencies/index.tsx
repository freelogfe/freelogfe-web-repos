import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FAddDependenciesDrawer from './FAddDependenciesDrawer';

interface fAddDependenciesProps {
  // resourceTypeCode: string;
  existingResources: {
    resourceID: string;
    resourceNme: string;
  }[];
  baseUpcastResources: {
    resourceID: string;
    resourceName: string;
  }[];

  onSelect_Resource?(value: {
    resourceID: string;
    resourceName: string;
  }): void;

  onDeselect_Resource?(value: {
    resourceID: string;
    resourceName: string;
  }): void;
}

async function fAddDependencies({
                                  // resourceTypeCode,
                                  existingResources,
                                  baseUpcastResources,
                                  onSelect_Resource,
                                  onDeselect_Resource,
                                }: fAddDependenciesProps): Promise<void> {
  return new Promise<void>((resolve) => {
    const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
    return root.render(<FAddDependenciesDrawer
      // resourceTypeCode={resourceTypeCode}
      existingResourceIDs={existingResources.map<string>((r) => {
        return r.resourceID;
      })}
      baseUpcastResourceIDs={baseUpcastResources.map((r) => {
        return r.resourceID;
      })}
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
