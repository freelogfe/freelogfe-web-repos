import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from "@/models/connect";

export interface NodeManagerModelState {
  nodeId: number;

  nodeName: string;
  nodeUrl: string;
  testNodeUrl: string;
  showTheme: boolean;

  selectedType: string;
  selectedStatus: string;
  inputFilter: string;
  pageCurrent: number;
  pageSize: number;
  exhibitList: {
    cover: string;
    title: string;
    type: string;
    resourceName: string;
    policies: string[];
    isOnline: boolean;
  }[];
  totalNum: number;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'nodeManagerPage/change';
  payload: Partial<NodeManagerModelState>;
}

export interface FetchInfoAction extends AnyAction {
  type: 'nodeManagerPage/fetchInfo';
}

export interface NodeManagerModelType {
  namespace: 'nodeManagerPage';
  state: NodeManagerModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
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
    showTheme: false,

    selectedType: '',
    selectedStatus: '',
    inputFilter: '',
    pageCurrent: 1,
    pageSize: 10,
    exhibitList: [],
    totalNum: -1,
  },
  effects: {
    * fetchInfo({}: FetchInfoAction, {call, select}: EffectsCommandMap) {
      const {nodes, nodeManagerPage}: ConnectState = yield select(({nodes, nodeManagerPage}: ConnectState) => ({
        nodes,
        nodeManagerPage,
      }));
      const currentNode = nodes.nodeList.find((n) => n.nodeId = nodeManagerPage.nodeId)
      console.log(currentNode, 'currentNode0932');
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
