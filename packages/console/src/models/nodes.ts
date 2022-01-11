import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {ConnectState} from '@/models/connect';
import {router} from 'umi';
import FUtil1 from "@/utils";
import {FUtil, FServiceAPI} from '@freelog/tools-lib';
import { nodeCreateSuccess } from '@freelog/tools-lib/dist/utils/linkTo';

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

export interface InitModelStatesAction extends AnyAction {
  type: 'nodes/initModelStates';
}

export interface NodesModelType {
  namespace: 'nodes';
  state: WholeReadonly<NodesModelState>;
  effects: {
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
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
    * initModelStates({}: InitModelStatesAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * fetchNodes({}: FetchNodesAction, {call, put}: EffectsCommandMap) {
      const params: Parameters<typeof FServiceAPI.Node.nodes>[0] = {
        limit: FUtil.Predefined.pageSize,
      };
      const {data} = yield call(FServiceAPI.Node.nodes, params);
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

      const params: Parameters<typeof FServiceAPI.Node.create>[0] = {
        nodeDomain: nodes.nodeDomain.trim(),
        nodeName: nodes.nodeName.trim(),
      };

      const {data} = yield call(FServiceAPI.Node.create, params);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          list: [
            ...nodes.list,
            {
              nodeDomain: data.nodeDomain,
              nodeId: data.nodeId,
              nodeName: data.nodeName,
            },
          ],
        },
      });


      // console.log(data, 'data210934uoifa');

      yield put<FetchNodesAction>({
        type: 'fetchNodes',
      });

      // router.push(FUtil.LinkTo.nodeManagement({nodeID: data.nodeId}));
      router.push(FUtil.LinkTo.nodeCreateSuccess({nodeID: data.nodeId}));

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

      if (!FUtil.Regexp.NODE_NAME.test(payload.trim())) {
        // nameError = '长度必须在 1-100 字符之间。\n' +
        //   '不能以正斜线（/）或者反斜线（\\）开头。\n' +
        //   '开头和结尾的空格会自动删除。';
        nameError = FUtil1.I18n.message('naming_convention_node_name');
      }

      if (!nameError) {
        const params2: Parameters<typeof FServiceAPI.Node.details>[0] = {
          nodeName: payload.trim(),
        };
        const {data: data2} = yield call(FServiceAPI.Node.details, params2);
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

      if (!FUtil.Regexp.NODE_DOMAIN.test(payload.trim())) {
        domainError = '只能包括小写字母、数字和短横线（-）。\n' +
          '必须以小写字母或者数字开头和结尾。\n' +
          '长度必须在 4-24 字符之间。';
      }

      if (!domainError) {
        const params1: Parameters<typeof FServiceAPI.Node.details>[0] = {
          nodeDomain: payload.trim(),
        };
        const {data: data1} = yield call(FServiceAPI.Node.details, params1);
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
