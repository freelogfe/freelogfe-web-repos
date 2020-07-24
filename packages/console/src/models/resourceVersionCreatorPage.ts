import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {FSelectObject} from '@/pages/resource/components/FSelectObject';
import {FCustomPropertiesProps} from '@/pages/resource/components/FCustomProperties';

export type DepResources = Readonly<{
  id: string;
  title: string;
  resourceType: string;
  time: string;
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
  description: string;
}

export interface OnChangeVersionAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onChangeVersion';
  payload: ResourceVersionCreatorPageModelState['version'];
}

export interface OnChangeResourceObjectAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onChangeResourceObject';
  payload: ResourceVersionCreatorPageModelState['resourceObject'];
}

export interface OnChangeDepRelationshipAction extends AnyAction {
  type: 'resourceVersionCreatorPage/changeDepRelationship';
  payload: ResourceVersionCreatorPageModelState['depRelationship'];
}

export interface OnChangeDependenciesAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onChangeDependencies';
  payload: ResourceVersionCreatorPageModelState['dependencies'];
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

export interface OnChangePropertiesAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onChangeProperties';
  payload: ResourceVersionCreatorPageModelState['properties'];
}

export interface OnChangeDescriptionAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onChangeDescription';
  payload: ResourceVersionCreatorPageModelState['description'];
}

export interface ResourceVersionCreatorModelType {
  namespace: 'resourceVersionCreatorPage';
  state: ResourceVersionCreatorPageModelState;
  effects: {
    fetchDataSource: Effect;
    init: Effect;
  };
  reducers: {
    onChangeVersion: DvaReducer<ResourceVersionCreatorPageModelState, OnChangeVersionAction>;
    onChangeResourceObject: DvaReducer<ResourceVersionCreatorPageModelState, OnChangeResourceObjectAction>;
    changeDepRelationship: DvaReducer<ResourceVersionCreatorPageModelState, OnChangeDepRelationshipAction>;
    onChangeDependencies: DvaReducer<ResourceVersionCreatorPageModelState, OnChangeDependenciesAction>;
    deleteDependencyByID: DvaReducer<ResourceVersionCreatorPageModelState, DeleteDependencyByIDAction>;
    onChangeDependenciesByID: DvaReducer<ResourceVersionCreatorPageModelState, OnChangeDependenciesByIDAction>;
    onChangeDepActivatedID: DvaReducer<ResourceVersionCreatorPageModelState, OnChangeDepActivatedIDAction>;
    onChangeProperties: DvaReducer<ResourceVersionCreatorPageModelState, OnChangePropertiesAction>;
    onChangeDescription: DvaReducer<ResourceVersionCreatorPageModelState, OnChangeDescriptionAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceVersionCreatorModelType = {

  namespace: 'resourceVersionCreatorPage',

  state: {
    version: '1.2.3',
    resourceObject: null,
    depRelationship: [],
    dependencies: [],
    depActivatedID: '',

    properties: [{
      key: 'myKey',
      value: 'myValue',
      description: 'myDescription',
      allowCustom: true,
      custom: 'select',
      customOption: 'abc,def,ghi',
    }, {
      key: 'myKey2',
      value: 'myValue',
      description: 'myDescription',
      allowCustom: true,
      custom: 'select',
      customOption: 'abc,def,ghi',
    }, {
      key: 'myKey3',
      value: 'myValue',
      description: 'myDescription',
      allowCustom: true,
      custom: 'select',
      customOption: 'abc,def,ghi',
    }],
    description: '12423',
  },

  effects: {
    * init(_: AnyAction, {call, put, take}: EffectsCommandMap) {
      // yield put({type: 'save'});
      // console.log('####*****');
      // while (true) {
      //   yield take('deleteDependencyByID');
      //   console.log('deleteDependencyByID');
      // }
    },
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      yield put({type: 'save'});
    },
  },

  reducers: {
    onChangeVersion(state: ResourceVersionCreatorPageModelState, action: OnChangeVersionAction): ResourceVersionCreatorPageModelState {
      return {...state, version: action.payload};
    },
    onChangeResourceObject(state: ResourceVersionCreatorPageModelState, action: OnChangeResourceObjectAction): ResourceVersionCreatorPageModelState {
      return {...state, resourceObject: action.payload};
    },
    changeDepRelationship(state: ResourceVersionCreatorPageModelState, action: OnChangeDepRelationshipAction): ResourceVersionCreatorPageModelState {
      return {...state, depRelationship: action.payload};
    },
    onChangeDependencies(state: ResourceVersionCreatorPageModelState, action: OnChangeDependenciesAction): ResourceVersionCreatorPageModelState {
      return {...state, dependencies: action.payload};
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

    onChangeProperties(state: ResourceVersionCreatorPageModelState, action: OnChangePropertiesAction): ResourceVersionCreatorPageModelState {
      return {...state, properties: action.payload};
    },
    onChangeDescription(state: ResourceVersionCreatorPageModelState, action: OnChangeDescriptionAction): ResourceVersionCreatorPageModelState {
      return {...state, description: action.payload};
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      // console.log('#######');
      dispatch({
        type: 'init',
      });
    },

    // suba1234({dispatch}: SubscriptionAPI) {
    // },
  },

};

export default Model;
