import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';

export type ResourceCreatorBatchPageState = {
  showPage: 'resourceType' | 'uploadFile' | 'resourceList';

  selectedResourceType: {
    value: string;
    labels: string[];
  } | null;

  resourceListInfo: {
    fileUID: string;
    fileName: string;
    sha1: string;
    cover: string;
    resourceName: string;
    resourceTitle: string;
    resourceLabels: string[];
    resourcePolicies: {
      title: string;
      text: string;
    }[];
    showMore: boolean;
    additionalProperties: {
      key: string;
      value: string;
    }[];
    customProperties: {
      key: string;
      name: string;
      value: string;
      description: string;
    }[];
    customConfigurations: {
      key: string;
      name: string;
      description: string;
      type: 'input' | 'select';
      input: string;
      select: string[];
    }[];
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
  }[];
};

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceCreatorBatchPage/change';
  payload: Partial<ResourceCreatorBatchPageState>;
}

export interface OnMount_Page_Action extends AnyAction {
  type: 'resourceCreatorBatchPage/onMount_Page';
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'resourceCreatorBatchPage/onUnmount_Page';
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

interface ResourceCreatorBatchPageModelType {
  namespace: 'resourceCreatorBatchPage';
  state: ResourceCreatorBatchPageState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceCreatorBatchPageState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: ResourceCreatorBatchPageState = {
  showPage: 'resourceType',

  selectedResourceType: null,

  resourceListInfo: [],
};

const Model: ResourceCreatorBatchPageModelType = {
  namespace: 'resourceCreatorBatchPage',
  state: initStates,
  effects: {
    * onMount_Page({}: OnMount_Page_Action, {}: EffectsCommandMap) {

    },
    * onUnmount_Page({}: OnUnmount_Page_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * fetchInfo({}: FetchInfoAction, {}: EffectsCommandMap) {

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
