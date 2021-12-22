import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { ConnectState } from '@/models/connect';
import fConfirmModal from '@/components/fConfirmModal';
import FUtil1 from '@/utils';

export type UserModelState = WholeReadonly<{
  userInfo: null | {
    userId: number;
    headImage: string;
    username: string;
    mobile: string;
    email: string;
  };
}>;

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<UserModelState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'initModelStates';
}

export interface FetchInfoAction extends AnyAction {
  type: 'user/fetchInfo';
}

export interface OnVisibilityChangeAction extends AnyAction {
  type: 'onVisibilityChange';
  payload: {
    hidden: boolean;
  };
}


interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
    onVisibilityChange: (action: OnVisibilityChangeAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<UserModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
    checkUser: Subscription;
  };
}

const initStates: UserModelState = {
  userInfo: null,
};

const Model: UserModelType = {
  namespace: 'user',
  state: initStates,
  effects: {
    * fetchInfo({}: FetchInfoAction, { call, put }: EffectsCommandMap) {
      const { data } = yield call(FServiceAPI.User.currentUserInfo);
      // console.log(data, '!@#$!@#$@#$@#$');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          userInfo: {
            userId: data.userId,
            headImage: data.headImage,
            username: data.username,
            mobile: data.mobile,
            email: data.email,
          },
        },
      });
    },
    * initModelStates({}: InitModelStatesAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * onVisibilityChange({ payload }: OnVisibilityChangeAction, { select }: EffectsCommandMap) {
      const { user }: ConnectState = yield select(({ user }: ConnectState) => ({
        user,
      }));
      if (!payload.hidden
        && user.userInfo?.userId !== FUtil.Tool.getUserIDByCookies()
        && window.location.pathname !== FUtil.LinkTo.login()
        && window.location.pathname !== FUtil.LinkTo.retrieveUserPassword()) {
        fConfirmModal({
          visible: true,
          onOk() {
            window.location.reload();
          },
          cancelButtonProps: {
            style: {
              display: 'none',
            },
          },
          message: FUtil1.I18n.message('msg_account_switched'),
        });
      }

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
    setup({}: SubscriptionAPI) {

    },
    checkUser({ dispatch }: SubscriptionAPI) {
      window.document.addEventListener('visibilitychange', () => {
        // console.log(document.hidden, 'document.hidden 9032rweopfdslj.,');
        // Modify behavior...
        dispatch<OnVisibilityChangeAction>({
          type: 'onVisibilityChange',
          payload: {
            hidden: document.hidden,
          },
        });
      });
      window.addEventListener('pagehide', event => {
        if (event.persisted) {
          /* the page isn't being discarded, so it can be reused later */
          console.log(event.persisted, 'event.persiste d0923jlsdijfldskjl');
        }
      }, false);
    },
  },
};

export default Model;
