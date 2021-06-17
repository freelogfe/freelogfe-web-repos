import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from "@/models/connect";
import {FUtil, FServiceAPI} from '@freelog/tools-lib';

export interface TreeNode {
  title: string;
  key: string;
  id: string;
  isLeaf?: boolean;
  children?: TreeNode[];
}

export interface ReplaceInformExhibitState {
  nodeID: number;
  replacerOriginOptions: { value: string; title: string }[];
  replacerOrigin: '!market' | '!resource' | '!collection' | string;
  replacerKeywords: string;
  replacerResourceList: {
    id: string;
    name: string;
    identity: 'resource' | 'object';
    latestVersion: string;
    type: string;
    updateTime: string;
    status: 'online' | 'offline' | 'unreleased' | '';
    versions: string[];
    version: string;
  }[];
  checkedResourceName: string;

  replacedKeywords: string;
  replacedDependencyTreeList: string[];
  replacedSelectDependency: null | {
    id: string;
    name: string;
    type: 'resource' | 'object';
    versions: string[],
  }
  replacedVersion: string;
  treeData: TreeNode[];
  checkedKeys: string[];
}

export interface ChangeAction extends AnyAction {
  type: 'replaceInformExhibit/change' | 'change';
  payload: Partial<ReplaceInformExhibitState>;
}

export interface ReplaceInformExhibitInitModelStatesAction extends AnyAction {
  type: 'replaceInformExhibit/initModelStates';
}

export interface FetchReplacerListAction extends AnyAction {
  type: 'replaceInformExhibit/fetchReplacerList'
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

export interface FetchDependencyTreeAction extends AnyAction {
  type: 'replaceInformExhibit/fetchDependencyTree' | 'fetchDependencyTree';
}

export interface FetchExhibitByDependencyAction extends AnyAction {
  type: 'replaceInformExhibit/fetchExhibitByDependency' | 'fetchExhibitByDependency';
}

interface ReplaceInformExhibitModelType {
  namespace: 'replaceInformExhibit';
  state: ReplaceInformExhibitState;
  effects: {
    initModelStates: (action: ReplaceInformExhibitInitModelStatesAction, effects: EffectsCommandMap) => void;
    fetchReplacerList: (action: FetchReplacerListAction, effects: EffectsCommandMap) => void;
    fetchMarket: (action: FetchMarketAction, effects: EffectsCommandMap) => void;
    fetchMyResources: (action: FetchMyResourcesAction, effects: EffectsCommandMap) => void;
    fetchCollection: (action: FetchCollectionAction, effects: EffectsCommandMap) => void;
    fetchObject: (action: FetchObjectAction, effects: EffectsCommandMap) => void;
    fetchDependencyTree: (action: FetchDependencyTreeAction, effects: EffectsCommandMap) => void;
    fetchExhibitByDependency: (action: FetchExhibitByDependencyAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ReplaceInformExhibitState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

export const replaceInformExhibitModalInitStates: ReplaceInformExhibitState = {
  nodeID: -1,
  replacerOriginOptions: [
    {value: '!market', title: '资源市场'},
    {value: '!resource', title: '我的资源'},
    {value: '!collection', title: '我的收藏'},
  ],
  replacerOrigin: '!market',
  replacerKeywords: '',
  replacerResourceList: [],
  checkedResourceName: '',

  replacedKeywords: '',
  replacedDependencyTreeList: [],
  replacedSelectDependency: null,
  replacedVersion: '',
  treeData: [],
  checkedKeys: [],
};

const Model: ReplaceInformExhibitModelType = {
  namespace: 'replaceInformExhibit',
  state: replaceInformExhibitModalInitStates,
  effects: {
    * fetchReplacerList({}: FetchReplacerListAction, {select, call, put}: EffectsCommandMap) {
      // console.log('!!!!!!------');
      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));

      if (replaceInformExhibit.replacerOrigin === '!market') {
        yield put<FetchMarketAction>({
          type: 'fetchMarket',
        });
      } else if (replaceInformExhibit.replacerOrigin === '!resource') {
        yield put<FetchMyResourcesAction>({
          type: 'fetchMyResources',
        });
      } else if (replaceInformExhibit.replacerOrigin === '!collection') {
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
      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));
      const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
        skip: 0,
        limit: FUtil.Predefined.pageSize,
        keywords: replaceInformExhibit.replacerKeywords,
      };
      const {data} = yield call(FServiceAPI.Resource.list, params);
      // console.log(data, 'data134@@@#@#@##@@@@@53');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerResourceList: (data.dataList as any[]).map<ReplaceInformExhibitState['replacerResourceList'][number]>((rs) => {
            // console.log(rs, '######2341234');
            return {
              id: rs.resourceId,
              identity: 'resource',
              name: rs.resourceName,
              type: rs.resourceType,
              latestVersion: rs.latestVersion,
              updateTime: FUtil.Format.formatDateTime(rs.updateDate),
              status: rs.status === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
              versions: rs.resourceVersions.map((rv: any) => {
                return rv.version;
              }),
              version: '',
            };
          }),
        },
      });
    },
    * fetchMyResources({payload}: FetchMyResourcesAction, {call, put, select}: EffectsCommandMap) {
      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));
      const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
        // resourceType:''
        skip: 0,
        limit: FUtil.Predefined.pageSize,
        isSelf: 1,
        // resourceType: replaceInformExhibit.isTheme ? 'theme' : undefined,
        keywords: replaceInformExhibit.replacerKeywords,
      };
      // console.log(params, 'paramsparams1234');
      const {data} = yield call(FServiceAPI.Resource.list, params);
      // console.log(data, 'data13453');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerResourceList: (data.dataList as any[]).map<ReplaceInformExhibitState['replacerResourceList'][number]>((rs) => {
            return {
              id: rs.resourceId,
              identity: 'resource',
              name: rs.resourceName,
              type: rs.resourceType,
              latestVersion: rs.latestVersion,
              updateTime: FUtil.Format.formatDateTime(rs.updateDate),
              status: rs.status === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
              versions: rs.resourceVersions.map((rv: any) => {
                return rv.version;
              }),
              version: '',
            };
          }),
        },
      });
    },
    * fetchCollection({}: FetchCollectionAction, {select, call, put}: EffectsCommandMap) {

      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));

      const params: Parameters<typeof FServiceAPI.Collection.collectionResources>[0] = {
        skip: 0,
        limit: FUtil.Predefined.pageSize,
        keywords: replaceInformExhibit.replacerKeywords,
      };

      const {data} = yield call(FServiceAPI.Collection.collectionResources, params);
      // console.log(data, '@@@@@@ASEDFSADF');

      let data3 = [];

      if (data.dataList.length > 0) {
        const params2: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
          resourceIds: data.dataList.map((dl: any) => {
            return dl.resourceId;
          }).join(),
        };

        const {data: data2} = yield call(FServiceAPI.Resource.batchInfo, params2);

        data3 = data2;

      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerResourceList: (data3 as any[]).map<ReplaceInformExhibitState['replacerResourceList'][number]>((rs) => {
            return {
              id: rs.resourceId,
              identity: 'resource',
              name: rs.resourceName,
              type: rs.resourceType,
              updateTime: FUtil.Format.formatDateTime(rs.updateDate),
              latestVersion: rs.latestVersion,
              status: rs.resourceStatus === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
              versions: rs.resourceVersions.map((rv: any) => {
                return rv.version;
              }),
              version: '',
            };
          }),
        },
      });
    },
    * fetchObject({}: FetchObjectAction, {put, select, call}: EffectsCommandMap) {
      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));

      const params: Parameters<typeof FServiceAPI.Storage.objectList>[0] = {
        skip: 0,
        limit: FUtil.Predefined.pageSize,
        bucketName: replaceInformExhibit.replacerOrigin,
        keywords: replaceInformExhibit.replacerKeywords,
      };

      const {data} = yield call(FServiceAPI.Storage.objectList, params);
      // console.log(data, 'data1q2349ojmdfsl');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerResourceList: (data.dataList as any[]).map<ReplaceInformExhibitState['replacerResourceList'][number]>((ob) => {
            const objectName: string = ob.bucketName + '/' + ob.objectName;
            // console.log(objectName, replaceInformExhibit.disabledObjectNames, '#####');
            return {
              id: ob.objectId,
              identity: 'object',
              name: objectName,
              type: ob.resourceType,
              latestVersion: '',
              updateTime: FUtil.Format.formatDateTime(ob.updateDate),
              status: '',
              versions: [],
              version: '',
            };
          }),
        },
      });

    },
    * fetchDependencyTree({}: FetchDependencyTreeAction, {put, select, call}: EffectsCommandMap) {
      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));

      const params: Parameters<typeof FServiceAPI.InformalNode.dependencyTree>[0] = {
        nodeId: replaceInformExhibit.nodeID,
        keywords: replaceInformExhibit.replacedKeywords,
      };

      const {data} = yield call(FServiceAPI.InformalNode.dependencyTree, params);
      // console.log(data, '##@ADSFASDFSDCX');

      let replacedSelectDependency = data.find((d: any) => d.name === replaceInformExhibit.replacedKeywords);
      // console.log(replacedSelectDependency, 'replacedSelectDependency#$FDS_)+(Ujoi');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacedDependencyTreeList: data.map((d: any) => d.name),
          replacedSelectDependency: replacedSelectDependency || null,
          replacedVersion: '',
        },
      });
      if (replacedSelectDependency) {
        yield put<FetchExhibitByDependencyAction>({
          type: 'fetchExhibitByDependency',
        });
      }
    },
    * fetchExhibitByDependency({}: FetchExhibitByDependencyAction, {select, call, put}: EffectsCommandMap) {
      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));

      if (!replaceInformExhibit.replacedSelectDependency) {
        return;
      }

      const params: Parameters<typeof FServiceAPI.InformalNode.searchTestResourcesByDependency>[0] = {
        nodeId: replaceInformExhibit.nodeID,
        dependentEntityId: replaceInformExhibit.replacedSelectDependency.id,
      };
      const {data} = yield call(FServiceAPI.InformalNode.searchTestResourcesByDependency, params);
      // console.log(data, 'data!@EWFASDfasdfsad');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          treeData: (data as any[]).map<ReplaceInformExhibitState['treeData'][number]>((d: any) => {
            return {
              key: d.testResourceName,
              id: d.testResourceId,
              title: d.testResourceName,
            };
          }),
        }
      })
    },
    * initModelStates({}: ReplaceInformExhibitInitModelStatesAction, {put, select}: EffectsCommandMap) {
      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...replaceInformExhibitModalInitStates,
          nodeID: replaceInformExhibit.nodeID,
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
