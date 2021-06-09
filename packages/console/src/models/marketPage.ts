import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer, WholeReadonly} from './shared';
import {ConnectState} from "@/models/connect";
import {FApiServer} from "@/services";
import {FUtil} from '@freelog/tools-lib';

export type  MarketPageModelState = WholeReadonly<{
  tabValue: '1' | '2',
  resourceType: string;
  inputText: string;
  dataSource: {
    id: string;
    cover: string,
    title: string,
    version: string,
    policy: string[],
    type: string,
  }[];
  totalItem: number;
}>;

export interface ChangeAction extends AnyAction {
  type: 'change' | 'marketPage/change';
  payload: Partial<MarketPageModelState>;
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'fetchDataSource' | 'marketPage/fetchDataSource';
  payload?: boolean; // 是否 restart
}

export interface ChangeStatesAction extends AnyAction {
  type: 'marketPage/changeStates',
  payload: Partial<Pick<MarketPageModelState, 'inputText' | 'resourceType'>>;
}

export interface MarketModelType {
  namespace: 'marketPage';
  state: MarketPageModelState;
  effects: {
    changeStates: (action: ChangeStatesAction, effects: EffectsCommandMap) => void;
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<MarketPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
    // fetchData: Subscription;
  };
}

export const marketInitData: MarketPageModelState = {
  tabValue: '1',
  // pageCurrent: 1,
  resourceType: '-1',
  inputText: '',
  dataSource: [],
  totalItem: -1,
};

const Model: MarketModelType = {

  namespace: 'marketPage',

  state: marketInitData,

  effects: {
    * changeStates({payload}: ChangeStatesAction, {put, select}: EffectsCommandMap) {

      const {marketPage}: ConnectState = yield select(({marketPage}: ConnectState) => ({
        marketPage,
      }));

      if (payload.resourceType && payload.resourceType === marketPage.resourceType) {
        return;
      }

      if (payload.inputText && payload.inputText === marketPage.inputText) {
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...payload,
        },
      });
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: true,
      });
    },
    * fetchDataSource({payload}: FetchDataSourceAction, {call, put, select, take}: EffectsCommandMap) {

      const {marketPage, global}: ConnectState = yield select(({marketPage, global}: ConnectState) => ({
        marketPage,
        global,
      }));

      if (global.routerHistories[global.routerHistories.length - 1]?.pathname === '/example' && marketPage.dataSource.length > 0) {
        return;
      }

      let dataSource: MarketPageModelState['dataSource'] = [];

      if (!payload) {
        dataSource = marketPage.dataSource;
      }

      const params: Parameters<typeof FApiServer.Resource.list>[0] = {
        skip: dataSource.length,
        limit: FUtil.Predefined.pageSize,
        startResourceId: dataSource[0]?.id,
        keywords: marketPage.inputText,
        resourceType: marketPage.resourceType === '-1' ? undefined : marketPage.resourceType,
        status: 1,
      };

      const {data} = yield call(FApiServer.Resource.list, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          totalItem: data.totalItem,
          dataSource: [
            ...dataSource,
            ...(data.dataList as any[]).map<MarketPageModelState['dataSource'][number]>((i: any) => ({
              id: i.resourceId,
              cover: i.coverImages.length > 0 ? i.coverImages[0] : '',
              title: i.resourceName,
              version: i.latestVersion,
              policy: i.policies.map((l: any) => l.policyName),
              type: i.resourceType,
            })),
          ],
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
    setup({dispatch, history}: SubscriptionAPI) {
    },
    // fetchData({dispatch, history}: SubscriptionAPI) {
    //   history.listen((listener) => {
    //     if (listener.pathname === '/market') {
    //       dispatch<FetchDataSourceAction>({
    //         type: 'fetchDataSource',
    //       });
    //     }
    //   });
    // },
  },

};

export default Model;
