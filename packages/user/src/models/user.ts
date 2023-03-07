import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { FUtil, FI18n } from '@freelog/tools-lib';
import { ConnectState } from '@/models/connect';
import fConfirmModal from '@/components/fConfirmModal';
import userPermission from '@/permissions/UserPermission';

export interface UserModelState {
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
}

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
    // checkUser: Subscription;
    checkUser: Subscription;
    checkUserPermission: Subscription;
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
      const data: {
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
      } = yield call(userPermission.getUserInfo);
      // console.log(data, 'data2q3e@@!!@@#!@#!@#@');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          userInfo: data ? {
            ...data,
            headImage: FUtil.Tool.getAvatarUrl(),
          } : null,
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

    },
    checkUser({ dispatch }) {
      window.document.addEventListener('visibilitychange', () => {
        userPermission.check()
          .then((code) => {
            if (code === 'ERR_SWITCHED_USER' && !document.hidden) {
              co(FI18n.i18nNext.t('msg_account_switched'));
            }

            // if (code === 'ERR_NOT_LOGIN' && !document.hidden) {
            //   co('用户已登出');
            // }
          });
      });
    },
    checkUserPermission({ dispatch, history }) {
      // console.log(history, 'history09i3o2lskdfjlaskdjflsdkfj;l');
      history.listen(() => {
        // console.log(listener, 'listener098phijnoweklf');
        userPermission.checkUrl(history.location.pathname)
          .then(({ code, goToUrl }) => {
            // console.log(code, goToUrl, '********(8998989');
            // if (code === 'ERR_NOT_ALPHA_TEST' && !!goToUrl) {
            //   router.replace(goToUrl);
            // }
            if (code === 'ERR_FREEZE' && !!goToUrl) {
              history.replace(goToUrl);
            }
          });
      });
    },
  },
};

export default Model;

function co(message: string) {
  fConfirmModal({
    afterClose() {
      co(message);
    },
    onOk() {
      window.location.reload();
    },
    cancelButtonProps: {
      style: {
        display: 'none',
      },
    },
    message: message,
  });
}
