import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState, ResourceVersionCreatorPageModelState, UserModelState } from '@/models/connect';
// import { history } from 'umi';
import { FServiceAPI } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';
import userPermission from '@/permissions/UserPermission';
import { getFilesSha1Info } from '@/utils/service';

// import { IResourceCreateVersionDraftType } from '@/type/resourceTypes';

export interface ResourceCreatorPageModelState {
  userInfo: {
    userID: number;
    userName: string;
  } | null;

  step: 1 | 2 | 3 | 4;

  step1_resourceType: {
    value: string;
    labels: string[];
    customInput?: string;
  } | null;
  step1_resourceName: string;
  step1_createdResourceInfo: {
    resourceID: string;
    resourceName: string;
    resourceTypeCode: string;
    resourceType: string[];
  } | null;

  step2_fileInfo: {
    name: string;
    sha1: string;
    from: string;
  } | null;
  step2_rawProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
  step2_rawPropertiesState: 'parsing' | 'success' | 'fail';
  step2_additionalProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
  step2_customProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
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

export interface OnChange_step1_resourceType_Action extends AnyAction {
  type: 'resourceCreatorPage/onChange_step1_resourceType';
  payload: {
    value: ResourceCreatorPageModelState['step1_resourceType'];
  };
}

export interface OnChange_step1_resourceName_Action extends AnyAction {
  type: 'resourceCreatorPage/onChange_step1_resourceName';
  payload: {
    value: ResourceCreatorPageModelState['step1_resourceName'];
  };
}

export interface OnClick_step1_createBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_step1_createBtn';
}

export interface OnSucceed_step2_localUpload_Action extends AnyAction {
  type: 'resourceCreatorPage/onSucceed_step2_localUpload';
  payload: {
    value: NonNullable<ResourceCreatorPageModelState['step2_fileInfo']>;
  };
}

export interface OnClick_step2_skipBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_step2_skipBtn';
}

export interface OnClick_step2_submitBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_step2_submitBtn';
}

export interface OnClick_step3_addPolicyBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_step3_addPolicyBtn';
}

export interface OnClick_step3_skipBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_step3_skipBtn';
}

export interface OnClick_step3_submitBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_step3_submitBtn';
}

export interface OnClick_step4_preBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_step4_preBtn';
}

export interface OnClick_step4_submitBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_step4_submitBtn';
}

export interface ResourceCreatorPageModelType {
  namespace: 'resourceCreatorPage';
  state: ResourceCreatorPageModelState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    onChange_step1_resourceType: (action: OnChange_step1_resourceType_Action, effects: EffectsCommandMap) => void;
    onChange_step1_resourceName: (action: OnChange_step1_resourceName_Action, effects: EffectsCommandMap) => void;
    onClick_step1_createBtn: (action: OnClick_step1_createBtn_Action, effects: EffectsCommandMap) => void;
    onSucceed_step2_localUpload: (action: OnSucceed_step2_localUpload_Action, effects: EffectsCommandMap) => void;
    onClick_step2_skipBtn: (action: OnClick_step2_skipBtn_Action, effects: EffectsCommandMap) => void;
    onClick_step2_submitBtn: (action: OnClick_step2_submitBtn_Action, effects: EffectsCommandMap) => void;
    onClick_step3_addPolicyBtn: (action: OnClick_step3_addPolicyBtn_Action, effects: EffectsCommandMap) => void;
    onClick_step3_skipBtn: (action: OnClick_step3_skipBtn_Action, effects: EffectsCommandMap) => void;
    onClick_step3_submitBtn: (action: OnClick_step3_submitBtn_Action, effects: EffectsCommandMap) => void;
    onClick_step4_preBtn: (action: OnClick_step4_preBtn_Action, effects: EffectsCommandMap) => void;
    onClick_step4_submitBtn: (action: OnClick_step4_submitBtn_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceCreatorPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

export const initStates: ResourceCreatorPageModelState = {
  userInfo: null,

  step: 1,

  step1_resourceType: null,
  step1_resourceName: 'newResource',
  step1_createdResourceInfo: null,

  step2_fileInfo: null,
  step2_rawProperties: [],
  step2_rawPropertiesState: 'parsing',
  step2_additionalProperties: [],
  step2_customProperties: [],
};

const Model: ResourceCreatorPageModelType = {
  namespace: 'resourceCreatorPage',
  state: initStates,
  effects: {
    * onMount_Page({}: OnMount_Page_Action, { call, put }: EffectsCommandMap) {
      const data: UserModelState['info'] = yield call(userPermission.getUserInfo);
      // console.log(data, 'dataisdjflksdjflkdsjlkj');
      if (!data) {
        return;
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          userInfo: {
            userID: data.userId,
            userName: data.username,
          },
        },
      });
    },
    * onUnmount_Page({}: OnUnmount_Page_Action, { put }: EffectsCommandMap) {

    },
    * onChange_step1_resourceType({ payload }: OnChange_step1_resourceType_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step1_resourceType: payload.value,
        },
      });
    },
    * onChange_step1_resourceName({ payload }: OnChange_step1_resourceName_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step1_resourceName: payload.value,
        },
      });
    },
    * onClick_step1_createBtn({}: OnClick_step1_createBtn_Action, { select, call, put }: EffectsCommandMap) {
      const { resourceCreatorPage } = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));
      if (resourceCreatorPage.resourceTypeCodes === null) {
        return;
      }
      const params: Parameters<typeof FServiceAPI.Resource.create>[0] = {
        name: resourceCreatorPage.step1_resourceName,
        resourceTypeCode: resourceCreatorPage.step1_resourceType.value,
        resourceTypeName: resourceCreatorPage.step1_resourceType.customInput || undefined,
      };
      const { ret, errCode, msg, data }: {
        ret: number;
        errCode: number;
        msg: string;
        data: {
          resourceId: string;
          resourceName: string;
          resourceType: string[]
          resourceTypeCode: string;
        };
      } = yield call(FServiceAPI.Resource.create, params);
      // console.log(data, 'dataiosdjflkjsdlkfjlksdjlk');
      if (ret !== 0 || errCode !== 0 || !data) {
        self._czc?.push(['_trackEvent', '资源创建页', '创建资源', '', 0]);
        // fMessage('资源创建失败', 'error');
        fMessage(msg, 'error');
        return;
      }
      self._czc?.push(['_trackEvent', '资源创建页', '创建资源', '', 1]);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step: 2,
          step1_createdResourceInfo: {
            resourceID: data.resourceId,
            resourceName: data.resourceName,
            resourceType: data.resourceType,
            resourceTypeCode: data.resourceTypeCode,
          },
        },
      });
    },
    * onSucceed_step2_localUpload({ payload }: OnSucceed_step2_localUpload_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_fileInfo: payload.value,
        },
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_rawPropertiesState: 'parsing',
        },
      });

      const params0: Parameters<typeof getFilesSha1Info>[0] = {
        sha1: [payload.value.sha1],
        resourceTypeCode: resourceCreatorPage.step1_createdResourceInfo?.resourceTypeCode || '',
      };
      const {
        result,
        error,
      }: Awaited<ReturnType<typeof getFilesSha1Info>> = yield call(getFilesSha1Info, params0);

      // console.log(result, 'resulte53452sdf', error, 'error asdfsdfsdfsdf');

      if (error !== '') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            step2_rawProperties: [],
            step2_additionalProperties: [],
          },
        });
        return fMessage(error, 'error');
      }

      if (result[0].state === 'fail') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            step2_rawProperties: [],
            step2_additionalProperties: [],
          },
        });
        return fMessage('文件解析失败', 'error');
      }

      // if (payload.delay) {
      //   yield call(FUtil.Tool.promiseSleep, 1000);
      // }

      if (result[0].state === 'success') {

        // const params: Parameters<typeof FServiceAPI.Resource.lookDraft>[0] = {
        //   resourceId: resourceVersionCreatorPage.resourceInfo?.resourceID || '',
        // };
        // const { data: data_draft }: {
        //   data: null | {
        //     draftData: IResourceCreateVersionDraftType;
        //   };
        // } = yield call(FServiceAPI.Resource.lookDraft, params);

        yield put<ChangeAction>({
          type: 'change',
          payload: {
            step2_rawProperties: result[0].info
              .filter((i) => {
                return i.insertMode === 1;
              })
              .map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((i) => {
                return {
                  key: i.key,
                  name: i.name,
                  value: i.valueDisplay,
                  description: i.remark,
                };
              }),
            step2_rawPropertiesState: 'success',
            step2_additionalProperties: result[0].info
              .filter((i) => {
                return i.insertMode === 2;
              })
              .map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((i) => {
                // const item = data_draft?.draftData.additionalProperties?.find((ap) => {
                //   return ap.key === i.key;
                // }) || {};
                return {
                  key: i.key,
                  name: i.name,
                  value: i.valueDisplay,
                  description: i.remark,
                  // ...item,
                };
              }),
          },
        });
      }
    },
    * onClick_step2_skipBtn({}: OnClick_step2_skipBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step: 3,
        },
      });
    },
    * onClick_step2_submitBtn({}: OnClick_step2_submitBtn_Action, { select, call, put }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));

      if (!resourceCreatorPage.step1_createdResourceInfo || !resourceCreatorPage.step2_fileInfo) {
        return;
      }

      const params: Parameters<typeof FServiceAPI.Resource.createVersion>[0] = {
        resourceId: resourceCreatorPage.step1_createdResourceInfo.resourceID,
        version: '1.0.0',
        fileSha1: resourceCreatorPage.step2_fileInfo.sha1,
        filename: resourceCreatorPage.step2_fileInfo.name,
        resolveResources: [],
        inputAttrs: [],
        // baseUpcastResources: baseUpcastResources.map((r) => {
        //   return { resourceId: r.resourceID };
        // }),
        // dependencies: dependencies,
        // resolveResources: resolveResources,
        // @ts-ignore
        // inputAttrs: resourceVersionCreatorPage.additionalProperties
        //   .filter((ap) => {
        //     return ap.value !== '';
        //   })
        //   .map((ap) => {
        //     return {
        //       key: ap.key,
        //       value: ap.value,
        //     };
        //   }),
        // customPropertyDescriptors: [
        //   ...resourceVersionCreatorPage.customProperties
        //     .map<NonNullable<Parameters<typeof FServiceAPI.Resource.createVersion>[0]['customPropertyDescriptors']>[number]>
        //     ((i) => {
        //       return {
        //         type: 'readonlyText',
        //         key: i.key,
        //         name: i.name,
        //         remark: i.description,
        //         defaultValue: i.value,
        //       };
        //     }),
        //   ...resourceVersionCreatorPage.customConfigurations
        //     .map<NonNullable<Parameters<typeof FServiceAPI.Resource.createVersion>[0]['customPropertyDescriptors']>[number]>((i) => {
        //       const isInput: boolean = i.type === 'input';
        //       const options: string[] = i.select;
        //       return {
        //         type: isInput ? 'editableText' : 'select',
        //         key: i.key,
        //         name: i.name,
        //         remark: i.description,
        //         defaultValue: isInput ? i.input : options[0],
        //         // defaultValue: isInput ? i.input : '',
        //         candidateItems: isInput ? undefined : options,
        //       };
        //     }),
        // ],
        // description: resourceVersionCreatorPage.descriptionEditorState.toHTML() === '<p></p>'
        //   ? ''
        //   : resourceVersionCreatorPage.descriptionEditorState.toHTML(),
      };

      const { ret, errCode, data, msg } = yield call(FServiceAPI.Resource.createVersion, params);

      if (ret !== 0 || errCode !== 0 || !data) {
        self._czc?.push(['_trackEvent', '版本发行页', '发行', '', 0]);
        // fMessage('创建失败', 'error');
        fMessage(msg, 'error');
        return;
      }
      self._czc?.push(['_trackEvent', '版本发行页', '发行', '', 1]);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step: 3,
        },
      });
    },
    * onClick_step3_addPolicyBtn({}: OnClick_step3_addPolicyBtn_Action, {}: EffectsCommandMap) {

    },
    * onClick_step3_skipBtn({}: OnClick_step3_skipBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step: 4,
        },
      });
    },
    * onClick_step3_submitBtn({}: OnClick_step3_submitBtn_Action, {}: EffectsCommandMap) {

    },
    * onClick_step4_preBtn({}: OnClick_step4_preBtn_Action, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step: 3,
        },
      });
    },
    * onClick_step4_submitBtn({}: OnClick_step4_submitBtn_Action, {}: EffectsCommandMap) {

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
