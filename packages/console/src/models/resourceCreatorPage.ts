import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import {
  ConnectState,
  ResourceVersionCreatorPageModelState,
  UserModelState,
} from '@/models/connect';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';
import userPermission from '@/permissions/UserPermission';
import { getFilesSha1Info, handleData_By_Sha1_And_ResourceTypeCode_And_InheritData } from '@/utils/service';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import fPolicyBuilder from '@/components/fPolicyBuilder';
import { history } from 'umi';
import { IResourceCreateVersionDraftType } from '@/type/resourceTypes';
import fComicTool from '@/components/fComicTool';

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
  step1_dataIsDirty_count: number;

  step2_resourceTypeConfig: {
    uploadEntry: ('localUpload' | 'storageSpace' | 'markdownEditor' | 'cartoonEditor')[];
    limitFileSize: number;
    isSupportDownload: boolean;
    isSupportEdit: boolean;
    isSupportOptionalConfig: boolean;
  };
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

  step2_directDependencies: {
    id: string;
    name: string;
    type: 'resource' | 'object';
    versionRange?: string;
  }[];
  step2_baseUpcastResources: {
    resourceID: string;
    resourceName: string;
  }[];
  step2_resolveResources: {
    resourceId: string;
    contracts: {
      policyId: string;
    }[];
  }[];
  step2_isCompleteAuthorization: boolean;
  step2_authReload: number;

  step2_isOpenMarkdown: boolean;
  step2_dataIsDirty_count: number;

  step3_policies: PolicyFullInfo_Type[];

  step4_resourceTitle: string;
  step4_resourceCover: string;
  step4_resourceLabels: string[];
  step4_dataIsDirty_count: number;
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

export interface OnClose_step2_editMarkdown extends AnyAction {
  type: 'resourceCreatorPage/onClose_step2_editMarkdown';
}

export interface OnClick_step2_editCartoonBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_step2_editCartoonBtn';
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

export interface OnTrigger_step2_SaveDraft_Action extends AnyAction {
  type: 'resourceCreatorPage/onTrigger_step2_SaveDraft';
}

export interface OnClick_step3_addPolicyBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_step3_addPolicyBtn';
  payload: {
    defaultValue?: { text: string; title: string; };
  };
}

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
    onClose_step2_editMarkdown: (action: OnClose_step2_editMarkdown, effects: EffectsCommandMap) => void;
    onClick_step2_editCartoonBtn: (action: OnClick_step2_editCartoonBtn_Action, effects: EffectsCommandMap) => void;
    onRemove_step2_file: (action: OnRemove_step2_file_Action, effects: EffectsCommandMap) => void;
    onChange_step2_additionalProperties: (action: OnChange_step2_additionalProperties_Action, effects: EffectsCommandMap) => void;
    onChange_step2_customProperties: (action: OnChange_step2_customProperties_Action, effects: EffectsCommandMap) => void;
    onChange_step2_customConfigurations: (action: OnChange_step2_customConfigurations_Action, effects: EffectsCommandMap) => void;
    onClick_step2_submitBtn: (action: OnClick_step2_submitBtn_Action, effects: EffectsCommandMap) => void;
    onTrigger_step2_SaveDraft: (action: OnTrigger_step2_SaveDraft_Action, effects: EffectsCommandMap) => void;
    onClick_step3_addPolicyBtn: (action: OnClick_step3_addPolicyBtn_Action, effects: EffectsCommandMap) => void;
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
  step1_resourceName: '',
  step1_resourceName_isVerify: false,
  step1_resourceName_errorText: '',
  step1_createdResourceInfo: null,
  step1_dataIsDirty_count: 0,

  step2_resourceTypeConfig: {
    uploadEntry: [],
    limitFileSize: 0,
    isSupportDownload: false,
    isSupportEdit: false,
    isSupportOptionalConfig: false,
  },
  step2_fileInfo: null,
  // step2_fileInfo_errorTip: '不能超过200M',
  step2_rawProperties: [],
  step2_rawPropertiesState: 'parsing',
  step2_additionalProperties: [],
  step2_customProperties: [],
  step2_customConfigurations: [],

  step2_directDependencies: [],
  step2_baseUpcastResources: [],
  step2_resolveResources: [],
  step2_isCompleteAuthorization: true,
  step2_authReload: 0,

  step2_dataIsDirty_count: 0,
  step2_isOpenMarkdown: false,

  step3_policies: [],

  step4_resourceTitle: '',
  step4_resourceCover: '',
  step4_resourceLabels: [],
  step4_dataIsDirty_count: 0,
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
    * onChange_step1_resourceType({ payload }: OnChange_step1_resourceType_Action, { select, put }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step1_resourceType: payload.value,
          step1_dataIsDirty_count: resourceCreatorPage.step1_dataIsDirty_count + 1,
        },
      });
    },
    * onChange_step1_resourceName({ payload }: OnChange_step1_resourceName_Action, { select, put }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step1_resourceName: payload.value,
          step1_resourceName_errorText: '',
          step1_resourceName_isVerify: true,
          step1_dataIsDirty_count: resourceCreatorPage.step1_dataIsDirty_count + 1,
        },
      });
    },
    * onVerify_step1_resourceName({}: OnVerify_step1_resourceName_Action, { select, call, put }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));
      let nameErrorText: string = '';
      if (resourceCreatorPage.step1_resourceName === '') {
        nameErrorText = '请输入资源授权标识';
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
          nameErrorText = '资源授权标识已存在';
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

      const params1: Parameters<typeof FServiceAPI.Resource.getResourceTypeInfoByCode>[0] = {
        code: resourceCreatorPage.step1_resourceType.value,
      };
      const { data: data_ResourceTypeInfo }: {
        ret: number;
        errCode: number;
        msg: string;
        data: {
          resourceConfig: {
            fileCommitMode: number[];
            fileMaxSize: number;
            fileMaxSizeUnit: 1 | 2;
            supportDownload: 1 | 2;
            supportEdit: 1 | 2;
            supportOptionalConfig: 1 | 2;
          }
        };
      } = yield call(FServiceAPI.Resource.getResourceTypeInfoByCode, params1);
      // console.log(data_ResourceTypeInfo, 'data_ResourceTypeInfo sdiofjsdlkjflksdjlkjl');
      const uploadEntry: ResourceCreatorPageModelState['step2_resourceTypeConfig']['uploadEntry'] = [];
      if (data_ResourceTypeInfo.resourceConfig.fileCommitMode.includes(2 ** 0)) {
        uploadEntry.push('localUpload');
      }
      if (data_ResourceTypeInfo.resourceConfig.fileCommitMode.includes(2 ** 1)) {
        uploadEntry.push('storageSpace');
      }
      if (data_ResourceTypeInfo.resourceConfig.fileCommitMode.includes(2 ** 2)) {
        uploadEntry.push('markdownEditor');
      }
      if (data_ResourceTypeInfo.resourceConfig.fileCommitMode.includes(2 ** 3)) {
        uploadEntry.push('cartoonEditor');
      }


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
          step1_dataIsDirty_count: 0,
          step2_resourceTypeConfig: {
            uploadEntry: uploadEntry,
            limitFileSize: data_ResourceTypeInfo.resourceConfig.fileMaxSize * 1024 * 1024 ** data_ResourceTypeInfo.resourceConfig.fileMaxSizeUnit,
            isSupportDownload: data_ResourceTypeInfo.resourceConfig.supportDownload === 2,
            isSupportEdit: data_ResourceTypeInfo.resourceConfig.supportEdit === 2,
            isSupportOptionalConfig: data_ResourceTypeInfo.resourceConfig.supportOptionalConfig === 2,
          },
          step4_resourceTitle: resourceCreatorPage.step1_resourceName,
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
          step2_rawPropertiesState: 'parsing',
          step2_dataIsDirty_count: resourceCreatorPage.step2_dataIsDirty_count + 1,
        },
      });
      //
      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {
      //
      //   },
      // });

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
          step2_rawPropertiesState: 'parsing',
        },
      });

      const params: Parameters<typeof FServiceAPI.Storage.objectDetails>[0] = {
        objectIdOrName: payload.objectID,
      };
      const { data: data_objectDetails }: {
        data: {
          dependencies: {
            name: string;
            type: 'resource' | 'object';
            versionRange?: string;
          }[];
          customPropertyDescriptors: {
            key: string;
            name: string;
            defaultValue: string;
            type: 'editableText' | 'readonlyText' | 'radio' | 'checkbox' | 'select';
            candidateItems: string[];
            remark: string;
          }[],
        }
      } = yield call(FServiceAPI.Storage.objectDetails, params);

      const params0: Parameters<typeof getFilesSha1Info>[0] = {
        sha1: [payload.sha1],
        resourceTypeCode: resourceCreatorPage.step1_createdResourceInfo?.resourceTypeCode || '',
      };
      const {
        result,
        error,
      }: Awaited<ReturnType<typeof getFilesSha1Info>> = yield call(getFilesSha1Info, params0);

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

      if (result[0].state === 'success') {

        yield put<ChangeAction>({
          type: 'change',
          payload: {
            step2_rawProperties: result[0].info
              .filter((i) => {
                return i.insertMode === 1;
              })
              // .map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((i) => {
              .map<ResourceCreatorPageModelState['step2_rawProperties'][number]>((i) => {
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
              .map<ResourceCreatorPageModelState['step2_additionalProperties'][number]>((i) => {
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
            step2_customProperties: data_objectDetails.customPropertyDescriptors
              .filter((cpd) => cpd.type === 'readonlyText')
              .map<ResourceCreatorPageModelState['step2_customProperties'][number]>((cpd: any) => {
                return {
                  key: cpd.key,
                  name: cpd.key,
                  value: cpd.defaultValue,
                  description: cpd.remark,
                };
              }),
            step2_customConfigurations: data_objectDetails.customPropertyDescriptors
              .filter((cpd) => cpd.type !== 'readonlyText')
              .map<ResourceCreatorPageModelState['step2_customConfigurations'][number]>((cpd) => {
                return {
                  key: cpd.key,
                  name: cpd.name,
                  // keyError: '',
                  description: cpd.remark,
                  // descriptionError: '',
                  type: cpd.type === 'editableText' ? 'input' : 'select',
                  input: cpd.defaultValue,
                  // defaultValueError: '',
                  select: cpd.candidateItems,
                  // customOptionError: '',
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

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_isOpenMarkdown: true,
        },
      });

      // yield call(fResourceMarkdownEditor, {
      //   resourceID: resourceCreatorPage.step1_createdResourceInfo.resourceID,
      //   async onChange_Saved(saved: boolean) {
      //     // set_isMarkdownEditorDirty(!saved);
      //   },
      // });


    },
    * onClose_step2_editMarkdown({}: OnClose_step2_editMarkdown, { select, put, call }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_isOpenMarkdown: false,
          // step2_rawPropertiesState: 'parsing',
          step2_dataIsDirty_count: resourceCreatorPage.step2_dataIsDirty_count + 1,
        },
      });

      const params2: Parameters<typeof FServiceAPI.Resource.lookDraft>[0] = {
        resourceId: resourceCreatorPage.step1_createdResourceInfo?.resourceID || '',
      };
      const { data: data_draft2 }: {
        data: null | {
          resourceId: string;
          updateDate: string;
          draftData: IResourceCreateVersionDraftType;
        };
      } = yield call(FServiceAPI.Resource.lookDraft, params2);

      const draftData = data_draft2?.draftData;
      if (!draftData?.selectedFileInfo) {
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_fileInfo: draftData.selectedFileInfo,
          step2_directDependencies: draftData.directDependencies,
          step2_baseUpcastResources: draftData.baseUpcastResources,
          step2_authReload: resourceCreatorPage.step2_authReload + 1,
          step2_rawPropertiesState: 'parsing',
        },
      });

      const params4: Parameters<typeof handleData_By_Sha1_And_ResourceTypeCode_And_InheritData>[0] = {
        sha1: draftData.selectedFileInfo.sha1,
        resourceTypeCode: resourceCreatorPage.step1_resourceType?.value || '',
        inheritData: {
          additionalProperties: draftData.additionalProperties.map((ap) => {
            return {
              key: ap.key,
              name: '',
              value: ap.value,
              description: '',
            };
          }),
          customProperties: draftData.customProperties,
          customConfigurations: draftData.customConfigurations,
        },
      };
      const result: Awaited<ReturnType<typeof handleData_By_Sha1_And_ResourceTypeCode_And_InheritData>> = yield call(handleData_By_Sha1_And_ResourceTypeCode_And_InheritData, params4);
      if (result.state !== 'success') {
        fMessage(result.failedMsg, 'error');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_rawProperties: result.rawProperties,
          step2_rawPropertiesState: 'success',
          step2_additionalProperties: result.additionalProperties,
          step2_customProperties: result.customProperties,
          step2_customConfigurations: result.customConfigurations,
        },
      });
    },
    * onClick_step2_editCartoonBtn({}: OnClick_step2_editCartoonBtn_Action, { select, call, put }: EffectsCommandMap) {
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

      yield call(fComicTool, {
        resourceID: resourceCreatorPage.step1_createdResourceInfo.resourceID,
        async onChange_Saved(saved: boolean) {
          // set_isMarkdownEditorDirty(!saved);
        },
      });

      const params2: Parameters<typeof FServiceAPI.Resource.lookDraft>[0] = {
        resourceId: resourceCreatorPage.step1_createdResourceInfo?.resourceID || '',
      };
      const { data: data_draft2 }: {
        data: null | {
          resourceId: string;
          updateDate: string;
          draftData: IResourceCreateVersionDraftType;
        };
      } = yield call(FServiceAPI.Resource.lookDraft, params2);

      const draftData = data_draft2?.draftData;
      if (!draftData?.selectedFileInfo) {
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_fileInfo: draftData.selectedFileInfo,
          step2_directDependencies: draftData.directDependencies,
          step2_baseUpcastResources: draftData.baseUpcastResources,
          step2_authReload: resourceCreatorPage.step2_authReload + 1,
          step2_rawPropertiesState: 'parsing',
        },
      });

      const params4: Parameters<typeof handleData_By_Sha1_And_ResourceTypeCode_And_InheritData>[0] = {
        sha1: draftData.selectedFileInfo.sha1,
        resourceTypeCode: resourceCreatorPage.step1_resourceType?.value || '',
        inheritData: {
          additionalProperties: draftData.additionalProperties.map((ap) => {
            return {
              key: ap.key,
              name: '',
              value: ap.value,
              description: '',
            };
          }),
          customProperties: draftData.customProperties,
          customConfigurations: draftData.customConfigurations,
        },
      };
      const result: Awaited<ReturnType<typeof handleData_By_Sha1_And_ResourceTypeCode_And_InheritData>> = yield call(handleData_By_Sha1_And_ResourceTypeCode_And_InheritData, params4);
      if (result.state !== 'success') {
        fMessage(result.failedMsg, 'error');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_rawProperties: result.rawProperties,
          step2_rawPropertiesState: 'success',
          step2_additionalProperties: result.additionalProperties,
          step2_customProperties: result.customProperties,
          step2_customConfigurations: result.customConfigurations,
        },
      });
    },
    * onRemove_step2_file({}: OnRemove_step2_file_Action, { select, put }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_fileInfo: null,
          step2_rawProperties: [],
          step2_rawPropertiesState: 'parsing',
          step2_additionalProperties: [],
          step2_customProperties: [],
          step2_customConfigurations: [],
          step2_dataIsDirty_count: resourceCreatorPage.step2_dataIsDirty_count + 1,
        },
      });
    },
    * onChange_step2_additionalProperties({ payload }: OnChange_step2_additionalProperties_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_additionalProperties: payload.value,
          step2_dataIsDirty_count: resourceCreatorPage.step2_dataIsDirty_count + 1,
        },
      });
    },
    * onChange_step2_customProperties({ payload }: OnChange_step2_customProperties_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_customProperties: payload.value,
          step2_dataIsDirty_count: resourceCreatorPage.step2_dataIsDirty_count + 1,
        },
      });
    },
    * onChange_step2_customConfigurations({ payload }: OnChange_step2_customConfigurations_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_customConfigurations: payload.value,
          step2_dataIsDirty_count: resourceCreatorPage.step2_dataIsDirty_count + 1,
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

      // const p: {
      //   getAllTargets(): void;
      //   getAllResourcesWithContracts(): void;
      //   isCompleteAuthorization(): void;
      //   getBaseUpcastResources(): { resourceID: string; resourceName: string; }[];
      // } = yield call(getProcessor, 'resourceCreatorStep2');

      // const isCompleteAuthorization: boolean = yield call(p.isCompleteAuthorization);

      if (!resourceCreatorPage.step2_isCompleteAuthorization) {
        fMessage('依赖中存在未获取授权的资源', 'error');
        return;
      }

      // const dependentAllResourcesWithContracts: {
      //   resourceID: string;
      //   resourceName: string;
      //   contracts: {
      //     policyID: string;
      //     contractID: string;
      //   }[];
      // }[] = yield call(p.getAllResourcesWithContracts);
      // const dependentAllTargets: {
      //   id: string;
      //   name: string;
      //   type: 'resource' | 'object';
      //   versionRange?: string;
      // }[] = yield call(p.getAllTargets);
      //
      // const baseUpcastResources: {
      //   resourceID: string;
      //   resourceName: string;
      // }[] = yield call(p.getBaseUpcastResources);
      //
      // const dependencies: {
      //   resourceId: string;
      //   versionRange: string;
      // }[] = dependentAllTargets
      //   .map((r) => {
      //     return {
      //       resourceId: r.id,
      //       versionRange: r.versionRange || '',
      //     };
      //   });
      // const resolveResources: {
      //   resourceId: string;
      //   contracts: {
      //     policyId: string;
      //   }[];
      // }[] = dependentAllResourcesWithContracts
      //   .filter((r) => {
      //     return r.contracts.length > 0 && baseUpcastResources.every((b) => {
      //       return b.resourceID !== r.resourceID;
      //     });
      //   })
      //   .map((r) => {
      //     return {
      //       resourceId: r.resourceID,
      //       contracts: r.contracts.map((c) => {
      //         return {
      //           policyId: c.policyID,
      //         };
      //       }),
      //     };
      //   });

      const params: Parameters<typeof FServiceAPI.Resource.createVersion>[0] = {
        resourceId: resourceCreatorPage.step1_createdResourceInfo.resourceID,
        version: '1.0.0',
        fileSha1: resourceCreatorPage.step2_fileInfo.sha1,
        filename: resourceCreatorPage.step2_fileInfo.name,
        // baseUpcastResources: baseUpcastResources.map((r) => {
        //   return { resourceId: r.resourceID };
        // }),
        // dependencies: dependencies,
        // resolveResources: resolveResources,
        baseUpcastResources: resourceCreatorPage.step2_baseUpcastResources
          .map((r) => {
            return { resourceId: r.resourceID };
          }),
        dependencies: resourceCreatorPage.step2_directDependencies
          .map((r) => {
            return {
              resourceId: r.id,
              versionRange: r.versionRange || '',
            };
          }),
        resolveResources: resourceCreatorPage.step2_resolveResources,
        inputAttrs: resourceCreatorPage.step2_additionalProperties
          // .filter((ap) => {
          //   return ap.value !== '';
          // })
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
          step2_dataIsDirty_count: 0,
        },
      });
    },
    * onTrigger_step2_SaveDraft({}: OnTrigger_step2_SaveDraft_Action, { select, call, put }: EffectsCommandMap) {
      // console.log('onTrigger_step2_SaveDraft sdfijsdlfkj kljsdlkfjlksdjlk');
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));

      if (!resourceCreatorPage.step1_createdResourceInfo) {
        return;
      }

      // console.log(resourceCreatorPage.step1_createdResourceInfo, 'resourceCreatorPage.step1_createdResourceInfosiodjflksdjfl sdflksdjlk');
      // let directDependencies: any[] = [];
      // let baseUpcastResources: {
      //   resourceID: string;
      //   resourceName: string;
      // }[] = [];
      // // console.log(resourceCreatorPage.step2_fileInfo, 'resourceCreatorPage.step2_fileInfoisdjf;lksdjlfkjl');
      // if (resourceCreatorPage.step2_fileInfo) {
      //   const p: { getAllTargets(): void; getBaseUpcastResources(): { resourceID: string; resourceName: string; }[] } = yield call(getProcessor, 'resourceCreatorStep2');
      //   // console.log(p, 'poisdjflksdjflkjdsklfjlksdjlk');
      //   directDependencies = yield call(p.getAllTargets);
      //   baseUpcastResources = yield call(p.getBaseUpcastResources);
      // }
      // console.log(baseUpcastResources, 'baseUpcastResources oisjdlkfjlsdkjflsdjfljsl');
      // console.log(directDependencies, 'directDependencies urcesoisjdlkfjlsdkjflsdjfljsl');

      const draftData: IResourceCreateVersionDraftType = {
        versionInput: '1.0.0',
        selectedFileInfo: resourceCreatorPage.step2_fileInfo,
        additionalProperties: resourceCreatorPage.step2_additionalProperties.map((ap) => {
          return {
            key: ap.key,
            value: ap.value,
          };
        }),
        customProperties: resourceCreatorPage.step2_customProperties,
        customConfigurations: resourceCreatorPage.step2_customConfigurations,
        // directDependencies: directDependencies,
        // baseUpcastResources: baseUpcastResources,
        directDependencies: resourceCreatorPage.step2_directDependencies,
        baseUpcastResources: resourceCreatorPage.step2_baseUpcastResources,
        descriptionEditorInput: '',
      };

      const params: Parameters<typeof FServiceAPI.Resource.saveVersionsDraft>[0] = {
        resourceId: resourceCreatorPage.step1_createdResourceInfo.resourceID,
        draftData: draftData,
      };
      const { ret, errCode, data: data_draft }: {
        ret: number;
        errCode: number;
        data: {
          resourceId: string;
          updateDate: string;
          draftData: IResourceCreateVersionDraftType;
        };
      } = yield call(FServiceAPI.Resource.saveVersionsDraft, params);
      if (ret !== 0 || errCode !== 0) {
        fMessage('草稿保存失败', 'error');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // draftSaveTime: FUtil.Format.formatDateTime(Date(), true),
          // step2: moment(data_draft.updateDate).format('YYYY-MM-DD hh:mm:ss'),
          step2_dataIsDirty_count: 0,
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
    * onClick_step3_submitBtn({}: OnClick_step3_submitBtn_Action, { select, call, put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step: 4,
        },
      });

      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));
      const params: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: resourceCreatorPage.step1_createdResourceInfo?.resourceID || '',
        isLoadPolicyInfo: 1,
        isTranslate: 1,
      };
      // console.log(params, 'params9iosdj;flkjlk lksdajf;lkjl');
      const { data: data_resourceInfo }: {
        data: {
          userId: number;
          status: number;
          resourceId: string;
          resourceName: string;
          resourceTitle: string;
          resourceVersions: {
            version: string;
          }[];
          latestVersion: string;
          coverImages: string[];
          resourceType: string[];
          policies: PolicyFullInfo_Type[];
        };
      } = yield call(FServiceAPI.Resource.info, params);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step4_resourceCover: data_resourceInfo.coverImages[0] || '',
        },
      });
    },
    * onChange_step4_resourceTitle({ payload }: OnChange_step4_resourceTitle_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step4_resourceTitle: payload.value,
          step4_dataIsDirty_count: resourceCreatorPage.step4_dataIsDirty_count + 1,
        },
      });
    },
    * onChange_step4_resourceCover({ payload }: OnChange_step4_resourceCover_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step4_resourceCover: payload.value,
          step4_dataIsDirty_count: resourceCreatorPage.step4_dataIsDirty_count + 1,
        },
      });
    },
    * onChange_step4_resourceLabels({ payload }: OnChange_step4_resourceLabels_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { resourceCreatorPage }: ConnectState = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step4_resourceLabels: payload.value,
          step4_dataIsDirty_count: resourceCreatorPage.step4_dataIsDirty_count + 1,
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
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step4_dataIsDirty_count: 0,
        },
      });
      setTimeout(() => {
        // history.push(FUtil.LinkTo.resourceVersionInfo({
        //   resourceID: resourceCreatorPage.step1_createdResourceInfo?.resourceID || '',
        //   version: '1.0.0',
        // }));
        history.push(FUtil.LinkTo.resourceCreateSuccess({
          resourceID: resourceCreatorPage.step1_createdResourceInfo?.resourceID || '',
        }));
      }, 100);

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
