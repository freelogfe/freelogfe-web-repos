import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState } from '@/models/connect';
import { history } from 'umi';
import BraftEditor, { EditorState } from 'braft-editor';
import fMessage from '@/components/fMessage';
import { FetchDataSourceAction, FetchDraftDataAction } from '@/models/resourceInfo';
import * as semver from 'semver';
// import moment from 'moment';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
// import { PolicyFullInfo_Type } from '@/type/contractTypes';
import { fileAttrUnits } from '@/utils/format';
import { getFilesSha1Info } from '@/utils/service';
import { getProcessor } from '@/pages/resource/version/creator/$id';
import { IResourceCreateVersionDraft } from '@/type/resourceTypes';
// import fAddFileBaseProps from '@/components/fAddFileBaseProps';

// export type DepResources = {
//   id: string;
//   title: string;
//   resourceType: string[];
//   status: 0 /*该资源已下线，无法获取授权。*/
//     | 1
//     | 2 /*循环依赖不支持授权。*/
//     | 3 /*该依赖是存储空间对象，无法获取授权。*/
//     | 4 /*上抛资源，无法获取授权*/;
//   error: '' | 'offline' | 'cyclicDependency' | 'storageObject' | 'upThrow' | 'freeze';
//   warning: '' | 'authException' | 'ownerFreeze';
//   versionRange: string;
//   versions: string[];
//   upthrow: boolean;
//   upthrowDisabled: boolean;
//   authProblem: boolean;
//   enableReuseContracts: {
//     checked: boolean;
//     id: string;
//     policyId: string;
//     title: string;
//     // status: 'executing' | 'stopped';
//     status: 0 | 1 | 2;
//     code: string;
//     date: string;
//     versions: string[];
//   }[];
//   terminatedContractIDs: string[];
//   enabledPolicies: {
//     checked: boolean;
//     id: string;
//     title: string;
//     code: string;
//     status: 0 | 1;
//     policyFullInfo: PolicyFullInfo_Type;
//   }[];
// }[];

// export type Relationships = {
//   id: string;
//   children: Readonly<{
//     id: string;
//   }>[];
// }[];

// export interface IDraft {
//   versionInput: string;
//   selectedFileInfo: {
//     name: string;
//     sha1: string;
//     from: string;
//   } | null;
//   baseProperties: {
//     key: string;
//     value: string;
//     description: string;
//   }[];
//   customOptionsData: {
//     key: string;
//     description: string;
//     custom: 'input' | 'select';
//     defaultValue: string;
//     customOption: string;
//   }[];
//   directDependencies: {
//     id: string;
//     name: string;
//     type: 'resource' | 'object';
//     versionRange?: string;
//   }[];
//   descriptionEditorInput: string;
// }

export interface ResourceVersionCreatorPageModelState {
  resourceId: string;
  latestVersion: string;
  resourceType: string[];
  baseUpcastResources: {
    resourceId: string;
    resourceName: string;
  }[];

  version: string;

  selectedFileInfo: {
    name: string;
    sha1: string;
    from: string;
  } | null;

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

  customOptionsDataVisible: boolean;
  customOptionsData: {
    key: string;
    description: string;
    custom: 'input' | 'select';
    defaultValue: string;
    customOption: string;
  }[];

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

  preVersionDirectDependencies: {
    id: string;
    name: string;
    type: 'resource' | 'object';
    versionRange?: string;
  }[];

  // preVersionDeps: {
  // relationships: Relationships;
  // versions: { id: string; versionRange: string }[];
  // };

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

export interface OnClick_CreateVersionBtn_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onClick_CreateVersionBtn';
}

export interface OnClick_SaveCacheBtn_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onClick_SaveCacheBtn';
}

export interface OnSuccess_ObjectFile_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onSuccess_ObjectFile';
  payload: {
    name: string;
    sha1: string;
    from: string;
  };
}

export interface OnDelete_ObjectFile_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onDelete_ObjectFile';
}

export interface FetchDraftAction extends AnyAction {
  type: 'fetchDraft';
}

export interface FetchResourceInfoAction extends AnyAction {
  type: 'fetchResourceInfo';
}

// export interface VerifyVersionInputAction extends AnyAction {
//   type: 'resourceVersionCreatorPage/verifyVersionInput' | 'verifyVersionInput';
//   // payload: string;
// }

export interface FetchRawPropsAction extends AnyAction {
  type: 'resourceVersionCreatorPage/fetchRawProps';
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
    onClick_CreateVersionBtn: (action: OnClick_CreateVersionBtn_Action, effects: EffectsCommandMap) => void;
    onClick_SaveCacheBtn: (action: OnClick_SaveCacheBtn_Action, effects: EffectsCommandMap) => void;
    onSuccess_ObjectFile: (action: OnSuccess_ObjectFile_Action, effects: EffectsCommandMap) => void;
    onDelete_ObjectFile: (action: OnDelete_ObjectFile_Action, effects: EffectsCommandMap) => void;

    fetchDraft: (action: FetchDraftAction, effects: EffectsCommandMap) => void;
    fetchResourceInfo: (action: FetchResourceInfoAction, effects: EffectsCommandMap) => void;
    fetchRawProps: (action: FetchRawPropsAction, effects: EffectsCommandMap) => void;
    // verifyVersionInput: (action: VerifyVersionInputAction, effects: EffectsCommandMap) => void;
    importLastVersionData: (action: ImportLastVersionDataAction, effects: EffectsCommandMap) => void;
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

  selectedFileInfo: null,

  rawProperties: [],
  rawPropertiesState: 'success',

  baseProperties: [],

  customOptionsDataVisible: false,
  customOptionsData: [],

  description: BraftEditor.createEditorState(''),

  preVersionBaseProperties: [],
  preVersionOptionProperties: [],
  preVersionDirectDependencies: [],

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

      // const params: HandledDraftParamsType = {
      //   resourceID: payload.resourceID,
      // };

      // const result: ResourceVersionCreatorPageModelState | null = yield call(handledDraft, params);

      // if (result) {
      //   yield put<ChangeAction>({
      //     type: 'change',
      //     payload: {
      //       ...result,
      //     },
      //   });
      // }

    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {
      window.onbeforeunload = null;
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
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
    * onClick_CreateVersionBtn({}: OnClick_CreateVersionBtn_Action, { put, call, select }: EffectsCommandMap) {

      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      if (!resourceVersionCreatorPage.selectedFileInfo) {
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: false,
        },
      });
      // const { processor } = yield call(getProcessor);
      // console.log(processor, 'processoriosjdlfkjsdlfjsdlkfjl');
      // return;
      const baseUpcastResourceIds: any[] = [];
      const resolveResources: any[] = [];
      const directlyDependentIds: string[] = [];
      const params: Parameters<typeof FServiceAPI.Resource.createVersion>[0] = {
        resourceId: resourceVersionCreatorPage.resourceId,
        version: resourceVersionCreatorPage.version,
        fileSha1: resourceVersionCreatorPage.selectedFileInfo.sha1,
        filename: resourceVersionCreatorPage.selectedFileInfo.name,
        baseUpcastResources: baseUpcastResourceIds.map((baseUpId) => ({ resourceId: baseUpId })),
        dependencies: [],
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

      const { ret, errCode, data } = yield call(FServiceAPI.Resource.createVersion, params);
      if (ret !== 0 || errCode !== 0 || !data) {
        self._czc?.push(['_trackEvent', '版本发行页', '发行', '', 0]);
        fMessage('创建失败', 'error');
        return;
      }
      self._czc?.push(['_trackEvent', '版本发行页', '发行', '', 1]);
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
    * onClick_SaveCacheBtn({}: OnClick_SaveCacheBtn_Action, { put, select, call }: EffectsCommandMap) {

      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      const draftData: IResourceCreateVersionDraft = {
        versionInput: resourceVersionCreatorPage.version,
        selectedFileInfo: resourceVersionCreatorPage.selectedFileInfo,
        baseProperties: resourceVersionCreatorPage.baseProperties,
        customOptionsData: resourceVersionCreatorPage.customOptionsData,
        directDependencies: [],
        descriptionEditorInput: resourceVersionCreatorPage.description.toHTML(),
      };

      const params: Parameters<typeof FServiceAPI.Resource.saveVersionsDraft>[0] = {
        resourceId: resourceVersionCreatorPage.resourceId,
        draftData: draftData,
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
    * onSuccess_ObjectFile({ payload }: OnSuccess_ObjectFile_Action, { put, call }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          selectedFileInfo: payload,
        },
      });

      const { error, result } = yield call(getFilesSha1Info, {
        sha1: [payload.sha1],
      });

      // console.log(result, 'result90iojwesflksdjflksdjl');

      if (error !== '') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rawProperties: [],
          },
          // caller: '972&&&&*&&*93874823yu4oi234io23hjkfdsasdf',
        });
        return fMessage(error, 'error');
      }

      if (result[0].state === 'fail') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rawProperties: [],
          },
          // caller: '972&&&&*&&*93874823yu4oi234io23hjkfdsasdf',
        });
        return fMessage('文件解析失败', 'error');
      }

      if (result[0].state === 'success') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rawProperties: Object.entries(result[0].info.metaInfo).map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((rp: any) => {
              return {
                key: rp[0],
                // value: rp[0] === 'fileSize' ? FUtil.Format.humanizeSize(rp[1]) : rp[1],
                value: fileAttrUnits[rp[0]] ? fileAttrUnits[rp[0]](rp[1]) : rp[1],
              };
            }),
            rawPropertiesState: 'success',
          },
        });
      }
    },
    * onDelete_ObjectFile({}: OnDelete_ObjectFile_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          selectedFileInfo: null,
          rawProperties: [],
        },
      });
    },
    * fetchDraft({}: FetchDraftAction, { call, put, select }: EffectsCommandMap) {

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
      let preVersionDirectDependencies: ResourceVersionCreatorPageModelState['preVersionDirectDependencies'] = [];
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
          const relations: any[] = data3.map((dd: any) => {
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

          // preVersionDeps = {
          //   relationships: relations as any,
          //   versions: versions as any,
          // };
          preVersionDirectDependencies = [];
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
          preVersionDirectDependencies,
          description,
        },
      });

      // yield put<OnClick_SaveCacheBtn_Action>({
      //   type: 'resourceVersionCreatorPage/onClick_SaveCacheBtn',
      // });
    },
    // * verifyVersionInput({}: VerifyVersionInputAction, { select, put }: EffectsCommandMap) {
    //   const { resourceInfo, resourceVersionCreatorPage }: ConnectState = yield select(({
    //                                                                                      resourceInfo,
    //                                                                                      resourceVersionCreatorPage,
    //                                                                                    }: ConnectState) => ({
    //     resourceInfo,
    //     resourceVersionCreatorPage,
    //   }));
    //   let versionErrorText: string = '';
    //   if (!resourceVersionCreatorPage.version) {
    //     versionErrorText = '请输入版本号';
    //   } else if (!semver.valid(resourceVersionCreatorPage.version)) {
    //     versionErrorText = '版本号不合法';
    //   } else if (!semver.gt(resourceVersionCreatorPage.version, resourceInfo.info?.latestVersion || '0.0.0')) {
    //     versionErrorText = resourceInfo.info?.latestVersion ? `必须大于最新版本 ${resourceInfo.info?.latestVersion}` : '必须大于 0.0.0';
    //   }
    //   yield put<ChangeAction>({
    //     type: 'change',
    //     payload: {
    //       // $version: resourceVersionCreatorPage.$version,
    //       versionVerify: 2,
    //       versionErrorText: versionErrorText,
    //     },
    //   });
    // },
    * fetchRawProps({}: FetchRawPropsAction, { select, put, call }: EffectsCommandMap) {
      // console.log('FetchRawPropsAction', 'FetchRawPropsAction09wiofjsdklfsdjlk');
      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      if (!resourceVersionCreatorPage.selectedFileInfo) {
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rawPropertiesState: 'parsing',
        },
      });

      const params: Parameters<typeof getFilesSha1Info>[0] = {
        sha1: [resourceVersionCreatorPage.selectedFileInfo.sha1],
      };
      // console.log('*(*********');
      const {
        result,
        error,
      }: { result: any[]; error: string; } = yield call(getFilesSha1Info, params);
      // console.log(result, 'RRR98wseoidfkldfjsldfkjsdlfjkdslj');
      if (error !== '') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rawProperties: [],
          },
          // caller: '972&&&&*&&*93874823yu4oi234io23hjkfdsasdf',
        });
        return fMessage(error, 'error');
      }

      if (result[0].state === 'fail') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rawProperties: [],
          },
          // caller: '972&&&&*&&*93874823yu4oi234io23hjkfdsasdf',
        });
        return fMessage('文件解析失败', 'error');
      }

      if (result[0].state === 'success') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rawProperties: Object.entries(result[0].info.metaInfo).map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((rp: any) => {
              return {
                key: rp[0],
                // value: rp[0] === 'fileSize' ? FUtil.Format.humanizeSize(rp[1]) : rp[1],
                value: fileAttrUnits[rp[0]] ? fileAttrUnits[rp[0]](rp[1]) : rp[1],
              };
            }),
            rawPropertiesState: 'success',
          },
        });
      }

    },
    * importLastVersionData({ payload }: ImportLastVersionDataAction, { call, select, put }: EffectsCommandMap) {
      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      // preVersionBaseProperties,
      //   preVersionOptionProperties,
      if (payload === 'baseProps') {


        // const allKeys: string[] = [
        //   ...resourceVersionCreatorPage.rawProperties.map((rp) => {
        //     return rp.key;
        //   }),
        //   ...resourceVersionCreatorPage.baseProperties.map((pp) => {
        //     return pp.key;
        //   }),
        //   ...resourceVersionCreatorPage.customOptionsData.map((pp) => {
        //     return pp.key;
        //   }),
        // ];
        // yield put<ChangeAction>({
        //   type: 'change',
        //   payload: {
        // basePropertiesEditorVisible: true,
        // basePropertiesEditorData: resourceVersionCreatorPage.preVersionBaseProperties
        //   .map<ResourceVersionCreatorPageModelState['basePropertiesEditorData'][number]>((cpd) => {
        //     return {
        //       key: cpd.key,
        //       keyError: allKeys.includes(cpd.key) ? '键不能重复' : '',
        //       value: cpd.value,
        //       valueError: '',
        //       description: cpd.description,
        //       descriptionError: '',
        //     };
        //   }),
        //   },
        //   caller: '972938(**&^(*&^*(^74823yu4oi234io23hjkfdsasdf',
        // });
        // return;
      }

      if (payload === 'optionProps') {
        // const allKeys: string[] = [
        //   ...resourceVersionCreatorPage.rawProperties.map((rp) => {
        //     return rp.key;
        //   }),
        //   ...resourceVersionCreatorPage.baseProperties.map((pp) => {
        //     return pp.key;
        //   }),
        //   ...resourceVersionCreatorPage.customOptionsData.map((pp) => {
        //     return pp.key;
        //   }),
        // ];
        // yield put<ChangeAction>({
        //   type: 'change',
        //   payload: {
        //     customOptionsEditorDataSource: resourceVersionCreatorPage.preVersionOptionProperties
        //       .map<ResourceVersionCreatorPageModelState['customOptionsEditorDataSource'][number]>((cpd) => {
        //         return {
        //           key: cpd.key,
        //           keyError: allKeys.includes(cpd.key) ? '键不能重复' : '',
        //           description: cpd.description,
        //           descriptionError: '',
        //           custom: cpd.custom,
        //           defaultValue: cpd.defaultValue,
        //           defaultValueError: '',
        //           customOption: cpd.customOption,
        //           customOptionError: '',
        //         };
        //       }),
        //     customOptionsEditorVisible: true,
        //   },
        //   caller: '97293874823yu4oi234io23hjkfdsasd98890698678&*^&^&f',
        // });
        return;
      }

      if (payload === 'deps') {
        // yield put<ChangeAction>({
        //   type: 'change',
        //   payload: {
        //     depRelationship: [],
        //     dependencies: [],
        //   },
        //   caller: '9729$%*(&*(&()**(W#$#$3874823yu4oi234io23hjkfdsasdf',
        // });
        //
        // yield put<AddDepsAction>({
        //   type: 'addDeps',
        //   payload: {
        //     relationships: resourceVersionCreatorPage.preVersionDeps.relationships,
        //     versions: resourceVersionCreatorPage.preVersionDeps.versions,
        //   },
        // });
      }
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

// interface HandledDraftParamsType {
//   resourceID: string;
// }

// async function handledDraft({ resourceID }: HandledDraftParamsType): Promise<ResourceVersionCreatorPageModelState | null> {
//   const params3: Parameters<typeof FServiceAPI.Resource.lookDraft>[0] = {
//     resourceId: resourceID,
//   };
//
//   const { data: data3 } = await FServiceAPI.Resource.lookDraft(params3);
//
//   // console.log(data3, 'dat2342890fj;lkasdf;adsjf;lfda');
//   if (!data3) {
//     return null;
//   }
//
//   const draftData: ResourceVersionCreatorPageModelState = data3.draftData;
//
//   // 本次要添加全部资源 ID
//   // const allIDs: string[] = draftData.dependencies.map((d) => d.id);
//
//   // const params: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
//   //   resourceIds: allIDs.join(','),
//   //   isLoadPolicyInfo: 1,
//   //   isLoadLatestVersionInfo: 1,
//   // };
//   //
//   // const { data: data_batchResourceInfo } = await FServiceAPI.Resource.batchInfo(params);
//   const params: Parameters<typeof handleResourceBatchInfo>[0] = {
//     resourceIDs: allIDs,
//   };
//
//   // 本次要添加的一些列资源信息
//   const data_batchResourceInfo: HandleResourceBatchInfoReturn = await handleResourceBatchInfo(params);
//   console.log(data_batchResourceInfo, 'data_batchResourceInfo');
//
//   const params1: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
//     subjectIds: allIDs.join(','),
//     licenseeId: resourceID,
//     subjectType: 1,
//     licenseeIdentityType: 1,
//     isLoadPolicyInfo: 1,
//   };
//   const { data: data1 } = await FServiceAPI.Contract.batchContracts(params1);
//   // console.log(data1, 'data1 109234ui2o34');
//
//   // 如果有合约，就获取合约应用的版本
//   let coverageVersions: any[] = [];
//   if (data1.length > 0) {
//     const params2: Parameters<typeof FServiceAPI.Resource.batchGetCoverageVersions>[0] = {
//       resourceId: resourceID,
//       contractIds: data1.map((ci: any) => ci.contractId).join(','),
//     };
//     const { data: data2 } = await FServiceAPI.Resource.batchGetCoverageVersions(params2);
//     coverageVersions = data2;
//   }
//
//   const allUserID: number[] = data_batchResourceInfo.map<number>((dbr) => {
//     return dbr.userId;
//   });
//
//   const params4: Parameters<typeof FServiceAPI.User.batchUserList>[0] = {
//     userIds: allUserID.join(','),
//   };
//
//   const { data: data_batchUserList } = await FServiceAPI.User.batchUserList(params4);
//   // 组织添加的依赖数据
//   const dependencies: DepResources = data_batchResourceInfo.map<DepResources[number]>((dr) => {
//     const ownerUserInfo = data_batchUserList.find((dbu: any) => {
//       return dbu.userId === dr.userId;
//     });
//
//     const depC: any[] = data1.filter((dc: any) => {
//       return dc.licensorId === dr.resourceId && dc.status === 0;
//     });
//     const allDepCIDs: string[] = depC.map<string>((adcs) => adcs.policyId);
//     // const theVersion = versions?.find((v) => v.id === dr.resourceId);
//     const theVersion = draftData.dependencies.find((v) => v.id === dr.resourceId);
//
//     const isUpthrow: boolean = draftData.baseUpcastResources.some((b) => dr.resourceId === b.resourceId);
//
//     return {
//       id: dr.resourceId,
//       title: dr.resourceName,
//       resourceType: dr.resourceType,
//       status: isUpthrow ? 4 : dr.status,
//
//       // status: isUpthrow ? 4 : dr.status,
//       error: isUpthrow
//         ? 'upThrow'
//         : dr.status === 0
//           ? 'offline'
//           : (dr.status & 2) === 2
//             ? 'freeze'
//             : '',
//       warning: ownerUserInfo.status === 1
//         ? 'ownerFreeze'
//         : dr.authProblem
//           ? 'authException'
//           : '',
//
//       versionRange: theVersion ? theVersion.versionRange : '^' + dr.latestVersion,
//       versions: dr.resourceVersions.map((version: any) => version.version),
//       upthrow: isUpthrow,
//       upthrowDisabled: !!draftData.latestVersion,
//       authProblem: dr.authProblem,
//       enableReuseContracts: depC.map<ResourceVersionCreatorPageModelState['dependencies'][number]['enableReuseContracts'][number]>((c: any) => {
//         return {
//           checked: false,
//           id: c.contractId,
//           policyId: c.policyId,
//           title: c.contractName,
//           status: c.status,
//           code: c.policyInfo.policyText,
//           date: moment(c.createDate).format('YYYY-MM-DD HH:mm'),
//           versions: coverageVersions
//             .find((cv) => c.contractId === cv.contractId)
//             .versions.map((ccc: any) => ccc.version),
//         };
//       }),
//       terminatedContractIDs: data1
//         .filter((dc: any) => {
//           return dc.licensorId === dr.resourceId && dc.status === 1;
//         }).map((dc: any) => {
//           return dc.contractId;
//         }),
//       enabledPolicies: dr.policies
//         .filter((policy: any) => !allDepCIDs.includes(policy.policyId) && policy.status === 1)
//         .map((policy: any) => {
//           // console.log(policy, 'PPPPafwe98iokl');
//           return {
//             checked: false,
//             id: policy.policyId,
//             title: policy.policyName,
//             code: policy.policyText,
//             status: policy.status,
//             policyFullInfo: policy,
//           };
//         }),
//     };
//   });
//
//   return {
//     ...data3.draftData,
//     description: BraftEditor.createEditorState(draftData.description),
//     dataIsDirty: false,
//     dependencies: dependencies,
//   };
// }
