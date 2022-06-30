import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { ConnectState } from '@/models/connect';
import { router } from 'umi';
// import FUtil1 from '@/utils';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { nodeCreateSuccess } from '@freelog/tools-lib/dist/utils/linkTo';
import fMessage from '@/components/fMessage';
import { FI18n } from '@freelog/tools-lib';

export type NodesModelState = WholeReadonly<{
  list: {
    nodeDomain: string;
    nodeId: number;
    nodeName: string;
  }[];

  nodeName: string;
  nameVerify: 'init' | 'verifying' | 'verified';
  nameError: string;

  nodeDomain: string;
  domainVerify: 'init' | 'verifying' | 'verified';
  domainError: string;
}>;

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

export interface OnChange_DomainInput_Action extends AnyAction {
  type: 'nodes/onChange_DomainInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_DomainInput_Action extends AnyAction {
  type: 'nodes/onBlur_DomainInput';
}

export interface OnChange_NameInput_Action extends AnyAction {
  type: 'nodes/onChange_NameInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_NameInput_Action extends AnyAction {
  type: 'nodes/onBlur_NameInput';
}

export interface OnClick_CreateBtn_Action extends AnyAction {
  type: 'nodes/onClick_CreateBtn';
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
    onChange_DomainInput: (action: OnChange_DomainInput_Action, effects: EffectsCommandMap) => void;
    onBlur_DomainInput: (action: OnBlur_DomainInput_Action, effects: EffectsCommandMap) => void;
    onChange_NameInput: (action: OnChange_NameInput_Action, effects: EffectsCommandMap) => void;
    onBlur_NameInput: (action: OnBlur_NameInput_Action, effects: EffectsCommandMap) => void;
    onClick_CreateBtn: (action: OnClick_CreateBtn_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<NodesModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: Omit<NodesModelState, 'list'> = {
  nodeDomain: '',
  domainVerify: 'init',
  domainError: '',

  nodeName: '',
  nameVerify: 'init',
  nameError: '',
};

const Model: NodesModelType = {
  namespace: 'nodes',
  state: {
    list: [],
    ...initStates,
  },
  effects: {
    * initModelStates({}: InitModelStatesAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
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

    * onChange_DomainInput({ payload }: OnChange_DomainInput_Action, { call, select, put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeDomain: payload.value.trim().toLocaleLowerCase(),
          domainVerify: 'verified',
        },
      });
    },
    * onBlur_DomainInput({}: OnBlur_DomainInput_Action, { select, call, put }: EffectsCommandMap) {
      const { nodes }: ConnectState = yield select(({ nodes }: ConnectState) => ({
        nodes,
      }));

      let domainError: string = '';

      if (!FUtil.Regexp.NODE_DOMAIN.test(nodes.nodeDomain)) {
        domainError = '只能包括小写字母、数字和短横线（-）。\n' +
          '必须以小写字母或者数字开头和结尾。\n' +
          '长度必须在 4-24 字符之间。';
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          domainVerify: 'verifying',
        },
      });

      if (!domainError) {
        const params1: Parameters<typeof FServiceAPI.Node.details>[0] = {
          nodeDomain: nodes.nodeDomain,
        };
        const { data: data1 } = yield call(FServiceAPI.Node.details, params1);
        if (data1) {
          domainError = '该节点地址已经存在或已经被其它用户使用';
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          domainVerify: 'verified',
          domainError,
        },
      });
    },
    * onChange_NameInput({ payload }: OnChange_NameInput_Action, { select, call, put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeName: payload.value.trim().toLowerCase(),
          // nameVerify: 1,
        },
      });


    },
    * onBlur_NameInput(action: OnBlur_NameInput_Action, { select, call, put }: EffectsCommandMap) {
      const { nodes }: ConnectState = yield select(({ nodes }: ConnectState) => ({
        nodes,
      }));

      let nameError: string = '';

      if (!FUtil.Regexp.NODE_NAME.test(nodes.nodeName)) {
        // nameError = '长度必须在 1-100 字符之间。\n' +
        //   '不能以正斜线（/）或者反斜线（\\）开头。\n' +
        //   '开头和结尾的空格会自动删除。';
        nameError = FI18n.i18nNext.t('naming_convention_node_name');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nameVerify: 'verifying',
        },
      });

      if (!nameError) {
        const params2: Parameters<typeof FServiceAPI.Node.details>[0] = {
          nodeName: nodes.nodeName,
        };
        const { data: data2 } = yield call(FServiceAPI.Node.details, params2);
        if (data2) {
          nameError = '该节点名称已经存在或已经被其它用户使用';
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nameVerify: 'verified',
          nameError,
        },
      });
    },
    * onClick_CreateBtn({}: OnClick_CreateBtn_Action, { call, select, put }: EffectsCommandMap) {
      console.log('OnClick_CreateBtn_Action');
      const { nodes }: ConnectState = yield select(({ nodes }: ConnectState) => ({
        nodes,
      }));

      if (nodes.domainError || nodes.nameError) {
        return;
      }

      const params: Parameters<typeof FServiceAPI.Node.create>[0] = {
        nodeDomain: nodes.nodeDomain.trim(),
        nodeName: nodes.nodeName.trim(),
      };

      const { data, ret, errCode, msg } = yield call(FServiceAPI.Node.create, params);

      if (ret !== 0 || errCode !== 0 || !data) {
        fMessage(msg, 'error');
        return;
      }

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
      router.push(FUtil.LinkTo.nodeCreateSuccess({ nodeID: data.nodeId }));
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
