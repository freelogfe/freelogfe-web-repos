import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from "@/models/connect";
import {FUtil, FServiceAPI} from '@freelog/tools-lib';

export interface AddInformExhibitDrawerModelState {
  nodeID: number;
  isTheme: boolean;
  // disabledResourceNames: string[];
  // disabledObjectNames: string[];

  addExhibitOptions: { value: string; title: string }[];
  addExhibitSelectValue: string;
  addExhibitInputValue: string;
  addExhibitCheckedList: {
    id: string;
    disabled: boolean;
    disabledReason: string;
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
  nodeID: -1,
  isTheme: false,
  // disabledResourceNames: [],
  // disabledObjectNames: [],

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
        skip: inherentList.length,
        // startResourceId: inherentList.length > 0 ? inherentList[inherentList.length - 1].id : undefined,
        limit: FUtil.Predefined.pageSize + 10,
        omitResourceType: addInformExhibitDrawer.isTheme ? undefined : 'theme',
        resourceType: addInformExhibitDrawer.isTheme ? 'theme' : undefined,
        keywords: addInformExhibitDrawer.addExhibitInputValue,
      };
      // console.log(params, 'paramsparams1234');
      const {data} = yield call(FServiceAPI.Resource.list, params);
      // console.log(data, 'data!~!@#$@!#$@#!411111');

      const params1: Parameters<typeof getUsedTargetIDs>[0] = {
        nodeID: addInformExhibitDrawer.nodeID,
        entityType: 'resource',
        entityIds: data.dataList.map((dl: any) => {
          return dl.resourceId;
        }),
      };

      const usedResourceIDs: string[] = yield call(getUsedTargetIDs, params1);

      // console.log(usedResourceID, 'usedResourceID!!!!@@@222222222');

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

                let disabled: boolean = false;
                let disabledReason: string = '';

                if (usedResourceIDs.includes(rs.resourceId)) {
                  disabled = true;
                  disabledReason = '已被使用';
                }

                return {
                  id: rs.resourceId,
                  disabled,
                  disabledReason,
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
        skip: inherentList.length,
        // startResourceId: inherentList.length > 0 ? inherentList[inherentList.length - 1].id : undefined,
        limit: FUtil.Predefined.pageSize + 10,
        isSelf: 1,
        omitResourceType: addInformExhibitDrawer.isTheme ? undefined : 'theme',
        resourceType: addInformExhibitDrawer.isTheme ? 'theme' : undefined,
        keywords: addInformExhibitDrawer.addExhibitInputValue,
      };
      // console.log(params, 'paramsparams1234');
      const {data} = yield call(FServiceAPI.Resource.list, params);
      // console.log(data, 'data13453');

      const params1: Parameters<typeof getUsedTargetIDs>[0] = {
        nodeID: addInformExhibitDrawer.nodeID,
        entityType: 'resource',
        entityIds: data.dataList.map((dl: any) => {
          return dl.resourceId;
        }),
      };

      const usedResourceIDs: string[] = yield call(getUsedTargetIDs, params1);

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
                let disabled: boolean = false;
                let disabledReason: string = '';

                if (usedResourceIDs.includes(rs.resourceId)) {
                  disabled = true;
                  disabledReason = '已被使用';
                }
                return {
                  id: rs.resourceId,
                  disabled,
                  disabledReason,
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
        limit: FUtil.Predefined.pageSize + 10,
        keywords: addInformExhibitDrawer.addExhibitInputValue,
        omitResourceType: addInformExhibitDrawer.isTheme ? undefined : 'theme',
        resourceType: addInformExhibitDrawer.isTheme ? 'theme' : undefined,
      };

      const {data} = yield call(FServiceAPI.Collection.collectionResources, params);
      // console.log(data, '@@@@@@ASEDFSADF');

      const params1: Parameters<typeof getUsedTargetIDs>[0] = {
        nodeID: addInformExhibitDrawer.nodeID,
        entityType: 'resource',
        entityIds: data.dataList.map((dl: any) => {
          return dl.resourceId;
        }),
      };

      const usedResourceIDs: string[] = yield call(getUsedTargetIDs, params1);

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

                let disabled: boolean = false;
                let disabledReason: string = '';

                if (usedResourceIDs.includes(rs.resourceId)) {
                  disabled = true;
                  disabledReason = '已被使用';
                }

                return {
                  id: rs.resourceId,
                  disabled,
                  disabledReason,
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
        limit: FUtil.Predefined.pageSize + 10,
        bucketName: addInformExhibitDrawer.addExhibitSelectValue,
        keywords: addInformExhibitDrawer.addExhibitInputValue,
        isLoadingTypeless: 0,
        omitResourceType: addInformExhibitDrawer.isTheme ? undefined : 'theme',
        resourceType: addInformExhibitDrawer.isTheme ? 'theme' : undefined,
      };

      const {data} = yield call(FServiceAPI.Storage.objectList, params);
      console.log(data, 'data1q2349ojmdfsl');

      const params1: Parameters<typeof getUsedTargetIDs>[0] = {
        nodeID: addInformExhibitDrawer.nodeID,
        entityType: 'object',
        entityIds: data.dataList.map((dl: any) => {
          return dl.objectId;
        }),
      };

      const usedResourceIDs: string[] = yield call(getUsedTargetIDs, params1);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitCheckedList: [
            ...inherentList,
            ...(data.dataList as any[])
              .filter((ob) => {
                return !inherentIDs.includes(ob.objectId);
              })
              .map<AddInformExhibitDrawerModelState['addExhibitCheckedList'][number]>((ob) => {
                const objectName: string = ob.bucketName + '/' + ob.objectName;
                // console.log(objectName, addInformExhibitDrawer.disabledObjectNames, '##7908-2-34jokdsafhkl#-=##');
                let disabled: boolean = false;
                let disabledReason: string = '';

                if (usedResourceIDs.includes(ob.objectId)) {
                  disabled = true;
                  disabledReason = '已被使用';
                }

                return {
                  id: ob.objectId,
                  disabled,
                  disabledReason,
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

interface GetUsedTargetIDsParams {
  nodeID: number;
  entityType: 'resource' | 'object';
  entityIds: string[];
}

async function getUsedTargetIDs({nodeID, entityType, entityIds}: GetUsedTargetIDsParams): Promise<string[]> {
  if (entityIds.length === 0) {
    return [];
  }

  const params1: Parameters<typeof FServiceAPI.InformalNode.batchTestResources>[0] = {
    nodeId: nodeID,
    entityType: entityType,
    entityIds: entityIds.join(),
  };

  const {data} = await FServiceAPI.InformalNode.batchTestResources(params1);

  // console.log(data1, 'data98jhksjkdaf13453');
  return (data as any[]).map<string>((d1: any) => {
    return d1.originInfo.id;
  });
}
