import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {FCustomPropertiesProps} from "@/pages/resource/components/FCustomProperties";

export interface ResourceVersionEditorPageModelState {
  version: string;
  signingDate: string;
  resourceID: string;
  description: string;
  properties: FCustomPropertiesProps['dataSource'],
}

export interface ResourceVersionEditorModelType {
  namespace: 'resourceVersionEditorPage';
  state: ResourceVersionEditorPageModelState;
  effects: {
    fetchDataSource: Effect;
  };
  reducers: {
    changeDataSource: DvaReducer<ResourceVersionEditorPageModelState, AnyAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceVersionEditorModelType = {

  namespace: 'resourceVersionEditorPage',

  state: {
    version: '10.15.4',
    signingDate: '2020-05-19',
    resourceID: 'adhjtyrghgjhxdfthgasdhdflgkftr',
    // description: '<p><span style="color:#f32784">天气<em>色</em><u><em>等</em>烟</u>雨，</span></p><p><span style="color:#f32784">而我</span><strong><span style="color:#f32784">在</span>等<span style="color:#61a951">你</span></strong></p>',
    description: '<p>啊水电费水电费水电费水电费</p><p>水电费</p><p>水电费</p><p></p><p>水电费</p><p></p><p>水电费</p><p>水电费</p><p></p><p>水电费</p><p></p><p>水电费</p><p>水电费</p><p></p><p>水电费</p><p></p><p></p><p>水电费</p><p></p><p>水电费</p><p>水电费</p><p></p><p>水电费</p><p></p><p>水电费</p><p>水电费</p><p>vvvv水电费</p><p>水电费</p><p></p><p>水电费水电费vvv</p><p>水电费</p><p>水电费vv水电费</p><p></p><p>水电费水电费</p>',
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
  },

  effects: {
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      yield put({type: 'save'});
    },
  },

  reducers: {
    changeDataSource(state: ResourceVersionEditorPageModelState, action: AnyAction): ResourceVersionEditorPageModelState {
      return {...state, ...action.payload};
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },

};

export default Model;
