import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {
  batchObjectList, BatchObjectListParamsType,
  objectDetails,
  ObjectDetailsParamsType2,
  updateObject,
  UpdateObjectParamsType
} from "@/services/storages";
import {ConnectState} from "@/models/connect";
import {batchInfo, BatchInfoParamsType, info, InfoParamsType} from "@/services/resources";

interface DepR {
  name: string;
  type: string;
  version: string;
  status: 0 | 1;
  baseUpthrows: string[];
}

interface DepO {
  name: string;
  type: string;
}

export interface StorageObjectEditorModelState {
  visible: boolean;
  bucketName: string;
  objectName: string;
  size: number;
  type: string;
  depRs: DepR[];
  depOs: DepO[];
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'storageObjectEditor/change';
  payload: Partial<StorageObjectEditorModelState>;
}

export interface FetchInfoAction extends AnyAction {
  type: 'storageObjectEditor/fetchInfo';
  payload: string;
}

export interface FetchRDepsAction extends AnyAction {
  type: 'fetchRDepAction';
  payload: {
    name: string;
    version: string;
  }[];
}

export interface FetchODepsAction extends AnyAction {
  type: 'fetchODepAction';
  payload: string;
}

export interface UpdateObjectInfoAction extends AnyAction {
  type: 'storageObjectEditor/updateObjectInfo';
  // payload: {
  //   type?: string;
  //   depR?: StorageObjectEditorModelState['depR'];
  //   depO?: StorageObjectEditorModelState['depO'];
  // };
}

export interface AddObjectDepRAction extends AnyAction {
  type: 'storageObjectEditor/addObjectDepR';
  payload: string;
}

export interface AddObjectDepOAction extends AnyAction {
  type: 'storageObjectEditor/addObjectDepO';
  payload: string;
}

export interface SyncObjectDepAction extends AnyAction {
  type: 'syncObjectDep';
  // payload: string;
}

export interface DeleteObjectDepAction extends AnyAction {
  type: 'storageObjectEditor/deleteObjectDep';
  payload: {
    resourceName?: string;
    objectName?: string;
  };
}

export interface StorageObjectEditorModelType {
  namespace: 'storageObjectEditor';
  state: StorageObjectEditorModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    fetchRDepAction: (action: FetchRDepsAction, effects: EffectsCommandMap) => void;
    fetchODepAction: (action: FetchODepsAction, effects: EffectsCommandMap) => void;
    updateObjectInfo: (action: UpdateObjectInfoAction, effects: EffectsCommandMap) => void;
    addObjectDepR: (action: AddObjectDepRAction, effects: EffectsCommandMap) => void;
    addObjectDepO: (action: AddObjectDepOAction, effects: EffectsCommandMap) => void;
    deleteObjectDep: (action: DeleteObjectDepAction, effects: EffectsCommandMap) => void;
    syncObjectDep: (action: SyncObjectDepAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<StorageObjectEditorModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: StorageObjectEditorModelType = {
  namespace: 'storageObjectEditor',
  state: {
    visible: false,
    bucketName: '',
    objectName: '',
    type: '',
    size: 0,
    depRs: [],
    depOs: [],
  },
  effects: {
    * fetchInfo({payload}: FetchInfoAction, {call, put}: EffectsCommandMap) {
      const params: ObjectDetailsParamsType2 = {
        objectIdOrName: payload,
      };
      const {data} = yield call(objectDetails, params);
      // console.log(data, '@#DCCADSFC');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bucketName: data.bucketName,
          objectName: data.objectName,
          type: data.resourceType,
          size: data.systemProperty.fileSize,
          depRs: [],
          depOs: [],
        },
      });

      const resourceNames = data.dependencies
        .filter((ro: any) => ro.type === 'resource');
      // .map((r: any) => r.name);
      const objectNames: string[] = data.dependencies
        .filter((ro: any) => ro.type === 'object')
        .map((r: any) => r.name);

      if (resourceNames.length > 0) {
        yield put<FetchRDepsAction>({
          type: 'fetchRDepAction',
          payload: resourceNames.map((r: any) => ({
            name: r.name,
            version: r.versionRange,
          })),
        });
      }

      if (objectNames.length > 0) {
        yield put<FetchODepsAction>({
          type: 'fetchODepAction',
          payload: objectNames.join(','),
        });
      }
    },
    * fetchRDepAction({payload}: FetchRDepsAction, {call, put}: EffectsCommandMap) {
      const params: BatchInfoParamsType = {
        resourceNames: payload.map((r) => r.name).join(','),
      };
      const {data} = yield call(batchInfo, params);
      console.log(data, 'resourceNames[9adsjflk');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          depRs: data.map((r: any) => ({
            name: r.resourceName,
            type: r.resourceType,
            version: payload.find((sr) => sr.name === r.resourceName)?.version,
            status: r.status,
            baseUpthrows: r.baseUpcastResources.map((sr: any) => sr.resourceName),
          })),
        }
      });
    },
    * fetchODepAction({payload}: FetchODepsAction, {call, put}: EffectsCommandMap) {
      const params: BatchObjectListParamsType = {
        fullObjectNames: payload,
      };
      const {data} = yield call(batchObjectList, params);
      // console.log(data, 'fullObjectNames2309opsdmadfs');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          depOs: data.map((o: any) => ({
            name: o.bucketName + '/' + o.objectName,
            type: o.resourceType,
          })),
        }
      });
    },
    * updateObjectInfo({}: UpdateObjectInfoAction, {call, select, put}: EffectsCommandMap) {
      const {storageObjectEditor}: ConnectState = yield select(({storageObjectEditor}: ConnectState) => ({
        storageObjectEditor,
      }));
      const params: UpdateObjectParamsType = {
        objectIdOrName: encodeURIComponent(`${storageObjectEditor.bucketName}/${storageObjectEditor.objectName}`),
        resourceType: storageObjectEditor.type,
      };
      yield call(updateObject, params);
    },
    * addObjectDepR({payload}: AddObjectDepRAction, {call, put, select}: EffectsCommandMap) {
      const params: InfoParamsType = {
        resourceIdOrName: payload,
      };
      const {data} = yield call(info, params);
      // console.log(data, 'datadata213esdf');
      const {storageObjectEditor}: ConnectState = yield select(({storageObjectEditor}: ConnectState) => ({
        storageObjectEditor,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          depRs: [
            ...storageObjectEditor.depRs,
            {
              name: data.resourceName,
              type: data.resourceType,
              version: data.latestVersion,
              status: data.status,
              baseUpthrows: data.baseUpcastResources?.map((b: any) => b.resourceName),
            },
          ],
        },
      });

      yield put<SyncObjectDepAction>({
        type: 'syncObjectDep',
      });
    },
    * addObjectDepO({payload}: AddObjectDepOAction, {call, put, select}: EffectsCommandMap) {
      const params: ObjectDetailsParamsType2 = {
        objectIdOrName: payload,
      };
      const {data} = yield call(objectDetails, params);
      const {storageObjectEditor}: ConnectState = yield select(({storageObjectEditor}: ConnectState) => ({
        storageObjectEditor,
      }));
      // console.log(data, 'adsf#@DS');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          depOs: [
            ...storageObjectEditor.depOs,
            {
              name: `${data.bucketName}/${data.objectName}`,
              type: data.resourceType,
            },
          ],
        }
      });

      yield put<SyncObjectDepAction>({
        type: 'syncObjectDep',
      });
    },
    * deleteObjectDep({payload}: DeleteObjectDepAction, {put, select}: EffectsCommandMap) {
      const {storageObjectEditor}: ConnectState = yield select(({storageObjectEditor}: ConnectState) => ({
        storageObjectEditor,
      }));

      if (payload.resourceName) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            depRs: storageObjectEditor.depRs.filter((r) => r.name !== payload.resourceName),
          },
        });
      }
      if (payload.objectName) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            depOs: storageObjectEditor.depOs.filter((r) => r.name !== payload.objectName),
          },
        });
      }

      yield put<SyncObjectDepAction>({
        type: 'syncObjectDep',
      });
    },
    * syncObjectDep({}: SyncObjectDepAction, {select, call}: EffectsCommandMap) {
      const {storageObjectEditor}: ConnectState = yield select(({storageObjectEditor}: ConnectState) => ({storageObjectEditor}));
      const params: UpdateObjectParamsType = {
        objectIdOrName: encodeURIComponent(`${storageObjectEditor.bucketName}/${storageObjectEditor.objectName}`),
        dependencies: [
          ...storageObjectEditor.depRs.map((r) => ({
            name: r.name,
            type: 'resource',
            versionRange: r.version,
          })),
          ...storageObjectEditor.depOs.map((o) => ({
            name: o.name,
            type: 'object',
            // versionRange: r.version,
          })),
        ],
      };
      yield call(updateObject, params);
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
