import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState } from '@/models/connect';
import { history } from 'umi';
import BraftEditor, { EditorState } from 'braft-editor';
import fMessage from '@/components/fMessage';
import { FetchDataSourceAction, FetchDraftDataAction } from '@/models/resourceInfo';
import * as semver from 'semver';
import moment from 'moment';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { PolicyFullInfo_Type } from '@/type/contractTypes';

export type DepResources = {
  id: string;
  title: string;
  resourceType: string[];
  status: 0 /*该资源已下线，无法获取授权。*/
    | 1
    | 2 /*循环依赖不支持授权。*/
    | 3 /*该依赖是存储空间对象，无法获取授权。*/
    | 4 /*上抛资源，无法获取授权*/;
  error: '' | 'offline' | 'cyclicDependency' | 'storageObject' | 'upThrow' | 'freeze';
  warning: '' | 'authException' | 'ownerFreeze';
  versionRange: string;
  versions: string[];
  upthrow: boolean;
  upthrowDisabled: boolean;
  authProblem: boolean;
  enableReuseContracts: {
    checked: boolean;
    id: string;
    policyId: string;
    title: string;
    // status: 'executing' | 'stopped';
    status: 0 | 1 | 2;
    code: string;
    date: string;
    versions: string[];
  }[];
  terminatedContractIDs: string[];
  enabledPolicies: {
    checked: boolean;
    id: string;
    title: string;
    code: string;
    status: 0 | 1;
    policyFullInfo: PolicyFullInfo_Type;
  }[];
}[];

export type Relationships = {
  id: string;
  children: Readonly<{
    id: string;
  }>[];
}[];

export interface ResourceVersionCreatorPageModelState {
  resourceId: string;
  latestVersion: string;
  resourceType: string[];
  baseUpcastResources: {
    resourceId: string;
    resourceName: string;
  }[];

  version: string;
  versionVerify: 0 | 2;
  versionErrorText: string;

  selectedFileName: string;
  selectedFileSha1: string;
  selectedFileOrigin: string;
  selectedFileStatus: -3 /* 上传成功 */
    | -2 /* 正在上传 */
    | -1 /* 正在校验 */
    | 0 /* 未上传 */
    | 1 /* 文件太大 */
    | 2 /* 类型不符 */
    | 3 /* 自己已上传 */
    | 4 /* 他人已上传 */
  ;
  selectedFileUsedResource: {
    resourceID: string;
    resourceName: string;
    resourceType: string;
    resourceVersion: string;
    url: string;
  }[];
  selectedFileObjectDrawerVisible: boolean;

  depRelationship: Relationships;
  dependencies: DepResources;
  depActivatedID: string;

  dataIsDirty: boolean;

  rawProperties: {
    key: string;
    value: string;
  }[];
  rawPropertiesState: 'parsing' | 'success' | 'fail';

  baseProperties: {
    key: string;
    value: string;
    description: string;
  }[];
  basePropertiesEditorVisible: boolean;
  basePropertiesEditorData: {
    key: string;
    keyError: string;
    value: string;
    valueError: string;
    description: string;
    descriptionError: string;
  }[];
  basePropertyEditorIndex: number;
  basePropertyEditorData: {
    key: string;
    keyError: string;
    value: string;
    valueError: string;
    description: string;
    descriptionError: string;
  } | null;

  customOptionsDataVisible: boolean;
  customOptionsData: {
    key: string;
    description: string;
    custom: 'input' | 'select';
    defaultValue: string;
    customOption: string;
  }[];
  customOptionsEditorVisible: boolean;
  customOptionsEditorDataSource: {
    key: string;
    keyError: string;
    description: string;
    descriptionError: string;
    custom: 'input' | 'select';
    defaultValue: string;
    defaultValueError: string;
    customOption: string;
    customOptionError: string;
  }[];
  customOptionIndex: number;
  customOptionEditorData: {
    key: string;
    keyError: string;
    description: string;
    descriptionError: string;
    custom: 'input' | 'select';
    defaultValue: string;
    defaultValueError: string;
    customOption: string;
    customOptionError: string;
  } | null;

  description: EditorState;

  preVersionBaseProperties: {
    key: string;
    value: string;
    description: string;
  }[];

  preVersionOptionProperties: {
    key: string;
    description: string;
    custom: 'input' | 'select';
    defaultValue: string;
    customOption: string;
  }[];

  preVersionDeps: {
    relationships: Relationships;
    versions: { id: string; versionRange: string }[];
  };

  promptLeavePath: string;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceVersionCreatorPage/change',
  payload: Partial<ResourceVersionCreatorPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onMountPage';
  payload: {
    resourceID: string;
  };
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onUnmountPage';
}

export interface OnPromptPageLeaveAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onPromptPageLeave';
  payload: {
    href: string;
  };
}

export interface OnPromptPageLeaveConfirmAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onPromptPageLeaveConfirm';
}

export interface OnPromptPageLeaveCancelAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onPromptPageLeaveCancel';
}

export interface OnClickCreateBtnAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onClickCreateBtn';
}

export interface OnClickCacheBtnAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onClickCacheBtn';
}

export interface InitModelStatesAction extends AnyAction {
  type: 'resourceVersionCreatorPage/initModelStates';
}

export interface FetchDraftAction extends AnyAction {
  type: 'fetchDraft';
}

export interface FetchResourceInfoAction extends AnyAction {
  type: 'fetchResourceInfo';
}

export interface VerifyVersionInputAction extends AnyAction {
  type: 'resourceVersionCreatorPage/verifyVersionInput' | 'verifyVersionInput';
  // payload: string;
}

export interface FetchRawPropsAction extends AnyAction {
  type: 'resourceVersionCreatorPage/fetchRawProps';
}

export interface AddDepsAction extends AnyAction {
  type: 'resourceVersionCreatorPage/addDeps' | 'addDeps';
  payload: {
    relationships: Relationships;
    versions?: { id: string; versionRange: string; }[];
  };
}

export interface AddDepsByMainIDsAction extends AnyAction {
  type: 'resourceVersionCreatorPage/dddDepsByMainIDs';
  payload: string[]; // 主资源 ids
}

export interface HandleObjectInfoAction extends AnyAction {
  type: 'resourceVersionCreatorPage/handleObjectInfo';
  payload: string; // 对象 id
}

export interface DeleteDependencyByIDAction extends AnyAction {
  type: 'resourceVersionCreatorPage/deleteDependencyByID';
  payload: ResourceVersionCreatorPageModelState['dependencies'][number]['id'];
}

export interface ImportLastVersionDataAction extends AnyAction {
  type: 'importLastVersionData' | 'resourceVersionCreatorPage/importLastVersionData';
  payload: 'baseProps' | 'optionProps' | 'deps';
}

export interface ResourceVersionCreatorModelType {
  namespace: 'resourceVersionCreatorPage';
  state: ResourceVersionCreatorPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
    onPromptPageLeave: (action: OnPromptPageLeaveAction, effects: EffectsCommandMap) => void;
    onPromptPageLeaveConfirm: (action: OnPromptPageLeaveConfirmAction, effects: EffectsCommandMap) => void;
    onPromptPageLeaveCancel: (action: OnPromptPageLeaveCancelAction, effects: EffectsCommandMap) => void;
    onClickCreateBtn: (action: OnClickCreateBtnAction, effects: EffectsCommandMap) => void;
    onClickCacheBtn: (action: OnClickCacheBtnAction, effects: EffectsCommandMap) => void;

    fetchDraft: (action: FetchDraftAction, effects: EffectsCommandMap) => void;
    fetchResourceInfo: (action: FetchResourceInfoAction, effects: EffectsCommandMap) => void;
    fetchRawProps: (action: FetchRawPropsAction, effects: EffectsCommandMap) => void;
    verifyVersionInput: (action: VerifyVersionInputAction, effects: EffectsCommandMap) => void;
    // 处理从对象导入的数据
    handleObjectInfo: (action: HandleObjectInfoAction, effects: EffectsCommandMap) => void;
    addDeps: (action: AddDepsAction, effects: EffectsCommandMap) => void;
    dddDepsByMainIDs: (action: AddDepsByMainIDsAction, effects: EffectsCommandMap) => void;
    deleteDependencyByID: (action: DeleteDependencyByIDAction, effects: EffectsCommandMap) => void;
    importLastVersionData: (action: ImportLastVersionDataAction, effects: EffectsCommandMap) => void;
    initModelState: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceVersionCreatorPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const initStates: ResourceVersionCreatorPageModelState = {
  resourceId: '',
  latestVersion: '',
  resourceType: [],
  baseUpcastResources: [],

  version: '',
  versionVerify: 0,
  versionErrorText: '',

  selectedFileName: '',
  selectedFileSha1: '',
  selectedFileOrigin: '',
  selectedFileStatus: 0,
  selectedFileUsedResource: [],
  selectedFileObjectDrawerVisible: false,

  rawProperties: [],
  rawPropertiesState: 'success',

  baseProperties: [],
  basePropertiesEditorVisible: false,
  basePropertiesEditorData: [],
  basePropertyEditorIndex: -1,
  basePropertyEditorData: null,

  customOptionsDataVisible: false,
  customOptionsData: [],
  customOptionsEditorVisible: false,
  customOptionsEditorDataSource: [],
  customOptionIndex: -1,
  customOptionEditorData: null,

  depRelationship: [],
  dependencies: [],
  depActivatedID: '',

  description: BraftEditor.createEditorState(''),

  preVersionBaseProperties: [],
  preVersionOptionProperties: [],
  preVersionDeps: {
    relationships: [],
    versions: [],
  },

  dataIsDirty: false,

  promptLeavePath: '',
};

const Model: ResourceVersionCreatorModelType = {

  namespace: 'resourceVersionCreatorPage',

  state: initStates,

  effects: {
    * onMountPage({ payload }: OnMountPageAction, { put, call }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceId: payload.resourceID,
        },
      });

      yield put<FetchResourceInfoAction>({
        type: 'fetchResourceInfo',
      });

      const params: HandledDraftParamsType = {
        resourceID: payload.resourceID,
      };

      const result: ResourceVersionCreatorPageModelState | null = yield call(handledDraft, params);

      if (result) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            ...result,
          },
        });
      }

    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {
      window.onbeforeunload = null;
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
        caller: '972938748$%$%$%$%$%$%23yu4oi234io23hjkfdsasdf',
      });
    },
    * onPromptPageLeave({ payload }: OnPromptPageLeaveAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          promptLeavePath: payload.href,
        },
      });
    },
    * onPromptPageLeaveConfirm({}: OnPromptPageLeaveConfirmAction, { select }: EffectsCommandMap) {
      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      history.push(resourceVersionCreatorPage.promptLeavePath);
    },
    * onPromptPageLeaveCancel({}: OnPromptPageLeaveCancelAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'resourceVersionCreatorPage/change',
        payload: {
          promptLeavePath: '',
        },
      });
    },
    * onClickCreateBtn({}: OnClickCreateBtnAction, { put, call, select }: EffectsCommandMap) {
      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: false,
        },
      });
      const baseUpcastResourceIds = resourceVersionCreatorPage.dependencies
        .filter((dep) => dep.upthrow)
        .map((dep) => dep.id);
      const resolveResources = resourceVersionCreatorPage.dependencies
        .filter((dep) => !baseUpcastResourceIds.includes(dep.id))
        .map((dep) => ({
          resourceId: dep.id,
          contracts: [
            ...dep.enabledPolicies
              .filter((p) => (p.checked))
              .map((p) => ({ policyId: p.id })),
            ...dep.enableReuseContracts
              .filter((c) => (c.checked))
              .map((c) => ({ policyId: c.policyId })),
          ],
        }));

      const directlyDependentIds: string[] = resourceVersionCreatorPage.depRelationship.map((drs) => drs.id);
      const params: Parameters<typeof FServiceAPI.Resource.createVersion>[0] = {
        resourceId: resourceVersionCreatorPage.resourceId,
        version: resourceVersionCreatorPage.version,
        fileSha1: resourceVersionCreatorPage.selectedFileSha1,
        filename: resourceVersionCreatorPage.selectedFileName,
        baseUpcastResources: baseUpcastResourceIds.map((baseUpId) => ({ resourceId: baseUpId })),
        dependencies: resourceVersionCreatorPage.dependencies
          .filter((dep) => {
            return directlyDependentIds.includes(dep.id);
          })
          .map((dep) => {
            return {
              resourceId: dep.id,
              versionRange: dep.versionRange,
            };
          }),
        resolveResources: resolveResources,
        customPropertyDescriptors: [
          ...resourceVersionCreatorPage.baseProperties.map<NonNullable<Parameters<typeof FServiceAPI.Resource.createVersion>[0]['customPropertyDescriptors']>[number]>((i) => {
            return {
              type: 'readonlyText',
              key: i.key,
              remark: i.description,
              defaultValue: i.value,
            };
          }),
          ...resourceVersionCreatorPage.customOptionsData.map<NonNullable<Parameters<typeof FServiceAPI.Resource.createVersion>[0]['customPropertyDescriptors']>[number]>((i) => {
            const isInput: boolean = i.custom === 'input';
            const options: string[] = i.customOption.split(',');
            return {
              type: isInput ? 'editableText' : 'select',
              key: i.key,
              remark: i.description,
              defaultValue: isInput ? i.defaultValue : options[0],
              candidateItems: isInput ? undefined : options,
            };
          }),
        ],
        description: resourceVersionCreatorPage.description.toHTML() === '<p></p>' ? '' : resourceVersionCreatorPage.description.toHTML(),
      };

      const { data } = yield call(FServiceAPI.Resource.createVersion, params);
      yield put<FetchDataSourceAction>({
        type: 'resourceInfo/fetchDataSource',
        payload: params.resourceId,
      });
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
        caller: '97293874823yu4oi234io23hjkfdsasdf',
      });
      // router.replace(`/resource/${data.resourceId}/$version/${data.$version}/success`)
      history.replace(FUtil.LinkTo.resourceVersionCreateSuccess({
        resourceID: data.resourceId,
        version: data.version,
      }));

      yield put<FetchDraftDataAction>({
        type: 'resourceInfo/fetchDraftData',
      });
    },
    * onClickCacheBtn({}: OnClickCacheBtnAction, { put, select, call }: EffectsCommandMap) {

      const { resourceInfo, resourceVersionCreatorPage }: ConnectState = yield select(({
                                                                                         resourceVersionCreatorPage,
                                                                                         resourceInfo,
                                                                                       }: ConnectState) => ({
        resourceInfo, resourceVersionCreatorPage,
      }));

      const params: Parameters<typeof FServiceAPI.Resource.saveVersionsDraft>[0] = {
        resourceId: resourceInfo.info?.resourceId || '',
        draftData: {
          ...resourceVersionCreatorPage,
          description: resourceVersionCreatorPage.description.toHTML(),
          dataIsDirty: false,
        },
      };
      yield call(FServiceAPI.Resource.saveVersionsDraft, params);
      fMessage('暂存草稿成功');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: false,
        },
      });

      yield put<FetchDraftDataAction>({
        type: 'resourceInfo/fetchDraftData',
      });
    },
    * fetchDraft({}: FetchDraftAction, { call, put, select }: EffectsCommandMap) {
      // const { resourceVersionCreatorPage }: ConnectState = yield select(({
      //                                                                      resourceVersionCreatorPage,
      //                                                                      resourceInfo,
      //                                                                    }: ConnectState) => {
      //   return {
      //     resourceVersionCreatorPage,
      //   };
      // });

    },
    * fetchResourceInfo({}: FetchResourceInfoAction, { select, call, put }: EffectsCommandMap) {
      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));
      const params: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: resourceVersionCreatorPage.resourceId,
        isLoadLatestVersionInfo: 1,
      };
      const { data } = yield call(FServiceAPI.Resource.info, params);
      // console.log(data, '2093jdsl;kfasdf');

      let description: EditorState = BraftEditor.createEditorState('');
      let preVersionBaseProperties: ResourceVersionCreatorPageModelState['preVersionBaseProperties'] = [];
      let preVersionOptionProperties: ResourceVersionCreatorPageModelState['preVersionOptionProperties'] = [];
      let preVersionDeps = {
        relationships: [],
        versions: [],
      };
      if (data.latestVersion) {
        const params2: Parameters<typeof FServiceAPI.Resource.resourceVersionInfo1>[0] = {
          resourceId: resourceVersionCreatorPage.resourceId,
          version: data.latestVersion,
        };
        const { data: data2 } = yield call(FServiceAPI.Resource.resourceVersionInfo1, params2);
        // console.log(data2, 'data2092384u0');
        description = BraftEditor.createEditorState(data2.description);
        preVersionBaseProperties = (data2.customPropertyDescriptors as any[])
          .filter((cpd: any) => cpd.type === 'readonlyText')
          .map<ResourceVersionCreatorPageModelState['preVersionBaseProperties'][number]>((cpd: any) => {
            return {
              key: cpd.key,
              value: cpd.key === 'fileSize' ? FUtil.Format.humanizeSize(cpd.defaultValue) : cpd.defaultValue,
              description: cpd.remark,
            };
          });

        preVersionOptionProperties = (data2.customPropertyDescriptors as any[])
          .filter((cpd: any) => cpd.type !== 'readonlyText')
          .map<ResourceVersionCreatorPageModelState['preVersionOptionProperties'][number]>((cpd: any) => {
            return {
              key: cpd.key,
              description: cpd.remark,
              custom: cpd.type === 'editableText' ? 'input' : 'select',
              defaultValue: cpd.defaultValue,
              customOption: cpd.candidateItems.join(','),
            };
          });

        const depResourceIds: string = (data2.dependencies as any[]).map<string>((dr) => dr.resourceId).join(',');

        if (depResourceIds.length > 0) {
          const params3: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
            resourceIds: depResourceIds,
          };
          const { data: data3 } = yield call(FServiceAPI.Resource.batchInfo, params3);
          // console.log(data2, '#ASGDFASDF');
          const relations: Relationships = data3.map((dd: any) => {
            return {
              id: dd.resourceId,
              children: dd.baseUpcastResources.map((bur: any) => {
                return {
                  id: bur.resourceId,
                };
              }),
            };
          });

          const versions = (data2.dependencies as any[]).map((dr: any) => {
            return {
              id: dr.resourceId,
              versionRange: dr.versionRange,
            };
          });

          preVersionDeps = {
            relationships: relations as any,
            versions: versions as any,
          };
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceType: data.resourceType,
          baseUpcastResources: data.baseUpcastResources,
          latestVersion: data.latestVersion,
          version: resourceVersionCreatorPage.version ? resourceVersionCreatorPage.version : (semver.inc(data.latestVersion, 'patch') || '0.1.0'),
          preVersionBaseProperties,
          preVersionOptionProperties,
          preVersionDeps,
          description,
        },
        // caller: '97293879uoijlkll4823yu4oi234io23hjkfdsasdf',
      });
    },
    * verifyVersionInput({}: VerifyVersionInputAction, { select, put }: EffectsCommandMap) {
      const { resourceInfo, resourceVersionCreatorPage }: ConnectState = yield select(({
                                                                                         resourceInfo,
                                                                                         resourceVersionCreatorPage,
                                                                                       }: ConnectState) => ({
        resourceInfo,
        resourceVersionCreatorPage,
      }));
      let versionErrorText: string = '';
      if (!resourceVersionCreatorPage.version) {
        versionErrorText = '请输入版本号';
      } else if (!semver.valid(resourceVersionCreatorPage.version)) {
        versionErrorText = '版本号不合法';
      } else if (!semver.gt(resourceVersionCreatorPage.version, resourceInfo.info?.latestVersion || '0.0.0')) {
        versionErrorText = resourceInfo.info?.latestVersion ? `必须大于最新版本 ${resourceInfo.info?.latestVersion}` : '必须大于 0.0.0';
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // $version: resourceVersionCreatorPage.$version,
          versionVerify: 2,
          versionErrorText: versionErrorText,
        },
        caller: '97293874823yu4oi234io23hjkfdsasdf++++++=',
      });
    },
    * fetchRawProps({}: FetchRawPropsAction, { select, put, call }: EffectsCommandMap) {
      // console.log('FetchRawPropsAction', 'FetchRawPropsAction09wiofjsdklfsdjlk');
      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      // console.log(resourceVersionCreatorPage.selectedFileSha1, 'resourceVersionCreatorPage.selectedFileSha109ewoijsdikfjls');
      if (!resourceVersionCreatorPage.selectedFileSha1) {
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rawPropertiesState: 'parsing',
        },
      });

      const params: Parameters<typeof FServiceAPI.recombination.getFilesSha1Info>[0] = {
        sha1: [resourceVersionCreatorPage.selectedFileSha1],
      };
      // console.log('*(*********');
      const result: any[] = yield call(FServiceAPI.recombination.getFilesSha1Info, params);
      // console.log(result, 'RRR98wseoidfkldfjsldfkjsdlfjkdslj');

      if (result[0].state === 'success') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rawProperties: Object.entries(result[0].info.metaInfo).map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((rp: any) => {
              return {
                key: rp[0],
                value: rp[0] === 'fileSize' ? FUtil.Format.humanizeSize(rp[1]) : rp[1],
              };
            }),
            rawPropertiesState: 'success',
          },
          caller: '972&&&&*&&*93874823yu4oi234io23hjkfdsasdf',
        });
      }

    },
    * addDeps({ payload: { relationships, versions } }: AddDepsAction, { select, put, call }: EffectsCommandMap) {

      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: true,
        },
        caller: '97()(((((()(293874823yu4oi234io23hjkfdsasdf',
      });

      const existIDs: string[] = resourceVersionCreatorPage.dependencies.map<string>((dd) => dd.id);

      // 本次要添加全部资源 ID
      const allIDs: string[] = [
        ...relationships.map((r) => r.id),
        ...relationships.map((r) => r.children).flat().map((c) => c.id),
      ].filter((id) => !existIDs.includes(id));

      if (allIDs.length === 0) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            depRelationship: [
              ...relationships,
              ...resourceVersionCreatorPage.depRelationship,
            ],
          },
          caller: '$97&*&&293874823yu4oi234io23hjkfdsasdf',
        });
        return;
      }

      // handleResourceBatchInfo({ resourceIDs: allIDs });

      const params: Parameters<typeof handleResourceBatchInfo>[0] = {
        resourceIDs: allIDs,
      };

      // 本次要添加的一些列资源信息
      const data_batchResourceInfo: HandleResourceBatchInfoReturn = yield call(handleResourceBatchInfo, params);
      // console.log(data, 'DDD!@#$@!#$@');

      const params1: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
        subjectIds: allIDs.join(','),
        licenseeId: resourceVersionCreatorPage.resourceId,
        subjectType: 1,
        licenseeIdentityType: 1,
        isLoadPolicyInfo: 1,
      };
      const { data: data_batchContracts } = yield call(FServiceAPI.Contract.batchContracts, params1);
      // console.log(data1, 'data1 109234ui2o34');

      // 如果有合约，就获取合约应用的版本
      let coverageVersions: any[] = [];
      if (data_batchContracts.length > 0) {
        const params2: Parameters<typeof FServiceAPI.Resource.batchGetCoverageVersions>[0] = {
          resourceId: resourceVersionCreatorPage.resourceId,
          contractIds: data_batchContracts.map((ci: any) => ci.contractId).join(','),
        };
        const { data: data2 } = yield call(FServiceAPI.Resource.batchGetCoverageVersions, params2);
        coverageVersions = data2;
      }

      const allUserID: number[] = data_batchResourceInfo.map<number>((dbr) => {
        return dbr.userId;
      });

      const params3: Parameters<typeof FServiceAPI.User.batchUserList>[0] = {
        userIds: allUserID.join(','),
      };

      const { data: data_batchUserList } = yield call(FServiceAPI.User.batchUserList, params3);
      // console.log(data_batchUserList, 'data_batchUserList09io3jlksfdfjlsdkjflsdkjflkj');
      // status: 1
      // tokenSn: "f609bc141b4c4b2d8a7cc3c0b2ca1fb0"
      // userId: 50061
      // 组织添加的依赖数据
      const dependencies: DepResources = data_batchResourceInfo
        .map<DepResources[number]>((dr) => {
          // console.log(data1, 'data112323423');
          const ownerUserInfo = data_batchUserList.find((dbu: any) => {
            return dbu.userId === dr.userId;
          });

          const depC: any[] = data_batchContracts.filter((dc: any) => {
            return dc.licensorId === dr.resourceId && dc.status === 0;
          });
          // console.log(depC, 'depC902342lk3jlk');
          const allDepCIDs: string[] = depC.map<string>((adcs: any) => adcs.policyId);
          const theVersion = versions?.find((v) => v.id === dr.resourceId);

          const isUpthrow: boolean = !!resourceVersionCreatorPage.baseUpcastResources.find((b) => dr.resourceId === b.resourceId);

          return {
            id: dr.resourceId,
            title: dr.resourceName,
            resourceType: dr.resourceType,
            status: isUpthrow ? 4 : dr.status,
            error: isUpthrow
              ? 'upThrow'
              : dr.status === 0
                ? 'offline'
                : (dr.status & 2) === 2
                  ? 'freeze'
                  : '',
            warning: ownerUserInfo.status === 1
              ? 'ownerFreeze'
              : dr.authProblem
                ? 'authException'
                : '',
            versionRange: theVersion ? theVersion.versionRange : '^' + dr.latestVersion,
            versions: dr.resourceVersions.map((version: any) => version.version),
            upthrow: isUpthrow,
            upthrowDisabled: !!resourceVersionCreatorPage.latestVersion,
            authProblem: dr.authProblem,
            enableReuseContracts: depC
              .map<ResourceVersionCreatorPageModelState['dependencies'][number]['enableReuseContracts'][number]>((c: any) => {
                return {
                  checked: false,
                  id: c.contractId,
                  policyId: c.policyId,
                  title: c.contractName,
                  status: c.status,
                  code: c.policyInfo.policyText,
                  date: moment(c.createDate).format('YYYY-MM-DD HH:mm'),
                  versions: coverageVersions.find((cv) => c.contractId === cv.contractId)
                    .versions.map((ccc: any) => ccc.version),
                };
              }),
            terminatedContractIDs: data_batchContracts
              .filter((dc: any) => {
                return dc.licensorId === dr.resourceId && dc.status === 1;
              }).map((dc: any) => {
                return dc.contractId;
              }),
            enabledPolicies: dr.policies
              .filter((policy: any) => !allDepCIDs.includes(policy.policyId) && policy.status === 1)
              .map((policy: any) => {
                // console.log(policy, 'PPPPafwe98iokl');
                return {
                  checked: false,
                  id: policy.policyId,
                  title: policy.policyName,
                  code: policy.policyText,
                  status: policy.status,
                  policyFullInfo: policy,
                };
              }),
          };
        });

      // 处理循环依赖的资源
      const params2: BatchCycleDependencyCheckParams = {
        resourceId: resourceVersionCreatorPage.resourceId,
        dependencies: dependencies.map<{ resourceId: string; versionRange: string; }>((d) => {
          return {
            resourceId: d.id,
            versionRange: d.versionRange,
          };
        }),
      };
      const cycleDependencyResourceID: string[] = yield call(batchCycleDependencyCheck, params2);
      // console.log(cycleDependencyResourceID, 'data229380uidfs');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          depRelationship: [
            ...relationships,
            ...resourceVersionCreatorPage.depRelationship,
          ],
          dependencies: [
            ...resourceVersionCreatorPage.dependencies,
            ...dependencies.map<DepResources[number]>((d) => {
              if (!cycleDependencyResourceID.includes(d.id)) {
                return d;
              }
              return {
                ...d,
                status: 2,
                error: 'cyclicDependency',
              };
            }),
          ],
          depActivatedID: resourceVersionCreatorPage.depActivatedID ? resourceVersionCreatorPage.depActivatedID : relationships[0].id,
        },
        caller: '9##$#$%$7293874823yu4oi234io23hjkfdsasdf',
      });
    },
    * dddDepsByMainIDs({ payload }: AddDepsByMainIDsAction, { call, put }: EffectsCommandMap) {
      const params: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
        resourceIds: payload.join(','),
      };
      const { data } = yield call(FServiceAPI.Resource.batchInfo, params);
      // console.log(data, 'data198023h');
      yield put<AddDepsAction>({
        type: 'addDeps',
        payload: {
          relationships: data.map((d: any) => {
            return {
              id: d.resourceId,
              children: d.baseUpcastResources.map((c: any) => {
                return {
                  id: c.resourceId,
                };
              }),
            };
          }),
        },
      });
    },
    * handleObjectInfo({ payload }: HandleObjectInfoAction, { select, put, call }: EffectsCommandMap) {
      // console.log(payload, '!!!@@@#$@#$#$');
      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      const params: Parameters<typeof FServiceAPI.Storage.objectDetails>[0] = {
        objectIdOrName: payload,
      };
      const { data } = yield call(FServiceAPI.Storage.objectDetails, params);
      // console.log(data, 'OOOOasdfadsfOOOOasdfadsf');

      // const params4: Parameters<typeof FServiceAPI.Storage.fileProperty>[0] = {
      //   sha1: data.sha1,
      //   // resourceType: resourceVersionCreatorPage.resourceType,
      // };
      //
      // const { data: data4 } = yield call(FServiceAPI.Storage.fileProperty, params4);
      // console.log(data4, '@#@#@#@#@#@##@$@#$data4');
      // if (!data4) {
      //   yield put<ChangeAction>({
      //     type: 'change',
      //     payload: {
      //       selectedFileStatus: 2,
      //     },
      //   });
      // } else {
      const params4: Parameters<typeof FServiceAPI.recombination.getFilesSha1Info>[0] = {
        sha1: data.sha1,
      };
      const data4: any[] = yield call(FServiceAPI.recombination.getFilesSha1Info, params4);
      // console.log(data4, 'data4093oiwjsdflsdkfjsdlfkjl')

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rawProperties: Object.entries(data4[0].info.metaInfo).map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((rp: any) => {
            // console.log(rp, 'rprprprprpyu2341234');
            return {
              key: rp[0],
              value: rp[0] === 'fileSize' ? FUtil.Format.humanizeSize(rp[1]) : rp[1],
            };
          }),
          baseProperties: (data.customPropertyDescriptors as any[])
            .filter((cpd: any) => cpd.type === 'readonlyText')
            .map<ResourceVersionCreatorPageModelState['baseProperties'][number]>((cpd: any) => {
              return {
                key: cpd.key,
                value: cpd.defaultValue,
                description: cpd.remark,
              };
            }),
          customOptionsData: (data.customPropertyDescriptors as any[])
            .filter((cpd: any) => cpd.type !== 'readonlyText')
            .map<ResourceVersionCreatorPageModelState['customOptionsData'][number]>((cpd: any) => {
              return {
                key: cpd.key,
                // keyError: '',
                description: cpd.remark,
                // descriptionError: '',
                custom: cpd.type === 'editableText' ? 'input' : 'select',
                defaultValue: cpd.defaultValue,
                // defaultValueError: '',
                customOption: cpd.candidateItems.join(','),
                // customOptionError: '',
              };
            }),
        },
      });
      // }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          depRelationship: [],
          dependencies: [],
        },
        caller: '972^&YUGJHGHJ93874823yu4oi234io23hjkfdsasdf',
      });

      const depResources: { name: string; versionRange: string; }[] = data.dependencies.filter((dd: any) => dd.type === 'resource');
      // const depResources: { name: string; versionRange: string; }[] = data.dependencies.filter((dd: any) => true);

      if (depResources.length > 0) {

        const params2: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
          resourceNames: depResources.map<string>((dr) => dr.name).join(','),
        };
        const { data: data2 } = yield call(FServiceAPI.Resource.batchInfo, params2);
        // console.log(data2, '#ASGDFASDF');
        const relations = data2.map((dd: any) => {
          return {
            id: dd.resourceId,
            children: dd.baseUpcastResources.map((bur: any) => {
              return {
                id: bur.resourceId,
              };
            }),
          };
        });

        const versions = depResources.map((dr) => {
          const resource = data2.find((d2: any) => d2.resourceName);
          return {
            id: resource.resourceId,
            versionRange: dr.versionRange,
          };
        });

        yield put<AddDepsAction>({
          type: 'addDeps',
          payload: {
            relationships: relations,
            versions: versions,
          },
        });
      }

      const depObjects: any[] = data.dependencies.filter((dd: any) => dd.type === 'object');
      // console.log(depObjects, '9023jlkdfsj');
      if (depObjects.length > 0) {
        const allDepObjects: ResourceVersionCreatorPageModelState['dependencies'] = depObjects.map((dpo: any) => {
          // console.log(dpo, 'dpo!@#$@#$!$@#$!@#$');
          return {
            id: dpo.name,
            title: dpo.name,
            resourceType: [],
            status: 3,
            error: 'storageObject',
            warning: '',
            versionRange: '',
            versions: [],
            upthrow: false,
            upthrowDisabled: true,
            authProblem: false,
            enableReuseContracts: [],
            terminatedContractIDs: [],
            enabledPolicies: [],
          };
        });
        const allRelationship: ResourceVersionCreatorPageModelState['depRelationship'] = allDepObjects.map((oo) => {
          return { id: oo.id, children: [] };
        });
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            dependencies: allDepObjects,
            depRelationship: allRelationship,
          },
          caller: '97293^%^$^%$$874823yu4oi234io23hjkfdsasdf',
        });
      }
    },
    * deleteDependencyByID({ payload }: DeleteDependencyByIDAction, { select, put }: EffectsCommandMap) {
      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));
      const depRelationship: ResourceVersionCreatorPageModelState['depRelationship'] = resourceVersionCreatorPage.depRelationship.filter((drs) => drs.id !== payload);
      const allUsedIDs: string[] = [
        ...depRelationship.map<string>((drs) => drs.id),
        ...depRelationship.map((drs) => drs.children).flat().map<string>((drs) => drs.id),
      ];
      const dependencies: ResourceVersionCreatorPageModelState['dependencies'] = resourceVersionCreatorPage.dependencies.filter((dp) => allUsedIDs.includes(dp.id));

      let depActivatedID: string = resourceVersionCreatorPage.depActivatedID;
      if (!allUsedIDs.includes(depActivatedID)) {
        depActivatedID = allUsedIDs[0] || '';
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          depRelationship,
          dependencies,
          depActivatedID,
        },
        caller: '972%$^%^%^%^93874823yu4oi234io23hjkfdsasdf',
      });
    },
    * importLastVersionData({ payload }: ImportLastVersionDataAction, { call, select, put }: EffectsCommandMap) {
      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      // preVersionBaseProperties,
      //   preVersionOptionProperties,
      if (payload === 'baseProps') {
        const allKeys: string[] = [
          ...resourceVersionCreatorPage.rawProperties.map((rp) => {
            return rp.key;
          }),
          ...resourceVersionCreatorPage.baseProperties.map((pp) => {
            return pp.key;
          }),
          ...resourceVersionCreatorPage.customOptionsData.map((pp) => {
            return pp.key;
          }),
        ];
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            basePropertiesEditorVisible: true,
            basePropertiesEditorData: resourceVersionCreatorPage.preVersionBaseProperties
              .map<ResourceVersionCreatorPageModelState['basePropertiesEditorData'][number]>((cpd) => {
                return {
                  key: cpd.key,
                  keyError: allKeys.includes(cpd.key) ? '键不能重复' : '',
                  value: cpd.value,
                  valueError: '',
                  description: cpd.description,
                  descriptionError: '',
                };
              }),
          },
          caller: '972938(**&^(*&^*(^74823yu4oi234io23hjkfdsasdf',
        });
        return;
      }

      if (payload === 'optionProps') {
        const allKeys: string[] = [
          ...resourceVersionCreatorPage.rawProperties.map((rp) => {
            return rp.key;
          }),
          ...resourceVersionCreatorPage.baseProperties.map((pp) => {
            return pp.key;
          }),
          ...resourceVersionCreatorPage.customOptionsData.map((pp) => {
            return pp.key;
          }),
        ];
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            customOptionsEditorDataSource: resourceVersionCreatorPage.preVersionOptionProperties
              .map<ResourceVersionCreatorPageModelState['customOptionsEditorDataSource'][number]>((cpd) => {
                return {
                  key: cpd.key,
                  keyError: allKeys.includes(cpd.key) ? '键不能重复' : '',
                  description: cpd.description,
                  descriptionError: '',
                  custom: cpd.custom,
                  defaultValue: cpd.defaultValue,
                  defaultValueError: '',
                  customOption: cpd.customOption,
                  customOptionError: '',
                };
              }),
            customOptionsEditorVisible: true,
          },
          caller: '97293874823yu4oi234io23hjkfdsasd98890698678&*^&^&f',
        });
        return;
      }

      if (payload === 'deps') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            depRelationship: [],
            dependencies: [],
          },
          caller: '9729$%*(&*(&()**(W#$#$3874823yu4oi234io23hjkfdsasdf',
        });

        yield put<AddDepsAction>({
          type: 'addDeps',
          payload: {
            relationships: resourceVersionCreatorPage.preVersionDeps.relationships,
            versions: resourceVersionCreatorPage.preVersionDeps.versions,
          },
        });
      }
    },
    * initModelState({}: InitModelStatesAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
        caller: '97%^%^%^^^293874823yu4oi234io23hjkfdsasdf',
      });
    },
  },

  reducers: {
    change(state, { payload, caller }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {

    },
  },

};

export default Model;

// 批量检查是否循环依赖，返回循环依赖的 ID
interface BatchCycleDependencyCheckParams {
  resourceId: string;
  dependencies: {
    resourceId: string;
    versionRange: string;
  }[];
}

async function batchCycleDependencyCheck({
                                           resourceId,
                                           dependencies,
                                         }: BatchCycleDependencyCheckParams): Promise<string[]> {
  const promises: Promise<any>[] = [];
  for (const dependency of dependencies) {
    const params: Parameters<typeof FServiceAPI.Resource.cycleDependencyCheck>[0] = {
      resourceId: resourceId,
      dependencies: [{
        resourceId: dependency.resourceId,
        versionRange: dependency.versionRange,
      }],
    };
    promises.push(FServiceAPI.Resource.cycleDependencyCheck(params));
  }
  const results = await Promise.all(promises);

  const resourceIDs: string[] = [];
  // console.log(results, 'results12390j');
  for (const [index, result] of Object.entries(results)) {
    // console.log(index, value);
    const { data } = result;
    if (!data) {
      resourceIDs.push(dependencies[Number(index)].resourceId);
    }
  }
  return resourceIDs;
}

interface HandledDraftParamsType {
  resourceID: string;
}

async function handledDraft({ resourceID }: HandledDraftParamsType): Promise<ResourceVersionCreatorPageModelState | null> {
  const params3: Parameters<typeof FServiceAPI.Resource.lookDraft>[0] = {
    resourceId: resourceID,
  };

  const { data: data3 } = await FServiceAPI.Resource.lookDraft(params3);

  // console.log(data3, 'dat2342890fj;lkasdf;adsjf;lfda');
  if (!data3) {
    return null;
  }

  const draftData: ResourceVersionCreatorPageModelState = data3.draftData;

  // 本次要添加全部资源 ID
  const allIDs: string[] = draftData.dependencies.map((d) => d.id);

  // const params: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
  //   resourceIds: allIDs.join(','),
  //   isLoadPolicyInfo: 1,
  //   isLoadLatestVersionInfo: 1,
  // };
  //
  // const { data: data_batchResourceInfo } = await FServiceAPI.Resource.batchInfo(params);
  const params: Parameters<typeof handleResourceBatchInfo>[0] = {
    resourceIDs: allIDs,
  };

  // 本次要添加的一些列资源信息
  const data_batchResourceInfo: HandleResourceBatchInfoReturn = await handleResourceBatchInfo(params);
  console.log(data_batchResourceInfo, 'data_batchResourceInfo');

  const params1: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
    subjectIds: allIDs.join(','),
    licenseeId: resourceID,
    subjectType: 1,
    licenseeIdentityType: 1,
    isLoadPolicyInfo: 1,
  };
  const { data: data1 } = await FServiceAPI.Contract.batchContracts(params1);
  // console.log(data1, 'data1 109234ui2o34');

  // 如果有合约，就获取合约应用的版本
  let coverageVersions: any[] = [];
  if (data1.length > 0) {
    const params2: Parameters<typeof FServiceAPI.Resource.batchGetCoverageVersions>[0] = {
      resourceId: resourceID,
      contractIds: data1.map((ci: any) => ci.contractId).join(','),
    };
    const { data: data2 } = await FServiceAPI.Resource.batchGetCoverageVersions(params2);
    coverageVersions = data2;
  }

  const allUserID: number[] = data_batchResourceInfo.map<number>((dbr) => {
    return dbr.userId;
  });

  const params4: Parameters<typeof FServiceAPI.User.batchUserList>[0] = {
    userIds: allUserID.join(','),
  };

  const { data: data_batchUserList } = await FServiceAPI.User.batchUserList(params4);
  // 组织添加的依赖数据
  const dependencies: DepResources = data_batchResourceInfo.map<DepResources[number]>((dr) => {
    const ownerUserInfo = data_batchUserList.find((dbu: any) => {
      return dbu.userId === dr.userId;
    });

    const depC: any[] = data1.filter((dc: any) => {
      return dc.licensorId === dr.resourceId && dc.status === 0;
    });
    const allDepCIDs: string[] = depC.map<string>((adcs) => adcs.policyId);
    // const theVersion = versions?.find((v) => v.id === dr.resourceId);
    const theVersion = draftData.dependencies.find((v) => v.id === dr.resourceId);

    const isUpthrow: boolean = draftData.baseUpcastResources.some((b) => dr.resourceId === b.resourceId);

    return {
      id: dr.resourceId,
      title: dr.resourceName,
      resourceType: dr.resourceType,
      status: isUpthrow ? 4 : dr.status,

      // status: isUpthrow ? 4 : dr.status,
      error: isUpthrow
        ? 'upThrow'
        : dr.status === 0
          ? 'offline'
          : (dr.status & 2) === 2
            ? 'freeze'
            : '',
      warning: ownerUserInfo.status === 1
        ? 'ownerFreeze'
        : dr.authProblem
          ? 'authException'
          : '',

      versionRange: theVersion ? theVersion.versionRange : '^' + dr.latestVersion,
      versions: dr.resourceVersions.map((version: any) => version.version),
      upthrow: isUpthrow,
      upthrowDisabled: !!draftData.latestVersion,
      authProblem: dr.authProblem,
      enableReuseContracts: depC.map<ResourceVersionCreatorPageModelState['dependencies'][number]['enableReuseContracts'][number]>((c: any) => {
        return {
          checked: false,
          id: c.contractId,
          policyId: c.policyId,
          title: c.contractName,
          status: c.status,
          code: c.policyInfo.policyText,
          date: moment(c.createDate).format('YYYY-MM-DD HH:mm'),
          versions: coverageVersions
            .find((cv) => c.contractId === cv.contractId)
            .versions.map((ccc: any) => ccc.version),
        };
      }),
      terminatedContractIDs: data1
        .filter((dc: any) => {
          return dc.licensorId === dr.resourceId && dc.status === 1;
        }).map((dc: any) => {
          return dc.contractId;
        }),
      enabledPolicies: dr.policies
        .filter((policy: any) => !allDepCIDs.includes(policy.policyId) && policy.status === 1)
        .map((policy: any) => {
          // console.log(policy, 'PPPPafwe98iokl');
          return {
            checked: false,
            id: policy.policyId,
            title: policy.policyName,
            code: policy.policyText,
            status: policy.status,
            policyFullInfo: policy,
          };
        }),
    };
  });

  return {
    ...data3.draftData,
    description: BraftEditor.createEditorState(draftData.description),
    dataIsDirty: false,
    dependencies: dependencies,
  };
}

interface HandleResourceBatchInfoParams {
  resourceIDs: string[];
}

type HandleResourceBatchInfoReturn = {
  resourceId: string;
  resourceName: string;
  resourceType: string[];
  latestVersion: string;
  status: 0 | 1;
  policies: {
    policyId: string;
    policyName: string;
    policyText: string;
    status: 0 | 1;
    // policyFullInfo: PolicyFullInfo_Type
  }[];
  resourceVersions: {
    createDate: string;
    version: string;
  }[];
  userId: number;
  authProblem: boolean;
}[];

async function handleResourceBatchInfo({ resourceIDs }: HandleResourceBatchInfoParams): Promise<HandleResourceBatchInfoReturn> {

  if (resourceIDs.length === 0) {
    return [];
  }

  const params: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
    resourceIds: resourceIDs.join(','),
    isLoadPolicyInfo: 1,
    isLoadLatestVersionInfo: 1,
    // projection: 'resourceId,resourceName,resourceType,latestVersion,status,policies,resourceVersions,userId',
    // isLoadFreezeReason: 1,
    isTranslate: 1,
  };

  // 本次要添加的一些列资源信息
  // const { data: data_batchResourceInfo }: { data: Omit<HandleResourceBatchInfoReturn, 'authProblem'> } = await FServiceAPI.Resource.batchInfo(params);
  const { data: data_batchResourceInfo }: { data: any[] } = await FServiceAPI.Resource.batchInfo(params);

  // console.log(data_batchResourceInfo, 'data_batchResourceInfo 238998sdhfkjshdfksdf');

  const needGetAuthProblemResourceIDs: string[] = data_batchResourceInfo.filter((dbri) => {
    return dbri.latestVersion !== '';
  }).map((dbri) => {
    return dbri.resourceId;
  });
  let resourceAuthProblems: {
    isAuth: boolean;
    resourceId: string;
  }[] = [];
  if (needGetAuthProblemResourceIDs.length > 0) {
    const params1: Parameters<typeof FServiceAPI.Resource.batchAuth>[0] = {
      resourceIds: needGetAuthProblemResourceIDs.join(','),
    };
    const { data } = await FServiceAPI.Resource.batchAuth(params1);
    // console.log(data_BatchAuth, 'data_BatchAuth @@@34234wfgsrd');
    resourceAuthProblems = data;
  }

  return data_batchResourceInfo.map((dbri) => {
    const authP = resourceAuthProblems.find((rap) => {
      return rap.resourceId === dbri.resourceId;
    });
    return {
      ...dbri,
      authProblem: authP ? !authP.isAuth : false,
      // authProblem: true,
    };
  });
}

// interface FileInfo {
//   sha1: string;
//   state: 'success' | 'fail' | 'nonentity';
//   info: {
//     [key: string]: any;
//   };
// }
//
// interface GetFileInfosBySha1Params {
//   sha1: string[];
// }
//
// export async function getFilesSha1Info({ sha1 }: GetFileInfosBySha1Params, cdPartially: (s: any[]) => void = () => undefined): Promise<FileInfo[]> {
//   if (sha1.length === 0) {
//     return [];
//   }
//
//   let needHandleSha1: string[] = [...sha1];
//   console.log(needHandleSha1, 'needHandleSha109ow3iejflsdkfjsdlk');
//   let allData: FileInfo[] = [];
//
//   while (true) {
//     console.log(needHandleSha1.join(','), 'needHandleSha1.join()90ojlskdfjsdlk');
//     const { data } = await FServiceAPI.Storage.filesListInfo({
//       sha1: needHandleSha1.join(','),
//     });
//     needHandleSha1 = data
//       .filter((d: any) => {
//         return d.metaAnalyzeStatus && d.metaAnalyzeStatus === 1;
//       })
//       .map((d: any) => {
//         return d.sha1;
//       });
//     const finishedInfo: FileInfo[] = data
//       .filter((d: any) => {
//         return !d.metaAnalyzeStatus || d.metaAnalyzeStatus !== 1;
//       })
//       .map((d: any) => {
//         let state: 'success' | 'fail' | 'nonentity' = 'fail';
//         if (!d.metaAnalyzeStatus) {
//           state = 'nonentity';
//         } else if (d.metaAnalyzeStatus === 2) {
//           state = 'success';
//         }
//         return {
//           sha1: d.sha1,
//           state,
//           info: d,
//         };
//       });
//     cdPartially && cdPartially(finishedInfo);
//     allData = [
//       ...allData,
//       ...finishedInfo,
//     ];
//
//     if (needHandleSha1.length === 0) {
//       break;
//     }
//     await FUtil.Tool.promiseSleep(3000);
//   }
//   return allData;
// }
