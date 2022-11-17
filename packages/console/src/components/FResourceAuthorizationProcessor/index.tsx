import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import { useGetState } from '@/utils/hooks';
import Nav from './Nav';
import Content from './Content';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { IActivatedTarget, IRelation, ITargetInfo } from './types';

interface Target {
  id: string;
  name: string;
  type: 'resource' | 'object';
  versionRange?: string;
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

  clear(): Promise<{ err: string }>;
}

interface FResourceAuthorizationProcessorProps {
  resourceID: string;

  // onMount?(processor: Processor): void;
}

interface FResourceAuthorizationProcessorStates {
  resourceID: string;
  relations: IRelation[];
  targetInfos: ITargetInfo[];
  activatedTarget: IActivatedTarget | null;
}

const initStates: FResourceAuthorizationProcessorStates = {
  resourceID: '',
  relations: [],
  targetInfos: [],
  activatedTarget: null,
};

export let processor: Processor | null = null;

function FResourceAuthorizationProcessor({ resourceID }: FResourceAuthorizationProcessorProps) {

  // console.log(resourceID, 'resourceIDoisjedflksdjl');

  const [_, set_resourceID, get_resourceID] = useGetState<FResourceAuthorizationProcessorStates['resourceID']>(initStates['resourceID']);
  const [relations, set_relations, get_relations] = useGetState<FResourceAuthorizationProcessorStates['relations']>(initStates['relations']);
  const [targetInfos, set_targetInfos, get_targetInfos] = useGetState<FResourceAuthorizationProcessorStates['targetInfos']>(initStates['targetInfos']);
  const [activatedTarget, set_activatedTarget, get_activatedTarget] = useGetState<FResourceAuthorizationProcessorStates['activatedTarget']>(initStates['activatedTarget']);

  React.useEffect(() => {
    set_resourceID(resourceID);
  }, [resourceID]);

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
      clear,
    };
  });

  async function addTargets(targets: Target[]): Promise<{ err: string }> {

    const existResourceIDs: string[] = get_relations()
      .filter((t) => {
        return t.type === 'resource';
      })
      .map<string>((t) => {
        return t.id;
      });

    const existObjectIDs: string[] = get_relations()
      .filter((t) => {
        return t.type === 'object';
      })
      .map<string>((t) => {
        return t.id;
      });

    const needAddResources = targets.filter((t) => {
      return t.type === 'resource' && !existResourceIDs.includes(t.id);
    });
    const needAddResourceIDs: string[] = needAddResources.map((t) => {
      return t.id;
    });

    const needAddObjects = targets.filter((t) => {
      return t.type === 'object' && !existObjectIDs.includes(t.id);
    });

    const params: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
      resourceIds: needAddResourceIDs.join(','),
      isLoadPolicyInfo: 1,
      isLoadLatestVersionInfo: 1,
      // projection: 'resourceId,resourceName,resourceType,latestVersion,status,policies,resourceVersions,userId',
      // isLoadFreezeReason: 1,
      isTranslate: 1,
    };

    const { data: data_batchResourceInfo }: {
      data: {
        resourceId: string;
        baseUpcastResources: {
          resourceId: string;
          resourceName: string;
        }[];
      }[];
    } = await FServiceAPI.Resource.batchInfo(params);

    // console.log(data_batchResourceInfo, 'data_batchResourceInfo09iwoejflksdjflsdkjl');

    const result: FResourceAuthorizationProcessorStates['relations'] = needAddResources.map((t) => {
      const r = data_batchResourceInfo.find((r) => {
        return t.id === r.resourceId;
      });
      return {
        id: t.id,
        name: t.name,
        type: t.type,
        versionRange: t.versionRange || '',
        children: r ? r.baseUpcastResources.map((br) => {
          return {
            id: br.resourceId,
            name: br.resourceName,
            type: 'resource',
          };
        }) : [],
      };
    });

    set_relations([
      ...result,
      ...needAddObjects.map((o) => {
        return {
          id: o.id,
          name: o.name,
          type: o.type,
          versionRange: '',
          children: [],
        };
      }),
      ...get_relations(),
    ]);
    _syncActivatedTarget();
    await _syncTargetInfo();
    return { err: '' };
  }

  async function _syncTargetInfo() {
    let relationResourceIDs: string[] = [
      ...get_relations()
        .filter((r) => {
          return r.type === 'resource';
        })
        .map((r) => {
          return r.id;
        }),
      ...get_relations().map((r) => {
        return r.children.map((c) => {
          return c.id;
        });
      }).flat(),
    ];

    const relationObjectIDs: string[] = get_relations()
      .filter((r) => {
        return r.type === 'object';
      })
      .map((r) => {
        return r.id;
      });

    // let targetInfos = [];
    let targetInfos = get_targetInfos()
      .filter((t) => {
        if (t.targetType === 'resource') {
          return relationResourceIDs.includes(t.targetID);
        }
        return relationObjectIDs.includes(t.targetID);
      });

    const existentResourceIDs: string[] = targetInfos
      .filter((t) => {
        return t.targetType === 'resource';
      })
      .map((t) => {
        return t.targetID;
      });

    const existentObjectIDs: string[] = targetInfos
      .filter((t) => {
        return t.targetType === 'object';
      })
      .map((t) => {
        return t.targetID;
      });

    const needAddResourceIDs: string[] = relationResourceIDs.filter((r) => {
      return !existentResourceIDs.includes(r);
    });

    const needAddObjectIDs: string[] = relationObjectIDs.filter((r) => {
      return !existentObjectIDs.includes(r);
    });

    if (needAddResourceIDs.length > 0) {
      const params: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
        resourceIds: needAddResourceIDs.join(','),
        isLoadPolicyInfo: 1,
        // isLoadLatestVersionInfo: 1,
        // projection: 'resourceId,resourceName,resourceType,latestVersion,status,policies,resourceVersions,userId',
        // isLoadFreezeReason: 1,
        isTranslate: 1,
      };

      const { data: data_batchResourceInfo }: {
        data: {
          resourceId: string;
          resourceName: string;
          resourceType: string[];
          resourceVersions: {
            version: string;
          }[];
          latestVersion: string;
          policies: PolicyFullInfo_Type[],
          status: number;
        }[];
      } = await FServiceAPI.Resource.batchInfo(params) as any;

      // console.log(data_batchResourceInfo, 'data_batchResourceInfoiosjflkdjfl');
      // console.log(resourceID, 'resourceIDoiidddddd');

      const params1: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
        subjectIds: needAddResourceIDs.join(','),
        licenseeId: get_resourceID(),
        subjectType: 1,
        licenseeIdentityType: 1,
        isLoadPolicyInfo: 1,
      };
      const { data: data_batchContracts }: {
        data: {
          contractId: string;
          contractName: string;
          policyId: string;
          createDate: string;
          licensorId: string;
          status: 0 | 1;
        }[];
      } = await FServiceAPI.Contract.batchContracts(params1);

      // console.log(data_batchContracts, 'data_batchContractso9iedjlskdjflsdkjl');

      const params2: BatchCycleDependencyCheckParams = {
        resourceId: get_resourceID(),
        dependencies: get_relations().map<{ resourceId: string; versionRange: string; }>((d) => {
          return {
            resourceId: d.id,
            versionRange: d.versionRange,
          };
        }),
      };
      const cycleDependencyResourceID: string[] = await batchCycleDependencyCheck(params2);

      const resourceTargetInfos: FResourceAuthorizationProcessorStates['targetInfos'] = data_batchResourceInfo.map((r) => {
        let error: FResourceAuthorizationProcessorStates['targetInfos'][number]['error'] = '';
        let warning: string = '';

        if (r.status === 0) {
          error = 'offline';
        } else if ((r.status & 2) === 2) {
          error = 'freeze';
        } else if (cycleDependencyResourceID.includes(r.resourceId)) {
          error = 'cyclicDependency';
        }

        const contracts = data_batchContracts.filter((dc) => {
          return dc.licensorId === r.resourceId && dc.status === 0;
        });
        const contractIDs = contracts.map((c) => {
          return c.policyId;
        });

        return {
          targetID: r.resourceId,
          targetName: r.resourceName,
          targetType: 'resource',
          targetResourceType: r.resourceType,
          error: error,
          warning: '',
          versions: r.resourceVersions.map((v) => {
            return v.version;
          }),
          upThrow: false,
          upThrowDisabled: r.latestVersion !== '',
          contracts: contracts.map((c) => {
            return {
              contractID: c.contractId,
              policyID: c.policyId,
              title: c.contractName,
              code: '',
              date: FUtil.Format.formatDateTime(c.createDate),
            };
          }),
          terminatedContractIDs: data_batchContracts
            .filter((dc: any) => {
              return dc.licensorId === r.resourceId && dc.status === 1;
            })
            .map((dc: any) => {
              return dc.contractId;
            }),
          enabledPolicies: r.policies
            .filter((p) => {
              return !contractIDs.includes(p.policyId) && p.status === 1;
            })
            .map((p) => {
              return {
                checked: false,
                policyFullInfo: p,
              };
            }),
        };
      });

      targetInfos = [
        ...resourceTargetInfos,
        ...targetInfos,
      ];
    }


    if (needAddObjectIDs.length > 0) {
      // console.log(needAddObjectIDs, 'needAddObjectIDsdsoijfsdklfjdslkj');
      const { data: data_objs }: {
        data: {
          objectId: string;
          objectName: string;
          resourceType: string[];
        }[];
      } = await FServiceAPI.Storage.batchObjectList({
        objectIds: needAddObjectIDs.join(','),
      });
      // console.log(data_objs, 'data_objsisoedjflskdjfl');
      const objTargetInfos: FResourceAuthorizationProcessorStates['targetInfos'] = data_objs.map((o) => {
        return {
          targetID: o.objectId,
          targetName: o.objectName,
          targetType: 'object',
          targetResourceType: o.resourceType,
          error: 'storageObject',
          warning: '',
          versions: [],
          upThrow: false,
          upThrowDisabled: false,
          contracts: [],
          terminatedContractIDs: [],
          enabledPolicies: [],
        };
      });

      targetInfos = [
        ...targetInfos,
        ...objTargetInfos,
      ];
    }

    set_targetInfos(targetInfos);

  }

  function _syncActivatedTarget() {
    if (get_relations().length === 0) {
      set_activatedTarget(null);
    } else {
      const at = get_activatedTarget();
      if (!at) {
        set_activatedTarget(get_relations()[0]);
        return;
      }

      if (!get_targetInfos().some((t) => {
        return t.targetID === at.id && t.targetName === at.name && t.targetType === at.type;
      })) {
        set_activatedTarget(get_relations()[0]);
      }
    }
  }

  async function removeTarget(target: Target): Promise<{ err: string }> {
    const result: FResourceAuthorizationProcessorStates['relations'] = get_relations().filter((r) => {
      return !(r.id === target.id && r.name === target.name && r.type === target.type);
    });
    set_relations(result);
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
        versionRange: r.versionRange,
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

  async function clear(): Promise<{ err: string }> {
    set_relations(initStates['relations']);
    set_targetInfos(initStates['targetInfos']);
    set_activatedTarget(initStates['activatedTarget']);
    return { err: '' };
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
        onChange_Relations={async (v) => {
          set_relations(v);
          await _syncTargetInfo();
          await _syncActivatedTarget();
        }}
        onChange_ActivatedTarget={(v) => {
          set_activatedTarget(v);
        }}
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

interface BatchCycleDependencyCheckParams {
  resourceId: string;
  dependencies: {
    resourceId: string;
    versionRange: string;
  }[];
}

async function batchCycleDependencyCheck({
                                           resourceId,
                                           dependencies,
                                         }: BatchCycleDependencyCheckParams): Promise<string[]> {
  const promises: Promise<any>[] = [];
  for (const dependency of dependencies) {
    const params: Parameters<typeof FServiceAPI.Resource.cycleDependencyCheck>[0] = {
      resourceId: resourceId,
      dependencies: [{
        resourceId: dependency.resourceId,
        versionRange: dependency.versionRange,
      }],
    };
    promises.push(FServiceAPI.Resource.cycleDependencyCheck(params));
  }
  const results = await Promise.all(promises);

  const resourceIDs: string[] = [];
  // console.log(results, 'results12390j');
  for (const [index, result] of Object.entries(results)) {
    // console.log(index, value);
    const { data } = result;
    if (!data) {
      resourceIDs.push(dependencies[Number(index)].resourceId);
    }
  }
  return resourceIDs;
}
