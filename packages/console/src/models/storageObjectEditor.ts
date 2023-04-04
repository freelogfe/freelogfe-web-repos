import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import fMessage from '@/components/fMessage';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import { history } from 'umi';
import { UpdateAObjectAction } from '@/models/storageHomePage';
import { fileAttrUnits } from '@/utils/format';

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
  // visible: boolean;
  objectId: string;
  bucketName: string;
  objectName: string;
  sha1: string;
  size: number;
  // type: string;
  // typeVerify: 1 | 2; // 1: 校验中；2: 校验完成
  // typeError: string;
  resourceTypeCodes: Array<string | number>;

  rawProperties: {
    key: string;
    value: string;
  }[];

  baseProperties: {
    key: string;
    value: string;
    description: string;
  }[];
  basePropertiesEditorVisible: boolean;
  basePropertiesEditorData: {
    key: string;
    keyError: string;
    value: string;
    valueError: string;
    description: string;
    descriptionError: string;
  }[];
  basePropertyEditorIndex: number;
  basePropertyEditorData: {
    key: string;
    keyError: string;
    value: string;
    valueError: string;
    description: string;
    descriptionError: string;
  } | null;

  customOptionsDataVisible: boolean;
  customOptionsData: {
    key: string;
    description: string;
    custom: 'input' | 'select';
    defaultValue: string;
    customOption: string;
  }[];
  customOptionsEditorVisible: boolean;
  customOptionsEditorDataSource: {
    key: string;
    keyError: string;
    description: string;
    descriptionError: string;
    custom: 'input' | 'select';
    defaultValue: string;
    defaultValueError: string;
    customOption: string;
    customOptionError: string;
  }[];
  customOptionIndex: number;
  customOptionEditorData: {
    key: string;
    keyError: string;
    description: string;
    descriptionError: string;
    custom: 'input' | 'select';
    defaultValue: string;
    defaultValueError: string;
    customOption: string;
    customOptionError: string;
  } | null;

  depRs: DepR[];
  depOs: DepO[];
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'storageObjectEditor/change';
  payload: Partial<StorageObjectEditorModelState>;
}

export interface FetchInfoAction extends AnyAction {
  type: 'storageObjectEditor/fetchInfo';
  // payload: string;
}

export interface OnClick_SaveBtn_Action extends AnyAction {
  type: 'storageObjectEditor/onClick_SaveBtn';
  // payload: string;
}

// export interface UpdateObjectInfoAction extends AnyAction {
//   type: 'storageObjectEditor/updateObjectInfo';
// }

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
    value: StorageObjectEditorModelState['resourceTypeCodes'];
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
    // deleteObjectDep: (action: DeleteObjectDepAction, effects: EffectsCommandMap) => void;
    // updateObjectInfo: (action: UpdateObjectInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<StorageObjectEditorModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

export const storageObjectEditorInitData: StorageObjectEditorModelState = {
  // visible: false,
  objectId: '',
  bucketName: '',
  objectName: '',
  sha1: '',
  // type: '',
  // typeVerify: 2,
  // typeError: '',
  size: 0,

  resourceTypeCodes: [],

  rawProperties: [],

  baseProperties: [],
  basePropertiesEditorVisible: false,
  basePropertiesEditorData: [],
  basePropertyEditorIndex: -1,
  basePropertyEditorData: null,

  customOptionsDataVisible: false,
  customOptionsData: [],
  customOptionsEditorVisible: false,
  customOptionsEditorDataSource: [],
  customOptionIndex: -1,
  customOptionEditorData: null,

  depRs: [],
  depOs: [],
};

const Model: StorageObjectEditorModelType = {
  namespace: 'storageObjectEditor',
  state: storageObjectEditorInitData,
  effects: {
    * fetchInfo({}: FetchInfoAction, { call, put, select }: EffectsCommandMap) {
      // console.log(payload, 'duixiangID09w3ujlkasdfasdfasdf');
      const { storageObjectEditor, user }: ConnectState = yield select(({
                                                                          storageObjectEditor,
                                                                          user,
                                                                        }: ConnectState) => ({
        storageObjectEditor,
        user,
      }));

      // console.log(storageObjectEditor, 'storageObjectEditor0q923u4oj4l234');

      if (!storageObjectEditor.objectId) {
        return;
      }
      const params: Parameters<typeof FServiceAPI.Storage.objectDetails>[0] = {
        objectIdOrName: storageObjectEditor.objectId,
      };
      const { data } = yield call(FServiceAPI.Storage.objectDetails, params);
      // console.log(data, 'data@#Rwe90ifjsdlkfa');
      // if (!data || data.userId !== user.cookiesUserID) {
      if (!data || data.userId !== FUtil.Tool.getUserIDByCookies()) {
        history.replace(FUtil.LinkTo.exception403());
        return;
      }
      const resources: any[] = data.dependencies
        .filter((ro: any) => ro.type === 'resource');
      const objects: any[] = data.dependencies
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
      console.log(data.resourceType, '#Q@#$R@#FASD');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          objectId: data.objectId,
          bucketName: data.bucketName,
          objectName: data.objectName,
          sha1: data.sha1,
          // type: data.resourceType,
          // resourceTypeCodes: data.resourceType,
          size: data.systemProperty.fileSize,
          rawProperties: Object.entries(data.systemProperty).map((s: any) => ({
            key: s[0],
            // value: s[0] === 'fileSize' ? FUtil.Format.humanizeSize(s[1]) : s[1],
            value: fileAttrUnits[s[0]] ? fileAttrUnits[s[0]](s[1]) : s[1],
          })),
          baseProperties: (data.customPropertyDescriptors as any[])
            .filter((cpd: any) => cpd.type === 'readonlyText')
            .map<StorageObjectEditorModelState['baseProperties'][number]>((cpd: any) => {
              return {
                key: cpd.key,
                value: cpd.defaultValue,
                description: cpd.remark,
              };
            }),
          customOptionsData: (data.customPropertyDescriptors as any[])
            .filter((cpd: any) => cpd.type !== 'readonlyText')
            .map<StorageObjectEditorModelState['customOptionsData'][number]>((cpd: any) => {
              return {
                key: cpd.key,
                // keyError: '',
                description: cpd.remark,
                // descriptionError: '',
                custom: cpd.type === 'editableText' ? 'input' : 'select',
                defaultValue: cpd.defaultValue,
                // defaultValueError: '',
                customOption: cpd.candidateItems.join(','),
                // customOptionError: '',
              };
            }),
          depRs: depRs,
          depOs: depOs,
        },
      });
    },
    * onClick_SaveBtn({}: OnClick_SaveBtn_Action, { select, call, put }: EffectsCommandMap) {
      const { storageObjectEditor }: ConnectState = yield select(({ storageObjectEditor }: ConnectState) => ({
        storageObjectEditor,
      }));
      // console.log(storageObjectEditor.resource_Type, 'storageObjectEditor.resource_Type09owpjsdlkfj');
      const params: Parameters<typeof FServiceAPI.Storage.updateObject>[0] = {
        objectIdOrName: encodeURIComponent(`${storageObjectEditor.bucketName}/${storageObjectEditor.objectName}`),
        resourceType: storageObjectEditor.resourceTypeCodes
          .map<string>((rt) => {
            return String(rt);
          })
          .filter((s) => {
            return s !== '';
          }),
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
        customPropertyDescriptors: [
          ...storageObjectEditor.baseProperties.map<NonNullable<Parameters<typeof FServiceAPI.Storage.updateObject>[0]['customPropertyDescriptors']>[number]>((i) => {
            return {
              type: 'readonlyText',
              key: i.key,
              remark: i.description,
              defaultValue: i.value,
            };
          }),
          ...storageObjectEditor.customOptionsData.map<NonNullable<Parameters<typeof FServiceAPI.Storage.updateObject>[0]['customPropertyDescriptors']>[number]>((i) => {
            const isInput: boolean = i.custom === 'input';
            const options: string[] = i.customOption.split(',');
            return {
              type: isInput ? 'editableText' : 'select',
              key: i.key,
              remark: i.description,
              defaultValue: isInput ? i.defaultValue : options[0],
              candidateItems: isInput ? undefined : options,
            };
          }),
        ],
      };
      // console.log(params, 'params098io3wkqlsaejfdlkjfl');
      yield call(FServiceAPI.Storage.updateObject, params);

      yield put<UpdateAObjectAction>({
        type: 'storageHomePage/updateAObject',
        payload: {
          id: storageObjectEditor.objectId,
          type: storageObjectEditor.resourceTypeCodes.map<string>((rt) => {
            return String(rt);
          }),
        },
      });

      history.replace(FUtil.LinkTo.storageSpace({ bucketName: storageObjectEditor.bucketName }));
    },
    * onChangeType({ payload }: OnChangeTypeAction, { put, select, call }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceTypeCodes: payload.value,
        },
      });
      // let resourceTypeErrorText = '';
      // if (payload.length < 3 && payload.length > 0) {
      //   resourceTypeErrorText = '不少于3个字符';
      // } else if (payload.length > 20) {
      //   resourceTypeErrorText = '不多于20个字符';
      // } else if (payload !== '' && !FUtil.Regexp.RESOURCE_TYPE.test(payload)) {
      //   resourceTypeErrorText = `不符合正则 /^(?!_)[a-z0-9_]{3,20}(?<!_)$/`;
      // }
      //
      // if (!resourceTypeErrorText && payload) {
      //   yield put<ChangeAction>({
      //     type: 'change',
      //     payload: {
      //       typeVerify: 1,
      //     },
      //   });
      //   const {storageObjectEditor}: ConnectState = yield select(({storageObjectEditor}: ConnectState) => ({
      //     storageObjectEditor,
      //   }));
      //   const params: Parameters<typeof FServiceAPI.Storage.fileProperty>[0] = {
      //     sha1: storageObjectEditor.sha1,
      //     resourceType: payload,
      //   };
      //
      //   const {data} = yield call(FServiceAPI.Storage.fileProperty, params);
      //   if (!data) {
      //     // resourceTypeErrorText = '不能设置为' + payload + '类型';
      //     resourceTypeErrorText = FI18n.i18nNext.t('file_format_incorrect');
      //   }
      // }
      //
      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {
      //     type: payload,
      //     typeError: resourceTypeErrorText,
      //     typeVerify: 2,
      //   },
      // });
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
    // * updateObjectInfo({}: UpdateObjectInfoAction, { call, select, put }: EffectsCommandMap) {
    //   const { storageObjectEditor }: ConnectState = yield select(({ storageObjectEditor }: ConnectState) => ({
    //     storageObjectEditor,
    //   }));
    //   const params: Parameters<typeof FServiceAPI.Storage.updateObject>[0] = {
    //     objectIdOrName: encodeURIComponent(`${storageObjectEditor.bucketName}/${storageObjectEditor.objectName}`),
    //     resourceType: storageObjectEditor.type,
    //     dependencies: [
    //       ...storageObjectEditor.depRs.map((r) => ({
    //         name: r.name,
    //         type: 'resource',
    //         versionRange: r.version,
    //       })),
    //       ...storageObjectEditor.depOs.map((o) => ({
    //         name: o.name,
    //         type: 'object',
    //       })),
    //     ],
    //     customPropertyDescriptors: [
    //       ...storageObjectEditor.baseProperties.map<NonNullable<Parameters<typeof FServiceAPI.Storage.updateObject>[0]['customPropertyDescriptors']>[number]>((i) => {
    //         return {
    //           type: 'readonlyText',
    //           key: i.key,
    //           remark: i.description,
    //           defaultValue: i.value,
    //         };
    //       }),
    //       ...storageObjectEditor.customOptionsData.map<NonNullable<Parameters<typeof FServiceAPI.Storage.updateObject>[0]['customPropertyDescriptors']>[number]>((i) => {
    //         const isInput: boolean = i.custom === 'input';
    //         const options: string[] = i.customOption.split(',');
    //         return {
    //           type: isInput ? 'editableText' : 'select',
    //           key: i.key,
    //           remark: i.description,
    //           defaultValue: isInput ? i.defaultValue : options[0],
    //           candidateItems: isInput ? undefined : options,
    //         };
    //       }),
    //     ],
    //   };
    //   yield call(FServiceAPI.Storage.updateObject, params);
    // },
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
