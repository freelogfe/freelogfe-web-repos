import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {FSelectObject} from "@/pages/resource/components/FSelectObject";
import {FDepPanelProps} from "@/pages/resource/components/FDepPanel";
import {FCustomPropertiesProps} from "@/pages/resource/components/FCustomProperties";

export interface ResourceVersionCreatorPageModelState {
  version: string;
  resourceObject: FSelectObject['resourceObject'];
  upthrow: string[];
  dependencies: FDepPanelProps['dataSource'];
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

export interface OnChangeUpthrowAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onChangeUpthrow';
  payload: ResourceVersionCreatorPageModelState['upthrow'];
}

export interface OnChangeDependenciesAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onChangeDependencies';
  payload: ResourceVersionCreatorPageModelState['dependencies'];
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
  };
  reducers: {
    onChangeVersion: DvaReducer<ResourceVersionCreatorPageModelState, OnChangeVersionAction>;
    onChangeResourceObject: DvaReducer<ResourceVersionCreatorPageModelState, OnChangeResourceObjectAction>;
    onChangeUpthrow: DvaReducer<ResourceVersionCreatorPageModelState, OnChangeUpthrowAction>;
    onChangeDependencies: DvaReducer<ResourceVersionCreatorPageModelState, OnChangeDependenciesAction>;
    onChangeProperties: DvaReducer<ResourceVersionCreatorPageModelState, OnChangePropertiesAction>;
    onChangeDescription: DvaReducer<ResourceVersionCreatorPageModelState, OnChangeDescriptionAction>;
  };
  subscriptions: { setup: Subscription };
}

const code = 'initial:\n' +
  '    active\n' +
  '    recontractable\n' +
  '    presentable\n' +
  '    terminate';

const Model: ResourceVersionCreatorModelType = {

  namespace: 'resourceVersionCreatorPage',

  state: {
    version: '1.2.3',
    resourceObject: null,
    //   {
    //   id: '12341234',
    //   name: '资源1',
    //   size: 101234123,
    //   path: 'bucket21/1234.gif'
    // },
    upthrow: ['1234', '34234'],
    dependencies: [
      {
        id: 'string',
        activated: true,
        title: 'liukai/hahaha',
        resourceType: 'image',
        version: {
          isCustom: false,
          input: '',
          allowUpdate: true,
          select: '1.2.3',
        },
        versions: ['11.2.3', '1.2.3'],
        upthrow: false,
        enableReuseContracts: [{
          checked: true,
          title: '买奶粉',
          status: 'stopped',
          code: code,
          id: '1234',
          date: '2013-12-22',
          versions: ['12.23.3', '1.42.3'],
        }],
        enabledPolicies: [{
          checked: true,
          id: 'string',
          title: 'string',
          code: code,
        }]
      }, {
        id: 'string2',
        activated: false,
        title: 'liukai2/hahaha2',
        resourceType: 'image',
        version: {
          isCustom: false,
          input: '',
          allowUpdate: true,
          select: '1.2.3',
        },
        versions: ['11.2.3', '1.2.3'],
        upthrow: false,
        enableReuseContracts: [{
          checked: true,
          title: '买奶粉2',
          status: 'executing',
          code: code,
          id: '1234',
          date: '2013-12-22',
          versions: ['12.23.3', '1.42.3'],
        }, {
          checked: false,
          title: '买奶粉sd2',
          status: 'executing',
          code: code,
          id: '12342345',
          date: '2013-12-22',
          versions: ['12.23.3', '1.42.3'],
        }],
        enabledPolicies: [{
          checked: true,
          id: 'string',
          title: 'string',
          code: code,
        }, {
          checked: true,
          id: 'stringzd',
          title: 'hello',
          code: code,
        }]
      }
    ],
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
    onChangeUpthrow(state: ResourceVersionCreatorPageModelState, action: OnChangeUpthrowAction): ResourceVersionCreatorPageModelState {
      return {...state, upthrow: action.payload};
    },
    onChangeDependencies(state: ResourceVersionCreatorPageModelState, action: OnChangeDependenciesAction): ResourceVersionCreatorPageModelState {
      return {...state, dependencies: action.payload};
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
    },
  },

};

export default Model;
