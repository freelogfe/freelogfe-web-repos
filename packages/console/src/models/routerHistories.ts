import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer, WholeReadonly} from './shared';
import {History, LocationListener, LocationState} from "history";

// export interface RouterHistoryModelState {
//   routerHistory: LocationListener<History>[];
// }

// type GlobalSearchingModelState = WholeReadonly<IGlobalSearchingModelState>
export type RouterHistoriesModelState = History['location'][];

interface OnChangeAction extends AnyAction {
  payload: RouterHistoriesModelState[number];
  type: 'onChange'
}

interface RouterHistoriesModelType {
  namespace: 'routerHistories';
  state: RouterHistoriesModelState;
  // effects: {
  //   fetchDataSource: Effect;
  // };
  reducers: {
    onChange: DvaReducer<RouterHistoriesModelState, OnChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: RouterHistoriesModelType = {

  namespace: 'routerHistories',

  state: [],

  // effects: {
  //   * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
  //     // console.log('FFFFFFFFF');
  //     // yield call(list, {page: 1});
  //     // yield put({type: 'save'});
  //   },
  // },

  reducers: {
    onChange(state: RouterHistoriesModelState, action: OnChangeAction): RouterHistoriesModelState {
      return [
        ...state,
        action.payload
      ];
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      history.listen((listener) => {
        dispatch<OnChangeAction>({
          type: 'onChange',
          payload: listener,
        });
      });
    },
  },

};

export default Model;
