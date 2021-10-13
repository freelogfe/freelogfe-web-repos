import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import moment, { Moment } from 'moment';
import { ConnectState } from '@/models/connect';

type Authorize_SubjectType = 'resource' | 'exhibit';
type Authorize_Status = 'authorization' | 'pending' | 'exception' | 'terminated';

export interface ContractPageModelState {
  showPage: 'authorize' | 'authorized';

  authorize_SubjectType_Options: {
    value: 'all' | Authorize_SubjectType
    text: string;
  }[];
  authorize_SubjectType: 'all' | Authorize_SubjectType;
  authorize_Status_Options: {
    value: 'all' | Authorize_Status
    text: string;
  }[];
  authorize_Status: 'all' | Authorize_Status;
  authorize_Date: [Moment | null, Moment | null];
  authorize_Keywords: string;
  authorize_List: {
    cover: string;
    subjectType: 'resource' | 'exhibit';
    subjectName: string;
    contractName: string;
    licensorId: string;
    licensorType: 'resource' | 'node';
    licensorName: string;
    licenseeId: string;
    licenseeType: 'resource' | 'node' | 'user';
    licenseeName: string;
    status: Authorize_Status;
    dataTime: string;
    contractID: string;
  }[];

  authorized_SubjectType_Options: {
    value: string;
    text: string;
  }[];
  authorized_SubjectType: string;
  authorized_Status_Options: {
    value: string;
    text: string;
  }[];
  authorized_Status: string;
  authorized_Date: [Moment | null, Moment | null];
  authorized_List: {
    cover: string;
    subjectType: 'resource' | 'exhibit';
    subjectName: string;
    contractName: string;
    licensorId: string;
    licensorType: 'resource' | 'node';
    licensorName: string;
    licenseeId: string;
    licenseeType: 'resource' | 'node' | 'user';
    licenseeName: string;
    status: 'authorization' | 'pending' | 'exception' | 'terminated';
    dataTime: string;
    contractID: string;
  }[];

  contractDetailsID: string;

}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<ContractPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'contractPage/onMountPage';
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'contractPage/onUnmountPage';
}

export interface OnChangeShowPageAction extends AnyAction {
  type: 'contractPage/onChangeShowPage';
  payload: {
    value: 'authorize' | 'authorized';
  };
}

export interface OnClickViewDetailsBtnAction extends AnyAction {
  type: 'contractPage/onClickViewDetailsBtn';
  payload: {
    value: string;
  };
}

export interface OnCloseContractDetailsDrawerAction extends AnyAction {
  type: 'contractPage/onCloseContractDetailsDrawer';
}

export interface OnChange_Authorize_SubjectType_Action extends AnyAction {
  type: 'contractPage/onChange_Authorize_SubjectType';
  payload: {
    value: 'all' | Authorize_SubjectType;
  };
}

export interface OnChange_Authorize_Status_Action extends AnyAction {
  type: 'contractPage/onChange_Authorize_Status';
  payload: {
    value: 'all' | Authorize_Status;
  };
}

export interface OnChange_Authorize_Date_Action extends AnyAction {
  type: 'contractPage/onChange_Authorize_Date';
  payload: {
    value: [Moment | null, Moment | null];
  };
}

export interface OnChange_Authorize_KeywordsInput_Action extends AnyAction {
  type: 'contractPage/onChange_Authorize_KeywordsInput';
  payload: {
    value: string
  };
}

export interface Fetch_Authorize_List_Action extends AnyAction {
  type: 'fetch_Authorize_List';
}

interface ContractPageModelType {
  namespace: 'contractPage';
  state: ContractPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
    onChangeShowPage: (action: OnChangeShowPageAction, effects: EffectsCommandMap) => void;
    onClickViewDetailsBtn: (action: OnClickViewDetailsBtnAction, effects: EffectsCommandMap) => void;
    onCloseContractDetailsDrawer: (action: OnCloseContractDetailsDrawerAction, effects: EffectsCommandMap) => void;
    onChange_Authorize_SubjectType: (action: OnChange_Authorize_SubjectType_Action, effects: EffectsCommandMap) => void;
    onChange_Authorize_Status: (action: OnChange_Authorize_Status_Action, effects: EffectsCommandMap) => void;
    onChange_Authorize_Date: (action: OnChange_Authorize_Date_Action, effects: EffectsCommandMap) => void;
    onChange_Authorize_KeywordsInput: (action: OnChange_Authorize_KeywordsInput_Action, effects: EffectsCommandMap) => void;

    fetch_Authorize_List: (action: Fetch_Authorize_List_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ContractPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: ContractPageModelState = {
  showPage: 'authorize',

  authorize_SubjectType_Options: [{
    value: 'all',
    text: '全部',
  }, {
    value: 'resource',
    text: '资源',
  }, {
    value: 'exhibit',
    text: '展品',
  }],
  authorize_SubjectType: 'all',
  authorize_Status_Options: [{
    value: 'all',
    text: '全部',
  }, {
    value: 'authorization',
    text: '已授权',
  }, {
    value: 'pending',
    text: '待执行',
  }, {
    value: 'terminated',
    text: '已终止',
  }],
  authorize_Status: 'all',
  authorize_Date: [null, null],
  authorize_Keywords: '',
  authorize_List: [],

  authorized_SubjectType_Options: [{
    value: '1234',
    text: '1234',
  }],
  authorized_SubjectType: '1234',
  authorized_Status_Options: [{
    value: '1234',
    text: '1234',
  }],
  authorized_Status: '1234',
  authorized_Date: [null, null],
  authorized_List: [],

  contractDetailsID: '',
};

const Model: ContractPageModelType = {
  namespace: 'contractPage',
  state: initStates,
  effects: {
    * onMountPage({}: OnMountPageAction, { call, put }: EffectsCommandMap) {

      yield put<Fetch_Authorize_List_Action>({
        type: 'fetch_Authorize_List',
      });

      const params2: Parameters<typeof FServiceAPI.Contract.contracts>[0] = {
        identityType: 2,
      };


      const { data: data2 } = yield call(FServiceAPI.Contract.contracts, params2);

      yield put<ChangeAction>({
        type: 'change',
        payload: {

          authorized_List: (data2.dataList as any[]).map<ContractPageModelState['authorized_List'][number]>((al: any) => {
            return {
              cover: '',
              subjectType: al.subjectType === 1 ? 'resource' : 'exhibit',
              subjectName: al.subjectName,
              contractName: al.contractName,
              licensorId: al.licenseeId,
              licensorType: al.subjectType === 1 ? 'resource' : 'node',
              licensorName: al.licensorName,
              licenseeId: al.licenseeId,
              licenseeType: al.licenseeIdentityType === 1 ? 'resource' : al.licenseeIdentityType === 2 ? 'node' : 'user',
              licenseeName: al.licenseeName,
              status: al.status === 1 ? 'terminated' : ((al.authStatus & 1) === 1) ? 'authorization' : 'pending',
              dataTime: FUtil.Format.formatDateTime(al.createDate, true),
              contractID: al.contractId,
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
    * onChangeShowPage({ payload }: OnChangeShowPageAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showPage: payload.value,
        },
      });
    },
    * onClickViewDetailsBtn({ payload }: OnClickViewDetailsBtnAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          contractDetailsID: payload.value,
        },
      });
    },
    * onCloseContractDetailsDrawer({}: OnCloseContractDetailsDrawerAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          contractDetailsID: '',
        },
      });
    },

    * onChange_Authorize_SubjectType({ payload }: OnChange_Authorize_SubjectType_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          authorize_SubjectType: payload.value,
        },
      });
      yield put<Fetch_Authorize_List_Action>({
        type: 'fetch_Authorize_List',
      });
    },
    * onChange_Authorize_Status({ payload }: OnChange_Authorize_Status_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          authorize_Status: payload.value,
        },
      });
      yield put<Fetch_Authorize_List_Action>({
        type: 'fetch_Authorize_List',
      });
    },
    * onChange_Authorize_Date({ payload }: OnChange_Authorize_Date_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          authorize_Date: payload.value,
        },
      });
      yield put<Fetch_Authorize_List_Action>({
        type: 'fetch_Authorize_List',
      });
    },
    * onChange_Authorize_KeywordsInput({ payload }: OnChange_Authorize_KeywordsInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          authorize_Keywords: payload.value,
        },
      });
      console.log('@$!@#$213423143444444');

      yield put<Fetch_Authorize_List_Action>({
        type: 'fetch_Authorize_List',
      });
    },

    * fetch_Authorize_List(action: Fetch_Authorize_List_Action, { select, call, put }: EffectsCommandMap) {
      const { contractPage }: ConnectState = yield select(({ contractPage }: ConnectState) => ({
        contractPage,
      }));

      const status: { [k: string]: 0 | 1 | 2 } = {
        'authorization': 0,
        'pending': 0,
        'exception': 2,
        'terminated': 1,
      };

      const authStatus: { [key: string]: 1 | 128 | undefined } = {
        'authorization': 1,
        'pending': 128,
        'exception': undefined,
        'terminated': undefined,
      };

      const subjectType: { [key: string]: 1 | 2 | undefined } = {
        'all': undefined,
        'resource': 1,
        'exhibit': 2,
      };

      const params1: Parameters<typeof FServiceAPI.Contract.contracts>[0] = {
        skip: 0,
        limit: FUtil.Predefined.pageSize,
        identityType: 1,
        subjectType: subjectType[contractPage.authorize_SubjectType],
        status: contractPage.authorize_Status === 'all' ? undefined : status[contractPage.authorize_Status],
        authStatus: contractPage.authorize_Status === 'all' ? undefined : authStatus[contractPage.authorize_Status],
        startDate: contractPage.authorize_Date[0] ? contractPage.authorize_Date[0]?.format(FUtil.Predefined.momentDateFormat) : undefined,
        endDate: contractPage.authorize_Date[1] ? contractPage.authorize_Date[1]?.format(FUtil.Predefined.momentDateFormat) : undefined,
        keywords: contractPage.authorize_Keywords || undefined,
      };

      const { data: data1 } = yield call(FServiceAPI.Contract.contracts, params1);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          authorize_List: (data1.dataList as any[]).map<ContractPageModelState['authorize_List'][number]>((al: any) => {
            return {
              cover: '',
              subjectType: al.subjectType === 1 ? 'resource' : 'exhibit',
              subjectName: al.subjectName,
              contractName: al.contractName,
              licensorId: al.licenseeId,
              licensorType: al.subjectType === 1 ? 'resource' : 'node',
              licensorName: al.licensorName,
              licenseeId: al.licenseeId,
              licenseeType: al.licenseeIdentityType === 1 ? 'resource' : al.licenseeIdentityType === 2 ? 'node' : 'user',
              licenseeName: al.licenseeName,
              status: al.status === 1 ? 'terminated' : ((al.authStatus & 1) === 1) ? 'authorization' : 'pending',
              dataTime: FUtil.Format.formatDateTime(al.createDate, true),
              contractID: al.contractId,
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
