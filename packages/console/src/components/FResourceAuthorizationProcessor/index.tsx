import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import { useGetState } from '@/utils/hooks';
import Nav from './Nav';
import Content from './Content';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { IActivatedTarget, IRelation, ITargetInfo } from './types';
import FComponentsLib from '@freelog/components-lib';
import FBasicUpcastCard from '@/components/FBasicUpcastCard';

interface Target {
  id: string;
  name: string;
  type: 'resource' | 'object';
  versionRange?: string;
}

export interface Processor {
  addTargets(targets: Target[]): Promise<{ err: string }>;

  removeTarget(target: {
    id: string;
    name: string;
    type: 'resource' | 'object';
  }): Promise<{ err: string }>;

  activeTarget(target: {
    id: string;
    name: string;
    type: 'resource' | 'object';
  }): Promise<{ err: string }>;

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

  onMount?(processor: Processor): void;
}

interface FResourceAuthorizationProcessorStates {
  licenseeResource: {
    resourceID: string;
    resourceName: string;
    latestVersion: string;
    baseUpcastResources: {
      resourceID: string;
      resourceName: string;
    }[];
  } | null;
  relations: IRelation[];
  targetInfos: ITargetInfo[];
  activatedTarget: IActivatedTarget | null;
}

const initStates: FResourceAuthorizationProcessorStates = {
  licenseeResource: null,
  relations: [],
  targetInfos: [],
  activatedTarget: null,
};

let processor: Processor | null = null;

function FResourceAuthorizationProcessor({ resourceID, onMount }: FResourceAuthorizationProcessorProps) {

  const [licenseeResource, set_licenseeResource, get_licenseeResource] = useGetState<FResourceAuthorizationProcessorStates['licenseeResource']>(initStates['licenseeResource']);
  const [relations, set_relations, get_relations] = useGetState<FResourceAuthorizationProcessorStates['relations']>(initStates['relations']);
  const [targetInfos, set_targetInfos, get_targetInfos] = useGetState<FResourceAuthorizationProcessorStates['targetInfos']>(initStates['targetInfos']);
  const [activatedTarget, set_activatedTarget, get_activatedTarget] = useGetState<FResourceAuthorizationProcessorStates['activatedTarget']>(initStates['activatedTarget']);

  AHooks.useAsyncEffect(async () => {
    if (resourceID !== '') {
      const { data: data_resource }: {
        data: {
          resourceId: string;
          resourceName: string;
          latestVersion: string;
          baseUpcastResources: {
            resourceId: string;
            resourceName: string;
          }[];
        }
      } = await FServiceAPI.Resource.info({
        resourceIdOrName: resourceID,
      });
      // console.log(data_resource, 'data_resource asoidflsdkfjlsdkfjsdfsd');
      set_licenseeResource({
        resourceID: data_resource.resourceId,
        resourceName: data_resource.resourceName,
        latestVersion: data_resource.latestVersion,
        baseUpcastResources: data_resource.baseUpcastResources.map((b) => {
          return {
            resourceID: b.resourceId,
            resourceName: b.resourceName,
          };
        }),
      });
    }
  }, [resourceID]);

  AHooks.useMount(() => {
    processor = {
      addTargets,
      removeTarget,
      activeTarget,
      getAllTargets,
      isCompleteAuthorization,
      getAllResourcesWithContracts,
      clear,
    };
    onMount && onMount(processor);
  });

  AHooks.useUnmount(() => {
    processor = null;
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
        latestVersion: string;
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
        versionRange: t.versionRange || ('^' + r?.latestVersion),
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

    let targetInfos: FResourceAuthorizationProcessorStates['targetInfos'] = [];
    // let targetInfos = get_targetInfos()
    //   .filter((t) => {
    //     if (t.targetType === 'resource') {
    //       return relationResourceIDs.includes(t.targetID);
    //     }
    //     return relationObjectIDs.includes(t.targetID);
    //   });

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

      const resourceTargetInfos: FResourceAuthorizationProcessorStates['targetInfos'] = await _batchHandleResources({
        licenseeResource: get_licenseeResource(),
        licensorResourceIDs: needAddResourceIDs,
        needCheckedCyclicDependenciesResourceInfos: get_relations().map((r) => {
          return {
            resourceID: r.id,
            versionRange: r.versionRange,
          };
        }),
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

  async function activeTarget(target: {
    id: string;
    name: string;
    type: 'resource' | 'object';
  }): Promise<{ err: string }> {
    if (get_targetInfos().some((t) => {
      return t.targetID === target.id && t.targetName === target.name && t.targetType === target.type;
    })) {
      set_activatedTarget(target);
      return { err: '' };
    }

    return { err: '该标的不存在' };

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
    return get_targetInfos().every((t) => {
      return t.upThrow || t.contracts.length > 0;
    });
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

  return (<div className={styles.box}>
    <FBasicUpcastCard
      dataSource={targetInfos
        .filter((t) => {
          return t.targetType === 'resource' && t.upThrow;
        })
        .map((t) => {
          return {
            resourceID: t.targetID,
            resourceName: t.targetName,
          };
        })}
      onClick={(resourceID) => {
        window.open(FUtil.LinkTo.resourceDetails({
          resourceID: resourceID,
        }));
      }}
    />

    <div className={styles.DepPanel}>

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
          onChange_TargetInfos={(v) => {
            set_targetInfos(v);
          }}
        />
      </div>
    </div>
    {/*<div style={{ height: 20 }} />*/}
    <div className={styles.boxFooter}>
      <FComponentsLib.FRectBtn
        style={{ width: 300 }}
        disabled={!targetInfos.some((t) => {
          return !t.upThrow && t.enabledPolicies.some((p) => {
            return p.checked;
          });
        })}
        onClick={async () => {
          const subjects: {
            subjectId: string;
            policyId: string;
          }[] = get_targetInfos()
            .filter((t) => {
              return !t.upThrow;
            })
            .map((t) => {
              return t.enabledPolicies
                .filter((p) => {
                  return p.checked;
                })
                .map((p) => {
                  return {
                    subjectId: t.targetID,
                    policyId: p.policyFullInfo.policyId,
                  };
                });
            })
            .flat();
          // console.log(subjects, 'subjectso9iejflksdjflsdjflsdj');
          await FServiceAPI.Contract.batchCreateContracts({
            subjects: subjects,
            subjectType: 1,
            licenseeId: get_licenseeResource()?.resourceID || '',
            licenseeIdentityType: 1,
          });
          await _syncTargetInfo();
        }}
      >获取授权</FComponentsLib.FRectBtn>
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

interface I_batchHandleResources_Params {
  licenseeResource: FResourceAuthorizationProcessorStates['licenseeResource'];
  licensorResourceIDs: string[];
  needCheckedCyclicDependenciesResourceInfos: {
    resourceID: string;
    versionRange: string;
  }[];
}

type I_batchHandleResources_Return = FResourceAuthorizationProcessorStates['targetInfos'];

async function _batchHandleResources({
                                       licenseeResource,
                                       licensorResourceIDs,
                                       needCheckedCyclicDependenciesResourceInfos,
                                     }: I_batchHandleResources_Params): Promise<I_batchHandleResources_Return> {
  const params: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
    resourceIds: licensorResourceIDs.join(','),
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
      userId: number;
    }[];
  } = await FServiceAPI.Resource.batchInfo(params) as any;

  // console.log(data_batchResourceInfo, 'data_batchResourceInfoiosjflkdjfl');
  // console.log(resourceID, 'resourceIDoiidddddd');

  const params1: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
    subjectIds: licensorResourceIDs.join(','),
    licenseeId: licenseeResource?.resourceID || '',
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
    resourceId: licenseeResource?.resourceID || '',
    dependencies: needCheckedCyclicDependenciesResourceInfos.map<{ resourceId: string; versionRange: string; }>((d) => {
      return {
        resourceId: d.resourceID,
        versionRange: d.versionRange,
      };
    }),
  };
  const cycleDependencyResourceID: string[] = await batchCycleDependencyCheck(params2);


  const params3: Parameters<typeof FServiceAPI.User.batchUserList>[0] = {
    userIds: data_batchResourceInfo.map<number>((r) => {
      return r.userId;
    }).join(','),
  };

  const { data: data_batchUserList }: {
    data: {
      userId: number;
      status: 0 | 1 | 2 | 3; // 用户状态 0:正常 1:冻结 2:测试资格审核中 3:申请测试资格未通过
    }[];
  } = await FServiceAPI.User.batchUserList(params3);

  // console.log(data_batchUserList, 'data_batchUserList9isfjsdlijj89ijhokj');

  const params4: Parameters<typeof FServiceAPI.Resource.batchAuth>[0] = {
    resourceIds: licensorResourceIDs.join(','),
  };
  const { data: data_batchAuth }: {
    data: {
      isAuth: boolean;
      resourceId: string;
    }[];
  } = await FServiceAPI.Resource.batchAuth(params4);

  // console.log(data_batchAuth, 'data_batchAuth9iowsejfsldkfjl;skdjflksdj');

  const resourceTargetInfos: FResourceAuthorizationProcessorStates['targetInfos'] = data_batchResourceInfo.map((r) => {
    let error: FResourceAuthorizationProcessorStates['targetInfos'][number]['error'] = '';
    let warning: FResourceAuthorizationProcessorStates['targetInfos'][number]['warning'] = '';

    const ownerUserInfo = data_batchUserList.find((user) => {
      return user.userId === r.userId;
    });

    const resourceAuth = data_batchAuth.find((a) => {
      return a.resourceId === r.resourceId;
    });

    if (r.status === 0) {
      error = 'offline';
    } else if ((r.status & 2) === 2) {
      error = 'freeze';
    } else if (cycleDependencyResourceID.includes(r.resourceId)) {
      error = 'cyclicDependency';
    } else if (licenseeResource?.baseUpcastResources.some((b) => {
      return b.resourceID === r.resourceId;
    })) {
      error = 'upThrow';
    }

    if (ownerUserInfo?.status === 1) {
      warning = 'ownerFreeze';
    } else if (!resourceAuth) {
      warning = 'authException';
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
      warning: warning,
      versions: r.resourceVersions.map((v) => {
        return v.version;
      }),
      upThrow: false,
      upThrowDisabled: licenseeResource?.latestVersion !== '',
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

  return resourceTargetInfos;
}

export async function getProcessor(): Promise<Processor> {
  while (true) {
    if (processor) {
      return processor;
    }
    await FUtil.Tool.promiseSleep(300);
  }
}
