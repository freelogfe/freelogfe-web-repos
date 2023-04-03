import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { IResourceCreateVersionDraft } from '@/type/resourceTypes';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { history } from '@@/core/history';
import { ConnectState } from '@/models/connect';

export type ResourceSiderModelState = {
  state: 'loading' | 'loaded';
  resourceID: string;
  resourceName: string;
  resourceState: '' | 'unreleased' | 'offline' | 'online';
  resourceCover: string;
  resourceType: string[];
  resourceVersions: string[];

  showPage: '' | 'info' | 'auth' | 'versionCreator' | 'versionInfo';
  showVersionPage: string;

  hasAuthProblem: boolean;
  policies: PolicyFullInfo_Type[];
  draft: null | IResourceCreateVersionDraft;
};

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<ResourceSiderModelState>;
}

export interface OnMount_Page_Action extends AnyAction {
  type: 'resourceSider/onMount_Page';
  payload: {
    resourceID: string;
  };
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'resourceSider/onUnmount_Page';
}

export interface OnChange_Page_Action extends AnyAction {
  type: 'resourceSider/onChange_Page';
  payload: {
    page: 'info' | 'auth' | 'versionCreator' | 'versionInfo';
    version?: string;
  };
}

export interface OnUpdate_Data_Action extends AnyAction {
  type: 'resourceSider/onUpdate_Data';
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

export interface FetchDraftAction extends AnyAction {
  type: 'fetchDraft';
}

export interface OnChange_Draft_Action extends AnyAction {
  type: 'resourceSider/onChange_Draft';
  payload: {
    value: IResourceCreateVersionDraft;
  };
}

interface ResourceSiderModelType {
  namespace: 'resourceSider';
  state: ResourceSiderModelState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    onChange_Page: (action: OnChange_Page_Action, effects: EffectsCommandMap) => void;
    onUpdate_Data: (action: OnUpdate_Data_Action, effects: EffectsCommandMap) => void;
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    fetchDraft: (action: FetchDraftAction, effects: EffectsCommandMap) => void;
    onChange_Draft: (action: OnChange_Draft_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceSiderModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: ResourceSiderModelState = {
  state: 'loading',
  resourceID: '',
  resourceName: '',
  resourceState: '',
  resourceCover: '',
  resourceType: [],
  resourceVersions: [],

  showPage: '',
  showVersionPage: '',

  hasAuthProblem: false,
  policies: [],
  draft: null,
};

const Model: ResourceSiderModelType = {
  namespace: 'resourceSider',
  state: initStates,
  effects: {
    * onMount_Page({ payload }: OnMount_Page_Action, { select, put }: EffectsCommandMap) {
      const { resourceSider }: ConnectState = yield select(({ resourceSider }: ConnectState) => ({
        resourceSider,
      }));
      if (resourceSider.resourceID !== '') {
        return;
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceID: payload.resourceID,
        },
      });
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
      yield put<FetchDraftAction>({
        type: 'fetchDraft',
      });
    },
    * onUnmount_Page({}: OnUnmount_Page_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * onChange_Page({ payload }: OnChange_Page_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showPage: payload.page,
          showVersionPage: payload.version,
        },
      });
    },
    * onUpdate_Data({}: OnUpdate_Data_Action, { put }: EffectsCommandMap) {
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * fetchInfo({}: FetchInfoAction, { call, select, put }: EffectsCommandMap) {
      const { resourceSider }: ConnectState = yield select(({ resourceSider }: ConnectState) => ({
        resourceSider,
      }));
      const params: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: resourceSider.resourceID,
        isLoadPolicyInfo: 1,
        isTranslate: 1,
      };

      const { data: data_resourceInfo } = yield call(FServiceAPI.Resource.info, params);
      // console.log(data_resourceInfo, 'data_resourceInfooisdjlfkdjlfkjsdlkj');

      if (!data_resourceInfo || data_resourceInfo.userId !== FUtil.Tool.getUserIDByCookies()) {
        history.replace(FUtil.LinkTo.exception403());
        return;
      }

      if (data_resourceInfo.status === 2) {
        history.replace(FUtil.LinkTo.resourceFreeze({ resourceID: data_resourceInfo.resourceId }));
        return;
      }

      let authProblem: boolean = false;
      if (data_resourceInfo.latestVersion !== '') {
        const params1: Parameters<typeof FServiceAPI.Resource.batchAuth>[0] = {
          resourceIds: data_resourceInfo.resourceId,
        };
        const { data: data_batchAuth } = yield call(FServiceAPI.Resource.batchAuth, params1);
        authProblem = !data_batchAuth[0].isAuth;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          state: 'loaded',
          resourceName: data_resourceInfo.resourceName,
          resourceState: data_resourceInfo.status === 0 ? 'unreleased' : data_resourceInfo.status === 4 ? 'offline' : 'online',
          resourceCover: data_resourceInfo.coverImages[0] || '',
          resourceType: data_resourceInfo.resourceType,
          resourceVersions: data_resourceInfo.resourceVersions.map((v: any) => {
            return v.version;
          }),
          hasAuthProblem: authProblem,
          policies: data_resourceInfo.policies,
        },
      });
    },
    * fetchDraft({}: FetchDraftAction, { select, put, call }: EffectsCommandMap) {
      const { resourceSider }: ConnectState = yield select(({ resourceSider }: ConnectState) => ({
        resourceSider,
      }));

      const params: Parameters<typeof FServiceAPI.Resource.lookDraft>[0] = {
        resourceId: resourceSider.resourceID,
      };
      // console.log(params, 'params9iosdjflksjdflkjlk');
      const { data: data_draft } = yield call(FServiceAPI.Resource.lookDraft, params);
      // console.log(data_draft, 'data_draftijsdlkfjsldkfjlkdsjflkj');
      if (!data_draft) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            draft: null,
          },
        });
        return;
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          draft: data_draft.draftData,
        },
      });
    },
    * onChange_Draft({ payload }: OnChange_Draft_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          draft: payload.value,
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
