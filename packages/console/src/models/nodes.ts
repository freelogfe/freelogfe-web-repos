import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
// import { ConnectState } from '@/models/connect';
// import { history } from 'umi';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { ConnectState } from '@/models/connect';
// import fMessage from '@/components/fMessage';
// import { FI18n } from '@freelog/tools-lib';

export interface NodesModelState {
  list: {
    nodeDomain: string;
    nodeId: number;
    nodeName: string;
  }[];
}

export interface ChangeAction extends AnyAction {
  type: 'nodes/change' | 'change';
  payload: Partial<NodesModelState>;
}

interface FetchNodesAction extends AnyAction {
  type: 'fetchNodes';
}

// export interface CreateNodeAction extends AnyAction {
//   type: 'nodes/createNode';
// }

// export interface OnChangeNameAction extends AnyAction {
//   type: 'nodes/onChangeName';
//   payload: string;
// }

// export interface OnChangeDomainAction extends AnyAction {
//   type: 'nodes/onChangeDomain';
//   payload: string;
// }


// export interface InitModelStatesAction extends AnyAction {
//   type: 'nodes/initModelStates';
// }

export interface OnAdd_Node_Action extends AnyAction {
  type: 'nodes/onAdd_Node';
  payload: {
    value: {
      nodeDomain: string;
      nodeId: number;
      nodeName: string;
    };
  };
}

export interface NodesModelType {
  namespace: 'nodes';
  state: WholeReadonly<NodesModelState>;
  effects: {
    // initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
    fetchNodes: (action: FetchNodesAction, effects: EffectsCommandMap) => void;
    onAdd_Node: (action: OnAdd_Node_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<NodesModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: Omit<NodesModelState, 'list'> = {};

const Model: NodesModelType = {
  namespace: 'nodes',
  state: {
    list: [],
    ...initStates,
  },
  effects: {
    // * initModelStates({}: InitModelStatesAction, { put }: EffectsCommandMap) {
    //   yield put<ChangeAction>({
    //     type: 'change',
    //     payload: initStates,
    //   });
    // },
    * fetchNodes({}: FetchNodesAction, { call, put }: EffectsCommandMap) {
      const params: Parameters<typeof FServiceAPI.Node.nodes>[0] = {
        limit: FUtil.Predefined.pageSize,
      };
      const { data } = yield call(FServiceAPI.Node.nodes, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          list: (data.dataList as any[]).map<NodesModelState['list'][number]>((dl: any, i: number) => {
            return {
              nodeDomain: dl.nodeDomain,
              nodeId: dl.nodeId,
              nodeName: dl.nodeName,
            };
          }),
        },
      });
    },
    * onAdd_Node({ payload }: OnAdd_Node_Action, { select, put }: EffectsCommandMap) {
      const { nodes }: ConnectState = yield select(({ nodes }: ConnectState) => ({
        nodes,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          list: [
            ...nodes.list,
            payload.value,
          ],
        },
      });
    },
  },
  reducers: {
    change(state, { payload }) {
      // console.log(payload, '98023j');
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch }: SubscriptionAPI) {
      if (FUtil.Tool.getUserIDByCookies() !== -1) {
        dispatch<FetchNodesAction>({
          type: 'fetchNodes',
        });
      }
    },
  },
};

export default Model;
