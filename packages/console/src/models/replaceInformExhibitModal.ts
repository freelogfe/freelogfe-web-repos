import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from "@/models/connect";
import {FUtil, FServiceAPI} from '@freelog/tools-lib';
import * as React from "react";

export interface TreeNode {
  title: string;
  key: string;
  id: string;
  isLeaf?: boolean;
  children?: TreeNode[];
}

interface ICandidate {
  name: string;
  versionRange?: string;
  type: 'resource' | 'object';
}

type IConfirmValue = {
  exhibitName: string;
  replaced: ICandidate;
  replacer: ICandidate;
  scopes: ICandidate[][];
}[];

export interface ReplaceInformExhibitState {
  nodeID: number;
  isTheme: boolean;

  replacerResourceOptions: { value: string; title: string }[];
  replacerBucketOptions: { value: string; title: string }[];
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
  };
  replacedTargetVersions: {
    value: string;
    text: string;
  }[],
  replacedTargetSelectedVersion: {
    value: string;
    text: string;
  } | null;
  replacedTreeData: TreeNode[];
  replacedCheckedKeys: string[];
}

export interface ChangeAction extends AnyAction {
  type: 'replaceInformExhibit/change' | 'change';
  payload: Partial<ReplaceInformExhibitState>;
}

export interface OnReplacerMountAction extends AnyAction {
  type: 'replaceInformExhibit/onReplacerMount';
}

export interface OnReplacerUnmountAction extends AnyAction {
  type: 'replaceInformExhibit/onReplacerUnmount';
}

export interface OnReplacerOriginChangeAction extends AnyAction {
  type: 'replaceInformExhibit/onReplacerOriginChange';
  payload: {
    value: string;
  };
}

export interface ReplaceInformExhibitInitModelStatesAction extends AnyAction {
  type: 'replaceInformExhibit/initModelStates';
}

export interface FetchReplacerListAction extends AnyAction {
  type: 'fetchReplacerList' | 'replaceInformExhibit/fetchReplacerList';
  payload: {
    restart: boolean;
    origin?: string;
    keywords?: string;
  };
}

export interface OnReplacerListLoadMoreAction extends AnyAction {
  type: 'onReplacerListLoadMore';
}

export interface OnReplacedMountAction extends AnyAction {
  type: 'replaceInformExhibit/onReplacedMount';
}

export interface OnReplacedUnmountAction extends AnyAction {
  type: 'replaceInformExhibit/onReplacedUnmount';
}

export interface OnReplacedKeywordChangeAction extends AnyAction {
  type: 'replaceInformExhibit/onReplacedKeywordChange';
  payload: {
    value: string;
  };
}

export interface OnReplacedEntityVersionChangeAction extends AnyAction {
  type: 'replaceInformExhibit/onReplacedEntityVersionChange';
  payload: {
    value: string;
  };
}

export interface OnReplacedTreeLoadDataAction extends AnyAction {
  type: 'replaceInformExhibit/onReplacedTreeLoadData';
  payload: {
    pos: string;
    id: string;
    key: string;
  };
}

// export interface FetchDependencyTreeAction extends AnyAction {
//   type: 'replaceInformExhibit/fetchDependencyTree' | 'fetchDependencyTree';
// }

// export interface FetchExhibitByDependencyAction extends AnyAction {
//   type: 'replaceInformExhibit/fetchExhibitByDependency' | 'fetchExhibitByDependency';
// }

export interface OnReplaceModalCancelAction extends AnyAction {
  type: 'replaceInformExhibit/onReplaceModalCancel';
}

export interface OnReplaceModalConfirmAction extends AnyAction {
  type: 'replaceInformExhibit/onReplaceModalConfirm';
}

interface ReplaceInformExhibitModelType {
  namespace: 'replaceInformExhibit';
  state: ReplaceInformExhibitState;
  effects: {
    initModelStates: (action: ReplaceInformExhibitInitModelStatesAction, effects: EffectsCommandMap) => void;

    onReplacerMount: (action: OnReplacerMountAction, effects: EffectsCommandMap) => void;
    onReplacerUnmount: (action: OnReplacerUnmountAction, effects: EffectsCommandMap) => void;
    onReplacerOriginChange: (action: OnReplacerOriginChangeAction, effects: EffectsCommandMap) => void;
    fetchReplacerList: (action: FetchReplacerListAction, effects: EffectsCommandMap) => void;
    // fetchMarket: (action: FetchMarketAction, effects: EffectsCommandMap) => void;
    // fetchMyResources: (action: FetchMyResourcesAction, effects: EffectsCommandMap) => void;
    // fetchCollection: (action: FetchCollectionAction, effects: EffectsCommandMap) => void;
    // fetchObject: (action: FetchObjectAction, effects: EffectsCommandMap) => void;
    onReplacerListLoadMore: (action: OnReplacerListLoadMoreAction, effects: EffectsCommandMap) => void;

    onReplacedMount: (action: OnReplacedMountAction, effects: EffectsCommandMap) => void;
    onReplacedUnmount: (action: OnReplacedUnmountAction, effects: EffectsCommandMap) => void;
    onReplacedKeywordChange: (action: OnReplacedKeywordChangeAction, effects: EffectsCommandMap) => void;
    onReplacedEntityVersionChange: (action: OnReplacedEntityVersionChangeAction, effects: EffectsCommandMap) => void;
    onReplacedTreeLoadData: (action: OnReplacedTreeLoadDataAction, effects: EffectsCommandMap) => void;
    // fetchDependencyTree: (action: FetchDependencyTreeAction, effects: EffectsCommandMap) => void;
    // fetchExhibitByDependency: (action: FetchExhibitByDependencyAction, effects: EffectsCommandMap) => void;

    onReplaceModalCancel: (action: OnReplaceModalCancelAction, effects: EffectsCommandMap) => void;
    onReplaceModalConfirm: (action: OnReplaceModalConfirmAction, effects: EffectsCommandMap) => void;

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
  isTheme: false,

  replacerResourceOptions: [
    {value: '!market', title: '资源市场'},
    {value: '!resource', title: '我的资源'},
    {value: '!collection', title: '我的收藏'},
  ],
  replacerBucketOptions: [],
  replacerOrigin: '!market',
  replacerKeywords: '',
  replacerResourceList: [],
  checkedResourceName: '',

  replacedKeywords: '',
  replacedDependencyTreeList: [],
  replacedSelectDependency: null,
  replacedTargetVersions: [],
  replacedTargetSelectedVersion: null,
  replacedTreeData: [],
  replacedCheckedKeys: [],
};

const Model: ReplaceInformExhibitModelType = {
  namespace: 'replaceInformExhibit',
  state: replaceInformExhibitModalInitStates,
  effects: {
    * onReplacerMount({}: OnReplacerMountAction, {put, call}: EffectsCommandMap) {
      yield put<FetchReplacerListAction>({
        type: 'fetchReplacerList',
        payload: {
          restart: true,
          origin: '!market',
        },
      });

      const params: Parameters<typeof FServiceAPI.Storage.bucketList>[0] = {
        bucketType: 1,
      };

      const {data} = yield call(FServiceAPI.Storage.bucketList, params);
      // console.log(data, '!@#$!@#$#$!@111111111');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerBucketOptions: (data as any[]).map<ReplaceInformExhibitState['replacerBucketOptions'][number]>((d: any) => {
            return {
              value: d.bucketName,
              title: d.bucketName,
            };
          }),
        },
      });
    },
    * onReplacerUnmount({}: OnReplacerUnmountAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: replaceInformExhibitModalInitStates,
      });
    },
    * onReplacerOriginChange({payload}: OnReplacerOriginChangeAction, {put, select}: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerOrigin: payload.value,
        },
      });

      yield put<FetchReplacerListAction>({
        type: 'fetchReplacerList',
        payload: {
          restart: true,
          origin: payload.value,
        },
      });
    },
    * fetchReplacerList({payload}: FetchReplacerListAction, {select, call, put}: EffectsCommandMap) {
      // console.log('!!!!!!------');
      // const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
      //   replaceInformExhibit,
      // }));
      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));

      const payloadOrigin: string = payload.origin !== undefined ? payload.origin : replaceInformExhibit.replacerOrigin;
      const payloadKeywords: string = payload.keywords !== undefined ? payload.keywords : replaceInformExhibit.replacerKeywords;

      let replacerResourceList: ReplaceInformExhibitState['replacerResourceList'] = [];

      if (!payload.restart) {
        replacerResourceList = [
          ...replaceInformExhibit.replacerResourceList,
        ];
      }

      if (payloadOrigin === '!market') {
        // yield put<FetchMarketAction>({
        //   type: 'fetchMarket',
        // });

        const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
          skip: replacerResourceList.length,
          limit: FUtil.Predefined.pageSize,
          keywords: payloadKeywords,
        };

        const {data} = yield call(FServiceAPI.Resource.list, params);

        replacerResourceList = [
          ...replacerResourceList,
          ...(data.dataList as any[]).map<ReplaceInformExhibitState['replacerResourceList'][number]>((rs) => {
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
        ];
      } else if (payloadOrigin === '!resource') {
        // yield put<FetchMyResourcesAction>({
        //   type: 'fetchMyResources',
        // });

        const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
          // resourceType:''
          skip: replacerResourceList.length,
          limit: FUtil.Predefined.pageSize,
          isSelf: 1,
          // resourceType: replaceInformExhibit.isTheme ? 'theme' : undefined,
          keywords: payloadKeywords,
        };
        // console.log(params, 'paramsparams1234');
        const {data} = yield call(FServiceAPI.Resource.list, params);
        // console.log(data, 'data13453');
        replacerResourceList = [
          ...replacerResourceList,
          ...(data.dataList as any[]).map<ReplaceInformExhibitState['replacerResourceList'][number]>((rs) => {
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
        ];
      } else if (payloadOrigin === '!collection') {
        // yield put<FetchCollectionAction>({
        //   type: 'fetchCollection',
        // });

        const params: Parameters<typeof FServiceAPI.Collection.collectionResources>[0] = {
          skip: replacerResourceList.length,
          limit: FUtil.Predefined.pageSize,
          keywords: payloadKeywords,
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

        replacerResourceList = [
          ...replacerResourceList,
          ...(data3 as any[]).map<ReplaceInformExhibitState['replacerResourceList'][number]>((rs) => {
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
        ]

      } else {
        const params: Parameters<typeof FServiceAPI.Storage.objectList>[0] = {
          skip: 0,
          limit: FUtil.Predefined.pageSize,
          bucketName: payloadOrigin,
          keywords: payloadKeywords,
        };

        const {data} = yield call(FServiceAPI.Storage.objectList, params);
        // console.log(data, 'data1q2349ojmdfsl');
        replacerResourceList = [
          ...replacerResourceList,
          ...(data.dataList as any[]).map<ReplaceInformExhibitState['replacerResourceList'][number]>((ob) => {
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
        ];
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerResourceList: replacerResourceList,
        },
      });

    },
    * onReplacerListLoadMore({}: OnReplacerListLoadMoreAction, {}: EffectsCommandMap) {

    },
    * onReplacedMount({}: OnReplacedMountAction, {}: EffectsCommandMap) {

    },
    * onReplacedUnmount({}: OnReplacedUnmountAction, {}: EffectsCommandMap) {

    },
    * onReplacedKeywordChange({payload}: OnReplacedKeywordChangeAction, {put, select, call}: EffectsCommandMap) {
      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));

      const payloadValue: string = payload.value;

      yield put({
        type: 'change',
        payload: {
          replacedKeywords: payloadValue,
        },
      });

      const params: Parameters<typeof FServiceAPI.InformalNode.dependencyTree>[0] = {
        nodeId: replaceInformExhibit.nodeID,
        keywords: payloadValue,
        resourceType: replaceInformExhibit.isTheme ? 'theme' : undefined,
        omitResourceType: replaceInformExhibit.isTheme ? undefined : 'theme',
      };

      const {data} = yield call(FServiceAPI.InformalNode.dependencyTree, params);
      // console.log(data, '##@ADSFASDFSDCX');

      let replacedSelectDependency = data.find((d: any) => d.name === payloadValue);
      // console.log(replacedSelectDependency, 'replacedSelectDependency#$FDS_)+(Ujoi');

      const replacedTargetVersions: ReplaceInformExhibitState['replacedTargetVersions'] = replacedSelectDependency
        ? [
          {value: '', text: '全部版本'},
          ...replacedSelectDependency.versions.map((v: any) => {
            return {
              value: v,
              text: v,
            };
          }),
        ]
        : [];
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacedDependencyTreeList: data?.map((d: any) => d.name) || [],
          replacedSelectDependency: replacedSelectDependency || null,
          replacedTargetVersions: replacedTargetVersions,
          replacedTargetSelectedVersion: replacedTargetVersions.length > 0 ? replacedTargetVersions[0] : null,
        },
      });

      if (!replacedSelectDependency) {
        return;
      }

      const params3: Parameters<typeof FServiceAPI.InformalNode.searchTestResourcesByDependency>[0] = {
        nodeId: replaceInformExhibit.nodeID,
        dependentEntityId: replacedSelectDependency.id,
        resourceType: replaceInformExhibit.isTheme ? 'theme' : undefined,
        omitResourceType: replaceInformExhibit.isTheme ? undefined : 'theme',
      };
      const {data: data3} = yield call(FServiceAPI.InformalNode.searchTestResourcesByDependency, params3);
      // console.log(data3, 'data3data3data3data3data3data3data309789079877897989797');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacedTreeData: (data3 as any[]).map<ReplaceInformExhibitState['replacedTreeData'][number]>((d: any) => {
            return {
              key: `${FUtil.Tool.generateRandomCode()}:${d.testResourceName}`,
              id: d.testResourceId,
              title: `${d.entityName}(${d.testResourceName})`,
            };
          }),
          replacedCheckedKeys: [],
        },
      });
    },
    * onReplacedEntityVersionChange({payload}: OnReplacedEntityVersionChangeAction, {select, call, put}: EffectsCommandMap) {

      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));

      if (!replaceInformExhibit.replacedSelectDependency) {
        return;
      }


      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacedTargetSelectedVersion: replaceInformExhibit.replacedTargetVersions.find((rtv) => {
            return rtv.value === payload.value;
          }) || null,
        },
      });

      const params3: Parameters<typeof FServiceAPI.InformalNode.searchTestResourcesByDependency>[0] = {
        nodeId: replaceInformExhibit.nodeID,
        dependentEntityId: replaceInformExhibit.replacedSelectDependency.id,
        resourceType: replaceInformExhibit.isTheme ? 'theme' : undefined,
        omitResourceType: replaceInformExhibit.isTheme ? undefined : 'theme',
        dependentEntityVersionRange: payload.value || undefined,
      };
      const {data: data3} = yield call(FServiceAPI.InformalNode.searchTestResourcesByDependency, params3);
      // console.log(data3, 'data3data3data3data3data3data3data309789079877897989797');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacedTreeData: (data3 as any[]).map<ReplaceInformExhibitState['replacedTreeData'][number]>((d: any) => {
            return {
              key: `${FUtil.Tool.generateRandomCode()}:${d.testResourceName}`,
              id: d.testResourceId,
              title: `${d.entityName}(${d.testResourceName})`,
            };
          }),
          replacedCheckedKeys: [],
        },
      });
    },
    * onReplacedTreeLoadData({payload}: OnReplacedTreeLoadDataAction, {select, put, call}: EffectsCommandMap) {

      // console.log(payload, 'payloadpayloadpayloadpayloadpayloadpayload!!!!!!@@@@@@@#3333333');

      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));

      if (payload.pos.split('-').length !== 2) {
        return;
      }
      const params: Parameters<typeof FServiceAPI.InformalNode.dependencyTreeFilter>[0] = {
        testResourceId: payload.id,
        dependentEntityId: replaceInformExhibit.replacedSelectDependency?.id || '',
        dependentEntityVersionRange: replaceInformExhibit.replacedTargetSelectedVersion?.value || undefined,
      };
      const {data} = yield call(FServiceAPI.InformalNode.dependencyTreeFilter, params);
      // console.log(data, 'dependencyTreeFilter!@#$@!#$@#$@#$');
      const result = updateTreeData({
        list: replaceInformExhibit.replacedTreeData as TreeNode[],
        key: payload.key,
        children: organizeData(data[0].dependencies, payload.key),
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacedTreeData: result,
        },
      });
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

    * onReplaceModalCancel({}: OnReplaceModalCancelAction, {}: EffectsCommandMap) {

    },
    * onReplaceModalConfirm({}: OnReplaceModalConfirmAction, {select}: EffectsCommandMap) {
      const {replaceInformExhibit}: ConnectState = yield select(({replaceInformExhibit}: ConnectState) => ({
        replaceInformExhibit,
      }));

      const simplifiedResults: string[][] = simplifiedRelationship(replaceInformExhibit.replacedCheckedKeys).map<string[]>((r) => {
        return r.split(':');
      });
      // console.log(simplifiedResults, 're90j23DSF@#AFSd0-_simplifiedResults');
      const resultObj: { [key: string]: ICandidate[][] } = {};
      for (const simplifiedResult of simplifiedResults) {
        resultObj[simplifiedResult[0]] = [];
      }
      for (const simplifiedResult of simplifiedResults) {
        const [key, ...arr] = simplifiedResult;
        // console.log(key, arr, '@#DASasiodfj_(UJLKjl;');
        if (arr.length === 0) {
          continue;
        }
        // console.log(arr, 'arr@#$R%DSFZ)_Jkl;sdafds');
        resultObj[key].push(arr.map((o: string) => {
          if (o.startsWith('$')) {
            return {
              name: o.replace('$', ''),
              type: 'resource',
              versionRange: 'latest',
            }
          } else {
            return {
              name: o.replace('#', ''),
              type: 'object',
              versionRange: 'latest',
            }
          }
        }));
      }
      // console.log(resultObj, 'resultObj@#AFDSFASD)(_&UOIJ:');
      const replacerData = replaceInformExhibit.replacerResourceList.find((rr) => {
        return rr.name === replaceInformExhibit.checkedResourceName;
      });
      // console.log(replacerData, 'replacerData234edf@#$SDF)(JLK');
      const results: IConfirmValue = [];
      for (const [exhibitName, scopes] of Object.entries(resultObj)) {
        results.push({
          exhibitName: exhibitName,
          replaced: {
            name: replaceInformExhibit.replacedSelectDependency?.name || '',
            versionRange: replaceInformExhibit.replacedTargetSelectedVersion?.value || 'latest',
            type: replaceInformExhibit.replacedSelectDependency?.type || 'object',
          },
          replacer: {
            name: replacerData?.name || '',
            versionRange: replacerData?.version || 'latest',
            type: replacerData?.identity || 'object',
          },
          scopes: scopes,
        });
      }
      return results;
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

interface UpdateTreeDataParams {
  list: TreeNode[];
  key: React.Key;
  children: TreeNode[];
}

function updateTreeData({list, key, children}: UpdateTreeDataParams): TreeNode[] {
  return list.map(node => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    } else if (node.children) {
      return {
        ...node,
        children: updateTreeData({
          list: node.children,
          key,
          children,
        }),
      };
    }
    return node;
  });
}

interface OrganizeData {
  id: string;
  name: string;
  type: string;
  dependencies: OrganizeData[];
}

function organizeData(data: OrganizeData[], parentKey: string = ''): TreeNode[] {
  // console.log(data, 'data2WQR@#SDfolkj;lk');
  return data.map<TreeNode>((d) => {
    const key = parentKey + ':' + (d.type === 'resource' ? '$' : '#') + d.name;

    if (d.dependencies.length === 0) {
      return {
        title: d.name,
        key,
        id: d.id,
        isLeaf: true,
      };
    }

    return {
      title: d.name,
      key,
      id: d.id,
      isLeaf: false,
      children: organizeData(d.dependencies, key),
    };
  });
}

function simplifiedRelationship(relation: string[]): string[] {
  // console.log(relation, 'relation!!!!!@@@@@');
  let arr: string[] = [...relation].sort((a: string, b: string) => a.length - b.length);

  for (let i = 0; i < arr.length; i++) {
    const current: string = arr[i];
    arr = arr.filter((a) => {
      return a === current || !a.startsWith(current);
    })
  }
  return arr;
}
