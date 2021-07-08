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
      versionRange?: string;
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

export interface InformalNodeManagerPageModelState {
  nodeID: number;
  nodeName: string;
  nodeUrl: string;
  testNodeUrl: string;
  ruleText: string;
  allRuleResult: any;
  ruleAllAddResourceNames: string[];
  ruleAllAddObjectNames: string[];
  showPage: 'exhibit' | 'theme' | 'mappingRule';

  addExhibitDrawerVisible: boolean;
  addExhibitDrawerResourceOptions: { value: string; title: string }[];
  addExhibitDrawerBucketOptions: { value: string; title: string }[];
  addExhibitDrawerSelectValue: string;
  addExhibitDrawerInputValue: string;
  addExhibitDrawerCheckedList: {
    id: string;
    disabled: boolean;
    disabledReason: string;
    checked: boolean;
    name: string;
    identity: 'resource' | 'object';
    type: string;
    updateTime: string;
    status: 'online' | 'offline' | 'unreleased' | '';
  }[];
  addExhibitDrawerCheckedListTotalNum: number;

  // addOrReplaceCodeExecutionErrorMessages: null | {
  //   msg: string;
  // }[];

  replaceModalVisible: boolean;
  // replaceModalReplacerOptions: Array<'!market' | '!resource' | '!collection'>;
  // replaceModalReplacerOptionSelected: '!market',
  // replaceModalReplacerInput: string;
  // replaceModalReplacerList: {
  //   id: string;
  //   checked: boolean;
  //   name: string;
  //   status: 'online' | 'offline' | 'unreleased';
  //   type: string;
  //   latestVersion: string;
  //   version: string;
  //   date: string;
  // }[];

  selectedType: '-1' | string;
  selectedStatus: '0' | '1' | '2';
  filterKeywords: string;
  exhibitsTotal: number;
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

  // addThemeDrawerVisible: boolean;
  themeFilterKeywords: string;
  themesTotal: number;
  themeList: {
    id: string;
    name: string;
    identity: 'resource' | 'object' | 'exhibit';
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

  ruleListStatus: 'normal' | 'export' | 'delete' | 'coding';
  ruleList: {
    id: string;
    checked: boolean;
    matchErrors: string[];
    ruleInfo: any;
    efficientInfos: any[];
  }[];

  codeInput: string;
  codeIsDirty: boolean;
  promptLeavePath: string;
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
  codeSaveSuccess: boolean;

}

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

export interface OnAddExhibitDrawerAfterVisibleChangeAction extends AnyAction {
  type: 'informalNodeManagerPage/onAddExhibitDrawerAfterVisibleChange';
  payload: {
    visible: boolean;
  };
}

export interface FetchAddExhibitDrawerListAction extends AnyAction {
  type: 'informalNodeManagerPage/fetchAddExhibitDrawerList' | 'fetchAddExhibitDrawerList';
  payload?: boolean; // 是否 restart
}

export interface FetchAddExhibitDrawerMarketAction extends AnyAction {
  type: 'fetchAddExhibitDrawerMarket';
  payload?: boolean; // 是否 restart
}

export interface FetchAddExhibitDrawerMyResourcesAction extends AnyAction {
  type: 'fetchAddExhibitDrawerMyResources';
  payload?: boolean; // 是否 restart
}

export interface FetchAddExhibitDrawerCollectionAction extends AnyAction {
  type: 'fetchAddExhibitDrawerCollection';
  payload?: boolean; // 是否 restart
}

export interface FetchAddExhibitDrawerObjectAction extends AnyAction {
  type: 'fetchAddExhibitDrawerObject';
  payload?: boolean; // 是否 restart
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

    onAddExhibitDrawerAfterVisibleChange: (action: OnAddExhibitDrawerAfterVisibleChangeAction, effects: EffectsCommandMap) => void;
    fetchAddExhibitDrawerList: (action: FetchAddExhibitDrawerListAction, effects: EffectsCommandMap) => void;
    fetchAddExhibitDrawerMarket: (action: FetchAddExhibitDrawerMarketAction, effects: EffectsCommandMap) => void;
    fetchAddExhibitDrawerMyResources: (action: FetchAddExhibitDrawerMyResourcesAction, effects: EffectsCommandMap) => void;
    fetchAddExhibitDrawerCollection: (action: FetchAddExhibitDrawerCollectionAction, effects: EffectsCommandMap) => void;
    fetchAddExhibitDrawerObject: (action: FetchAddExhibitDrawerObjectAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<InformalNodeManagerPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

export const exhibitPageInitData = {


  replaceModalVisible: false,
  replaceModalReplacerOptions: ['!market', '!resource', '!collection'],
  replaceModalReplacerOptionSelected: '!market',
  replacerList: [],
  replacerInput: '',
  selectedType: '-1',
  selectedStatus: '2',
  filterKeywords: '',
  exhibitList: [],
  exhibitsTotal: -1,
};

export const themePageInitData = {
  themeFilterKeywords: '',
  themeList: [],
  themesTotal: -1,
  // addThemeDrawerVisible: false,
};

const informalNodeManagerPageInitStates: InformalNodeManagerPageModelState = {

  nodeID: -1,
  nodeName: '',
  nodeUrl: '',
  testNodeUrl: '',
  ruleText: '',
  allRuleResult: null,
  ruleAllAddResourceNames: [],
  ruleAllAddObjectNames: [],
  showPage: 'exhibit',

  addExhibitDrawerVisible: false,
  addExhibitDrawerResourceOptions: [
    {value: '!market', title: '资源市场'},
    {value: '!resource', title: '我的资源'},
    {value: '!collection', title: '我的收藏'},
  ],
  addExhibitDrawerBucketOptions: [],
  addExhibitDrawerSelectValue: '!market',
  addExhibitDrawerInputValue: '',
  addExhibitDrawerCheckedList: [],
  addExhibitDrawerCheckedListTotalNum: -1,

  replaceModalVisible: false,
  // replaceModalReplacerOptions: ['!market', '!resource', '!collection'],
  // replaceModalReplacerOptionSelected: '!market',
  // replacerList: [],
  // replacerInput: '',
  selectedType: '-1',
  selectedStatus: '2',
  filterKeywords: '',
  exhibitList: [],
  exhibitsTotal: -1,

  // addOrReplaceCodeExecutionErrorMessages: null,

  // ...exhibitPageInitData,
  // filterKeywords: '',
  // exhibitList: [],
  // exhibitsTotal: -1,

  // ...themePageInitData,
  themeFilterKeywords: '',
  themeList: [],
  themesTotal: -1,

  ruleListStatus: 'normal',
  ruleList: [],

  codeInput: '',
  codeIsDirty: false,
  promptLeavePath: '',
  codeIsChecking: false,
  codeCompileErrors: null,
  codeExecutionError: null,
  codeSaveSuccess: false,

};

const Model: InformalNodeManagerPageModelType = {
  namespace: 'informalNodeManagerPage',
  state: informalNodeManagerPageInitStates,
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

      // if (user.cookiesUserID !== data.ownerUserId) {
      if (FUtil.Tool.getUserIDByCookies() !== data.ownerUserId) {
        router.replace(FUtil.LinkTo.exception403({}));
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
        payload: informalNodeManagerPageInitStates,
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
      // console.log(data1, 'DDD@@@@890j23poijrl;adsf@');

      const {rules: rulesObj} = compile(data1.ruleText);

      const exhibitList: InformalNodeManagerPageModelState['exhibitList'] = (data.dataList as any[]).map<InformalNodeManagerPageModelState['exhibitList'][number]>((dl) => {
        const operations: string[] = dl.rules[0]?.operations || [];
        // console.log(operations, 'operations12334');
        const stateInfo = dl.stateInfo;

        const rulesObjRule = rulesObj.find((ro: any) => {
          // console.log(ro, dl, '#############***********;ojsifw389');
          return ro.exhibitName === dl.testResourceName;
        });

        // console.log(rulesObjRule, 'rulesObjRulerulesObjRule!!!@@@@@@');

        // console.log(dl, 'dl!@#$@#$@#$!@#$@#$12341234');

        const rule: InformalNodeManagerPageModelState['exhibitList'][number]['rule'] = {
          add: operations.includes('add') ? {
            exhibit: dl.testResourceName,
            source: {
              type: dl.originInfo.type,
              name: dl.originInfo.name,
              version: dl.originInfo.type === 'resource' ? dl.originInfo.version : undefined,
              versionRange: (dl.originInfo.versionRange && dl.originInfo.versionRange !== 'latest') ? dl.originInfo.versionRange : undefined,
            },
          } : undefined,
          alter: operations.includes('alter') ? dl.testResourceName : undefined,
          // version: dl.originInfo.type === 'resource' ? dl.originInfo.version : undefined,
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
          replaces: rulesObjRule?.replaces && (rulesObjRule?.replaces as any[]).map<NonNullable<IMappingRule['replaces']>[0]>((rr: any) => {
            // console.log(rr, 'rr!!@#$#$@#$@#$444444');
            return {
              replaced: {
                ...rr.replaced,
                versionRange: (rr.replaced.versionRange && rr.replaced.versionRange !== '*') ? rr.replaced.versionRange : undefined,
              },
              replacer: {
                ...rr.replacer,
                versionRange: (rr.replacer.versionRange && rr.replacer.versionRange !== 'latest') ? rr.replacer.versionRange : undefined,
              },
              scopes: rr.scopes && (rr.scopes as any[])
                .map<NonNullable<IMappingRule['replaces']>[0]['scopes'][0]>((ss: any) => {
                  // console.log(ss, 'ss!!!!@@@@##');
                  return ss.map((sss: any) => {
                    return {
                      ...sss,
                      versionRange: (sss.versionRange && sss.versionRange !== 'latest') ? sss.versionRange : undefined,
                    };
                  });
                }),
            };
          }),
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
      });

      const allAddRule = data1.testRules.filter((tr: any) => {
        return tr.ruleInfo.operation === 'add';
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ruleText: data1.ruleText,
          allRuleResult: data1.testRules,
          ruleAllAddObjectNames: allAddRule.filter((tr: any) => {
            return tr.ruleInfo.candidate.type === 'object';
          }).map((tr: any) => {
            return tr.ruleInfo.candidate.name;
          }),
          ruleAllAddResourceNames: allAddRule.filter((tr: any) => {
            return tr.ruleInfo.candidate.type === 'resource';
          }).map((tr: any) => {
            return tr.ruleInfo.candidate.name;
          }),
          exhibitsTotal: data.totalItem,
          exhibitList: exhibitList,
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

      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {
      //     themesTotal: -1,
      //   },
      // });

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
        keywords: informalNodeManagerPage.themeFilterKeywords || undefined,
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
                  versionRange: (dl.originInfo.versionRange && dl.originInfo.versionRange !== 'latest') ? dl.originInfo.versionRange : undefined,
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
              // active: activatedTheme === dl.testResourceName ? dl.testResourceName : undefined,
              active: dl.stateInfo.themeInfo.ruleId !== 'default' ? dl.testResourceName : undefined,
              replaces: rulesObjRule?.replaces && (rulesObjRule?.replaces as any[]).map<NonNullable<IMappingRule['replaces']>[0]>((rr: any) => {
                // console.log(rr, 'rr!!@#$#$@#$@#$444444');
                return {
                  replaced: {
                    ...rr.replaced,
                    versionRange: (rr.replaced.versionRange && rr.replaced.versionRange !== '*') ? rr.replaced.versionRange : undefined,
                  },
                  replacer: {
                    ...rr.replacer,
                    versionRange: (rr.replacer.versionRange && rr.replacer.versionRange !== 'latest') ? rr.replacer.versionRange : undefined,
                  },
                  scopes: rr.scopes && (rr.scopes as any[])
                    .map<NonNullable<IMappingRule['replaces']>[0]['scopes'][0]>((ss: any) => {
                      // console.log(ss, 'ss!!!!@@@@##');
                      return ss.map((sss: any) => {
                        return {
                          ...sss,
                          versionRange: (sss.versionRange && sss.versionRange !== 'latest') ? sss.versionRange : undefined,
                        };
                      });
                    }),
                };
              }),
            };
            return {
              id: dl.testResourceId,
              cover: dl.stateInfo.coverInfo.coverImages[0] || '',
              name: dl.testResourceName,
              identity: !!dl.associatedPresentableId ? 'exhibit' : dl.originInfo.type,
              rule: rule,
              version: dl.originInfo.version,
              isOnline: activatedTheme ? activatedTheme === dl.testResourceName : stateInfo.onlineStatusInfo.onlineStatus === 1,
              isAuth: true,
              authErrorText: '',
              originInfo: dl.originInfo,
            };
          }).sort((a, b) => {
            if (a.isOnline && !b.isOnline) {
              return -1;
            }
            return 0;
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
      // console.log(data, 'data!!!!!@#$@#$@#$');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          codeInput: data.ruleText,
          codeIsDirty: false,
          ruleList: data.testRules.map((tr: any) => {
            return {
              ...tr,
              checked: false,
            };
          }),
          codeExecutionError: null,
          codeCompileErrors: null,
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
          // codeCompileErrors: null,
          // codeExecutionError: null,
          // codeSaveSuccess: null,
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

      // console.log(data1, 'data1!@#$!@#$@#');

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
          codeIsDirty: false,
          ruleText: data1.ruleText,
          codeIsChecking: false,
          codeExecutionError: codeExecutionError.length > 0 ? codeExecutionError : null,
          codeSaveSuccess: codeExecutionError.length === 0,
          ruleList: data1.testRules.map((tr: any) => {
            return {
              ...tr,
              checked: false,
            };
          }),
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

      // let testRules: any[] = [];

      if (payload.type === 'append') {
        const params: Parameters<typeof FServiceAPI.InformalNode.putRules>[0] = {
          nodeId: informalNodeManagerPage.nodeID,
          additionalTestRule: text,
        };
        const {data} = yield call(FServiceAPI.InformalNode.putRules, params);
        // console.log(data, 'DDAFDSF#@%$R@Wefsdafasdf112222333444');
        // testRules = data?.testRules || [];
      } else if (payload.type === 'replace') {
        const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
          nodeId: informalNodeManagerPage.nodeID,
          testRuleText: text,
        };
        const {data} = yield call(FServiceAPI.InformalNode.createRules, params);
        // console.log(data, 'data123423412341234');
        // testRules = data?.testRules || [];
      }


      const params2: RuleMatchStatusParams = {
        nodeID: informalNodeManagerPage.nodeID,
        isRematch: true,
      };

      const {data: data1} = yield call(ruleMatchStatus, params2);
      // console.log(dat/**/a, 'data!@#$@#$@#$!@#$@#$');

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

      // if (codeExecutionError.length > 0) {
      //   yield put<ChangeAction>({
      //     type: 'change',
      //     payload: {
      //       addOrReplaceCodeExecutionErrorMessages: codeExecutionError,
      //     },
      //   });
      // }

      if (informalNodeManagerPage.showPage === 'exhibit') {
        yield put<FetchExhibitListAction>({
          type: 'fetchExhibitList',
          payload: {
            isRematch: false,
          },
        });
      } else if (informalNodeManagerPage.showPage === 'theme') {
        yield put<FetchThemeListAction>({
          type: 'fetchThemeList',
          payload: {
            isRematch: false,
          },
        });
      }
    },

    * onAddExhibitDrawerAfterVisibleChange({payload}: OnAddExhibitDrawerAfterVisibleChangeAction, {put, call}: EffectsCommandMap) {
      if (payload.visible) {
        yield put<FetchAddExhibitDrawerListAction>({
          type: 'fetchAddExhibitDrawerList',
          payload: true,
        });

        const params: Parameters<typeof FServiceAPI.Storage.bucketList>[0] = {
          bucketType: 1,
        };

        const {data} = yield call(FServiceAPI.Storage.bucketList, params);
        // console.log(data, '!@#$!@#$#$!@111111111');
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            addExhibitDrawerBucketOptions: (data as any[]).map<InformalNodeManagerPageModelState['addExhibitDrawerBucketOptions'][number]>((d: any) => {
              return {
                value: d.bucketName,
                title: d.bucketName,
              };
            }),
          }
        })
      } else {
        yield put({
          type: 'change',
          payload: {
            addExhibitDrawerSelectValue: '!market',
            addExhibitDrawerInputValue: '',
            addExhibitDrawerCheckedList: [],
            addExhibitDrawerCheckedListTotalNum: -1,
          }
        });
      }
    },
    * fetchAddExhibitDrawerList({payload}: FetchAddExhibitDrawerListAction, {select, call, put}: EffectsCommandMap) {
      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      if (informalNodeManagerPage.addExhibitDrawerSelectValue === '!market') {
        yield put<FetchAddExhibitDrawerMarketAction>({
          type: 'fetchAddExhibitDrawerMarket',
          payload,
        });
      } else if (informalNodeManagerPage.addExhibitDrawerSelectValue === '!resource') {
        yield put<FetchAddExhibitDrawerMyResourcesAction>({
          type: 'fetchAddExhibitDrawerMyResources',
          payload,
        });
      } else if (informalNodeManagerPage.addExhibitDrawerSelectValue === '!collection') {
        yield put<FetchAddExhibitDrawerCollectionAction>({
          type: 'fetchAddExhibitDrawerCollection',
          payload,
        });
      } else {
        yield put<FetchAddExhibitDrawerObjectAction>({
          type: 'fetchAddExhibitDrawerObject',
          payload,
        });
      }
    },
    * fetchAddExhibitDrawerMarket({payload}: FetchAddExhibitDrawerMarketAction, {call, select, put}: EffectsCommandMap) {
      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      let inherentList: InformalNodeManagerPageModelState['addExhibitDrawerCheckedList'] = [];
      // informalNodeManagerPageInitStates
      // console.log(payload, 'payload12341234142134');
      if (!payload) {
        // console.log('!@#$#@$@#$@@@@@@@@@@@@@@@@@@@@@@@@');
        inherentList = informalNodeManagerPage.addExhibitDrawerCheckedList;
      }
      // console.log(inherentList, 'inherentList!@#$!@#$1234234134');

      const inherentIDs = inherentList.map((il) => il.id);

      const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
        skip: inherentList.length,
        limit: FUtil.Predefined.pageSize + 10,
        omitResourceType: informalNodeManagerPage.showPage === 'theme' ? undefined : 'theme',
        resourceType: informalNodeManagerPage.showPage === 'theme' ? 'theme' : undefined,
        keywords: informalNodeManagerPage.addExhibitDrawerInputValue,
      };
      // console.log(params, 'paramsparams1234');
      const {data} = yield call(FServiceAPI.Resource.list, params);
      // console.log(data, 'data!~!@#$@!#$@#!411111');

      const params1: Parameters<typeof getUsedTargetIDs>[0] = {
        nodeID: informalNodeManagerPage.nodeID,
        entityType: 'resource',
        entityIds: data.dataList.map((dl: any) => {
          return dl.resourceId;
        }),
      };

      const usedResourceIDs: string[] = yield call(getUsedTargetIDs, params1);

      // console.log(usedResourceID, 'usedResourceID!!!!@@@222222222');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitDrawerCheckedList: [
            ...inherentList,
            ...(data.dataList as any[])
              .filter((rs) => {
                return !inherentIDs.includes(rs.resourceId);
              })
              .map<InformalNodeManagerPageModelState['addExhibitDrawerCheckedList'][number]>((rs) => {
                // console.log(rs, 'rs!!!!@#$23423423423');

                let disabled: boolean = false;
                let disabledReason: string = '';

                if (usedResourceIDs.includes(rs.resourceId) || informalNodeManagerPage.ruleAllAddResourceNames.includes(rs.resourceName)) {
                  disabled = true;
                  disabledReason = '已被使用';
                } else if (rs.latestVersion === '') {
                  disabled = true;
                  disabledReason = '无可用版本';
                }

                return {
                  id: rs.resourceId,
                  disabled,
                  disabledReason,
                  checked: false,
                  identity: 'resource',
                  name: rs.resourceName,
                  type: rs.resourceType,
                  updateTime: FUtil.Format.formatDateTime(rs.updateDate),
                  status: rs.status === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
                };
              }),
          ],
          addExhibitDrawerCheckedListTotalNum: data.totalItem,
        },
      });
    },
    * fetchAddExhibitDrawerMyResources({payload}: FetchAddExhibitDrawerMyResourcesAction, {call, put, select}: EffectsCommandMap) {
      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      let inherentList: InformalNodeManagerPageModelState['addExhibitDrawerCheckedList'] = [];

      if (!payload) {
        inherentList = informalNodeManagerPage.addExhibitDrawerCheckedList;
      }

      const inherentIDs = inherentList.map((il) => il.id);
      // console.log(inherentIDs, 'inherentIDs12342134');

      const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
        skip: inherentList.length,
        limit: FUtil.Predefined.pageSize + 10,
        isSelf: 1,
        omitResourceType: informalNodeManagerPage.showPage === 'theme' ? undefined : 'theme',
        resourceType: informalNodeManagerPage.showPage === 'theme' ? 'theme' : undefined,
        keywords: informalNodeManagerPage.addExhibitDrawerInputValue,
      };
      // console.log(params, 'paramsparams1234');
      const {data} = yield call(FServiceAPI.Resource.list, params);
      // console.log(data, 'data13453');

      const params1: Parameters<typeof getUsedTargetIDs>[0] = {
        nodeID: informalNodeManagerPage.nodeID,
        entityType: 'resource',
        entityIds: data.dataList.map((dl: any) => {
          return dl.resourceId;
        }),
      };

      const usedResourceIDs: string[] = yield call(getUsedTargetIDs, params1);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitDrawerCheckedList: [
            ...inherentList,
            ...(data.dataList as any[])
              .filter((rs) => {
                return !inherentIDs.includes(rs.resourceId);
              })
              .map<InformalNodeManagerPageModelState['addExhibitDrawerCheckedList'][number]>((rs) => {
                let disabled: boolean = false;
                let disabledReason: string = '';

                if (usedResourceIDs.includes(rs.resourceId) || informalNodeManagerPage.ruleAllAddResourceNames.includes(rs.resourceName)) {
                  disabled = true;
                  disabledReason = '已被使用';
                } else if (rs.latestVersion === '') {
                  disabled = true;
                  disabledReason = '无可用版本';
                }
                return {
                  id: rs.resourceId,
                  disabled,
                  disabledReason,
                  checked: false,
                  identity: 'resource',
                  name: rs.resourceName,
                  type: rs.resourceType,
                  updateTime: FUtil.Format.formatDateTime(rs.updateDate),
                  status: rs.status === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
                };
              }),
          ],
          addExhibitDrawerCheckedListTotalNum: data.totalItem,
        },
      });
    },
    * fetchAddExhibitDrawerCollection({payload}: FetchAddExhibitDrawerCollectionAction, {select, call, put}: EffectsCommandMap) {

      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      let inherentList: InformalNodeManagerPageModelState['addExhibitDrawerCheckedList'] = [];

      if (!payload) {
        inherentList = informalNodeManagerPage.addExhibitDrawerCheckedList;
      }

      const inherentIDs = inherentList.map((il) => il.id);

      const params: Parameters<typeof FServiceAPI.Collection.collectionResources>[0] = {
        skip: inherentList.length,
        limit: FUtil.Predefined.pageSize + 10,
        keywords: informalNodeManagerPage.addExhibitDrawerInputValue,
        omitResourceType: informalNodeManagerPage.showPage === 'theme' ? undefined : 'theme',
        resourceType: informalNodeManagerPage.showPage === 'theme' ? 'theme' : undefined,
      };

      const {data} = yield call(FServiceAPI.Collection.collectionResources, params);
      // console.log(data, '@@@@@@ASEDFSADF');

      const params1: Parameters<typeof getUsedTargetIDs>[0] = {
        nodeID: informalNodeManagerPage.nodeID,
        entityType: 'resource',
        entityIds: data.dataList.map((dl: any) => {
          return dl.resourceId;
        }),
      };

      const usedResourceIDs: string[] = yield call(getUsedTargetIDs, params1);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitDrawerCheckedList: [
            ...inherentList,
            ...(data.dataList as any[])
              .filter((rs) => {
                return !inherentIDs.includes(rs.resourceId);
              })
              .map<InformalNodeManagerPageModelState['addExhibitDrawerCheckedList'][number]>((rs) => {

                let disabled: boolean = false;
                let disabledReason: string = '';

                if (usedResourceIDs.includes(rs.resourceId) || informalNodeManagerPage.ruleAllAddResourceNames.includes(rs.resourceName)) {
                  disabled = true;
                  disabledReason = '已被使用';
                } else if (rs.latestVersion === '') {
                  disabled = true;
                  disabledReason = '无可用版本';
                }

                return {
                  id: rs.resourceId,
                  disabled,
                  disabledReason,
                  checked: false,
                  identity: 'resource',
                  name: rs.resourceName,
                  type: rs.resourceType,
                  updateTime: FUtil.Format.formatDateTime(rs.updateDate),
                  status: rs.resourceStatus === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
                };
              }),
          ],
          addExhibitDrawerCheckedListTotalNum: data.totalItem,
        },
      });
    },
    * fetchAddExhibitDrawerObject({payload}: FetchAddExhibitDrawerObjectAction, {put, select, call}: EffectsCommandMap) {
      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      let inherentList: InformalNodeManagerPageModelState['addExhibitDrawerCheckedList'] = [];

      if (!payload) {
        inherentList = informalNodeManagerPage.addExhibitDrawerCheckedList;
      }

      const inherentIDs = inherentList.map((il) => il.id);

      const params: Parameters<typeof FServiceAPI.Storage.objectList>[0] = {
        skip: inherentList.length,
        limit: FUtil.Predefined.pageSize + 10,
        bucketName: informalNodeManagerPage.addExhibitDrawerSelectValue,
        keywords: informalNodeManagerPage.addExhibitDrawerInputValue,
        isLoadingTypeless: 0,
        omitResourceType: informalNodeManagerPage.showPage === 'theme' ? undefined : 'theme',
        resourceType: informalNodeManagerPage.showPage === 'theme' ? 'theme' : undefined,
      };

      const {data} = yield call(FServiceAPI.Storage.objectList, params);
      console.log(data, 'data1q2349ojmdfsl');

      const params1: Parameters<typeof getUsedTargetIDs>[0] = {
        nodeID: informalNodeManagerPage.nodeID,
        entityType: 'object',
        entityIds: data.dataList.map((dl: any) => {
          return dl.objectId;
        }),
      };

      const usedResourceIDs: string[] = yield call(getUsedTargetIDs, params1);
      // console.log(usedResourceIDs, 'usedResourceIDs123412341234');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitDrawerCheckedList: [
            ...inherentList,
            ...(data.dataList as any[])
              .filter((ob) => {
                return !inherentIDs.includes(ob.objectId);
              })
              .map<InformalNodeManagerPageModelState['addExhibitDrawerCheckedList'][number]>((ob) => {
                // console.log(ob, 'ob!!@#$@#$@#$!@#$21342134');
                const objectName: string = ob.bucketName + '/' + ob.objectName;
                // console.log(objectName, addInformExhibitDrawer.disabledObjectNames, '##7908-2-34jokdsafhkl#-=##');
                let disabled: boolean = false;
                let disabledReason: string = '';

                if (usedResourceIDs.includes(ob.objectId) || informalNodeManagerPage.ruleAllAddObjectNames.includes(objectName)) {
                  disabled = true;
                  disabledReason = '已被使用';
                } else if (ob.resourceType === '') {
                  disabled = true;
                  disabledReason = '无资源类型';
                }

                return {
                  id: ob.objectId,
                  disabled,
                  disabledReason,
                  checked: false,
                  identity: 'object',
                  name: objectName,
                  type: ob.resourceType,
                  updateTime: FUtil.Format.formatDateTime(ob.updateDate),
                  status: '',
                };
              }),
          ],
          addExhibitDrawerCheckedListTotalNum: data.totalItem,
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

interface GetUsedTargetIDsParams {
  nodeID: number;
  entityType: 'resource' | 'object';
  entityIds: string[];
}

async function getUsedTargetIDs({nodeID, entityType, entityIds}: GetUsedTargetIDsParams): Promise<string[]> {
  if (entityIds.length === 0) {
    return [];
  }

  const params1: Parameters<typeof FServiceAPI.InformalNode.batchTestResources>[0] = {
    nodeId: nodeID,
    entityType: entityType,
    entityIds: entityIds.join(),
  };

  const {data} = await FServiceAPI.InformalNode.batchTestResources(params1);

  // console.log(data, 'data98jhksjkdaf13453');
  return (data as any[]).map<string>((d1: any) => {
    return d1.originInfo.id;
  });
}
