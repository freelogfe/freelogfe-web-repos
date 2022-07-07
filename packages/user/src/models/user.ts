import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
import { ConnectState } from '@/models/connect';
import fConfirmModal from '@/components/fConfirmModal';
// import FUtil1 from '@/utils';

export type UserModelState = WholeReadonly<{
  userInfo: null | {
    createDate: string;
    email: string;
    headImage: string;
    mobile: string;
    status: number;
    tokenSn: string;
    userDetail: {
      sex: 0 | 1 | 2;
      birthday: string;
      occupation: string;
      areaCode: string;
    };
    userId: number;
    userType: 0 | 1;
    username: string;
  };
}>;

export interface ChangeAction extends AnyAction {
  type: 'change' | 'user/change';
  payload: Partial<UserModelState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'initModelStates';
}

export interface FetchInfoAction extends AnyAction {
  type: 'user/fetchInfo' | 'fetchInfo';
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
      if (!FUtil.Tool.getUserIDByCookies()) {
        return;
      }
      const { data } = yield call(FServiceAPI.User.currentUserInfo);
      // console.log(data, '!@#$!@#$@#$@#$');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          userInfo: data,
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
        && window.location.pathname !== FUtil.LinkTo.logon()
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
          message: FI18n.i18nNext.t('msg_account_switched'),
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
    setup({ dispatch }: SubscriptionAPI) {
      // dispatch<FetchInfoAction>({
      //   type: 'fetchInfo',
      // });
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
