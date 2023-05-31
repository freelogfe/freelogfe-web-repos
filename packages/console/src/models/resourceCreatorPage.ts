import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState } from '@/models/connect';
import { history } from 'umi';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';

export interface ResourceCreatorPageModelState {
  userName: string;

  name: string;
  nameVerify: 'none' | 'validating' | 'error' | 'success';
  nameErrorText: string;

  resourceTypeCodes: {
    value: string;
    labels: string[];
    customInput?: string;
  } | null;

  introduction: string;
  introductionErrorText: string;

  cover: string;
  labels: string[];

  dataIsDirty: boolean;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceCreatorPage/change',
  payload: Partial<ResourceCreatorPageModelState>;
}

export interface OnMount_Page_Action extends AnyAction {
  type: 'resourceCreatorPage/onMount_Page';
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'resourceCreatorPage/onUnmount_Page';
}

export interface OnClick_CreateBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_CreateBtn';
}

export interface OnChange_NameInput_Action extends AnyAction {
  type: 'resourceCreatorPage/onChange_NameInput';
  payload: {
    value: ResourceCreatorPageModelState['name'],
  };
}

export interface OnVerify_NameInput_Action extends AnyAction {
  type: 'resourceCreatorPage/onVerify_NameInput';
  // payload: ResourceCreatorPageModelState['name'];
}

export interface OnChange_ResourceTypeCodes_Action extends AnyAction {
  type: 'resourceCreatorPage/onChange_ResourceTypeCodes';
  payload: {
    value: ResourceCreatorPageModelState['resourceTypeCodes'],
  };
}

export interface OnChange_IntroductionInput_Action extends AnyAction {
  type: 'resourceCreatorPage/onChange_IntroductionInput';
  payload: {
    value: ResourceCreatorPageModelState['introduction'],
  };
}

export interface OnChange_Cover_Action extends AnyAction {
  type: 'resourceCreatorPage/onChange_Cover';
  payload: {
    value: ResourceCreatorPageModelState['cover'],
  };
}

export interface OnChange_Labels_Action extends AnyAction {
  type: 'resourceCreatorPage/onChange_Labels';
  payload: {
    value: ResourceCreatorPageModelState['labels'],
  };
}

export interface ResourceCreatorPageModelType {
  namespace: 'resourceCreatorPage';
  state: ResourceCreatorPageModelState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;

    onClick_CreateBtn: (action: OnClick_CreateBtn_Action, effects: EffectsCommandMap) => void;

    onChange_NameInput: (action: OnChange_NameInput_Action, effects: EffectsCommandMap) => void;
    onVerify_NameInput: (action: OnVerify_NameInput_Action, effects: EffectsCommandMap) => void;
    onChange_ResourceTypeCodes: (action: OnChange_ResourceTypeCodes_Action, effects: EffectsCommandMap) => void;
    onChange_IntroductionInput: (action: OnChange_IntroductionInput_Action, effects: EffectsCommandMap) => void;
    onChange_Cover: (action: OnChange_Cover_Action, effects: EffectsCommandMap) => void;
    onChange_Labels: (action: OnChange_Labels_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceCreatorPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

export const initStates: ResourceCreatorPageModelState = {
  userName: '',

  name: '',
  nameVerify: 'none',
  nameErrorText: '',

  resourceTypeCodes: null,

  introduction: '',
  introductionErrorText: '',

  cover: '',

  labels: [],

  // promptLeavePath: '',
  dataIsDirty: false,
};

const Model: ResourceCreatorPageModelType = {
  namespace: 'resourceCreatorPage',
  state: initStates,
  effects: {
    * onMount_Page({}: OnMount_Page_Action, { call, put }: EffectsCommandMap) {
      const { data } = yield call(FServiceAPI.User.currentUserInfo);
      // console.log(data, 'DDDDDDDD');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          userName: data.username,
        },
      });
    },
    * onUnmount_Page({}: OnUnmount_Page_Action, { put }: EffectsCommandMap) {
      self.onbeforeunload = null;
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * onClick_CreateBtn({}: OnClick_CreateBtn_Action, { select, call, put }: EffectsCommandMap) {
      self.onbeforeunload = null;
      const { resourceCreatorPage } = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));
      if (resourceCreatorPage.resourceTypeCodes === null) {
        return;
      }
      const params: Parameters<typeof FServiceAPI.Resource.create>[0] = {
        name: resourceCreatorPage.name,
        // resourceTypeCode: resourceCreatorPage.resourceTypeCodes[resourceCreatorPage.resourceTypeCodes.length - 1],
        resourceTypeCode: resourceCreatorPage.resourceTypeCodes.value,
        resourceTypeName: resourceCreatorPage.resourceTypeCodes.customInput || undefined,
        policies: [],
        coverImages: resourceCreatorPage.cover ? [resourceCreatorPage.cover] : [],
        intro: resourceCreatorPage.introduction,
        tags: resourceCreatorPage.labels,
      };
      const { ret, errCode, data } = yield call(FServiceAPI.Resource.create, params);
      if (ret !== 0 || errCode !== 0 || !data) {
        self._czc?.push(['_trackEvent', '资源创建页', '创建资源', '', 0]);
        fMessage('资源创建失败', 'error');
        return;
      }
      self._czc?.push(['_trackEvent', '资源创建页', '创建资源', '', 1]);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: false,
        },
      });
      self.onbeforeunload = null;

      setTimeout(() => {
        // history.replace(FUtil.LinkTo.resourceCreateSuccess({
        //   resourceID: data.resourceId,
        // }));
        fMessage(FI18n.i18nNext.t('resource_created_successfully'), 'success');
        history.replace(FUtil.LinkTo.resourceCreateVersion({
          resourceID: data.resourceId,
        }));
      });

    },
    * onChange_NameInput({ payload }: OnChange_NameInput_Action, { put, call, select }: EffectsCommandMap) {
      // console.log(payload, 'payload (((((())))))');

      let nameErrorText: string = '';
      if (!payload.value) {
        nameErrorText = '请输入资源名称';
      } else if (payload.value.length > 60) {
        nameErrorText = '不多于60个字符';
      } else if (!FUtil.Regexp.RESOURCE_NAME.test(payload.value)) {
        // nameErrorText = `不符合正则 ${FUtil.Regexp.RESOURCE_NAME}`;
        nameErrorText = FI18n.i18nNext.t('naming_convention_resource_name');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          name: payload.value,
          nameVerify: nameErrorText !== '' ? 'error' : 'none',
          nameErrorText,
          dataIsDirty: true,
        },
      });
      self.onbeforeunload = () => true;
    },
    * onVerify_NameInput({}: OnVerify_NameInput_Action, { select, call, put }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));

      if (resourceCreatorPage.name === '' || resourceCreatorPage.nameErrorText !== '') {
        return;
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nameVerify: 'validating',
        },
      });

      let nameErrorText: string = '';

      const params1: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: encodeURIComponent(`${resourceCreatorPage.userName}/${resourceCreatorPage.name}`),
      };
      const { data: data_info } = yield call(FServiceAPI.Resource.info, params1);
      if (!!data_info) {
        nameErrorText = '资源名已存在';
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nameErrorText,
          nameVerify: nameErrorText !== '' ? 'error' : 'success',
        },
      });

    },
    * onChange_ResourceTypeCodes({ payload }: OnChange_ResourceTypeCodes_Action, { select, put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceTypeCodes: payload.value,
          dataIsDirty: true,
        },
      });
      self.onbeforeunload = () => true;
    },
    * onChange_IntroductionInput({ payload }: OnChange_IntroductionInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          introduction: payload.value,
          introductionErrorText: payload.value.length > 1000 ? '不多于1000个字符' : '',
          dataIsDirty: true,
        },
      });
      self.onbeforeunload = () => true;
    },
    * onChange_Cover({ payload }: OnChange_Cover_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          cover: payload.value,
          dataIsDirty: true,
        },
      });
      self.onbeforeunload = () => true;
    },
    * onChange_Labels({ payload }: OnChange_Labels_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          labels: payload.value,
          dataIsDirty: true,
        },
      });
      self.onbeforeunload = () => true;
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
    setup({ dispatch, history }: SubscriptionAPI) {
    },
  },

};

export default Model;
