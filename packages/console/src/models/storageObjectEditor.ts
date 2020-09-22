import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {objectDetails, ObjectDetailsParamsType2, updateObject, UpdateObjectParamsType} from "@/services/storages";
import {ConnectState} from "@/models/connect";

export interface StorageObjectEditorModelState {
  // info: null | {};
  // objectId: string;
  visible: boolean;
  bucketName: string;
  objectName: string;
  size: number;
  type: string;
  depR: {
    name: string;
    type: string;
    version: string;
    baseUpthrows: string[];
  }[];
  depO: {
    name: string;
    type: string;
  }[];
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

export interface StorageObjectEditorModelType {
  namespace: 'storageObjectEditor';
  state: StorageObjectEditorModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    updateObjectInfo: (action: UpdateObjectInfoAction, effects: EffectsCommandMap) => void;
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
    bucketName: 'bucket-001',
    objectName: '23',
    type: 'image',
    size: 523423,
    depR: [],
    depO: [],
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
          depR: [],
          depO: [],
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
    }
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
