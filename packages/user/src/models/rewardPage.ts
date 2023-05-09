import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { ConnectState } from '@/models/connect';
import fMessage from '@/components/fMessage';

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

  withdrawModal_WechatName: string;
  withdrawModal_RealName: string;
  withdrawModal_RealNameError: string;
  withdrawModal_Amount: string;
  withdrawModal_AmountError: string;
  withdrawModal_drawing: boolean;
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

export interface OnClose_WithdrawModal_Action extends AnyAction {
  type: 'rewardPage/onClose_WithdrawModal';
}

export interface OnChange_WithdrawModal_RealNameInput_Action extends AnyAction {
  type: 'rewardPage/onChange_WithdrawModal_RealNameInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_WithdrawModal_RealNameInput_Action extends AnyAction {
  type: 'rewardPage/onBlur_WithdrawModal_RealNameInput';
}

export interface OnChange_WithdrawModal_AmountInput_Action extends AnyAction {
  type: 'rewardPage/onChange_WithdrawModal_AmountInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_WithdrawModal_AmountInput_Action extends AnyAction {
  type: 'rewardPage/onBlur_WithdrawModal_AmountInput';
}

export interface OnClick_WithdrawModal_TotalBtn_Action extends AnyAction {
  type: 'rewardPage/onClick_WithdrawModal_TotalBtn';
}

export interface OnClick_WithdrawModal_ConfirmBtn_Action extends AnyAction {
  type: 'rewardPage/onClick_WithdrawModal_ConfirmBtn';
}

export interface FetchData_Action extends AnyAction {
  type: 'fetchData';
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
    onClose_WithdrawModal: (action: OnClose_WithdrawModal_Action, effects: EffectsCommandMap) => void;
    onChange_WithdrawModal_RealNameInput: (action: OnChange_WithdrawModal_RealNameInput_Action, effects: EffectsCommandMap) => void;
    onBlur_WithdrawModal_RealNameInput: (action: OnBlur_WithdrawModal_RealNameInput_Action, effects: EffectsCommandMap) => void;
    onChange_WithdrawModal_AmountInput: (action: OnChange_WithdrawModal_AmountInput_Action, effects: EffectsCommandMap) => void;
    onBlur_WithdrawModal_AmountInput: (action: OnBlur_WithdrawModal_AmountInput_Action, effects: EffectsCommandMap) => void;
    onClick_WithdrawModal_TotalBtn: (action: OnClick_WithdrawModal_TotalBtn_Action, effects: EffectsCommandMap) => void;
    onClick_WithdrawModal_ConfirmBtn: (action: OnClick_WithdrawModal_ConfirmBtn_Action, effects: EffectsCommandMap) => void;
    fetchData: (action: FetchData_Action, effects: EffectsCommandMap) => void;
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
  withdrawModal_WechatName: '',
  withdrawModal_RealName: '',
  withdrawModal_RealNameError: '',
  withdrawModal_Amount: '',
  withdrawModal_AmountError: '',
  withdrawModal_drawing: false,
};

const Model: RewardPageModelType = {
  namespace: 'rewardPage',
  state: initStates,
  effects: {
    * onMountPage({}: OnMountPageAction, { call, put }: EffectsCommandMap) {
      yield put<FetchData_Action>({
        type: 'fetchData',
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

      let showModal: '' | 'binding' | 'follow' = '';
      const weChatBinding = data_thirdList.find((dt: any) => {
        return dt.thirdPartyType === 'weChat';
      });

      if (!weChatBinding) {
        showModal = 'binding';
      }

      if (showModal === '') {
        const params1: Parameters<typeof FServiceAPI.Activity.getWechatOfficialAccountInfo>[0] = {};
        const {
          ret,
          errCode,
          data: data_wechatInfo,
        } = yield call(FServiceAPI.Activity.getWechatOfficialAccountInfo, params1);

        if (ret !== 0 || errCode !== 0 || !data_wechatInfo) {
          showModal = 'follow';
        }
      }

      if (showModal !== '') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            showModal: 'wechat',
            wechatModal_task: showModal,
          },
        });
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: 'withdraw',
          withdrawModal_WechatName: weChatBinding?.name || '',
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
    * onClose_WithdrawModal({}: OnClose_WithdrawModal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showModal: '',
        },
      });
    },
    * onChange_WithdrawModal_RealNameInput({ payload }: OnChange_WithdrawModal_RealNameInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          withdrawModal_RealName: payload.value,
          withdrawModal_RealNameError: '',
        },
      });
    },
    * onBlur_WithdrawModal_RealNameInput({}: OnBlur_WithdrawModal_RealNameInput_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { rewardPage } = yield select(({ rewardPage }: ConnectState) => ({
        rewardPage,
      }));
      let withdrawModal_RealNameError: string = '';
      if (rewardPage.withdrawModal_RealName === '') {
        withdrawModal_RealNameError = '不能为空';
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          withdrawModal_RealNameError,
        },
      });
    },
    * onChange_WithdrawModal_AmountInput({ payload }: OnChange_WithdrawModal_AmountInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          withdrawModal_Amount: payload.value,
          withdrawModal_AmountError: '',
        },
      });
    },
    * onBlur_WithdrawModal_AmountInput({}: OnBlur_WithdrawModal_AmountInput_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { rewardPage } = yield select(({ rewardPage }: ConnectState) => ({
        rewardPage,
      }));
      let withdrawModal_AmountError: string = '';
      if (rewardPage.withdrawModal_Amount === '') {
        withdrawModal_AmountError = '不能为空';
      } else if ((Number(rewardPage.withdrawModal_Amount) || 0) < 20) {
        withdrawModal_AmountError = '输入大于20的数字';
      } else if ((Number(rewardPage.withdrawModal_Amount) > rewardPage.cashAmount)) {
        withdrawModal_AmountError = '超过提现金额';
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          withdrawModal_AmountError,
        },
      });
    },
    * onClick_WithdrawModal_TotalBtn({}: OnClick_WithdrawModal_TotalBtn_Action, { select, put }: EffectsCommandMap) {
      const { rewardPage } = yield select(({ rewardPage }: ConnectState) => ({
        rewardPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          withdrawModal_Amount: rewardPage.cashAmount,
          withdrawModal_AmountError: '',
        },
      });
    },
    * onClick_WithdrawModal_ConfirmBtn({}: OnClick_WithdrawModal_ConfirmBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { rewardPage } = yield select(({ rewardPage }: ConnectState) => ({
        rewardPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          withdrawModal_drawing: true,
        },
      });
      const params: Parameters<typeof FServiceAPI.Activity.withdrawCoinAccount>[0] = {
        reUserName: rewardPage.withdrawModal_RealName,
        amount: Number(rewardPage.withdrawModal_Amount),
      };
      const { ret, errCode, data, msg } = yield call(FServiceAPI.Activity.withdrawCoinAccount, params);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          withdrawModal_drawing: false,
        },
      });
      if (ret !== 0 || errCode !== 0) {
        self._czc?.push(['_trackEvent', '个人中心页', '提现至微信', '', 1]);
        fMessage(msg, 'error');
      } else {
        self._czc?.push(['_trackEvent', '个人中心页', '提现至微信', '', 0]);
        fMessage('提现成功', 'success');

        yield put<ChangeAction>({
          type: 'change',
          payload: {
            showModal: '',
          },
        });

        yield put<FetchData_Action>({
          type: 'fetchData',
        });
      }
    },
    * fetchData({}: FetchData_Action, { call, put }: EffectsCommandMap) {
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
            const extra = JSON.parse(dr.extra);
            return {
              key: dr.id,
              date: dataAndTime[0],
              time: dataAndTime[1],
              // digest: extra,
              digest: extra?.mark || extra?.remark || '---',
              transactionAmount: dr.changedAmount,
              afterBalance: dr.afterBalance,
            };
          }),
        },
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
