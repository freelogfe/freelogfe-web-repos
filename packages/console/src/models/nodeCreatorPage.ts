import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
import { ConnectState } from '@/models/connect';
import fMessage from '@/components/fMessage';
import { history } from '@@/core/history';
import { OnAdd_Node_Action } from '@/models/nodes';

export interface NodeCreatorPageModelState {
  nodeDomain: string;
  nodeDomainState: 'init' | 'input' | 'verifying' | 'verified';
  nodeDomainError: string;

  nodeName: string;
  nodeNameState: 'init' | 'input' | 'verifying' | 'verified';
  nodeNameError: string;
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<NodeCreatorPageModelState>;
}

export interface OnMount_Page_Action extends AnyAction {
  type: 'nodeCreatorPage/onMount_Page';
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'nodeCreatorPage/onUnmount_Page';
}

export interface OnChange_DomainInput_Action extends AnyAction {
  type: 'nodeCreatorPage/onChange_DomainInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_DomainInput_Action extends AnyAction {
  type: 'nodeCreatorPage/onBlur_DomainInput';
}

export interface OnChange_NameInput_Action extends AnyAction {
  type: 'nodeCreatorPage/onChange_NameInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_NameInput_Action extends AnyAction {
  type: 'nodeCreatorPage/onBlur_NameInput';
}

export interface OnClick_CreateBtn_Action extends AnyAction {
  type: 'nodeCreatorPage/onClick_CreateBtn';
}

interface NodeCreatorPageModelType {
  namespace: 'nodeCreatorPage';
  state: NodeCreatorPageModelState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    onChange_DomainInput: (action: OnChange_DomainInput_Action, effects: EffectsCommandMap) => void;
    onBlur_DomainInput: (action: OnBlur_DomainInput_Action, effects: EffectsCommandMap) => void;
    onChange_NameInput: (action: OnChange_NameInput_Action, effects: EffectsCommandMap) => void;
    onBlur_NameInput: (action: OnBlur_NameInput_Action, effects: EffectsCommandMap) => void;
    onClick_CreateBtn: (action: OnClick_CreateBtn_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<NodeCreatorPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: NodeCreatorPageModelState = {
  nodeDomain: '',
  nodeDomainState: 'init',
  nodeDomainError: '',

  nodeName: '',
  nodeNameState: 'init',
  nodeNameError: '',
};

const Model: NodeCreatorPageModelType = {
  namespace: 'nodeCreatorPage',
  state: initStates,
  effects: {
    * onMount_Page({}: OnMount_Page_Action, { call }: EffectsCommandMap) {
      const { data } = yield call(FServiceAPI.User.currentUserInfo);
    },
    * onUnmount_Page({}: OnUnmount_Page_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * onChange_DomainInput({ payload }: OnChange_DomainInput_Action, { call, select, put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeDomain: payload.value.trim().toLocaleLowerCase(),
          nodeDomainState: 'input',
          nodeDomainError: '',
        },
      });
    },
    * onBlur_DomainInput({}: OnBlur_DomainInput_Action, { select, call, put }: EffectsCommandMap) {
      const { nodeCreatorPage }: ConnectState = yield select(({ nodeCreatorPage }: ConnectState) => ({
        nodeCreatorPage,
      }));

      let nodeDomainError: string = '';

      if (!FUtil.Regexp.NODE_DOMAIN.test(nodeCreatorPage.nodeDomain)) {
        nodeDomainError = '只能包括小写字母、数字和短横线（-）。\n' +
          '必须以小写字母或者数字开头和结尾。\n' +
          '长度必须在 4-24 字符之间。';
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeDomainState: 'verifying',
        },
      });

      if (!nodeDomainError) {
        const params1: Parameters<typeof FServiceAPI.Node.details>[0] = {
          nodeDomain: nodeCreatorPage.nodeDomain,
        };
        const { data: data1 } = yield call(FServiceAPI.Node.details, params1);
        if (data1) {
          nodeDomainError = '该节点地址已经存在或已经被其它用户使用';
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeDomainState: 'verified',
          nodeDomainError,
        },
      });
    },
    * onChange_NameInput({ payload }: OnChange_NameInput_Action, { select, call, put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeName: payload.value.trim(),
          nodeNameState: 'input',
          nodeNameError: '',
        },
      });

    },
    * onBlur_NameInput(action: OnBlur_NameInput_Action, { select, call, put }: EffectsCommandMap) {
      const { nodeCreatorPage }: ConnectState = yield select(({ nodeCreatorPage }: ConnectState) => ({
        nodeCreatorPage,
      }));

      let nodeNameError: string = '';

      if (!FUtil.Regexp.NODE_NAME.test(nodeCreatorPage.nodeName)) {
        // nameError = '长度必须在 1-100 字符之间。\n' +
        //   '不能以正斜线（/）或者反斜线（\\）开头。\n' +
        //   '开头和结尾的空格会自动删除。';
        nodeNameError = FI18n.i18nNext.t('naming_convention_node_name');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeNameState: 'verifying',
        },
      });

      if (!nodeNameError) {
        const params2: Parameters<typeof FServiceAPI.Node.details>[0] = {
          nodeName: nodeCreatorPage.nodeName,
        };
        const { data: data2 } = yield call(FServiceAPI.Node.details, params2);
        if (data2) {
          nodeNameError = '该节点名称已经存在或已经被其它用户使用';
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeNameState: 'verified',
          nodeNameError,
        },
      });
    },
    * onClick_CreateBtn({}: OnClick_CreateBtn_Action, { call, select, put }: EffectsCommandMap) {
      const { nodeCreatorPage }: ConnectState = yield select(({ nodeCreatorPage }: ConnectState) => ({
        nodeCreatorPage,
      }));

      if (nodeCreatorPage.nodeDomainError || nodeCreatorPage.nodeNameError) {
        return;
      }

      const params: Parameters<typeof FServiceAPI.Node.create>[0] = {
        nodeDomain: nodeCreatorPage.nodeDomain.trim(),
        nodeName: nodeCreatorPage.nodeName.trim(),
      };

      const { data, ret, errCode, msg }: {
        data: {
          nodeDomain: string;
          nodeId: number;
          nodeName: string;
        };
        ret: number;
        errCode: number;
        msg: string;
      } = yield call(FServiceAPI.Node.create, params);

      if (ret !== 0 || errCode !== 0 || !data) {
        self._czc?.push(['_trackEvent', '创建节点页', '创建节点', '', 0]);
        fMessage(msg, 'error');
        return;
      }

      console.log(data, 'dataiosdjflksjdlfkjsdlkfjsldkjl');

      yield put<OnAdd_Node_Action>({
        type: 'nodes/onAdd_Node',
        payload: {
          value: {
            nodeDomain: data.nodeDomain,
            nodeId: data.nodeId,
            nodeName: data.nodeName,
          },
        },
      });

      self._czc?.push(['_trackEvent', '创建节点页', '创建节点', '', 1]);
      history.push(FUtil.LinkTo.nodeCreateSuccess({ nodeID: data.nodeId }));
    },
  },
  reducers: {
    change(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({}) {

    },
  },
};

export default Model;
