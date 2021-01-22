import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';

export type InformalNodeManagerPageModelState = WholeReadonly<{
  showPage: 'exhibit' | 'theme' | 'mappingRule';

  addExhibitDrawerVisible: boolean;

  replaceHandlerModalVisible: boolean;
  replacerActivatedTab: 'market' | 'resource' | 'collection';
  replacerInput: string;
  replacerList: {
    id: string;
    checked: boolean;
    name: string;
    status: 'online' | 'offline' | 'unreleased';
    type: string;
    latestVersion: string;
    version: string;
    date: string;
  }[];

}>;

export interface ChangeAction extends AnyAction {
  type: 'change' | 'informalNodeManagerPage/change';
  payload: Partial<InformalNodeManagerPageModelState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'initModelStates';
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

interface InformalNodeManagerPageModelType {
  namespace: 'informalNodeManagerPage';
  state: InformalNodeManagerPageModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<InformalNodeManagerPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: InformalNodeManagerPageModelState = {
  showPage: 'exhibit',

  addExhibitDrawerVisible: false,

  replaceHandlerModalVisible: true,
  replacerActivatedTab: 'market',
  replacerInput: '',
  replacerList: [{
    id: '1',
    checked: false,
    name: 'yuliang/package.json',
    type: 'json',
    latestVersion: '1.0.1',
    version: '1.1.1',
    date: '2021-11-22',
    status: 'online',
  }, {
    id: '2',
    checked: true,
    name: 'Freelog/blog-theme',
    type: 'json',
    latestVersion: '1.0.1',
    version: '1.1.1',
    date: '2021-11-22',
    status: 'online',
  }],
};

const Model: InformalNodeManagerPageModelType = {
  namespace: 'informalNodeManagerPage',
  state: initStates,
  effects: {
    * fetchInfo({}: FetchInfoAction, {}: EffectsCommandMap) {

    },
    * initModelStates({}: InitModelStatesAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
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
