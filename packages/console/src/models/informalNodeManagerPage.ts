import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from '@/models/connect';
import {FUtil, FServiceAPI} from '@freelog/tools-lib';
import {router} from "umi";
import * as React from "react";

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

export interface TreeNode {
  title: string;
  key: string;
  id: string;
  isLeaf?: boolean;
  children?: TreeNode[];
}

interface ICandidate {
  name: string;
  versionRange?: string;
  type: 'resource' | 'object';
}

type IConfirmValue = {
  exhibitName: string;
  replaced: ICandidate;
  replacer: ICandidate;
  scopes: ICandidate[][];
}[];

export interface InformalNodeManagerPageModelState {
  nodeID: number;
  nodeName: string;
  nodeUrl: string;
  testNodeUrl: string;
  ruleText: string;
  allRuleResult: any;
  ruleAllAddedResourceNames: string[];
  ruleAllAddedObjectNames: string[];
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

  replaceModalVisible: boolean;
  replacerResourceOptions: { value: string; title: string }[];
  replacerBucketOptions: { value: string; title: string }[];
  replacerOrigin: '!market' | '!resource' | '!collection' | string;
  replacerKeywords: string;
  replacerResourceList: {
    checked: boolean;
    id: string;
    name: string;
    identity: 'resource' | 'object';
    latestVersion: string;
    type: string;
    updateTime: string;
    status: 'online' | 'offline' | 'unreleased' | '';
    versions: string[];
    versionRange: string;
  }[];
  replacedKeywords: string;
  replacedDependencyTreeList: string[];
  replacedSelectDependency: null | {
    id: string;
    name: string;
    type: 'resource' | 'object';
    versions: string[],
  };
  replacedTargetVersions: {
    value: string;
    text: string;
  }[],
  replacedTargetSelectedVersion: {
    value: string;
    text: string;
  } | null;
  replacedTreeData: TreeNode[];
  replacedCheckedKeys: string[];

  exhibitPageTypeOptions: { value: string; text: string; }[];
  exhibitPageSelectedType: '-1' | string;
  exhibitPageStatusOptions: { value: string; text: string; }[];
  exhibitPageSelectedStatus: '0' | '1' | '2';
  exhibitPageFilterKeywords: string;
  exhibitPageExhibitsTotal: number;
  exhibitPageExhibitList: {
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

  themePageFilterKeywords: string;
  themePageThemesTotal: number;
  themePageThemeList: {
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

  rulePageStatus: 'normal' | 'export' | 'delete' | 'coding';
  rulePageRuleList: {
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
  type: 'informalNodeManagerPage/saveDataRules' | 'saveDataRules';
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

export interface OnReplacerMountAction extends AnyAction {
  type: 'informalNodeManagerPage/onReplacerMount';
}

export interface OnReplacerUnmountAction extends AnyAction {
  type: 'informalNodeManagerPage/onReplacerUnmount';
}

export interface OnReplacerOriginChangeAction extends AnyAction {
  type: 'informalNodeManagerPage/onReplacerOriginChange';
  payload: {
    value: string;
  };
}

export interface OnReplacerKeywordsChangeAction extends AnyAction {
  type: 'informalNodeManagerPage/onReplacerKeywordsChange'
  payload: {
    value: string;
  };
}

export interface FetchReplacerListAction extends AnyAction {
  type: 'fetchReplacerList' | 'informalNodeManagerPage/fetchReplacerList';
  payload: {
    restart: boolean;
    origin?: string;
    keywords?: string;
  };
}

export interface OnReplacerListCheckedChangeAction extends AnyAction {
  type: 'informalNodeManagerPage/onReplacerListCheckedChange';
  payload: {
    id: string;
    // checked: boolean;
  };
}

export interface OnReplacerListVersionRangeChangeAction extends AnyAction {
  type: 'informalNodeManagerPage/onReplacerListVersionRangeChange';
  payload: {
    id: string;
    versionRange: string;
  };
}

export interface OnReplacerListLoadMoreAction extends AnyAction {
  type: 'onReplacerListLoadMore';
}

export interface OnReplacedMountAction extends AnyAction {
  type: 'informalNodeManagerPage/onReplacedMount';
}

export interface OnReplacedUnmountAction extends AnyAction {
  type: 'informalNodeManagerPage/onReplacedUnmount';
}

export interface OnReplacedKeywordChangeAction extends AnyAction {
  type: 'informalNodeManagerPage/onReplacedKeywordChange';
  payload: {
    value: string;
  };
}

export interface OnReplacedEntityVersionChangeAction extends AnyAction {
  type: 'informalNodeManagerPage/onReplacedEntityVersionChange';
  payload: {
    value: string;
  };
}

export interface OnReplacedTreeLoadDataAction extends AnyAction {
  type: 'informalNodeManagerPage/onReplacedTreeLoadData';
  payload: {
    pos: string;
    id: string;
    key: string;
  };
}

export interface OnReplaceModalCancelAction extends AnyAction {
  type: 'informalNodeManagerPage/onReplaceModalCancel';
}

export interface OnReplaceModalConfirmAction extends AnyAction {
  type: 'informalNodeManagerPage/onReplaceModalConfirm';
}

interface InformalNodeManagerPageModelType {
  namespace: 'informalNodeManagerPage';
  state: InformalNodeManagerPageModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    // initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
    fetchExhibitList: (action: FetchExhibitListAction, effects: EffectsCommandMap) => void;
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

    onReplacerMount: (action: OnReplacerMountAction, effects: EffectsCommandMap) => void;
    onReplacerUnmount: (action: OnReplacerUnmountAction, effects: EffectsCommandMap) => void;
    onReplacerOriginChange: (action: OnReplacerOriginChangeAction, effects: EffectsCommandMap) => void;
    onReplacerKeywordsChange: (action: OnReplacerKeywordsChangeAction, effects: EffectsCommandMap) => void;
    fetchReplacerList: (action: FetchReplacerListAction, effects: EffectsCommandMap) => void;
    onReplacerListCheckedChange: (action: OnReplacerListCheckedChangeAction, effects: EffectsCommandMap) => void;
    onReplacerListVersionRangeChange: (action: OnReplacerListVersionRangeChangeAction, effects: EffectsCommandMap) => void;
    onReplacerListLoadMore: (action: OnReplacerListLoadMoreAction, effects: EffectsCommandMap) => void;
    onReplacedMount: (action: OnReplacedMountAction, effects: EffectsCommandMap) => void;
    onReplacedUnmount: (action: OnReplacedUnmountAction, effects: EffectsCommandMap) => void;
    onReplacedKeywordChange: (action: OnReplacedKeywordChangeAction, effects: EffectsCommandMap) => void;
    onReplacedEntityVersionChange: (action: OnReplacedEntityVersionChangeAction, effects: EffectsCommandMap) => void;
    onReplacedTreeLoadData: (action: OnReplacedTreeLoadDataAction, effects: EffectsCommandMap) => void;
    onReplaceModalCancel: (action: OnReplaceModalCancelAction, effects: EffectsCommandMap) => void;
    onReplaceModalConfirm: (action: OnReplaceModalConfirmAction, effects: EffectsCommandMap) => void;

  };
  reducers: {
    change: DvaReducer<InformalNodeManagerPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const informalNodeManagerPageInitStates: InformalNodeManagerPageModelState = {

  nodeID: -1,
  nodeName: '',
  nodeUrl: '',
  testNodeUrl: '',
  ruleText: '',
  allRuleResult: null,
  ruleAllAddedResourceNames: [],
  ruleAllAddedObjectNames: [],
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
  replacerResourceOptions: [
    {value: '!market', title: '资源市场'},
    {value: '!resource', title: '我的资源'},
    {value: '!collection', title: '我的收藏'},
  ],
  replacerBucketOptions: [],
  replacerOrigin: '!market',
  replacerKeywords: '',
  replacerResourceList: [],
  replacedKeywords: '',
  replacedDependencyTreeList: [],
  replacedSelectDependency: null,
  replacedTargetVersions: [],
  replacedTargetSelectedVersion: null,
  replacedTreeData: [],
  replacedCheckedKeys: [],

  exhibitPageTypeOptions: [
    {text: '全部', value: '-1'},
    ...FUtil.Predefined.resourceTypes
      .filter((i) => i !== 'theme')
      .map((i) => ({value: i, text: i}))
  ],
  exhibitPageSelectedType: '-1',
  exhibitPageStatusOptions: [
    {text: '全部', value: '2'},
    {text: '已上线', value: '1'},
    {text: '已下线', value: '0'},
  ],
  exhibitPageSelectedStatus: '2',
  exhibitPageFilterKeywords: '',
  exhibitPageExhibitList: [],
  exhibitPageExhibitsTotal: -1,

  // addOrReplaceCodeExecutionErrorMessages: null,

  // ...exhibitPageInitData,
  // filterKeywords: '',
  // exhibitList: [],
  // exhibitsTotal: -1,

  // ...themePageInitData,
  themePageFilterKeywords: '',
  themePageThemeList: [],
  themePageThemesTotal: -1,

  rulePageStatus: 'normal',
  rulePageRuleList: [],

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
      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
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
    // * initModelStates({}: InitModelStatesAction, {put,}: EffectsCommandMap) {
    //   // yield put<ChangeAction>({
    //   //   type: 'change',
    //   //   payload: informalNodeManagerPageInitStates,
    //   // });
    // },
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
        onlineStatus: Number(informalNodeManagerPage.exhibitPageSelectedStatus) as 2,
        omitResourceType: 'theme',
        resourceType: informalNodeManagerPage.exhibitPageSelectedType === '-1' ? undefined : informalNodeManagerPage.exhibitPageSelectedType,
        limit: FUtil.Predefined.pageSize,
        keywords: informalNodeManagerPage.exhibitPageFilterKeywords || undefined,
      };

      const {data} = yield call(FServiceAPI.InformalNode.testResources, params);
      // console.log(data1, 'DDD@@@@890j23poijrl;adsf@');

      const {rules: rulesObj} = compile(data1.ruleText);

      const exhibitList: InformalNodeManagerPageModelState['exhibitPageExhibitList'] = (data.dataList as any[]).map<InformalNodeManagerPageModelState['exhibitPageExhibitList'][number]>((dl) => {
        const operations: string[] = dl.rules[0]?.operations || [];
        // console.log(operations, 'operations12334');
        const stateInfo = dl.stateInfo;

        const rulesObjRule = rulesObj.find((ro: any) => {
          // console.log(ro, dl, '#############***********;ojsifw389');
          return ro.exhibitName === dl.testResourceName;
        });

        // console.log(rulesObjRule, 'rulesObjRulerulesObjRule!!!@@@@@@');

        // console.log(dl, 'dl!@#$@#$@#$!@#$@#$12341234');

        const rule: InformalNodeManagerPageModelState['exhibitPageExhibitList'][number]['rule'] = {
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
          ruleAllAddedObjectNames: allAddRule.filter((tr: any) => {
            return tr.ruleInfo.candidate.type === 'object';
          }).map((tr: any) => {
            return tr.ruleInfo.candidate.name;
          }),
          ruleAllAddedResourceNames: allAddRule.filter((tr: any) => {
            return tr.ruleInfo.candidate.type === 'resource';
          }).map((tr: any) => {
            return tr.ruleInfo.candidate.name;
          }),
          exhibitPageExhibitsTotal: data.totalItem,
          exhibitPageExhibitList: exhibitList,
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
        keywords: informalNodeManagerPage.themePageFilterKeywords || undefined,
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
          themePageThemesTotal: data.totalItem,
          themePageThemeList: (data.dataList as any[]).map<InformalNodeManagerPageModelState['themePageThemeList'][number]>((dl) => {

            // console.log(dl, 'dl!@@#$#$');

            const operations: string[] = dl.rules[0]?.operations || [];
            // console.log(operations, 'operations12334');
            const stateInfo = dl.stateInfo;

            const rulesObjRule = rulesObj.find((ro: any) => {
              // console.log(ro, dl, '98uwi@#DSAFUHJ(*)hjkljl');
              return ro.exhibitName === dl.testResourceName;
            });

            // operations.map<InformalNodeManagerPageModelState['exhibitList'][number]['rules'][number]>((o) => {
            const rule: InformalNodeManagerPageModelState['themePageThemeList'][number]['rule'] = {
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
          rulePageRuleList: data.testRules.map((tr: any) => {
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
          rulePageRuleList: data1.testRules.map((tr: any) => {
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

                if (usedResourceIDs.includes(rs.resourceId) || informalNodeManagerPage.ruleAllAddedResourceNames.includes(rs.resourceName)) {
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

                if (usedResourceIDs.includes(rs.resourceId) || informalNodeManagerPage.ruleAllAddedResourceNames.includes(rs.resourceName)) {
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

                if (usedResourceIDs.includes(rs.resourceId) || informalNodeManagerPage.ruleAllAddedResourceNames.includes(rs.resourceName)) {
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

                if (usedResourceIDs.includes(ob.objectId) || informalNodeManagerPage.ruleAllAddedObjectNames.includes(objectName)) {
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

    * onReplacerMount({}: OnReplacerMountAction, {put, call}: EffectsCommandMap) {
      yield put<FetchReplacerListAction>({
        type: 'fetchReplacerList',
        payload: {
          restart: true,
          origin: '!market',
        },
      });

      const params: Parameters<typeof FServiceAPI.Storage.bucketList>[0] = {
        bucketType: 1,
      };

      const {data} = yield call(FServiceAPI.Storage.bucketList, params);
      // console.log(data, '!@#$!@#$#$!@111111111');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerBucketOptions: (data as any[]).map<InformalNodeManagerPageModelState['replacerBucketOptions'][number]>((d: any) => {
            return {
              value: d.bucketName,
              title: d.bucketName,
            };
          }),
        },
      });
    },
    * onReplacerUnmount({}: OnReplacerUnmountAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerResourceOptions: [
            {value: '!market', title: '资源市场'},
            {value: '!resource', title: '我的资源'},
            {value: '!collection', title: '我的收藏'},
          ],
          replacerBucketOptions: [],
          replacerOrigin: '!market',
          replacerKeywords: '',
          replacerResourceList: [],
        },
      });
    },
    * onReplacerOriginChange({payload}: OnReplacerOriginChangeAction, {put, select}: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerOrigin: payload.value,
        },
      });

      yield put<FetchReplacerListAction>({
        type: 'fetchReplacerList',
        payload: {
          restart: true,
          origin: payload.value,
        },
      });
    },
    * onReplacerKeywordsChange({payload}: OnReplacerKeywordsChangeAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerKeywords: payload.value,
        },
      });

      yield put<FetchReplacerListAction>({
        type: 'fetchReplacerList',
        payload: {
          restart: true,
          keywords: payload.value,
        },
      });
    },
    * fetchReplacerList({payload}: FetchReplacerListAction, {select, call, put}: EffectsCommandMap) {
      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const payloadOrigin: string = payload.origin !== undefined ? payload.origin : informalNodeManagerPage.replacerOrigin;
      const payloadKeywords: string = payload.keywords !== undefined ? payload.keywords : informalNodeManagerPage.replacerKeywords;

      let replacerResourceList: InformalNodeManagerPageModelState['replacerResourceList'] = [];

      if (!payload.restart) {
        replacerResourceList = [
          ...informalNodeManagerPage.replacerResourceList,
        ];
      }

      if (payloadOrigin === '!market') {

        const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
          skip: replacerResourceList.length,
          limit: FUtil.Predefined.pageSize,
          keywords: payloadKeywords,
        };

        const {data} = yield call(FServiceAPI.Resource.list, params);

        replacerResourceList = [
          ...replacerResourceList,
          ...(data.dataList as any[]).map<InformalNodeManagerPageModelState['replacerResourceList'][number]>((rs) => {
            // console.log(rs, '######2341234');
            return {
              checked: false,
              id: rs.resourceId,
              identity: 'resource',
              name: rs.resourceName,
              type: rs.resourceType,
              latestVersion: rs.latestVersion,
              updateTime: FUtil.Format.formatDateTime(rs.updateDate),
              status: rs.status === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
              versions: rs.resourceVersions.map((rv: any) => {
                return rv.version;
              }),
              versionRange: '',
            };
          }),
        ];
      } else if (payloadOrigin === '!resource') {
        // yield put<FetchMyResourcesAction>({
        //   type: 'fetchMyResources',
        // });

        const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
          // resourceType:''
          skip: replacerResourceList.length,
          limit: FUtil.Predefined.pageSize,
          isSelf: 1,
          keywords: payloadKeywords,
        };
        // console.log(params, 'paramsparams1234');
        const {data} = yield call(FServiceAPI.Resource.list, params);
        // console.log(data, 'data13453');
        replacerResourceList = [
          ...replacerResourceList,
          ...(data.dataList as any[]).map<InformalNodeManagerPageModelState['replacerResourceList'][number]>((rs) => {
            return {
              checked: false,
              id: rs.resourceId,
              identity: 'resource',
              name: rs.resourceName,
              type: rs.resourceType,
              latestVersion: rs.latestVersion,
              updateTime: FUtil.Format.formatDateTime(rs.updateDate),
              status: rs.status === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
              versions: rs.resourceVersions.map((rv: any) => {
                return rv.version;
              }),
              versionRange: '',
            };
          }),
        ];
      } else if (payloadOrigin === '!collection') {
        // yield put<FetchCollectionAction>({
        //   type: 'fetchCollection',
        // });

        const params: Parameters<typeof FServiceAPI.Collection.collectionResources>[0] = {
          skip: replacerResourceList.length,
          limit: FUtil.Predefined.pageSize,
          keywords: payloadKeywords,
        };

        const {data} = yield call(FServiceAPI.Collection.collectionResources, params);
        // console.log(data, '@@@@@@ASEDFSADF');

        let data3 = [];

        if (data.dataList.length > 0) {
          const params2: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
            resourceIds: data.dataList.map((dl: any) => {
              return dl.resourceId;
            }).join(),
          };

          const {data: data2} = yield call(FServiceAPI.Resource.batchInfo, params2);

          data3 = data2;
        }

        replacerResourceList = [
          ...replacerResourceList,
          ...(data3 as any[]).map<InformalNodeManagerPageModelState['replacerResourceList'][number]>((rs) => {
            return {
              checked: false,
              id: rs.resourceId,
              identity: 'resource',
              name: rs.resourceName,
              type: rs.resourceType,
              updateTime: FUtil.Format.formatDateTime(rs.updateDate),
              latestVersion: rs.latestVersion,
              status: rs.resourceStatus === 1 ? '' : (rs.latestVersion ? 'offline' : 'unreleased'),
              versions: rs.resourceVersions.map((rv: any) => {
                return rv.version;
              }),
              versionRange: '',
            };
          }),
        ]

      } else {
        const params: Parameters<typeof FServiceAPI.Storage.objectList>[0] = {
          skip: 0,
          limit: FUtil.Predefined.pageSize,
          bucketName: payloadOrigin,
          keywords: payloadKeywords,
        };

        const {data} = yield call(FServiceAPI.Storage.objectList, params);
        // console.log(data, 'data1q2349ojmdfsl');
        replacerResourceList = [
          ...replacerResourceList,
          ...(data.dataList as any[]).map<InformalNodeManagerPageModelState['replacerResourceList'][number]>((ob) => {
            const objectName: string = ob.bucketName + '/' + ob.objectName;
            return {
              checked: false,
              id: ob.objectId,
              identity: 'object',
              name: objectName,
              type: ob.resourceType,
              latestVersion: '',
              updateTime: FUtil.Format.formatDateTime(ob.updateDate),
              status: '',
              versions: [],
              versionRange: '',
            };
          }),
        ];
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerResourceList: replacerResourceList,
        },
      });

    },
    * onReplacerListCheckedChange({payload}: OnReplacerListCheckedChangeAction, {select, put}: EffectsCommandMap) {
      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerResourceList: informalNodeManagerPage.replacerResourceList.map<InformalNodeManagerPageModelState['replacerResourceList'][number]>((rr) => {
            if (rr.id !== payload.id) {
              return {
                ...rr,
                checked: false,
              };
            }
            return {
              ...rr,
              checked: true,
            };
          }),
        },
      });
    },
    * onReplacerListVersionRangeChange({payload}: OnReplacerListVersionRangeChangeAction, {put, select}: EffectsCommandMap) {
      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacerResourceList: informalNodeManagerPage.replacerResourceList.map<InformalNodeManagerPageModelState['replacerResourceList'][number]>((rr) => {
            if (rr.id !== payload.id) {
              return rr;
            }
            return {
              ...rr,
              versionRange: payload.versionRange,
            };
          }),
        },
      });
    },
    * onReplacerListLoadMore({}: OnReplacerListLoadMoreAction, {}: EffectsCommandMap) {

    },
    * onReplacedMount({}: OnReplacedMountAction, {}: EffectsCommandMap) {

    },
    * onReplacedUnmount({}: OnReplacedUnmountAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacedKeywords: '',
          replacedDependencyTreeList: [],
          replacedSelectDependency: null,
          replacedTargetVersions: [],
          replacedTargetSelectedVersion: null,
          replacedTreeData: [],
          replacedCheckedKeys: [],
        },
      });
    },
    * onReplacedKeywordChange({payload}: OnReplacedKeywordChangeAction, {put, select, call}: EffectsCommandMap) {
      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const payloadValue: string = payload.value;

      yield put({
        type: 'change',
        payload: {
          replacedKeywords: payloadValue,
        },
      });

      const params: Parameters<typeof FServiceAPI.InformalNode.dependencyTree>[0] = {
        nodeId: informalNodeManagerPage.nodeID,
        keywords: payloadValue,
        resourceType: informalNodeManagerPage.showPage === 'theme' ? 'theme' : undefined,
        omitResourceType: informalNodeManagerPage.showPage === 'theme' ? undefined : 'theme',
      };

      const {data} = yield call(FServiceAPI.InformalNode.dependencyTree, params);
      // console.log(data, '##@ADSFASDFSDCX');

      let replacedSelectDependency = data.find((d: any) => d.name === payloadValue);
      // console.log(replacedSelectDependency, 'replacedSelectDependency#$FDS_)+(Ujoi');

      const replacedTargetVersions: InformalNodeManagerPageModelState['replacedTargetVersions'] = replacedSelectDependency
        ? [
          {value: '', text: '全部版本'},
          ...replacedSelectDependency.versions.map((v: any) => {
            return {
              value: v,
              text: v,
            };
          }),
        ]
        : [];
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacedDependencyTreeList: data?.map((d: any) => d.name) || [],
          replacedSelectDependency: replacedSelectDependency || null,
          replacedTargetVersions: replacedTargetVersions,
          replacedTargetSelectedVersion: replacedTargetVersions.length > 0 ? replacedTargetVersions[0] : null,
        },
      });

      if (!replacedSelectDependency) {
        return;
      }

      const params3: Parameters<typeof FServiceAPI.InformalNode.searchTestResourcesByDependency>[0] = {
        nodeId: informalNodeManagerPage.nodeID,
        dependentEntityId: replacedSelectDependency.id,
        resourceType: informalNodeManagerPage.showPage === 'theme' ? 'theme' : undefined,
        omitResourceType: informalNodeManagerPage.showPage === 'theme' ? undefined : 'theme',
      };
      const {data: data3} = yield call(FServiceAPI.InformalNode.searchTestResourcesByDependency, params3);
      // console.log(data3, 'data3data3data3data3data3data3data309789079877897989797');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacedTreeData: (data3 as any[]).map<InformalNodeManagerPageModelState['replacedTreeData'][number]>((d: any) => {
            return {
              key: `${FUtil.Tool.generateRandomCode()}:${d.testResourceName}`,
              id: d.testResourceId,
              title: `${d.entityName}(${d.testResourceName})`,
            };
          }),
          replacedCheckedKeys: [],
        },
      });
    },
    * onReplacedEntityVersionChange({payload}: OnReplacedEntityVersionChangeAction, {select, call, put}: EffectsCommandMap) {

      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      if (!informalNodeManagerPage.replacedSelectDependency) {
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacedTargetSelectedVersion: informalNodeManagerPage.replacedTargetVersions.find((rtv) => {
            return rtv.value === payload.value;
          }) || null,
        },
      });

      const params3: Parameters<typeof FServiceAPI.InformalNode.searchTestResourcesByDependency>[0] = {
        nodeId: informalNodeManagerPage.nodeID,
        dependentEntityId: informalNodeManagerPage.replacedSelectDependency.id,
        resourceType: informalNodeManagerPage.showPage === 'theme' ? 'theme' : undefined,
        omitResourceType: informalNodeManagerPage.showPage === 'theme' ? undefined : 'theme',
        dependentEntityVersionRange: payload.value || undefined,
      };
      const {data: data3} = yield call(FServiceAPI.InformalNode.searchTestResourcesByDependency, params3);
      // console.log(data3, 'data3data3data3data3data3data3data309789079877897989797');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacedTreeData: (data3 as any[]).map<InformalNodeManagerPageModelState['replacedTreeData'][number]>((d: any) => {
            return {
              key: `${FUtil.Tool.generateRandomCode()}:${d.testResourceName}`,
              id: d.testResourceId,
              title: `${d.entityName}(${d.testResourceName})`,
            };
          }),
          replacedCheckedKeys: [],
        },
      });
    },
    * onReplacedTreeLoadData({payload}: OnReplacedTreeLoadDataAction, {select, put, call}: EffectsCommandMap) {

      // console.log(payload, 'payloadpayloadpayloadpayloadpayloadpayload!!!!!!@@@@@@@#3333333');

      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      if (payload.pos.split('-').length !== 2) {
        return;
      }
      const params: Parameters<typeof FServiceAPI.InformalNode.dependencyTreeFilter>[0] = {
        testResourceId: payload.id,
        dependentEntityId: informalNodeManagerPage.replacedSelectDependency?.id || '',
        dependentEntityVersionRange: informalNodeManagerPage.replacedTargetSelectedVersion?.value || undefined,
      };
      const {data} = yield call(FServiceAPI.InformalNode.dependencyTreeFilter, params);
      // console.log(data, 'dependencyTreeFilter!@#$@!#$@#$@#$');
      const result = updateTreeData({
        list: informalNodeManagerPage.replacedTreeData as TreeNode[],
        key: payload.key,
        children: organizeData(data[0].dependencies, payload.key),
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replacedTreeData: result,
        },
      });
    },
    * onReplaceModalCancel({}: OnReplaceModalCancelAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModalVisible: false,
        },
      });
    },
    * onReplaceModalConfirm({}: OnReplaceModalConfirmAction, {select, put}: EffectsCommandMap) {
      const {informalNodeManagerPage}: ConnectState = yield select(({informalNodeManagerPage}: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const simplifiedResults: string[][] = simplifiedRelationship(informalNodeManagerPage.replacedCheckedKeys)
        .map<string[]>((r) => {
          return r.split(':')
            .filter((_, i) => {
              return i !== 0;
            });
        });
      // console.log(simplifiedResults, 're90j23DSF@#AFSd0-_simplifiedResults');
      const resultObj: { [key: string]: ICandidate[][] } = {};
      for (const simplifiedResult of simplifiedResults) {
        resultObj[simplifiedResult[0]] = [];
      }
      for (const simplifiedResult of simplifiedResults) {
        const [key, ...arr] = simplifiedResult;
        // console.log(key, arr, '@#DASasiodfj_(UJLKjl;');
        if (arr.length === 0) {
          continue;
        }
        // console.log(arr, 'arr@#$R%DSFZ)_Jkl;sdafds');
        resultObj[key].push(arr.map((o: string) => {
          if (o.startsWith('$')) {
            return {
              name: o.replace('$', ''),
              type: 'resource',
              versionRange: 'latest',
            }
          } else {
            return {
              name: o.replace('#', ''),
              type: 'object',
              versionRange: 'latest',
            }
          }
        }));
      }
      // console.log(resultObj, 'resultObj@#AFDSFASD)(_&UOIJ:');

      const replacerData = informalNodeManagerPage.replacerResourceList.find((rr) => {
        // return rr.name === informalNodeManagerPage.replacerCheckedResourceName;
        return rr.checked;
      });
      // console.log(replacerData, 'replacerData234edf@#$SDF)(JLK');
      const results: IConfirmValue = [];
      for (const [exhibitName, scopes] of Object.entries(resultObj)) {
        results.push({
          exhibitName: exhibitName,
          replaced: {
            name: informalNodeManagerPage.replacedSelectDependency?.name || '',
            versionRange: informalNodeManagerPage.replacedTargetSelectedVersion?.value || 'latest',
            type: informalNodeManagerPage.replacedSelectDependency?.type || 'object',
          },
          replacer: {
            name: replacerData?.name || '',
            versionRange: replacerData?.versionRange || 'latest',
            type: replacerData?.identity || 'object',
          },
          scopes: scopes,
        });
      }
      // return results;

      const rules: any[] = informalNodeManagerPage.allRuleResult.map((rr: any) => {
        return rr.ruleInfo;
      });
      // console.log(rules, '@#XDFZFSWEAfdjs9flkasjd');

      for (const v of results) {
        const rule = rules.find((r: any) => v.exhibitName === r.exhibitName);
        if (rule) {
          let replaces = rule.replaces || [];
          rule.replaces = [
            ...replaces,
            v,
          ];
        } else {
          rules.unshift({
            operation: 'alter',
            exhibitName: v.exhibitName,
            replaces: [v]
          });
        }
      }
      // console.log(rules, 'nowRules0923jlkfds()UOIJ');
      yield put<SaveDataRulesAction>({
        type: 'saveDataRules',
        payload: {
          type: 'replace',
          data: rules,
        },
      });
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModalVisible: false
        },
      });
    },
  },
  reducers: {
    change(state, {payload}) {
      // const newState = {...state};
      // if (payload.replacedCheckedKeys && payload.replacedCheckedKeys.length === 0 && state.replacerResourceList.some((rr) => rr.checked)) {
      //
      // }
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

interface UpdateTreeDataParams {
  list: TreeNode[];
  key: React.Key;
  children: TreeNode[];
}

function updateTreeData({list, key, children}: UpdateTreeDataParams): TreeNode[] {
  return list.map(node => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    } else if (node.children) {
      return {
        ...node,
        children: updateTreeData({
          list: node.children,
          key,
          children,
        }),
      };
    }
    return node;
  });
}

interface OrganizeData {
  id: string;
  name: string;
  type: string;
  dependencies: OrganizeData[];
}

function organizeData(data: OrganizeData[], parentKey: string = ''): TreeNode[] {
  // console.log(data, 'data2WQR@#SDfolkj;lk');
  return data.map<TreeNode>((d) => {
    const key = parentKey + ':' + (d.type === 'resource' ? '$' : '#') + d.name;

    if (d.dependencies.length === 0) {
      return {
        title: d.name,
        key,
        id: d.id,
        isLeaf: true,
      };
    }

    return {
      title: d.name,
      key,
      id: d.id,
      isLeaf: false,
      children: organizeData(d.dependencies, key),
    };
  });
}

function simplifiedRelationship(relation: string[]): string[] {
  let arr: string[] = [...relation].sort((a: string, b: string) => a.length - b.length);

  for (let i = 0; i < arr.length; i++) {
    const current: string = arr[i];
    arr = arr.filter((a) => {
      return a === current || !a.startsWith(current);
    });
  }
  return arr;
}
