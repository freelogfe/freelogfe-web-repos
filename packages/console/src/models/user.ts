import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FI18n, FUtil } from '@freelog/tools-lib';
import fConfirmModal from '@/components/fConfirmModal';
import userPermission from '@/permissions/UserPermission';

export interface UserModelState {
  info: null | {
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
  // cookiesUserID: number;
  // switchedUserShow: boolean;
  // notLoginShow: boolean;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'user/change';
  payload: Partial<UserModelState>;
}

export interface FetchUserInfoAction extends AnyAction {
  type: 'user/fetchUserInfo' | 'fetchUserInfo';
}

export interface OnVisibilityChangeAction extends AnyAction {
  type: 'onVisibilityChange';
  payload: {
    hidden: boolean;
  };
}


export interface MarketModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchUserInfo: (action: FetchUserInfoAction, effects: EffectsCommandMap) => void;
    onVisibilityChange: (action: OnVisibilityChangeAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<UserModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
    checkUser: Subscription;
    checkUserPermission: Subscription;
  };
}

let switchedUserShow: boolean = false;
let notLoginShow: boolean = false;

const Model: MarketModelType = {
  namespace: 'user',
  state: {
    info: null,
    // cookiesUserID: -1,
    // switchedUserShow: false,
    // notLoginShow: false,
  },
  effects: {
    * fetchUserInfo({}: FetchUserInfoAction, { call, put }: EffectsCommandMap) {
      // console.log('!!!!!#423423423423');
      // userPermission.getUserInfo();
      // const promise = () => userPermission.getUserInfo();
      const data: UserModelState['info'] = yield call(userPermission.getUserInfo);
      // console.log(data, '#######@@@@@data2q3e@@!!@@#!@#!@#@');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          info: data ? {
            ...data,
            headImage: FUtil.Tool.getAvatarUrl(),
          } : null,
        },
      });
    },
    * onVisibilityChange({ payload }: OnVisibilityChangeAction, { select }: EffectsCommandMap) {
      // const { user }: ConnectState = yield select(({ user }: ConnectState) => ({
      //   user,
      // }));
      // if (FUtil.Tool.getUserIDByCookies() !== -1 && (!payload.hidden && user.info?.userId !== FUtil.Tool.getUserIDByCookies())) {
      //   co();
      // }

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
    setup({ dispatch }) {
      // if (FUtil.Tool.getUserIDByCookies() !== -1) {
      dispatch<FetchUserInfoAction>({
        type: 'fetchUserInfo',
      });
      // }

      // console.log('!@#$!@#$!@#$@#$');
    },
    checkUser({ dispatch }) {
      window.document.addEventListener('visibilitychange', () => {
        userPermission.check()
          .then((code) => {
            // console.log(code, '###3098usdoikfjsldkfjl lsjdflkjsdl');
            if (code === 'ERR_SWITCHED_USER' && !document.hidden && !switchedUserShow) {
              switchedUserShow = true;
              fConfirmModalFunc(FI18n.i18nNext.t('msg_account_switched'));
            }

            if (code === 'ERR_NOT_LOGIN' && !document.hidden && !notLoginShow) {
              notLoginShow = true;
              fConfirmModalFunc('用户已登出');
            }
          });
      });
    },
    checkUserPermission({ dispatch, history }) {
      // console.log(history, 'history09i3o2lskdfjlaskdjflsdkfj;l');
      history.listen((listener) => {
        // console.log(listener, 'listener098phijnoweklf');
        userPermission.checkUrl(history.location.pathname)
          .then(({ code, goToUrl }) => {
            if (code === 'ERR_NOT_ALPHA_TEST' && !!goToUrl) {
              history.replace(goToUrl);
            }
            if (code === 'ERR_FREEZE' && !!goToUrl) {
              window.location.replace(goToUrl);
            }
            if (code === 'ERR_NOT_LOGIN' && !!goToUrl) {
              window.location.replace(goToUrl);
            }
          });
      });

    },
  },
};

export default Model;

function fConfirmModalFunc(message: string) {
  fConfirmModal({
    afterClose() {
      fConfirmModalFunc(message);
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

