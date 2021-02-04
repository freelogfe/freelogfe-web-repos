import {DvaReducer, WholeMutable, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from "@/models/connect";
import {
  createRules,
  CreateRulesParamsType,
  rulesRematch,
  RulesRematchParamsType,
  testNodeRules,
  TestNodeRulesParamsType,
  testResources,
  TestResourcesParamsType,
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

  exhibitList: {
    id: string;
    cover: string;
    associatedExhibitID: string;
    name: string;
    title: string;
    rule: {
      add?: {
        exhibit: string;
        source: {
          type: 'resource' | 'object';
          name: string;
        };
      };
      alter?: string;
      version?: string;
      cover?: string;
      title?: string;
      online?: boolean;
      offline?: boolean;
      labels?: string[];
      replaces?: {
        replacer: {
          type: 'resource' | 'object';
          name: string;
        };
        replaced: string;
        scope: string[][];
      }[];
      attrs?: {
        type: 'add' | 'delete',
        theKey: string;
        value?: string;
        description?: string;
      }[];
    };
    version: string;
    isOnline: boolean;
    resourceId: string;
    isAuth: boolean;
    authErrorText: string;
  }[];
  exhibitListIsLoading: boolean;

  themeList: {
    id: string;
    name: string;
    cover: string;
    version: string;
    rules: any[];
    isOnline: boolean;
    isAuth: boolean;
    authErrorText: string;
  }[];
  themeListIsLoading: boolean;

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
  codeSaveSuccess: null | true;
}>;

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

export interface FetchThemeListAction extends AnyAction {
  type: 'informalNodeManagerPage/fetchThemeList';
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
    // rematchRules: (action: RematchRulesAction, effects: EffectsCommandMap) => void;
    fetchThemeList: (action: FetchThemeListAction, effects: EffectsCommandMap) => void;
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
  showPage: 'exhibit',

  addExhibitDrawerVisible: false,

  replaceHandlerModalVisible: true,
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
  exhibitListIsLoading: false,

  themeList: [],
  themeListIsLoading: false,

  isCodeEditing: true,
  codeInput: '',
  codeIsDirty: false,
  codeIsChecking: false,
  codeCompileErrors: null,
  codeExecutionError: null,
  codeSaveSuccess: null,
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

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibitListIsLoading: true,
        }
      });

      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const params2: RuleMatchStatusParams = {
        nodeID: informalNodeManagerPage.nodeID,
        isRematch: true,
      };

      const {data: data1} = yield call(ruleMatchStatus, params2);
      // console.log(bool, 'bool1234');

      const params: TestResourcesParamsType = {
        nodeId: informalNodeManagerPage.nodeID,
        onlineStatus: 2,
        omitResourceType: 'theme',
        limit: 100,
      };

      const {data} = yield call(testResources, params);
      // console.log(data, 'DDD@@@@@');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibitListIsLoading: false,
          exhibitList: (data.dataList as any[]).map<InformalNodeManagerPageModelState['exhibitList'][number]>((dl) => {
            const operations: string[] = [];
            // console.log(operations, 'operations12334');
            const stateInfo = dl.stateInfo;

            // operations.map<InformalNodeManagerPageModelState['exhibitList'][number]['rules'][number]>((o) => {
            const rule: InformalNodeManagerPageModelState['exhibitList'][number]['rule'] = {
              add: operations.includes('add') ? {
                exhibit: dl.testResourceName,
                source: {
                  type: stateInfo.type,
                  name: stateInfo.name,
                }
              } : undefined,
              alter: operations.includes('alter') ? dl.testResourceName : undefined,
              labels: operations.includes('setTags') ? stateInfo.tagInfo.tags : undefined,
              title: operations.includes('setTitle') ? stateInfo.titleInfo.title : undefined,
              cover: operations.includes('setCover') ? stateInfo.coverInfo.coverImages[0] : undefined,
              online: operations.includes('setOnlineStatus') && stateInfo.onlineStatusInfo.onlineStatus === 1 ? true : undefined,
              offline: operations.includes('setOnlineStatus') && stateInfo.onlineStatusInfo.onlineStatus === 0 ? true : undefined,
              // attrs:
            };
            // propertyInfo:
            // ruleId: "88325cef8778f28bffed94d39d2291d8"
            // testResourceProperty: (4) [{…}, {…}, {…}, {…}]
            // __proto__: Object
            // themeInfo:
            // isActivatedTheme: 0
            // ruleId: "default"
            // __proto__: Object

            return {
              id: dl.testResourceId,
              key: dl.testResourceId,
              associatedExhibitID: dl.associatedPresentableId,
              cover: dl.stateInfo.coverInfo.coverImages[0] || '',
              name: dl.testResourceName,
              title: dl.stateInfo.titleInfo.title,
              rule: rule,
              version: dl.originInfo.version,
              isOnline: dl.status === 1,
              resourceId: dl.originInfo.id,
              isAuth: true,
              authErrorText: '',
            };
          }),
        }
      });
    },
    * fetchThemeList({}: FetchThemeListAction, {call, select, put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          themeListIsLoading: true,
        }
      });

      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const params2: RuleMatchStatusParams = {
        nodeID: informalNodeManagerPage.nodeID,
        isRematch: true,
      };

      yield call(ruleMatchStatus, params2);

      const params: TestResourcesParamsType = {
        nodeId: informalNodeManagerPage.nodeID,
        onlineStatus: 2,
        resourceType: 'theme',
        limit: 100,
      };
      const {data} = yield call(testResources, params);
      // console.log(data, '\\\\\\\\\\\@@@@@');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          themeListIsLoading: false,
          themeList: (data.dataList as any[]).map<InformalNodeManagerPageModelState['themeList'][number]>((dl) => {
            // console.log(dl, 'dl1234213');
            return {
              id: dl.testResourceId,
              cover: dl.stateInfo.coverInfo.coverImages[0] || '',
              name: dl.testResourceName,
              rules: [],
              version: dl.originInfo.version,
              isOnline: dl.stateInfo.onlineStatusInfo.onlineStatus === 1,
              isAuth: true,
              authErrorText: '',
            };
          }),
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

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          codeInput: data.ruleText,
        },
      });

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
          codeSaveSuccess: null,
        },
      });

      const params: CreateRulesParamsType = {
        nodeId: informalNodeManagerPage.nodeID,
        testRuleText: informalNodeManagerPage.codeInput,
      };
      const {data} = yield call(createRules, params);

      const params1: RuleMatchStatusParams = {
        nodeID: informalNodeManagerPage.nodeID,
      };
      const {data: data1} = yield call(ruleMatchStatus, params1);

      const codeExecutionError = data1.testRules
        .filter((tr: any) => {
          return tr.matchErrors.length > 0;
        })
        .map((tr: any) => {
          return tr.matchErrors.map((me: string) => {
            return {
              msg: me,
            };
          });
        })
        .flat();

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          codeIsChecking: false,
          codeExecutionError: codeExecutionError.length > 0 ? codeExecutionError : null,
          codeSaveSuccess: codeExecutionError.length === 0 ? true : null,
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

interface RuleMatchStatusParams {
  nodeID: number;
  isRematch?: boolean;
}

async function ruleMatchStatus({nodeID, isRematch = false}: RuleMatchStatusParams): Promise<any> {
  const params: RulesRematchParamsType = {
    nodeId: nodeID,
  };

  if (isRematch) {
    await rulesRematch({nodeId: nodeID});
  }

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
