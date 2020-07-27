import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {list} from '@/services/resources';

export interface MarketPageModelState {
  tabValue: '1' | '2';
  resourceType: number | string;
  inputText: string;
  dataSource: any[];
}

export interface OnChangeTabValueAction extends AnyAction {
  type: 'marketPage/onChangeTabValue';
  payload: '1' | '2';
}

export interface OnChangeResourceTypeAction extends AnyAction {
  type: 'marketPage/onChangeResourceType';
  payload: string | number;
}

export interface OnChangeInputTextAction extends AnyAction {
  type: 'marketPage/onChangeInputText';
  payload: string;
}

export interface ChangeDataSourceAction extends AnyAction {
  type: 'marketPage/changeDataSource';
  payload: any[];
  restart?: boolean;
}

export interface MarketModelType {
  namespace: 'marketPage';
  state: MarketPageModelState;
  effects: {
    fetchDataSource: Effect;
  };
  reducers: {
    onChangeTabValue: DvaReducer<MarketPageModelState, OnChangeTabValueAction>;
    onChangeResourceType: DvaReducer<MarketPageModelState, OnChangeResourceTypeAction>;
    onChangeInputText: DvaReducer<MarketPageModelState, OnChangeInputTextAction>;
    changeDataSource: DvaReducer<MarketPageModelState, ChangeDataSourceAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: MarketModelType = {

  namespace: 'marketPage',

  state: {
    tabValue: '1',
    resourceType: -1,
    inputText: '',
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
    onChangeTabValue(state, {payload}): MarketPageModelState {
      return {
        ...state,
        tabValue: payload,
      }
    },
    onChangeResourceType(state, {payload}): MarketPageModelState {
      return {
        ...state,
        resourceType: payload,
      };
    },
    onChangeInputText(state, {payload}): MarketPageModelState {
      return {
        ...state,
        inputText: payload,
      };
    },
    changeDataSource(state, {payload, restart = false}): MarketPageModelState {
      if (restart) {
        return {
          ...state,
          dataSource: payload
        };
      }
      return {
        ...state,
        dataSource: [
          ...state.dataSource,
          payload,
        ],
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      history.listen((listener) => {
        // console.log(listener, 'LLLLLLLLLLLL');
        if (listener.pathname === '/') {
          dispatch({type: 'onChangeTabValue', payload: '1'});
        } else {
          dispatch({type: 'onChangeTabValue', payload: '2'});
        }
      });
    },
  },

};

export default Model;
