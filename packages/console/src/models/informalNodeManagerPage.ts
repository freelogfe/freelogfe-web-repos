import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from '@/models/connect';
import {FUtil, FServiceAPI} from '@freelog/tools-lib';
import {router} from "umi";

const {decompile, compile} = require('@freelog/nmr_translator');

interface IMappingRule {
  add?: {
    exhibit: string;
    source: {
      type: 'resource' | 'object';
      name: string;
      version?: string;
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
    replaced: ICandidate;
    replacer: ICandidate;
    scopes: ICandidate[][];
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

  exhibitsTotal: number;
  // exhibitListIsLoading: boolean;
  themesTotal: number;

  // themeListIsLoading: boolean;
  addThemeDrawerVisible: boolean;

  mappingRule: IMappingRule[];
  checkedExhibitName: string[];
  checkedThemeName: string;
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
    identity: 'resource' | 'object' | 'exhibit';
    originInfo: {
      id: string;
      name: string;
      type: 'resource' | 'object';
    };
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
    originInfo: {
      id: string;
      name: string;
      type: 'resource' | 'object';
    };
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
  replacerList: [],
  replacerInput: '',

  selectedType: '-1',
  selectedStatus: '2',
  filterKeywords: '',

  exhibitList: [],
  exhibitsTotal: -1,
  // exhibitListIsLoading: false,

  themeList: [],
  themesTotal: -1,
  // themeListIsLoading: false,
  addThemeDrawerVisible: false,

  isCodeEditing: false,
  codeInput: '',
  codeIsDirty: false,
  codeIsChecking: false,
  codeCompileErrors: null,
  codeExecutionError: null,
  codeSaveSuccess: null,

  mappingRule: [],
  checkedExhibitName: [],
  checkedThemeName: '',
};

const Model: InformalNodeManagerPageModelType = {
  namespace: 'informalNodeManagerPage',
  state: initStates,
  effects: {
    * fetchInfo({}: FetchInfoAction, {select, put, call}: EffectsCommandMap) {
      const {informalNodeManagerPage, user}: ConnectState = yield select(({informalNodeManagerPage, user}: ConnectState) => ({
        informalNodeManagerPage,
        user,
      }));

      const params: Parameters<typeof FServiceAPI.Node.details>[0] = {
        nodeId: informalNodeManagerPage.nodeID,
      };

      const {data} = yield call(FServiceAPI.Node.details, params);

      if (user.cookiesUserID !== data.ownerUserId) {
        router.replace(FUtil.LinkTo.exception403({}, '90u-=-;dskf'));
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeName: data.nodeName,
          nodeUrl: FUtil.Format.completeUrlByDomain(data.nodeDomain || ''),
          testNodeUrl: FUtil.Format.completeUrlByDomain('t.' + data.nodeDomain),
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

      const {informalNodeManagerPage, nodes}: ConnectState = yield select(({informalNodeManagerPage, nodes}: ConnectState) => ({
        informalNodeManagerPage,
        nodes,
      }));

      if (!nodes.list || !nodes.list.some((n) => n.nodeId === informalNodeManagerPage.nodeID)) {
        return;
      }

      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {
      //     exhibitListIsLoading: true,
      //   }
      // });

      const params2: RuleMatchStatusParams = {
        nodeID: informalNodeManagerPage.nodeID,
        isRematch: isRematch,
      };

      const {data: data1} = yield call(ruleMatchStatus, params2);
      // console.log(data1, '2434234234234234');

      const params: Parameters<typeof FServiceAPI.InformalNode.testResources>[0] = {
        nodeId: informalNodeManagerPage.nodeID,
        onlineStatus: Number(informalNodeManagerPage.selectedStatus) as 2,
        omitResourceType: 'theme',
        resourceType: informalNodeManagerPage.selectedType === '-1' ? undefined : informalNodeManagerPage.selectedType,
        limit: FUtil.Predefined.pageSize,
        keywords: informalNodeManagerPage.filterKeywords || undefined,
      };

      const {data} = yield call(FServiceAPI.InformalNode.testResources, params);
      // console.log(data, 'DDD@@@@890j23poijrl;adsf@');

      const {rules: rulesObj} = compile(data1.ruleText);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ruleText: data1.ruleText,
          // exhibitListIsLoading: false,
          exhibitsTotal: data.totalItem,
          exhibitList: (data.dataList as any[]).map<InformalNodeManagerPageModelState['exhibitList'][number]>((dl) => {
            const operations: string[] = dl.rules[0]?.operations || [];
            // console.log(operations, 'operations12334');
            const stateInfo = dl.stateInfo;

            const rulesObjRule = rulesObj.find((ro: any) => {
              // console.log(ro, dl, '#############***********;ojsifw389');
              return ro.exhibitName === dl.testResourceName;
            });

            const rule: InformalNodeManagerPageModelState['exhibitList'][number]['rule'] = {
              add: operations.includes('add') ? {
                exhibit: dl.testResourceName,
                source: {
                  type: dl.originInfo.type,
                  name: dl.originInfo.name,
                  version: dl.originInfo.type === 'resource' ? dl.originInfo.version : undefined,
                },
              } : undefined,
              alter: operations.includes('alter') ? dl.testResourceName : undefined,
              version: dl.originInfo.type === 'resource' ? dl.originInfo.version : undefined,
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
              replaces: rulesObjRule?.replaces,
            };
            // console.log(dl, 'dl,!@#$!@#$!@#$!@#');
            return {
              id: dl.testResourceId,
              key: dl.testResourceId,
              associatedExhibitID: dl.associatedPresentableId,
              cover: dl.stateInfo.coverInfo.coverImages[0] || '',
              name: dl.testResourceName,
              title: dl.stateInfo.titleInfo.title,
              identity: !!dl.associatedPresentableId ? 'exhibit' : dl.originInfo.type,
              rule: rule,
              version: dl.originInfo.version,
              isOnline: dl.stateInfo.onlineStatusInfo.onlineStatus === 1,
              originInfo: dl.originInfo,
              isAuth: true,
              authErrorText: '',
            };
          }),
        },
      });
    },
    * fetchThemeList({payload: {isRematch = true, isRestart}}: FetchThemeListAction, {call, select, put}: EffectsCommandMap) {
      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {
      //     themeListIsLoading: true,
      //   }
      // });

      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const params2: RuleMatchStatusParams = {
        nodeID: informalNodeManagerPage.nodeID,
        isRematch: isRematch,
      };

      const {data: data1} = yield call(ruleMatchStatus, params2);

      const params: Parameters<typeof FServiceAPI.InformalNode.testResources>[0] = {
        nodeId: informalNodeManagerPage.nodeID,
        onlineStatus: 2,
        resourceType: 'theme',
        limit: FUtil.Predefined.pageSize,
      };
      const {data} = yield call(FServiceAPI.InformalNode.testResources, params);
      // console.log(data, '890234ujndlskfl;asd@@@@1111111');

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
          // themeListIsLoading: false,
          themesTotal: data.totalItem,
          themeList: (data.dataList as any[]).map<InformalNodeManagerPageModelState['themeList'][number]>((dl) => {

            // console.log(dl, 'dl!@@#$#$');

            const operations: string[] = dl.rules[0]?.operations || [];
            // console.log(operations, 'operations12334');
            const stateInfo = dl.stateInfo;

            const rulesObjRule = rulesObj.find((ro: any) => {
              // console.log(ro, dl, '98uwi@#DSAFUHJ(*)hjkljl');
              return ro.exhibitName === dl.testResourceName;
            });

            // operations.map<InformalNodeManagerPageModelState['exhibitList'][number]['rules'][number]>((o) => {
            const rule: InformalNodeManagerPageModelState['themeList'][number]['rule'] = {
              add: operations.includes('add') ? {
                exhibit: dl.testResourceName,
                source: {
                  type: dl.originInfo.type,
                  name: dl.originInfo.name,
                  version: dl.originInfo.type === 'resource' ? dl.originInfo.version : undefined,
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
              replaces: rulesObjRule?.replaces,
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
              originInfo: dl.originInfo,
            };
          }),
        },
      });
    },
    * fetchRules({}: FetchRulesAction, {call, select, put}: EffectsCommandMap) {
      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const params: Parameters<typeof FServiceAPI.InformalNode.testNodeRules>[0] = {
        nodeId: informalNodeManagerPage.nodeID,
      };

      const {data} = yield call(FServiceAPI.InformalNode.testNodeRules, params);

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

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informalNodeManagerPage.nodeID,
        testRuleText: informalNodeManagerPage.codeInput,
      };
      const {data} = yield call(FServiceAPI.InformalNode.createRules, params);

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
        const params: Parameters<typeof FServiceAPI.InformalNode.putRules>[0] = {
          nodeId: informalNodeManagerPage.nodeID,
          additionalTestRule: text,
        };
        const {data} = yield call(FServiceAPI.InformalNode.putRules, params);
      }

      if (payload.type === 'replace') {
        const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
          nodeId: informalNodeManagerPage.nodeID,
          testRuleText: text,
        };
        const {data} = yield call(FServiceAPI.InformalNode.createRules, params);
      }

      // if (informalNodeManagerPage.showPage === 'exhibit') {
      //   yield put<FetchExhibitListAction>({
      //     type: 'fetchExhibitList',
      //     payload: {
      //       isRematch: false,
      //     },
      //   });
      // }
      // if (informalNodeManagerPage.showPage === 'theme') {
      //   yield put<FetchThemeListAction>({
      //     type: 'fetchThemeList',
      //     payload: {
      //       isRematch: false,
      //     },
      //   });
      // }
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
  // const params: RulesRematchParamsType = {
  //   nodeId: nodeID,
  // };

  if (isRematch) {
    await FServiceAPI.InformalNode.rulesRematch({nodeId: nodeID});
  }

  while (true) {
    const response = await FServiceAPI.InformalNode.testNodeRules({nodeId: nodeID});
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
