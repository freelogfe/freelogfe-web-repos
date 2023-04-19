import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import { history } from 'umi';
import moment from 'moment';
import FileSaver from 'file-saver';
import { listStateAndListMore } from '@/components/FListFooter';
import { mergeRules } from '@/models/informExhibitInfoPage';
import { OperationAndActionRecords } from '@/type/InformalNodeTypes';
import fMessage from '@/components/fMessage';
// import FUtil1 from '@/utils';

const { decompile, compile } = require('@freelog/nmr_translator');

const resource_TypeData = [
  { value: '插件', parentValue: '#' },
  { value: '阅读', parentValue: '#' },
  { value: '音频', parentValue: '#' },
  { value: '图片', parentValue: '#' },
  { value: '视频', parentValue: '#' },
  { value: '游戏', parentValue: '#' },
  { value: '文章', parentValue: '阅读' },
  { value: '演示文稿', parentValue: '阅读' },
  { value: '音效', parentValue: '音频' },
  { value: '音乐', parentValue: '音频' },
  { value: '播客节目', parentValue: '音频' },
  { value: '照片', parentValue: '图片' },
  { value: '插画', parentValue: '图片' },
  { value: '动态影像', parentValue: '视频' },
  { value: '实拍片段', parentValue: '视频' },
  { value: '短视频', parentValue: '视频' },
  { value: '长视频', parentValue: '视频' },
  { value: '红白机', parentValue: '游戏' },
] as const;

interface ICandidate {
  name: string;
  versionRange?: string;
  type: 'resource' | 'object';
}

export interface IExhibit {
  testResourceId: string;
  testResourceName: string;
  associatedPresentableId: string;
  originInfo: {
    id: string;
    name: string;
    resourceType: string[];
    type: 'resource' | 'object';
    version: string; // 测试资源引用的实体版本
    versionRange: string; // 测试资源引用的实体版本范围
    versions: string[]; // 测试资源的所有版本
  };
  stateInfo: {
    coverInfo: {
      coverImages: string[];
      ruleId: 'default' | string;
    };
    onlineStatusInfo: {
      ruleId: 'default' | string;
      onlineStatus: 0 | 1;
    };
    propertyInfo: {
      ruleId: 'default' | string;
      testResourceProperty: {
        remark: string;
        key: string;
        value: string | number;
        isRuleSet?: true;
      }[];
    };
    replaceInfo: {
      rootResourceReplacer: null;
      replaceRecords: {
        replaced: {
          id: string;
          name: string;
          type: 'resource' | 'object';
          version: string;
        };
        replacer: {
          id: string;
          name: string;
          type: 'resource' | 'object';
          version: string;
        };
        scopes?: ICandidate[][];
      }[];
      ruleId: 'default' | string;
    };
    tagInfo: {
      tags: string[];
      ruleId: 'default' | string;
    };
    themeInfo: {
      isActivatedTheme: 0 | 1;
      ruleId: 'default' | string;
    };
    titleInfo: {
      title: string;
      ruleId: 'default' | string;
    };
  };
  rules: {
    operations: Array<'add' | 'alter' | 'set_labels' | 'online' | 'set_title' | 'set_cover' | 'add_attr' | 'delete_attr' | 'replace' | 'activate_theme'>;
    ruleId: string;
  }[];
  operationAndActionRecords: OperationAndActionRecords;
  isAuth?: boolean;
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

export interface IActions {
  comment: {
    text: string;
    operation: 'comment';
    errorMsg?: string;
    warningMsg?: string;
  };
  set_labels: {
    operation: 'set_labels';
    content: string[];
    errorMsg?: string;
    warningMsg?: string;
  };
  replace: {
    operation: 'replace';
    content: {
      replaced: {
        name: string;
        versionRange: string;
        type: 'resource' | 'object';
      };
      replacer: {
        name: string;
        versionRange: string;
        type: 'resource' | 'object';
      },
      scopes: {
        name: string;
        versionRange: string;
        type: 'resource' | 'object';
      }[][];
    };
    errorMsg?: string;
    warningMsg?: string;
  };
  online: {
    operation: 'online';
    content: boolean;
    errorMsg?: string;
    warningMsg?: string;
  };
  set_title: {
    operation: 'set_title';
    content: string;
    errorMsg?: string;
    warningMsg?: string;
  };
  set_cover: {
    operation: 'set_cover';
    content: string;
    errorMsg?: string;
    warningMsg?: string;
  };
  add_attr: {
    operation: 'add_attr';
    content: {
      key: string;
      value: string;
      description: string;
    };
    errorMsg?: string;
    warningMsg?: string;
  };
  delete_attr: {
    operation: 'delete_attr';
    content: {
      key: string;
    };
    errorMsg?: string;
    warningMsg?: string;
  };
}

export interface IRules {
  comment: {
    operation: 'comment';
    text: string;
  };
  add: {
    operation: 'add';
    exhibitName: string;
    candidate: {
      name: string;
      versionRange: string;
      type: 'resource' | 'object';
    };
    actions: Array<IActions['comment']
      | IActions['set_labels']
      | IActions['replace']
      | IActions['online']
      | IActions['set_title']
      | IActions['set_cover']
      | IActions['add_attr']
      | IActions['delete_attr']>;
    text: string;
    errorMsg?: string;
    warningMsg?: string;
  };
  alter: {
    operation: 'alter';
    exhibitName: string;
    actions: Array<IActions['comment']
      | IActions['set_labels']
      | IActions['replace']
      | IActions['online']
      | IActions['set_title']
      | IActions['set_cover']
      | IActions['add_attr']
      | IActions['delete_attr']>;
    text: string;
    errorMsg?: string;
    warningMsg?: string;
  };
  activate_theme: {
    operation: 'activate_theme'
    exhibitName: string;
    text: string;
    errorMsg?: string;
    warningMsg?: string;
  };
}

export interface InformalNodeManagerPageModelState {
  showPage: 'exhibit' | 'theme' | 'mappingRule';

  node_ID: number;
  node_Name: string;
  node_Url: string;
  node_TestUrl: string;
  node_RuleInfo: null | RuleMatchAndResultReturn;

  addExhibitDrawer_Visible: boolean;
  addThemeDrawer_Visible: boolean;

  replaceModal_Visible: boolean;
  replaceModal_Replacer_ResourceOptions: {
    value: InformalNodeManagerPageModelState['replaceModal_Replacer_Origin'];
    title: string;
  }[];
  replaceModal_Replacer_Origin: 'market' | 'resource' | 'collection' | 'object';
  replaceModal_Replacer_BucketOptions: {
    value: string;
    text: string;
  }[];
  replaceModal_Replacer_Bucket: string;

  replaceModal_Replacer_Keywords: string;
  replaceModal_Replacer_ResourceList: {
    checked: boolean;
    disabled?: boolean;
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

  replaceModal_Errors: string[];

  // exhibit_TypeOptions1: { value: string; text: string; }[];
  // exhibit_TypeOptions2: { value: string; text: string; }[];
  // exhibit_SelectedType1: '-1' | string;
  // exhibit_SelectedType2: '-1' | string;
  exhibit_ResourceTypeCodes: {
    value: string;
    label: string;
    values: string[];
    labels: string[];
  };
  exhibit_StatusOptions: { value: string; text: string; }[];
  exhibit_SelectedStatus: '0' | '1' | '2';
  exhibit_FilterKeywords: string;
  exhibit_ListState: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  exhibit_ListMore: 'loading' | 'andMore' | 'noMore';
  exhibit_List: IExhibit[];
  exhibit_ListTotal: number;
  exhibit_PageError: string;

  theme_ActivatingThemeName: string;
  theme_FilterKeywords: string;
  theme_ListState: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  theme_ListMore: 'loading' | 'andMore' | 'noMore';
  theme_List: IExhibit[];
  theme_PageError: string;

  rule_PageStatus: 'normal' | 'export' | 'delete' | 'coding';
  rule_RuleList: {
    id: string;
    checked: boolean;
    matchErrors: string[];
    ruleInfo: IRules['add'] | IRules['alter'] | IRules['activate_theme'] | IRules['comment'];
    efficientInfos: {
      count: number;
      type: 'add' | 'alter' | 'set_labels' | 'online' | 'set_title' | 'set_cover' | 'add_attr' | 'delete_attr' | 'replace' | 'activate_theme';
    }[];
  }[];
  rule_CodeInput: string;
  rule_CodeIsDirty: boolean;
  // rule_PromptLeavePath: string;

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

// export interface OnPromptRulePageLeaveAction extends AnyAction {
//   type: 'informalNodeManagerPage/onPromptRulePageLeave';
//   payload: {
//     href: string;
//   };
// }
//
// export interface OnConfirmRulePageLeaveAction extends AnyAction {
//   type: 'informalNodeManagerPage/onConfirmRulePageLeave';
// }
//
// export interface OnCancelRulePageLeaveAction extends AnyAction {
//   type: 'informalNodeManagerPage/onCancelRulePageLeave';
// }

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
    value: InformalNodeManagerPageModelState['exhibit_ResourceTypeCodes'];
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

export interface OnClick_Exhibits_DeleteBtn_Action extends AnyAction {
  type: 'informalNodeManagerPage/onClick_Exhibits_DeleteBtn';
  payload: {
    testResourceId: string;
    testResourceName: string;
  };
}

export interface OnChange_Exhibits_StatusSwitch_Action extends AnyAction {
  type: 'informalNodeManagerPage/onChange_Exhibits_StatusSwitch';
  payload: {
    testResourceId: string;
    testResourceName: string;
    checked: boolean;
  };
}


export interface FetchThemeListAction extends AnyAction {
  type: 'informalNodeManagerPage/fetchThemeList' | 'fetchThemeList';
  payload: {
    isRematch?: boolean;
    isRestart?: boolean;
  };
}

export interface OnClickThemesAddBtnAction extends AnyAction {
  type: 'informalNodeManagerPage/onClickThemesAddBtn';
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

export interface OnClick_ActiveThemeBtn_Action extends AnyAction {
  type: 'informalNodeManagerPage/onClick_ActiveThemeBtn';
  payload: {
    testResourceId: string;
    testResourceName: string;
  };
}

export interface OnClick_Themes_DeleteBtn_Action extends AnyAction {
  type: 'informalNodeManagerPage/onClick_Themes_DeleteBtn';
  payload: {
    testResourceId: string;
    testResourceName: string;
  };
}

export interface Fetch_Rules_Action extends AnyAction {
  type: 'fetch_Rules';
}

export interface SaveRulesAction extends AnyAction {
  type: 'saveRules';
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
    data: Array<IRules['add']> | Array<IRules['alter']>;
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

export interface OnCancel_AddThemeDrawer_Action extends AnyAction {
  type: 'informalNodeManagerPage/onCancel_AddThemeDrawer';
}

export interface OnConfirm_AddThemeDrawer_Action extends AnyAction {
  type: 'informalNodeManagerPage/onConfirm_AddThemeDrawer';
  payload: {
    identity: 'object' | 'resource';
    names: string[];
  };
}

export interface OnClose_ReplaceModal_Action extends AnyAction {
  type: 'informalNodeManagerPage/onClose_ReplaceModal';
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
    value: InformalNodeManagerPageModelState['replaceModal_Replacer_Origin'];
  };
}

export interface OnReplacerBucketChangeAction extends AnyAction {
  type: 'informalNodeManagerPage/onReplacerBucketChange';
  payload: {
    value: InformalNodeManagerPageModelState['replaceModal_Replacer_Bucket'];
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
    // onPromptRulePageLeave: (action: OnPromptRulePageLeaveAction, effects: EffectsCommandMap) => void;
    // onConfirmRulePageLeave: (action: OnConfirmRulePageLeaveAction, effects: EffectsCommandMap) => void;
    // onCancelRulePageLeave: (action: OnCancelRulePageLeaveAction, effects: EffectsCommandMap) => void;

    fetchNodeInfo: (action: FetchNodeInfoAction, effects: EffectsCommandMap) => void;

    fetchExhibitList: (action: FetchExhibitListAction, effects: EffectsCommandMap) => void;
    onClickExhibitsAddBtn: (action: OnClickExhibitsAddBtnAction, effects: EffectsCommandMap) => void;
    onClickExhibitsReplaceBtn: (action: OnClickExhibitsReplaceBtnAction, effects: EffectsCommandMap) => void;
    onChangeExhibitType: (action: OnChangeExhibitTypeAction, effects: EffectsCommandMap) => void;
    onChangeExhibitStatus: (action: OnChangeExhibitStatusAction, effects: EffectsCommandMap) => void;
    onChangeExhibitKeywords: (action: OnChangeExhibitKeywordsAction, effects: EffectsCommandMap) => void;
    onLoadMoreExhibits: (action: OnLoadMoreExhibitsAction, effects: EffectsCommandMap) => void;
    onClick_Exhibits_DeleteBtn: (action: OnClick_Exhibits_DeleteBtn_Action, effects: EffectsCommandMap) => void;
    onChange_Exhibits_StatusSwitch: (action: OnChange_Exhibits_StatusSwitch_Action, effects: EffectsCommandMap) => void;

    fetchThemeList: (action: FetchThemeListAction, effects: EffectsCommandMap) => void;
    onClickThemesAddBtn: (action: OnClickThemesAddBtnAction, effects: EffectsCommandMap) => void;
    onClickThemesReplaceBtn: (action: OnClickThemesReplaceBtnAction, effects: EffectsCommandMap) => void;
    onChangeThemeKeywords: (action: OnChangeThemeKeywordsAction, effects: EffectsCommandMap) => void;
    onLoadMoreThemes: (action: OnLoadMoreThemesAction, effects: EffectsCommandMap) => void;
    onClick_ActiveThemeBtn: (action: OnClick_ActiveThemeBtn_Action, effects: EffectsCommandMap) => void;
    onClick_Themes_DeleteBtn: (action: OnClick_Themes_DeleteBtn_Action, effects: EffectsCommandMap) => void;

    fetch_Rules: (action: Fetch_Rules_Action, effects: EffectsCommandMap) => void;
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
    onCancel_AddThemeDrawer: (action: OnCancel_AddThemeDrawer_Action, effects: EffectsCommandMap) => void;
    onConfirm_AddThemeDrawer: (action: OnConfirm_AddThemeDrawer_Action, effects: EffectsCommandMap) => void;

    onClose_ReplaceModal: (action: OnClose_ReplaceModal_Action, effects: EffectsCommandMap) => void;
    onReplacerMount: (action: OnReplacerMountAction, effects: EffectsCommandMap) => void;
    onReplacerUnmount: (action: OnReplacerUnmountAction, effects: EffectsCommandMap) => void;
    onReplacerOriginChange: (action: OnReplacerOriginChangeAction, effects: EffectsCommandMap) => void;
    onReplacerBucketChange: (action: OnReplacerBucketChangeAction, effects: EffectsCommandMap) => void;
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
  // 'exhibit_TypeOptions1' |
  // 'exhibit_TypeOptions2' |
  // 'exhibit_SelectedType1' |
  // 'exhibit_SelectedType2' |
  'exhibit_ResourceTypeCodes' |
  'exhibit_StatusOptions' |
  'exhibit_SelectedStatus' |
  'exhibit_FilterKeywords' |
  'exhibit_ListState' |
  'exhibit_ListMore' |
  'exhibit_List' |
  'exhibit_ListTotal' |
  'exhibit_PageError'> = {
  // exhibit_TypeOptions1: [
  //   { text: '全部', value: '-1' },
  //   ...resource_TypeData
  //     .filter((rt) => {
  //       return rt.parentValue === '#';
  //     })
  //     .map((i) => {
  //       return {
  //         value: i.value,
  //         text: i.value,
  //       };
  //     }),
  // ],
  // exhibit_TypeOptions2: [],
  // exhibit_SelectedType1: '-1',
  // exhibit_SelectedType2: '-1',
  exhibit_ResourceTypeCodes: {
    value: '#all',
    label: '全部',
    values: ['#all'],
    labels: ['全部'],
  },
  exhibit_StatusOptions: [
    { text: '全部', value: '2' },
    { text: FI18n.i18nNext.t('filter_exhibit_status_availableforauth'), value: '1' },
    { text: FI18n.i18nNext.t('filter_exhibit_status_pendingauth'), value: '0' },
  ],
  exhibit_SelectedStatus: '2',
  exhibit_FilterKeywords: '',
  exhibit_ListState: 'loading',
  exhibit_ListMore: 'loading',
  exhibit_List: [],
  exhibit_ListTotal: -1,
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
  'rule_RuleList' |
  'rule_CodeInput' |
  'rule_CodeIsDirty' |
  // 'rule_PromptLeavePath' |
  'rule_CodeState' |
  'rule_CodeCompileErrors' |
  'rule_CodeExecutionErrors' |
  'rule_CodeEfficients'> = {
  rule_PageStatus: 'normal',
  rule_RuleList: [],
  rule_CodeInput: '',
  rule_CodeIsDirty: false,
  // rule_PromptLeavePath: '',
  rule_CodeState: 'editing',
  rule_CodeCompileErrors: [],
  rule_CodeExecutionErrors: [],
  rule_CodeEfficients: [],
};

const replaceModalInitDate: Pick<InformalNodeManagerPageModelState,
  'replaceModal_Visible' |
  'replaceModal_Replacer_ResourceOptions' |
  'replaceModal_Replacer_Origin' |
  'replaceModal_Replacer_BucketOptions' |
  'replaceModal_Replacer_Bucket' |
  'replaceModal_Replacer_Keywords' |
  'replaceModal_Replacer_ResourceList' |

  'replaceModal_Replaced_Keywords' |
  'replaceModal_Replaced_DependencyTreeList' |
  'replaceModal_Replaced_SelectDependency' |
  'replaceModal_Replaced_TargetVersions' |
  'replaceModal_Replaced_TargetSelectedVersion' |
  'replaceModal_Replaced_TreeData' |
  'replaceModal_Replaced_CheckedKeys' |
  'replaceModal_Errors'> = {
  replaceModal_Visible: false,
  replaceModal_Replacer_ResourceOptions: [
    { value: 'market', title: '资源市场' },
    { value: 'resource', title: '我的资源' },
    { value: 'collection', title: '我的收藏' },
    { value: 'object', title: '存储空间' },
  ],
  replaceModal_Replacer_Origin: 'market',
  replaceModal_Replacer_BucketOptions: [],
  replaceModal_Replacer_Bucket: '',
  replaceModal_Replacer_Keywords: '',
  replaceModal_Replacer_ResourceList: [],
  replaceModal_Replaced_Keywords: '',
  replaceModal_Replaced_DependencyTreeList: [],
  replaceModal_Replaced_SelectDependency: null,
  replaceModal_Replaced_TargetVersions: [],
  replaceModal_Replaced_TargetSelectedVersion: null,
  replaceModal_Replaced_TreeData: [],
  replaceModal_Replaced_CheckedKeys: [],
  replaceModal_Errors: [],
};

const informalNodeManagerPageInitStates: InformalNodeManagerPageModelState = {

  showPage: 'exhibit',

  node_ID: -1,
  node_Name: '',
  node_Url: '',
  node_TestUrl: '',
  node_RuleInfo: null,

  addExhibitDrawer_Visible: false,
  addThemeDrawer_Visible: false,

  ...replaceModalInitDate,

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
      // console.log('onMountExhibitPage9989999999999');
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
      // console.log('onMountThemePage9989999999999');
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
      yield put<Fetch_Rules_Action>({
        type: 'fetch_Rules',
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
    // * onPromptRulePageLeave({ payload }: OnPromptRulePageLeaveAction, { put }: EffectsCommandMap) {
    //
    //   yield put<ChangeAction>({
    //     type: 'change',
    //     payload: {
    //       // rule_PromptLeavePath: payload.href,
    //     },
    //   });
    //
    // },
    // * onConfirmRulePageLeave({}: OnConfirmRulePageLeaveAction, { select }: EffectsCommandMap) {
    //   const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
    //     informalNodeManagerPage,
    //   }));
    //   // history.push(informalNodeManagerPage.rule_PromptLeavePath);
    // },
    // * onCancelRulePageLeave({}: OnCancelRulePageLeaveAction, { put }: EffectsCommandMap) {
    //   yield put<ChangeAction>({
    //     type: 'change',
    //     payload: {
    //       // rule_PromptLeavePath: '',
    //     },
    //   });
    // },
    * fetchNodeInfo({}: FetchNodeInfoAction, { select, put, call }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const params: Parameters<typeof FServiceAPI.Node.details>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
      };

      const { data } = yield call(FServiceAPI.Node.details, params);

      if (FUtil.Tool.getUserIDByCookies() !== data.ownerUserId) {
        history.replace(FUtil.LinkTo.exception403({}));
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_Name: data.nodeName,
          node_Url: FUtil.Format.completeUrlByDomain(data.nodeDomain || ''),
          node_TestUrl: FUtil.Format.completeUrlByDomain(data.nodeDomain + '.t'),
        },
      });
    },
    * fetchExhibitList({ payload }: FetchExhibitListAction, {
      call,
      select,
      put,
    }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibit_ListMore: 'loading',
        },
      });

      const params2: RuleMatchAndResultParams = {
        nodeID: informalNodeManagerPage.node_ID,
        isRematch: payload.isRematch !== undefined ? payload.isRematch : true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      // console.log(result, 'resultresultresult!@$!@#$@#4');

      if (result.status === 2) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            exhibit_PageError: '匹配失败',
          },
        });
        return;
      }

      // console.log(data1, '2434234234234234');
      let list: InformalNodeManagerPageModelState['exhibit_List'] = [];
      if (!payload.isRestart) {
        list = [
          ...informalNodeManagerPage.exhibit_List,
        ];
      }
      // console.log(informalNodeManagerPage.exhibit_SelectedType, 'informalNodeManagerPage.exhibit_SelectedTypeiosejlkfsdjlk');

      const resourceTypes: Array<string | number> = informalNodeManagerPage.exhibit_ResourceTypeCodes.labels.filter((rt) => {
        return rt !== '全部';
      });

      const params: Parameters<typeof FServiceAPI.InformalNode.testResources>[0] = {
        skip: list.length,
        // limit: FUtil.Predefined.pageSize,
        limit: 50,
        nodeId: informalNodeManagerPage.node_ID,
        onlineStatus: Number(informalNodeManagerPage.exhibit_SelectedStatus) as 2,
        omitResourceType: '主题',
        resourceType: resourceTypes.length === 0 ? undefined : String(resourceTypes[resourceTypes.length - 1]),
        // resourceType: (informalNodeManagerPage.exhibit_SelectedType2 !== '-1' || informalNodeManagerPage.exhibit_SelectedType === '') ? undefined : informalNodeManagerPage.exhibit_SelectedType,
        // resourceType: informalNodeManagerPage.exhibit_SelectedType2 !== '-1'
        //   ? informalNodeManagerPage.exhibit_SelectedType2
        //   : informalNodeManagerPage.exhibit_SelectedType1 !== '-1'
        //     ? informalNodeManagerPage.exhibit_SelectedType1
        //     : undefined,
        keywords: informalNodeManagerPage.exhibit_FilterKeywords || undefined,
      };

      const { data: data_informalExhibits } = yield call(FServiceAPI.InformalNode.testResources, params);

      const params1: Parameters<typeof mergeAuthInfoToList>[0] = {
        nodeID: informalNodeManagerPage.node_ID,
        list: data_informalExhibits.dataList,
      };

      const listWithAuth: any[] = yield call(mergeAuthInfoToList, params1);

      const exhibitList: InformalNodeManagerPageModelState['exhibit_List'] = [
        ...list,
        ...listWithAuth,
      ];

      const { state, more } = listStateAndListMore({
        list_Length: exhibitList.length,
        total_Length: data_informalExhibits.totalItem,
        has_FilterCriteria: informalNodeManagerPage.exhibit_ResourceTypeCodes.values[0] !== '#all'
          || informalNodeManagerPage.exhibit_SelectedStatus !== '2'
          || informalNodeManagerPage.exhibit_FilterKeywords !== '',
      });
      // console.log('###444444444444');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
          exhibit_List: exhibitList,
          exhibit_ListTotal: data_informalExhibits.totalItem,
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

      // if (payload.level === 1) {
      //   yield put<ChangeAction>({
      //     type: 'change',
      //     payload: {
      //       exhibit_SelectedType1: payload.value,
      //       exhibit_SelectedType2: '-1',
      //       exhibit_TypeOptions2: [
      //         { text: '全部', value: '-1' },
      //         ...resource_TypeData
      //           .filter((rt) => {
      //             return rt.parentValue === payload.value;
      //           })
      //           .map((i) => {
      //             return {
      //               value: i.value,
      //               text: i.value,
      //             };
      //           }),
      //       ],
      //     },
      //   });
      // } else if (payload.level === 2) {
      //   yield put<ChangeAction>({
      //     type: 'change',
      //     payload: {
      //       exhibit_SelectedType2: payload.value,
      //     },
      //   });
      // }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibit_ResourceTypeCodes: payload.value,
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
    * onClick_Exhibits_DeleteBtn({ payload }: OnClick_Exhibits_DeleteBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informalNodeManagerPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      let needHandleRules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = JSON.parse(JSON.stringify(rules));

      needHandleRules = needHandleRules.filter((nhr) => {
        return nhr.exhibitName !== payload.testResourceName;
      });

      const text: string = decompile(needHandleRules);

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
        testRuleText: text,
      };
      const { data } = yield call(FServiceAPI.InformalNode.createRules, params);

      const params2: RuleMatchAndResultParams = {
        nodeID: informalNodeManagerPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            exhibit_PageError: '匹配失败',
          },
        });
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
          exhibit_List: informalNodeManagerPage.exhibit_List.filter((el) => {
            return el.testResourceId !== payload.testResourceId;
          }),
          exhibit_ListTotal: informalNodeManagerPage.exhibit_ListTotal - 1,
        },
      });

    },
    * onChange_Exhibits_StatusSwitch({ payload }: OnChange_Exhibits_StatusSwitch_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informalNodeManagerPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      let needHandleRules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = JSON.parse(JSON.stringify(rules));

      if (needHandleRules.some((nhr) => nhr.exhibitName === payload.testResourceName && nhr.operation !== 'activate_theme')) {
        needHandleRules = needHandleRules.map((nhr) => {
          if (nhr.exhibitName === payload.testResourceName && nhr.operation !== 'activate_theme') {
            return {
              ...nhr,
              actions: [
                ...nhr.actions,
                {
                  operation: 'online',
                  content: payload.checked,
                },
              ],
            };
          }

          return nhr;
        });
      } else {
        const alterRule: IRules['alter'] = {
          operation: 'alter',
          exhibitName: payload.testResourceName,
          actions: [
            {
              operation: 'online',
              content: payload.checked,
            },
          ],
          text: '',
        };
        needHandleRules = [
          ...needHandleRules,
          alterRule,
        ];
      }

      needHandleRules.sort((a) => {
        return a.exhibitName === payload.testResourceName ? -1 : 0;
      });

      const text: string = decompile(needHandleRules);

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
        testRuleText: text,
      };
      const { data } = yield call(FServiceAPI.InformalNode.createRules, params);

      //  ##############
      const params2: RuleMatchAndResultParams = {
        nodeID: informalNodeManagerPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            exhibit_PageError: '匹配失败',
          },
        });
        return;
      }

      const params3: Parameters<typeof FServiceAPI.InformalNode.testResourceDetails>[0] = {
        testResourceId: payload.testResourceId,
      };

      const { data: data3 } = yield call(FServiceAPI.InformalNode.testResourceDetails, params3);

      const params1: Parameters<typeof mergeAuthInfoToList>[0] = {
        nodeID: informalNodeManagerPage.node_ID,
        list: [data3],
      };
      const [data1] = yield call(mergeAuthInfoToList, params1);

      // console.log(data1, 'data1!@$@#$@#42309jlksdfl');

      // const { data: data1 } = yield call(FServiceAPI.InformalNode.batchGetAuths, params1);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
          exhibit_List: informalNodeManagerPage.exhibit_List.map((el) => {
            if (el.testResourceId === payload.testResourceId) {
              return data1;
            }
            return el;
          }),
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

      const params2: RuleMatchAndResultParams = {
        nodeID: informalNodeManagerPage.node_ID,
        isRematch: isRematch,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);

      if (result.status === 2) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            theme_PageError: '匹配失败',
          },
        });
        return;
      }

      const params: Parameters<typeof FServiceAPI.InformalNode.testResources>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
        onlineStatus: 2,
        resourceType: '主题',
        // limit: FUtil.Predefined.pageSize,
        limit: 50,
        keywords: informalNodeManagerPage.theme_FilterKeywords || undefined,
      };
      const { data } = yield call(FServiceAPI.InformalNode.testResources, params);
      // console.log(data, '890234ujndlskfl;asd@@@@1111111');
      const params1: Parameters<typeof mergeAuthInfoToList>[0] = {
        nodeID: informalNodeManagerPage.node_ID,
        list: data.dataList,
      };

      const listWithAuth: any[] = yield call(mergeAuthInfoToList, params1);

      const { state, more } = listStateAndListMore({
        list_Length: listWithAuth.length,
        total_Length: data.totalItem,
        has_FilterCriteria: informalNodeManagerPage.theme_FilterKeywords !== '',
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
          theme_List: [...listWithAuth]
            .sort((a, b) => {
              if (a.stateInfo.themeInfo.isActivatedTheme === 1 && b.stateInfo.themeInfo.isActivatedTheme !== 1) {
                return -1;
              }
              return 0;
            }),
          theme_ListState: state,
          theme_ListMore: more,
        },
      });
    },
    * onClickThemesAddBtn({}: OnClickThemesAddBtnAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addThemeDrawer_Visible: true,
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
      yield put<ChangeAction>({
        type: 'change',
        payload: { theme_FilterKeywords: payload.value },
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
    * onClick_ActiveThemeBtn({ payload }: OnClick_ActiveThemeBtn_Action, { select, call, put }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          theme_ActivatingThemeName: payload.testResourceName,
        },
      });

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informalNodeManagerPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      let needHandleRules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = JSON.parse(JSON.stringify(rules));

      if (needHandleRules.some((n) => n.operation === 'activate_theme')) {
        needHandleRules = needHandleRules.map((nhr) => {
          if (nhr.operation === 'activate_theme') {
            return {
              ...nhr,
              exhibitName: payload.testResourceName,
              text: '',
            };
          }
          return nhr;
        });
      } else {
        needHandleRules = [
          ...needHandleRules,
          {
            operation: 'activate_theme',
            exhibitName: payload.testResourceName,
            text: '',
          },
        ];
      }

      const text: string = decompile(needHandleRules);

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
        testRuleText: text,
      };
      const { data } = yield call(FServiceAPI.InformalNode.createRules, params);

      //  ##############
      const params2: RuleMatchAndResultParams = {
        nodeID: informalNodeManagerPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            exhibit_PageError: '匹配失败',
          },
        });
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
          theme_ActivatingThemeName: '',
        },
      });

      yield put<FetchThemeListAction>({
        type: 'fetchThemeList',
        payload: {
          isRematch: true,
          isRestart: true,
        },
      });

    },
    * onClick_Themes_DeleteBtn({ payload }: OnClick_Themes_DeleteBtn_Action, { select, call, put }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informalNodeManagerPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      let needHandleRules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = JSON.parse(JSON.stringify(rules));

      needHandleRules = needHandleRules.filter((nhr) => {
        return nhr.exhibitName !== payload.testResourceName;
      });

      const text: string = decompile(needHandleRules);

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
        testRuleText: text,
      };
      const { data } = yield call(FServiceAPI.InformalNode.createRules, params);

      const params2: RuleMatchAndResultParams = {
        nodeID: informalNodeManagerPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            exhibit_PageError: '匹配失败',
          },
        });
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
          theme_List: informalNodeManagerPage.theme_List.filter((el) => {
            return el.testResourceId !== payload.testResourceId;
          }),
        },
      });
    },

    * fetch_Rules({}: Fetch_Rules_Action, { call, select, put }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const params: Parameters<typeof FServiceAPI.InformalNode.testNodeRules>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
      };

      const { data } = yield call(FServiceAPI.InformalNode.testNodeRules, params);
      // console.log(data, 'data!!!!!@#$@#$@#$+++++++');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rule_CodeInput: data.ruleText,
          rule_CodeIsDirty: false,
          rule_RuleList: data.testRules
            .filter((tr: any) => {
              return tr.ruleInfo.operation !== 'comment';
            })
            .map((tr: any) => {
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

      const params1: RuleMatchAndResultParams = {
        nodeID: informalNodeManagerPage.node_ID,
      };
      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params1);

      // console.log(data1, 'data1!@#$!@#$@#');
      console.log(result, 'resultiosdjflksdjflsdjflljlksdf');

      const rule_CodeExecutionWarnings: InformalNodeManagerPageModelState['rule_CodeExecutionErrors'] = result.testRules
        .filter((tr: any) => {
          return tr.matchWarnings.length > 0;
        })
        .map((tr: any) => {
          return {
            ruleText: tr.ruleInfo.text,
            errors: tr.matchWarnings,
          };
        });

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
          node_RuleInfo: result,
          rule_CodeIsDirty: false,
          rule_CodeState: rule_CodeExecutionErrors.length === 0 ? 'noError' : 'executionError',
          rule_CodeExecutionErrors: [
            ...rule_CodeExecutionErrors,
            ...rule_CodeExecutionWarnings,
          ],
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

      const params2: RuleMatchAndResultParams = {
        nodeID: informalNodeManagerPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);

      if (result.status === 2) {
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
        },
      });

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

      const dateTime: string = moment().format(FUtil.Predefined.momentDateTimeFormat);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rule_CodeInput: '\n'
            + `// 以下语句于${dateTime}导入` + '\n'
            + payload.value + '\n'
            + `// 以上语句于${dateTime}导入` + '\n'
            + informalNodeManagerPage.rule_CodeInput,
          // rule_CodeState: 'coding',
          rule_PageStatus: 'coding',
          rule_CodeState: 'editing',
          rule_CodeIsDirty: true,
          rule_CodeCompileErrors: [],
          rule_CodeExecutionErrors: [],
          rule_CodeEfficients: [],
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

          rule_CodeInput: informalNodeManagerPage.node_RuleInfo?.ruleText || '',
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

          rule_CodeInput: informalNodeManagerPage.node_RuleInfo?.ruleText || '',
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
      // console.log(rules, 'rules##@#$$449098uoi234');
      // console.log(errors, errorObjects, 'errorObjects234234');
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
    * onConfirm_AddExhibitDrawer({ payload }: OnConfirm_AddExhibitDrawer_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addExhibitDrawer_Visible: false,
        },
      });
      // console.log(payload, 'payload098iokfjskldfjlsdkfjlk');

      const rightNames: string[] = yield call(checkedExhibitUsedNames, informalNodeManagerPage.node_ID, payload.names.map((n) => {
        return n.split('/')[1];
      }));

      // console.log(rightNames, 'rightNames used093i2osdlfksdjl');

      const ruleObj: Array<IRules['add']> = payload.names.map((n, index) => {
        return {
          operation: 'add',
          exhibitName: rightNames[index],
          candidate: {
            name: n,
            versionRange: 'latest',
            type: payload.identity,
          },
          actions: [],
          text: '',
        };
      });
      // console.log(ruleObj, 'ruleObj908iowejf;lskdfjsldk');
      const text: string = decompile(ruleObj);
      const params: Parameters<typeof FServiceAPI.InformalNode.putRules>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
        additionalTestRule: text,
      };
      const { data, errCode, ret, msg }: {
        data: boolean;
        errCode: number;
        msg: string;
        ret: number;
      } = yield call(FServiceAPI.InformalNode.putRules, params);

      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage(msg, 'error');
      }
      fMessage(FI18n.i18nNext.t('msg_new_test_exhibit_added'));
      yield put<FetchExhibitListAction>({
        type: 'fetchExhibitList',
        payload: {
          isRematch: true,
          isRestart: true,
        },
      });
    },
    * onCancel_AddThemeDrawer({}: OnCancel_AddThemeDrawer_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addThemeDrawer_Visible: false,
        },
      });
    },
    * onConfirm_AddThemeDrawer({ payload }: OnConfirm_AddThemeDrawer_Action, { select, call, put }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          addThemeDrawer_Visible: false,
        },
      });

      const rightNames: string[] = yield call(checkedExhibitUsedNames, informalNodeManagerPage.node_ID, payload.names.map((n) => {
        return n.split('/')[1];
      }));

      console.log(rightNames, 'rightNames903weoijsedfk');

      const ruleObj: Array<IRules['add']> = payload.names.map((n, index) => {
        return {
          operation: 'add',
          exhibitName: rightNames[index],
          candidate: {
            name: n,
            versionRange: 'latest',
            type: payload.identity,
          },
          actions: [],
          text: '',
        };
      });
      // console.log(JSON.stringify(ruleObj), '123423423');

      const text = decompile(ruleObj);
      // console.log(text, 'text1234fklsadj');

      const params: Parameters<typeof FServiceAPI.InformalNode.putRules>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
        additionalTestRule: text,
      };
      const { data, errCode, ret, msg }: {
        data: boolean;
        errCode: number;
        msg: string;
        ret: number;
      } = yield call(FServiceAPI.InformalNode.putRules, params);
      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage(msg, 'error');
      }
      fMessage(FI18n.i18nNext.t('msg_new_test_exhibit_added'));
      yield put<FetchThemeListAction>({
        type: 'fetchThemeList',
        payload: {
          isRematch: true,
          isRestart: true,
        },
      });
    },

    * onClose_ReplaceModal({}: OnClose_ReplaceModal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...replaceModalInitDate,
        },
      });
    },
    * onReplacerMount({}: OnReplacerMountAction, { put, call }: EffectsCommandMap) {
      yield put<FetchReplacerListAction>({
        type: 'fetchReplacerList',
        payload: {
          restart: true,
          // origin: 'market',
        },
      });

      const params: Parameters<typeof FServiceAPI.Storage.bucketList>[0] = {
        bucketType: 1,
      };

      const { data } = yield call(FServiceAPI.Storage.bucketList, params);
      // console.log(data, 'BBBBBBBBBB!@#$!@#$#$!@111111111');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModal_Replacer_BucketOptions: (data as any[]).map<InformalNodeManagerPageModelState['replaceModal_Replacer_BucketOptions'][number]>((d: any) => {
            return {
              value: d.bucketName,
              text: d.bucketName,
            };
          }),
          replaceModal_Replacer_Bucket: data.length > 0 ? data[0].bucketName : '',
        },
      });
    },
    * onReplacerUnmount({}: OnReplacerUnmountAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {},
      });
    },
    * onReplacerOriginChange({ payload }: OnReplacerOriginChangeAction, { select, put }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModal_Replacer_Origin: payload.value,
          replaceModal_Replacer_Keywords: '',
          replaceModal_Replacer_Bucket: informalNodeManagerPage.replaceModal_Replacer_BucketOptions.length > 0
            ? informalNodeManagerPage.replaceModal_Replacer_BucketOptions[0].value
            : '',
        },
      });

      yield put<FetchReplacerListAction>({
        type: 'fetchReplacerList',
        payload: {
          restart: true,
          // origin: payload.value,
        },
      });
    },
    * onReplacerBucketChange({ payload }: OnReplacerBucketChangeAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          replaceModal_Replacer_Bucket: payload.value,
        },
      });

      yield put<FetchReplacerListAction>({
        type: 'fetchReplacerList',
        payload: {
          restart: true,
          // keywords: payload.value,
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
          // keywords: payload.value,
        },
      });
    },
    * fetchReplacerList({ payload }: FetchReplacerListAction, { select, call, put }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      // const payloadOrigin: string = payload.origin !== undefined ? payload.origin : informalNodeManagerPage.replaceModal_Replacer_Origin;
      // const payloadKeywords: string = payload.keywords !== undefined ? payload.keywords : informalNodeManagerPage.replaceModal_Replacer_Keywords;

      let replacerResourceList: InformalNodeManagerPageModelState['replaceModal_Replacer_ResourceList'] = [];

      if (!payload.restart) {
        replacerResourceList = [
          ...informalNodeManagerPage.replaceModal_Replacer_ResourceList,
        ];
      }

      if (informalNodeManagerPage.replaceModal_Replacer_Origin === 'market') {

        const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
          skip: replacerResourceList.length,
          limit: FUtil.Predefined.pageSize,
          keywords: informalNodeManagerPage.replaceModal_Replacer_Keywords,
          status: 1,
        };

        const { data } = yield call(FServiceAPI.Resource.list, params);
        // console.log(data, 'data@!$@#$!@#41211111');

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
      } else if (informalNodeManagerPage.replaceModal_Replacer_Origin === 'resource') {
        // yield put<FetchMyResourcesAction>({
        //   type: 'fetchMyResources',
        // });

        const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
          // resourceType:''
          skip: replacerResourceList.length,
          limit: FUtil.Predefined.pageSize,
          isSelf: 1,
          keywords: informalNodeManagerPage.replaceModal_Replacer_Keywords,
        };
        // console.log(params, 'paramsparams1234');
        const { data } = yield call(FServiceAPI.Resource.list, params);
        // console.log(data, 'data13453');
        replacerResourceList = [
          ...replacerResourceList,
          ...(data.dataList as any[]).map<InformalNodeManagerPageModelState['replaceModal_Replacer_ResourceList'][number]>((rs) => {
            return {
              checked: false,
              disabled: rs.latestVersion === '',
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
      } else if (informalNodeManagerPage.replaceModal_Replacer_Origin === 'collection') {
        // yield put<FetchCollectionAction>({
        //   type: 'fetchCollection',
        // });

        const params: Parameters<typeof FServiceAPI.Collection.collectionResources>[0] = {
          skip: replacerResourceList.length,
          limit: FUtil.Predefined.pageSize,
          keywords: informalNodeManagerPage.replaceModal_Replacer_Keywords,
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

        if (informalNodeManagerPage.replaceModal_Replacer_Bucket === '') {
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              replaceModal_Replacer_ResourceList: [],
            },
          });
          return;
        }

        const params: Parameters<typeof FServiceAPI.Storage.objectList>[0] = {
          skip: 0,
          limit: FUtil.Predefined.pageSize,
          bucketName: informalNodeManagerPage.replaceModal_Replacer_Bucket,
          keywords: informalNodeManagerPage.replaceModal_Replacer_Keywords,
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
        payload: {},
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
    * onReplaceModalConfirm({}: OnReplaceModalConfirmAction, { select, call, put }: EffectsCommandMap) {
      const { informalNodeManagerPage }: ConnectState = yield select(({ informalNodeManagerPage }: ConnectState) => ({
        informalNodeManagerPage,
      }));

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informalNodeManagerPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      let needHandleRules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = JSON.parse(JSON.stringify(rules));

      const simplifiedResults: string[][] = simplifiedRelationship(informalNodeManagerPage.replaceModal_Replaced_CheckedKeys)
        .map<string[]>((r) => {
          return r.split(':')
            .filter((_, i) => {
              return i !== 0;
            });
        });
      // console.log(simplifiedResults, 're90j23DSF@#AFSd0-_simplifiedResults2222222');

      const replaced: IActions['replace']['content']['replaced'] = {
        name: informalNodeManagerPage.replaceModal_Replaced_SelectDependency?.name || '',
        versionRange: informalNodeManagerPage.replaceModal_Replaced_TargetSelectedVersion?.value || 'latest',
        type: informalNodeManagerPage.replaceModal_Replaced_SelectDependency?.type || 'object',
      };

      const replacerData = informalNodeManagerPage.replaceModal_Replacer_ResourceList.find((rr) => {
        // return rr.name === informalNodeManagerPage.replacerCheckedResourceName;
        return rr.checked;
      });

      const replacer: IActions['replace']['content']['replacer'] = {
        name: replacerData?.name || '',
        versionRange: replacerData?.versionRange || 'latest',
        type: replacerData?.identity || 'object',
      };

      // console.log(simplifiedResults, 'simplifiedResult9023000000000');

      for (const simplifiedResult of simplifiedResults) {
        const [key, ...arr] = simplifiedResult;
        const scope: IActions['replace']['content']['scopes'][number] = arr.map((o: string) => {
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
        });

        needHandleRules = mergeRules({
          oldRules: needHandleRules,
          exhibitName: key,
          action: {
            operation: 'replace',
            content: {
              replaced,
              replacer,
              scopes: scope.length === 0 ? [] : [scope],
            },
          },
        });
      }

      const changedRules: Array<IRules['add'] | IRules['alter'] | any> = simplifiedResults.map((s) => {
        return needHandleRules.find((nhr) => {
          return nhr.exhibitName === s[0] && nhr.operation !== 'activate_theme';
        });
      });

      const allChangedKey: string[] = simplifiedResults.map((s) => {
        return s[0];
      });
      changedRules.sort((a) => {
        return allChangedKey.includes(a.exhibitName) ? -1 : 0;
      });

      const params3: Parameters<typeof FServiceAPI.InformalNode.rulesPreExecution>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
        testRuleText: decompile(changedRules),
      };

      const { data: data3 } = yield call(FServiceAPI.InformalNode.rulesPreExecution, params3);

      const matchErrors: string[] = data3.map((d: any) => {
        return d.matchErrors;
      }).flat();
      // console.log(matchErrors, 'data32434');

      if (matchErrors.length > 0) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            replaceModal_Errors: matchErrors,
          },
        });
        return;
      }

      const text: string = decompile(needHandleRules);

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informalNodeManagerPage.node_ID,
        testRuleText: text,
      };
      const { data } = yield call(FServiceAPI.InformalNode.createRules, params);

      if (informalNodeManagerPage.showPage === 'exhibit') {
        yield put<FetchExhibitListAction>({
          type: 'fetchExhibitList',
          payload: {
            isRematch: true,
            isRestart: true,
          },
        });
      } else {
        yield put<FetchThemeListAction>({
          type: 'fetchThemeList',
          payload: {
            isRematch: true,
            isRestart: true,
          },
        });
      }

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


interface RuleMatchAndResultParams {
  nodeID: number;
  isRematch?: boolean;
}

export interface RuleMatchAndResultReturn {
  nodeId: number;
  ruleText: string;
  status: 2 | 3;
  testRules: {
    id: string;
    matchErrors: string[];
    ruleInfo: IRules['add'] | IRules['alter'] | IRules['activate_theme'];
    efficientInfos: {
      count: number;
      type: 'add' | 'alter' | 'set_labels' | 'online' | 'set_title' | 'set_cover' | 'add_attr' | 'delete_attr' | 'replace' | 'activate_theme';
    }[];
  }[];
  themeId: string;
}

export async function ruleMatchAndResult({
                                           nodeID,
                                           isRematch = false,
                                         }: RuleMatchAndResultParams): Promise<RuleMatchAndResultReturn> {

  if (isRematch) {
    const { errCode, data }: any = await FServiceAPI.InformalNode.rulesRematch({
      nodeId: nodeID,
      // isMandatoryMatch: 1,
    });
    // if (errCode !== 0 || !data) {
    //   return {
    //     error: '匹配失败',
    //   };
    // }
  }

  while (true) {
    const response: any = await FServiceAPI.InformalNode.testNodeRules({ nodeId: nodeID });
    // console.log(response, 'response1234');
    if (response.data.status === 1) {
      await FUtil.Tool.promiseSleep(200);
    } else {
      return response.data;
    }
  }

  // function sleep(ms: number = 200): Promise<void> {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve();
  //     }, ms);
  //   });
  // }
}

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
  // console.log(relation, 'relation0923jlksd0000');
  let arr: string[] = [...relation].sort((a: string, b: string) => a.length - b.length);
  for (let i = 0; i < arr.length; i++) {
    const current: string = arr[i];
    arr = arr.filter((a) => {
      return a === current || !a.startsWith(current);
    });
  }
  return arr;
}

interface MergeAuthInfoToListParams {
  nodeID: number;
  list: any[];
}

type MergeAuthInfoToListReturn = any[];

async function mergeAuthInfoToList({ list, nodeID }: MergeAuthInfoToListParams): Promise<MergeAuthInfoToListReturn> {

  if (list.length === 0) {
    return [];
  }

  const params1: Parameters<typeof FServiceAPI.InformalNode.batchGetAuths>[0] = {
    nodeId: nodeID,
    exhibitIds: list.map((d: any) => d.testResourceId).join(','),
    authType: 3,
  };

  const { data }: any = await FServiceAPI.InformalNode.batchGetAuths(params1);

  const exhibitList: InformalNodeManagerPageModelState['exhibit_List'] = list.map((d: any) => {
    return {
      ...d,
      isAuth: data.find((d1: any) => {
        return d1.exhibitId === d.testResourceId;
      }).isAuth,
    };
  });
  return exhibitList;
}

async function isExhibitsUsed(nodeID: number, names: string[]): Promise<boolean[]> {
  const params: Parameters<typeof FServiceAPI.InformalNode.batchTestResources>[0] = {
    nodeId: nodeID,
    testResourceNames: names.map((n) => {
      return encodeURIComponent(n);
    }).join(','),
  };

  const { data }: any = await FServiceAPI.InformalNode.batchTestResources(params);
  // console.log(data);

  return names.map<boolean>((n) => {
    return data.some((d: any) => {
      return d.testResourceName === n;
    });
  });

}


async function checkedExhibitUsedNames(nodeID: number, names: string[]): Promise<string[]> {

  const nameMap: Map<string, number> = new Map<string, number>();
  for (const name of names) {
    nameMap.set(name, nameMap.get(name) || 0);
  }

  const parmaNames: string[] = names.map((n) => {
    return (nameMap.get(n) || 0) > 1 ? (n + FUtil.Tool.generateRandomCode()) : n;
  });

  const params: Parameters<typeof FServiceAPI.InformalNode.batchTestResources>[0] = {
    nodeId: nodeID,
    testResourceNames: parmaNames.map((n) => {
      return encodeURIComponent(n);
    }).join(','),
  };

  const { data }: any = await FServiceAPI.InformalNode.batchTestResources(params);
  // console.log(data);

  const newNames: string[] = parmaNames.map<string>((n) => {
    if (data.some((d: any) => {
      return d.testResourceName === n;
    })) {
      return n + FUtil.Tool.generateRandomCode();
    } else {
      return n;
    }
  });
  // newNames.sort();
  // for (let i: number = 1; i < newNames.length; i++) {
  //   if (newNames[i] === newNames[i - 1]) {
  //     newNames[i] += FUtil.Tool.generateRandomCode();
  //   }
  // }
  return newNames;
}
