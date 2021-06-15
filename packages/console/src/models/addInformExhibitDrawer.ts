import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from "@/models/connect";
import {FUtil, FServiceAPI} from '@freelog/tools-lib';

export interface AddInformExhibitDrawerModelState {
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
  listLength: number;
}

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
  listLength: -1,
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
    * fetchAddExhibitList({payload}: FetchAddExhibitListAction, {select, call, put}: EffectsCommandMap) {
      const {addInformExhibitDrawer}: ConnectState = yield select(({addInformExhibitDrawer}: ConnectState) => ({
        addInformExhibitDrawer,
      }));

      if (addInformExhibitDrawer.addExhibitSelectValue === '!market') {
        yield put<FetchMarketAction>({
          type: 'fetchMarket',
          payload,
        });
      } else if (addInformExhibitDrawer.addExhibitSelectValue === '!resource') {
        yield put<FetchMyResourcesAction>({
          type: 'fetchMyResources',
          payload,
        });
      } else if (addInformExhibitDrawer.addExhibitSelectValue === '!collection') {
        yield put<FetchCollectionAction>({
          type: 'fetchCollection',
          payload,
        });
      } else {
        yield put<FetchObjectAction>({
          type: 'fetchObject',
          payload,
        });
      }
    },
    * fetchMarket({payload}: FetchMarketAction, {call, select, put}: EffectsCommandMap) {
      const {addInformExhibitDrawer}: ConnectState = yield select(({addInformExhibitDrawer}: ConnectState) => ({
        addInformExhibitDrawer,
      }));

      let inherentList: AddInformExhibitDrawerModelState['addExhibitCheckedList'] = [];

      if (!payload) {
        inherentList = addInformExhibitDrawer.addExhibitCheckedList;
      }

      const inherentIDs = inherentList.map((il) => il.id);
      // console.log(inherentIDs, 'inherentIDs12342134');

      const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
        // resourceType:''
        skip: inherentList.length + 10,
        // startResourceId: inherentList.length > 0 ? inherentList[inherentList.length - 1].id : undefined,
        limit: FUtil.Predefined.pageSize,
        // resourceType: addInformExhibitDrawer.isTheme ? 'theme' : undefined,
        // omitResourceType: addInformExhibitDrawer.isTheme ? undefined : 'theme',
        keywords: addInformExhibitDrawer.addExhibitInputValue,
      };
      // console.log(params, 'paramsparams1234');
      const {data} = yield call(FServiceAPI.Resource.list, params);
      // console.log(data, 'data98jhksjkdaf13453');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitCheckedList: [
            ...inherentList,
            ...(data.dataList as any[])
              .filter((rs) => {
                return !inherentIDs.includes(rs.resourceId);
              })
              .map<AddInformExhibitDrawerModelState['addExhibitCheckedList'][number]>((rs) => {
                return {
                  id: rs.resourceId,
                  disabled: addInformExhibitDrawer.disabledResourceNames.includes(rs.resourceName),
                  checked: false,
                  identity: 'resource',
                  name: rs.resourceName,
                  type: rs.resourceType,
                  updateTime: FUtil.Format.formatDateTime(rs.updateDate),
                  status: rs.status === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
                };
              }),
          ],
          listLength: data.totalItem,
        },
      });
    },
    * fetchMyResources({payload}: FetchMyResourcesAction, {call, put, select}: EffectsCommandMap) {
      const {addInformExhibitDrawer}: ConnectState = yield select(({addInformExhibitDrawer}: ConnectState) => ({
        addInformExhibitDrawer,
      }));

      let inherentList: AddInformExhibitDrawerModelState['addExhibitCheckedList'] = [];

      if (!payload) {
        inherentList = addInformExhibitDrawer.addExhibitCheckedList;
      }

      const inherentIDs = inherentList.map((il) => il.id);
      // console.log(inherentIDs, 'inherentIDs12342134');

      const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
        // resourceType:''
        // skip: 0,
        startResourceId: inherentList.length > 0 ? inherentList[inherentList.length - 1].id : undefined,
        limit: FUtil.Predefined.pageSize,
        isSelf: 1,
        // resourceType: addInformExhibitDrawer.isTheme ? 'theme' : undefined,
        // omitResourceType: addInformExhibitDrawer.isTheme ? undefined : 'theme',
        keywords: addInformExhibitDrawer.addExhibitInputValue,
      };
      // console.log(params, 'paramsparams1234');
      const {data} = yield call(FServiceAPI.Resource.list, params);
      // console.log(data, 'data13453');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitCheckedList: [
            ...inherentList,
            ...(data.dataList as any[])
              .filter((rs) => {
                return !inherentIDs.includes(rs.resourceId);
              })
              .map<AddInformExhibitDrawerModelState['addExhibitCheckedList'][number]>((rs) => {
                return {
                  id: rs.resourceId,
                  disabled: addInformExhibitDrawer.disabledResourceNames.includes(rs.resourceName),
                  checked: false,
                  identity: 'resource',
                  name: rs.resourceName,
                  type: rs.resourceType,
                  updateTime: FUtil.Format.formatDateTime(rs.updateDate),
                  status: rs.status === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
                };
              }),
          ],
          listLength: data.totalItem,
        },
      });
    },
    * fetchCollection({payload}: FetchCollectionAction, {select, call, put}: EffectsCommandMap) {

      const {addInformExhibitDrawer}: ConnectState = yield select(({addInformExhibitDrawer}: ConnectState) => ({
        addInformExhibitDrawer,
      }));

      let inherentList: AddInformExhibitDrawerModelState['addExhibitCheckedList'] = [];

      if (!payload) {
        inherentList = addInformExhibitDrawer.addExhibitCheckedList;
      }

      const inherentIDs = inherentList.map((il) => il.id);

      const params: Parameters<typeof FServiceAPI.Collection.collectionResources>[0] = {
        skip: inherentList.length,
        limit: FUtil.Predefined.pageSize,
        keywords: addInformExhibitDrawer.addExhibitInputValue,
        // resourceType: addInformExhibitDrawer.isTheme ? 'theme' : undefined,
        // omitResourceType: addInformExhibitDrawer.isTheme ? undefined : 'theme',
      };

      const {data} = yield call(FServiceAPI.Collection.collectionResources, params);
      // console.log(data, '@@@@@@ASEDFSADF');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitCheckedList: [
            ...inherentList,
            ...(data.dataList as any[])
              .filter((rs) => {
                return !inherentList.includes(rs.resourceId);
              })
              .map<AddInformExhibitDrawerModelState['addExhibitCheckedList'][number]>((rs) => {
                return {
                  id: rs.resourceId,
                  disabled: addInformExhibitDrawer.disabledResourceNames.includes(rs.resourceName),
                  checked: false,
                  identity: 'resource',
                  name: rs.resourceName,
                  type: rs.resourceType,
                  updateTime: FUtil.Format.formatDateTime(rs.updateDate),
                  status: rs.resourceStatus === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
                };
              }),
          ],
          listLength: data.totalItem,
        },
      });
    },
    * fetchObject({payload}: FetchObjectAction, {put, select, call}: EffectsCommandMap) {
      const {addInformExhibitDrawer}: ConnectState = yield select(({addInformExhibitDrawer}: ConnectState) => ({
        addInformExhibitDrawer,
      }));

      let inherentList: AddInformExhibitDrawerModelState['addExhibitCheckedList'] = [];

      if (!payload) {
        inherentList = addInformExhibitDrawer.addExhibitCheckedList;
      }

      const inherentIDs = inherentList.map((il) => il.id);

      const params: Parameters<typeof FServiceAPI.Storage.objectList>[0] = {
        skip: inherentList.length,
        limit: FUtil.Predefined.pageSize,
        bucketName: addInformExhibitDrawer.addExhibitSelectValue,
        keywords: addInformExhibitDrawer.addExhibitInputValue,
      };

      const {data} = yield call(FServiceAPI.Storage.objectList, params);
      // console.log(data, 'data1q2349ojmdfsl');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitCheckedList: [
            ...inherentList,
            ...(data.dataList as any[])
              .filter((ob) => {
                return !inherentList.includes(ob.objectId);
              })
              .map<AddInformExhibitDrawerModelState['addExhibitCheckedList'][number]>((ob) => {
                const objectName: string = ob.bucketName + '/' + ob.objectName;
                // console.log(objectName, addInformExhibitDrawer.disabledObjectNames, '##7908-2-34jokdsafhkl#-=##');
                return {
                  id: ob.objectId,
                  disabled: addInformExhibitDrawer.disabledObjectNames.includes(objectName),
                  checked: false,
                  identity: 'object',
                  name: objectName,
                  type: ob.resourceType,
                  updateTime: FUtil.Format.formatDateTime(ob.updateDate),
                  status: '',
                };
              }),
          ],
          listLength: data.totalItem,
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
