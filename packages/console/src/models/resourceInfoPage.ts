import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { ConnectState } from '@/models/connect';
import { OnUpdate_Data_Action } from '@/models/resourceSider';

export interface ResourceInfoPageModelState {
  pageState: 'loading' | 'loaded';
  resourceID: string;
  resourceInfo: {
    coverImages: string[];
    resourceName: string;
    resourceTitle: string;
    resourceType: string[];
    intro: string;
    tags: string[];
  } | null;

  title_IsEditing: boolean;
  title_Input: string;
  title_Error: string;

  introduction_IsEditing: boolean;
  introduction_EditorText: string;
  introduction_EditorText_Error: string;

  hasPermission: boolean;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceInfoPage/change';
  payload: Partial<ResourceInfoPageModelState>;
}

export interface OnMount_Page_Action extends AnyAction {
  type: 'resourceInfoPage/onMount_Page';
  payload: {
    resourceID: string;
  };
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'resourceInfoPage/onUnmount_Page';
}

export interface OnClick_EditTitleBtn_Action extends AnyAction {
  type: 'resourceInfoPage/onClick_EditTitleBtn';
}

export interface OnClick_CancelEditTitleBtn_Action extends AnyAction {
  type: 'resourceInfoPage/onClick_CancelEditTitleBtn';
}

export interface OnClick_SaveTitleBtn_Action extends AnyAction {
  type: 'resourceInfoPage/onClick_SaveEditTitleBtn';
}

export interface OnChange_TitleInput_Action extends AnyAction {
  type: 'resourceInfoPage/onChange_TitleInput';
  payload: {
    value: string;
  };
}

export interface OnClick_AddIntroductionBtn_Action extends AnyAction {
  type: 'resourceInfoPage/onClick_AddIntroductionBtn';
}

export interface OnClick_EditIntroductionBtn_Action extends AnyAction {
  type: 'resourceInfoPage/onClick_EditIntroductionBtn';
}

export interface OnClick_SaveIntroductionBtn_Action extends AnyAction {
  type: 'resourceInfoPage/onClick_SaveIntroductionBtn';
}

export interface OnClick_CancelEditIntroductionBtn_Action extends AnyAction {
  type: 'resourceInfoPage/onClick_CancelEditIntroductionBtn';
}

export interface OnChange_IntroductionEditor_Action extends AnyAction {
  type: 'resourceInfoPage/onChange_IntroductionEditor';
  payload: {
    value: string;
  };
}

export interface OnChange_Cover_Action extends AnyAction {
  type: 'resourceInfoPage/onChange_Cover';
  payload: {
    value: string;
  };
}

export interface OnChange_Labels_Action extends AnyAction {
  type: 'resourceInfoPage/onChange_Labels';
  payload: {
    value: string[];
  };
}

// export interface OnChangeIsEditingAction extends AnyAction {
//   type: 'resourceInfoPage/onChangeIsEditing',
//   payload: boolean;
// }

export interface OnChangeEditorAction extends AnyAction {
  type: 'resourceInfoPage/onChangeEditor',
  payload: string;
}

// export interface OnChangeInfoAction extends AnyAction {
//   type: 'resourceInfoPage/onChangeInfo',
//   payload: Partial<ResourceInfoModelState['info']>;
//   id: string;
// }

export interface ResourceInfoPageModelType {
  namespace: 'resourceInfoPage';
  state: ResourceInfoPageModelState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;

    onClick_EditTitleBtn: (action: OnClick_EditTitleBtn_Action, effects: EffectsCommandMap) => void;
    onClick_CancelEditTitleBtn: (action: OnClick_CancelEditTitleBtn_Action, effects: EffectsCommandMap) => void;
    onClick_SaveEditTitleBtn: (action: OnClick_SaveTitleBtn_Action, effects: EffectsCommandMap) => void;
    onChange_TitleInput: (action: OnChange_TitleInput_Action, effects: EffectsCommandMap) => void;

    onClick_AddIntroductionBtn: (action: OnClick_AddIntroductionBtn_Action, effects: EffectsCommandMap) => void;
    onClick_EditIntroductionBtn: (action: OnClick_EditIntroductionBtn_Action, effects: EffectsCommandMap) => void;
    onClick_SaveIntroductionBtn: (action: OnClick_SaveIntroductionBtn_Action, effects: EffectsCommandMap) => void;
    onClick_CancelEditIntroductionBtn: (action: OnClick_CancelEditIntroductionBtn_Action, effects: EffectsCommandMap) => void;
    onChange_IntroductionEditor: (action: OnChange_IntroductionEditor_Action, effects: EffectsCommandMap) => void;
    onChange_Cover: (action: OnChange_Cover_Action, effects: EffectsCommandMap) => void;
    onChange_Labels: (action: OnChange_Labels_Action, effects: EffectsCommandMap) => void;

    // onChangeInfo: (action: OnChangeInfoAction, effects: EffectsCommandMap) => void;
    // initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceInfoPageModelState, ChangeAction>;
    // onChangeIsEditing: DvaReducer<ResourceInfoPageModelState, OnChangeIsEditingAction>;
    // onChangeEditor: DvaReducer<ResourceInfoPageModelState, OnChangeEditorAction>;
  };
  subscriptions: { setup: Subscription };
}

const initStates: ResourceInfoPageModelState = {
  pageState: 'loading',
  resourceID: '',
  resourceInfo: null,

  title_IsEditing: false,
  title_Input: '',
  title_Error: '',

  introduction_IsEditing: false,
  introduction_EditorText: '',
  introduction_EditorText_Error: '',

  hasPermission: true,
};

const Model: ResourceInfoPageModelType = {
  namespace: 'resourceInfoPage',

  state: initStates,

  effects: {
    * onMount_Page({ payload }: OnMount_Page_Action, { put, call }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceID: payload.resourceID,
          pageState: 'loading',
        },
      });

      const params: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: payload.resourceID,
        isLoadPolicyInfo: 1,
        isTranslate: 1,
      };
      const { data: data_resourceInfo }: {
        ret: number;
        errCode: number;
        msg: string;
        data: {
          coverImages: string[];
          resourceName: string;
          resourceTitle: string;
          resourceType: string[];
          intro: string;
          tags: string[];
        }
      } = yield call(FServiceAPI.Resource.info, params);
      yield call(FUtil.Tool.promiseSleep, 1000);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceInfo: {
            coverImages: data_resourceInfo.coverImages,
            resourceName: data_resourceInfo.resourceName,
            resourceType: data_resourceInfo.resourceType,
            resourceTitle: data_resourceInfo.resourceTitle,
            intro: data_resourceInfo.intro,
            tags: data_resourceInfo.tags,
          },
          pageState: 'loaded',
        },
      });
    },
    * onUnmount_Page({}: OnUnmount_Page_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },

    * onClick_EditTitleBtn({}: OnClick_EditTitleBtn_Action, { select, put }: EffectsCommandMap) {
      const { resourceInfoPage } = yield select(({ resourceInfoPage }: ConnectState) => ({
        resourceInfoPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          title_IsEditing: true,
          title_Input: resourceInfoPage.resourceInfo.resourceTitle,
          title_Error: '',
        },
      });
    },
    * onClick_CancelEditTitleBtn({}: OnClick_CancelEditTitleBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          title_IsEditing: false,
        },
      });
    },
    * onClick_SaveEditTitleBtn({}: OnClick_SaveTitleBtn_Action, {select, call, put}: EffectsCommandMap) {
      const { resourceInfoPage } = yield select(({ resourceInfoPage }: ConnectState) => ({
        resourceInfoPage,
      }));

      const params: Parameters<typeof FServiceAPI.Resource.update>[0] = {
        resourceId: resourceInfoPage.resourceID,
        // @ts-ignore
        resourceTitle: resourceInfoPage.title_Input,
      };
      yield call(FServiceAPI.Resource.update, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceInfo: {
            ...resourceInfoPage.resourceInfo,
            resourceTitle: resourceInfoPage.title_Input,
          },
          title_IsEditing: false,
        },
      });
    },
    * onChange_TitleInput({ payload }: OnChange_TitleInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          title_Input: payload.value,
        },
      });
    },

    * onClick_AddIntroductionBtn({}: OnClick_AddIntroductionBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          introduction_IsEditing: true,
        },
      });
    },
    * onClick_EditIntroductionBtn({}: OnClick_EditIntroductionBtn_Action, { select, put }: EffectsCommandMap) {
      const { resourceInfoPage } = yield select(({ resourceInfoPage }: ConnectState) => ({
        resourceInfoPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          introduction_IsEditing: true,
          introduction_EditorText: resourceInfoPage.resourceInfo?.intro || '',
        },
      });
    },
    * onClick_SaveIntroductionBtn({}: OnClick_SaveIntroductionBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      // console.log(' *********88888))))');
      const { resourceInfoPage } = yield select(({ resourceInfoPage }: ConnectState) => ({
        resourceInfoPage,
      }));

      const params: Parameters<typeof FServiceAPI.Resource.update>[0] = {
        resourceId: resourceInfoPage.resourceID,
        intro: resourceInfoPage.introduction_EditorText,
      };
      yield call(FServiceAPI.Resource.update, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceInfo: {
            ...resourceInfoPage.resourceInfo,
            intro: resourceInfoPage.introduction_EditorText.trim(),
          },
          introduction_IsEditing: false,
        },
      });

    },
    * onClick_CancelEditIntroductionBtn({}: OnClick_CancelEditIntroductionBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          introduction_IsEditing: false,
          introduction_EditorText: '',
          introduction_EditorText_Error: '',
        },
      });
    },
    * onChange_IntroductionEditor({ payload }: OnChange_IntroductionEditor_Action, { put }: EffectsCommandMap) {
      //     editorText: e.target.value,
      //     introductionErrorText: e.target.value.length > 1000 ? '不多于1000个字符' : '',
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          introduction_EditorText: payload.value,
          introduction_EditorText_Error: payload.value.length > 1000 ? '不多于1000个字符' : '',
        },
      });
    },
    * onChange_Cover({ payload }: OnChange_Cover_Action, { select, call, put }: EffectsCommandMap) {
      const { resourceInfoPage } = yield select(({ resourceInfoPage }: ConnectState) => ({
        resourceInfoPage,
      }));

      const params: Parameters<typeof FServiceAPI.Resource.update>[0] = {
        resourceId: resourceInfoPage.resourceID,
        coverImages: [payload.value],
      };
      yield call(FServiceAPI.Resource.update, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceInfo: {
            ...resourceInfoPage.resourceInfo,
            coverImages: [payload.value],
          },
        },
      });

      yield put<OnUpdate_Data_Action>({
        type: 'resourceSider/onUpdate_Data',
        // payload: resourceInfoPage.resourceID,
      });
    },
    * onChange_Labels({ payload }: OnChange_Labels_Action, { select, call, put }: EffectsCommandMap) {
      const { resourceInfoPage } = yield select(({ resourceInfoPage }: ConnectState) => ({
        resourceInfoPage,
      }));

      const params: Parameters<typeof FServiceAPI.Resource.update>[0] = {
        resourceId: resourceInfoPage.resourceID,
        tags: payload.value,
      };
      yield call(FServiceAPI.Resource.update, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceInfo: {
            ...resourceInfoPage.resourceInfo,
            tags: payload.value,
          },
        },
      });
    },

    // * onChangeInfo(action: OnChangeInfoAction, { call, put, select }: EffectsCommandMap) {
    //   // yield put({type: 'save'});
    //
    //   const params: Parameters<typeof FServiceAPI.Resource.update>[0] = {
    //     ...action.payload,
    //     resourceId: action.id,
    //   };
    //   yield call(FServiceAPI.Resource.update, params);
    //   yield put<FetchDataSourceAction>({
    //     type: 'resourceInfo/fetchDataSource',
    //     payload: action.id,
    //   });
    // },
    // * initModelStates({}: InitModelStatesAction, { put }: EffectsCommandMap) {
    //   yield put<ChangeAction>({
    //     type: 'change',
    //     payload: initStates,
    //   });
    // },
  },

  reducers: {
    change(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // onChangeIsEditing(state: ResourceInfoPageModelState, action: OnChangeIsEditingAction): ResourceInfoPageModelState {
    //   return {
    //     ...state,
    //     isEditing: action.payload,
    //   };
    // },
    // onChangeEditor(state: ResourceInfoPageModelState, action: OnChangeEditorAction): ResourceInfoPageModelState {
    //   return {
    //     ...state,
    //     editorText: action.payload,
    //   };
    // },
  },

  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {
    },
  },

};

export default Model;
