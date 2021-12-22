import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import fConfirmModal from '@/components/fConfirmModal';
import FUtil1 from '@/utils';
import { ConnectState } from '@/models/connect';

export interface UserModelState {
  info: null | {
    userId: number;
    username: string;
    nickname: string;
    email: string;
    tokenSn: string;
    mobile: string;
    userRole: number;
    createDate: string;
    updateDate: string;
    headImage: string;
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
      const { data } = yield call(FServiceAPI.User.currentUserInfo);
      // console.log(data, 'data2q3e@@!!@@#!@#!@#@');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          info: data,
        },
      });
    },
    * onVisibilityChange({ payload }: OnVisibilityChangeAction, { select }: EffectsCommandMap) {
      const { user }: ConnectState = yield select(({ user }: ConnectState) => ({
        user,
      }));
      if (!payload.hidden && user.info?.userId !== FUtil.Tool.getUserIDByCookies()) {
        fConfirmModal({
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
    setup({ dispatch }) {
      dispatch<FetchUserInfoAction>({
        type: 'fetchUserInfo',
      });
      // console.log('!@#$!@#$!@#$@#$');
    },
    checkUser({ dispatch }) {
      window.document.addEventListener('visibilitychange', function() {
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
