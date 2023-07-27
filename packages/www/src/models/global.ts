import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';

export interface GlobalModelState {
  routerHistories: {
    hash: string;
    key: string;
    pathname: string;
    query: { [key: string]: string };
    search: string;
    state: any;
  }[];
  // backgroundColor: string;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'global/change';
  payload: Partial<GlobalModelState>;
}

// export interface SetLocaleAction extends AnyAction {
//   type: 'global/setLocale';
//   payload: GlobalModelState['locale'];
// }

export interface PushRouterAction extends AnyAction {
  type: 'pushRouter';
  payload: GlobalModelState['routerHistories'][number];
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    // setLocale: (action: SetLocaleAction, effects: EffectsCommandMap) => void;
    pushRouter: (action: PushRouterAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<GlobalModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
    historyListen: Subscription;
    activatedWindow: Subscription;
  };
}

const Model: GlobalModelType = {
  namespace: 'global',
  state: {
    // locale: getLocale() as GlobalModelState['locale'],
    // route: null,
    routerHistories: [],
  },
  effects: {
    // * setLocale({ payload }: SetLocaleAction, { call, put }: EffectsCommandMap) {
      // yield call(setLocale, payload);
      // // yield call(window.localStorage.setItem, 'local', payload);
      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {
      //     locale: payload,
      //   },
      // });
    // },
    * pushRouter({ payload }: PushRouterAction, { put, select }: EffectsCommandMap) {
      const { routerHistories } = yield select(({ global }: ConnectState) => ({
        routerHistories: global.routerHistories,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          routerHistories: [
            ...routerHistories,
            payload,
          ],
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
    setup({ dispatch, history }) {
      // history.listen((listener) => {
      //   // console.log(listener, 'listener098phijnoweklf');
      //   dispatch<PushRouterAction>({
      //     type: 'pushRouter',
      //     payload: listener as any,
      //   });
      // });
    },
    historyListen({ dispatch, history }) {
      history.listen((listener) => {
        // console.log(listener, 'listener098phijnoweklf');
        dispatch<PushRouterAction>({
          type: 'pushRouter',
          payload: listener as any,
        });
      });
    },
    activatedWindow({ dispatch }) {
      window.document.addEventListener('visibilitychange', function() {
        // console.log(document.hidden, 'document.hidden9032rweopfdslj.,');
        // Modify behavior...



      });

      window.addEventListener('pagehide', event => {
        if (event.persisted) {
          /* the page isn't being discarded, so it can be reused later */
        }
      }, false);
    },
  },
};

export default Model;
