import * as React from 'react';
import styles from './index.less';

interface FAddDependenciesDrawerProps {
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

  onClose?(): void;
}

function FAddDependenciesDrawer({}: FAddDependenciesDrawerProps) {
  return (<div>__Template</div>);
}

export default FAddDependenciesDrawer;
