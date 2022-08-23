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

  showModal: '' | 'wechat' | 'verify' | 'withdraw';
  wechatModal_task: '' | 'binding' | 'follow';
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

export interface OnClick_WithdrawBtn_Action extends AnyAction {
  type: 'rewardPage/onClick_WithdrawBtn';
}

export interface OnClose_WechatModal_Action extends AnyAction {
  type: 'rewardPage/onClose_WechatModal';
}

export interface OnClick_WechatModal_BindingBtn_Action extends AnyAction {
  type: 'rewardPage/onClick_WechatModal_BindingBtn';
}

export interface OnClick_WechatModal_RefreshBtn_Action extends AnyAction {
  type: 'rewardPage/onClick_WechatModal_RefreshBtn';
}

interface RewardPageModelType {
  namespace: 'rewardPage';
  state: RewardPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
    onClick_WithdrawBtn: (action: OnClick_WithdrawBtn_Action, effects: EffectsCommandMap) => void;
    onClose_WechatModal: (action: OnClose_WechatModal_Action, effects: EffectsCommandMap) => void;
    onClick_WechatModal_BindingBtn: (action: OnClick_WechatModal_BindingBtn_Action, effects: EffectsCommandMap) => void;
    onClick_WechatModal_RefreshBtn: (action: OnClick_WechatModal_RefreshBtn_Action, effects: EffectsCommandMap) => void;
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

  showModal: '',
  wechatModal_task: '',
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
      // console.log(data_account, 'data_account09iojewflksdjlk');

      const params1: Parameters<typeof FServiceAPI.Activity.getCoinAccountRecords>[0] = {
        limit: 100,
        coinAccountType: 1,
      };

      const { data: data_records } = yield call(FServiceAPI.Activity.getCoinAccountRecords, params1);
      // console.log(data_records, 'data_records3209osjdflksdjfl');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          cashAmount: data_account.balance,
          records: data_records.dataList.map((dr: any) => {
            const dataAndTime: string[] = FUtil.Format.formatDateTime(dr.createTime, true).split(' ');
            // console.log(dataAndTime, '9i8ojklwefsdjlfkjldataAndTime');
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
    * onClick_WithdrawBtn({}: OnClick_WithdrawBtn_Action, { call, put }: EffectsCommandMap) {

      const params: Parameters<typeof FServiceAPI.User.thirdPartyList>[0] = {};
      const { data: data_thirdList } = yield call(FServiceAPI.User.thirdPartyList, params);

      let task: '' | 'binding' | 'follow' = '';

      if (!data_thirdList.some((dt: any) => {
        return dt.thirdPartyType === 'weChat';
      })) {
        task = 'binding';
      }

      if (task === '') {
        const params1: Parameters<typeof FServiceAPI.Activity.getWechatOfficialAccountInfo>[0] = {};
        const {
          ret,
          errCode,
          data: data_wechatInfo,
        } = yield call(FServiceAPI.Activity.getWechatOfficialAccountInfo, params);

        if (ret !== 0 || errCode !== 0 || !data_wechatInfo) {
          task = 'follow';
        }
      }

      if (task !== '') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            showModal: 'wechat',
            wechatModal_task: task,
          },
        });
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: 'withdraw',
        },
      });
    },
    * onClose_WechatModal({}: OnClose_WechatModal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: '',
        },
      });
    },
    * onClick_WechatModal_BindingBtn({}: OnClick_WechatModal_BindingBtn_Action, {}: EffectsCommandMap) {
      self.open(FUtil.LinkTo.binding());
    },
    * onClick_WechatModal_RefreshBtn({}: OnClick_WechatModal_RefreshBtn_Action, { put }: EffectsCommandMap) {
      yield put<OnClick_WithdrawBtn_Action>({
        type: 'rewardPage/onClick_WithdrawBtn',
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
