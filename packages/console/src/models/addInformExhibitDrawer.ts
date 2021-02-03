import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from "@/models/connect";
import {list, ListParamsType} from "@/services/resources";
import {formatDateTime} from "@/utils/format";
import {collectionResources, CollectionResourcesParamsType} from "@/services/collections";
import {objectList, ObjectListParamsType} from "@/services/storages";

export type AddInformExhibitDrawerModelState = WholeReadonly<{
  isTheme: boolean;
  disabledResourceNames: string[];
  disabledObjectNames: string[];

  addExhibitOptions: { value: string; title: string }[];
  addExhibitSelectValue: string;
  addExhibitInputValue: string;
  addExhibitCheckedList: {
    id: string;
    disabled: boolean;
    checked: boolean;
    name: string;
    identity: 'resource' | 'object';
    type: string;
    updateTime: string;
    status: 'online' | 'offline' | 'unreleased' | '';
  }[];
}>;

export interface ChangeAction extends AnyAction {
  type: 'change' | 'addInformExhibitDrawer/change';
  payload: Partial<AddInformExhibitDrawerModelState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'initModelStates';
}

export interface FetchAddExhibitListAction extends AnyAction {
  type: 'addInformExhibitDrawer/fetchAddExhibitList'
  payload?: boolean; // 是否 restart
}

export interface FetchMarketAction extends AnyAction {
  type: 'fetchMarket';
  payload?: boolean; // 是否 restart
}

export interface FetchMyResourcesAction extends AnyAction {
  type: 'fetchMyResources';
  payload?: boolean; // 是否 restart
}

export interface FetchCollectionAction extends AnyAction {
  type: 'fetchCollection';
  payload?: boolean; // 是否 restart
}

export interface FetchObjectAction extends AnyAction {
  type: 'fetchObject';
  payload?: boolean; // 是否 restart
}

interface AddInformExhibitType {
  namespace: 'addInformExhibitDrawer';
  state: AddInformExhibitDrawerModelState;
  effects: {
    // fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
    fetchAddExhibitList: (action: FetchAddExhibitListAction, effects: EffectsCommandMap) => void;
    fetchMarket: (action: FetchMarketAction, effects: EffectsCommandMap) => void;
    fetchMyResources: (action: FetchMyResourcesAction, effects: EffectsCommandMap) => void;
    fetchCollection: (action: FetchCollectionAction, effects: EffectsCommandMap) => void;
    fetchObject: (action: FetchObjectAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<AddInformExhibitDrawerModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: AddInformExhibitDrawerModelState = {
  isTheme: false,
  disabledResourceNames: [],
  disabledObjectNames: [],

  addExhibitOptions: [
    {value: '!market', title: '资源市场'},
    {value: '!resource', title: '我的资源'},
    {value: '!collection', title: '我的收藏'},
  ],
  addExhibitSelectValue: '!market',
  addExhibitInputValue: '',
  addExhibitCheckedList: [],
};

const Model: AddInformExhibitType = {
  namespace: 'addInformExhibitDrawer',
  state: initStates,
  effects: {
    // * fetchInfo({}: FetchInfoAction, {}: EffectsCommandMap) {
    //
    // },
    * initModelStates({}: InitModelStatesAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * fetchAddExhibitList({}: FetchAddExhibitListAction, {select, call, put}: EffectsCommandMap) {
      const {addInformExhibitDrawer}: ConnectState = yield select(({addInformExhibitDrawer}: ConnectState) => ({
        addInformExhibitDrawer,
      }));

      // console.log(addInformExhibitDrawer.addExhibitSelectValue, '#####');

      if (addInformExhibitDrawer.addExhibitSelectValue === '!market') {
        yield put<FetchMarketAction>({
          type: 'fetchMarket',
        });
      } else if (addInformExhibitDrawer.addExhibitSelectValue === '!resource') {
        yield put<FetchMyResourcesAction>({
          type: 'fetchMyResources',
        });
      } else if (addInformExhibitDrawer.addExhibitSelectValue === '!collection') {
        yield put<FetchCollectionAction>({
          type: 'fetchCollection',
        });
      } else {
        yield put<FetchObjectAction>({
          type: 'fetchObject',
        });
      }
    },
    * fetchMarket({payload}: FetchMarketAction, {call, select, put}: EffectsCommandMap) {
      const {addInformExhibitDrawer}: ConnectState = yield select(({addInformExhibitDrawer}: ConnectState) => ({
        addInformExhibitDrawer,
      }));
      const params: ListParamsType = {
        // resourceType:''
        skip: 0,
        limit: 10,

        keywords: addInformExhibitDrawer.addExhibitInputValue,
      };
      // console.log(params, 'paramsparams1234');
      const {data} = yield call(list, params);
      // console.log(data, 'data13453');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitCheckedList: (data.dataList as any[]).map<AddInformExhibitDrawerModelState['addExhibitCheckedList'][number]>((exhibit) => {
            const resourceName: string = data.username + '/' + exhibit.resourceName;
            return {
              id: exhibit.resourceId,
              disabled: addInformExhibitDrawer.disabledResourceNames.includes(resourceName),
              checked: false,
              identity: 'resource',
              name: exhibit.resourceName,
              type: exhibit.resourceType,
              updateTime: formatDateTime(exhibit.updateDate),
              status: exhibit.status === 1 ? '' : (exhibit.latestVersion ? 'offline' : 'unreleased'),
            };
          }),
        },
      });
    },
    * fetchMyResources({payload}: FetchMyResourcesAction, {call, put, select}: EffectsCommandMap) {
      const {addInformExhibitDrawer}: ConnectState = yield select(({addInformExhibitDrawer}: ConnectState) => ({
        addInformExhibitDrawer,
      }));
      const params: ListParamsType = {
        // resourceType:''
        skip: 0,
        limit: 10,
        isSelf: 1,
        resourceType: addInformExhibitDrawer.isTheme ? 'theme' : undefined,
        keywords: addInformExhibitDrawer.addExhibitInputValue,
      };
      // console.log(params, 'paramsparams1234');
      const {data} = yield call(list, params);
      // console.log(data, 'data13453');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitCheckedList: (data.dataList as any[]).map<AddInformExhibitDrawerModelState['addExhibitCheckedList'][number]>((exhibit) => {
            const resourceName: string = data.username + '/' + exhibit.resourceName;
            return {
              id: exhibit.resourceId,
              disabled: addInformExhibitDrawer.disabledResourceNames.includes(resourceName),
              checked: false,
              identity: 'resource',
              name: exhibit.resourceName,
              type: exhibit.resourceType,
              updateTime: formatDateTime(exhibit.updateDate),
              status: exhibit.status === 1 ? '' : (exhibit.latestVersion ? 'offline' : 'unreleased'),
            };
          }),
        },
      });
    },
    * fetchCollection({}: FetchCollectionAction, {select, call, put}: EffectsCommandMap) {

      const {addInformExhibitDrawer}: ConnectState = yield select(({addInformExhibitDrawer}: ConnectState) => ({
        addInformExhibitDrawer,
      }));

      const params: CollectionResourcesParamsType = {
        skip: 0,
        limit: 10,
        keywords: addInformExhibitDrawer.addExhibitInputValue,
      };

      const {data} = yield call(collectionResources, params);
      // console.log(data, '@@@@@@ASEDFSADF');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitCheckedList: (data.dataList as any[]).map<AddInformExhibitDrawerModelState['addExhibitCheckedList'][number]>((exhibit) => {
            const resourceName: string = data.authorName + '/' + exhibit.resourceName;
            return {
              id: exhibit.resourceId,
              disabled: addInformExhibitDrawer.disabledResourceNames.includes(resourceName),
              checked: false,
              identity: 'resource',
              name: exhibit.resourceName,
              type: exhibit.resourceType,
              updateTime: formatDateTime(exhibit.updateDate),
              status: exhibit.resourceStatus === 1 ? '' : (exhibit.latestVersion ? 'offline' : 'unreleased'),
            };
          }),
        },
      });
    },
    * fetchObject({}: FetchObjectAction, {put, select, call}: EffectsCommandMap) {
      const {addInformExhibitDrawer}: ConnectState = yield select(({addInformExhibitDrawer}: ConnectState) => ({
        addInformExhibitDrawer,
      }));

      const params: ObjectListParamsType = {
        skip: 0,
        limit: 10,
        bucketName: addInformExhibitDrawer.addExhibitSelectValue,
        keywords: addInformExhibitDrawer.addExhibitInputValue,
      };

      const {data} = yield call(objectList, params);
      console.log(data, 'data1q2349ojmdfsl');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitCheckedList: (data.dataList as any[]).map<AddInformExhibitDrawerModelState['addExhibitCheckedList'][number]>((exhibit) => {
            const objectName: string = data.bucketName + '/' + data.objectName;
            return {
              id: exhibit.objectId,
              disabled: addInformExhibitDrawer.disabledResourceNames.includes(objectName),
              checked: false,
              identity: 'object',
              name: exhibit.objectName,
              type: exhibit.resourceType,
              updateTime: formatDateTime(exhibit.updateDate),
              status: '',
            };
          }),
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
    setup({}) {

    }
  }
};

export default Model;
