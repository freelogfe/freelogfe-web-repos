import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';

export interface ResourceSilderModelState {
  info: {
    name: string;
    resourceType: string;
    cover: string;
    versions: string[];
    status: 'online',
  };
}

interface ChangeInfoAction extends AnyAction {
  type: 'resourceSilder/changeInfoAction',
  payload: ResourceSilderModelState['info'];
}

// export

export interface ResourceInfoPageModelType {
  namespace: 'resourceSilder';
  state: ResourceSilderModelState;
  effects: {
    fetchDataSource: Effect;
  };
  reducers: {
    changeInfo: DvaReducer<ResourceSilderModelState, ChangeInfoAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceInfoPageModelType = {
  namespace: 'resourceSilder',

  state: {
    info: {
      name: 'ww-zh/freelog-waterfall-picture1',
      resourceType: 'image',
      cover: 'https://cn.bing.com/th?id=OHR.FrederickSound_ZH-CN1838908749_UHD.jpg&pid=hp&w=3840&h=2160&rs=1&c=4&r=0',
      versions: ['1.1.2', '1.3.42', '52.342.12'],
      status: 'online',
    },
  },

  effects: {
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      yield put({type: 'save'});
    },
  },

  reducers: {
    changeInfo(state: ResourceSilderModelState, action: ChangeInfoAction): ResourceSilderModelState {
      return {
        ...state,
        info: action.payload
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      // console.log(history, 'historyhistory');
    },
  },

};

export default Model;
