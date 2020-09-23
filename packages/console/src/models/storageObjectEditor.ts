import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {objectDetails, ObjectDetailsParamsType2, updateObject, UpdateObjectParamsType} from "@/services/storages";
import {ConnectState} from "@/models/connect";
import {info, InfoParamsType} from "@/services/resources";

interface DepR {
  name: string;
  type: string;
  version: string;
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

export interface UpdateObjectInfoAction extends AnyAction {
  type: 'storageObjectEditor/updateObjectInfo';
  // payload: {
  //   type?: string;
  //   depR?: StorageObjectEditorModelState['depR'];
  //   depO?: StorageObjectEditorModelState['depO'];
  // };
}

export interface UpdateObjectDepRAction extends AnyAction {
  type: 'storageObjectEditor/updateObjectDepR';
  payload: string;
}

export interface UpdateObjectDepOAction extends AnyAction {
  type: 'storageObjectEditor/updateObjectDepO';
  payload: string;
}

export interface StorageObjectEditorModelType {
  namespace: 'storageObjectEditor';
  state: StorageObjectEditorModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    updateObjectInfo: (action: UpdateObjectInfoAction, effects: EffectsCommandMap) => void;
    updateObjectDepR: (action: UpdateObjectDepRAction, effects: EffectsCommandMap) => void;
    updateObjectDepO: (action: UpdateObjectDepOAction, effects: EffectsCommandMap) => void;
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
    * updateObjectDepR({payload}: UpdateObjectDepRAction, {call, put, select}: EffectsCommandMap) {
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
              baseUpthrows: data.baseUpcastResources,
            },
          ],
        },
      });
    },
    * updateObjectDepO({payload}: UpdateObjectDepOAction, {call, put, select}: EffectsCommandMap) {
      const params: ObjectDetailsParamsType2 = {
        objectIdOrName: payload,
      };
      const {data} = yield call(objectDetails, params);
      const {storageObjectEditor}: ConnectState = yield select(({storageObjectEditor}: ConnectState) => ({
        storageObjectEditor,
      }));
      console.log(data, 'adsf#@DS');
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
