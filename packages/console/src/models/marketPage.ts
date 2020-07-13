import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {list} from "@/services/resource";

export interface MarketPageModelState {
  dataSource: any[];
}

export interface MarketModelType {
  namespace: 'marketPage';
  state: MarketPageModelState;
  effects: {
    fetchDataSource: Effect;
  };
  reducers: {
    changeDataSource: DvaReducer<MarketPageModelState, AnyAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: MarketModelType = {

  namespace: 'marketPage',

  state: {
    dataSource: [{
      id: 1,
      cover: '',
      title: '这里是发行名称1',
      version: '1.0.10',
      policy: ['免费1', '免费2', '免费3'],
      type: 'image',
    }, {
      id: 2,
      cover: '',
      title: '这里是发行名称2',
      version: '1.0.10',
      policy: ['免费1', '免费2', '免费3'],
      type: 'image',
    }],
  },

  effects: {
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      console.log('FFFFFFFFF');
      yield call(list, {page: 1});
      // yield put({type: 'save'});
    },
  },

  reducers: {
    changeDataSource(state: MarketPageModelState, action: AnyAction): MarketPageModelState {
      return {...state, ...action.payload};
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      history.listen((listener) => {
        // console.log(listener, 'LLLLLLLLLLLL');
        // if (listener.pathname === '/') {
        //   dispatch({type: 'fetchDataSource'});
        // }
      });
    },
  },

};

export default Model;
