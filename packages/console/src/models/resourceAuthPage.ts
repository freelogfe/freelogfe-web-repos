import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import moment from 'moment';
import { ConnectState, NodeManagerModelState } from '@/models/connect';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import fMessage from '@/components/fMessage';
import fPolicyBuilder from '@/components/fPolicyBuilder';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';
import { OnUpdate_Data_Action } from '@/models/resourceSider';

export interface ResourceAuthPageModelState {
  resourceID: string;
  resourceName: string;
  pageState: 'loading' | 'loaded';

  policies: PolicyFullInfo_Type[];
  policyPreviewVisible: boolean;
  policyPreviewText: string;
  policyEditorVisible: boolean;

  baseUastResources: {
    resourceId: string;
    resourceName: string;
  }[];
  contractsAuthorized: {
    id: string;
    activated: boolean;
    title: string;
    resourceType: string;
    version: string;
    state: 'offline' | 'online';
    error: '' | 'offline' | 'unreleased' | 'freeze';
    warning: '';
    contracts: {
      checked: boolean;
      title: string;
      status: 'active' | 'testActive' | 'inactive' | 'terminal';
      code: string;
      id: string;
      date: string;
      policyId: string;
      versions: { version: string; checked: boolean; disabled: boolean }[];
    }[];
    terminatedContractIDs: string[];
    policies: {
      fullInfo: PolicyFullInfo_Type;
      allEnabledVersions: string[];
    }[];
  }[];

  contractsAuthorize: {
    key: string,
    contractName: string,
    contractID: string,
    authorizedParty: string,
    licenseeID: string;
    licenseeIdentityType: 'resource' | 'node' | 'user';
    createDate: string,
    status: 'active' | 'testActive' | 'inactive' | 'terminal';
  }[];

  detailContractID: string;

  status: 0 | 1;
}

export interface UpdatePoliciesAction {
  type: 'resourceAuthPage/updatePolicies';
  payload: {
    updatePolicies?: {
      policyId: string;
      status: 0 | 1; // 0:下线策略 1:上线策略
    }[];
    addPolicies?: {
      policyName: string;
      policyText: string;
    }[];
  };
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceAuthPage/change',
  payload: Partial<ResourceAuthPageModelState>;
}

export interface OnMount_Page_Action extends AnyAction {
  type: 'resourceAuthPage/onMount_Page';
  payload: {
    resourceID: string;
  };
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'resourceAuthPage/onUnmount_Page';
}

export interface OnMount_PolicyPage_Action extends AnyAction {
  type: 'resourceAuthPage/onMount_PolicyPage';
  payload: {
    resourceID: string;
  };
}

export interface OnUnmount_PolicyPage_Action extends AnyAction {
  type: 'resourceAuthPage/onUnmount_PolicyPage';
}

export interface OnMount_ContractPage_Action extends AnyAction {
  type: 'resourceAuthPage/onMount_ContractPage';
  payload: {
    resourceID: string;
  };
}

export interface OnUnmount_ContractPage_Action extends AnyAction {
  type: 'resourceAuthPage/onUnmount_ContractPage';
}

export interface OnMount_DependencyPage_Action extends AnyAction {
  type: 'resourceAuthPage/onMount_DependencyPage';
  payload: {
    resourceID: string;
  };
}

export interface OnUnmount_DependencyPage_Action extends AnyAction {
  type: 'resourceAuthPage/onUnmount_DependencyPage';
}

export interface FetchResourceInfoAction extends AnyAction {
  type: 'resourceAuthPage/fetchResourceInfo' | 'fetchResourceInfo',
}

export interface FetchAuthorizedAction extends AnyAction {
  type: 'resourceAuthPage/fetchAuthorized' | 'fetchAuthorized',
  payload: {
    activatedResourceId?: string;
  };
}

export interface FetchAuthorizeAction extends AnyAction {
  type: 'resourceAuthPage/fetchAuthorize' | 'fetchAuthorize',
}

export interface UpdateAuthorizedAction extends AnyAction {
  type: 'resourceAuthPage/updateAuthorized',
  payload: {
    version: string;
    policyId: string;
    operation: 0 | 1;
  }[];
}

export interface OnAdd_Policy_Action extends AnyAction {
  type: 'resourceAuthPage/onAdd_Policy';
  payload?: {
    defaultValue: { text: string; title: string; };
  };
}

export interface OnTrigger_AuthorizedContractEvent_Action extends AnyAction {
  type: 'resourceAuthPage/onTrigger_AuthorizedContractEvent';
}

interface ResourceAuthPageModelType {
  namespace: 'resourceAuthPage';
  state: ResourceAuthPageModelState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    onMount_PolicyPage: (action: OnMount_PolicyPage_Action, effects: EffectsCommandMap) => void;
    onUnmount_PolicyPage: (action: OnUnmount_PolicyPage_Action, effects: EffectsCommandMap) => void;
    onMount_ContractPage: (action: OnMount_ContractPage_Action, effects: EffectsCommandMap) => void;
    onUnmount_ContractPage: (action: OnUnmount_ContractPage_Action, effects: EffectsCommandMap) => void;
    onMount_DependencyPage: (action: OnMount_DependencyPage_Action, effects: EffectsCommandMap) => void;
    onUnmount_DependencyPage: (action: OnUnmount_DependencyPage_Action, effects: EffectsCommandMap) => void;

    updatePolicies: (action: UpdatePoliciesAction, effects: EffectsCommandMap) => void;
    fetchResourceInfo: (action: FetchResourceInfoAction, effects: EffectsCommandMap) => void;
    fetchAuthorized: (action: FetchAuthorizedAction, effects: EffectsCommandMap) => void;
    fetchAuthorize: (action: FetchAuthorizeAction, effects: EffectsCommandMap) => void;
    updateAuthorized: (action: UpdateAuthorizedAction, effects: EffectsCommandMap) => void;

    onAdd_Policy: (action: OnAdd_Policy_Action, effects: EffectsCommandMap) => void;
    onTrigger_AuthorizedContractEvent: (action: OnTrigger_AuthorizedContractEvent_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceAuthPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

enum LicenseeIdentityType {
  resource = 1,
  node = 2,
  user = 3
}

const Model: ResourceAuthPageModelType = {

  namespace: 'resourceAuthPage',

  state: {
    resourceID: '',
    resourceName: '',
    pageState: 'loading',
    policies: [],
    policyPreviewVisible: false,
    policyPreviewText: '',
    policyEditorVisible: false,

    baseUastResources: [],
    contractsAuthorized: [],
    contractsAuthorize: [],

    detailContractID: '',

    status: 0,
  },
  effects: {
    * onMount_Page(action: OnMount_Page_Action, effects: EffectsCommandMap) {
    },
    * onUnmount_Page(action: OnUnmount_Page_Action, effects: EffectsCommandMap) {
    },
    * onMount_PolicyPage({ payload }: OnMount_PolicyPage_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceID: payload.resourceID,
        },
      });

      console.log(payload.resourceID, 'payload.resourceID sdiofjsdikfjlsdkjflkdsjflkj');

      yield put<FetchResourceInfoAction>({
        type: 'fetchResourceInfo',
      });
    },
    * onUnmount_PolicyPage(action: OnUnmount_PolicyPage_Action, effects: EffectsCommandMap) {
    },
    * onMount_ContractPage({ payload }: OnMount_ContractPage_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceID: payload.resourceID,
        },
      });

      yield put<FetchAuthorizeAction>({
        type: 'fetchAuthorize',
      });
    },
    * onUnmount_ContractPage({}: OnUnmount_ContractPage_Action, {}: EffectsCommandMap) {
    },
    * onMount_DependencyPage({ payload }: OnMount_DependencyPage_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceID: payload.resourceID,
        },
      });

      yield put<FetchResourceInfoAction>({
        type: 'fetchResourceInfo',
      });

      yield put<FetchAuthorizedAction>({
        type: 'fetchAuthorized',
        payload: {},
      });
    },
    * onUnmount_DependencyPage(action: OnUnmount_DependencyPage_Action, effects: EffectsCommandMap) {
    },

    * fetchResourceInfo({}: FetchResourceInfoAction, { select, call, put }: EffectsCommandMap) {
      const { resourceAuthPage }: ConnectState = yield select(({ resourceAuthPage }: ConnectState) => ({
        resourceAuthPage,
      }));

      if (!resourceAuthPage.resourceID) {
        return;
      }

      const params: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: resourceAuthPage.resourceID,
        isLoadPolicyInfo: 1,
        isTranslate: 1,
      };

      const { data: data_ResourceDetails, ret, errCode }: {
        ret: number;
        errCode: number;
        data: {
          resourceId: string;
          resourceName: string;
          policies: PolicyFullInfo_Type[];
          baseUpcastResources: any[];
          status: 0 | 1;
        }
      } = yield call(FServiceAPI.Resource.info, params);
      // console.log(data_ResourceDetails, '@#$RFDSASDFSDFASDF');

      if (ret !== 0 || errCode !== 0) {
        return;
      }

      const policies: PolicyFullInfo_Type[] = data_ResourceDetails.policies || [];

      policies.reverse();

      policies.sort((a, b) => {
        return (a.status === 1 && b.status === 0) ? -1 : 0;
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceName: data_ResourceDetails.resourceName,
          policies: policies,
          baseUastResources: data_ResourceDetails.baseUpcastResources || [],
          status: data_ResourceDetails.status,
        },
      });
    },
    * updatePolicies({ payload }: UpdatePoliciesAction, { call, put, select }: EffectsCommandMap) {
      const { resourceAuthPage }: ConnectState = yield select(({ resourceAuthPage }: ConnectState) => ({
        resourceAuthPage,
      }));
      const params: Parameters<typeof FServiceAPI.Resource.update>[0] = {
        resourceId: resourceAuthPage.resourceID,
        ...payload,
      };
      yield call(FServiceAPI.Resource.update, params);
      // yield put<FetchDataSourceAction>({
      //   type: 'resourceInfo/fetchDataSource',
      //   payload: resourceAuthPage.resourceID,
      // });
      yield put<FetchResourceInfoAction>({
        type: 'fetchResourceInfo',
      });
    },
    * fetchAuthorized({ payload: { activatedResourceId } }: FetchAuthorizedAction, {
      call,
      put,
      select,
    }: EffectsCommandMap) {
      const { resourceAuthPage }: ConnectState = yield select(({ resourceAuthPage }: ConnectState) => ({
        resourceAuthPage,
      }));

      const params: Parameters<typeof FServiceAPI.Resource.resolveResources>[0] = {
        resourceId: resourceAuthPage.resourceID,
      };
      const { data: data_resolveResources }: {
        data: any[];
      } = yield call(FServiceAPI.Resource.resolveResources, params);

      // console.log(data, 'datadata232323');
      if (data_resolveResources.length === 0) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            contractsAuthorized: [],
          },
        });
        return;
      }

      const params2: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
        resourceIds: data_resolveResources.map((i: any) => i.resourceId).join(','),
        isLoadPolicyInfo: 1,
        isTranslate: 1,
      };
      // console.log(resourceParams, 'resourceParams908hik');
      const { data: data_resourceBatchInfo } = yield call(FServiceAPI.Resource.batchInfo, params2);
      // console.log(resourcesInfoData, 'resourcesInfoDataresourcesInfoData');

      const params1: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
        subjectIds: data_resolveResources.map((i: any) => i.resourceId).join(','),
        licenseeId: resourceAuthPage.resourceID,
        subjectType: 1,
        licenseeIdentityType: 1,
        isLoadPolicyInfo: 1,
      };
      const { data: data_batchContracts } = yield call(FServiceAPI.Contract.batchContracts, params1);
      // console.log(data1, 'data112#$!@#$!@#$!@#$12341234');

      const contractsAuthorized: ResourceAuthPageModelState['contractsAuthorized'] = data_resolveResources
        .map<ResourceAuthPageModelState['contractsAuthorized'][number]>((i: any, j: number) => {
          // 当前资源信息
          const currentResource = data_resourceBatchInfo.find((resource: any) => {
            return resource.resourceId === i.resourceId;
          });

          const allEnabledVersions: string[] = i.versions.map((version: any) => {
            return version.version;
          });

          const allContracts = data_batchContracts
            .filter((c: any) => {
              return c.licensorId === i.resourceId;
            });

          const allUsedPoliciesId = allContracts
            .filter((c: any) => c.status !== 1)
            .map((c: any) => c.policyId);

          return {
            id: currentResource.resourceId,
            activated: activatedResourceId ? activatedResourceId === currentResource.resourceId : (j === 0),
            title: currentResource.resourceName,
            resourceType: currentResource.resourceType,
            version: '',
            state: currentResource.status === 1 ? 'online' : 'offline',
            error: currentResource.status === 0
              ? 'unreleased'
              : currentResource.status === 2
                ? 'freeze'
                : currentResource.status === 4
                  ? 'offline'
                  : '',
            warning: '',
            contracts: allContracts
              .filter((c: any) => c.status === 0)
              .map((c: any) => {
                // console.log(c, '当前合约');
                // console.log(i, '关系');
                return {
                  checked: true,
                  id: c.contractId,
                  policyId: c.policyId,
                  title: c.contractName,
                  // status: c.status === 0 ? 'stopping' : 'executing',
                  status: c.status === 1 ? 'terminal' : (c.authStatus === 1 || c.authStatus === 3) ? 'active' : c.authStatus === 2 ? 'testActive' : 'inactive',
                  code: c.policyInfo.policyText,
                  date: moment(c.createDate).format('YYYY-MM-DD HH:mm'),
                  // versions: [{$version: '10.5.2', checked: true}, {$version: '10.5.3', checked: false}]
                  versions: allEnabledVersions.map((v: string) => {
                    // console.log(i, currentResource, c, v, 'aw39osidc');
                    const versionContracts = i.versions?.find((version: any) => version.version === v)?.contracts;
                    // const versionChecked: boolean = versionContracts?.some((contract: any) => contract.contractId === c.contractId && c.status !== 1);
                    const versionChecked: boolean = versionContracts?.some((contract: any) => contract.contractId === c.contractId);
                    return {
                      version: v,
                      checked: versionChecked,
                      disabled: (versionContracts.length === 1) && versionChecked,
                    };
                  }),
                };
              }),
            terminatedContractIDs: allContracts
              .filter((c: any) => {
                return c.status === 1;
              })
              .map((c: any) => {
                return c.contractId;
              }),
            policies: currentResource
              ?.policies
              .filter((p: any) => {
                return !allUsedPoliciesId.includes(p.policyId) && p.status === 1;
              })
              .map((policy: any) => {
                return {
                  fullInfo: policy,
                  allEnabledVersions: allEnabledVersions,
                };
              }),
          };
        });
      // console.log(contractsAuthorized, 'contractsAuthorized9023oijhilkjsdklj;fajlsdj');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          contractsAuthorized,
        },
      });
    },
    * fetchAuthorize({ payload }: FetchAuthorizeAction, { call, put, select }: EffectsCommandMap) {
      const { resourceAuthPage }: ConnectState = yield select(({ resourceAuthPage }: ConnectState) => ({
        resourceAuthPage,
      }));

      const params: Parameters<typeof FServiceAPI.Contract.contracts>[0] = {
        identityType: 1,
        licensorId: resourceAuthPage.resourceID,
        limit: FUtil.Predefined.pageSize,
      };
      // console.log('@#RWEQFRSDF');
      const { data }: {
        data: {
          dataList: {
            contractId: string;
            contractName: string;
            licenseeId: string;
            licenseeName: string;
            licenseeIdentityType: 1 | 2 | 3;
            createDate: string;
            status: 0 | 1;
            authStatus: number;
          }[]
        }
      } = yield call(FServiceAPI.Contract.contracts, params);
      // console.log(data, '12342139(((((()))()())(134');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          contractsAuthorize: data.dataList.map<ResourceAuthPageModelState['contractsAuthorize'][number]>((i) => {
            return {
              key: i.contractId,
              contractName: i.contractName,
              contractID: i.contractId,
              authorizedParty: i.licenseeName,
              licenseeID: i.licenseeId,
              licenseeIdentityType: LicenseeIdentityType[i.licenseeIdentityType] as 'resource',
              createDate: moment(i.createDate).format('YYYY-MM-DD HH:mm'),
              status: i.status === 1 ? 'terminal' : (i.authStatus === 1 || i.authStatus === 3) ? 'active' : i.authStatus === 2 ? 'testActive' : 'inactive',
            };
          }),
        },
      });
    },
    * updateAuthorized({ payload }: UpdateAuthorizedAction, { select, call, put }: EffectsCommandMap) {
      const { resourceAuthPage }: ConnectState = yield select(({ resourceAuthPage }: ConnectState) => ({
        resourceAuthPage,
      }));
      const params: Parameters<typeof FServiceAPI.Resource.batchSetContracts>[0] = {
        resourceId: resourceAuthPage.resourceID,
        subjects: [{
          subjectId: (resourceAuthPage.contractsAuthorized.find((auth) => auth.activated) as any).id,
          versions: payload,
        }],
      };
      const { ret, errCode, data, msg } = yield call(FServiceAPI.Resource.batchSetContracts, params);
      if (ret !== 0 || errCode !== 0) {
        fMessage(msg, 'error');
        return;
      }
      yield put<FetchAuthorizedAction>({
        type: 'fetchAuthorized',
        payload: {
          // baseResourceId: resourceInfo.info?.resourceId || '',
          activatedResourceId: (resourceAuthPage.contractsAuthorized.find((auth) => auth.activated) as any).id,
        },
      });
      yield put<FetchResourceInfoAction>({
        type: 'fetchResourceInfo',
      });
      // yield put<FetchDataSourceAction>({
      //   type: 'resourceInfo/fetchDataSource',
      //   payload: resourceAuthPage.resourceID,
      // });
    },

    * onAdd_Policy({ payload }: OnAdd_Policy_Action, { select, call, put }: EffectsCommandMap) {
      self._czc?.push(['_trackEvent', '授权信息页', '添加授权策略', '', 1]);
      const { resourceAuthPage }: ConnectState = yield select(({ resourceAuthPage }: ConnectState) => ({
        resourceAuthPage,
      }));
      const parmas: Parameters<typeof fPolicyBuilder>[0] = {
        targetType: 'resource',
        alreadyUsedTexts: resourceAuthPage.policies.map<string>((ip) => {
          return ip.policyText;
        }),
        alreadyUsedTitles: resourceAuthPage.policies.map((ip) => {
          return ip.policyName;
        }),
        defaultValue: payload?.defaultValue,
      };
      const result: null | { title: string; text: string; } = yield call(fPolicyBuilder, parmas);
      if (!result) {
        return;
      }
      const params: Parameters<typeof FServiceAPI.Resource.update>[0] = {
        resourceId: resourceAuthPage.resourceID,
        addPolicies: [{
          policyName: result.title,
          policyText: window.encodeURIComponent(result.text),
        }],
      };
      const res: {
        ret: number;
        errCode: number;
        msg: string;
      } = yield call(FServiceAPI.Resource.update, params);

      if (res.ret !== 0 || res.errCode !== 0) {
        fMessage(res.msg, 'error');
        return;
      }

      yield call(online_afterSuccessCreatePolicy, resourceAuthPage.resourceID);

      // yield put<FetchDataSourceAction>({
      //   type: 'resourceInfo/fetchDataSource',
      //   payload: resourceAuthPage.resourceID,
      // });
      yield put<FetchResourceInfoAction>({
        type: 'fetchResourceInfo',
      });

      yield put<OnUpdate_Data_Action>({
        type: 'resourceSider/onUpdate_Data',
        // payload: resourceInfoPage.resourceID,
      });
    },
    * onTrigger_AuthorizedContractEvent({}: OnTrigger_AuthorizedContractEvent_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { resourceAuthPage }: ConnectState = yield select(({ resourceAuthPage }: ConnectState) => ({
        resourceAuthPage,
      }));
      // yield put<FetchDataSourceAction>({
      //   type: 'resourceInfo/fetchDataSource',
      //   payload: resourceAuthPage.resourceID,
      // });
      yield put<FetchAuthorizedAction>({
        type: 'fetchAuthorized',
        payload: {
          activatedResourceId: resourceAuthPage.contractsAuthorized.find((ca) => {
            return ca.activated;
          })?.id || '',
        },
      });
    },
  },
  reducers: {
    change(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {
    },
  },
};

export default Model;

async function online_afterSuccessCreatePolicy(resourceID: string) {
  // console.log(resourceID, 'resourceIDoisdjflksjdflkjlk');
  const { data: data_resourceInfo } = await FServiceAPI.Resource.info({
    resourceIdOrName: resourceID,
    isLoadPolicyInfo: 1,
    isLoadLatestVersionInfo: 1,
  });
  if (data_resourceInfo.status === 1 || data_resourceInfo.latestVersion === '') {
    return;
  }
  const result = await fPromiseModalConfirm({
    title: '资源待上架',
    description: '将资源上架到资源市场开放授权，为你带来更多收益',
    okText: '立即上架',
    cancelText: '暂不上架',
  });

  if (!result) {
    return;
  }

  const params: Parameters<typeof FServiceAPI.Resource.update>[0] = {
    resourceId: resourceID,
    status: 1,
  };
  await FServiceAPI.Resource.update(params);
}
