import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {FApiServer} from "@/services";
import {ConnectState} from "@/models/connect";
import FUtil from "@/utils";
import {successMessage} from '@/pages/logged/wallet';
import Cookies from 'js-cookie'

export type WalletPageModelState = WholeReadonly<{
  accountStatus: -1 | 0 | 1 | 2; // 0:未激活 1:正常 2:冻结

  accountId: string;
  accountBalance: number;
  transactionRecord: {
    serialNo: string;
    date: string;
    time: string;
    digest: string;
    reciprocalAccountId: string;
    reciprocalAccountName: string;
    reciprocalAccountType: string;
    transactionAmount: string;
    afterBalance: string;
    status: 1 | 2 | 3 | 4; // 1:交易确认中 2:交易成功 3:交易取消 4:交易失败
  }[];

  activatingAccount: boolean;
  activatingAccountMobile: string;
  activatingAccountEmail: string;
  activatingAccountType: 'mobile' | 'email';
  activatingAccountPasswordOne: string;
  activatingAccountPasswordOneError: string;
  activatingAccountPasswordTwo: string;
  activatingAccountPasswordTwoError: string;

  changingPassword: boolean;
}>;

export interface ChangeAction extends AnyAction {
  type: 'change' | 'walletPage/change';
  payload: Partial<WalletPageModelState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'initModelStates';
}

export interface FetchAccountInfoAction extends AnyAction {
  type: 'walletPage/fetchAccountInfo';
}

export interface ActiveAccountAction extends AnyAction {
  type: 'walletPage/activeAccount';
}

interface WalletPageModelType {
  namespace: 'walletPage';
  state: WalletPageModelState;
  effects: {
    fetchAccountInfo: (action: FetchAccountInfoAction, effects: EffectsCommandMap) => void;
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
    activeAccount: (action: ActiveAccountAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<WalletPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: WalletPageModelState = {
  accountStatus: -1,
  accountId: '',
  accountBalance: 0,
  transactionRecord: [],

  activatingAccount: false,
  activatingAccountMobile: '',
  activatingAccountEmail: '',
  activatingAccountType: 'mobile',
  activatingAccountPasswordOne: '',
  activatingAccountPasswordOneError: '',
  activatingAccountPasswordTwo: '',
  activatingAccountPasswordTwoError: '',

  changingPassword: false,
};

const Model: WalletPageModelType = {
  namespace: 'walletPage',
  state: initStates,
  effects: {
    * fetchAccountInfo({}: FetchAccountInfoAction, {call, select, put}: EffectsCommandMap) {
      const {user}: ConnectState = yield select(({user}: ConnectState) => ({
        user,
      }));

      const {data: data1} = yield call(FApiServer.User.currentUserInfo);
      // console.log(user, 'user!@#$!@#$@#!$');
      const params: Parameters<typeof FApiServer.Transaction.individualAccounts>[0] = {
        userId: data1.userId,
      };
      const {data} = yield call(FApiServer.Transaction.individualAccounts, params);
      // console.log(data, 'data@@!@#$@#$@#$');

      if (data.status === 0) {
        return yield put<ChangeAction>({
          type: 'change',
          payload: {
            accountStatus: data.status,
          },
        });
      }

      const params2: Parameters<typeof FApiServer.Transaction.details>[0] = {
        accountId: data.accountId,
        skip: 0,
        limit: 100,
      };

      const {data: data2} = yield call(FApiServer.Transaction.details, params2);

      // console.log(data2, 'data212342134234234');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          accountStatus: data.status,
          accountBalance: data.balance,
          transactionRecord: (data2.dataList as any[]).map((dl) => {
            const [date, time] = FUtil.Format.formatDateTime(dl.updateDate, true).split(' ');
            return {
              serialNo: dl.serialNo,
              date: date,
              time: time,
              digest: dl.digest,
              reciprocalAccountId: dl.reciprocalAccountId,
              reciprocalAccountName: dl.reciprocalAccountName,
              reciprocalAccountType: dl.reciprocalAccountType,
              transactionAmount: dl.transactionAmount,
              afterBalance: dl.afterBalance,
              status: dl.status,
            };
          })
        },
      });
    },
    * initModelStates({}: InitModelStatesAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * activeAccount({}: ActiveAccountAction, {put, call, select}: EffectsCommandMap) {
      const {walletPage}: ConnectState = yield select(({walletPage}: ConnectState) => ({
        walletPage,
      }));

      const params: Parameters<typeof FApiServer.Transaction.activateIndividualAccounts>[0] = {
        password: walletPage.activatingAccountPasswordOne,
      };

      const {data} = yield call(FApiServer.Transaction.activateIndividualAccounts, params);

      if (data) {
        successMessage();
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activatingAccount: false,
        },
      });
    },
  },
  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  subscriptions: {
    setup({}) {

    },
  }
};

export default Model;
