import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import fConfirmModal from '@/components/fConfirmModal';
import FUtil1 from '@/utils';
// import { ConnectState } from '@/models/connect';
import userPermission from '@/permissions/UserPermission';
// import routes from '../../config/routes';
import { router } from 'umi';

// import { PushRouterAction } from '@/models/global';

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

const Model: MarketModelType = {
  namespace: 'user',
  state: {
    info: null,
    // cookiesUserID: -1,
  },
  effects: {
    * fetchUserInfo({}: FetchUserInfoAction, { call, put }: EffectsCommandMap) {
      // console.log('!!!!!#423423423423');
      // userPermission.getUserInfo();
      const promise = () => userPermission.getUserInfo();
      const data = yield call(promise);
      // console.log(data, 'data2q3e@@!!@@#!@#!@#@');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          info: data,
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
      window.document.addEventListener('visibilitychange', function() {
        // console.log(document.hidden, 'document.hidden 9032rweopfdslj.,');
        // Modify behavior...
        // dispatch<OnVisibilityChangeAction>({
        //   type: 'onVisibilityChange',
        //   payload: {
        //     hidden: document.hidden,
        //   },
        // });
        userPermission.check()
          .then((code) => {
            if (code === 'ERR_SWITCHED_USER' && !document.hidden) {
              co();
            }
          });
      });
      // window.addEventListener('pagehide', event => {
      //   if (event.persisted) {
      //     /* the page isn't being discarded, so it can be reused later */
      //     console.log(event.persisted, 'event.persiste d0923jlsdijfldskjl');
      //   }
      // }, false);
    },
    checkUserPermission({ dispatch, history }) {
      // console.log(history, 'history09i3o2lskdfjlaskdjflsdkfj;l');
      history.listen((listener) => {
        // console.log(listener, 'listener098phijnoweklf');
        userPermission.checkUrl(history.location.pathname)
          .then(({ code, goToUrl }) => {
            if (code === 'ERR_NOT_ALPHA_TEST' && !!goToUrl) {
              router.replace(goToUrl);
            }
          });
      });

    },
  },
};

export default Model;

function co() {
  fConfirmModal({
    afterClose() {
      co();
    },
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

