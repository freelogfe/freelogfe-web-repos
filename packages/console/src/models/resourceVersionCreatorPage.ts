import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {FSelectObject} from '@/pages/resource/components/FSelectObject';
import {FCustomPropertiesProps} from '@/pages/resource/components/FCustomProperties';
import {
  createVersion,
  CreateVersionParamsType, lookDraft, LookDraftParamsType,
  saveVersionsDraft,
  SaveVersionsDraftParamsType
} from "@/services/resources";
import {ConnectState, MarketPageModelState} from "@/models/connect";
import {router} from "umi";
import BraftEditor, {EditorState} from "braft-editor";
import fMessage from '@/components/fMessage';
import {FetchDataSourceAction} from "@/models/resourceInfo";
import any = jasmine.any;

export type DepResources = Readonly<{
  id: string;
  title: string;
  resourceType: string;
  time: string;
  status: 0 | 1;
  version: Readonly<{
    isCustom: boolean;
    select: string;
    allowUpdate: boolean;
    input: string;
  }>;
  versions: string[];
  upthrow: boolean;
  enableReuseContracts: Readonly<{
    checked: boolean;
    title: string;
    status: 'executing' | 'stopped';
    code: string;
    id: string;
    date: string;
    versions: string[];
  }>[];
  enabledPolicies: Readonly<{
    checked: boolean;
    id: string;
    title: string;
    code: string;
  }>[];
}>[];

export type Relationship = Readonly<{
  id: string;
  children: Readonly<{
    id: string;
  }>[];
}>[];

export interface ResourceVersionCreatorPageModelState {
  version: string;
  resourceObject: FSelectObject['resourceObject'];

  depRelationship: Relationship;
  dependencies: DepResources;
  depActivatedID: string;

  properties: FCustomPropertiesProps['dataSource'];
  description: EditorState;

  draftData: any;
}

export interface OnChangeDependenciesByIDAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onChangeDependenciesByID';
  payload: Partial<ResourceVersionCreatorPageModelState['dependencies'][number]>;
  id: ResourceVersionCreatorPageModelState['dependencies'][number]['id'];
}

export interface DeleteDependencyByIDAction extends AnyAction {
  type: 'resourceVersionCreatorPage/deleteDependencyByID';
  payload: ResourceVersionCreatorPageModelState['dependencies'][number]['id'];
}

export interface OnChangeDepActivatedIDAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onChangeDepActivatedID';
  payload: ResourceVersionCreatorPageModelState['dependencies'][number]['id'];
}

export interface CreateVersionAction extends AnyAction {
  type: 'resourceVersionCreatorPage/createVersion';
}

export interface FetchDraftAction extends AnyAction {
  type: 'resourceVersionCreatorPage/fetchDraft';
  payload: string;
}

export interface SaveDraftAction extends AnyAction {
  type: 'resourceVersionCreatorPage/saveDraft';
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceVersionCreatorPage/change',
  payload: Partial<ResourceVersionCreatorPageModelState>;
}

export interface ResourceVersionCreatorModelType {
  namespace: 'resourceVersionCreatorPage';
  state: ResourceVersionCreatorPageModelState;
  effects: {
    // fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void; ;
    createVersion: (action: CreateVersionAction, effects: EffectsCommandMap) => void;
    fetchDraft: (action: FetchDraftAction, effects: EffectsCommandMap) => void;
    saveDraft: (action: SaveDraftAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<MarketPageModelState, ChangeAction>;
    deleteDependencyByID: DvaReducer<ResourceVersionCreatorPageModelState, DeleteDependencyByIDAction>;
    onChangeDependenciesByID: DvaReducer<ResourceVersionCreatorPageModelState, OnChangeDependenciesByIDAction>;
    onChangeDepActivatedID: DvaReducer<ResourceVersionCreatorPageModelState, OnChangeDepActivatedIDAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceVersionCreatorModelType = {

  namespace: 'resourceVersionCreatorPage',

  state: {
    version: '',
    resourceObject: null,
    depRelationship: [],
    dependencies: [],
    depActivatedID: '',
    properties: [],
    description: BraftEditor.createEditorState(''),
    draftData: null,
  },

  effects: {
    // * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
    //   yield put({type: 'save'});
    // },

    * createVersion(action: CreateVersionAction, {call, select, put}: EffectsCommandMap) {
      const params: CreateVersionParamsType = yield select(({resourceVersionCreatorPage, resourceInfo}: ConnectState) => ({
        resourceId: resourceInfo.info?.resourceId,
        version: resourceVersionCreatorPage.version,
        fileSha1: resourceVersionCreatorPage.resourceObject?.id,
        resolveResources: [],
        customPropertyDescriptors: resourceVersionCreatorPage.properties.map((i) => ({
          key: i.key,
          defaultValue: i.value,
          type: !i.allowCustom ? 'readonlyText' : i.custom === 'input' ? 'editableText' : 'select',
          candidateItems: i.customOption ? i.customOption.split(',') : [],
          remark: i.description,
        })),
        description: resourceVersionCreatorPage.description.toHTML(),
      }));
      const {data} = yield call(createVersion, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          draftData: null,
        },
      });
      yield put<FetchDataSourceAction>({
        type: 'resourceInfo/fetchDataSource',
        payload: params.resourceId,
      });
      router.replace(`/resource/${data.resourceId}/version/${data.version}/success`)
    },
    * fetchDraft(action: FetchDraftAction, {call, put}: EffectsCommandMap) {
      const params: LookDraftParamsType = {
        resourceId: action.payload,
      };
      const {data} = yield call(lookDraft, params);
      if (!data) {
        return yield put<ChangeAction>({
          type: 'change',
          payload: {
            draftData: null,
            version: '',
            resourceObject: null,
            depRelationship: [],
            dependencies: [],
            depActivatedID: '',
            properties: [],
            description: BraftEditor.createEditorState(''),
          }
        });
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...data.draftData,
          description: BraftEditor.createEditorState(data.draftData.description),
          draftData: data.draftData,
        }
      });

      // console.log(data.draftData.description, 'data.draftData.description');
    },
    * saveDraft(action: SaveDraftAction, {call, select, put}: EffectsCommandMap) {
      const params: SaveVersionsDraftParamsType = yield select(({resourceVersionCreatorPage, resourceInfo}: ConnectState) => ({
        resourceId: resourceInfo.info?.resourceId,
        draftData: {
          ...resourceVersionCreatorPage,
          description: resourceVersionCreatorPage.description.toHTML(),
        },
      }));
      yield call(saveVersionsDraft, params);
      fMessage('暂存草稿成功');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          draftData: params.draftData,
        },
      });
    },
  },

  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    onChangeDependenciesByID(state: ResourceVersionCreatorPageModelState, action: OnChangeDependenciesByIDAction): ResourceVersionCreatorPageModelState {
      const resources = state.dependencies;
      const dependencies = resources.map((i) => {
        if (i.id !== action.id) {
          return i;
        }
        return {
          ...i,
          ...action.payload,
        };
      });

      return {
        ...state,
        dependencies,
      };
    },
    deleteDependencyByID(state: ResourceVersionCreatorPageModelState, action: DeleteDependencyByIDAction): ResourceVersionCreatorPageModelState {
      const depRelationship = state.depRelationship.filter((i) => i.id !== action.payload);
      const usedResourceID: string[] = [];
      for (const i of depRelationship) {
        usedResourceID.push(i.id);
        for (const j of i.children) {
          usedResourceID.push(j.id);
        }
      }
      const dependencies = state.dependencies.filter((i) => usedResourceID.includes(i.id));
      return {
        ...state,
        depRelationship,
        dependencies,
      };
    },
    onChangeDepActivatedID(state: ResourceVersionCreatorPageModelState, action: OnChangeDepActivatedIDAction): ResourceVersionCreatorPageModelState {
      return {
        ...state,
        depActivatedID: action.payload
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      dispatch({
        type: 'init',
      });
    },
  },

};

export default Model;
