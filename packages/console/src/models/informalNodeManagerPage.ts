import {DvaReducer, WholeMutable, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from "@/models/connect";
import {
  createRules,
  CreateRulesParamsType, putRules, PutRulesParamsType,
  rulesRematch,
  RulesRematchParamsType,
  testNodeRules,
  TestNodeRulesParamsType,
  testResources,
  TestResourcesParamsType,
} from "@/services/informalNodes";
import {completeUrlByDomain} from "@/utils/format";

const {decompile, compile} = require('@freelog/nmr_translator');

interface IMappingRule {
  add?: {
    exhibit: string;
    source: {
      type: 'resource' | 'object';
      name: string;
    };
  };
  alter?: string;
  active?: string;
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
}

export type InformalNodeManagerPageModelState = WholeReadonly<{
  nodeID: number;
  nodeName: string;
  nodeUrl: string;
  testNodeUrl: string;
  ruleText: string;

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

  selectedType: '-1' | string;
  selectedStatus: '0' | '1' | '2';
  filterKeywords: string;

  exhibitListIsLoading: boolean;

  themeListIsLoading: boolean;
  addThemeDrawerVisible: boolean;

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
}> & {
  exhibitList: {
    id: string;
    cover: string;
    associatedExhibitID: string;
    name: string;
    title: string;
    identity: 'resource' | 'object';
    originId: string;
    rule: IMappingRule;
    version: string;
    isOnline: boolean;
    isAuth: boolean;
    authErrorText: string;
  }[];

  themeList: {
    id: string;
    name: string;
    cover: string;
    version: string;
    rule: IMappingRule;
    isOnline: boolean;
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
  type: 'informalNodeManagerPage/fetchExhibitList' | 'fetchExhibitList';
  payload: {
    isRematch?: boolean;
    isRestart?: boolean;
  };
}

export interface FetchThemeListAction extends AnyAction {
  type: 'informalNodeManagerPage/fetchThemeList' | 'fetchThemeList';
  payload: {
    isRematch?: boolean;
    isRestart?: boolean;
  };
}

export interface FetchRulesAction extends AnyAction {
  type: 'informalNodeManagerPage/fetchRules';
}

export interface SaveRulesAction extends AnyAction {
  type: 'informalNodeManagerPage/saveRules';
}

interface ICandidate {
  name: string;
  versionRange?: string;
  type: 'resource' | 'object';
}

export interface SaveDataRulesAction extends AnyAction {
  type: 'informalNodeManagerPage/saveDataRules';
  payload: {
    type: 'append' | 'replace';
    data: {
      operation: 'add' | 'alter';
      exhibitName: string;
      candidate?: ICandidate;
      labels?: string[];
      replace?: {
        replaced: ICandidate;
        replacer: ICandidate;
        scopes: ICandidate[][];
      }[];
      online?: boolean;
      cover?: string;
      title?: string;
      attrs?: {
        operation: 'add' | 'delete';
        key: string;
        value?: string;
        description?: string;
      }[];
    }[];
  }
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
    saveDataRules: (action: SaveDataRulesAction, effects: EffectsCommandMap) => void;
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
  ruleText: '',
  showPage: 'exhibit',

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

  selectedType: '-1',
  selectedStatus: '2',
  filterKeywords: '',
  exhibitList: [],
  exhibitListIsLoading: false,

  themeList: [],
  themeListIsLoading: false,
  addThemeDrawerVisible: false,

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
    * fetchExhibitList({payload: {isRematch = true, isRestart}}: FetchExhibitListAction, {call, select, put}: EffectsCommandMap) {

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
        isRematch: isRematch,
      };

      const {data: data1} = yield call(ruleMatchStatus, params2);
      // console.log(data1, 'bool1234');

      const params: TestResourcesParamsType = {
        nodeId: informalNodeManagerPage.nodeID,
        onlineStatus: Number(informalNodeManagerPage.selectedStatus) as 2,
        omitResourceType: 'theme',
        resourceType: informalNodeManagerPage.selectedType === '-1' ? undefined : informalNodeManagerPage.selectedType,
        limit: 100,
        keywords: informalNodeManagerPage.filterKeywords || undefined,
      };

      const {data} = yield call(testResources, params);
      // console.log(data, 'DDD@@@@890j23poijrl;adsf@');

      const {rules: rulesObj} = compile(data1.ruleText);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ruleText: data1.ruleText,
          exhibitListIsLoading: false,
          exhibitList: (data.dataList as any[]).map<InformalNodeManagerPageModelState['exhibitList'][number]>((dl) => {
            const operations: string[] = dl.rules[0]?.operations || [];
            // console.log(operations, 'operations12334');
            const stateInfo = dl.stateInfo;

            const rulesObjRule = rulesObj.find((ro: any) => {
              // console.log(ro, dl, '#############***********;ojsifw389');
              return ro.exhibitName === dl.testResourceName;
            });

            // console.log(rulesObjRule, 'rulesObjRuleoiejw89w3asdfasd');

            // operations.map<InformalNodeManagerPageModelState['exhibitList'][number]['rules'][number]>((o) => {
            const rule: InformalNodeManagerPageModelState['exhibitList'][number]['rule'] = {
              add: operations.includes('add') ? {
                exhibit: dl.testResourceName,
                source: {
                  type: stateInfo.type,
                  name: stateInfo.name,
                },
              } : undefined,
              alter: operations.includes('alter') ? dl.testResourceName : undefined,
              labels: operations.includes('setTags') ? stateInfo.tagInfo.tags : undefined,
              title: operations.includes('setTitle') ? stateInfo.titleInfo.title : undefined,
              cover: operations.includes('setCover') ? stateInfo.coverInfo.coverImages[0] : undefined,
              online: operations.includes('setOnlineStatus') && stateInfo.onlineStatusInfo.onlineStatus === 1 ? true : undefined,
              offline: operations.includes('setOnlineStatus') && stateInfo.onlineStatusInfo.onlineStatus === 0 ? true : undefined,
              attrs: rulesObjRule?.attrs ? rulesObjRule.attrs.map((a: any) => {
                return {
                  type: a.operation,
                  theKey: a.key,
                  value: a.value,
                  description: a.description,
                };
              }) : undefined,
              // active
            };
            return {
              id: dl.testResourceId,
              key: dl.testResourceId,
              associatedExhibitID: dl.associatedPresentableId,
              cover: dl.stateInfo.coverInfo.coverImages[0] || '',
              name: dl.testResourceName,
              title: dl.stateInfo.titleInfo.title,
              identity: dl.originInfo.type,
              rule: rule,
              version: dl.originInfo.version,
              isOnline: dl.stateInfo.onlineStatusInfo.onlineStatus === 1,
              originId: dl.originInfo.name,
              isAuth: true,
              authErrorText: '',
            };
          }),
        }
      });
    },
    * fetchThemeList({payload: {isRematch = true, isRestart}}: FetchThemeListAction, {call, select, put}: EffectsCommandMap) {
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
        isRematch: isRematch,
      };

      const {data: data1} = yield call(ruleMatchStatus, params2);

      const params: TestResourcesParamsType = {
        nodeId: informalNodeManagerPage.nodeID,
        onlineStatus: 2,
        resourceType: 'theme',
        limit: 100,
      };
      const {data} = yield call(testResources, params);
      // console.log(data, '890234ujndlskfl;asd@@@@');

      const activatedTheme: string | null = data.dataList.find((dd: any) => {
        return dd.stateInfo.themeInfo.ruleId !== 'default';
      })?.testResourceName || null;

      // console.log(activatedTheme, 'activatedTheme0923jldskv90zpasdf');
      const {rules: rulesObj} = compile(data1.ruleText);
      // console.log(rulesObj, 'rulesObjiosfjewwef');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ruleText: data1.ruleText,
          themeListIsLoading: false,
          themeList: (data.dataList as any[]).map<InformalNodeManagerPageModelState['themeList'][number]>((dl) => {
            const operations: string[] = dl.rules[0]?.operations || [];
            // console.log(operations, 'operations12334');
            const stateInfo = dl.stateInfo;

            const rulesObjRule = rulesObj.find((ro: any) => {
              // console.log(ro, dl, '98uwi@#DSAFUHJ(*)hjkljl');
              return ro.exhibitName === dl.testResourceName;
            });

            // console.log(rulesObjRule, 'rulesObjRuleoiejw89w3asdfasd');

            // operations.map<InformalNodeManagerPageModelState['exhibitList'][number]['rules'][number]>((o) => {
            const rule: InformalNodeManagerPageModelState['themeList'][number]['rule'] = {
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
              // online: activatedTheme === dl.testResourceName ? dl.testResourceName : undefined,
              // offline: operations.includes('setOnlineStatus') && stateInfo.onlineStatusInfo.onlineStatus === 0 ? true : undefined,
              attrs: rulesObjRule?.attrs ? rulesObjRule.attrs.map((a: any) => {
                return {
                  type: a.operation,
                  theKey: a.key,
                  value: a.value,
                  description: a.description,
                };
              }) : undefined,
              active: activatedTheme === dl.testResourceName ? dl.testResourceName : undefined,
            };
            return {
              id: dl.testResourceId,
              cover: dl.stateInfo.coverInfo.coverImages[0] || '',
              name: dl.testResourceName,
              rule: rule,
              version: dl.originInfo.version,
              isOnline: activatedTheme ? activatedTheme === dl.testResourceName : stateInfo.onlineStatusInfo.onlineStatus === 1,
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
          ruleText: data1.ruleText,
          codeIsChecking: false,
          codeExecutionError: codeExecutionError.length > 0 ? codeExecutionError : null,
          codeSaveSuccess: codeExecutionError.length === 0 ? true : null,
        },
      });
    },

    * saveDataRules({payload}: SaveDataRulesAction, {call, select, put}: EffectsCommandMap) {

      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      // console.log(payload.data, 'payload.data0923jlkfasdfasdf');
      // console.log(JSON.stringify(payload.data), 'payload.data0923jlkfasdfasdf');
      const text = decompile(payload.data);
      // console.log(text, 'text1234fklsadj');

      if (payload.type === 'append') {
        const params: PutRulesParamsType = {
          nodeId: informalNodeManagerPage.nodeID,
          additionalTestRule: text,
        };
        const {data} = yield call(putRules, params);
      }

      if (payload.type === 'replace') {
        const params: CreateRulesParamsType = {
          nodeId: informalNodeManagerPage.nodeID,
          testRuleText: text,
        };
        const {data} = yield call(createRules, params);
      }

      if (informalNodeManagerPage.showPage === 'exhibit') {
        yield put<FetchExhibitListAction>({
          type: 'fetchExhibitList',
          payload: {
            isRematch: false,
          },
        });
      }
      if (informalNodeManagerPage.showPage === 'theme') {
        yield put<FetchThemeListAction>({
          type: 'fetchThemeList',
          payload: {
            isRematch: false,
          },
        });
      }
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
