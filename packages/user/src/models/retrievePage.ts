import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';

export type RetrievePageModelState = WholeReadonly<{
  showView: 'verify' | 'reset';

  verifyMode: 'phone' | 'email';
  phoneInput: string;
  phoneInputError: string;
  emailInput: string;
  emailInputError: string;
  verifyCode: string;
  verifyCodeReSendWait: number;

  newPasswordInput: string;
  newPasswordInputError: string;
  confirmPasswordInput: string;
  confirmPasswordInputError: string;
}>;

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<RetrievePageModelState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'initModelStates';
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

interface RetrievePageModelType {
  namespace: 'retrievePage';
  state: RetrievePageModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<RetrievePageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: RetrievePageModelState = {
  showView: 'verify',

  verifyMode: 'phone',
  phoneInput: '',
  phoneInputError: '',
  emailInput: '',
  emailInputError: '',
  verifyCode: '',
  verifyCodeReSendWait: 0,

  newPasswordInput: '',
  newPasswordInputError: '',
  confirmPasswordInput: '',
  confirmPasswordInputError: '',
};

const Model: RetrievePageModelType = {
  namespace: 'retrievePage',
  state: initStates,
  effects: {
    * fetchInfo({}: FetchInfoAction, {}: EffectsCommandMap) {

    },
    * initModelStates({}: InitModelStatesAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
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
