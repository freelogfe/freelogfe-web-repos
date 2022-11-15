import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import { useGetState } from '@/utils/hooks';
import Nav from './Nav';
import Content from './Content';

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
  resourceID: string;

  // onMount?(processor: Processor): void;
}

interface FResourceAuthorizationProcessorStates {
  relations: {
    id: string;
    name: string;
    type: 'resource' | 'object';
    versionRange: string;
    children: {
      id: string;
      name: string;
      type: 'resource' | 'object';
    }[]
  }[];

  targetInfos: {
    targetID: string;
    targetName: string;
    targetType: 'resource' | 'object';
    targetResourceType: string[];
    error: '' | 'offline' | 'cyclicDependency' | 'storageObject' | 'upThrow' | 'freeze';
    warning: '' | 'authException' | 'ownerFreeze';
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

export let processor: Processor | null = null;

function FResourceAuthorizationProcessor({}: FResourceAuthorizationProcessorProps) {

  const [relations, set_relations, get_relations] = useGetState<FResourceAuthorizationProcessorStates['relations']>(initStates['relations']);
  const [targetInfos, set_targetInfos, get_targetInfos] = useGetState<FResourceAuthorizationProcessorStates['targetInfos']>(initStates['targetInfos']);
  const [activatedTarget, set_activatedTarget] = useGetState<FResourceAuthorizationProcessorStates['activatedTarget']>(initStates['activatedTarget']);

  AHooks.useMount(() => {
    // onMount && onMount({
    //   addTargets,
    //   removeTarget,
    //   activeTarget,
    //   getAllTargets,
    //   isCompleteAuthorization,
    //   getAllResourcesWithContracts,
    // });
    processor = {
      addTargets,
      removeTarget,
      activeTarget,
      getAllTargets,
      isCompleteAuthorization,
      getAllResourcesWithContracts,
    };
  });

  async function addTargets(targets: Target[]): Promise<{ err: string }> {
    console.log(targets, 's9oidfjlskdfjlsdjflk');
    return { err: '' };
  }

  async function removeTarget(targets: Target): Promise<{ err: string }> {
    return { err: '' };
  }

  async function activeTarget(targets: Target): Promise<{ err: string }> {
    return { err: '' };
  }

  async function getAllTargets(): Promise<Target[]> {
    return get_relations().map((r) => {
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
    return get_targetInfos()
      .filter((t) => {
        return t.targetType === 'resource';
      })
      .map((t) => {
        return {
          resourceID: t.targetID,
          resourceName: t.targetName,
          contracts: t.contracts.map((c) => {
            return {
              policyID: c.policyID,
              contractID: c.contractID,
            };
          }),
        };
      });
  }

  if (relations.length === 0) {
    return null;
  }

  return (<div className={styles.DepPanel}>

    <div className={styles.DepPanelNavs}>
      <Nav
        relations={relations}
        targetInfos={targetInfos}
        activatedTarget={activatedTarget}
      />
    </div>

    <div className={styles.DepPanelContent}>
      <Content
        activatedTarget={activatedTarget}
        targetInfos={targetInfos}
      />
    </div>
  </div>);
}

export default FResourceAuthorizationProcessor;
