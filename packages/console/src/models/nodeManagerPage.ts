import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from "@/models/connect";
import {completeUrlByDomain} from "@/utils/format";
import {presentables, PresentablesParamsType} from "@/services/presentables";

export type NodeManagerModelState = WholeReadonly<{
  nodeId: number;

  nodeName: string;
  nodeUrl: string;
  testNodeUrl: string;
  showTheme: boolean;

  selectedType: string;
  selectedStatus: string;
  exhibitInputFilter: string;
  pageCurrent: number;
  pageSize: number;
  exhibitList: {
    id: string;
    cover: string;
    title: string;
    type: string;
    resourceName: string;
    policies: string[];
    isOnline: boolean;
    resourceId: string;
    version: string;
  }[];
  totalNum: number;

  themeInputFilter: string;
  themeList: {
    id: string;
    cover: string;
    title: string;
    policies: string[];
    version: string;
    isOnline: boolean;
  }[];
}>;

export interface ChangeAction extends AnyAction {
  type: 'change' | 'nodeManagerPage/change';
  payload: Partial<NodeManagerModelState>;
}

export interface FetchNodeInfoAction {
  type: 'nodeManagerPage/fetchNodeInfo';
}

export interface FetchInfoAction extends AnyAction {
  type: 'nodeManagerPage/fetchInfo' | 'fetchInfo';
}

export interface OnChangeExhibitAction extends AnyAction {
  type: 'nodeManagerPage/onChangeExhibit';
  payload: Partial<{
    selectedType: string;
    selectedStatus: string;
    exhibitInputFilter: string;
    pageCurrent: number;
    pageSize: number;
  }>;
}

export interface FetchThemesAction extends AnyAction {
  type: 'FetchThemesAction';
  payload: 'fetchThemes';
}

export interface NodeManagerModelType {
  namespace: 'nodeManagerPage';
  state: WholeReadonly<NodeManagerModelState>;
  effects: {
    fetchNodeInfo: (action: FetchNodeInfoAction, effects: EffectsCommandMap) => void;
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    onChangeExhibit: (action: OnChangeExhibitAction, effects: EffectsCommandMap) => void;
    fetchThemes: (action: FetchThemesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<NodeManagerModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: NodeManagerModelType = {
  namespace: 'nodeManagerPage',
  state: {
    nodeId: -1,

    nodeName: '',
    nodeUrl: '',
    testNodeUrl: '',
    showTheme: true,

    selectedType: '-1',
    selectedStatus: '2',
    exhibitInputFilter: '',
    pageCurrent: 1,
    pageSize: 10,
    exhibitList: [],
    totalNum: -1,

    themeInputFilter: '',
    themeList: [],
  },
  effects: {
    * fetchNodeInfo({}: FetchNodeInfoAction, {put, select}: EffectsCommandMap) {
      const {nodes, nodeManagerPage}: ConnectState = yield select(({nodes, nodeManagerPage}: ConnectState) => ({
        nodes,
        nodeManagerPage,
      }));

      const currentNode = nodes.list.find((n) => n.nodeId === nodeManagerPage.nodeId);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeName: currentNode?.nodeName,
          nodeUrl: completeUrlByDomain(currentNode?.nodeDomain || ''),
          testNodeUrl: completeUrlByDomain('t.' + currentNode?.nodeDomain || ''),
        },
      });
    },
    * fetchInfo({}: FetchInfoAction, {call, select, put}: EffectsCommandMap) {
      const {nodeManagerPage}: ConnectState = yield select(({nodeManagerPage}: ConnectState) => ({
        nodeManagerPage,
      }));

      const params: PresentablesParamsType = {
        nodeId: nodeManagerPage.nodeId,
        page: nodeManagerPage.pageCurrent,
        pageSize: nodeManagerPage.pageSize,
        keywords: nodeManagerPage.exhibitInputFilter || undefined,
        onlineStatus: Number(nodeManagerPage.selectedStatus),
        resourceType: nodeManagerPage.selectedType === '-1' ? undefined : nodeManagerPage.selectedType,
        // isLoadPolicyInfo: 1,
      };

      const {data} = yield call(presentables, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibitList: data.dataList.map((i: any) => ({
            id: i.presentableId,
            cover: i.coverImages[0],
            title: i.presentableTitle,
            resourceName: i.presentableName,
            version: i.version,
            isOnline: i.status,
            type: i.resourceInfo.resourceType,
            policies: [],
            resourceId: i.resourceInfo.resourceId,
          })),
          totalNum: data.totalItem,
        },
      });
    },
    * onChangeExhibit({payload}: OnChangeExhibitAction, {put}: EffectsCommandMap) {
      if (payload.pageCurrent) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            pageCurrent: payload.pageCurrent,
          },
        });
      } else {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            ...payload,
            pageCurrent: 1,
          },
        });
      }
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * fetchThemes({}: FetchThemesAction, {call, put, select}: EffectsCommandMap) {
      const {nodeManagerPage}: ConnectState = yield select(({nodeManagerPage}: ConnectState) => ({
        nodeManagerPage,
      }));

      const params: PresentablesParamsType = {
        nodeId: nodeManagerPage.nodeId,
        // page: nodeManagerPage.pageCurrent,
        // pageSize: nodeManagerPage.pageSize,
        keywords: nodeManagerPage.themeInputFilter || undefined,
        onlineStatus: 2,
        resourceType: 'theme',
      };

      const {data} = yield call(presentables, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          themeList: data.dataList.map((i: any) => ({
            id: i.presentableId,
            cover: i.coverImages[0],
            title: i.presentableTitle,
            // resourceName: i.presentableName,
            version: i.version,
            isOnline: i.status,
            // type: i.resourceInfo.resourceType,
            policies: [],
            // resourceId: i.resourceInfo.resourceId,
          })),
          totalNum: data.totalItem,
        },
      });
    }
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
