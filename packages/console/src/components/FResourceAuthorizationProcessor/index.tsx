import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';

interface Target {
  id: string;
  name: string;
  type: 'resource' | 'object';
}

interface Processor {
  addTargets(targets: Target[]): void;

  removeTarget(target: Target): void;

  activeTarget(target: Target): void;

  getAllTargets(): Target[];

  isCompleteAuthorization(): boolean;

  getAllResourcesWithContracts(): {
    resourceID: string;
    resourceName: string;
    contracts: {
      policyID: string;
      contractID: string;
    }[];
  };
}

interface FResourceAuthorizationProcessorProps {
  onMount?(processor: Processor): void;
}

function FResourceAuthorizationProcessor({ onMount }: FResourceAuthorizationProcessorProps) {

  AHooks.useMount(() => {

  });

  return (<div>__Template</div>);
}

export default FResourceAuthorizationProcessor;
