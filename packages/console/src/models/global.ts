import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {
  formatDate,
  formatTime,
  formatRelative,
  formatNumber,
  formatPlural,
  formatMessage,
  formatHTMLMessage,
  setLocale,
  getLocale,
} from 'umi-plugin-react/locale';

export interface GlobalModelState {
  locale: 'zh-CN' | 'en-US' | 'pt-BR';
  route: any;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'global/change';
  payload: Partial<GlobalModelState>;
}

export interface SetLocaleAction extends AnyAction {
  type: 'global/setLocale';
  payload: GlobalModelState['locale'];
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    setLocale: (action: SetLocaleAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<GlobalModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: GlobalModelType = {
  namespace: 'global',
  state: {
    locale: getLocale() as GlobalModelState['locale'],
    route: null,
  },
  effects: {
    * setLocale({payload}: SetLocaleAction, {call, put}: EffectsCommandMap) {
      yield call(setLocale, payload);
      // yield call(window.localStorage.setItem, 'local', payload);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          locale: payload,
        },
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
    setup({dispatch}) {

    }
  }
};

export default Model;
