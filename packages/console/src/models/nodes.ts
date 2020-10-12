import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {nodes, NodesParamsType} from "@/services/nodes";

export interface NodesModelState {
  nodeList: {
    nodeDomain: string;
    nodeId: number;
    nodeName: string;
  }[];
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<NodesModelState>;
}

interface FetchNodesAction extends AnyAction {
  type: 'fetchNodes';
}

export interface NodesModelType {
  namespace: 'nodes';
  state: NodesModelState;
  effects: {
    fetchNodes: (action: FetchNodesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<NodesModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: NodesModelType = {
  namespace: 'nodes',
  state: {
    nodeList: [],
  },
  effects: {
    * fetchNodes({}: FetchNodesAction, {call, put}: EffectsCommandMap) {
      const params: NodesParamsType = {};
      const {data} = yield call(nodes, params);
      // console.log(data, '#SDFASDC');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeList: data.dataList.map((n: any) => ({
            nodeDomain: n.nodeDomain,
            nodeId: n.nodeId,
            nodeName: n.nodeName,
          })),
        }
      })
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
    setup({dispatch}: SubscriptionAPI) {
      dispatch<FetchNodesAction>({
        type: 'fetchNodes',
      });
    }
  }
};

export default Model;
