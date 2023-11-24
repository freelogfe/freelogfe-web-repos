import { PolicyFullInfo_Type } from '@/type/contractTypes';

export interface ITargetInfo {
  targetID: string;
  targetName: string;
  targetType: 'resource' | 'object';
  targetResourceType: string[];
  error: '' | 'unreleased' | 'offline' | 'cyclicDependency' | 'storageObject' | 'upThrow' | 'freeze';
  warning: '' | 'authException' | 'ownerFreeze';
  versions: string[];
  contracts: {
    contractID: string;
    policyID: string;
    title: string;
    date: string;
  }[];
  terminatedContractIDs: string[];
  enabledPolicies: {
    checked: boolean;
    policyFullInfo: PolicyFullInfo_Type;
  }[];
}

export interface IRelation {
  id: string;
  name: string;
  type: 'resource' | 'object';
  versionRange: string;
  children: {
    id: string;
    name: string;
    type: 'resource' | 'object';
  }[];
}

export interface IActivatedTarget {
  id: string;
  name: string;
  type: 'resource' | 'object';
}

export interface IBaseUpcastResource {
  resourceID: string;
  resourceName: string;
}
