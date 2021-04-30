import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer, WholeReadonly} from './shared';
import {ConnectState} from "@/models/connect";
import {FApiServer} from "@/services";
import {router} from 'umi';
import FUtil from "@/utils";

export interface ResourceInfoModelState {
  resourceID: string;
  showPage: {
    info?: boolean;
    auth?: boolean;
    creator?: boolean;
    version?: string;
  };

  hasPermission: boolean;

  info: null | {
    resourceId: string;
    resourceType: string;
    resourceName: string;
    userId: number;
    username: number;
    coverImages: string[];
    intro: string;
    tags: string[];
    status: 0 | 1;
    latestVersion: string;
    resourceVersions: {
      version: string;
      versionId: string;
      createDate: string;
    }[];
    policies: {
      policyId: string;
      status: 0 | 1;
      policyName: string;
      policyText: string;
    }[];
    baseUpcastResources: {
      resourceId: string;
      resourceName: string;
    }[];
  };

  draftData: null | { [key: string]: any };
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceInfo/change';
  payload: Partial<ResourceInfoModelState>;
}

export interface ChangeInfoAction extends AnyAction {
  type: 'resourceInfo/changeInfo' | 'changeInfo';
  payload: ResourceInfoModelState['info'];
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'resourceInfo/fetchDataSource';
  payload: string;
}

export interface FetchDraftDataAction extends AnyAction {
  type: 'resourceInfo/fetchDraftData' | 'fetchDraftData';
}

export interface InitModelStatesAction extends AnyAction {
  type: 'resourceInfo/initModelStates';
}

export interface ResourceInfoModelType {
  namespace: 'resourceInfo';
  state: WholeReadonly<ResourceInfoModelState>;
  effects: {
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
    fetchDraftData: (action: FetchDraftDataAction, effects: EffectsCommandMap) => void;
    initModelState: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    changeInfo: DvaReducer<ResourceInfoModelState, ChangeInfoAction>;
    change: DvaReducer<ResourceInfoModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const initStates: ResourceInfoModelState = {
  resourceID: '',
  showPage: {},
  info: null,
  draftData: null,
  hasPermission: true,
};

const Model: ResourceInfoModelType = {
  namespace: 'resourceInfo',

  state: initStates,

  effects: {
    * fetchDataSource({payload}: FetchDataSourceAction, {call, put, select}: EffectsCommandMap): Generator<any, void, any> {
      const {user}: ConnectState = yield select(({user}: ConnectState) => ({
        user,
      }));
      const params: Parameters<typeof FApiServer.Resource.info>[0] = {
        resourceIdOrName: payload,
        isLoadPolicyInfo: 1,
      };
      const {data} = yield call(FApiServer.Resource.info, params);
      // console.log(data, 'DDDDDDDD');

      // console.log(data.userId, user.cookiesUserID, '@#@#$@#$@#$@#$@#$@$@$');

      if (!data || data.userId !== user.cookiesUserID) {
        router.replace(FUtil.LinkTo.exception403({}, '9023uopsadfuioasdiofjl;iasdjfll'));
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          info: data,
          // hasPermission: data.userId === user.info?.userId,
        },
      });

      yield put<FetchDraftDataAction>({
        type: 'fetchDraftData',
      });
    },
    * fetchDraftData({}: FetchDraftDataAction, {select, put, call}: EffectsCommandMap) {
      const {resourceInfo}: ConnectState = yield select(({resourceInfo}: ConnectState) => ({
        resourceInfo,
      }));

      if (!resourceInfo.hasPermission) {
        return;
      }

      const params: Parameters<typeof FApiServer.Resource.lookDraft>[0] = {
        resourceId: resourceInfo.resourceID,
      };
      const {data} = yield call(FApiServer.Resource.lookDraft, params);
      if (!data) {
        return yield put<ChangeAction>({
          type: 'change',
          payload: {
            draftData: null,
          }
        });
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          draftData: data.draftData,
        }
      });
    },
    * initModelState({}: InitModelStatesAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
  },

  reducers: {
    changeInfo(state: ResourceInfoModelState, action: ChangeInfoAction): ResourceInfoModelState {
      return {
        ...state,
        info: action.payload
      };
    },
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      // console.log(history, 'historyhistory');
    },
  },

};

export default Model;
