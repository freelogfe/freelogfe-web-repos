import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState, ResourceCreatorPageModelState } from '@/models/connect';
import { history } from 'umi';
import fMessage from '@/components/fMessage';
import * as semver from 'semver';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { getFilesSha1Info } from '@/utils/service';
import { IResourceCreateVersionDraftType } from '@/type/resourceTypes';
import moment from 'moment';
import { OnChange_Draft_Action } from '@/models/resourceSider';

export interface ResourceVersionCreatorPageModelState {
  pageState: 'loading' | 'loaded';
  resourceInfo: {
    resourceID: string;
    resourceName: string;
    latestVersion: string;
    resourceTypeCode: string;
    resourceType: string[];
    baseUpcastResources: {
      resourceID: string;
      resourceName: string;
    }[];
    cover: string;
  } | null;

  draftSaveTime: string;

  dataIsDirty: boolean;

  versionInput: string;

  resourceTypeConfig: {
    uploadEntry: ('localUpload' | 'storageSpace' | 'markdownEditor' | 'cartoonEditor')[];
    limitFileSize: number;
    isSupportDownload: boolean;
    isSupportEdit: boolean;
    isSupportOptionalConfig: boolean;
  };

  selectedFileInfo: {
    name: string;
    sha1: string;
    from: string;
  } | null;
  selectedFile_UsedResources: {
    resourceID: string;
    resourceName: string;
    resourceType: string;
    resourceVersion: string;
    url: string;
  }[];
  rawProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
  rawPropertiesState: 'parsing' | 'success' | 'fail';
  additionalProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];

  customProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];

  // customOptionsDataVisible: boolean;
  customConfigurations: {
    key: string;
    name: string;
    description: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
  }[];

  directDependencies: {
    id: string;
    name: string;
    type: 'resource' | 'object';
    versionRange?: string;
  }[];
  baseUpcastResources: {
    resourceID: string;
    resourceName: string;
  }[];
  resolveResources: {
    resourceId: string;
    contracts: {
      policyId: string;
    }[];
  }[];
  isCompleteAuthorization: boolean;
  authReload: number;

  descriptionText: string;
  descriptionIsEditing: boolean;
  releaseTipVisible: boolean;

  isOpenMarkdown: boolean;
  isOpenCartoon: boolean;
  isDirtyCartoonEditor: boolean;
  isDirtyMarkdownEditor: boolean;
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

export interface OnClick_CreateVersionBtn_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onClick_CreateVersionBtn';
}

export interface OnTrigger_SaveDraft_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onTrigger_SaveDraft';
  payload: {
    showSuccessTip: boolean;
  };
}

export interface OnChange_DataIsDirty_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_DataIsDirty';
  payload: {
    value: boolean;
  };
}

export interface OnChange_VersionInput_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_VersionInput';
  payload: {
    value: string;
  };
}

export interface OnSucceed_UploadFile_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onSucceed_UploadFile';
  payload: {
    name: string;
    sha1: string;
  };
}

export interface OnSucceed_ImportObject_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onSucceed_ImportObject';
  payload: {
    name: string;
    sha1: string;
    objID: string;
  };
}

export interface OnClick_OpenMarkdownBtn_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onClick_OpenMarkdownBtn';

}

export interface OnClick_OpenCartoonBtn_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onClick_OpenCartoonBtn';
}

export interface OnDelete_ObjectFile_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onDelete_ObjectFile';
}

export interface OnClose_MarkdownEditor_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onClose_MarkdownEditor';
}

export interface OnClose_CartoonEditor_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onClose_CartoonEditor';
}

export interface OnChange_AdditionalProperties_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_AdditionalProperties';
  payload: {
    value: ResourceVersionCreatorPageModelState['additionalProperties'];
  };
}

export interface OnChange_CustomProperties_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_CustomProperties';
  payload: {
    value: ResourceVersionCreatorPageModelState['customProperties'];
  };
}

export interface OnChange_CustomConfigurations_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_CustomConfigurations';
  payload: {
    value: ResourceVersionCreatorPageModelState['customConfigurations'];
  };
}

// export interface OnClick_ImportLastVersionDependents_Btn_Action extends AnyAction {
//   type: 'resourceVersionCreatorPage/onClick_ImportLastVersionDependents_Btn';
// }

export interface OnChange_DescriptionText_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_DescriptionText';
  payload: {
    value: string;
  };
}

export interface OnChange_IsOpenCartoon_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_IsOpenCartoon';
  payload: {
    value: boolean;
  };
}

export interface _FetchDraft_Action extends AnyAction {
  type: '_FetchDraft';
  payload: {
    delay: boolean;
  };
}

export interface _SaveDraft_Action extends AnyAction {
  type: '_SaveDraft';
  payload: {
    showSuccessTip: boolean;
  };
}

export interface _FetchRawPropsAction extends AnyAction {
  type: '_FetchRawProps';
  payload: {
    ifMarkdownFetchDependencies: boolean;
    delay?: boolean;
  };
}

export interface ResourceVersionCreatorModelType {
  namespace: 'resourceVersionCreatorPage';
  state: ResourceVersionCreatorPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;

    onTrigger_SaveDraft: (action: OnTrigger_SaveDraft_Action, effects: EffectsCommandMap) => void;
    onClick_CreateVersionBtn: (action: OnClick_CreateVersionBtn_Action, effects: EffectsCommandMap) => void;
    onChange_DataIsDirty: (action: OnChange_DataIsDirty_Action, effects: EffectsCommandMap) => void;
    onChange_VersionInput: (action: OnChange_VersionInput_Action, effects: EffectsCommandMap) => void;
    onSucceed_UploadFile: (action: OnSucceed_UploadFile_Action, effects: EffectsCommandMap) => void;
    onSucceed_ImportObject: (action: OnSucceed_ImportObject_Action, effects: EffectsCommandMap) => void;

    onDelete_ObjectFile: (action: OnDelete_ObjectFile_Action, effects: EffectsCommandMap) => void;

    onChange_AdditionalProperties: (action: OnChange_AdditionalProperties_Action, effects: EffectsCommandMap) => void;
    onChange_CustomProperties: (action: OnChange_CustomProperties_Action, effects: EffectsCommandMap) => void;
    onChange_CustomConfigurations: (action: OnChange_CustomConfigurations_Action, effects: EffectsCommandMap) => void;
    // onClick_ImportLastVersionDependents_Btn: (action: OnClick_ImportLastVersionDependents_Btn_Action, effects: EffectsCommandMap) => void;
    onChange_DescriptionText: (action: OnChange_DescriptionText_Action, effects: EffectsCommandMap) => void;
    onChange_IsOpenCartoon: (action: OnChange_IsOpenCartoon_Action, effects: EffectsCommandMap) => void;

    onClick_OpenMarkdownBtn: (action: OnClick_OpenMarkdownBtn_Action, effects: EffectsCommandMap) => void;
    onClick_OpenCartoonBtn: (action: OnClick_OpenCartoonBtn_Action, effects: EffectsCommandMap) => void;
    onClose_MarkdownEditor: (action: OnClose_MarkdownEditor_Action, effects: EffectsCommandMap) => void;
    onClose_CartoonEditor: (action: OnClose_CartoonEditor_Action, effects: EffectsCommandMap) => void;

    _FetchDraft: (action: _FetchDraft_Action, effects: EffectsCommandMap) => void;
    _SaveDraft: (action: _SaveDraft_Action, effects: EffectsCommandMap) => void;
    _FetchRawProps: (action: _FetchRawPropsAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceVersionCreatorPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const initStates: ResourceVersionCreatorPageModelState = {
  pageState: 'loading',
  resourceInfo: null,

  draftSaveTime: '',
  dataIsDirty: false,

  versionInput: '',

  resourceTypeConfig: {
    uploadEntry: [],
    limitFileSize: 0,
    isSupportDownload: false,
    isSupportEdit: false,
    isSupportOptionalConfig: false,
  },

  selectedFileInfo: null,
  selectedFile_UsedResources: [],

  rawProperties: [],
  rawPropertiesState: 'success',
  additionalProperties: [],
  customProperties: [],

  // customOptionsDataVisible: false,
  customConfigurations: [],

  directDependencies: [],
  baseUpcastResources: [],
  resolveResources: [],
  isCompleteAuthorization: true,
  authReload: 0,

  descriptionText: '',
  descriptionIsEditing: false,

  releaseTipVisible: false,

  isOpenMarkdown: false,
  isOpenCartoon: false,
  isDirtyCartoonEditor: false,
  isDirtyMarkdownEditor: false,
};

const Model: ResourceVersionCreatorModelType = {

  namespace: 'resourceVersionCreatorPage',

  state: initStates,

  effects: {
    * onMountPage({ payload }: OnMountPageAction, { put, call }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pageState: 'loading',
        },
      });
      const params2: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: payload.resourceID,
        isLoadLatestVersionInfo: 1,
      };
      const { data: data_resourceInfo }: {
        data: {
          resourceId: string;
          resourceName: string;
          resourceType: string[];
          resourceTypeCode: string;
          latestVersion: string;
          baseUpcastResources: {
            resourceId: string;
            resourceName: string;
          }[];
          userId: number;
          coverImages: string[];
        };
      } = yield call(FServiceAPI.Resource.info, params2);
      // console.log(data_resourceInfo, '2093jdsl;kfasdf');

      if (!data_resourceInfo || data_resourceInfo.userId !== FUtil.Tool.getUserIDByCookies()) {
        history.replace(FUtil.LinkTo.exception403());
        return;
      }

      const params1: Parameters<typeof FServiceAPI.Resource.getResourceTypeInfoByCode>[0] = {
        code: data_resourceInfo.resourceTypeCode,
      };
      const { data: data_ResourceTypeInfo }: {
        ret: number;
        errCode: number;
        msg: string;
        data: {
          resourceConfig: {
            fileCommitMode: number[];
            fileMaxSize: number;
            fileMaxSizeUnit: 1 | 2;
            supportDownload: 1 | 2;
            supportEdit: 1 | 2;
            supportOptionalConfig: 1 | 2;
          }
        };
      } = yield call(FServiceAPI.Resource.getResourceTypeInfoByCode, params1);
      // console.log(data_ResourceTypeInfo, 'data_ResourceTypeInfo sdiofjsdlkjflksdjlkjl');
      const uploadEntry: ResourceCreatorPageModelState['step2_resourceTypeConfig']['uploadEntry'] = [];
      if (data_ResourceTypeInfo.resourceConfig.fileCommitMode.includes(2 ** 0)) {
        uploadEntry.push('localUpload');
      }
      if (data_ResourceTypeInfo.resourceConfig.fileCommitMode.includes(2 ** 1)) {
        uploadEntry.push('storageSpace');
      }
      if (data_ResourceTypeInfo.resourceConfig.fileCommitMode.includes(2 ** 2)) {
        uploadEntry.push('markdownEditor');
      }
      if (data_ResourceTypeInfo.resourceConfig.fileCommitMode.includes(2 ** 3)) {
        uploadEntry.push('cartoonEditor');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceInfo: {
            resourceID: data_resourceInfo.resourceId,
            resourceName: data_resourceInfo.resourceName,
            latestVersion: data_resourceInfo.latestVersion,
            resourceType: data_resourceInfo.resourceType,
            resourceTypeCode: data_resourceInfo.resourceTypeCode,
            baseUpcastResources: data_resourceInfo.baseUpcastResources.map((bur) => {
              return {
                resourceID: bur.resourceId,
                resourceName: bur.resourceName,
              };
            }),
            cover: data_resourceInfo.coverImages[0] || '',
          },

          resourceTypeConfig: {
            uploadEntry: uploadEntry,
            limitFileSize: data_ResourceTypeInfo.resourceConfig.fileMaxSize * 1024 * 1024 ** data_ResourceTypeInfo.resourceConfig.fileMaxSizeUnit,
            isSupportDownload: data_ResourceTypeInfo.resourceConfig.supportDownload === 2,
            isSupportEdit: data_ResourceTypeInfo.resourceConfig.supportEdit === 2,
            isSupportOptionalConfig: data_ResourceTypeInfo.resourceConfig.supportOptionalConfig === 2,
          },
        },
      });

      if (data_resourceInfo.latestVersion) {
        const params2: Parameters<typeof FServiceAPI.Resource.resourceVersionInfo1>[0] = {
          resourceId: data_resourceInfo.resourceId,
          version: data_resourceInfo.latestVersion,
        };
        const { data: data_resourceVersionInfo }: {
          data: {
            fileSha1: string;
            filename: string;
            customPropertyDescriptors: {
              key: string;
              name: string;
              defaultValue: string;
              type: 'editableText' | 'readonlyText' | 'radio' | 'checkbox' | 'select';
              candidateItems: string[];
              remark: string;
            }[];
            dependencies: {
              resourceId: string;
              resourceName: string;
              versionRange: string;
            }[];
            description: string;
            systemPropertyDescriptors: {
              key: string;
              valueDisplay: string;
              insertMode: 1 | 2;
            }[];
          }
        } = yield call(FServiceAPI.Resource.resourceVersionInfo1, params2);
        // console.log(data_resourceVersionInfo, 'data_resourceVersionInfo sdifjsd;oifjsldkjflkdsjflkjl');
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            versionInput: (semver.inc(data_resourceInfo.latestVersion, 'patch') || '1.0.0'),
            selectedFileInfo: {
              name: data_resourceVersionInfo.filename,
              sha1: data_resourceVersionInfo.fileSha1,
              from: '上个版本',
            },
            additionalProperties: data_resourceVersionInfo.systemPropertyDescriptors
              .filter((spd) => {
                return spd.insertMode === 2;
              })
              .map<ResourceVersionCreatorPageModelState['additionalProperties'][number]>((spd) => {
                // return {
                //   key: spd.key,
                //   value: spd.valueDisplay,
                // };
                return {
                  key: spd.key,
                  name: '',
                  value: spd.valueDisplay,
                  description: '',
                };
              }),
            customProperties: data_resourceVersionInfo.customPropertyDescriptors
              .filter((cpd: any) => cpd.type === 'readonlyText')
              .map<ResourceVersionCreatorPageModelState['customProperties'][number]>((cpd) => {
                // console.log(cpd, 'cpdoidsjflksdjflkjkl');
                return {
                  key: cpd.key,
                  name: cpd.name,
                  value: cpd.defaultValue,
                  description: cpd.remark,
                };
              }),
            customConfigurations: data_resourceVersionInfo.customPropertyDescriptors
              .filter((cpd: any) => cpd.type !== 'readonlyText')
              .map<ResourceVersionCreatorPageModelState['customConfigurations'][number]>((cpd) => {
                return {
                  key: cpd.key,
                  name: cpd.name,
                  description: cpd.remark,
                  type: cpd.type === 'editableText' ? 'input' : 'select',
                  input: cpd.defaultValue,
                  select: cpd.candidateItems,
                };
              }),
            directDependencies: data_resourceVersionInfo.dependencies
              .map<ResourceVersionCreatorPageModelState['directDependencies'][number]>((d) => {
                return {
                  id: d.resourceId,
                  name: d.resourceName,
                  type: 'resource',
                  versionRange: d.versionRange,
                };
              }),
            baseUpcastResources: data_resourceInfo.baseUpcastResources
              .map<ResourceVersionCreatorPageModelState['baseUpcastResources'][number]>((b) => {
                return {
                  resourceID: b.resourceId,
                  resourceName: b.resourceName,
                };
              }),
            // descriptionEditorState,
            descriptionText: data_resourceVersionInfo.description,
          },
        });
      }

      yield put<_FetchDraft_Action>({
        type: '_FetchDraft',
        payload: {
          delay: false,
        },
      });
    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {
      window.onbeforeunload = null;
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * onTrigger_SaveDraft({ payload }: OnTrigger_SaveDraft_Action, { put }: EffectsCommandMap) {
      yield put<_SaveDraft_Action>({
        type: '_SaveDraft',
        payload: {
          showSuccessTip: payload.showSuccessTip,
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

      if (!resourceVersionCreatorPage.isCompleteAuthorization) {
        fMessage('依赖中存在未获取授权的资源', 'error');
        return;
      }

      const params: Parameters<typeof FServiceAPI.Resource.createVersion>[0] = {
        resourceId: resourceVersionCreatorPage.resourceInfo.resourceID,
        version: resourceVersionCreatorPage.versionInput,
        fileSha1: resourceVersionCreatorPage.selectedFileInfo.sha1,
        filename: resourceVersionCreatorPage.selectedFileInfo.name,
        baseUpcastResources: resourceVersionCreatorPage.baseUpcastResources.map((r) => {
          return { resourceId: r.resourceID };
        }),
        dependencies: resourceVersionCreatorPage.directDependencies
          .map((r) => {
            return {
              resourceId: r.id,
              versionRange: r.versionRange || '',
            };
          }),
        resolveResources: resourceVersionCreatorPage.resolveResources,
        inputAttrs: resourceVersionCreatorPage.additionalProperties
          // .filter((ap) => {
          //   return ap.value !== '';
          // })
          .map((ap) => {
            return {
              key: ap.key,
              value: ap.value,
            };
          }),
        customPropertyDescriptors: [
          ...resourceVersionCreatorPage.customProperties
            .map<NonNullable<Parameters<typeof FServiceAPI.Resource.createVersion>[0]['customPropertyDescriptors']>[number]>
            ((i) => {
              return {
                type: 'readonlyText',
                key: i.key,
                name: i.name,
                remark: i.description,
                defaultValue: i.value,
              };
            }),
          ...resourceVersionCreatorPage.customConfigurations
            .map<NonNullable<Parameters<typeof FServiceAPI.Resource.createVersion>[0]['customPropertyDescriptors']>[number]>((i) => {
              const isInput: boolean = i.type === 'input';
              const options: string[] = i.select;
              return {
                type: isInput ? 'editableText' : 'select',
                key: i.key,
                name: i.name,
                remark: i.description,
                defaultValue: isInput ? i.input : options[0],
                // defaultValue: isInput ? i.input : '',
                candidateItems: isInput ? undefined : options,
              };
            }),
        ],
        description: resourceVersionCreatorPage.descriptionText,
        // description: resourceVersionCreatorPage.descriptionEditorState.toHTML() === '<p></p>'
        //   ? ''
        //   : resourceVersionCreatorPage.descriptionEditorState.toHTML(),
      };

      const { ret, errCode, data, msg } = yield call(FServiceAPI.Resource.createVersion, params);

      if (ret !== 0 || errCode !== 0 || !data) {
        self._czc?.push(['_trackEvent', '版本发行页', '发行', '', 0]);
        // fMessage('创建失败', 'error');
        fMessage(msg, 'error');
        return;
      }
      self._czc?.push(['_trackEvent', '版本发行页', '发行', '', 1]);

      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
        caller: '97293874823yu4oi234io23hjkfdsasdf',
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: false,
        },
      });

      // yield put<OnChange_DraftData_Action>({
      //   type: 'resourceInfo/onChange_DraftData',
      //   payload: {
      //     draftData: null,
      //   },
      // });

      history.replace(FUtil.LinkTo.resourceVersionCreateRelease({
        resourceID: data.resourceId,
        version: data.version,
      }));
    },
    * onChange_DataIsDirty({ payload }: OnChange_DataIsDirty_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: payload.value,
        },
      });
    },
    * onChange_VersionInput({ payload }: OnChange_VersionInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          versionInput: payload.value,
          dataIsDirty: true,
        },
      });
    },

    * onSucceed_UploadFile({ payload }: OnSucceed_UploadFile_Action, { put, call }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          selectedFileInfo: {
            sha1: payload.sha1,
            name: payload.name,
            from: '本地上传',
          },
          dataIsDirty: true,
        },
      });

      yield put<_FetchRawPropsAction>({
        type: '_FetchRawProps',
        payload: {
          ifMarkdownFetchDependencies: true,
        },
      });
    },
    * onSucceed_ImportObject({ payload }: OnSucceed_ImportObject_Action, { call, put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          selectedFileInfo: {
            sha1: payload.sha1,
            name: payload.name,
            from: '存储空间',
          },
          dataIsDirty: true,
        },
      });

      const params: Parameters<typeof FServiceAPI.Storage.objectDetails>[0] = {
        objectIdOrName: payload.objID,
      };
      const { data: data_objectDetails }: {
        data: {
          dependencies: {
            name: string;
            type: 'resource' | 'object';
            versionRange?: string;
          }[];
          customPropertyDescriptors: {
            key: string;
            name: string;
            defaultValue: string;
            type: 'editableText' | 'readonlyText' | 'radio' | 'checkbox' | 'select';
            candidateItems: string[];
            remark: string;
          }[],
        }
      } = yield call(FServiceAPI.Storage.objectDetails, params);

      // console.log(data_objectDetails, 'data_objectDetailssfiojdlkfjdslkfjdslkflskdjflk');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          customProperties: data_objectDetails.customPropertyDescriptors
            .filter((cpd) => cpd.type === 'readonlyText')
            .map<ResourceVersionCreatorPageModelState['customProperties'][number]>((cpd: any) => {
              return {
                key: cpd.key,
                name: cpd.key,
                value: cpd.defaultValue,
                description: cpd.remark,
              };
            }),
          customConfigurations: data_objectDetails.customPropertyDescriptors
            .filter((cpd: any) => cpd.type !== 'readonlyText')
            .map<ResourceVersionCreatorPageModelState['customConfigurations'][number]>((cpd) => {
              return {
                key: cpd.key,
                name: cpd.name,
                // keyError: '',
                description: cpd.remark,
                // descriptionError: '',
                type: cpd.type === 'editableText' ? 'input' : 'select',
                input: cpd.defaultValue,
                // defaultValueError: '',
                select: cpd.candidateItems,
                // customOptionError: '',
              };
            }),
        },
      });

      // console.log(data_objectDetails, 'datasdoipejflskdfjlsdjflskj');
      const resourceNames: string[] = data_objectDetails.dependencies
        .filter((d) => {
          return d.type === 'resource';
        })
        .map((d) => {
          return d.name;
        });

      const objNames: string[] = data_objectDetails.dependencies
        .filter((d) => {
          return d.type === 'object';
        })
        .map((d) => {
          return d.name;
        });

      let addR: {
        id: string;
        name: string;
        type: 'resource';
        versionRange: string;
      }[] = [];
      let addO: {
        id: string;
        name: string;
        type: 'object';
      }[] = [];
      if (resourceNames.length > 0) {
        const { data: data_resources }: {
          data: {
            resourceId: string;
            resourceName: string;
            latestVersion: string;
          }[];
        } = yield call(FServiceAPI.Resource.batchInfo, {
          resourceNames: resourceNames.join(),
        });
        // console.log(data_resources, 'resourceiojlkdsjflsdjflk');
        addR = data_resources.map((r) => {
          return {
            id: r.resourceId,
            name: r.resourceName,
            type: 'resource',
            versionRange: '^' + r.latestVersion,
          };
        });
      }

      if (objNames.length > 0) {
        const { data: data_objs }: {
          data: {
            bucketId: string;
            bucketName: string;
            objectId: string;
            objectName: string;
          }[];
        } = yield call(FServiceAPI.Storage.batchObjectList, {
          fullObjectNames: objNames.map((o) => {
            return encodeURIComponent(o);
          }).join(','),
        });

        // console.log(data_objs, 'objsoisjdlfksjfljsdlkfjsdlfjl');
        addO = data_objs.map((o) => {
          return {
            id: o.objectId,
            name: `${o.bucketName}/${o.objectName}`,
            type: 'object',
          };
        });
      }

      // const processor: { addTargets(targets: any[]): void } = yield call(getProcessor, 'resourceVersionCreator');
      // yield call(processor.addTargets, [
      //   ...addR,
      //   ...addO,
      // ]);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          directDependencies: [
            ...addR,
            ...addO,
          ],
        },
      });

      yield put<_FetchRawPropsAction>({
        type: '_FetchRawProps',
        payload: {
          ifMarkdownFetchDependencies: true,
        },
      });
    },
    * onClick_OpenMarkdownBtn({}: OnClick_OpenMarkdownBtn_Action, {}: EffectsCommandMap) {

    },
    * onClick_OpenCartoonBtn({}: OnClick_OpenCartoonBtn_Action, { select, call, put }: EffectsCommandMap) {
      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      // yield put<OnTrigger_SaveDraft_Action>({
      //   type: 'resourceVersionCreatorPage/onTrigger_SaveDraft',
      //   payload: {
      //     showSuccessTip: false,
      //   },
      // });

      // yield put<_SaveDraft_Action>({
      //   type: '_SaveDraft',
      //   payload: {
      //     showSuccessTip: false,
      //   },
      // });
      if (resourceVersionCreatorPage.draftSaveTime === '') {
        const params: Parameters<typeof saveInitDraft>[0] = {
          resourceID: resourceVersionCreatorPage.resourceInfo?.resourceID || '',
          versionInput: resourceVersionCreatorPage.versionInput,
        };

        // console.time('打开编辑器');
        const success: Awaited<typeof saveInitDraft> = yield call(saveInitDraft, params);
        // console.timeEnd('打开编辑器');

        if (!success) {
          fMessage('保存草稿失败，无法打开编辑器');
          return;
        }
      }


      yield put<ChangeAction>({
        type: 'change',
        payload: {
          isOpenCartoon: true,
        },
      });
    },
    * onDelete_ObjectFile({}: OnDelete_ObjectFile_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          selectedFileInfo: null,
          rawProperties: [],
          // additionalProperties: [],
          // customProperties: [],
          // customConfigurations: [],
          dataIsDirty: true,
          // selectedFile_UsedResources: [],
        },
      });
    },
    * onClose_MarkdownEditor({}: OnClose_MarkdownEditor_Action, { select, call, put }: EffectsCommandMap) {

      // const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
      //   resourceVersionCreatorPage,
      // }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: false,
        },
      });

      yield put<_FetchDraft_Action>({
        type: '_FetchDraft',
        payload: {
          delay: true,
        },
      });
    },
    * onClose_CartoonEditor({}: OnClose_CartoonEditor_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          isOpenCartoon: false,
          isDirtyCartoonEditor: false,
        },
      });

      yield put<_FetchDraft_Action>({
        type: '_FetchDraft',
        payload: {
          delay: true,
        },
      });
    },
    * onChange_AdditionalProperties({ payload }: OnChange_AdditionalProperties_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          additionalProperties: payload.value,
          dataIsDirty: true,
        },
      });
    },
    * onChange_CustomProperties({ payload }: OnChange_CustomProperties_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          customProperties: payload.value,
          dataIsDirty: true,
        },
      });
    },
    * onChange_CustomConfigurations({ payload }: OnChange_CustomConfigurations_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          customConfigurations: payload.value,
          dataIsDirty: true,
        },
      });
    },
    // * onClick_ImportLastVersionDependents_Btn({ payload }: OnClick_ImportLastVersionDependents_Btn_Action, {
    //   call,
    //   select,
    //   put,
    // }: EffectsCommandMap) {
    //   const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
    //     resourceVersionCreatorPage,
    //   }));
    //   const p: {
    //     addTargets(value: any): void;
    //     clear(): void;
    //   } = yield call(getProcessor, 'resourceVersionCreator');
    //   yield call(p.clear);
    //   yield call(p.addTargets, resourceVersionCreatorPage.preVersionDirectDependencies);
    //   yield put<ChangeAction>({
    //     type: 'change',
    //     payload: {
    //       dataIsDirty: true,
    //     },
    //   });
    // },
    * onChange_DescriptionText({ payload }: OnChange_DescriptionText_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // descriptionEditorState: payload.state,
          descriptionText: payload.value,
          dataIsDirty: true,
        },
      });
    },
    * onChange_IsOpenCartoon({ payload }: OnChange_IsOpenCartoon_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          isOpenCartoon: payload.value,
        },
      });

    },

    * _FetchDraft({ payload }: _FetchDraft_Action, { call, put, select }: EffectsCommandMap) {

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
          resourceId: string;
          updateDate: string;
          draftData: IResourceCreateVersionDraftType;
        };
      } = yield call(FServiceAPI.Resource.lookDraft, params);
      // console.log(data_draft, 'data_draftiosdjlfkjsdlkfjklsdjflk');

      if (!!data_draft) {

        const { draftData } = data_draft;

        if (!!draftData.selectedFileInfo) {
          const params3: Parameters<typeof FServiceAPI.Resource.getResourceBySha1>[0] = {
            fileSha1: draftData.selectedFileInfo.sha1,
          };

          const { data: data_ResourcesBySha1 }: { data: any[] } = yield call(FServiceAPI.Resource.getResourceBySha1, params3);
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              selectedFile_UsedResources: data_ResourcesBySha1
                .filter((d) => {
                  return d.userId !== FUtil.Tool.getUserIDByCookies();
                })
                .map((d) => {
                  return d.resourceVersions.map((v: any) => {
                    return {
                      resourceId: d.resourceId,
                      resourceName: d.resourceName,
                      resourceType: d.resourceType,
                      resourceVersion: v.version,
                      url: FUtil.LinkTo.resourceDetails({
                        resourceID: d.resourceId,
                        version: v.version,
                      }),
                    };
                  });
                }).flat(),
            },
          });
        }

        yield put<ChangeAction>({
          type: 'change',
          payload: {
            versionInput: draftData.versionInput,
            selectedFileInfo: draftData.selectedFileInfo,
            additionalProperties: draftData.additionalProperties.map((p) => {
              return {
                key: p.key,
                name: '',
                value: p.value,
                description: '',
              };
            }),
            customProperties: draftData.customProperties,
            customConfigurations: draftData.customConfigurations,

            directDependencies: draftData.directDependencies,
            baseUpcastResources: draftData.baseUpcastResources,
            authReload: resourceVersionCreatorPage.authReload + 1,

            // descriptionEditorState: BraftEditor.createEditorState(draftData.descriptionEditorInput),
            descriptionText: draftData.descriptionEditorInput,
            draftSaveTime: moment(data_draft.updateDate).format('YYYY-MM-DD HH:mm:ss'),
            // draftSaveTime: FUtil.Format.formatDateTime(data_draft.updateDate, true),
          },
        });
        yield call(FUtil.Tool.promiseSleep);

        if (draftData.selectedFileInfo) {
          yield put<_FetchRawPropsAction>({
            type: '_FetchRawProps',
            payload: {
              ifMarkdownFetchDependencies: false,
              delay: payload.delay,
            },
          });
        }
      }
      // console.log('DDDDEEEEEEE *(&(*&(*&');
      yield call(FUtil.Tool.promiseSleep, 1000);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pageState: 'loaded',
          // draftSaveTime: moment(data_draft.)
        },
      });
    },
    * _SaveDraft({ payload }: _SaveDraft_Action, { select, call, put }: EffectsCommandMap) {
      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      // console.log(resourceVersionCreatorPage.resourceInfo, 'resourceVersionCreatorPage.resourceInfo sdifjlsdkfjlksdjflkjsdlkfj');

      if (!resourceVersionCreatorPage.resourceInfo) {
        return;
      }

      // let directDependencies: any[] = [];
      // let baseUpcastResources: {
      //   resourceID: string;
      //   resourceName: string;
      // }[] = [];

      // if (resourceVersionCreatorPage.selectedFileInfo) {
      // const p: { getAllTargets(): void; getBaseUpcastResources(): { resourceID: string; resourceName: string; }[] } = yield call(getProcessor, 'resourceVersionCreator');
      // directDependencies = yield call(p.getAllTargets);
      // baseUpcastResources = yield call(p.getBaseUpcastResources);
      // }
      // console.log(directDependencies, 'directDependenciesewfdsfsdfsd ');
      // console.log(baseUpcastResources, 'baseUpcastResourcesoisjdlkfjlsdkjflsdjfljsl');

      const draftData: IResourceCreateVersionDraftType = {
        versionInput: resourceVersionCreatorPage.versionInput,
        selectedFileInfo: resourceVersionCreatorPage.selectedFileInfo,
        additionalProperties: resourceVersionCreatorPage.additionalProperties.map((ap) => {
          return {
            key: ap.key,
            value: ap.value,
          };
        }),
        customProperties: resourceVersionCreatorPage.customProperties,
        customConfigurations: resourceVersionCreatorPage.customConfigurations,
        directDependencies: resourceVersionCreatorPage.directDependencies,
        baseUpcastResources: resourceVersionCreatorPage.baseUpcastResources,
        descriptionEditorInput: resourceVersionCreatorPage.descriptionText,
      };

      const params: Parameters<typeof FServiceAPI.Resource.saveVersionsDraft>[0] = {
        resourceId: resourceVersionCreatorPage.resourceInfo.resourceID,
        draftData: draftData,
      };
      const { ret, errCode, data: data_draft }: {
        ret: number;
        errCode: number;
        data: {
          resourceId: string;
          updateDate: string;
          draftData: IResourceCreateVersionDraftType;
        };
      } = yield call(FServiceAPI.Resource.saveVersionsDraft, params);
      if (ret !== 0 || errCode !== 0) {
        fMessage('草稿保存失败', 'error');
        return;
      }
      if (payload.showSuccessTip) {
        fMessage('暂存草稿成功');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // draftSaveTime: FUtil.Format.formatDateTime(Date(), true),
          draftSaveTime: moment(data_draft.updateDate).format('YYYY-MM-DD HH:mm:ss'),
          dataIsDirty: false,
        },
      });

      yield put<OnChange_Draft_Action>({
        type: 'resourceSider/onChange_Draft',
        payload: {
          value: draftData,
        },
      });

      // yield put<OnChange_DraftData_Action>({
      //   type: 'resourceInfo/onChange_DraftData',
      //   payload: {
      //     draftData: draftData,
      //   },
      // });
    },
    * _FetchRawProps({ payload }: _FetchRawPropsAction, { select, put, call }: EffectsCommandMap) {
      // console.log('_FetchRawProps, sdiofjldksfjlksdjflkdsjlkjl');
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
      // console.log('_FetchRawProps, sdiofjldksfjlksdjflkdsjlkjl');


      const params0: Parameters<typeof getFilesSha1Info>[0] = {
        sha1: [resourceVersionCreatorPage.selectedFileInfo.sha1],
        resourceTypeCode: resourceVersionCreatorPage.resourceInfo?.resourceTypeCode || '',
      };
      const {
        result,
        error,
      }: Awaited<ReturnType<typeof getFilesSha1Info>> = yield call(getFilesSha1Info, params0);

      // console.log(result, 'resulte53452sdf', error, 'error asdfsdfsdfsdf');

      if (error !== '') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rawProperties: [],
          },
        });
        return fMessage(error, 'error');
      }

      if (result[0].state === 'fail') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rawProperties: [],
          },
        });
        return fMessage('文件解析失败', 'error');
      }

      if (payload.delay) {
        yield call(FUtil.Tool.promiseSleep, 1000);
      }

      if (result[0].state === 'success') {

        const params: Parameters<typeof FServiceAPI.Resource.lookDraft>[0] = {
          resourceId: resourceVersionCreatorPage.resourceInfo?.resourceID || '',
        };
        const { data: data_draft }: {
          data: null | {
            draftData: IResourceCreateVersionDraftType;
          };
        } = yield call(FServiceAPI.Resource.lookDraft, params);

        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rawProperties: result[0].info
              .filter((i) => {
                return i.insertMode === 1;
              })
              .map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((i) => {
                return {
                  key: i.key,
                  name: i.name,
                  value: i.valueDisplay,
                  description: i.remark,
                };
              }),
            rawPropertiesState: 'success',
            additionalProperties: result[0].info
              .filter((i) => {
                return i.insertMode === 2;
              })
              .map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((i) => {
                const item = data_draft?.draftData.additionalProperties?.find((ap) => {
                  return ap.key === i.key;
                }) || {};
                return {
                  key: i.key,
                  name: i.name,
                  value: i.valueDisplay,
                  description: i.remark,
                  ...item,
                };
              }),
          },
        });
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

interface SaveInitDraftParamsType {
  resourceID: string;
  versionInput: string;
}

async function saveInitDraft({ resourceID, versionInput }: SaveInitDraftParamsType): Promise<boolean> {
  const draftData: IResourceCreateVersionDraftType = {
    versionInput: versionInput,
    selectedFileInfo: null,
    additionalProperties: [],
    customProperties: [],
    customConfigurations: [],
    directDependencies: [],
    descriptionEditorInput: '',
    baseUpcastResources: [],
  };

  const params: Parameters<typeof FServiceAPI.Resource.saveVersionsDraft>[0] = {
    resourceId: resourceID,
    draftData: draftData,
  };
  // console.time('保存草稿');
  const { ret, errCode, data }: {
    ret: number;
    errCode: number;
    data: {
      resourceId: string;
      updateDate: string;
      draftData: IResourceCreateVersionDraftType;
    };
  } = await FServiceAPI.Resource.saveVersionsDraft(params);
  // console.timeEnd('保存草稿')
  return ret === 0 && errCode === 0;
}
