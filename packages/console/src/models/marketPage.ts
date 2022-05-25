import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState } from '@/models/connect';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';

const marketStates = {};

export interface DiscoverPageModelState {
  showPage: 'market' | 'example';
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
  payload: Partial<DiscoverPageModelState>;
}

export interface OnChange_ShowPage_Action extends AnyAction {
  type: 'marketPage/onChange_ShowPage';
  payload: {
    value: 'market' | 'example';
  };
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

export interface OnMountExamplesPageAction extends AnyAction {
  type: 'marketPage/onMountExamplesPage';
}

export interface OnUnmountExamplesPageAction extends AnyAction {
  type: 'marketPage/onUnmountExamplesPage';
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

export interface DiscoverPageModelType {
  namespace: 'marketPage';
  state: DiscoverPageModelState;
  effects: {
    onChange_ShowPage: (action: OnChange_ShowPage_Action, effects: EffectsCommandMap) => void;
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
    change: DvaReducer<DiscoverPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const marketInitStates: Pick<DiscoverPageModelState, 'resourceTypeOptions' | 'resourceType' | 'inputText' | 'dataSource' | 'totalItem'> = {
  resourceTypeOptions: [
    {
      value: '-1',
      text: '全部类型',
    },
    ...FUtil.Predefined.resourceTypes.map((i) => ({ value: i, text: i })),
  ],
  resourceType: '-1',
  inputText: '',
  dataSource: [],
  totalItem: -1,
};

export const initStates: DiscoverPageModelState = {
  showPage: 'market',

  ...marketInitStates,
};

const Model: DiscoverPageModelType = {

  namespace: 'marketPage',

  state: initStates,

  effects: {
    * onChange_ShowPage({ payload }: OnChange_ShowPage_Action, { put }: EffectsCommandMap) {
      // console.log(payload, 'payload09io3j2lksdjflkj')
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showPage: payload.value,
        },
      });
    },
    * onMountPage({}: OnMountPageAction, { put }: EffectsCommandMap) {

    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {

    },
    * onMountMarketPage({}: OnMountMarketPageAction, { put }: EffectsCommandMap) {
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: true,
        },
      });
    },
    * onUnmountMarketPage({}: OnUnmountMarketPageAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: marketInitStates,
      });
    },
    * fetchDataSource({ payload }: FetchDataSourceAction, { call, put, select, take }: EffectsCommandMap) {

      const { marketPage }: ConnectState = yield select(({ marketPage }: ConnectState) => ({
        marketPage,
      }));

      let dataSource: DiscoverPageModelState['dataSource'] = [];

      if (!payload.restart) {
        dataSource = marketPage.dataSource;
      }

      const existentResourceIDs: string[] = dataSource.map((ds) => {
        return ds.id;
      });

      const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
        skip: dataSource.length,
        limit: FUtil.Predefined.pageSize,
        // startResourceId: dataSource[0]?.id,
        keywords: marketPage.inputText,
        resourceType: marketPage.resourceType === '-1' ? undefined : marketPage.resourceType,
        status: 1,
      };

      const { data } = yield call(FServiceAPI.Resource.list, params);
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
              .map<DiscoverPageModelState['dataSource'][number]>((i: any) => {
                // console.log(i, 'i#@@#$@#$@#$@#$@#4234098ijosfdlksd');
                return {
                  id: i.resourceId,
                  cover: i.coverImages.length > 0 ? i.coverImages[0] : '',
                  title: i.resourceName,
                  version: i.latestVersion,
                  policy: i.policies
                    .filter((l: any) => {
                      return l.status === 1;
                    })
                    .map((l: any) => l.policyName),
                  type: i.resourceType,
                };
              }),
          ],
        },
      });
    },
    * onChangeResourceType({ payload }: OnChangeResourceTypeAction, { put }: EffectsCommandMap) {
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
    * onChangeKeywords({ payload }: OnChangeKeywordsAction, { put }: EffectsCommandMap) {

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
    * onClickLoadMoreBtn({}: OnClickLoadMoreBtnAction, { put }: EffectsCommandMap) {
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: false,
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
    setup({ dispatch, history }: SubscriptionAPI) {

    },
  },

};

export default Model;
