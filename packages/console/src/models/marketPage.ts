import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer, WholeReadonly} from './shared';
import {ConnectState} from "@/models/connect";
import {FUtil, FServiceAPI} from '@freelog/tools-lib';

export interface MarketPageModelState {
  navOptions: {
    text: string;
    value: string;
  }[];
  tabValue: '1' | '2';
  resourceTypeOptions: {
    text: string;
    value: string;
  }[];
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
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'marketPage/change';
  payload: Partial<MarketPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'marketPage/onMountPage';
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'marketPage/onUnmountPage';
}

export interface OnMountMarketPageAction extends AnyAction {
  type: 'marketPage/onMountMarketPage';
}

export interface OnUnmountMarketPageAction extends AnyAction {
  type: 'marketPage/onUnmountMarketPage';
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'fetchDataSource';
  payload: {
    restart: boolean;
  };
}

// export interface ChangeStatesAction extends AnyAction {
//   type: 'marketPage/changeStates';
//   payload: Partial<Pick<MarketPageModelState, 'inputText' | 'resourceType'>>;
// }

export interface OnChangeResourceTypeAction extends AnyAction {
  type: 'marketPage/onChangeResourceType';
  payload: {
    value: string;
  };
}

export interface OnChangeKeywordsAction extends AnyAction {
  type: 'marketPage/onChangeKeywords';
  payload: {
    value: string;
  };
}

export interface OnClickLoadMoreBtnAction extends AnyAction {
  type: 'marketPage/onClickLoadMoreBtn';
}

export interface MarketModelType {
  namespace: 'marketPage';
  state: MarketPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
    onMountMarketPage: (action: OnMountMarketPageAction, effects: EffectsCommandMap) => void;
    onUnmountMarketPage: (action: OnUnmountMarketPageAction, effects: EffectsCommandMap) => void;
    // changeStates: (action: ChangeStatesAction, effects: EffectsCommandMap) => void;
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
    onChangeResourceType: (action: OnChangeResourceTypeAction, effects: EffectsCommandMap) => void;
    onChangeKeywords: (action: OnChangeKeywordsAction, effects: EffectsCommandMap) => void;
    onClickLoadMoreBtn: (action: OnClickLoadMoreBtnAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<MarketPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

export const marketInitData: MarketPageModelState = {
  navOptions: [
    {
      value: '1',
      text: '资源市场',
    },
    {
      value: '2',
      text: '示例节点',
    },
  ],
  tabValue: '1',
  resourceTypeOptions: [
    {
      value: '-1',
      text: '全部类型'
    },
    ...FUtil.Predefined.resourceTypes.map((i) => ({value: i, text: i})),
  ],
  resourceType: '-1',
  inputText: '',
  dataSource: [],
  totalItem: -1,
};

const Model: MarketModelType = {

  namespace: 'marketPage',

  state: marketInitData,

  effects: {
    * onMountPage({}: OnMountPageAction, {put}: EffectsCommandMap) {
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: true,
        },
      });
    },
    * onUnmountPage({}: OnUnmountPageAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: marketInitData,
      });
    },
    * onMountMarketPage({}: OnMountMarketPageAction, {}: EffectsCommandMap) {
    },
    * onUnmountMarketPage({}: OnUnmountMarketPageAction, {put}: EffectsCommandMap) {

    },
    // * changeStates({payload}: ChangeStatesAction, {put, select}: EffectsCommandMap) {
    //
    //   const {marketPage}: ConnectState = yield select(({marketPage}: ConnectState) => ({
    //     marketPage,
    //   }));
    //
    //   if (payload.resourceType && payload.resourceType === marketPage.resourceType) {
    //     return;
    //   }
    //
    //   if (payload.inputText && payload.inputText === marketPage.inputText) {
    //     return;
    //   }
    //
    //   yield put<ChangeAction>({
    //     type: 'change',
    //     payload: {
    //       ...payload,
    //     },
    //   });
    //   yield put<FetchDataSourceAction>({
    //     type: 'fetchDataSource',
    //     payload: {
    //       restart: true,
    //     },
    //   });
    // },
    * fetchDataSource({payload}: FetchDataSourceAction, {call, put, select, take}: EffectsCommandMap) {

      const {marketPage}: ConnectState = yield select(({marketPage}: ConnectState) => ({
        marketPage,
      }));

      let dataSource: MarketPageModelState['dataSource'] = [];

      if (!payload.restart) {
        dataSource = marketPage.dataSource;
      }

      const existentResourceIDs: string[] = dataSource.map((ds) => {
        return ds.id;
      });

      const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
        skip: dataSource.length,
        limit: FUtil.Predefined.pageSize + 10,
        // startResourceId: dataSource[0]?.id,
        keywords: marketPage.inputText,
        resourceType: marketPage.resourceType === '-1' ? undefined : marketPage.resourceType,
        status: 1,
      };

      const {data} = yield call(FServiceAPI.Resource.list, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          totalItem: data.totalItem,
          dataSource: [
            ...dataSource,
            ...(data.dataList as any[])
              .filter((i) => {
                return !existentResourceIDs.includes(i.resourceId);
              })
              .map<MarketPageModelState['dataSource'][number]>((i: any) => ({
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
    * onChangeResourceType({payload}: OnChangeResourceTypeAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceType: payload.value,
        },
      });

      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: true,
        },
      });
    },
    * onChangeKeywords({payload}: OnChangeKeywordsAction, {put}: EffectsCommandMap) {
      // yield put<ChangeStatesAction>({
      //   type: 'marketPage/changeStates',
      //   payload: {inputText: payload.value},
      // });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          inputText: payload.value,
        },
      });

      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: true,
        },
      });
    },
    * onClickLoadMoreBtn({}: OnClickLoadMoreBtnAction, {put}: EffectsCommandMap) {
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: false,
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
  },

};

export default Model;
