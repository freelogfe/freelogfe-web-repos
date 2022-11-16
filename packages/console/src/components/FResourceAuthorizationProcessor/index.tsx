import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import { useGetState } from '@/utils/hooks';
import Nav from './Nav';
import Content from './Content';
import { FServiceAPI } from '@freelog/tools-lib';
import { IActivatedTarget, IRelation, ITargetInfo } from './types';

interface Target {
  id: string;
  name: string;
  type: 'resource' | 'object';
  versionRange: string;
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
  relations: IRelation[];

  targetInfos: ITargetInfo[];

  activatedTarget: IActivatedTarget | null;
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
  const [activatedTarget, set_activatedTarget, get_activatedTarget] = useGetState<FResourceAuthorizationProcessorStates['activatedTarget']>(initStates['activatedTarget']);

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

    // const resourceIDs = targets
    //   .filter((t) => {
    //     return t.type === 'resource';
    //   })
    //   .map((t) => {
    //     return t.id;
    //   });
    //
    // const objectIDs = targets
    //   .filter((t) => {
    //     return t.type === 'object';
    //   })
    //   .map((t) => {
    //     return t.id;
    //   });

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
        versionRange: t.versionRange,
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

    const needAddObjectIDs: string[] = relationResourceIDs.filter((r) => {
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
        }[];
      } = await FServiceAPI.Resource.batchInfo(params) as any;

      console.log(data_batchResourceInfo, 'data_batchResourceInfoiosjflkdjfl');

      const resourceTargetInfos: FResourceAuthorizationProcessorStates['targetInfos'] = data_batchResourceInfo.map((r) => {
        return {
          targetID: r.resourceId,
          targetName: r.resourceName,
          targetType: 'resource',
          targetResourceType: r.resourceType,
          error: '',
          warning: '',
          versions: r.resourceVersions.map((v) => {
            return v.version;
          }),
          upThrow: false,
          upThrowDisabled: r.latestVersion !== '',
          contracts: [],
          terminatedContractIDs: [],
          enabledPolicies: r.policies.map((p) => {
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

    }

    set_targetInfos(targetInfos);

  }

  function _syncActivatedTarget() {
    if (get_relations().length === 0) {
      set_activatedTarget(null);
    } else {
      if (!get_activatedTarget()) {
        set_activatedTarget(get_relations()[0]);
      }
    }
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
