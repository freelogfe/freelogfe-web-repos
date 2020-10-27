import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {presentableDetails, PresentableDetailsParamsType1} from "@/services/presentables";
import {ConnectState} from "@/models/connect";

export type ExhibitInfoPageModelState = WholeReadonly<{
  presentableId: string;
  // info: null | {};

  nodeName: string;
  resourceName: string;
  resourceType: string;
  isOnline: boolean;

  policies: {
    id: string;
    name: string;
    text: string;
    status: 0 | 1;
  }[];

  associated: {
    name: string;
    type: string;
    contracts: {
      name: string;
      status: 0 | 1;
      id: string;
      createTime: string;
    }[];
    policies: {
      id: string;
      name: string;
      text: string;
    }[];
  }[];

  pCover: string;
  pTitle: string;
  pInputTitle: string | null;
  pTags: string[];
  pTagInput: string;

  pBaseAttrs: {
    key: string;
    value: string;
  }[];

  pCustomAttrs: {
    key: string;
    value: string;
    option: string[];
  }[];

  pAddCustomModalVisible: boolean;
  pAddCustomKey: string;
  pAddCustomValue: string;
  pAddCustomDescription: string;

}>;

export interface ChangeAction extends AnyAction {
  type: 'change' | 'exhibitInfoPage/change';
  payload: Partial<ExhibitInfoPageModelState>;
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo' | 'exhibitInfoPage/fetchInfo';
}

export interface ExhibitInfoPageModelType {
  namespace: 'exhibitInfoPage';
  state: ExhibitInfoPageModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ExhibitInfoPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: ExhibitInfoPageModelType = {
  namespace: 'exhibitInfoPage',
  state: {
    presentableId: '',

    nodeName: '',
    resourceName: '',
    resourceType: '',
    isOnline: false,

    policies: [],
    associated: [],

    pCover: '',
    pTitle: '',
    pInputTitle: null,
    pTags: [],
    pTagInput: '',

    pBaseAttrs: [],
    pCustomAttrs: [],

    pAddCustomModalVisible: false,
    pAddCustomKey: '',
    pAddCustomValue: '',
    pAddCustomDescription: '',
  },
  effects: {
    * fetchInfo({}: FetchInfoAction, {call, select, put}: EffectsCommandMap) {
      const {exhibitInfoPage, nodes}: ConnectState = yield select(({exhibitInfoPage, nodes}: ConnectState) => ({
        exhibitInfoPage,
        nodes,
      }));

      const params: PresentableDetailsParamsType1 = {
        presentableId: exhibitInfoPage.presentableId,
      };
      const {data} = yield call(presentableDetails, params);
      console.log(data, 'data2309jdsfa');

      const nodeName: string = nodes.list.find((n) => n.nodeId === data.nodeId)?.nodeName || '';

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeName: nodeName,
          resourceName: data.presentableName,
          resourceType: data.resourceInfo.resourceType,
          isOnline: data.onlineStatus === 1,
          policies: [],
          associated: [],

          pCover: data.coverImages[0] || '',
          pTitle: data.presentableTitle,
          pTags: data.tags,
        },
      })
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

    }
  }
};

export default Model;
