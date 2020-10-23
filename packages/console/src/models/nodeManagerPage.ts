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
}>;

export interface ChangeAction extends AnyAction {
  type: 'change' | 'nodeManagerPage/change';
  payload: Partial<NodeManagerModelState>;
}

export interface FetchInfoAction extends AnyAction {
  type: 'nodeManagerPage/fetchInfo';
}

export interface NodeManagerModelType {
  namespace: 'nodeManagerPage';
  state: WholeReadonly<NodeManagerModelState>;
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
    * fetchInfo({}: FetchInfoAction, {call, select, put}: EffectsCommandMap) {
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

      const params: PresentablesParamsType = {
        nodeId: nodeManagerPage.nodeId,
      };
      const {data} = yield call(presentables, params);
      console.log(data, '390ajsdlkfjasdl');
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
