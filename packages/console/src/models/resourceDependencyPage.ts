import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FServiceAPI } from '@freelog/tools-lib';
import { ConnectState } from '@/models/connect';
import { PolicyFullInfo_Type } from '@/type/contractTypes';

export interface ResourceDependencyPageState {
  resourceID: string;
  directDependencies: {
    id: string;
    name: string;
    type: 'resource' | 'object';
    versionRange?: string;
  }[];
  baseUpcastResources: {
    resourceID: string;
    resourceName: string;
  }[];
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<ResourceDependencyPageState>;
}

export interface OnMount_Page_Action extends AnyAction {
  type: 'resourceDependencyPage/onMount_Page';
  payload: {
    resourceID: string;
  };
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'resourceDependencyPage/onUnmount_Page';
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

interface ResourceDependencyPageType {
  namespace: 'resourceDependencyPage';
  state: ResourceDependencyPageState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceDependencyPageState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: ResourceDependencyPageState = {
  resourceID: '',
  directDependencies: [],
  baseUpcastResources: [],
};

const Model: ResourceDependencyPageType = {
  namespace: 'resourceDependencyPage',
  state: initStates,
  effects: {
    * onMount_Page({ payload }: OnMount_Page_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceID: payload.resourceID,
        },
      });
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * onUnmount_Page({}: OnUnmount_Page_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * fetchInfo({}: FetchInfoAction, { select, call, put }: EffectsCommandMap) {
      const { resourceDependencyPage }: ConnectState = yield select(({ resourceDependencyPage }: ConnectState) => ({
        resourceDependencyPage,
      }));

      const params0: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: resourceDependencyPage.resourceID,
      };
      // console.log(params, 'params9iosdj;flkjlk lksdajf;lkjl');
      const { data: data_resourceInfo }: {
        data: {
          baseUpcastResources: {
            resourceId: string;
            resourceName: string;
          }[];
        };
      } = yield call(FServiceAPI.Resource.info, params0);

      const params1: Parameters<typeof FServiceAPI.Resource.resolveResources>[0] = {
        resourceId: resourceDependencyPage.resourceID,
      };
      const { data: data_resolveResources }: {
        data: {
          resourceId: string;
          resourceName: string;
          versions: {
            version: string;
            versionId: string;
            contracts: {
              policyId: string;
              contractId: string;
            }[];
          }[];
        }[];
      } = yield call(FServiceAPI.Resource.resolveResources, params1);
      console.log(data_resolveResources, 'data_resolveResources datasiodfjlsdkjflk');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          directDependencies: data_resolveResources.map((r) => {
            return {
              id: r.resourceId,
              name: r.resourceName,
              type: 'resource',
              // versionRange?: string;
              applyVersions: r.versions.map((v) => {
                return v.version;
              }),
            };
          }),
          baseUpcastResources: data_resourceInfo.baseUpcastResources.map((b) => {
            return {
              resourceID: b.resourceId,
              resourceName: b.resourceName,
            };
          }),
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
    setup({}) {

    },
  },
};

export default Model;
