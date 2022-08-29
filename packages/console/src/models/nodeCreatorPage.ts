import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
import { ConnectState } from '@/models/connect';
import fMessage from '@/components/fMessage';
import { history } from '@@/core/history';

export interface NodeCreatorPageModelState {
  nodeName: string;
  nameVerify: 'init' | 'verifying' | 'verified';
  nameError: string;

  nodeDomain: string;
  domainVerify: 'init' | 'verifying' | 'verified';
  domainError: string;
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
  domainVerify: 'init',
  domainError: '',

  nodeName: '',
  nameVerify: 'init',
  nameError: '',
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
          domainVerify: 'verified',
          domainError: '',
        },
      });
    },
    * onBlur_DomainInput({}: OnBlur_DomainInput_Action, { select, call, put }: EffectsCommandMap) {
      const { nodeCreatorPage }: ConnectState = yield select(({ nodeCreatorPage }: ConnectState) => ({
        nodeCreatorPage,
      }));

      let domainError: string = '';

      if (!FUtil.Regexp.NODE_DOMAIN.test(nodeCreatorPage.nodeDomain)) {
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
          nodeDomain: nodeCreatorPage.nodeDomain,
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
          nameError: '',
        },
      });


    },
    * onBlur_NameInput(action: OnBlur_NameInput_Action, { select, call, put }: EffectsCommandMap) {
      const { nodeCreatorPage }: ConnectState = yield select(({ nodeCreatorPage }: ConnectState) => ({
        nodeCreatorPage,
      }));

      let nameError: string = '';

      if (!FUtil.Regexp.NODE_NAME.test(nodeCreatorPage.nodeName)) {
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
          nodeName: nodeCreatorPage.nodeName,
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
      const { nodeCreatorPage }: ConnectState = yield select(({ nodeCreatorPage }: ConnectState) => ({
        nodeCreatorPage,
      }));

      if (nodeCreatorPage.domainError || nodeCreatorPage.nameError) {
        return;
      }

      const params: Parameters<typeof FServiceAPI.Node.create>[0] = {
        nodeDomain: nodeCreatorPage.nodeDomain.trim(),
        nodeName: nodeCreatorPage.nodeName.trim(),
      };

      const { data, ret, errCode, msg } = yield call(FServiceAPI.Node.create, params);

      if (ret !== 0 || errCode !== 0 || !data) {
        fMessage(msg, 'error');
        return;
      }

      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {
      //     list: [
      //       ...nodes.list,
      //       // {
      //       //   nodeDomain: data.nodeDomain,
      //       //   nodeId: data.nodeId,
      //       //   nodeName: data.nodeName,
      //       // },
      //     ],
      //   },
      // });


      // console.log(data, 'data210934uoifa');

      // yield put<FetchNodesAction>({
      //   type: 'fetchNodes',
      // });

      // router.push(FUtil.LinkTo.nodeManagement({nodeID: data.nodeId}));
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
