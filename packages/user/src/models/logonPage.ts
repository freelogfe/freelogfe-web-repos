import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';

export type LogonPageModelState = WholeReadonly<{
  accountType: 'email' | 'mobile';
  emailInput: string;
}>;

export interface ChangeAction extends AnyAction {
  type: 'change' | 'logonPage/change';
  payload: Partial<LogonPageModelState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'initModelStates';
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

interface LogonPageModelType {
  namespace: 'logonPage';
  state: LogonPageModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<LogonPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: LogonPageModelState = {
  accountType: 'mobile',
  emailInput: '',
};

const Model: LogonPageModelType = {
  namespace: 'logonPage',
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
