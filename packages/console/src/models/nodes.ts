import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {create, CreateParamsType, nodeDetail, NodeDetailParamsType2, nodes, NodesParamsType} from "@/services/nodes";
import {ConnectState} from '@/models/connect';
import {router} from 'umi';

export type NodesModelState = WholeReadonly<{
  list: {
    nodeDomain: string;
    nodeId: number;
    nodeName: string;
  }[];

  nodeName: string;
  nameVerify: 0 | 1 | 2;
  nameError: string;

  nodeDomain: string;
  domainVerify: 0 | 1 | 2;
  domainError: string;
}>;

export interface ChangeAction extends AnyAction {
  type: 'nodes/change' | 'change';
  payload: Partial<NodesModelState>;
}

interface FetchNodesAction extends AnyAction {
  type: 'fetchNodes';
}

export interface CreateNodeAction extends AnyAction {
  type: 'nodes/createNode';
}

export interface OnChangeNameAction extends AnyAction {
  type: 'nodes/onChangeName';
  payload: string;
}

export interface OnChangeDomainAction extends AnyAction {
  type: 'nodes/onChangeDomain';
  payload: string;
}

export interface InitModelStateAction extends AnyAction {
  type: 'nodes/initModelState';
  // payload: string;
}

export interface NodesModelType {
  namespace: 'nodes';
  state: WholeReadonly<NodesModelState>;
  effects: {
    initModelState: (action: InitModelStateAction, effects: EffectsCommandMap) => void;
    fetchNodes: (action: FetchNodesAction, effects: EffectsCommandMap) => void;
    createNode: (action: CreateNodeAction, effects: EffectsCommandMap) => void;
    onChangeName: (action: OnChangeNameAction, effects: EffectsCommandMap) => void;
    onChangeDomain: (action: OnChangeDomainAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<NodesModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: Omit<NodesModelState, 'list'> = {
  nodeName: '',
  nameVerify: 0,
  nameError: '',

  nodeDomain: '',
  domainVerify: 0,
  domainError: '',
};

const Model: NodesModelType = {
  namespace: 'nodes',
  state: {
    list: [],
    ...initStates,
  },
  effects: {
    * initModelState({}: InitModelStateAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * fetchNodes({}: FetchNodesAction, {call, put}: EffectsCommandMap) {
      const params: NodesParamsType = {
        limit: 10000,
      };
      const {data} = yield call(nodes, params);
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
    * createNode({}: CreateNodeAction, {call, select, put}: EffectsCommandMap) {
      const {nodes}: ConnectState = yield select(({nodes}: ConnectState) => ({
        nodes,
      }));

      if (nodes.domainError || nodes.nameError) {
        return;
      }

      const params: CreateParamsType = {
        nodeDomain: nodes.nodeDomain,
        nodeName: nodes.nodeName,
      };

      const {data} = yield call(create, params);

      router.push('/node/' + data.nodeId);
    },
    * onChangeName({payload}: OnChangeNameAction, {select, call, put}: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeName: payload,
          nameVerify: 1,
        },
      });

      const {nodes}: ConnectState = yield select(({nodes}: ConnectState) => ({
        nodes,
      }));

      let nameError: string = '';

      if (!/^[\u4E00-\u9FA5|a-zA-Z0-9]{4,20}$/.test(nodes.nodeName)) {
        nameError = '长度必须在 1-100 字符之间。\n' +
          '不能以正斜线（/）或者反斜线（\\）开头。\n' +
          '开头和结尾的空格会自动删除。';
      }

      if (!nameError) {
        const params2: NodeDetailParamsType2 = {
          nodeName: nodes.nodeName,
        };
        const {data: data2} = yield call(nodeDetail, params2);
        if (data2) {
          nameError = '该节点名称已经存在或已经被其它用户使用';
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nameVerify: 2,
          nameError,
        },
      });
    },
    * onChangeDomain({payload}: OnChangeDomainAction, {call, select, put}: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeDomain: payload,
          domainVerify: 1,
        },
      });

      const {nodes}: ConnectState = yield select(({nodes}: ConnectState) => ({
        nodes,
      }));

      let domainError: string = '';

      if (!/^(?!-)[a-z0-9-]{4,24}(?<!-)$/.test(nodes.nodeDomain)) {
        domainError = '只能包括小写字母、数字和短横线（-）。\n' +
          '必须以小写字母或者数字开头和结尾。\n' +
          '长度必须在 4-24 字符之间。';
      }

      if (!domainError) {
        const params1: NodeDetailParamsType2 = {
          nodeDomain: nodes.nodeDomain,
        };
        const {data: data1} = yield call(nodeDetail, params1);
        if (data1) {
          domainError = '该节点地址已经存在或已经被其它用户使用';
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          domainVerify: 2,
          domainError,
        },
      });
    },
  },
  reducers: {
    change(state, {payload}) {
      // console.log(payload, '98023j');
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
