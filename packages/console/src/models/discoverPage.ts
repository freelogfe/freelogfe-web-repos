import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState } from '@/models/connect';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { PolicyFullInfo_Type } from '@/type/contractTypes';

type HandledOperationCategories = {
  id: string;
  code: string;
  name: string;
  parentID: string;
  depth: number;
}[];


export interface DiscoverPageModelState {
  showPage: 'market' | 'example';
  resourceTypeOptions: {
    text: string;
    value: string;
  }[];

  resourceType: string;
  // operationCategories: HandledOperationCategories;
  // selectedOperationCategoryID: string;
  selectedOperationCategoryIDs: string[];
  inputText: string;
  dataSource: {
    id: string;
    cover: string;
    name: string;
    title: string;
    version: string;
    policy: string[];
    type: string[];
    status: 0 | 1 | 2 | 4;
    authProblem?: boolean;
  }[];
  tags: string;
  totalItem: number;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'discoverPage/change';
  payload: Partial<DiscoverPageModelState>;
}

export interface OnChange_ShowPage_Action extends AnyAction {
  type: 'discoverPage/onChange_ShowPage';
  payload: {
    value: 'market' | 'example';
  };
}

export interface OnMountPageAction extends AnyAction {
  type: 'discoverPage/onMountPage';
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'discoverPage/onUnmountPage';
}

export interface OnMountMarketPageAction extends AnyAction {
  type: 'discoverPage/onMountMarketPage';
}

export interface OnUnmountMarketPageAction extends AnyAction {
  type: 'discoverPage/onUnmountMarketPage';
}

export interface OnMountExamplesPageAction extends AnyAction {
  type: 'discoverPage/onMountExamplesPage';
}

export interface OnUnmountExamplesPageAction extends AnyAction {
  type: 'discoverPage/onUnmountExamplesPage';
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
  type: 'discoverPage/onChangeResourceType';
  payload: {
    value: string;
  };
}

export interface OnChange_SelectedOperationCategoryIDs_Action extends AnyAction {
  type: 'discoverPage/onChange_SelectedOperationCategoryIDs';
  payload: {
    value: string[]
  };
}

export interface OnChangeKeywordsAction extends AnyAction {
  type: 'discoverPage/onChangeKeywords';
  payload: {
    value: string;
  };
}

export interface OnChangeTagsAction extends AnyAction {
  type: 'discoverPage/onChangeTags';
  payload: {
    value: string;
  };
}

export interface OnClickLoadMoreBtnAction extends AnyAction {
  type: 'discoverPage/onClickLoadMoreBtn';
}

export interface DiscoverPageModelType {
  namespace: 'discoverPage';
  state: DiscoverPageModelState;
  effects: {
    onChange_ShowPage: (action: OnChange_ShowPage_Action, effects: EffectsCommandMap) => void;
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
    onMountMarketPage: (action: OnMountMarketPageAction, effects: EffectsCommandMap) => void;
    onUnmountMarketPage: (action: OnUnmountMarketPageAction, effects: EffectsCommandMap) => void;
    // changeStates: (action: ChangeStatesAction, effects: EffectsCommandMap) => void;
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;

    onChange_SelectedOperationCategoryIDs: (action: OnChange_SelectedOperationCategoryIDs_Action, effects: EffectsCommandMap) => void;
    onChangeResourceType: (action: OnChangeResourceTypeAction, effects: EffectsCommandMap) => void;
    onChangeKeywords: (action: OnChangeKeywordsAction, effects: EffectsCommandMap) => void;
    onChangeTags: (action: OnChangeTagsAction, effects: EffectsCommandMap) => void;
    onClickLoadMoreBtn: (action: OnClickLoadMoreBtnAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<DiscoverPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const marketInitStates: Pick<DiscoverPageModelState,
  'resourceTypeOptions' | 'resourceType' | 'selectedOperationCategoryIDs' | 'inputText' | 'dataSource' | 'totalItem' | 'tags'> = {
  resourceTypeOptions: [
    {
      value: '-1',
      text: '全部类型',
    },
    ...FUtil.Predefined.resourceTypes.map((i) => ({ value: i, text: i })),
  ],
  resourceType: '-1',

  // operationCategories: [],
  // selectedOperationCategoryID: '/#all',
  selectedOperationCategoryIDs: ['#all'],
  inputText: '',
  tags: '',
  dataSource: [],
  totalItem: -1,
};

export const initStates: DiscoverPageModelState = {
  showPage: 'market',

  ...marketInitStates,
};

const Model: DiscoverPageModelType = {
  namespace: 'discoverPage',

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
    * onMountMarketPage({}: OnMountMarketPageAction, { call, put }: EffectsCommandMap) {

      // console.log('****8sd8ofujoisdjflksdjlfkdsjlkfj');
      // const { data: data_operationCategories }: { data: any[] } = yield call(FServiceAPI.Operation.operationCategories);
      // console.log(data_operationCategories, 'dataoisajdeflksjdfl;jsdl;kl');
      // const payload: HandledOperationCategories = [];
      // flatOperationCategories(data_operationCategories, '', 0, payload);
      // console.log(payload, 'payload09dsiojfvslkdjflsdjflsdjlkfjlkj');
      //
      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {
      //     operationCategories: payload,
      //   },
      // });
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
    * fetchDataSource(
      { payload }: FetchDataSourceAction,
      { call, put, select, take }: EffectsCommandMap,
    ) {
      const { discoverPage }: ConnectState = yield select(({ discoverPage }: ConnectState) => ({
        discoverPage,
      }));

      let dataSource: DiscoverPageModelState['dataSource'] = [];

      if (!payload.restart) {
        dataSource = discoverPage.dataSource;
      }

      const existentResourceIDs: string[] = dataSource.map((ds) => {
        return ds.id;
      });

      const selectedOperationCategoryIDs: string[] = discoverPage.selectedOperationCategoryIDs.filter((c) => {
        return c !== '#all';
      });
      const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
        skip: dataSource.length,
        limit: FUtil.Predefined.pageSize,
        // startResourceId: dataSource[0]?.id,
        keywords: discoverPage.inputText,
        // tags: discoverPage.tags,
        resourceType: discoverPage.resourceType === '-1' ? undefined : discoverPage.resourceType,
        status: 1,
        operationCategoryCode: selectedOperationCategoryIDs[selectedOperationCategoryIDs.length - 1],
      };

      const { data }: {
        data: {
          dataList: {
            resourceId: string;
            coverImages: string[];
            resourceName: string;
            resourceTitle: string;
            resourceType: string[];
            updateDate: string;
            status: 0 | 1 | 2 | 4;
            latestVersion: string;
            policies: PolicyFullInfo_Type[];
          }[];
          totalItem: number;
        };
      } = yield call(FServiceAPI.Resource.list, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          totalItem: data.totalItem,
          dataSource: [
            ...dataSource,
            ...data.dataList
              .filter((i) => {
                return !existentResourceIDs.includes(i.resourceId);
              })
              .map<DiscoverPageModelState['dataSource'][number]>((i) => {
                // console.log(i, 'i#@@#$@#$@#$@#$@#4234098ijosfdlksd');
                return {
                  id: i.resourceId,
                  cover: i.coverImages.length > 0 ? i.coverImages[0] : '',
                  name: i.resourceName,
                  title: i.resourceTitle,
                  version: i.latestVersion,
                  policy: i.policies
                    .filter((l) => {
                      return l.status === 1;
                    })
                    .map((l) => l.policyName),
                  type: i.resourceType,
                  status: 1,
                };
              }),
          ],
        },
      });
    },
    * onChange_SelectedOperationCategoryIDs({ payload }: OnChange_SelectedOperationCategoryIDs_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          selectedOperationCategoryIDs: payload.value,
        },
      });
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: true,
        },
      });
    },
    * onChangeResourceType({ payload }: OnChangeResourceTypeAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceType: payload.value,
          tags: '',
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
    * onChangeTags({ payload }: OnChangeTagsAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          tags: payload.value,
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

type OperationCategories = {
  children: OperationCategories;
  code: string;
  name: string;
}[];

function flatOperationCategories(operationCategories: OperationCategories, parentID: string, depth: number, payload: HandledOperationCategories) {
  if (operationCategories.length > 0) {
    payload.push({
      id: `${parentID}/#all`,
      code: '#all',
      name: '全部',
      parentID: parentID,
      depth: depth,
    });
  }
  for (const operationCategory of operationCategories) {
    const currentID: string = `${parentID}/${operationCategory.code}`;
    payload.push({
      id: currentID,
      code: operationCategory.code,
      name: operationCategory.name,
      parentID: parentID,
      depth: depth,
    });
    flatOperationCategories(operationCategory.children, currentID, depth + 1, payload);
  }
}
