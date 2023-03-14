import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer, WholeReadonly } from './shared';
import { ConnectState } from '@/models/connect';
import { history } from 'umi';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import { IResourceCreateVersionDraft } from '@/type/resourceTypes';

export interface ResourceInfoModelState {
  resourceID: string;
  showPage: {
    info?: boolean;
    auth?: boolean;
    creator?: boolean;
    version?: string;
  };

  // hasPermission: boolean;

  info: null | {
    resourceId: string;
    resourceType: string[];
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
  authProblem: boolean;

  draftData: null | IResourceCreateVersionDraft;

  policyEditorVisible: boolean;
  policies: PolicyFullInfo_Type[];
  policyOperaterVisible: boolean;
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

export interface OnChange_DraftData_Action extends AnyAction {
  type: 'resourceInfo/onChange_DraftData';
  payload: {
    draftData: IResourceCreateVersionDraft | null;
  };
}

export interface ResourceInfoModelType {
  namespace: 'resourceInfo';
  state: WholeReadonly<ResourceInfoModelState>;
  effects: {
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
    fetchDraftData: (action: FetchDraftDataAction, effects: EffectsCommandMap) => void;
    initModelState: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
    onChange_DraftData: (action: OnChange_DraftData_Action, effects: EffectsCommandMap) => void;
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
  authProblem: false,
  draftData: null,
  // hasPermission: true,
  policyEditorVisible: false,
  policyOperaterVisible: false,

  policies: [],
};

const Model: ResourceInfoModelType = {
  namespace: 'resourceInfo',

  state: initStates,

  effects: {
    * fetchDataSource({ payload }: FetchDataSourceAction, {
      call,
      put,
      select,
    }: EffectsCommandMap): Generator<any, void, any> {
      const params: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: payload,
        isLoadPolicyInfo: 1,
        isTranslate: 1,
      };
      const { data } = yield call(FServiceAPI.Resource.info, params);
      // console.log(data, 'DDDDDDDD');

      if (!data || data.userId !== FUtil.Tool.getUserIDByCookies()) {
        history.replace(FUtil.LinkTo.exception403());
        return;
      }

      if ((data.status & 2) === 2) {
        history.replace(FUtil.LinkTo.resourceFreeze({ resourceID: data.resourceId }));
        return;
      }

      let authProblem: boolean = false;
      if (data['latestVersion'] !== '') {
        const params1: Parameters<typeof FServiceAPI.Resource.batchAuth>[0] = {
          resourceIds: data['resourceId'],
        };
        const { data: data1 } = yield call(FServiceAPI.Resource.batchAuth, params1);
        // console.log(data1, 'data1232@@@@@');
        authProblem = !data1[0].isAuth;
      }

      // yield call(FUtil.Tool.promiseSleep, 1000);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          info: data,
          // hasPermission: data.userId === user.info?.userId,
          authProblem: authProblem,
        },
      });

      yield put<FetchDraftDataAction>({
        type: 'fetchDraftData',
      });

      const policies: PolicyFullInfo_Type[] = data.policies || [];

      policies.reverse();

      policies.sort((a, b) => {
        return a.status === 1 && b.status === 0 ? -1 : 0;
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          policies: policies,
        },
      });
    },
    * fetchDraftData({}: FetchDraftDataAction, { select, put, call }: EffectsCommandMap) {
      const { resourceInfo }: ConnectState = yield select(({ resourceInfo }: ConnectState) => ({
        resourceInfo,
      }));

      const params: Parameters<typeof FServiceAPI.Resource.lookDraft>[0] = {
        resourceId: resourceInfo.resourceID,
      };
      const { data } = yield call(FServiceAPI.Resource.lookDraft, params);
      if (!data) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            draftData: null,
          },
        });
        return;
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          draftData: data.draftData,
        },
      });
    },
    * initModelState({}: InitModelStatesAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * onChange_DraftData({ payload }: OnChange_DraftData_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          draftData: payload.draftData,
        },
      });
    },
  },

  reducers: {
    changeInfo(state: ResourceInfoModelState, action: ChangeInfoAction): ResourceInfoModelState {
      return {
        ...state,
        info: action.payload,
      };
    },
    change(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {
      // console.log(history, 'historyhistory');
    },
  },
};

export default Model;
