import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { FetchDataSourceAction, ResourceInfoModelState } from '@/models/resourceInfo';
import { FServiceAPI } from '@freelog/tools-lib';

export interface ResourceInfoPageModelState {
  pageState: 'loading' | 'loaded';
  resourceID: string;
  isEditing: boolean;
  editorText: string;
  introductionErrorText: string;
  hasPermission: boolean;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceInfoPage/change';
  payload: Partial<ResourceInfoPageModelState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'resourceInfoPage/initModelStates';
}

export interface OnChangeIsEditingAction extends AnyAction {
  type: 'resourceInfoPage/onChangeIsEditing',
  payload: boolean;
}

export interface OnChangeEditorAction extends AnyAction {
  type: 'resourceInfoPage/onChangeEditor',
  payload: string;
}

export interface OnChangeInfoAction extends AnyAction {
  type: 'resourceInfoPage/onChangeInfo',
  payload: Partial<ResourceInfoModelState['info']>;
  id: string;
}


export interface ResourceInfoPageModelType {
  namespace: 'resourceInfoPage';
  state: ResourceInfoPageModelState;
  effects: {
    onChangeInfo: (action: OnChangeInfoAction, effects: EffectsCommandMap) => void;
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceInfoPageModelState, ChangeAction>;
    onChangeIsEditing: DvaReducer<ResourceInfoPageModelState, OnChangeIsEditingAction>;
    onChangeEditor: DvaReducer<ResourceInfoPageModelState, OnChangeEditorAction>;
  };
  subscriptions: { setup: Subscription };
}

const initStates: ResourceInfoPageModelState = {
  pageState: 'loading',
  resourceID: '',

  isEditing: false,
  editorText: '',
  introductionErrorText: '',
  hasPermission: true,
};

const Model: ResourceInfoPageModelType = {
  namespace: 'resourceInfoPage',

  state: initStates,

  effects: {
    * onChangeInfo(action: OnChangeInfoAction, { call, put, select }: EffectsCommandMap) {
      // yield put({type: 'save'});

      const params: Parameters<typeof FServiceAPI.Resource.update>[0] = {
        ...action.payload,
        resourceId: action.id,
      };
      yield call(FServiceAPI.Resource.update, params);
      yield put<FetchDataSourceAction>({
        type: 'resourceInfo/fetchDataSource',
        payload: action.id,
      });
    },
    * initModelStates({}: InitModelStatesAction, { put }: EffectsCommandMap) {
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
    onChangeIsEditing(state: ResourceInfoPageModelState, action: OnChangeIsEditingAction): ResourceInfoPageModelState {
      return {
        ...state,
        isEditing: action.payload,
      };
    },
    onChangeEditor(state: ResourceInfoPageModelState, action: OnChangeEditorAction): ResourceInfoPageModelState {
      return {
        ...state,
        editorText: action.payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {
    },
  },

};

export default Model;
