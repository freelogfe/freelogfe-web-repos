import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { router } from 'umi';
import moment from 'moment';
import FileSaver from 'file-saver';
import fMessage from '@/components/fMessage';
import { listStateAndListMore } from '@/components/FListFooter';

const { decompile, compile } = require('@freelog/nmr_translator');

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
  showPage: 'exhibit' | 'theme' | 'mappingRule';

  node_ID: number;
  node_Name: string;
  node_Url: string;
  node_TestUrl: string;
  node_RuleText: string;
  node_AllRuleResult: any;
  node_RuleAllAddedResourceNames: string[];
  node_RuleAllAddedObjectNames: string[];

  addExhibitDrawer_Visible: boolean;

  replaceModal_Visible: boolean;
  replaceModal_Replacer_ResourceOptions: { value: string; title: string }[];
  replaceModal_Replacer_BucketOptions: { value: string; title: string }[];
  replaceModal_Replacer_Origin: '!market' | '!resource' | '!collection' | string;
  replaceModal_Replacer_Keywords: string;
  replaceModal_Replacer_ResourceList: {
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
  replaceModal_Replaced_Keywords: string;
  replaceModal_Replaced_DependencyTreeList: string[];
  replaceModal_Replaced_SelectDependency: null | {
    id: string;
    name: string;
    type: 'resource' | 'object';
    versions: string[],
  };
  replaceModal_Replaced_TargetVersions: {
    value: string;
    text: string;
  }[],
  replaceModal_Replaced_TargetSelectedVersion: {
    value: string;
    text: string;
  } | null;
  replaceModal_Replaced_TreeData: TreeNode[];
  replaceModal_Replaced_CheckedKeys: string[];

  exhibit_TypeOptions: { value: string; text: string; }[];
  exhibit_SelectedType: '-1' | string;
  exhibit_StatusOptions: { value: string; text: string; }[];
  exhibit_SelectedStatus: '0' | '1' | '2';
  exhibit_FilterKeywords: string;
  exhibit_ListState: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  exhibit_ListMore: 'loading' | 'andMore' | 'noMore';
  exhibit_List: {
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
  exhibit_PageError: string;

  theme_ActivatingThemeName: string;
  theme_FilterKeywords: string;
  theme_ListState: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  theme_ListMore: 'loading' | 'andMore' | 'noMore';
  theme_List: {
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
  theme_PageError: string;

  rule_PageStatus: 'normal' | 'export' | 'delete' | 'coding';
  // rule_Indeterminate: boolean;
  // rule_IndeterminateChecked: boolean;
  rule_RuleList: {
    id: string;
    checked: boolean;
    matchErrors: string[];
    ruleInfo: any;
    efficientInfos: any[];
  }[];
  rule_CodeInput: string;
  rule_CodeIsDirty: boolean;
  rule_PromptLeavePath: string;
  rule_CodeState: 'editing' | 'checking' | 'compileError' | 'executionError' | 'noError';
  rule_CodeCompileErrors: {
    charPositionInLine: number;
    line: number;
    msg: string;
    offendingSymbol: string;
  }[];
  rule_CodeExecutionErrors: {
    ruleText: string;
    errors: string[];
  }[];
  rule_CodeEfficients: {
    ruleText: string;
    matchCount: number;
  }[];
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'informalNodeManagerPage/change';
  payload: Partial<InformalNodeManagerPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'informalNodeManagerPage/onMountPage';
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'informalNodeManagerPage/onUnmountPage';
}

export interface OnMountPageSiderAction extends AnyAction {
  type: 'informalNodeManagerPage/onMountPageSider';
  payload: {
    nodeID: number;
  };
}

export interface OnUnmountPageSiderAction extends AnyAction {
  type: 'informalNodeManagerPage/onUnmountPageSider';
}

export interface OnChangePageAction extends AnyAction {
  type: 'informalNodeManagerPage/onChangePage';
  payload: {
    value: 'exhibit' | 'theme' | 'mappingRule';
  };
}

// export interface OnMount_ExhibitPage_Action extends AnyAction {
//   type: 'informalNodeManagerPage/onMount_ExhibitPage';
// }
//
// export interface OnUnmount_ExhibitPage_Action extends AnyAction {
//   type: 'informalNodeManagerPage/onUnmount_ExhibitPage';
// }
//
// export interface OnMount_ThemePage_Action extends AnyAction {
//   type: 'informalNodeManagerPage/onMount_ThemePage';
// }
//
// export interface OnUnmount_ThemePage_Action extends AnyAction {
//   type: 'informalNodeManagerPage/onUnmount_ThemePage';
// }
//
// export interface OnMount_RulePage_Action extends AnyAction {
//   type: 'informalNodeManagerPage/onMount_ThemePage';
// }
//
// export interface OnUnmount_RulePage_Action extends AnyAction {
//   type: 'informalNodeManagerPage/onUnmount_ThemePage';
// }

export interface OnMountExhibitPageAction extends AnyAction {
  type: 'informalNodeManagerPage/onMountExhibitPage';
}

export interface OnUnmountExhibitPageAction extends AnyAction {
  type: 'informalNodeManagerPage/onUnmountExhibitPage';
}

export interface OnMountThemePageAction extends AnyAction {
  type: 'informalNodeManagerPage/onMountThemePage';
}

export interface OnUnmountThemePageAction extends AnyAction {
  type: 'informalNodeManagerPage/onUnmountThemePage';
}

export interface OnMountRulePageAction extends AnyAction {
  type: 'informalNodeManagerPage/onMountRulePage';
}

export interface OnUnmountRulePageAction extends AnyAction {
  type: 'informalNodeManagerPage/onUnmountRulePage';
}

export interface OnPromptRulePageLeaveAction extends AnyAction {
  type: 'informalNodeManagerPage/onPromptRulePageLeave';
  payload: {
    href: string;
  };
}

export interface OnConfirmRulePageLeaveAction extends AnyAction {
  type: 'informalNodeManagerPage/onConfirmRulePageLeave';
}

export interface OnCancelRulePageLeaveAction extends AnyAction {
  type: 'informalNodeManagerPage/onCancelRulePageLeave';
}

export interface FetchNodeInfoAction extends AnyAction {
  type: 'fetchNodeInfo';
}

export interface FetchExhibitListAction extends AnyAction {
  type: 'informalNodeManagerPage/fetchExhibitList' | 'fetchExhibitList';
  payload: {
    isRematch?: boolean;
    isRestart?: boolean;
  };
}

export interface OnClickExhibitsAddBtnAction extends AnyAction {
  type: 'informalNodeManagerPage/onClickExhibitsAddBtn';
}

export interface OnClickExhibitsReplaceBtnAction extends AnyAction {
  type: 'informalNodeManagerPage/onClickExhibitsReplaceBtn';
}

export interface OnChangeExhibitTypeAction extends AnyAction {
  type: 'informalNodeManagerPage/onChangeExhibitType';
  payload: {
    value: string;
  };
}

export interface OnChangeExhibitStatusAction extends AnyAction {
  type: 'informalNodeManagerPage/onChangeExhibitStatus';
  payload: {
    value: string;
  };
}

export interface OnChangeExhibitKeywordsAction extends AnyAction {
  type: 'informalNodeManagerPage/onChangeExhibitKeywords';
  payload: {
    value: string;
  };
}

export interface OnLoadMoreExhibitsAction extends AnyAction {
  type: 'informalNodeManagerPage/onLoadMoreExhibits';
}

export interface FetchThemeListAction extends AnyAction {
  type: 'informalNodeManagerPage/fetchThemeList' | 'fetchThemeList';
  payload: {
    isRematch?: boolean;
    isRestart?: boolean;
  };
}

export interface OnClickThemesAddBtnAction extends AnyAction {
  type: 'informalNodeManagerPage/onClickExhibitsAddBtn';
}

export interface OnClickThemesReplaceBtnAction extends AnyAction {
  type: 'informalNodeManagerPage/onClickExhibitsReplaceBtn';
}

export interface OnChangeThemeKeywordsAction extends AnyAction {
  type: 'informalNodeManagerPage/onChangeThemeKeywords';
  payload: {
    value: string;
  };
}

export interface OnLoadMoreThemesAction extends AnyAction {
  type: 'informalNodeManagerPage/onLoadMoreThemes';
}

export interface OnClickActiveThemeBtnAction extends AnyAction {
  type: 'informalNodeManagerPage/onClickActiveThemeBtn';
  payload: {
    themeName: string;
  };
}

export interface FetchRulesAction extends AnyAction {
  type: 'informalNodeManagerPage/fetchRules' | 'fetchRules';
}

export interface SaveRulesAction extends AnyAction {
  type: 'informalNodeManagerPage/saveRules' | 'saveRules';
}

export interface OnLoad_Rule_ImportFileInput_Action extends AnyAction {
  type: 'informalNodeManagerPage/onLoad_Rule_ImportFileInput';
  payload: {
    value: string;
  };
}

export interface OnClick_Rule_ExportBtn_Action extends AnyAction {
  type: 'informalNodeManagerPage/onClick_Rule_ExportBtn';
}

export interface OnClick_Rule_Export_ConfirmBtn_Action extends AnyAction {
  type: 'informalNodeManagerPage/onClick_Rule_Export_ConfirmBtn';
}

export interface OnClick_Rule_Export_CancelBtn_Action extends AnyAction {
  type: 'informalNodeManagerPage/onClick_Rule_Export_CancelBtn';
}

export interface OnClick_Rule_DeleteBtn_Action extends AnyAction {
  type: 'informalNodeManagerPage/onClick_Rule_DeleteBtn';
}

export interface OnClick_Rule_Delete_ConfirmBtn_Action extends AnyAction {
  type: 'informalNodeManagerPage/onClick_Rule_Delete_ConfirmBtn';
}

export interface OnClick_Rule_Delete_CancelBtn_Action extends AnyAction {
  type: 'informalNodeManagerPage/onClick_Rule_Delete_CancelBtn';
}

export interface OnClick_Rule_EntryCodingBtn_Action extends AnyAction {
  type: 'informalNodeManagerPage/onClick_Rule_EntryCodingBtn';
}

export interface OnClick_Rule_ExitCodingBtn_Action extends AnyAction {
  type: 'informalNodeManagerPage/onClick_Rule_ExitCodingBtn';
}

export interface OnClick_Rule_ExitCoding_ConfirmBtn_Action extends AnyAction {
  type: 'informalNodeManagerPage/onClick_Rule_ExitCoding_ConfirmBtn';
}

export interface OnClick_Rule_ExitCoding_CancelBtn_Action extends AnyAction {
  type: 'informalNodeManagerPage/onClick_Rule_ExitCoding_CancelBtn';
}

export interface OnChange_Rule_CheckAllCheckbox_Action extends AnyAction {
  type: 'informalNodeManagerPage/OoChange_Rule_CheckAllCheckbox';
  payload: {
    checked: boolean;
  };
}

export interface OnChange_Rule_ListCheckbox_Action extends AnyAction {
  type: 'informalNodeManagerPage/onChange_Rule_ListCheckbox';
  payload: {
    ruleID: string;
    checked: boolean;
  };
}

export interface OnChange_Rule_Codemirror_Action extends AnyAction {
  type: 'informalNodeManagerPage/onChange_Rule_Codemirror';
  payload: {
    value: string;
  };
}

export interface OnClick_Rule_SaveBtn_Action extends AnyAction {
  type: 'informalNodeManagerPage/onClick_Rule_SaveBtn';
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
  };
}

export interface OnCancel_AddExhibitDrawer_Action extends AnyAction {
  type: 'informalNodeManagerPage/onCancel_AddExhibitDrawer';
}

export interface OnConfirm_AddExhibitDrawer_Action extends AnyAction {
  type: 'informalNodeManagerPage/onConfirm_AddExhibitDrawer';
  payload: {
    identity: 'object' | 'resource';
    names: string[];
  };
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
  type: 'informalNodeManagerPage/onReplacerKeywordsChange';
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
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
    onMountPageSider: (action: OnMountPageSiderAction, effects: EffectsCommandMap) => void;
    onUnmountPageSider: (action: OnUnmountPageSiderAction, effects: EffectsCommandMap) => void;
    onChangePage: (action: OnChangePageAction, effects: EffectsCommandMap) => void;
    onMountExhibitPage: (action: OnMountExhibitPageAction, effects: EffectsCommandMap) => void;
    onUnmountExhibitPage: (action: OnUnmountExhibitPageAction, effects: EffectsCommandMap) => void;
    onMountThemePage: (action: OnMountThemePageAction, effects: EffectsCommandMap) => void;
    onUnmountThemePage: (action: OnUnmountThemePageAction, effects: EffectsCommandMap) => void;
    onMountRulePage: (action: OnMountRulePageAction, effects: EffectsCommandMap) => void;
    onUnmountRulePage: (action: OnUnmountRulePageAction, effects: EffectsCommandMap) => void;
    onPromptRulePageLeave: (action: OnPromptRulePageLeaveAction, effects: EffectsCommandMap) => void;
    onConfirmRulePageLeave: (action: OnConfirmRulePageLeaveAction, effects: EffectsCommandMap) => void;
    onCancelRulePageLeave: (action: OnCancelRulePageLeaveAction, effects: EffectsCommandMap) => void;

    fetchNodeInfo: (action: FetchNodeInfoAction, effects: EffectsCommandMap) => void;

    fetchExhibitList: (action: FetchExhibitListAction, effects: EffectsCommandMap) => void;
    onClickExhibitsAddBtn: (action: OnClickExhibitsAddBtnAction, effects: EffectsCommandMap) => void;
    onClickExhibitsReplaceBtn: (action: OnClickExhibitsReplaceBtnAction, effects: EffectsCommandMap) => void;
    onChangeExhibitType: (action: OnChangeExhibitTypeAction, effects: EffectsCommandMap) => void;
    onChangeExhibitStatus: (action: OnChangeExhibitStatusAction, effects: EffectsCommandMap) => void;
    onChangeExhibitKeywords: (action: OnChangeExhibitKeywordsAction, effects: EffectsCommandMap) => void;
    onLoadMoreExhibits: (action: OnLoadMoreExhibitsAction, effects: EffectsCommandMap) => void;

    fetchThemeList: (action: FetchThemeListAction, effects: EffectsCommandMap) => void;
    onClickThemesAddBtn: (action: OnClickThemesAddBtnAction, effects: EffectsCommandMap) => void;
    onClickThemesReplaceBtn: (action: OnClickThemesReplaceBtnAction, effects: EffectsCommandMap) => void;
    onChangeThemeKeywords: (action: OnChangeThemeKeywordsAction, effects: EffectsCommandMap) => void;
    onLoadMoreThemes: (action: OnLoadMoreThemesAction, effects: EffectsCommandMap) => void;
    onClickActiveThemeBtn: (action: OnClickActiveThemeBtnAction, effects: EffectsCommandMap) => void;

    fetchRules: (action: FetchRulesAction, effects: EffectsCommandMap) => void;
    saveRules: (action: SaveRulesAction, effects: EffectsCommandMap) => void;
    saveDataRules: (action: SaveDataRulesAction, effects: EffectsCommandMap) => void;
    onLoad_Rule_ImportFileInput: (action: OnLoad_Rule_ImportFileInput_Action, effects: EffectsCommandMap) => void;
    onClick_Rule_ExportBtn: (action: OnClick_Rule_ExportBtn_Action, effects: EffectsCommandMap) => void;
    onClick_Rule_Export_ConfirmBtn: (action: OnClick_Rule_Export_ConfirmBtn_Action, effects: EffectsCommandMap) => void;
    onClick_Rule_Export_CancelBtn: (action: OnClick_Rule_Export_CancelBtn_Action, effects: EffectsCommandMap) => void;
    onClick_Rule_DeleteBtn: (action: OnClick_Rule_DeleteBtn_Action, effects: EffectsCommandMap) => void;
    onClick_Rule_Delete_ConfirmBtn: (action: OnClick_Rule_Delete_ConfirmBtn_Action, effects: EffectsCommandMap) => void;
    onClick_Rule_Delete_CancelBtn: (action: OnClick_Rule_Delete_CancelBtn_Action, effects: EffectsCommandMap) => void;
    onClick_Rule_EntryCodingBtn: (action: OnClick_Rule_EntryCodingBtn_Action, effects: EffectsCommandMap) => void;
    onClick_Rule_ExitCodingBtn: (action: OnClick_Rule_ExitCodingBtn_Action, effects: EffectsCommandMap) => void;
    onClick_Rule_ExitCoding_ConfirmBtn: (action: OnClick_Rule_ExitCoding_ConfirmBtn_Action, effects: EffectsCommandMap) => void;
    onClick_Rule_ExitCoding_CancelBtn: (action: OnClick_Rule_ExitCoding_CancelBtn_Action, effects: EffectsCommandMap) => void;
    OoChange_Rule_CheckAllCheckbox: (action: OnChange_Rule_CheckAllCheckbox_Action, effects: EffectsCommandMap) => void;
    onChange_Rule_ListCheckbox: (action: OnChange_Rule_ListCheckbox_Action, effects: EffectsCommandMap) => void;
    onChange_Rule_Codemirror: (action: OnChange_Rule_Codemirror_Action, effects: EffectsCommandMap) => void;
    onClick_Rule_SaveBtn: (action: OnClick_Rule_SaveBtn_Action, effects: EffectsCommandMap) => void;

    onCancel_AddExhibitDrawer: (action: OnCancel_AddExhibitDrawer_Action, effects: EffectsCommandMap) => void;
    onConfirm_AddExhibitDrawer: (action: OnConfirm_AddExhibitDrawer_Action, effects: EffectsCommandMap) => void;

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

const exhibitInitStates: Pick<InformalNodeManagerPageModelState,
  'exhibit_TypeOptions' |
  'exhibit_SelectedType' |
  'exhibit_StatusOptions' |
  'exhibit_SelectedStatus' |
  'exhibit_FilterKeywords' |
  'exhibit_ListState' |
  'exhibit_ListMore' |
  'exhibit_List' |
  'exhibit_PageError'> = {
  exhibit_TypeOptions: [
    { text: '全部', value: '-1' },
    ...FUtil.Predefined.resourceTypes
      .filter((i) => i !== 'theme')
      .map((i) => ({ value: i, text: i })),
  ],
  exhibit_SelectedType: '-1',
  exhibit_StatusOptions: [
    { text: '全部', value: '2' },
    { text: '已上线', value: '1' },
    { text: '已下线', value: '0' },
  ],
  exhibit_SelectedStatus: '2',
  exhibit_FilterKeywords: '',
  exhibit_ListState: 'loading',
  exhibit_ListMore: 'loading',
  exhibit_List: [],
  exhibit_PageError: '',
};

const themeInitStates: Pick<InformalNodeManagerPageModelState,
  'theme_ActivatingThemeName' |
  'theme_FilterKeywords' |
  'theme_ListState' |
  'theme_ListMore' |
  'theme_List' |
  'theme_PageError'> = {
  theme_ActivatingThemeName: '',
  theme_FilterKeywords: '',
  theme_ListState: 'loading',
  theme_ListMore: 'loading',
  theme_List: [],
  theme_PageError: '',
};

const ruleInitSates: Pick<InformalNodeManagerPageModelState,
  'rule_PageStatus' |
  // 'rule_Indeterminate' |
  // 'rule_IndeterminateChecked' |
  'rule_RuleList' |
  'rule_CodeInput' |
  'rule_CodeIsDirty' |
  'rule_PromptLeavePath' |
  'rule_CodeState' |
  'rule_CodeCompileErrors' |
  'rule_CodeExecutionErrors' |
  'rule_CodeEfficients'> = {
  rule_PageStatus: 'normal',
  // rule_Indeterminate: false,
  // rule_IndeterminateChecked: false,
  rule_RuleList: [],
  rule_CodeInput: '',
  rule_CodeIsDirty: false,
  rule_PromptLeavePath: '',
  rule_CodeState: 'editing',
  rule_CodeCompileErrors: [],
  rule_CodeExecutionErrors: [],
  rule_CodeEfficients: [],
};

const informalNodeManagerPageInitStates: InformalNodeManagerPageModelState = {

  showPage: 'exhibit',

  node_ID: -1,
  node_Name: '',
  node_Url: '',
  node_TestUrl: '',
  node_RuleText: '',
  node_AllRuleResult: null,
  node_RuleAllAddedResourceNames: [],
  node_RuleAllAddedObjectNames: [],

  addExhibitDrawer_Visible: false,

  replaceModal_Visible: false,
  replaceModal_Replacer_ResourceOptions: [
    { value: '!market', title: '资源市场' },
    { value: '!resource', title: '我的资源' },
    { value: '!collection', title: '我的收藏' },
  ],
  replaceModal_Replacer_BucketOptions: [],
  replaceModal_Replacer_Origin: '!market',
  replaceModal_Replacer_Keywords: '',
  replaceModal_Replacer_ResourceList: [],
  replaceModal_Replaced_Keywords: '',
  replaceModal_Replaced_DependencyTreeList: [],
  replaceModal_Replaced_SelectDependency: null,
  replaceModal_Replaced_TargetVersions: [],
  replaceModal_Replaced_TargetSelectedVersion: null,
  replaceModal_Replaced_TreeData: [],
  replaceModal_Replaced_CheckedKeys: [],

  ...exhibitInitStates,

  ...themeInitStates,

  ...ruleInitSates,
};

const Model: InformalNodeManagerPageModelType = {
  namespace: 'informalNodeManagerPage',
  state: informalNodeManagerPageInitStates,
  effects: {
    * onMountPage({}: OnMountPageAction, {}: EffectsCommandMap) {

    },
    * onUnmountPage({}: OnUnmountPageAction, {}: EffectsCommandMap) {

    },
    * onMountPageSider({ payload }: OnMountPageSiderAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_ID: payload.nodeID,
        },
      });

      yield put<FetchNodeInfoAction>({
        type: 'fetchNodeInfo',
      });
    },
    * onUnmountPageSider({}: OnUnmountPageSiderAction, {}: EffectsCommandMap) {

    },
    * onChangePage({ payload }: OnChangePageAction, { put }: EffectsCommandMap) {
      // console.log('onChangePage,9032hjkjadslkjflasd');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showPage: payload.value,
        },
      });
    },
    * onMountExhibitPage({}: OnMountExhibitPageAction, { select, put }: EffectsCommandMap) {
      yield put<FetchExhibitListAction>({
        type: 'fetchExhibitList',
        payload: {
          isRematch: true,
          isRestart: true,
        },
      });
    },
    * onUnmountExhibitPage({}: OnUnmountExhibitPageAction, { put }: EffectsCommandMap) {
      // console.log('onUnmountExhibitPage9823yhdkujshfkasjdf');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...exhibitInitStates,
        },
      });

    },

    * onMountThemePage({}: OnMountThemePageAction, { put }: EffectsCommandMap) {
      yield put<FetchThemeListAction>({
        type: 'fetchThemeList',
        payload: {
          isRematch: true,
        },
      });
    },
    * onUnmountThemePage({}: OnUnmountThemePageAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...themeInitStates,
        },
      });
    },
    * onMountRulePage({}: OnMountRulePageAction, { put }: EffectsCommandMap) {
      yield put<FetchRulesAction>({
        type: 'fetchRules',
      });
    },
    * onUnmountRulePage({}: OnUnmountRulePageAction, { put }: EffectsCommandMap) {
      window.onbeforeunload = null;
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...ruleInitSates,
        },
      });
    },
    * onPromptRulePageLeave({ payload }: OnPromptRulePageLeaveAction, { put }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rule_PromptLeavePath: payload.href,
        },
      });

    },
    * onConfirmRulePageLeave({}: OnConfirmRulePageLeaveAction, { select }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));
      router.push(informalNodeManagerPage.rule_PromptLeavePath);
    },
    * onCancelRulePageLeave({}: OnCancelRulePageLeaveAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rule_PromptLeavePath: '',
        },
      });
    },
    * fetchNodeInfo({}: FetchNodeInfoAction, { select, put, call }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const params: Parameters<typeof FServiceAPI.Node.details>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
      };

      const { data } = yield call(FServiceAPI.Node.details, params);

      // if (user.cookiesUserID !== data.ownerUserId) {
      if (FUtil.Tool.getUserIDByCookies() !== data.ownerUserId) {
        router.replace(FUtil.LinkTo.exception403({}));
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_Name: data.nodeName,
          node_Url: FUtil.Format.completeUrlByDomain(data.nodeDomain || ''),
          node_TestUrl: FUtil.Format.completeUrlByDomain('t.' + data.nodeDomain),
        },
      });
    },
    * fetchExhibitList({ payload: { isRematch = true, isRestart } }: FetchExhibitListAction, {
      call,
      select,
      put,
    }: EffectsCommandMap) {

      const { informalNodeManagerPage, nodes }: ConnectState = yield select(({
                                                                               informalNodeManagerPage,
                                                                               nodes,
                                                                             }: ConnectState) => ({
        informalNodeManagerPage,
        nodes,
      }));

      // if (!nodes.list || !nodes.list.some((n) => n.nodeId === informalNodeManagerPage.node_ID)) {
      //   return;
      // }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibit_ListMore: 'loading',
        },
      });

      const params2: RuleMatchStatusParams = {
        nodeID: informalNodeManagerPage.node_ID,
        isRematch: isRematch,
      };

      const { error, result } = yield call(ruleMatchStatus, params2);

      if (error) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            exhibit_PageError: error,
          },
        });
        return;
      }

      // console.log(data1, '2434234234234234');
      let list: InformalNodeManagerPageModelState['exhibit_List'] = [];
      if (!isRestart) {
        list = [
          ...informalNodeManagerPage.exhibit_List,
        ];
      }

      const params: Parameters<typeof FServiceAPI.InformalNode.testResources>[0] = {
        skip: list.length,
        limit: FUtil.Predefined.pageSize,
        // limit: 5,
        nodeId: informalNodeManagerPage.node_ID,
        onlineStatus: Number(informalNodeManagerPage.exhibit_SelectedStatus) as 2,
        omitResourceType: 'theme',
        resourceType: informalNodeManagerPage.exhibit_SelectedType === '-1' ? undefined : informalNodeManagerPage.exhibit_SelectedType,
        keywords: informalNodeManagerPage.exhibit_FilterKeywords || undefined,
      };

      const { data } = yield call(FServiceAPI.InformalNode.testResources, params);
      // console.log('###1111111111111');
      // console.log(result, 'result.ruleTextresult.ruleText2309482309');
      const { rules: rulesObj } = compile(result.ruleText);
      // console.log('###2222222222222');
      const exhibitList: InformalNodeManagerPageModelState['exhibit_List'] = [
        ...list,
        ...(data.dataList as any[]).map<InformalNodeManagerPageModelState['exhibit_List'][number]>((dl) => {
          const operations: string[] = dl.rules[0]?.operations || [];
          // console.log(operations, 'operations12334');
          const stateInfo = dl.stateInfo;

          const rulesObjRule = rulesObj.find((ro: any) => {
            // console.log(ro, dl, '#############***********;ojsifw389');
            return ro.exhibitName === dl.testResourceName;
          });

          const rule: InformalNodeManagerPageModelState['exhibit_List'][number]['rule'] = {
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
        }),
      ];

      // console.log('###3333333333333');
      const allAddRule = result.testRules.filter((tr: any) => {
        return tr.ruleInfo.operation === 'add';
      });

      const { state, more } = listStateAndListMore({
        list_Length: exhibitList.length,
        total_Length: data.totalItem,
        has_FilterCriteria: informalNodeManagerPage.exhibit_SelectedType === '-1'
          && informalNodeManagerPage.exhibit_SelectedStatus === '2'
          && informalNodeManagerPage.exhibit_FilterKeywords === '',
      });
      // console.log('###444444444444');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleText: result.ruleText,
          node_AllRuleResult: result.testRules,
          node_RuleAllAddedObjectNames: allAddRule.filter((tr: any) => {
            return tr.ruleInfo.candidate.type === 'object';
          }).map((tr: any) => {
            return tr.ruleInfo.candidate.name;
          }),
          node_RuleAllAddedResourceNames: allAddRule.filter((tr: any) => {
            return tr.ruleInfo.candidate.type === 'resource';
          }).map((tr: any) => {
            return tr.ruleInfo.candidate.name;
          }),
          // exhibitPageExhibitsTotal: data.totalItem,
          exhibit_List: exhibitList,
          exhibit_ListState: state,
          exhibit_ListMore: more,
        },
      });
    },
    * onClickExhibitsAddBtn({}: OnClickExhibitsAddBtnAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: { addExhibitDrawer_Visible: true },
      });
    },
    * onClickExhibitsReplaceBtn({}: OnClickExhibitsReplaceBtnAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: { replaceModal_Visible: true },
      });
    },
    * onChangeExhibitType({ payload }: OnChangeExhibitTypeAction, { put }: EffectsCommandMap) {

      // console.log('onChangeExhibitType 11111');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibit_SelectedType: payload.value,
        },
      });
      yield put<FetchExhibitListAction>({
        type: 'fetchExhibitList',
        payload: {
          isRematch: false,
          isRestart: true,
        },
      });
      // console.log('onChangeExhibitType 22222');

    },
    * onChangeExhibitStatus({ payload }: OnChangeExhibitStatusAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: { exhibit_SelectedStatus: payload.value as '0' },
      });
      yield put<FetchExhibitListAction>({
        type: 'fetchExhibitList',
        payload: {
          isRematch: false,
          isRestart: true,
        },
      });
    },
    * onChangeExhibitKeywords({ payload }: OnChangeExhibitKeywordsAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: { exhibit_FilterKeywords: payload.value },
      });
      yield put<FetchExhibitListAction>({
        type: 'fetchExhibitList',
        payload: {
          isRematch: false,
          isRestart: true,
        },
      });
    },
    * onLoadMoreExhibits({}: OnLoadMoreExhibitsAction, { put }: EffectsCommandMap) {
      yield put<FetchExhibitListAction>({
        type: 'fetchExhibitList',
        payload: {
          isRematch: false,
          isRestart: false,
        },
      });
    },


    * fetchThemeList({ payload: { isRematch = true, isRestart } }: FetchThemeListAction, {
      call,
      select,
      put,
    }: EffectsCommandMap) {

      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const params2: RuleMatchStatusParams = {
        nodeID: informalNodeManagerPage.node_ID,
        isRematch: isRematch,
      };

      const { error, result } = yield call(ruleMatchStatus, params2);

      if (error) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            theme_PageError: error,
          },
        });
        return;
      }

      const params: Parameters<typeof FServiceAPI.InformalNode.testResources>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
        onlineStatus: 2,
        resourceType: 'theme',
        limit: FUtil.Predefined.pageSize,
        keywords: informalNodeManagerPage.theme_FilterKeywords || undefined,
      };
      const { data } = yield call(FServiceAPI.InformalNode.testResources, params);
      // console.log(data, '890234ujndlskfl;asd@@@@1111111');

      const activatedTheme: string | null = data.dataList.find((dd: any) => {
        return dd.stateInfo.themeInfo.ruleId !== 'default';
      })?.testResourceName || null;

      // console.log(activatedTheme, 'activatedTheme0923jldskv90zpasdf');
      const { rules: rulesObj } = compile(result.ruleText);
      // console.log(rulesObj, 'rulesObjiosfjewwef');

      const themePageThemeList: InformalNodeManagerPageModelState['theme_List'] = (data.dataList as any[]).map<InformalNodeManagerPageModelState['theme_List'][number]>((dl) => {
        const operations: string[] = dl.rules[0]?.operations || [];
        // console.log(operations, 'operations12334');
        const stateInfo = dl.stateInfo;

        const rulesObjRule = rulesObj.find((ro: any) => {
          // console.log(ro, dl, '98uwi@#DSAFUHJ(*)hjkljl');
          return ro.exhibitName === dl.testResourceName;
        });

        // operations.map<InformalNodeManagerPageModelState['exhibitList'][number]['rules'][number]>((o) => {
        const rule: InformalNodeManagerPageModelState['theme_List'][number]['rule'] = {
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
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleText: result.ruleText,
          // themePageThemesTotal: data.totalItem,
          theme_List: themePageThemeList,
          theme_ListState: themePageThemeList.length > 0
            ? 'loaded'
            : informalNodeManagerPage.theme_FilterKeywords === ''
              ? 'noData'
              : 'noSearchResult',
        },
      });
    },
    * onClickThemesAddBtn({}: OnClickThemesAddBtnAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitDrawer_Visible: true,
        },
      });
    },
    * onClickThemesReplaceBtn({}: OnClickThemesReplaceBtnAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: { replaceModal_Visible: true },
      });
    },
    * onChangeThemeKeywords({ payload }: OnChangeThemeKeywordsAction, { put }: EffectsCommandMap) {
      yield put({
        type: 'change',
        payload: { themePageFilterKeywords: payload.value },
      });

      yield put<FetchThemeListAction>({
        type: 'fetchThemeList',
        payload: {
          isRestart: true,
          isRematch: false,
        },
      });
    },
    * onLoadMoreThemes({}: OnLoadMoreThemesAction, { put }: EffectsCommandMap) {
      yield put<FetchExhibitListAction>({
        type: 'fetchExhibitList',
        payload: {
          isRematch: false,
          isRestart: false,
        },
      });
    },
    * onClickActiveThemeBtn({ payload }: OnClickActiveThemeBtnAction, { select, put }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      // console.log(payload, 'payload0923u4rjlksfdjflk');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          theme_ActivatingThemeName: payload.themeName,
        },
      });

      const { rules }: { rules: any[] } = compile(informalNodeManagerPage.node_RuleText);
      // console.log(rules, 'rules1234234');
      const rule = rules.find((r) => r.themeName);

      let data;

      if (rule) {
        data = rules.map((r) => {
          if (!r.themeName) {
            return r;
          }
          return {
            ...r,
            themeName: payload.themeName,
          };
        });
      } else {
        data = [
          {
            operation: 'activate_theme',
            themeName: payload.themeName,
          },
          ...rules,
        ];
      }

      yield put<SaveDataRulesAction>({
        type: 'saveDataRules',
        payload: {
          type: 'replace',
          data: data,
        },
      });
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          theme_List: informalNodeManagerPage.theme_List.map((ttt) => {
            if (ttt.name !== payload.themeName) {
              return {
                ...ttt,
                isOnline: false,
              };
            }
            return {
              ...ttt,
              isOnline: true,
            };
          }),
        },
      });
    },

    * fetchRules({}: FetchRulesAction, { call, select, put }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const params: Parameters<typeof FServiceAPI.InformalNode.testNodeRules>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
      };

      const { data } = yield call(FServiceAPI.InformalNode.testNodeRules, params);
      // console.log(data, 'data!!!!!@#$@#$@#$');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rule_CodeInput: data.ruleText,
          rule_CodeIsDirty: false,
          // rule_Indeterminate: false,
          // rule_IndeterminateChecked: false,
          rule_RuleList: data.testRules.map((tr: any) => {
            return {
              ...tr,
              checked: false,
            };
          }),
          rule_CodeExecutionErrors: [],
          rule_CodeEfficients: [],
        },
      });
    },
    * saveRules({}: SaveRulesAction, { select, call, put }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rule_CodeState: 'checking',
        },
      });

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
        testRuleText: informalNodeManagerPage.rule_CodeInput,
      };
      const { data } = yield call(FServiceAPI.InformalNode.createRules, params);
      // console.log(data, 'data092u3jo4kj23l4kjl');

      const params1: RuleMatchStatusParams = {
        nodeID: informalNodeManagerPage.node_ID,
      };
      const { error, result } = yield call(ruleMatchStatus, params1);

      // console.log(data1, 'data1!@#$!@#$@#');

      const rule_CodeExecutionErrors: InformalNodeManagerPageModelState['rule_CodeExecutionErrors'] = result.testRules
        .filter((tr: any) => {
          return tr.matchErrors.length > 0;
        })
        .map((tr: any) => {
          return {
            ruleText: tr.ruleInfo.text,
            errors: tr.matchErrors,
          };
        });

      const rule_CodeEfficients: InformalNodeManagerPageModelState['rule_CodeEfficients'] = result.testRules
        .filter((tr: any) => {
          return tr.efficientInfos.length > 0;
        })
        .map((tr: any) => {
          return {
            ruleText: tr.ruleInfo.text,
            matchCount: tr.efficientInfos.reduce((accumulator: number, currentValue: any) => {
              // console.log(accumulator, currentValue, currentIndex)
              return accumulator + currentValue.count;
            }, 0),
          };
        });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleText: result.ruleText,
          rule_CodeIsDirty: false,
          rule_CodeState: rule_CodeExecutionErrors.length === 0 ? 'noError' : 'executionError',
          rule_CodeExecutionErrors: rule_CodeExecutionErrors,
          rule_CodeEfficients: rule_CodeEfficients,
          rule_RuleList: result.testRules.map((tr: any) => {
            return {
              ...tr,
              checked: false,
            };
          }),
        },
      });
    },

    * saveDataRules({ payload }: SaveDataRulesAction, { call, select, put }: EffectsCommandMap) {

      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const text = decompile(payload.data);
      // console.log(text, 'text1234fklsadj');

      if (payload.type === 'append') {
        const params: Parameters<typeof FServiceAPI.InformalNode.putRules>[0] = {
          nodeId: informalNodeManagerPage.node_ID,
          additionalTestRule: text,
        };
        const { data } = yield call(FServiceAPI.InformalNode.putRules, params);
      } else if (payload.type === 'replace') {
        const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
          nodeId: informalNodeManagerPage.node_ID,
          testRuleText: text,
        };
        const { data } = yield call(FServiceAPI.InformalNode.createRules, params);
      }

      const params2: RuleMatchStatusParams = {
        nodeID: informalNodeManagerPage.node_ID,
        isRematch: true,
      };

      const { error, result } = yield call(ruleMatchStatus, params2);

      if (error) {
        return;
      }

      const codeExecutionError = result.testRules
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

      if (informalNodeManagerPage.showPage === 'exhibit') {
        yield put<FetchExhibitListAction>({
          type: 'fetchExhibitList',
          payload: {
            isRematch: false,
          },
        });
      } else if (informalNodeManagerPage.showPage === 'theme') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            theme_ActivatingThemeName: '',
          },
        });
        yield put<FetchThemeListAction>({
          type: 'fetchThemeList',
          payload: {
            isRematch: false,
          },
        });
      }
    },
    * onLoad_Rule_ImportFileInput({ payload }: OnLoad_Rule_ImportFileInput_Action, { put, select }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      yield put({
        type: 'change',
        payload: {
          rulePageCodeInput: payload.value + '\n' + informalNodeManagerPage.rule_CodeInput,
          rulePageStatus: 'coding',
          rulePageCodeIsDirty: true,
          rulePageCodeCompileErrors: null,
          rulePageCodeExecutionError: null,
          rulePageCodeSaveSuccess: false,
        },
      });
    },
    * onClick_Rule_ExportBtn({}: OnClick_Rule_ExportBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rule_PageStatus: 'export',
        },
      });
    },
    * onClick_Rule_Export_ConfirmBtn({}: OnClick_Rule_Export_ConfirmBtn_Action, { select }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const fileName = `测试节点${informalNodeManagerPage.node_Name} - 映射规则 - ${moment().format(FUtil.Predefined.momentDateFormat)}.txt`;
      const text: string = informalNodeManagerPage.rule_RuleList
        .filter((rl) => rl.checked)
        .map((rl) => {
          return rl.ruleInfo.text;
        })
        .join('\n\n');
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      FileSaver.saveAs(blob, fileName);
    },
    * onClick_Rule_Export_CancelBtn({}: OnClick_Rule_Export_CancelBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rule_PageStatus: 'normal',
        },
      });
    },
    * onClick_Rule_DeleteBtn({}: OnClick_Rule_DeleteBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rule_PageStatus: 'delete',
        },
      });
    },
    * onClick_Rule_Delete_ConfirmBtn({}: OnClick_Rule_Delete_ConfirmBtn_Action, { select, put }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const text: string = informalNodeManagerPage.rule_RuleList
        .filter((rl) => !rl.checked)
        .map((rl) => {
          return rl.ruleInfo.text;
        })
        .join('\n\n');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rule_CodeInput: text,
        },
      });
      yield put<SaveRulesAction>({
        type: 'saveRules',
      });
    },
    * onClick_Rule_Delete_CancelBtn({}: OnClick_Rule_Delete_CancelBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rule_PageStatus: 'normal',
        },
      });
    },
    * onClick_Rule_EntryCodingBtn({}: OnClick_Rule_EntryCodingBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rule_PageStatus: 'coding',
        },
      });
    },
    * onClick_Rule_ExitCodingBtn({}: OnClick_Rule_ExitCodingBtn_Action, { put, select }: EffectsCommandMap) {

      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rule_PageStatus: 'normal',

          rule_CodeInput: informalNodeManagerPage.node_RuleText,
          rule_CodeIsDirty: false,
          rule_CodeState: 'editing',
          rule_CodeCompileErrors: [],
          rule_CodeExecutionErrors: [],
          rule_CodeEfficients: [],
        },
      });
    },
    * onClick_Rule_ExitCoding_ConfirmBtn({}: OnClick_Rule_ExitCoding_ConfirmBtn_Action, {
      put,
      select,
    }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rule_PageStatus: 'normal',

          rule_CodeInput: informalNodeManagerPage.node_RuleText,
          rule_CodeIsDirty: false,
          rule_CodeState: 'editing',
          rule_CodeCompileErrors: [],
          rule_CodeExecutionErrors: [],
          rule_CodeEfficients: [],
        },
      });
    },
    * onClick_Rule_ExitCoding_CancelBtn({}: OnClick_Rule_ExitCoding_CancelBtn_Action, {}: EffectsCommandMap) {

    },
    * OoChange_Rule_CheckAllCheckbox({ payload }: OnChange_Rule_CheckAllCheckbox_Action, {
      put,
      select,
    }: EffectsCommandMap) {
      // console.log(payload, 'payloadpayloadpayload89234uoijdhflkasdf');
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // rule_Indeterminate: false,
          // rule_IndeterminateChecked: payload.checked,
          rule_RuleList: informalNodeManagerPage.rule_RuleList.map((rpr) => {
            return {
              ...rpr,
              checked: payload.checked,
            };
          }),
        },
      });
    },
    * onChange_Rule_ListCheckbox({ payload }: OnChange_Rule_ListCheckbox_Action, { put, select }: EffectsCommandMap) {
      // console.log(payload, 'payload09823u4oi32kj');
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const rulePageRuleList: InformalNodeManagerPageModelState['rule_RuleList'] = informalNodeManagerPage.rule_RuleList.map((rl) => {
        if (rl.id !== payload.ruleID) {
          return rl;
        }
        return {
          ...rl,
          checked: payload.checked,
        };
      });
      let ruleIndeterminateChecked: boolean = false;

      if (rulePageRuleList.every((rp) => {
        return rp.checked;
      })) {
        ruleIndeterminateChecked = true;
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // rule_IndeterminateChecked: ruleIndeterminateChecked,
          // rule_Indeterminate: !(rulePageRuleList.every((rp) => {
          //   return !rp.checked;
          // }) || rulePageRuleList.every((rp) => {
          //   return rp.checked;
          // })),
          rule_RuleList: rulePageRuleList,
        },
      });
    },
    * onChange_Rule_Codemirror({ payload }: OnChange_Rule_Codemirror_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rule_CodeInput: payload.value,
          rule_CodeIsDirty: true,
          rule_CodeState: 'editing',
          rule_CodeCompileErrors: [],
          rule_CodeExecutionErrors: [],
          rule_CodeEfficients: [],
        },
      });
    },
    * onClick_Rule_SaveBtn({}: OnClick_Rule_SaveBtn_Action, { select, put }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const { errors, rules, errorObjects } = compile(informalNodeManagerPage.rule_CodeInput);
      // console.log(errorObjects, 'errorObjects234234');
      if (errorObjects.length > 0) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rule_CodeCompileErrors: errorObjects,
            rule_CodeState: 'compileError',
          },
        });
        return;
      }
      // console.log('onClick_Rule_SaveBtn', '@#$@#$90u3o4ijlk');
      yield put<SaveRulesAction>({
        type: 'saveRules',
      });
    },

    * onCancel_AddExhibitDrawer({}: OnCancel_AddExhibitDrawer_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitDrawer_Visible: false,
        },
      });
    },
    * onConfirm_AddExhibitDrawer({ payload }: OnConfirm_AddExhibitDrawer_Action, { put }: EffectsCommandMap) {
      // const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
      //   informalNodeManagerPage,
      // }));

      const value: { identity: 'resource' | 'object'; names: string[]; } = {
        identity: payload.identity,
        names: payload.names,
      };
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitDrawer_Visible: false,
        },
      });
      yield put<SaveDataRulesAction>({
        type: 'saveDataRules',
        payload: {
          type: 'append',
          data: value.names.map((n) => {
            return {
              operation: 'add',
              exhibitName: n.split('/')[1] + `_${FUtil.Tool.generateRandomCode()}`,
              candidate: {
                name: n,
                versionRange: 'latest',
                type: value.identity,
              },
            };
          }),
        },
      });
      yield put<FetchExhibitListAction>({
        type: 'fetchExhibitList',
        payload: {
          isRematch: false,
        },
      });
    },

    * onReplacerMount({}: OnReplacerMountAction, { put, call }: EffectsCommandMap) {
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

      const { data } = yield call(FServiceAPI.Storage.bucketList, params);
      // console.log(data, '!@#$!@#$#$!@111111111');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModal_Replacer_BucketOptions: (data as any[]).map<InformalNodeManagerPageModelState['replaceModal_Replacer_BucketOptions'][number]>((d: any) => {
            return {
              value: d.bucketName,
              title: d.bucketName,
            };
          }),
        },
      });
    },
    * onReplacerUnmount({}: OnReplacerUnmountAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModal_Replacer_ResourceOptions: [
            { value: '!market', title: '资源市场' },
            { value: '!resource', title: '我的资源' },
            { value: '!collection', title: '我的收藏' },
          ],
          replaceModal_Replacer_BucketOptions: [],
          replaceModal_Replacer_Origin: '!market',
          replaceModal_Replacer_Keywords: '',
          replaceModal_Replacer_ResourceList: [],
        },
      });
    },
    * onReplacerOriginChange({ payload }: OnReplacerOriginChangeAction, { put, select }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModal_Replacer_Origin: payload.value,
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
    * onReplacerKeywordsChange({ payload }: OnReplacerKeywordsChangeAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModal_Replacer_Keywords: payload.value,
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
    * fetchReplacerList({ payload }: FetchReplacerListAction, { select, call, put }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const payloadOrigin: string = payload.origin !== undefined ? payload.origin : informalNodeManagerPage.replaceModal_Replacer_Origin;
      const payloadKeywords: string = payload.keywords !== undefined ? payload.keywords : informalNodeManagerPage.replaceModal_Replacer_Keywords;

      let replacerResourceList: InformalNodeManagerPageModelState['replaceModal_Replacer_ResourceList'] = [];

      if (!payload.restart) {
        replacerResourceList = [
          ...informalNodeManagerPage.replaceModal_Replacer_ResourceList,
        ];
      }

      if (payloadOrigin === '!market') {

        const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
          skip: replacerResourceList.length,
          limit: FUtil.Predefined.pageSize,
          keywords: payloadKeywords,
        };

        const { data } = yield call(FServiceAPI.Resource.list, params);

        replacerResourceList = [
          ...replacerResourceList,
          ...(data.dataList as any[]).map<InformalNodeManagerPageModelState['replaceModal_Replacer_ResourceList'][number]>((rs) => {
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
        const { data } = yield call(FServiceAPI.Resource.list, params);
        // console.log(data, 'data13453');
        replacerResourceList = [
          ...replacerResourceList,
          ...(data.dataList as any[]).map<InformalNodeManagerPageModelState['replaceModal_Replacer_ResourceList'][number]>((rs) => {
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

        const { data } = yield call(FServiceAPI.Collection.collectionResources, params);
        // console.log(data, '@@@@@@ASEDFSADF');

        let data3 = [];

        if (data.dataList.length > 0) {
          const params2: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
            resourceIds: data.dataList.map((dl: any) => {
              return dl.resourceId;
            }).join(),
          };

          const { data: data2 } = yield call(FServiceAPI.Resource.batchInfo, params2);

          data3 = data2;
        }

        replacerResourceList = [
          ...replacerResourceList,
          ...(data3 as any[]).map<InformalNodeManagerPageModelState['replaceModal_Replacer_ResourceList'][number]>((rs) => {
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
        ];

      } else {
        const params: Parameters<typeof FServiceAPI.Storage.objectList>[0] = {
          skip: 0,
          limit: FUtil.Predefined.pageSize,
          bucketName: payloadOrigin,
          keywords: payloadKeywords,
        };

        const { data } = yield call(FServiceAPI.Storage.objectList, params);
        // console.log(data, 'data1q2349ojmdfsl');
        replacerResourceList = [
          ...replacerResourceList,
          ...(data.dataList as any[]).map<InformalNodeManagerPageModelState['replaceModal_Replacer_ResourceList'][number]>((ob) => {
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
          replaceModal_Replacer_ResourceList: replacerResourceList,
        },
      });

    },
    * onReplacerListCheckedChange({ payload }: OnReplacerListCheckedChangeAction, { select, put }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModal_Replacer_ResourceList: informalNodeManagerPage.replaceModal_Replacer_ResourceList.map<InformalNodeManagerPageModelState['replaceModal_Replacer_ResourceList'][number]>((rr) => {
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
    * onReplacerListVersionRangeChange({ payload }: OnReplacerListVersionRangeChangeAction, {
      put,
      select,
    }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModal_Replacer_ResourceList: informalNodeManagerPage.replaceModal_Replacer_ResourceList.map<InformalNodeManagerPageModelState['replaceModal_Replacer_ResourceList'][number]>((rr) => {
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
    * onReplacedUnmount({}: OnReplacedUnmountAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModal_Replaced_Keywords: '',
          replaceModal_Replaced_DependencyTreeList: [],
          replaceModal_Replaced_SelectDependency: null,
          replaceModal_Replaced_TargetVersions: [],
          replaceModal_Replaced_TargetSelectedVersion: null,
          replaceModal_Replaced_TreeData: [],
          replaceModal_Replaced_CheckedKeys: [],
        },
      });
    },
    * onReplacedKeywordChange({ payload }: OnReplacedKeywordChangeAction, { put, select, call }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const payloadValue: string = payload.value;

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModal_Replaced_Keywords: payloadValue,
        },
      });

      const params: Parameters<typeof FServiceAPI.InformalNode.dependencyTree>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
        keywords: payloadValue,
        resourceType: informalNodeManagerPage.showPage === 'theme' ? 'theme' : undefined,
        omitResourceType: informalNodeManagerPage.showPage === 'theme' ? undefined : 'theme',
      };

      const { data } = yield call(FServiceAPI.InformalNode.dependencyTree, params);
      // console.log(data, '##@ADSFASDFSDCX');

      let replacedSelectDependency = data.find((d: any) => d.name === payloadValue);
      // console.log(replacedSelectDependency, 'replacedSelectDependency#$FDS_)+(Ujoi');

      const replacedTargetVersions: InformalNodeManagerPageModelState['replaceModal_Replaced_TargetVersions'] = replacedSelectDependency
        ? [
          { value: '', text: '全部版本' },
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
          replaceModal_Replaced_DependencyTreeList: data?.map((d: any) => d.name) || [],
          replaceModal_Replaced_SelectDependency: replacedSelectDependency || null,
          replaceModal_Replaced_TargetVersions: replacedTargetVersions,
          replaceModal_Replaced_TargetSelectedVersion: replacedTargetVersions.length > 0 ? replacedTargetVersions[0] : null,
        },
      });

      if (!replacedSelectDependency) {
        return;
      }

      const params3: Parameters<typeof FServiceAPI.InformalNode.searchTestResourcesByDependency>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
        dependentEntityId: replacedSelectDependency.id,
        resourceType: informalNodeManagerPage.showPage === 'theme' ? 'theme' : undefined,
        omitResourceType: informalNodeManagerPage.showPage === 'theme' ? undefined : 'theme',
      };
      const { data: data3 } = yield call(FServiceAPI.InformalNode.searchTestResourcesByDependency, params3);
      // console.log(data3, 'data3data3data3data3data3data3data309789079877897989797');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModal_Replaced_TreeData: (data3 as any[]).map<InformalNodeManagerPageModelState['replaceModal_Replaced_TreeData'][number]>((d: any) => {
            return {
              key: `${FUtil.Tool.generateRandomCode()}:${d.testResourceName}`,
              id: d.testResourceId,
              title: `${d.entityName}(${d.testResourceName})`,
            };
          }),
          replaceModal_Replaced_CheckedKeys: [],
        },
      });
    },
    * onReplacedEntityVersionChange({ payload }: OnReplacedEntityVersionChangeAction, {
      select,
      call,
      put,
    }: EffectsCommandMap) {

      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      if (!informalNodeManagerPage.replaceModal_Replaced_SelectDependency) {
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModal_Replaced_TargetSelectedVersion: informalNodeManagerPage.replaceModal_Replaced_TargetVersions.find((rtv) => {
            return rtv.value === payload.value;
          }) || null,
        },
      });

      const params3: Parameters<typeof FServiceAPI.InformalNode.searchTestResourcesByDependency>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
        dependentEntityId: informalNodeManagerPage.replaceModal_Replaced_SelectDependency.id,
        resourceType: informalNodeManagerPage.showPage === 'theme' ? 'theme' : undefined,
        omitResourceType: informalNodeManagerPage.showPage === 'theme' ? undefined : 'theme',
        dependentEntityVersionRange: payload.value || undefined,
      };
      const { data: data3 } = yield call(FServiceAPI.InformalNode.searchTestResourcesByDependency, params3);
      // console.log(data3, 'data3data3data3data3data3data3data309789079877897989797');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModal_Replaced_TreeData: (data3 as any[]).map<InformalNodeManagerPageModelState['replaceModal_Replaced_TreeData'][number]>((d: any) => {
            return {
              key: `${FUtil.Tool.generateRandomCode()}:${d.testResourceName}`,
              id: d.testResourceId,
              title: `${d.entityName}(${d.testResourceName})`,
            };
          }),
          replaceModal_Replaced_CheckedKeys: [],
        },
      });
    },
    * onReplacedTreeLoadData({ payload }: OnReplacedTreeLoadDataAction, { select, put, call }: EffectsCommandMap) {

      // console.log(payload, 'payloadpayloadpayloadpayloadpayloadpayload!!!!!!@@@@@@@#3333333');

      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      if (payload.pos.split('-').length !== 2) {
        return;
      }
      const params: Parameters<typeof FServiceAPI.InformalNode.dependencyTreeFilter>[0] = {
        testResourceId: payload.id,
        dependentEntityId: informalNodeManagerPage.replaceModal_Replaced_SelectDependency?.id || '',
        dependentEntityVersionRange: informalNodeManagerPage.replaceModal_Replaced_TargetSelectedVersion?.value || undefined,
      };
      const { data } = yield call(FServiceAPI.InformalNode.dependencyTreeFilter, params);
      // console.log(data, 'dependencyTreeFilter!@#$@!#$@#$@#$');
      const result = updateTreeData({
        list: informalNodeManagerPage.replaceModal_Replaced_TreeData as TreeNode[],
        key: payload.key,
        children: organizeData(data[0].dependencies, payload.key),
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModal_Replaced_TreeData: result,
        },
      });
    },
    * onReplaceModalCancel({}: OnReplaceModalCancelAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModal_Visible: false,
        },
      });
    },
    * onReplaceModalConfirm({}: OnReplaceModalConfirmAction, { select, put }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const simplifiedResults: string[][] = simplifiedRelationship(informalNodeManagerPage.replaceModal_Replaced_CheckedKeys)
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
            };
          } else {
            return {
              name: o.replace('#', ''),
              type: 'object',
              versionRange: 'latest',
            };
          }
        }));
      }
      // console.log(resultObj, 'resultObj@#AFDSFASD)(_&UOIJ:');

      const replacerData = informalNodeManagerPage.replaceModal_Replacer_ResourceList.find((rr) => {
        // return rr.name === informalNodeManagerPage.replacerCheckedResourceName;
        return rr.checked;
      });
      // console.log(replacerData, 'replacerData234edf@#$SDF)(JLK');
      const results: IConfirmValue = [];
      for (const [exhibitName, scopes] of Object.entries(resultObj)) {
        results.push({
          exhibitName: exhibitName,
          replaced: {
            name: informalNodeManagerPage.replaceModal_Replaced_SelectDependency?.name || '',
            versionRange: informalNodeManagerPage.replaceModal_Replaced_TargetSelectedVersion?.value || 'latest',
            type: informalNodeManagerPage.replaceModal_Replaced_SelectDependency?.type || 'object',
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

      const rules: any[] = informalNodeManagerPage.node_AllRuleResult.map((rr: any) => {
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
            replaces: [v],
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
          replaceModal_Visible: false,
        },
      });
    },
  },
  reducers: {
    change(state, { payload }) {
      // const newState = {...state};
      // if (payload.replacedCheckedKeys && payload.replacedCheckedKeys.length === 0 && state.replacerResourceList.some((rr) => rr.checked)) {
      //
      // }
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({}) {

    },
  },
};

export default Model;

interface RuleMatchStatusParams {
  nodeID: number;
  isRematch?: boolean;
}

async function ruleMatchStatus({ nodeID, isRematch = false }: RuleMatchStatusParams): Promise<{
  error: string | null;
  result?: any;
}> {
  // const params: RulesRematchParamsType = {
  //   nodeId: nodeID,
  // };

  if (isRematch) {
    const { errCode, data } = await FServiceAPI.InformalNode.rulesRematch({ nodeId: nodeID });
    if (errCode !== 0 || !data) {
      return {
        error: '匹配失败',
      };
    }
  }

  while (true) {
    const response = await FServiceAPI.InformalNode.testNodeRules({ nodeId: nodeID });
    // console.log(response, 'response1234');
    if (response.data.status === 1) {
      await sleep();
    } else {
      if (response.data.status === 2) {
        return {
          error: '匹配失败',
        };
      }
      return {
        error: null,
        result: response.data,
      };
    }
  }

  function sleep(ms: number = 200): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
}

// interface GetUsedTargetIDsParams {
//   nodeID: number;
//   entityType: 'resource' | 'object';
//   entityIds: string[];
// }
//
// async function getUsedTargetIDs({ nodeID, entityType, entityIds }: GetUsedTargetIDsParams): Promise<string[]> {
//   if (entityIds.length === 0) {
//     return [];
//   }
//
//   const params1: Parameters<typeof FServiceAPI.InformalNode.batchTestResources>[0] = {
//     nodeId: nodeID,
//     entityType: entityType,
//     entityIds: entityIds.join(),
//   };
//
//   const { data } = await FServiceAPI.InformalNode.batchTestResources(params1);
//
//   // console.log(data, 'data98jhksjkdaf13453');
//   return (data as any[]).map<string>((d1: any) => {
//     return d1.originInfo.id;
//   });
// }

interface UpdateTreeDataParams {
  list: TreeNode[];
  key: React.Key;
  children: TreeNode[];
}

function updateTreeData({ list, key, children }: UpdateTreeDataParams): TreeNode[] {
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
