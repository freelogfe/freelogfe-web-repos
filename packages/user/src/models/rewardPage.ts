import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';

export interface RewardPageModelState {
  cashAmount: number;
  records: {
    date: string;
    time: string;
    digest: string;
    transactionAmount: number;
    afterBalance: number;
  }[];
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<RewardPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'rewardPage/onMountPage';
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'rewardPage/onUnmountPage';
}

interface RewardPageModelType {
  namespace: 'rewardPage';
  state: RewardPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<RewardPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: RewardPageModelState = {
  cashAmount: 0,
  records: [],
};

const Model: RewardPageModelType = {
  namespace: 'rewardPage',
  state: initStates,
  effects: {
    * onMountPage({}: OnMountPageAction, { call, put }: EffectsCommandMap) {
      const params: Parameters<typeof FServiceAPI.Activity.getCoinAccount>[0] = {
        type: 1,
      };
      const { data: data_account } = yield call(FServiceAPI.Activity.getCoinAccount, params);
      console.log(data_account, 'data_account09iojewflksdjlk');

      const params1: Parameters<typeof FServiceAPI.Activity.getCoinAccountRecords>[0] = {
        limit: 100,
        coinAccountType: 1,
      };

      const { data: data_records } = yield call(FServiceAPI.Activity.getCoinAccountRecords, params1);
      console.log(data_records, 'data_records3209osjdflksdjfl');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          cashAmount: data_account.balance,
          records: data_records.dataList.map((dr: any) => {
            const dataAndTime: string[] = FUtil.Format.formatDateTime(dr.createTime, true).split(' ');
            console.log(dataAndTime, '9i8ojklwefsdjlfkjldataAndTime');
            return {
              key: dr.id,
              date: dataAndTime[0],
              time: dataAndTime[1],
              digest: dr.extra,
              transactionAmount: dr.changedAmount,
              afterBalance: dr.afterBalance,
            };
          }),
        },
      });
    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
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
