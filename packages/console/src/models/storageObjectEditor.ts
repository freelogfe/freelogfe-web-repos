import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState, ResourceVersionCreatorPageModelState } from '@/models/connect';
import fMessage from '@/components/fMessage';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import { history } from 'umi';
import { UpdateAObjectAction } from '@/models/storageHomePage';
import { fileAttrUnits } from '@/utils/format';
import { handleData_By_Sha1_And_ResourceTypeCode_And_InheritData } from '@/utils/service';

interface DepR {
  id: string;
  name: string;
  type: string;
  identity: 'resource';
  version: string;
  versions: string[];
  status: 0 | 1;
  baseUpthrows: string[];
  linkTo: string;
}

interface DepO {
  id: string;
  name: string;
  type: string;
  identity: 'object';
  linkTo: string;
}

export interface StorageObjectEditorModelState {
  objectId: string;
  bucketName: string;
  objectName: string;
  sha1: string;
  size: number;
  resourceTypeValue: {
    value: string;
    labels: string[];
    customInput?: string;
  } | null;

  resourceTypeConfig: {
    // uploadEntry: ('localUpload' | 'storageSpace' | 'markdownEditor' | 'cartoonEditor')[];
    // limitFileSize: number;
    isSupportDownload: boolean;
    // isSupportEdit: boolean;
    isSupportOptionalConfig: boolean;
  };

  rawProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
  additionalProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
  customProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
  customConfigurations: {
    key: string;
    name: string;
    description: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
  }[];

  // rawProperties: {
  //   key: string;
  //   name: string;
  //   value: string;
  //   description: string;
  // }[];
  //
  // baseProperties: {
  //   key: string;
  //   name: string;
  //   value: string;
  //   description: string;
  // }[];
  // customOptionsData: {
  //   key: string;
  //   name: string;
  //   description: string;
  //   type: 'input' | 'select';
  //   input: string;
  //   select: string[];
  // }[];
  depRs: DepR[];
  depOs: DepO[];
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'storageObjectEditor/change';
  payload: Partial<StorageObjectEditorModelState>;
}

export interface FetchInfoAction extends AnyAction {
  type: 'storageObjectEditor/fetchInfo';
}

export interface OnClick_SaveBtn_Action extends AnyAction {
  type: 'storageObjectEditor/onClick_SaveBtn';
}

export interface AddObjectDepRAction extends AnyAction {
  type: 'storageObjectEditor/addObjectDepR';
  payload: string;
}

export interface DeleteObjectDepRAction extends AnyAction {
  type: 'storageObjectEditor/deleteObjectDepR';
  payload: string; // 资源名称
}

export interface AddObjectDepOAction extends AnyAction {
  type: 'storageObjectEditor/addObjectDepO';
  payload: string;
}

export interface DeleteObjectDepOAction extends AnyAction {
  type: 'storageObjectEditor/deleteObjectDepO';
  payload: string; // 对象全称
}

export interface OnChangeTypeAction extends AnyAction {
  type: 'storageObjectEditor/onChangeType';
  payload: {
    value: StorageObjectEditorModelState['resourceTypeValue'];
  };
}

export interface StorageObjectEditorModelType {
  namespace: 'storageObjectEditor';
  state: StorageObjectEditorModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    onClick_SaveBtn: (action: OnClick_SaveBtn_Action, effects: EffectsCommandMap) => void;
    onChangeType: (action: OnChangeTypeAction, effects: EffectsCommandMap) => void;
    addObjectDepR: (action: AddObjectDepRAction, effects: EffectsCommandMap) => void;
    deleteObjectDepR: (action: DeleteObjectDepRAction, effects: EffectsCommandMap) => void;
    addObjectDepO: (action: AddObjectDepOAction, effects: EffectsCommandMap) => void;
    deleteObjectDepO: (action: DeleteObjectDepOAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<StorageObjectEditorModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

export const storageObjectEditorInitData: StorageObjectEditorModelState = {
  objectId: '',
  bucketName: '',
  objectName: '',
  sha1: '',
  size: 0,

  resourceTypeValue: null,

  resourceTypeConfig: {
    // uploadEntry: [],
    // limitFileSize: 0,
    isSupportDownload: false,
    // isSupportEdit: false,
    isSupportOptionalConfig: false,
  },

  rawProperties: [],
  additionalProperties: [],
  customProperties: [],
  customConfigurations: [],

  depRs: [],
  depOs: [],
};

const Model: StorageObjectEditorModelType = {
  namespace: 'storageObjectEditor',
  state: storageObjectEditorInitData,
  effects: {
    * fetchInfo({}: FetchInfoAction, { call, put, select }: EffectsCommandMap) {
      const { storageObjectEditor }: ConnectState = yield select(({ storageObjectEditor }: ConnectState) => ({
        storageObjectEditor,
      }));

      if (!storageObjectEditor.objectId) {
        return;
      }

      const params: Parameters<typeof FServiceAPI.Storage.objectDetails>[0] = {
        objectIdOrName: storageObjectEditor.objectId,
      };

      const { data: data_objectDetails }: {
        data: {
          objectId: string;
          bucketName: string;
          objectName: string;
          sha1: string;
          userId: number;
          resourceTypeCode: string;
          resourceType: string[],
          dependencies: any[];
          customPropertyDescriptors: {
            key: string;
            name: string;
            defaultValue: string;
            type: 'editableText' | 'readonlyText' | 'radio' | 'checkbox' | 'select';
            candidateItems: string[];
            remark: string;
          }[];
          systemPropertyDescriptors: {
            key: string;
            valueDisplay: string;
            insertMode: 1 | 2;
          }[];
          systemProperty: {
            fileSize: number;
          };
        }
      } = yield call(FServiceAPI.Storage.objectDetails, params);

      // console.log(data_objectDetails, 'data_objectDetails sdifjsdlkfjl;ksdjflksdjlkfjsdlfkjsldkj');

      if (!data_objectDetails || data_objectDetails.userId !== FUtil.Tool.getUserIDByCookies()) {
        history.replace(FUtil.LinkTo.exception403());
        return;
      }

      const resources: any[] = data_objectDetails.dependencies
        .filter((ro: any) => ro.type === 'resource');
      const objects: any[] = data_objectDetails.dependencies
        .filter((ro: any) => ro.type === 'object');

      let depRs: StorageObjectEditorModelState['depRs'] = [];
      let depOs: StorageObjectEditorModelState['depOs'] = [];

      if (resources.length > 0) {
        const params: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
          resourceNames: resources.map((r: any) => r.name).join(','),
        };
        const { data } = yield call(FServiceAPI.Resource.batchInfo, params);
        // console.log(data, 'data1234234');
        depRs = (data as any[]).map<StorageObjectEditorModelState['depRs'][number]>((r: any) => {
          return {
            id: r.resourceId,
            name: r.resourceName,
            type: r.resourceType,
            identity: 'resource',
            version: resources.find((sr) => sr.name === r.resourceName)?.versionRange,
            status: r.status,
            baseUpthrows: r.baseUpcastResources.map((sr: any) => sr.resourceName),
            versions: r.resourceVersions.map((rv: any) => rv.version),
            linkTo: FUtil.LinkTo.resourceDetails({
              resourceID: r.resourceId,
            }),
          };
        });
      }

      if (objects.length > 0) {
        const params: Parameters<typeof FServiceAPI.Storage.batchObjectList>[0] = {
          fullObjectNames: objects.map((r: any) => r.name).join(','),
        };
        const { data } = yield call(FServiceAPI.Storage.batchObjectList, params);
        depOs = (data as any[]).map<StorageObjectEditorModelState['depOs'][number]>((o: any) => ({
          id: o.objectId,
          name: o.bucketName + '/' + o.objectName,
          type: o.resourceType,
          identity: 'object',
          linkTo: FUtil.LinkTo.objectDetails({
            bucketName: o.bucketName,
            objectID: o.objectId,
          }),
        }));
      }

      let resourceTypeConfig: StorageObjectEditorModelState['resourceTypeConfig'] = {
        isSupportDownload: true,
        isSupportOptionalConfig: true,
      };

      if (!!data_objectDetails.resourceTypeCode) {
        const params1: Parameters<typeof FServiceAPI.Resource.getResourceTypeInfoByCode>[0] = {
          code: data_objectDetails.resourceTypeCode,
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

        resourceTypeConfig = {
          isSupportDownload: data_ResourceTypeInfo.resourceConfig.supportDownload === 2,
          isSupportOptionalConfig: data_ResourceTypeInfo.resourceConfig.supportOptionalConfig === 2,
        };
      }

      const params4: Parameters<typeof handleData_By_Sha1_And_ResourceTypeCode_And_InheritData>[0] = {
        sha1: data_objectDetails.sha1,
        resourceTypeCode: data_objectDetails.resourceTypeCode,

        inheritData: {
          additionalProperties: data_objectDetails.systemPropertyDescriptors
            .filter((spd) => {
              return spd.insertMode === 2;
            })
            .map<ResourceVersionCreatorPageModelState['additionalProperties'][number]>((spd) => {
              return {
                key: spd.key,
                name: '',
                value: spd.valueDisplay,
                description: '',
              };
            }),
          customProperties: data_objectDetails.customPropertyDescriptors
            .filter((cpd) => {
              return cpd.type === 'readonlyText';
            })
            .map<StorageObjectEditorModelState['customProperties'][number]>((cpd: any) => {
              return {
                key: cpd.key,
                name: cpd.name,
                value: cpd.defaultValue,
                description: cpd.remark,
              };
            }),
          customConfigurations: resourceTypeConfig
            ? data_objectDetails.customPropertyDescriptors
              .filter((cpd: any) => cpd.type !== 'readonlyText')
              .map<StorageObjectEditorModelState['customConfigurations'][number]>((cpd) => {
                return {
                  key: cpd.key,
                  name: cpd.name,
                  description: cpd.remark,
                  type: cpd.type === 'editableText' ? 'input' : 'select',
                  input: cpd.defaultValue,
                  select: cpd.candidateItems,
                };
              })
            : [],
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
          objectId: data_objectDetails.objectId,
          bucketName: data_objectDetails.bucketName,
          objectName: data_objectDetails.objectName,
          sha1: data_objectDetails.sha1,
          resourceTypeValue: {
            value: data_objectDetails.resourceTypeCode,
            labels: data_objectDetails.resourceType,
          },
          resourceTypeConfig,
          size: data_objectDetails.systemProperty.fileSize,
          rawProperties: result.rawProperties,
          additionalProperties: result.additionalProperties,
          customProperties: result.customProperties,
          customConfigurations: result.customConfigurations,
          depRs: depRs,
          depOs: depOs,
        },
      });
    },
    * onClick_SaveBtn({}: OnClick_SaveBtn_Action, { select, call, put }: EffectsCommandMap) {
      const { storageObjectEditor }: ConnectState = yield select(({ storageObjectEditor }: ConnectState) => ({
        storageObjectEditor,
      }));


      const params: Parameters<typeof FServiceAPI.Storage.updateObject>[0] = {
        objectIdOrName: encodeURIComponent(`${storageObjectEditor.bucketName}/${storageObjectEditor.objectName}`),
        resourceTypeCode: storageObjectEditor.resourceTypeValue?.value || undefined,
        resourceTypeName: storageObjectEditor.resourceTypeValue?.customInput || undefined,
        dependencies: [
          ...storageObjectEditor.depRs.map((r) => ({
            name: r.name,
            type: 'resource',
            versionRange: r.version,
          })),
          ...storageObjectEditor.depOs.map((o) => ({
            name: o.name,
            type: 'object',
          })),
        ],
        // @ts-ignore
        inputAttrs: storageObjectEditor.additionalProperties
          .map((ap) => {
            return {
              key: ap.key,
              value: ap.value,
            };
          }),
        customPropertyDescriptors: [
          ...storageObjectEditor.customProperties.map<NonNullable<Parameters<typeof FServiceAPI.Storage.updateObject>[0]['customPropertyDescriptors']>[number]>((i) => {
            return {
              type: 'readonlyText',
              key: i.key,
              name: i.name,
              remark: i.description,
              defaultValue: i.value,
            };
          }),
          ...storageObjectEditor.customConfigurations.map<NonNullable<Parameters<typeof FServiceAPI.Storage.updateObject>[0]['customPropertyDescriptors']>[number]>((i) => {
            const isInput: boolean = i.type === 'input';
            const options: string[] = i.select;
            return {
              type: isInput ? 'editableText' : 'select',
              key: i.key,
              name: i.name,
              remark: i.description,
              defaultValue: isInput ? i.input : options[0],
              candidateItems: isInput ? undefined : options,
            };
          }),
        ],
      };
      const { ret, errCode, data, msg } = yield call(FServiceAPI.Storage.updateObject, params);

      if (ret !== 0 || errCode !== 0) {
        fMessage(msg, 'error');
        return;
      }

      yield put<UpdateAObjectAction>({
        type: 'storageHomePage/updateAObject',
        payload: {
          id: storageObjectEditor.objectId,
          // type: storageObjectEditor.resourceTypeNames,
          type: data.resourceType,
        },
      });

      history.replace(FUtil.LinkTo.storageSpace({ bucketName: storageObjectEditor.bucketName }));
    },
    * onChangeType({ payload }: OnChangeTypeAction, { put, select, call }: EffectsCommandMap) {
      const { storageObjectEditor }: ConnectState = yield select(({ storageObjectEditor }: ConnectState) => ({
        storageObjectEditor,
      }));

      let resourceTypeConfig: StorageObjectEditorModelState['resourceTypeConfig'] = {
        isSupportDownload: true,
        isSupportOptionalConfig: true,
      };

      if (!!payload.value) {
        const params1: Parameters<typeof FServiceAPI.Resource.getResourceTypeInfoByCode>[0] = {
          code: payload.value.value,
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

        resourceTypeConfig = {
          isSupportDownload: data_ResourceTypeInfo.resourceConfig.supportDownload === 2,
          isSupportOptionalConfig: data_ResourceTypeInfo.resourceConfig.supportOptionalConfig === 2,
        };
      }

      const params4: Parameters<typeof handleData_By_Sha1_And_ResourceTypeCode_And_InheritData>[0] = {
        sha1: storageObjectEditor.sha1,
        resourceTypeCode: payload.value?.value || '',
        inheritData: {
          additionalProperties: storageObjectEditor.additionalProperties,
          customProperties: storageObjectEditor.customProperties,
          customConfigurations: resourceTypeConfig.isSupportOptionalConfig
            ? storageObjectEditor.customConfigurations
            : [],
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
          resourceTypeValue: payload.value,
          resourceTypeConfig,
          rawProperties: result.rawProperties,
          additionalProperties: result.additionalProperties,
          customProperties: result.customProperties,
          customConfigurations: result.customConfigurations,
        },
      });
    },
    * addObjectDepR({ payload }: AddObjectDepRAction, { call, put, select }: EffectsCommandMap) {
      const { storageObjectEditor }: ConnectState = yield select(({ storageObjectEditor }: ConnectState) => ({
        storageObjectEditor,
      }));

      const params: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: payload,
        isLoadLatestVersionInfo: 1,
      };
      const { data } = yield call(FServiceAPI.Resource.info, params);

      const params1: Parameters<typeof FServiceAPI.Storage.cycleDependencyCheck>[0] = {
        objectIdOrName: storageObjectEditor.objectId,
        dependencies: [{
          name: data.resourceName,
          type: 'resource',
        }],
      };

      const { data: data1 } = yield call(FServiceAPI.Storage.cycleDependencyCheck, params1);

      if (!data1) {
        return fMessage('循环依赖，不能添加', 'error');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          depRs: [
            ...storageObjectEditor.depRs,
            {
              id: data.resourceId,
              name: data.resourceName,
              type: data.resourceType,
              identity: 'resource',
              version: '^' + data.latestVersion,
              status: data.status,
              baseUpthrows: data.baseUpcastResources?.map((b: any) => b.resourceName),
              versions: data.resourceVersions.map((rv: any) => rv.version),
              linkTo: FUtil.LinkTo.resourceDetails({
                resourceID: data.resourceId,
              }),
            },
          ],
        },
      });
    },
    * deleteObjectDepR({ payload }: DeleteObjectDepRAction, { put, select }: EffectsCommandMap) {
      const { storageObjectEditor }: ConnectState = yield select(({ storageObjectEditor }: ConnectState) => ({
        storageObjectEditor,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          depRs: storageObjectEditor.depRs.filter((dr) => {
            return dr.name !== payload;
          }),
        },
      });
    },
    * addObjectDepO({ payload }: AddObjectDepOAction, { call, put, select }: EffectsCommandMap) {

      const { storageObjectEditor }: ConnectState = yield select(({ storageObjectEditor }: ConnectState) => ({
        storageObjectEditor,
      }));

      const params: Parameters<typeof FServiceAPI.Storage.objectDetails>[0] = {
        objectIdOrName: payload,
      };
      const { data } = yield call(FServiceAPI.Storage.objectDetails, params);

      const params1: Parameters<typeof FServiceAPI.Storage.cycleDependencyCheck>[0] = {
        objectIdOrName: storageObjectEditor.objectId,
        dependencies: [{
          name: `${data.bucketName}/${data.objectName}`,
          type: 'object',
        }],
      };

      const { data: data1 } = yield call(FServiceAPI.Storage.cycleDependencyCheck, params1);

      if (!data1) {
        return fMessage('循环依赖，不能添加', 'error');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          depOs: [
            ...storageObjectEditor.depOs,
            {
              id: data.objectId,
              name: `${data.bucketName}/${data.objectName}`,
              type: data.resourceType,
              identity: 'object',
              linkTo: FUtil.LinkTo.objectDetails({
                bucketName: data.bucketName,
                objectID: data.objectId,
              }),
            },
          ],
        },
      });
    },
    * deleteObjectDepO({ payload }: DeleteObjectDepOAction, { select, put }: EffectsCommandMap) {
      const { storageObjectEditor }: ConnectState = yield select(({ storageObjectEditor }: ConnectState) => ({
        storageObjectEditor,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          depOs: storageObjectEditor.depOs.filter((dr) => {
            return dr.name !== payload;
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
