import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState, ResourceVersionCreatorPageModelState, UserModelState } from '@/models/connect';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';
import userPermission from '@/permissions/UserPermission';
import { getFilesSha1Info } from '@/utils/service';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import fPolicyBuilder from '@/components/fPolicyBuilder';
import { history } from 'umi';
import { IResourceCreateVersionDraftType } from '@/type/resourceTypes';
import fResourceMarkdownEditor from '@/components/fResourceMarkdownEditor';

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
  step1_resourceName_isVerify: boolean;
  step1_resourceName_errorText: string;
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
  step2_customConfigurations: {
    key: string;
    name: string;
    description: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
  }[];

  step3_policies: PolicyFullInfo_Type[];

  step4_resourceTitle: string;
  step4_resourceCover: string;
  step4_resourceLabels: string[];

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

export interface OnVerify_step1_resourceName_Action extends AnyAction {
  type: 'resourceCreatorPage/onVerify_step1_resourceName';
}

export interface OnClick_step1_createBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_step1_createBtn';
}

export interface OnSucceed_step2_localUpload_Action extends AnyAction {
  type: 'resourceCreatorPage/onSucceed_step2_localUpload';
  payload: {
    fileName: string;
    sha1: string;
  };
}

export interface OnSucceed_step2_storageSpace_Action extends AnyAction {
  type: 'resourceCreatorPage/onSucceed_step2_storageSpace';
  payload: {
    bucketID: string;
    bucketName: string;
    sha1: string;
    objectID: string;
    objectName: string;
  };
}

export interface OnClick_step2_editMarkdownBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_step2_editMarkdownBtn';
}

export interface OnRemove_step2_file_Action extends AnyAction {
  type: 'resourceCreatorPage/onRemove_step2_file';
}

export interface OnChange_step2_customProperties_Action extends AnyAction {
  type: 'resourceCreatorPage/onChange_step2_customProperties';
  payload: {
    value: ResourceCreatorPageModelState['step2_customProperties']
  };
}

export interface OnChange_step2_additionalProperties_Action extends AnyAction {
  type: 'resourceCreatorPage/onChange_step2_additionalProperties';
  payload: {
    value: ResourceCreatorPageModelState['step2_additionalProperties']
  };
}

export interface OnChange_step2_customConfigurations_Action extends AnyAction {
  type: 'resourceCreatorPage/onChange_step2_customConfigurations';
  payload: {
    value: ResourceCreatorPageModelState['step2_customConfigurations']
  };
}

export interface OnClick_step2_submitBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_step2_submitBtn';
}

export interface OnClick_step3_addPolicyBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_step3_addPolicyBtn';
  payload: {
    defaultValue?: { text: string; title: string; };
  };
}

// export interface OnClick_step3_skipBtn_Action extends AnyAction {
//   type: 'resourceCreatorPage/onClick_step3_skipBtn';
// }

export interface OnClick_step3_submitBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_step3_submitBtn';
}

export interface OnChange_step4_resourceTitle_Action extends AnyAction {
  type: 'resourceCreatorPage/onChange_step4_resourceTitle';
  payload: {
    value: ResourceCreatorPageModelState['step4_resourceTitle']
  };
}

export interface OnChange_step4_resourceCover_Action extends AnyAction {
  type: 'resourceCreatorPage/onChange_step4_resourceCover';
  payload: {
    value: ResourceCreatorPageModelState['step4_resourceCover']
  };
}

export interface OnChange_step4_resourceLabels_Action extends AnyAction {
  type: 'resourceCreatorPage/onChange_step4_resourceLabels';
  payload: {
    value: ResourceCreatorPageModelState['step4_resourceLabels']
  };
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
    onVerify_step1_resourceName: (action: OnVerify_step1_resourceName_Action, effects: EffectsCommandMap) => void;
    onClick_step1_createBtn: (action: OnClick_step1_createBtn_Action, effects: EffectsCommandMap) => void;
    onSucceed_step2_localUpload: (action: OnSucceed_step2_localUpload_Action, effects: EffectsCommandMap) => void;
    onSucceed_step2_storageSpace: (action: OnSucceed_step2_storageSpace_Action, effects: EffectsCommandMap) => void;
    onClick_step2_editMarkdownBtn: (action: OnClick_step2_editMarkdownBtn_Action, effects: EffectsCommandMap) => void;
    onRemove_step2_file: (action: OnRemove_step2_file_Action, effects: EffectsCommandMap) => void;
    onChange_step2_additionalProperties: (action: OnChange_step2_additionalProperties_Action, effects: EffectsCommandMap) => void;
    onChange_step2_customProperties: (action: OnChange_step2_customProperties_Action, effects: EffectsCommandMap) => void;
    onChange_step2_customConfigurations: (action: OnChange_step2_customConfigurations_Action, effects: EffectsCommandMap) => void;
    onClick_step2_submitBtn: (action: OnClick_step2_submitBtn_Action, effects: EffectsCommandMap) => void;
    onClick_step3_addPolicyBtn: (action: OnClick_step3_addPolicyBtn_Action, effects: EffectsCommandMap) => void;
    // onClick_step3_skipBtn: (action: OnClick_step3_skipBtn_Action, effects: EffectsCommandMap) => void;
    onClick_step3_submitBtn: (action: OnClick_step3_submitBtn_Action, effects: EffectsCommandMap) => void;
    onChange_step4_resourceTitle: (action: OnChange_step4_resourceTitle_Action, effects: EffectsCommandMap) => void;
    onChange_step4_resourceCover: (action: OnChange_step4_resourceCover_Action, effects: EffectsCommandMap) => void;
    onChange_step4_resourceLabels: (action: OnChange_step4_resourceLabels_Action, effects: EffectsCommandMap) => void;
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
  step1_resourceName_isVerify: false,
  step1_resourceName_errorText: '',
  step1_createdResourceInfo: null,

  step2_fileInfo: null,
  // step2_fileInfo_errorTip: '不能超过200M',
  step2_rawProperties: [],
  step2_rawPropertiesState: 'parsing',
  step2_additionalProperties: [],
  step2_customProperties: [],
  step2_customConfigurations: [],

  step3_policies: [],

  step4_resourceTitle: '',
  step4_resourceCover: '',
  step4_resourceLabels: [],
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
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...initStates,
        },
      });
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
          step1_resourceName_errorText: '',
          step1_resourceName_isVerify: true,
        },
      });
    },
    * onVerify_step1_resourceName({}: OnVerify_step1_resourceName_Action, { select, call, put }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));
      let nameErrorText: string = '';
      if (resourceCreatorPage.step1_resourceName === '') {
        nameErrorText = '请输入资源名称';
      } else if (resourceCreatorPage.step1_resourceName.length > 60) {
        nameErrorText = '不多于60个字符';
      } else if (!FUtil.Regexp.RESOURCE_NAME.test(resourceCreatorPage.step1_resourceName)) {
        // nameErrorText = `不符合正则 ${FUtil.Regexp.RESOURCE_NAME}`;
        nameErrorText = FI18n.i18nNext.t('naming_convention_resource_name');
      } else {
        const params1: Parameters<typeof FServiceAPI.Resource.info>[0] = {
          resourceIdOrName: encodeURIComponent(`${resourceCreatorPage.userInfo?.userName}/${resourceCreatorPage.step1_resourceName}`),
        };
        const { data: data_info } = yield call(FServiceAPI.Resource.info, params1);
        if (!!data_info) {
          nameErrorText = '资源名已存在';
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step1_resourceName_isVerify: false,
          step1_resourceName_errorText: nameErrorText,
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
          step2_fileInfo: {
            name: payload.fileName,
            sha1: payload.sha1,
            from: '本地上传',
          },
        },
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_rawPropertiesState: 'parsing',
        },
      });

      const params0: Parameters<typeof getFilesSha1Info>[0] = {
        sha1: [payload.sha1],
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
    * onSucceed_step2_storageSpace({ payload }: OnSucceed_step2_storageSpace_Action, {
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
          step2_fileInfo: {
            name: payload.objectName,
            sha1: payload.sha1,
            from: '存储空间',
          },
        },
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_rawPropertiesState: 'parsing',
        },
      });

      const params0: Parameters<typeof getFilesSha1Info>[0] = {
        sha1: [payload.sha1],
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
    * onClick_step2_editMarkdownBtn({}: OnClick_step2_editMarkdownBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));

      if (!resourceCreatorPage.step1_createdResourceInfo?.resourceID) {
        return;
      }

      const params0: Parameters<typeof FServiceAPI.Resource.lookDraft>[0] = {
        resourceId: resourceCreatorPage.step1_createdResourceInfo.resourceID,
      };
      const { data: data_draft0 }: {
        data: null | {
          resourceId: string;
          updateDate: string;
          draftData: IResourceCreateVersionDraftType;
        };
      } = yield call(FServiceAPI.Resource.lookDraft, params0);

      if (!data_draft0) {
        const draftData: IResourceCreateVersionDraftType = {
          versionInput: '1.0.0',
          selectedFileInfo: null,
          additionalProperties: [],
          customProperties: [],
          customConfigurations: [],
          directDependencies: [],
          descriptionEditorInput: '',
          baseUpcastResources: [],
        };

        const params1: Parameters<typeof FServiceAPI.Resource.saveVersionsDraft>[0] = {
          resourceId: resourceCreatorPage.step1_createdResourceInfo.resourceID,
          draftData: draftData,
        };
        const { ret, errCode, data: data_draft1 }: {
          ret: number;
          errCode: number;
          data: {
            resourceId: string;
            updateDate: string;
            draftData: IResourceCreateVersionDraftType;
          };
        } = yield call(FServiceAPI.Resource.saveVersionsDraft, params1);
      }

      yield call(fResourceMarkdownEditor, {
        resourceID: resourceCreatorPage.step1_createdResourceInfo.resourceID,
        async onChange_Saved(saved: boolean) {
          // set_isMarkdownEditorDirty(!saved);
        },
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_rawPropertiesState: 'parsing',
        },
      });

      const params2: Parameters<typeof FServiceAPI.Resource.lookDraft>[0] = {
        resourceId: resourceCreatorPage.step1_createdResourceInfo.resourceID,
      };
      const { data: data_draft2 }: {
        data: null | {
          resourceId: string;
          updateDate: string;
          draftData: IResourceCreateVersionDraftType;
        };
      } = yield call(FServiceAPI.Resource.lookDraft, params2);

      if (!data_draft2?.draftData.selectedFileInfo) {
        return;
      }

      const params3: Parameters<typeof FServiceAPI.Resource.getResourceBySha1>[0] = {
        fileSha1: data_draft2.draftData.selectedFileInfo.sha1,
      };

      const { data: data_ResourcesBySha1 }: { data: any[] } = yield call(FServiceAPI.Resource.getResourceBySha1, params3);

      const params4: Parameters<typeof getFilesSha1Info>[0] = {
        sha1: [data_draft2.draftData.selectedFileInfo.sha1],
        resourceTypeCode: resourceCreatorPage.step1_createdResourceInfo.resourceTypeCode,
      };
      const {
        result,
        error,
      }: Awaited<ReturnType<typeof getFilesSha1Info>> = yield call(getFilesSha1Info, params4);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_fileInfo: data_draft2.draftData.selectedFileInfo,
          // step2_fileInfo_errorTip: '不能超过200M',
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
              const item = data_draft2.draftData.additionalProperties?.find((ap) => {
                return ap.key === i.key;
              }) || {};
              return {
                key: i.key,
                name: i.name,
                value: i.valueDisplay,
                description: i.remark,
                ...item,
              };
            }),
          step2_customProperties: data_draft2.draftData.customProperties,
          step2_customConfigurations: data_draft2.draftData.customConfigurations,
        },
      });
    },
    * onRemove_step2_file({}: OnRemove_step2_file_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_fileInfo: null,
          step2_rawProperties: [],
          step2_rawPropertiesState: 'parsing',
          step2_additionalProperties: [],
          step2_customProperties: [],
          step2_customConfigurations: [],
        },
      });
    },
    * onChange_step2_additionalProperties({ payload }: OnChange_step2_additionalProperties_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_additionalProperties: payload.value,
        },
      });
    },
    * onChange_step2_customProperties({ payload }: OnChange_step2_customProperties_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_customProperties: payload.value,
        },
      });
    },
    * onChange_step2_customConfigurations({ payload }: OnChange_step2_customConfigurations_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_customConfigurations: payload.value,
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
        baseUpcastResources: [],
        dependencies: [],
        resolveResources: [],
        inputAttrs: resourceCreatorPage.step2_additionalProperties
          .filter((ap) => {
            return ap.value !== '';
          })
          .map((ap) => {
            return {
              key: ap.key,
              value: ap.value,
            };
          }),
        customPropertyDescriptors: [
          ...resourceCreatorPage.step2_customProperties
            .map<NonNullable<Parameters<typeof FServiceAPI.Resource.createVersion>[0]['customPropertyDescriptors']>[number]>
            ((i) => {
              return {
                type: 'readonlyText',
                key: i.key,
                name: i.name,
                remark: i.description,
                defaultValue: i.value,
              };
            }),
          ...resourceCreatorPage.step2_customConfigurations
            .map<NonNullable<Parameters<typeof FServiceAPI.Resource.createVersion>[0]['customPropertyDescriptors']>[number]>((i) => {
              const isInput: boolean = i.type === 'input';
              const options: string[] = i.select;
              return {
                type: isInput ? 'editableText' : 'select',
                key: i.key,
                name: i.name,
                remark: i.description,
                defaultValue: isInput ? i.input : options[0],
                // defaultValue: isInput ? i.input : '',
                candidateItems: isInput ? undefined : options,
              };
            }),
        ],
        description: '',
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
    * onClick_step3_addPolicyBtn({ payload }: OnClick_step3_addPolicyBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      self._czc?.push(['_trackEvent', '授权信息页', '添加授权策略', '', 1]);
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));
      const parmas: Parameters<typeof fPolicyBuilder>[0] = {
        targetType: 'resource',
        alreadyUsedTexts: resourceCreatorPage.step3_policies.map<string>((ip) => {
          return ip.policyText;
        }),
        alreadyUsedTitles: resourceCreatorPage.step3_policies.map((ip) => {
          return ip.policyName;
        }),
        defaultValue: payload.defaultValue,
      };
      const result: null | { title: string; text: string; } = yield call(fPolicyBuilder, parmas);
      if (!result) {
        return;
      }
      const params: Parameters<typeof FServiceAPI.Resource.update>[0] = {
        resourceId: resourceCreatorPage.step1_createdResourceInfo?.resourceID || '',
        addPolicies: [{
          policyName: result.title,
          policyText: window.encodeURIComponent(result.text),
        }],
      };
      const { ret, errCode, msg, data }: {
        ret: number;
        errCode: number;
        msg: string;
        data: any;
      } = yield call(FServiceAPI.Resource.update, params);

      // console.log(data, '9ieowjflksdjflksdjlfkjsdlkj');

      if (ret !== 0 || errCode !== 0) {
        fMessage(msg, 'error');
        return;
      }

      const params1: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: resourceCreatorPage.step1_createdResourceInfo?.resourceID || '',
        isLoadPolicyInfo: 1,
        isTranslate: 1,
      };

      const { data: data_ResourceDetails }: {
        ret: number;
        errCode: number;
        data: {
          resourceId: string;
          resourceName: string;
          policies: any[];
          baseUpcastResources: any[];
          status: 0 | 1;
        }
      } = yield call(FServiceAPI.Resource.info, params1);
      // console.log(data_ResourceDetails, 'data_ResourceDetails @#$RFDSASDFSDFASDF');

      if (ret !== 0 || errCode !== 0) {
        return;
      }

      const policies: PolicyFullInfo_Type[] = data_ResourceDetails.policies || [];

      policies.reverse();

      policies.sort((a, b) => {
        return (a.status === 1 && b.status === 0) ? -1 : 0;
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step3_policies: policies,
        },
      });
    },
    // * onClick_step3_skipBtn({}: OnClick_step3_skipBtn_Action, { put }: EffectsCommandMap) {
    //   yield put<ChangeAction>({
    //     type: 'change',
    //     payload: {
    //       step: 4,
    //     },
    //   });
    // },
    * onClick_step3_submitBtn({}: OnClick_step3_submitBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step: 4,
        },
      });
    },
    * onChange_step4_resourceTitle({ payload }: OnChange_step4_resourceTitle_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step4_resourceTitle: payload.value,
        },
      });
    },
    * onChange_step4_resourceCover({ payload }: OnChange_step4_resourceCover_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step4_resourceCover: payload.value,
        },
      });
    },
    * onChange_step4_resourceLabels({ payload }: OnChange_step4_resourceLabels_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step4_resourceLabels: payload.value,
        },
      });
    },
    * onClick_step4_preBtn({}: OnClick_step4_preBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step: 3,
        },
      });
    },
    * onClick_step4_submitBtn({}: OnClick_step4_submitBtn_Action, { select, call, put }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));

      const params: Parameters<typeof FServiceAPI.Resource.update>[0] = {
        resourceId: resourceCreatorPage.step1_createdResourceInfo?.resourceID || '',
        tags: resourceCreatorPage.step4_resourceLabels,
        coverImages: resourceCreatorPage.step4_resourceCover !== '' ? [resourceCreatorPage.step4_resourceCover] : undefined,
        // @ts-ignore
        resourceTitle: resourceCreatorPage.step4_resourceTitle,
        status: 1,
      };
      const { ret, errCode, msg }: {
        ret: number;
        errCode: number;
        msg: string;
        data: any;
      } = yield call(FServiceAPI.Resource.update, params);
      if (ret !== 0 || errCode !== 0) {
        fMessage(msg, 'error');
        return;
      }
      history.push(FUtil.LinkTo.myResources());
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
