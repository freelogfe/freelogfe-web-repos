import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';

export interface MarketResourcePageState {
  resourceInfo: null | {
    cover: string;
    name: string;
    type: string;
    tags: string[];
    about: string;
  };

  popularity: number;
  hasCollect: boolean;

  allNodes: {
    id: string;
    name: string;
    signed: boolean;
  }[];
  selectedNode: string;

  signResources: {
    checked: boolean;
    id: string;
    name: string;
    type: string;
    policies?: {
      checked: boolean;
      id: string;
      name: string;
      text: string;
    }[];
    contracts?: {
      id: string;
      name: string;
      text: string;
      createTime: string;
    }[],
  }[];

  allVersions: string[];
  version: string;
  releaseTime: string;

  description: string;
  showAllDescription: boolean;

  properties: {
    key: string;
    value: string;
  }[];

  options: {
    key: string;
    value: string;
  }[];

}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'marketResourcePage/change';
  payload: Partial<MarketResourcePageState>;
}

interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

export interface MarketResourcePageModelType {
  namespace: 'marketResourcePage';
  state: MarketResourcePageState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<MarketResourcePageState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: MarketResourcePageModelType = {
    namespace: 'marketResourcePage',
    state: {
      resourceInfo: {
        cover: 'https://image.freelog.com/preview-image/f3b712c4a7a052d71226e1d5b1c0c3342ae8d725',
        name: 'stefan/Smells like teen spirit',
        type: 'audio',
        tags: ['音乐', '摇滚'],
        about: '《Smells Like Teen Spirit》是涅槃乐队演唱的一首垃圾摇滚风格单曲，由科特·柯本、大卫·格鲁、克里斯特·诺沃塞克共同作词作曲，布奇·维格制作，发行于1991年9月10日，被收录在涅槃乐队第二张录',
      },

      popularity: 219,
      hasCollect: false,

      allNodes: [
        {id: '1234', name: '我的音乐节点1', signed: false},
        {id: '123456', name: '我的音乐节点2', signed: true},
      ],
      selectedNode: '123456',

      signResources: [
        // {
        //   checked: true,
        //   id: '234dsfds',
        //   name: 'stefan/Smells like teen spirit',
        //   type: 'audio',
        //   policies: [
        //     {
        //       checked: true,
        //       id: '23sdfasd',
        //       name: '策略1',
        //       text: 'initial:\n' +
        //         '    active\n' +
        //         '    recontractable\n' +
        //         '    presentable\n' +
        //         '    terminate',
        //     }, {
        //       checked: true,
        //       id: '23sdfasd',
        //       name: '策略1',
        //       text: 'initial:\n' +
        //         '    active\n' +
        //         '    recontractable\n' +
        //         '    presentable\n' +
        //         '    terminate',
        //     }
        //   ],
        // },
        {
          checked: true,
          id: '234dsfds2',
          name: 'stefan/Smells like teen spirit',
          type: 'audio',
          contracts: [{
            id: '23sdfasd',
            name: '策略1',
            createTime: '2020/05/19',
            text: 'initial:\n' +
              '    active\n' +
              '    recontractable\n' +
              '    presentable\n' +
              '    terminate',
          }, {
            id: '23sdfasd2',
            name: '策略1',
            createTime: '2020/05/19',
            text: 'initial:\n' +
              '    active\n' +
              '    recontractable\n' +
              '    presentable\n' +
              '    terminate',
          }]
        }
      ],

      allVersions: ['1.1.0'],
      version: '1.1.0',
      releaseTime: '2020/05/19',

      description: '<p>123423</p><p>123423</p><p>123423</p><p>123423</p><p>123423</p><p>123423</p><p>123423</p><p>123423</p><p>123423</p><p>123423</p><p>123423</p><p>123423</p><p>123423</p>',
      showAllDescription: true,

      properties: [
        {key: '类型', value: 'audio'},
        {key: '语言', value: '英语'},
        {key: '最新版本', value: '1.1.3'},
        {key: '唱片公司', value: 'Geffen'},
        {key: '专辑', value: 'Nevermind'},
        {key: '唱片类型', value: '录音室专辑'},
      ],

      options: [
        {key: '推荐语1', value: '录音室专辑'},
        {key: '推荐语2', value: '录音室专辑'},
      ],
    },
    effects: {
      * fetchInfo({}, {}) {

      },
    }
    ,
    reducers: {
      change(state, {payload}) {
        return {
          ...state,
          ...payload,
        }
      }
      ,
    }
    ,
    subscriptions: {
      setup({}) {

      }
    }
  }
;

export default Model;
