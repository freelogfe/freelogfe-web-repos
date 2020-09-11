import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';

export interface StorageHomePageModelState {
  newBucketName: string;
  bucketList: string[];
  activatedBucket: string;
  totalStorage: number;
  usedStorage: number;

  currentBucketInfo: {
    name: string;
    createTime: string;
    objectQuantity: number;
  } | null;
  objectList: {
    name: string;

  }[];
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'storageHomePage/change';
  payload: Partial<StorageHomePageModelState>;
}

interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

export interface StorageHomePageModelType {
  namespace: 'storageHomePage';
  state: StorageHomePageModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<StorageHomePageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: StorageHomePageModelType = {
  namespace: 'storageHomePage',
  state: {
    newBucketName: '',
    bucketList: [],
    activatedBucket: '',
    totalStorage: -1,
    usedStorage: -1,

    currentBucketInfo: null,
  },
  effects: {
    * fetchInfo({}, {}) {

    },
  },
  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  subscriptions: {
    setup({}) {

    }
  }
};

export default Model;
