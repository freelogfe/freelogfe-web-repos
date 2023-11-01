import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import moment, { Moment } from 'moment';
import { ConnectState } from '@/models/connect';

type Authorize_SubjectType = 'resource' | 'exhibit';
// type Authorize_Status = 'authorization' | 'pending' | 'exception' | 'terminated';
type Authorize_Status = 'terminated' | 'exception' | 'authorized' | 'testAuthorized' | 'unauthorized';

type Authorized_SubjectType = 'resource' | 'exhibit';
type Authorized_Status = 'terminated' | 'exception' | 'authorized' | 'testAuthorized' | 'unauthorized';

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
  authorized_SubjectIds: string;
  authorize_Status: 'all' | Authorize_Status;
  authorize_Date: [Moment, Moment] | null;
  authorize_Keywords: string;
  authorize_moreFilterShow: boolean;
  authorize_ListState: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  authorize_ListMore: 'loading' | 'andMore' | 'noMore';
  authorize_List: {
    cover: string;
    subjectType: 'resource' | 'exhibit';
    subjectID: string;
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
    value: 'all' | Authorized_SubjectType;
    text: string;
  }[];
  authorized_SubjectType: 'all' | Authorized_SubjectType;
  authorized_Status_Options: {
    value: 'all' | Authorized_Status;
    text: string;
  }[];
  authorized_Status: 'all' | Authorized_Status;
  authorized_Date: [Moment, Moment] | null;
  authorized_Keywords: string;
  authorized_moreFilterShow: boolean;
  authorized_ListState: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  authorized_ListMore: 'loading' | 'andMore' | 'noMore';
  authorized_List: {
    cover: string;
    subjectType: 'resource' | 'exhibit';
    subjectID: string;
    subjectName: string;
    contractName: string;
    licensorId: string;
    licensorType: 'resource' | 'node';
    licensorName: string;
    licenseeId: string;
    licenseeType: 'resource' | 'node' | 'user';
    licenseeName: string;
    status: Authorized_Status;
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
    value: [Moment, Moment] | null;
  };
}

export interface OnChange_Authorize_KeywordsInput_Action extends AnyAction {
  type: 'contractPage/onChange_Authorize_KeywordsInput';
  payload: {
    value: string
  };
}

export interface OnChange_Authorize_MoreFilterShow_Action extends AnyAction {
  type: 'contractPage/onChange_Authorize_MoreFilterShow';
  payload: {
    value: boolean
  };
}

export interface OnClick_Authorize_LoadMoreBtn_Action extends AnyAction {
  type: 'contractPage/onClick_Authorize_LoadMoreBtn';
}

export interface OnChange_Authorized_SubjectType_Action extends AnyAction {
  type: 'contractPage/onChange_Authorized_SubjectType';
  payload: {
    value: 'all' | Authorized_SubjectType;
  };
}

export interface OnChange_Authorized_Status_Action extends AnyAction {
  type: 'contractPage/onChange_Authorized_Status';
  payload: {
    value: 'all' | Authorized_Status;
  };
}

export interface OnChange_Authorized_SubjectIds_Action extends AnyAction {
  type: 'contractPage/onChange_Authorized_SubjectIds';
  payload: {
    authorized_Status: 'all' | Authorized_Status,
    authorized_SubjectType: 'all' | Authorized_SubjectType;
    authorized_SubjectIds: string,
  };
}

export interface OnChange_Authorized_Date_Action extends AnyAction {
  type: 'contractPage/onChange_Authorized_Date';
  payload: {
    value: [Moment, Moment] | null;
  };
}

export interface OnChange_Authorized_KeywordsInput_Action extends AnyAction {
  type: 'contractPage/onChange_Authorized_KeywordsInput';
  payload: {
    value: string
  };
}

export interface OnChange_Authorized_MoreFilterShow_Action extends AnyAction {
  type: 'contractPage/onChange_Authorized_MoreFilterShow';
  payload: {
    value: boolean
  };
}

export interface OnClick_Authorized_LoadMoreBtn_Action extends AnyAction {
  type: 'contractPage/onClick_Authorized_LoadMoreBtn';
}

export interface Fetch_Authorize_List_Action extends AnyAction {
  type: 'fetch_Authorize_List';
  payload?: {
    loadMore: boolean;
  };
}

export interface Fetch_Authorized_List_Action extends AnyAction {
  type: 'fetch_Authorized_List';
  payload?: {
    loadMore: boolean;
  };
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
    onChange_Authorize_MoreFilterShow: (action: OnChange_Authorize_MoreFilterShow_Action, effects: EffectsCommandMap) => void;
    onClick_Authorize_LoadMoreBtn: (action: OnClick_Authorize_LoadMoreBtn_Action, effects: EffectsCommandMap) => void;
    onChange_Authorized_SubjectIds: (action: OnChange_Authorized_SubjectIds_Action, effects: EffectsCommandMap) => void;
    onChange_Authorized_SubjectType: (action: OnChange_Authorized_SubjectType_Action, effects: EffectsCommandMap) => void;
    onChange_Authorized_Status: (action: OnChange_Authorized_Status_Action, effects: EffectsCommandMap) => void;
    onChange_Authorized_Date: (action: OnChange_Authorized_Date_Action, effects: EffectsCommandMap) => void;
    onChange_Authorized_KeywordsInput: (action: OnChange_Authorized_KeywordsInput_Action, effects: EffectsCommandMap) => void;
    onChange_Authorized_MoreFilterShow: (action: OnChange_Authorized_MoreFilterShow_Action, effects: EffectsCommandMap) => void;
    onClick_Authorized_LoadMoreBtn: (action: OnClick_Authorized_LoadMoreBtn_Action, effects: EffectsCommandMap) => void;

    fetch_Authorize_List: (action: Fetch_Authorize_List_Action, effects: EffectsCommandMap) => void;
    fetch_Authorized_List: (action: Fetch_Authorized_List_Action, effects: EffectsCommandMap) => void;
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
  authorized_SubjectIds: '',
  authorize_Status_Options: [{
    value: 'all',
    text: '全部',
  }, {
    value: 'authorized',
    text: '已授权',
  }, {
    value: 'unauthorized',
    text: '未授权',
  }, {
    value: 'terminated',
    text: '已终止',
  }],
  authorize_Status: 'all',
  authorize_Date: null,
  authorize_Keywords: '',
  authorize_moreFilterShow: false,
  authorize_ListState: 'loading',
  authorize_ListMore: 'loading',
  authorize_List: [],

  authorized_SubjectType_Options: [{
    value: 'all',
    text: '全部',
  }, {
    value: 'resource',
    text: '资源',
  }, {
    value: 'exhibit',
    text: '展品',
  }],
  authorized_SubjectType: 'all',
  authorized_Status_Options: [{
    value: 'all',
    text: '全部',
  }, {
    value: 'authorized',
    text: '已授权',
  }, {
    value: 'unauthorized',
    text: '未授权',
  }, {
    value: 'terminated',
    text: '已终止',
  }],
  authorized_Status: 'all',
  authorized_Date: null,
  authorized_Keywords: '',
  authorized_moreFilterShow: false,
  authorized_ListState: 'loading',
  authorized_ListMore: 'loading',
  authorized_List: [],

  contractDetailsID: '',
};

const Model: ContractPageModelType = {
  namespace: 'contractPage',
  state: initStates,
  effects: {
    * onMountPage({}: OnMountPageAction, { call, put }: EffectsCommandMap) {
      // console.log('#@#$@#$!!!!!!!');
      // yield put<Fetch_Authorize_List_Action>({
      //   type: 'fetch_Authorize_List',
      // });
      //
      // yield put<Fetch_Authorized_List_Action>({
      //   type: 'fetch_Authorized_List',
      // });

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
      // console.log('@$!@#$213423143444444');

      yield put<Fetch_Authorize_List_Action>({
        type: 'fetch_Authorize_List',
      });
    },
    * onChange_Authorize_MoreFilterShow({ payload }: OnChange_Authorize_MoreFilterShow_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          authorize_moreFilterShow: payload.value,
        },
      });
    },
    * onClick_Authorize_LoadMoreBtn(action: OnClick_Authorize_LoadMoreBtn_Action, { put }: EffectsCommandMap) {
      yield put<Fetch_Authorize_List_Action>({
        type: 'fetch_Authorize_List',
        payload: {
          loadMore: true,
        },
      });
    },

    * onChange_Authorized_SubjectType({ payload }: OnChange_Authorized_SubjectType_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          authorized_SubjectType: payload.value,
        },
      });
      yield put<Fetch_Authorized_List_Action>({
        type: 'fetch_Authorized_List',
      });
    },
    * onChange_Authorized_SubjectIds({ payload }: OnChange_Authorized_SubjectIds_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          authorized_Status: payload.authorized_Status,
          authorized_SubjectType: payload.authorized_SubjectType,
          authorized_SubjectIds: payload.authorized_SubjectIds,
        },
      });
      if (payload.authorized_SubjectIds) {
        return null;
      }
      yield put<Fetch_Authorized_List_Action>({
        type: 'fetch_Authorized_List',
      });
    },
    * onChange_Authorized_Status({ payload }: OnChange_Authorized_Status_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          authorized_Status: payload.value,
        },
      });
      yield put<Fetch_Authorized_List_Action>({
        type: 'fetch_Authorized_List',
      });
    },
    * onChange_Authorized_Date({ payload }: OnChange_Authorized_Date_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          authorized_Date: payload.value,
        },
      });
      yield put<Fetch_Authorized_List_Action>({
        type: 'fetch_Authorized_List',
      });
    },
    * onChange_Authorized_KeywordsInput({ payload }: OnChange_Authorized_KeywordsInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          authorized_Keywords: payload.value,
        },
      });
      // console.log('@$!@#$213423143444444');

      yield put<Fetch_Authorized_List_Action>({
        type: 'fetch_Authorized_List',
      });
    },
    * onChange_Authorized_MoreFilterShow({ payload }: OnChange_Authorized_MoreFilterShow_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          authorized_moreFilterShow: payload.value,
        },
      });
    },
    * onClick_Authorized_LoadMoreBtn({}: OnClick_Authorized_LoadMoreBtn_Action, { put }: EffectsCommandMap) {
      yield put<Fetch_Authorized_List_Action>({
        type: 'fetch_Authorized_List',
        payload: {
          loadMore: true,
        },
      });
    },

    * fetch_Authorize_List({ payload }: Fetch_Authorize_List_Action, { select, call, put }: EffectsCommandMap) {
      const { contractPage }: ConnectState = yield select(({ contractPage }: ConnectState) => ({
        contractPage,
      }));
      // console.log('#@#$@#$23423422222@@@@@@@@');

      if (payload?.loadMore) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            authorize_ListMore: 'loading',
          },
        });
      } else {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            authorize_ListState: 'loading',
            authorize_ListMore: 'loading',
          },
        });
      }

      // const status: { [k: string]: 0 | 1 | 2 } = {
      //   'authorization': 0,
      //   'pending': 0,
      //   'exception': 2,
      //   'terminated': 1,
      // };
      //
      // const authStatus: { [key: string]: 1 | 128 | undefined } = {
      //   'authorization': 1,
      //   'pending': 128,
      //   'exception': undefined,
      //   'terminated': undefined,
      // };

      const status: { [k: string]: 0 | 1 | 2 } = {
        // 'authorization': 0,
        'authorized': 0,
        'unauthorized': 0,
        // 'pending': 0,
        // 'exception': 2,
        // 'unauthorized': 2,
        'terminated': 1,
      };

      const authStatus: { [key: string]: 1 | 128 | undefined } = {
        // 'authorization': 1,
        'authorized': 1,
        // 'pending': 128,
        'unauthorized': 128,
        // 'exception': undefined,
        'terminated': undefined,
      };

      const subjectType: { [key: string]: 1 | 2 | undefined } = {
        'all': undefined,
        'resource': 1,
        'exhibit': 2,
      };

      let beforeData: ContractPageModelState['authorize_List'] = [];
      if (payload?.loadMore) {
        beforeData = [
          ...contractPage.authorize_List,
        ];
      }
      const params: Parameters<typeof FServiceAPI.Contract.contracts>[0] = {
        skip: beforeData.length,
        limit: FUtil.Predefined.pageSize,
        // limit: 100,
        identityType: 1,
        subjectType: subjectType[contractPage.authorize_SubjectType],
        status: contractPage.authorize_Status === 'all' ? undefined : status[contractPage.authorize_Status],
        authStatus: contractPage.authorize_Status === 'all' ? undefined : authStatus[contractPage.authorize_Status],
        startDate: contractPage.authorize_Date ? contractPage.authorize_Date[0].format(FUtil.Predefined.momentDateFormat) : undefined,
        endDate: contractPage.authorize_Date ? contractPage.authorize_Date[1]?.format(FUtil.Predefined.momentDateFormat) + ' 23:59:59' : undefined,
        keywords: contractPage.authorize_Keywords || undefined,
      };

      const data: { dataList: any[]; totalItem: number; } = yield call(contractList, params);

      // console.log(data, '@2222222222')

      const resultList: ContractPageModelState['authorize_List'] = [
        ...beforeData,
        ...(data.dataList as any[]).map<ContractPageModelState['authorize_List'][number]>((al) => {
          return {
            cover: al.subjectInfo?.coverImages[0] || '',
            subjectType: al.subjectType === 1 ? 'resource' : 'exhibit',
            subjectID: al.subjectId,
            subjectName: al.subjectName,
            contractName: al.contractName,
            licensorId: al.licensorId,
            licensorType: al.subjectType === 1 ? 'resource' : 'node',
            licensorName: al.licensorName,
            licenseeId: al.licenseeId,
            licenseeType: al.licenseeIdentityType === 1 ? 'resource' : al.licenseeIdentityType === 2 ? 'node' : 'user',
            licenseeName: al.licenseeName,
            // status: al.status === 1 ? 'terminated' : ((al.authStatus & 1) === 1) ? 'authorization' : 'pending',
            status: handleContractState({
              status: al.status,
              authStatus: al.authStatus,
            }),
            dataTime: FUtil.Format.formatDateTime(al.createDate, true),
            contractID: al.contractId,
          };
        }),
      ];

      if (resultList.length === 0) {
        if (params.subjectType === undefined && params.status === undefined && params.authStatus === undefined && params.startDate === undefined && params.endDate === undefined && params.keywords === undefined) {
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              authorize_ListState: 'noData',
              authorize_ListMore: 'noMore',
              authorize_List: [],
            },
          });
        } else {
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              authorize_ListState: 'noSearchResult',
              authorize_ListMore: 'noMore',
              authorize_List: [],
            },
          });
        }
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          authorize_ListState: 'loaded',
          authorize_ListMore: data.totalItem > resultList.length ? 'andMore' : 'noMore',
          authorize_List: resultList,
        },
      });
    },
    * fetch_Authorized_List({ payload }: Fetch_Authorized_List_Action, { select, call, put }: EffectsCommandMap) {
      const { contractPage }: ConnectState = yield select(({ contractPage }: ConnectState) => ({
        contractPage,
      }));
      // console.log('#@#$@#$23423422222@@@@@@@@');

      if (payload?.loadMore) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            authorized_ListMore: 'loading',
          },
        });
      } else {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            authorized_ListState: 'loading',
            authorized_ListMore: 'loading',
          },
        });
      }

      // const status: { [k: string]: 0 | 1 | 2 } = {
      //   'authorization': 0,
      //   'pending': 0,
      //   'exception': 2,
      //   'terminated': 1,
      // };
      //
      // const authStatus: { [key: string]: 1 | 128 | undefined } = {
      //   'authorization': 1,
      //   'pending': 128,
      //   'exception': undefined,
      //   'terminated': undefined,
      // };

      const status: { [k: string]: 0 | 1 | 2 } = {
        // 'authorization': 0,
        'authorized': 0,
        'unauthorized': 0,
        // 'pending': 0,
        // 'exception': 2,
        // 'unauthorized': 2,
        'terminated': 1,
      };

      const authStatus: { [key: string]: 1 | 128 | undefined } = {
        // 'authorization': 1,
        'authorized': 1,
        // 'pending': 128,
        'unauthorized': 128,
        // 'exception': undefined,
        'terminated': undefined,
      };

      const subjectType: { [key: string]: 1 | 2 | undefined } = {
        'all': undefined,
        'resource': 1,
        'exhibit': 2,
      };

      let beforeData: ContractPageModelState['authorized_List'] = [];
      if (payload?.loadMore) {
        beforeData = [
          ...contractPage.authorized_List,
        ];
      }

      // console.log(contractPage, 'contractPagecontractPage@#%@#@#@#@@@');
      let params: Parameters<typeof FServiceAPI.Contract.contracts>[0] = {
        skip: beforeData.length,
        limit: FUtil.Predefined.pageSize,
        // limit: 100,
        identityType: 2,
        subjectType: subjectType[contractPage.authorized_SubjectType],
        status: contractPage.authorized_Status === 'all' ? undefined : status[contractPage.authorized_Status],
        authStatus: contractPage.authorized_Status === 'all' ? undefined : authStatus[contractPage.authorized_Status],
        startDate: contractPage.authorized_Date ? contractPage.authorized_Date[0].format(FUtil.Predefined.momentDateFormat) : undefined,
        endDate: contractPage.authorized_Date ? contractPage.authorized_Date[1].format(FUtil.Predefined.momentDateFormat) + ' 23:59:59' : undefined,
        keywords: contractPage.authorized_Keywords || undefined,
      };
      if (contractPage.authorized_SubjectIds) {
        params = {
          ...params,
          subjectIds: contractPage.authorized_SubjectIds,
        };
      }
      const data: { dataList: any[]; totalItem: number; } = yield call(contractList, params);

      // console.log(data, 'DDDDF093ujlksjdlfsdkflsdfls');
      // const data1 = { dataList: [] };
      const resultList: ContractPageModelState['authorized_List'] = [
        ...beforeData,
        ...data.dataList.map<ContractPageModelState['authorized_List'][number]>((al) => {
          return {
            cover: al.subjectInfo?.coverImages[0] || '',
            subjectType: al.subjectType === 1 ? 'resource' : 'exhibit',
            subjectID: al.subjectId,
            subjectName: al.subjectName,
            contractName: al.contractName,
            licensorId: al.licensorId,
            licensorType: al.subjectType === 1 ? 'resource' : 'node',
            licensorName: al.licensorName,
            licenseeId: al.licenseeId,
            licenseeType: al.licenseeIdentityType === 1 ? 'resource' : al.licenseeIdentityType === 2 ? 'node' : 'user',
            licenseeName: al.licenseeName,
            // status: al.status === 1 ? 'terminated' : ((al.authStatus & 1) === 1) ? 'authorization' : 'pending',
            status: handleContractState({
              status: al.status,
              authStatus: al.authStatus,
            }),
            dataTime: FUtil.Format.formatDateTime(al.createDate, true),
            contractID: al.contractId,
          };
        }),
      ];

      if (resultList.length === 0) {
        if (params.subjectType === undefined && params.status === undefined && params.authStatus === undefined && params.startDate === undefined && params.endDate === undefined && params.keywords === undefined) {
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              authorized_ListState: 'noData',
              authorized_ListMore: 'noMore',
              authorized_List: [],
            },
          });
        } else {
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              authorized_ListState: 'noSearchResult',
              authorized_ListMore: 'noMore',
              authorized_List: [],
            },
          });
        }
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          authorized_ListState: 'loaded',
          authorized_ListMore: data.totalItem > resultList.length ? 'andMore' : 'noMore',
          authorized_List: resultList,
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

interface HandleContractStateParams {
  status: 0 | 1 | 2; // 合同综合状态: 0:正常 1:已终止(不接受任何事件,也不给授权,事实上无效的合约) 2:异常
  authStatus: 1 | 2 | 128 | number; // 合同授权状态 1:正式授权 2:测试授权 128:未获得授权
}

function handleContractState({
                               status,
                               authStatus,
                             }: HandleContractStateParams): 'terminated' | 'exception' | 'authorized' | 'testAuthorized' | 'unauthorized' {
  if (status === 1) {
    return 'terminated';
  }
  if (status === 2) {
    return 'exception';
  }

  if (authStatus === 1 || authStatus === 3) {
    return 'authorized';
  }
  if (authStatus === 2) {
    return 'testAuthorized';
  }
  if (authStatus === 128) {
    return 'unauthorized';
  }
  return 'exception';
}

// interface Interface extends Parameters<typeof FServiceAPI.Contract.contracts>[0] {
//
// }

async function contractList(params: Parameters<typeof FServiceAPI.Contract.contracts>[0]) {
  const { data } = await FServiceAPI.Contract.contracts(params);
  // console.log(data.dataList, 'data@@@@@@@@');
  const exhibitIDs: string[] = data.dataList
    .filter((d: any) => {
      return d.subjectType === 2;
    }).map((d: any) => {
      return d.subjectId;
    });

  const resourceIDs: string[] = data.dataList
    .filter((d: any) => {
      return d.subjectType === 1;
    }).map((d: any) => {
      return d.subjectId;
    });

  // console.log(exhibitIDs, resourceIDs, '######3900928309482034809');
  let exhibits: any[] = [];
  let resources: any[] = [];

  if (exhibitIDs.length > 0) {
    const params1: Parameters<typeof FServiceAPI.Exhibit.presentableList>[0] = {
      presentableIds: Array.from(new Set(exhibitIDs)).join(','),
    };

    const { data: data1 } = await FServiceAPI.Exhibit.presentableList(params1);
    // console.log(data1, '#####0920938048230480239');
    exhibits = data1;
  }

  if (resourceIDs.length > 0) {
    const params2: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
      resourceIds: Array.from(new Set(resourceIDs)).join(','),
    };

    const { data: data2 } = await FServiceAPI.Resource.batchInfo(params2);
    // console.log(data2, '*******0920938048230480239');
    resources = data2;
  }
  // console.log(exhibits, resources, '####92093840238704230u3');
  //coverImages
  return {
    ...data,
    dataList: data.dataList.map((d: any) => {
      let subjectInfo: any = null;
      if (d.subjectType === 1) {
        subjectInfo = resources.find((r: any) => {
          return r.resourceId === d.subjectId;
        }) || null;
      } else if (d.subjectType === 2) {
        subjectInfo = exhibits.find((e: any) => {
          return e.presentableId === d.subjectId;
        }) || null;
      }
      return {
        ...d,
        subjectInfo,
      };
    }),
  };
}
