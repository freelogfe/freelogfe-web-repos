import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState } from '@/models/connect';
import { history } from 'umi';
import BraftEditor, { EditorState } from 'braft-editor';
import fMessage from '@/components/fMessage';
import { FetchDataSourceAction, FetchDraftDataAction } from '@/models/resourceInfo';
import * as semver from 'semver';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { fileAttrUnits } from '@/utils/format';
import { getFilesSha1Info } from '@/utils/service';
import { IResourceCreateVersionDraft } from '@/type/resourceTypes';
import { getProcessor } from '@/components/FResourceAuthorizationProcessor';


export interface ResourceVersionCreatorPageModelState {
  resourceInfo: {
    resourceID: string;
    latestVersion: string;
    resourceType: string[];
    baseUpcastResources: {
      resourceID: string;
      resourceName: string;
    }[];
  } | null;

  versionInput: string;

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

  descriptionEditorState: EditorState;

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

export interface OnChange_VersionInput_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_VersionInput';
  payload: {
    value: string;
  };
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

export interface OnTrigger_SaveCache_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onClick_SaveCache';
}

export interface OnTrigger_FetchDraft_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onTrigger_FetchDraft';
}

export interface FetchRawPropsAction extends AnyAction {
  type: 'resourceVersionCreatorPage/fetchRawProps';
}

export interface OnClick_ImportLastVersionDependents_Btn_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onClick_ImportLastVersionDependents_Btn';
}

export interface OnChange_DescriptionEditorState_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_DescriptionEditorState';
  payload: {
    state: EditorState;
  };
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
    onChange_VersionInput: (action: OnChange_VersionInput_Action, effects: EffectsCommandMap) => void;
    onSuccess_ObjectFile: (action: OnSuccess_ObjectFile_Action, effects: EffectsCommandMap) => void;
    onDelete_ObjectFile: (action: OnDelete_ObjectFile_Action, effects: EffectsCommandMap) => void;
    onTrigger_SaveCache: (action: OnTrigger_SaveCache_Action, effects: EffectsCommandMap) => void;
    onTrigger_FetchDraft: (action: OnTrigger_FetchDraft_Action, effects: EffectsCommandMap) => void;
    // fetchResourceInfo: (action: FetchResourceInfoAction, effects: EffectsCommandMap) => void;
    fetchRawProps: (action: FetchRawPropsAction, effects: EffectsCommandMap) => void;
    onClick_ImportLastVersionDependents_Btn: (action: OnClick_ImportLastVersionDependents_Btn_Action, effects: EffectsCommandMap) => void;
    onChange_DescriptionEditorState: (action: OnChange_DescriptionEditorState_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceVersionCreatorPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const initStates: ResourceVersionCreatorPageModelState = {
  resourceInfo: null,

  versionInput: '',

  selectedFileInfo: null,

  rawProperties: [],
  rawPropertiesState: 'success',

  baseProperties: [],

  customOptionsDataVisible: false,
  customOptionsData: [],

  descriptionEditorState: BraftEditor.createEditorState(''),

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
      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {
      //     resourceId: payload.resourceID,
      //   },
      // });

      const params1: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: payload.resourceID,
        isLoadLatestVersionInfo: 1,
      };
      const { data: data_resourceInfo }: {
        data: {
          resourceId: string;
          resourceName: string;
          resourceType: string[];
          latestVersion: string;
          baseUpcastResources: {
            resourceId: string;
            resourceName: string;
          }[];
        };
      } = yield call(FServiceAPI.Resource.info, params1);
      // console.log(data, '2093jdsl;kfasdf');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceInfo: {
            resourceID: data_resourceInfo.resourceId,
            latestVersion: data_resourceInfo.latestVersion,
            resourceType: data_resourceInfo.resourceType,
            baseUpcastResources: data_resourceInfo.baseUpcastResources.map((bur) => {
              return {
                resourceID: bur.resourceId,
                resourceName: bur.resourceName,
              };
            }),
          },
        },
      });

      let descriptionEditorState: EditorState = BraftEditor.createEditorState('');
      let preVersionBaseProperties: ResourceVersionCreatorPageModelState['preVersionBaseProperties'] = [];
      let preVersionOptionProperties: ResourceVersionCreatorPageModelState['preVersionOptionProperties'] = [];
      let preVersionDirectDependencies: ResourceVersionCreatorPageModelState['preVersionDirectDependencies'] = [];
      if (data_resourceInfo.latestVersion) {
        const params2: Parameters<typeof FServiceAPI.Resource.resourceVersionInfo1>[0] = {
          resourceId: data_resourceInfo.resourceId,
          version: data_resourceInfo.latestVersion,
        };
        const { data: data_resourceVersionInfo }: {
          data: {
            customPropertyDescriptors: any[];
            dependencies: {
              resourceId: string;
              resourceName: string;
              versionRange: string;
            }[];
            description: string;
          }
        } = yield call(FServiceAPI.Resource.resourceVersionInfo1, params2);
        // console.log(data_resourceVersionInfo, 'data_resourceVersionInfo90-32iokpsdlfsdfsdlfkjl');
        descriptionEditorState = BraftEditor.createEditorState(data_resourceVersionInfo.description);
        preVersionBaseProperties = (data_resourceVersionInfo.customPropertyDescriptors as any[])
          .filter((cpd: any) => cpd.type === 'readonlyText')
          .map<ResourceVersionCreatorPageModelState['preVersionBaseProperties'][number]>((cpd: any) => {
            return {
              key: cpd.key,
              value: cpd.defaultValue,
              description: cpd.remark,
            };
          });

        preVersionOptionProperties = (data_resourceVersionInfo.customPropertyDescriptors as any[])
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
        preVersionDirectDependencies = data_resourceVersionInfo.dependencies.map((d) => {
          return {
            id: d.resourceId,
            name: d.resourceName,
            type: 'resource',
            versionRange: d.versionRange,
          };
        });

        // const p: {
        //   addTargets(value: any): void;
        //   clear(): void;
        // } = yield call(getProcessor, 'resourceVersionCreator');
        // yield call(p.clear);
        // yield call(p.addTargets, preVersionDirectDependencies);
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // resourceType: data_resourceInfo.resourceType,
          // baseUpcastResources: data_resourceInfo.baseUpcastResources,
          // latestVersion: data_resourceInfo.latestVersion,
          versionInput: (semver.inc(data_resourceInfo.latestVersion, 'patch') || '0.1.0'),
          preVersionBaseProperties,
          preVersionOptionProperties,
          preVersionDirectDependencies,
          descriptionEditorState,
        },
      });

      const params: Parameters<typeof FServiceAPI.Resource.lookDraft>[0] = {
        resourceId: payload.resourceID,
      };
      const { data: data_draft }: {
        data: null | {
          draftData: IResourceCreateVersionDraft;
        };
      } = yield call(FServiceAPI.Resource.lookDraft, params);

      if (data_draft) {
        const { draftData } = data_draft;

        yield put<ChangeAction>({
          type: 'change',
          payload: {
            versionInput: draftData.versionInput,
            selectedFileInfo: draftData.selectedFileInfo,
            baseProperties: draftData.baseProperties,
            customOptionsData: draftData.customOptionsData,
            descriptionEditorState: BraftEditor.createEditorState(draftData.descriptionEditorInput),
          },
        });
        const p: {
          addTargets(value: any): void;
          clear(): void;
        } = yield call(getProcessor, 'resourceVersionCreator');
        yield call(p.clear);
        yield call(p.addTargets, draftData.directDependencies);

        if (draftData.selectedFileInfo) {
          const params: Parameters<typeof getFilesSha1Info>[0] = {
            sha1: [draftData.selectedFileInfo.sha1],
          };
          // console.log('*(*********');
          const {
            result,
            error,
          }: { result: any[]; error: string; } = yield call(getFilesSha1Info, params);

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
      }
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
    * onClick_CreateVersionBtn({ payload }: OnClick_CreateVersionBtn_Action, { put, call, select }: EffectsCommandMap) {

      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      if (!resourceVersionCreatorPage.resourceInfo || !resourceVersionCreatorPage.selectedFileInfo) {
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: false,
        },
      });
      const p: {
        getAllTargets(): void;
        getAllResourcesWithContracts(): void;
        isCompleteAuthorization(): void;
      } = yield call(getProcessor, 'resourceVersionCreator');

      const isCompleteAuthorization: boolean = yield call(p.isCompleteAuthorization);

      if (!isCompleteAuthorization) {
        fMessage('依赖中存在未获取授权的资源', 'error');
        return;
      }

      const dependentAllResourcesWithContracts: {
        resourceID: string;
        resourceName: string;
        contracts: {
          policyID: string;
          contractID: string;
        }[];
      }[] = yield call(p.getAllResourcesWithContracts);
      const dependentAllTargets: {
        id: string;
        name: string;
        type: 'resource' | 'object';
        versionRange?: string;
      }[] = yield call(p.getAllTargets);
      // console.log(payload, 'payload98isfjsdolifjksdlfjlkj');
      const baseUpcastResources: { resourceId: string }[] = dependentAllResourcesWithContracts
        .filter((r) => {
          return r.contracts.length === 0;
        })
        .map((r) => {
          return { resourceId: r.resourceID };
        });
      const dependencies: {
        resourceId: string;
        versionRange: string;
      }[] = dependentAllTargets
        .map((r) => {
          return {
            resourceId: r.id,
            versionRange: r.versionRange || '',
          };
        });
      const resolveResources: {
        resourceId: string;
        contracts: {
          policyId: string;
        }[];
      }[] = dependentAllResourcesWithContracts
        .filter((r) => {
          return r.contracts.length > 0;
        })
        .map((r) => {
          return {
            resourceId: r.resourceID,
            contracts: r.contracts.map((c) => {
              return {
                policyId: c.policyID,
              };
            }),
          };
        });
      const params: Parameters<typeof FServiceAPI.Resource.createVersion>[0] = {
        resourceId: resourceVersionCreatorPage.resourceInfo.resourceID,
        version: resourceVersionCreatorPage.versionInput,
        fileSha1: resourceVersionCreatorPage.selectedFileInfo.sha1,
        filename: resourceVersionCreatorPage.selectedFileInfo.name,
        baseUpcastResources: baseUpcastResources,
        dependencies: dependencies,
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
        description: resourceVersionCreatorPage.descriptionEditorState.toHTML() === '<p></p>'
          ? ''
          : resourceVersionCreatorPage.descriptionEditorState.toHTML(),
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
    * onChange_VersionInput({ payload }: OnChange_VersionInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          versionInput: payload.value,
        },
      });
    },
    * onTrigger_SaveCache({ payload }: OnTrigger_SaveCache_Action, { put, select, call }: EffectsCommandMap) {

      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      if (!resourceVersionCreatorPage.resourceInfo) {
        return;
      }

      const p: { getAllTargets(): void } = yield call(getProcessor, 'resourceVersionCreator');
      // console.log(p, 'pdsifo9jsdlfk');
      const directDependencies: any[] = yield call(p.getAllTargets);
      // console.log(directDependencies, 'directDependenciesoisjdlkjsdlskfjlkj');

      const draftData: IResourceCreateVersionDraft = {
        versionInput: resourceVersionCreatorPage.versionInput,
        selectedFileInfo: resourceVersionCreatorPage.selectedFileInfo,
        baseProperties: resourceVersionCreatorPage.baseProperties,
        customOptionsData: resourceVersionCreatorPage.customOptionsData,
        // directDependencies: payload.dependentAllTargets,
        directDependencies: directDependencies,
        descriptionEditorInput: resourceVersionCreatorPage.descriptionEditorState.toHTML(),
      };

      const params: Parameters<typeof FServiceAPI.Resource.saveVersionsDraft>[0] = {
        resourceId: resourceVersionCreatorPage.resourceInfo.resourceID,
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
    * onTrigger_FetchDraft({}: OnTrigger_FetchDraft_Action, { call, put, select }: EffectsCommandMap) {

      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      if (!resourceVersionCreatorPage.resourceInfo) {
        return;
      }

      const params: Parameters<typeof FServiceAPI.Resource.lookDraft>[0] = {
        resourceId: resourceVersionCreatorPage.resourceInfo.resourceID,
      };
      const { data: data_draft }: {
        data: null | {
          draftData: IResourceCreateVersionDraft;
        };
      } = yield call(FServiceAPI.Resource.lookDraft, params);

      if (data_draft) {
        const { draftData } = data_draft;

        yield put<ChangeAction>({
          type: 'change',
          payload: {
            versionInput: draftData.versionInput,
            selectedFileInfo: draftData.selectedFileInfo,
            baseProperties: draftData.baseProperties,
            customOptionsData: draftData.customOptionsData,
            descriptionEditorState: BraftEditor.createEditorState(draftData.descriptionEditorInput),
          },
        });
        const p: {
          addTargets(value: any): void;
          clear(): void;
        } = yield call(getProcessor, 'resourceVersionCreator');
        yield call(p.clear);
        yield call(p.addTargets, draftData.directDependencies);

        if (draftData.selectedFileInfo) {
          const params: Parameters<typeof getFilesSha1Info>[0] = {
            sha1: [draftData.selectedFileInfo.sha1],
          };
          // console.log('*(*********');
          const {
            result,
            error,
          }: { result: any[]; error: string; } = yield call(getFilesSha1Info, params);

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
      }
    },
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
    * onClick_ImportLastVersionDependents_Btn({ payload }: OnClick_ImportLastVersionDependents_Btn_Action, {
      call,
      select,
    }: EffectsCommandMap) {
      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));
      const p: {
        addTargets(value: any): void;
        clear(): void;
      } = yield call(getProcessor, 'resourceVersionCreator');
      yield call(p.clear);
      yield call(p.addTargets, resourceVersionCreatorPage.preVersionDirectDependencies);
    },
    * onChange_DescriptionEditorState({ payload }: OnChange_DescriptionEditorState_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          descriptionEditorState: payload.state,
        },
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
