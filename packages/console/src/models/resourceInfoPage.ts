import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';

export interface ResourceInfoPageModelState {
  info: {
    name: string;
    resourceType: string;
    upthrows: string[];
    introduction: string;
  };
  cover: string;
  labels: string[];
  isEditing: boolean;
  editor: string;
}

export interface ChangeInfoAction extends AnyAction {
  type: 'resourceInfoPage/changeInfoAction',
  payload: ResourceInfoPageModelState['info'];
}

export interface OnChangeIsEditingAction extends AnyAction {
  type: 'resourceInfoPage/onChangeIsEditing',
  payload: boolean;
}

export interface OnChangeEditorAction extends AnyAction {
  type: 'resourceInfoPage/onChangeEditor',
  payload: string;
}

export interface OnChangeCoverAction extends AnyAction {
  type: 'resourceInfoPage/onChangeCover',
  payload: string;
}

export interface OnChangeLabelsAction extends AnyAction {
  type: 'resourceInfoPage/onChangeLabels',
  payload: string[];
}

export interface ResourceInfoPageModelType {
  namespace: 'resourceInfoPage';
  state: ResourceInfoPageModelState;
  effects: {
    fetchDataSource: Effect;
  };
  reducers: {
    changeInfo: DvaReducer<ResourceInfoPageModelState, ChangeInfoAction>;
    onChangeIsEditing: DvaReducer<ResourceInfoPageModelState, OnChangeIsEditingAction>;
    onChangeEditor: DvaReducer<ResourceInfoPageModelState, OnChangeEditorAction>;
    onChangeCover: DvaReducer<ResourceInfoPageModelState, OnChangeCoverAction>;
    onChangeLabels: DvaReducer<ResourceInfoPageModelState, OnChangeLabelsAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceInfoPageModelType = {
  namespace: 'resourceInfoPage',

  state: {
    info: {
      name: 'ww-zh/freelog-waterfall-picture1',
      resourceType: 'image',
      upthrows: ['stefan/image3', 'stefan/image4'],
      introduction: '在经济学界中流传着一篇著名的文章，这篇文章用独特的视角把精彩纷呈的社会分工呈现给大众，这篇文章深刻的阐述了高度的专业化如何带来人类总体福祉的提升，这篇文章揭示了自由选择在人类生产创造过程中的重要意义',
    },
    cover: 'https://cn.bing.com/th?id=OHR.FrederickSound_ZH-CN1838908749_UHD.jpg&pid=hp&w=3840&h=2160&rs=1&c=4&r=0',
    labels: ['123', '456', '789'],
    isEditing: false,
    editor: '',
  },

  effects: {
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      yield put({type: 'save'});
    },
  },

  reducers: {
    changeInfo(state: ResourceInfoPageModelState, action: ChangeInfoAction): ResourceInfoPageModelState {
      return {
        ...state,
        info: action.payload
      };
    },
    onChangeIsEditing(state: ResourceInfoPageModelState, action: OnChangeIsEditingAction): ResourceInfoPageModelState {
      return {
        ...state,
        isEditing: action.payload
      };
    },
    onChangeEditor(state: ResourceInfoPageModelState, action: OnChangeEditorAction): ResourceInfoPageModelState {
      return {
        ...state,
        editor: action.payload
      };
    },
    onChangeCover(state: ResourceInfoPageModelState, action: OnChangeCoverAction): ResourceInfoPageModelState {
      return {
        ...state,
        cover: action.payload
      };
    },
    onChangeLabels(state: ResourceInfoPageModelState, action: OnChangeLabelsAction): ResourceInfoPageModelState {
      return {
        ...state,
        labels: action.payload
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },

};

export default Model;
