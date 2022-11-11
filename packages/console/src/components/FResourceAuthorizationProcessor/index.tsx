import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { PolicyFullInfo_Type } from '@/type/contractTypes';

interface Target {
  id: string;
  name: string;
  type: 'resource' | 'object';
}

interface Processor {
  addTargets(targets: Target[]): Promise<{ err: string }>;

  removeTarget(target: Target): Promise<{ err: string }>;

  activeTarget(target: Target): Promise<{ err: string }>;

  getAllTargets(): Promise<Target[]>;

  isCompleteAuthorization(): Promise<boolean>;

  getAllResourcesWithContracts(): Promise<{
    resourceID: string;
    resourceName: string;
    contracts: {
      policyID: string;
      contractID: string;
    }[];
  }[]>;
}

interface FResourceAuthorizationProcessorProps {
  onMount?(processor: Processor): void;
}

interface FResourceAuthorizationProcessorStates {
  relations: {
    id: string;
    name: string;
    type: 'resource' | 'object';
    children: {
      id: string;
      name: string;
      type: 'resource' | 'object';
    }[]
  }[];

  targetInfos: {
    targetID: string;
    targetName: string;
    targetNameType: 'resource' | 'object';
    targetResourceType: string[];
    error: '' | 'offline' | 'cyclicDependency' | 'storageObject' | 'upThrow' | 'freeze';
    warning: '' | 'authException' | 'ownerFreeze';
    versionRange: string;
    versions: string[];
    upThrow: boolean;
    upThrowDisabled: boolean;
    contracts: {
      contractID: string;
      policyID: string;
      title: string;
      code: string;
      date: string;
    }[];
    terminatedContractIDs: string[];
    enabledPolicies: {
      checked: boolean;
      policyFullInfo: PolicyFullInfo_Type;
    }[];
  }[];

  activatedTarget: {
    id: string;
    name: string;
    type: 'resource' | 'object';
  } | null;
}

const initStates: FResourceAuthorizationProcessorStates = {
  relations: [],
  targetInfos: [],
  activatedTarget: null,
};

function FResourceAuthorizationProcessor({ onMount }: FResourceAuthorizationProcessorProps) {

  const [relations, set_relations] = React.useState<FResourceAuthorizationProcessorStates['relations']>(initStates['relations']);
  const [targetInfos, set_targetInfos] = React.useState<FResourceAuthorizationProcessorStates['targetInfos']>(initStates['targetInfos']);
  const [activatedTarget, set_activatedTarget] = React.useState<FResourceAuthorizationProcessorStates['activatedTarget']>(initStates['activatedTarget']);

  AHooks.useMount(() => {
    onMount && onMount({
      addTargets,
      removeTarget,
      activeTarget,
      getAllTargets,
      isCompleteAuthorization,
      getAllResourcesWithContracts,
    });
  });

  async function addTargets(targets: Target[]): Promise<{ err: string }> {
    return { err: '' };
  }

  async function removeTarget(targets: Target): Promise<{ err: string }> {
    return { err: '' };
  }

  async function activeTarget(targets: Target): Promise<{ err: string }> {
    return { err: '' };
  }

  async function getAllTargets(): Promise<Target[]> {
    return relations.map((r) => {
      return {
        id: r.id,
        name: r.name,
        type: r.type,
      };
    });
  }

  async function isCompleteAuthorization(): Promise<boolean> {
    return true;
  }

  async function getAllResourcesWithContracts(): Promise<{
    resourceID: string;
    resourceName: string;
    contracts: {
      policyID: string;
      contractID: string;
    }[];
  }[]> {
    return targetInfos
      .filter((t) => {
        return t.targetNameType === 'resource';
      })
      .map((t) => {
      return {
        resourceID: t.targetID,
        resourceName: t.targetName,
        contracts: t.contracts.map((c) => {
          return {
            policyID: c.policyID,
            contractID: c.contractID,
          }
        })
      }
    });
  }

  return (<div>__Template</div>);
}

export default FResourceAuthorizationProcessor;
