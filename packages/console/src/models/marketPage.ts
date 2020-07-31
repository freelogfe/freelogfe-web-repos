import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {list} from '@/services/resources';
import {ConnectState} from "@/models/connect";

export interface MarketPageModelState {
  tabValue: '1' | '2';
  resourceType: number | string;
  inputText: string;
  dataSource: {
    id: string;
    cover: string,
    title: string,
    version: string,
    policy: string[],
    type: string,
  }[];
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
  type: 'marketPage/changeDataSource' | 'changeDataSource';
  payload: MarketPageModelState['dataSource'];
  restart?: boolean;
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'fetchDataSource',
}

export interface MarketModelType {
  namespace: 'marketPage';
  state: MarketPageModelState;
  effects: {
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    onChangeTabValue: DvaReducer<MarketPageModelState, OnChangeTabValueAction>;
    onChangeResourceType: DvaReducer<MarketPageModelState, OnChangeResourceTypeAction>;
    onChangeInputText: DvaReducer<MarketPageModelState, OnChangeInputTextAction>;
    changeDataSource: DvaReducer<MarketPageModelState, ChangeDataSourceAction>;
  };
  subscriptions: {
    setup: Subscription;
    fetchData: Subscription;
  };
}

const Model: MarketModelType = {

  namespace: 'marketPage',

  state: {
    tabValue: '1',
    resourceType: -1,
    inputText: '',
    dataSource: [],
  },

  effects: {
    * fetchDataSource(_: FetchDataSourceAction, {call, put, select}: EffectsCommandMap) {
      const routerHistory = yield select(({routerHistories}: ConnectState) => {
        // console.log(routerHistory, 'routerHistory');
        return routerHistories[routerHistories.length - 1];
      });
      if (routerHistory?.pathname === '/example') {
        return;
      }
      const {data} = yield call(list, {page: 1});
      const dataSource = data.dataList.map((i: any) => ({
        id: i.resourceId,
        cover: i.coverImages.length > 0 ? i.coverImages[0] : '',
        title: i.resourceName,
        version: i.latestVersion,
        // TODO: 这里应该是策略
        policy: i.tags,
        type: i.resourceType,
      }));
      yield put<ChangeDataSourceAction>({
        type: 'changeDataSource',
        payload: dataSource,
        restart: true,
      });
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
          ...payload,
        ],
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      history.listen((listener) => {
        // console.log(listener, 'LLLLLLLLLLLL');
        if (listener.pathname === '/market') {
          dispatch({type: 'onChangeTabValue', payload: '1'});
        }
        if (listener.pathname === '/example') {
          dispatch({type: 'onChangeTabValue', payload: '2'});
        }
      });
    },
    fetchData({dispatch, history}: SubscriptionAPI) {
      history.listen((listener) => {
        if (listener.pathname === '/market') {
          dispatch<FetchDataSourceAction>({
            type: 'fetchDataSource',
          });
        }
      });
    },
  },

};

export default Model;
