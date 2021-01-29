import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from "@/models/connect";
import {
  createRules, CreateRulesParamsType,
  rulesRematch,
  RulesRematchParamsType,
  testNodeRules, TestNodeRulesParamsType,
  testResources,
  TestResourcesParamsType
} from "@/services/informalNodes";
import {completeUrlByDomain} from "@/utils/format";

export type InformalNodeManagerPageModelState = WholeReadonly<{
  nodeID: number;
  nodeName: string;
  nodeUrl: string;
  testNodeUrl: string;

  showPage: 'exhibit' | 'theme' | 'mappingRule';

  addExhibitDrawerVisible: boolean;

  replaceHandlerModalVisible: boolean;
  replacerActivatedTab: 'market' | 'resource' | 'collection';
  replacerInput: string;
  replacerList: {
    id: string;
    checked: boolean;
    name: string;
    status: 'online' | 'offline' | 'unreleased';
    type: string;
    latestVersion: string;
    version: string;
    date: string;
  }[];
  themeList: { id: string; }[];

  isCodeEditing: boolean;
  codeInput: string;
  codeIsDirty: boolean;
  codeIsChecking: boolean;
  codeCompileErrors: null | {
    charPositionInLine: number;
    line: number;
    msg: string;
    offendingSymbol: string;
  }[];
  codeExecutionError: null | {
    msg: string;
  }[];
}> & {
  exhibitList: {
    key: string;
    id: string;
    cover: string;
    name: string;
    title: string;
    rules: [];
    version: string;
    isOnline: boolean;
    resourceId: string;
    isAuth: boolean;
    authErrorText: string;
  }[];
};

export interface ChangeAction extends AnyAction {
  type: 'change' | 'informalNodeManagerPage/change';
  payload: Partial<InformalNodeManagerPageModelState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'initModelStates';
}

export interface FetchInfoAction extends AnyAction {
  type: 'informalNodeManagerPage/fetchInfo';
}

export interface FetchExhibitListAction extends AnyAction {
  type: 'informalNodeManagerPage/fetchExhibitList';
}

export interface FetchRulesAction extends AnyAction {
  type: 'informalNodeManagerPage/fetchRules';
}

export interface SaveRulesAction extends AnyAction {
  type: 'informalNodeManagerPage/saveRules';
}

interface InformalNodeManagerPageModelType {
  namespace: 'informalNodeManagerPage';
  state: InformalNodeManagerPageModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
    fetchExhibitList: (action: FetchExhibitListAction, effects: EffectsCommandMap) => void;
    fetchRules: (action: FetchRulesAction, effects: EffectsCommandMap) => void;
    saveRules: (action: SaveRulesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<InformalNodeManagerPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: InformalNodeManagerPageModelState = {

  nodeID: -1,
  nodeName: '',
  nodeUrl: '',
  testNodeUrl: '',
  showPage: 'mappingRule',

  addExhibitDrawerVisible: false,

  replaceHandlerModalVisible: false,
  replacerActivatedTab: 'market',
  replacerInput: '',
  replacerList: [{
    id: '1',
    checked: false,
    name: 'yuliang/package.json',
    type: 'json',
    latestVersion: '1.0.1',
    version: '1.1.1',
    date: '2021-11-22',
    status: 'online',
  }, {
    id: '2',
    checked: true,
    name: 'Freelog/blog-theme',
    type: 'json',
    latestVersion: '1.0.1',
    version: '1.1.1',
    date: '2021-11-22',
    status: 'online',
  }],

  exhibitList: [],

  themeList: [
    {id: '1'},
    {id: '2'},
    {id: '3'},
    {id: '4'},
    {id: '5'},
  ],

  isCodeEditing: true,
  codeInput: '',
  codeIsDirty: false,
  codeIsChecking: false,
  codeCompileErrors: null,
  codeExecutionError: null,
};

const Model: InformalNodeManagerPageModelType = {
  namespace: 'informalNodeManagerPage',
  state: initStates,
  effects: {
    * fetchInfo({}: FetchInfoAction, {select, put}: EffectsCommandMap) {
      const {nodes, informalNodeManagerPage}: ConnectState = yield select(({nodes, informalNodeManagerPage}: ConnectState) => ({
        nodes,
        informalNodeManagerPage,
      }));

      const currentNode = nodes.list.find((n) => n.nodeId === informalNodeManagerPage.nodeID);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeName: currentNode?.nodeName,
          nodeUrl: completeUrlByDomain(currentNode?.nodeDomain || ''),
          testNodeUrl: completeUrlByDomain('t.' + currentNode?.nodeDomain || ''),
        },
      });

    },
    * initModelStates({}: InitModelStatesAction, {put,}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * fetchExhibitList({}: FetchExhibitListAction, {call, select, put}: EffectsCommandMap) {
      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const params2: RulesRematchParamsType = {
        nodeId: informalNodeManagerPage.nodeID,
      };
      yield call(rulesRematch, params2);

      const params1: ruleMatchStatusParams = {
        nodeID: informalNodeManagerPage.nodeID,
      };
      yield call(ruleMatchStatus, params1);
      // console.log(bool, 'bool1234');

      const params: TestResourcesParamsType = {
        nodeId: informalNodeManagerPage.nodeID,
        onlineStatus: 2,
        omitResourceType: 'theme',
      };

      const {data} = yield call(testResources, params);
      // console.log(data, 'DDD@@@@@');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibitList: (data.dataList as any[]).map<InformalNodeManagerPageModelState['exhibitList'][number]>((dl) => {
            return {
              id: dl.testResourceId,
              key: dl.testResourceId,
              cover: dl.stateInfo.coverInfo.coverImages[0] || '',
              name: dl.originInfo.name,
              title: dl.stateInfo.titleInfo.title,
              rules: [],
              version: dl.originInfo.version,
              isOnline: dl.status === 1,
              resourceId: dl.originInfo.id,
              isAuth: true,
              authErrorText: '',
            };
          }),
        }
      })
    },
    * saveRules({}: SaveRulesAction, {select, call, put}: EffectsCommandMap) {
      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          codeIsChecking: true,
          codeCompileErrors: null,
          codeExecutionError: null,
        },
      });

      const params: CreateRulesParamsType = {
        nodeId: informalNodeManagerPage.nodeID,
        testRuleText: informalNodeManagerPage.codeInput,
      };
      const {data} = yield call(createRules, params);

      const params1: ruleMatchStatusParams = {
        nodeID: informalNodeManagerPage.nodeID,
      };
      const {data: data1} = yield call(ruleMatchStatus, params1);
      //codeExecutionError
      console.log(data1, 'data11234');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          codeIsChecking: false,
          codeExecutionError: data1.testRules.filter((tr: any) => {
            return tr.matchErrors.length > 0;
          }).map((tr: any) => {
            return tr.matchErrors.map((me: string) => {
              return {
                msg: me,
              };
            });
          }).flat(),
        },
      });
    },
    * fetchRules({}: FetchRulesAction, {call, select, put}: EffectsCommandMap) {
      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const params: TestNodeRulesParamsType = {
        nodeId: informalNodeManagerPage.nodeID,
      };

      const {data} = yield call(testNodeRules, params);
      console.log(data, '!@#$@#DFASEF');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          codeInput: data.ruleText,
        },
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

interface ruleMatchStatusParams {
  nodeID: number;
}

async function ruleMatchStatus({nodeID}: ruleMatchStatusParams): Promise<any> {
  const params: RulesRematchParamsType = {
    nodeId: nodeID,
  };

  while (true) {
    const response = await testNodeRules({nodeId: nodeID});
    // console.log(response, 'response1234');
    if (response.data.status === 1) {
      await sleep();
    } else {
      if (response.data.status === 2) {
        throw new Error('匹配失败');
      }
      return response;
    }
  }

  function sleep(ms: number = 200) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, ms);
    });
  }
}
