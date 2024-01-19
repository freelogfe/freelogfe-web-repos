import * as React from 'react';
import styles from './index.less';
import { Dispatch } from 'redux';
import { ChangeAction, ResourceCreatorBatchPageState } from '@/models/resourceCreatorBatchPage';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { RcFile } from 'antd/lib/upload/interface';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import { history } from '@@/core/history';
import FPrompt from '@/components/FPrompt';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';
import FPopover from '@/components/FPopover';
import { getFilesSha1Info } from '@/utils/service';
import fMessage from '@/components/fMessage';
import fObjectsSelectorDrawer from '@/components/fObjectsSelectorDrawer';
import UploadFile from './NoDate';
import Card from './Card';
import ErrorCard from './ErrorCard';
import Task from './Task';
import fReadLocalFiles from '@/components/fReadLocalFiles';
import * as AHooks from 'ahooks';

interface HandleProps {
  dispatch: Dispatch;
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
}

interface HandleStates {
  dataSource: {
    uid: string;
    state: 'localUpload' | 'list' | 'error';
    localUploadInfo: {
      uid: string;
      file: RcFile;
    } | null;
    listInfo: {
      uid: string;
      fileName: string;
      sha1: string;
      cover: string;
      resourceName: string;
      resourceNameError: string;
      resourceTitle: string;
      resourceTitleError: string;
      resourceLabels: string[];
      resourcePolicies: {
        title: string;
        text: string;
      }[];
      showMore: boolean;
      rawProperties: {
        key: string;
        name: string;
        value: string;
        description: string;
      }[];
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
    } | null;
    errorInfo: {
      uid: string;
      name: string;
      sha1: string;
      // reason: string;
      from: string;
      errorText: string;
      selfUsedResourcesAndVersions?: {
        resourceID: string;
        resourceName: string;
        resourceType: string[];
        resourceVersion: string;
        url: string;
      }[]
      otherUsedResourcesAndVersions?: {
        resourceID: string;
        resourceName: string;
        resourceType: string[];
        resourceVersion: string;
        url: string;
      }[];
    } | null;
  }[];
  tempLocalSuccess: {
    uid: string;
    name: string;
    sha1: string;
  }[];
}

const initStates: HandleStates = {
  dataSource: [],
  tempLocalSuccess: [],
};

function Handle({ dispatch, resourceCreatorBatchPage }: HandleProps) {
  const [$dataSource, set$dataSource, get$dataSource] = FUtil.Hook.useGetState<HandleStates['dataSource']>(initStates['dataSource']);
  const [$tempLocalSuccess, set$tempLocalSuccess, get$tempLocalSuccess] = FUtil.Hook.useGetState<HandleStates['tempLocalSuccess']>(initStates['tempLocalSuccess']);

  AHooks.useDebounceEffect(() => {
    // console.log(get$dataSource(), get$tempLocalSuccess(), 'get$dataSource(), get$tempLocalSuccess() 色打发士大夫');
    if (get$tempLocalSuccess().length > 0 && get$dataSource().filter((d) => {
      return d.state === 'localUpload' && d.localUploadInfo;
    }).length === get$tempLocalSuccess().length) {
      handleLocalUploadSuccess();
    }

  }, [$dataSource, $tempLocalSuccess], {
    wait: 300,
  });

  const { run } = AHooks.useDebounceFn(() => {
    verifyDuplicationResourceName();
  }, {
    wait: 200,
  });

  function verifyDuplicationResourceName() {
    const map: Map<string, number> = new Map<string, number>();
    for (const resource of get$dataSource()) {
      if (resource.state === 'list' && resource.listInfo) {
        map.set(resource.listInfo.resourceName, (map.get(resource.listInfo.resourceName) || 0) + 1);
      }
    }

    const dataSource: HandleStates['dataSource'] = get$dataSource().map((info) => {
      if (info.state === 'list' && info.listInfo) {
        return {
          ...info,
          listInfo: {
            ...info.listInfo,
            resourceNameError: (info.listInfo.resourceNameError !== '' && info.listInfo.resourceNameError !== '不能重复')
              ? info.listInfo.resourceNameError
              : ((map.get(info.listInfo.resourceName) || 0) > 1 ? '不能重复' : ''),
          },
        };
      }
      return info;
    });
    set$dataSource(dataSource);
  }

  async function handleLocalUploadSuccess() {
    const namesMap: Map<string, number> = new Map<string, number>();

    for (const resource of get$dataSource()) {
      if (resource.state !== 'list' || !resource.listInfo || resource.listInfo.resourceName === '') {
        continue;
      }
      namesMap.set(resource.listInfo.resourceName, (namesMap.get(resource.listInfo.resourceName) || 0) + 1);
    }

    for (const s of get$tempLocalSuccess()) {
      if (s.name === '') {
        continue;
      }
      const name: string = getARightName(s.name);
      namesMap.set(name, (namesMap.get(name) || 0) + 1);
    }

    const { data: data_ResourceNames }: {
      data: {
        [k: string]: {
          resourceNewNames: string[];
          status: 1 | 2;
        };
      }
    } = await FServiceAPI.Resource.generateResourceNames({
      data: Array.from(namesMap.entries()).map(([key, value]) => {
        return {
          name: key,
          num: value,
        };
      }),
    });

    const copyData_ResourceNames: {
      [k: string]: {
        resourceNewNames: string[];
        status: 1 | 2;
      }
    } = JSON.parse(JSON.stringify(data_ResourceNames));

    const { result } = await getFilesSha1Info({
      sha1: get$tempLocalSuccess().map((f) => {
        return f.sha1;
      }),
      resourceTypeCode: resourceCreatorBatchPage.selectedResourceType?.value || '',
    });

    let covers: string[] = [];
    if (resourceCreatorBatchPage.selectedResourceType?.labels.includes('图片')) {
      const coverPromise = get$tempLocalSuccess().map((o) => {
        return FServiceAPI.Storage.handleImage({
          sha1: o.sha1,
        });
      });
      const res: { ret: number, errCode: number, data: { url: string } }[] = await Promise.all(coverPromise);
      covers = res.map(({ ret, errCode, data }) => {
        if (ret === 0 && errCode === 0) {
          return data.url || '';
        }
        return '';
      });
    }
    let dataSource: HandleStates['dataSource'] = get$dataSource().map((resource) => {
      if (resource.state !== 'list' || !resource.listInfo || resource.listInfo.resourceName === '') {
        return resource;
      }
      const resourceName = copyData_ResourceNames[resource.listInfo.resourceName].resourceNewNames.shift() || '';
      return {
        ...resource,
        resourceName,
      };
    });

    const newDataSource: HandleStates['dataSource'] = get$tempLocalSuccess().map((f, f_index) => {
      let resourceName: string = '';
      const key: string = getARightName(f.name);
      if (key !== '') {
        resourceName = copyData_ResourceNames[getARightName(f.name)].resourceNewNames.shift() || '';
      }
      const resourceTitle: string = f.name.replace(new RegExp(/\.[\w-]+$/), '').substring(0, 100);
      const successFile = result.find((file) => {
        return f.sha1 === file.sha1;
      });
      return {
        uid: f.uid,
        state: 'list',
        listInfo: {
          uid: f.uid,
          fileName: f.name,
          sha1: f.sha1,
          cover: covers[f_index] || '',
          resourceName: resourceName,
          resourceNameError: resourceName === '' ? '请输入资源授权标识' : '',
          resourceTitle: resourceTitle,
          resourceTitleError: '',
          resourceLabels: [],
          resourcePolicies: [],
          showMore: false,
          rawProperties: (successFile?.info || [])
            .filter((i) => {
              return i.insertMode === 1;
            })
            .map<NonNullable<HandleStates['dataSource'][number]['listInfo']>['rawProperties'][number]>((i) => {
              return {
                key: i.key,
                name: i.name,
                value: i.valueDisplay,
                description: i.remark,
              };
            }),
          additionalProperties: (successFile?.info || [])
            .filter((i) => {
              return i.insertMode === 2;
            })
            .map<NonNullable<HandleStates['dataSource'][number]['listInfo']>['additionalProperties'][number]>((i) => {
              return {
                key: i.key,
                name: i.name,
                value: i.valueDisplay,
                description: i.remark,
              };
            }),
          customProperties: [],
          customConfigurations: [],
          directDependencies: [],
          baseUpcastResources: [],
          resolveResources: [],
          isCompleteAuthorization: true,
        },
        localUploadInfo: null,
        errorInfo: null,
      };
    });

    dataSource = dataSource.map((d) => {
      const data = newDataSource.find((nds) => {
        return nds.uid === d.uid;
      });
      if (!data) {
        return d;
      }
      return data;
    });

    set$dataSource(dataSource);
    set$tempLocalSuccess([]);
  }

  async function onLocalUpload() {
    const { data: data_acceptResourceType }: {
      data: {
        formats: string[];
      }
    } = await FServiceAPI.Resource.getResourceTypeInfoByCode({
      code: resourceCreatorBatchPage.selectedResourceType?.value || '',
    });
    if (!data_acceptResourceType) {
      return;
    }

    // set$accept();
    const files: RcFile[] | null = await fReadLocalFiles({
      accept: data_acceptResourceType.formats.join(','),
      multiple: true,
    });

    if (!files) {
      return;
    }

    const localDataSource: HandleStates['dataSource'] = files.map((f) => {
      return {
        uid: f.uid,
        state: 'localUpload',
        localUploadInfo: {
          uid: f.uid,
          file: f,
        },
        listInfo: null,
        errorInfo: null,
      };
    });

    let dataSource: HandleStates['dataSource'] = [
      ...get$dataSource(),
      ...localDataSource,
    ];
    if (dataSource.length > 20) {
      fMessage('上传不能超过20个文件', 'warning');
      dataSource = dataSource.slice(0, 20);
    }
    // console.log(dataSource, 'onLocalUpload asdfsad;lfkjasdlfjlksdjflkjlkj');
    set$dataSource(dataSource);
  }

  async function onImportStorage() {

    const objIDs: string[] | null = await fObjectsSelectorDrawer({
      resourceTypeCode: resourceCreatorBatchPage.selectedResourceType?.value || '',
    });
    // console.log(objIDs, 'objIDs');
    if (!objIDs) {
      return;
    }

    const { data: data_objs }: {
      data: {
        customProperty: any;
        customPropertyDescriptors: any[]
        dependencies: [],
        objectId: string;
        objectName: string;
        sha1: string;
      }[];
    } = await FServiceAPI.Storage.batchObjectList({
      objectIds: objIDs.join(','),
    });

    const namesMap: Map<string, number> = new Map<string, number>();

    for (const resource of get$dataSource()) {
      if (!resource.listInfo || resource.listInfo.resourceName === '') {
        continue;
      }
      namesMap.set(resource.listInfo.resourceName, (namesMap.get(resource.listInfo.resourceName) || 0) + 1);
    }

    for (const obj of data_objs) {
      const name = getARightName(obj.objectName);
      if (name === '') {
        continue;
      }
      namesMap.set(name, (namesMap.get(name) || 0) + 1);
    }

    const { data: data_ResourceNames }: {
      data: {
        [k: string]: {
          resourceNewNames: string[];
          status: 1 | 2;
        };
      }
    } = await FServiceAPI.Resource.generateResourceNames({
      data: Array.from(namesMap.entries()).map(([key, value]) => {
        return {
          name: key,
          num: value,
        };
      }),
    });

    const copyData_ResourceNames: {
      [k: string]: {
        resourceNewNames: string[];
        status: 1 | 2;
      }
    } = JSON.parse(JSON.stringify(data_ResourceNames));

    const { result } = await getFilesSha1Info({
      sha1: data_objs.map((f) => {
        return f.sha1;
      }),
      resourceTypeCode: resourceCreatorBatchPage.selectedResourceType?.value || '',
    });

    let covers: string[] = [];
    if (resourceCreatorBatchPage.selectedResourceType?.labels.includes('图片')) {
      // console.error(info, 'info 89weijufoliksjdlfkjsdlkfjlkdsjflksdjlfkj');
      const coverPromise = data_objs.map((o) => {
        return FServiceAPI.Storage.handleImage({
          sha1: o.sha1,
        });
      });
      const res: { ret: number, errCode: number, data: { url: string } }[] = await Promise.all(coverPromise);

      // console.error(res, 'res sdflksdjflksjdlkfjlksdjflsdjlfjlskdjlk');
      covers = res.map(({ ret, errCode, data }) => {
        if (ret === 0 && errCode === 0) {
          return data.url || '';
        }
        return '';
      });
    }

    const data_isOccupied: {
      [sha1: string]: {
        userId: number;
        resourceId: string;
        resourceName: string;
        resourceType: string[];
        version: string;
        resourceVersions: {
          version: string;
        }[];
      }[];
    } = await occupies(data_objs.map((o) => {
      return o.sha1;
    }));
    // console.log(data_isOccupied, 'data_isOccupied sdifj;lsdkfjlkdsjflkjsdlkfjlkj');
    let dataSource: HandleStates['dataSource'] = [
      ...get$dataSource().map((resource) => {
        if (!resource.listInfo) {
          return resource;
        }
        const resourceName = copyData_ResourceNames[resource.listInfo.resourceName].resourceNewNames.shift() || '';
        return {
          ...resource,
          resourceName,
        };
      }),
      ...data_objs.map((obj, obj_index) => {
        const uid: string = String(Math.random());
        if (data_isOccupied[obj.sha1] && data_isOccupied[obj.sha1].length > 0 && data_isOccupied[obj.sha1][0].userId !== FUtil.Tool.getUserIDByCookies()) {
          const errorInfo: NonNullable<HandleStates['dataSource'][number]> = {
            uid: uid,
            state: 'error',
            errorInfo: {
              uid: uid,
              sha1: obj.sha1,
              name: obj.objectName,
              from: '存储空间',
              errorText: FI18n.i18nNext.t('submitresource_err_resourceexist_otheruser'),
              otherUsedResourcesAndVersions: data_isOccupied[obj.sha1].map((d) => {
                return d.resourceVersions.map((v: any) => {
                  return {
                    resourceID: d.resourceId,
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
            listInfo: null,
            localUploadInfo: null,
          };
          return errorInfo;
        }
        if (data_isOccupied[obj.sha1] && data_isOccupied[obj.sha1].length > 0 && data_isOccupied[obj.sha1][0].userId === FUtil.Tool.getUserIDByCookies()) {
          const errorInfo: NonNullable<HandleStates['dataSource'][number]> = {
            uid: uid,
            state: 'error',
            errorInfo: {
              uid: uid,
              sha1: obj.sha1,
              name: obj.objectName,
              from: '存储空间',
              errorText: FI18n.i18nNext.t('submitresource_err_resourceexist_sameuser'),
              selfUsedResourcesAndVersions: data_isOccupied[obj.sha1].map((d) => {
                return d.resourceVersions.map((v: any) => {
                  return {
                    resourceID: d.resourceId,
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
            listInfo: null,
            localUploadInfo: null,
          };
          return errorInfo;
        }

        let resourceName: string = '';
        const key: string = getARightName(obj.objectName);
        if (key !== '') {
          resourceName = copyData_ResourceNames[key].resourceNewNames.shift() || '';
        }
        const resourceTitle: string = obj.objectName.replace(new RegExp(/\.[\w-]+$/), '').substring(0, 100);
        const successFile = result.find((file) => {
          return obj.sha1 === file.sha1;
        });


        const listInfo: NonNullable<HandleStates['dataSource'][number]> = {
          uid: uid,
          state: 'list',
          listInfo: {
            uid: uid,
            fileName: obj.objectName,
            sha1: obj.sha1,
            cover: covers[obj_index] || '',
            resourceName: resourceName,
            resourceNameError: '',
            resourceTitle: resourceTitle,
            resourceTitleError: '',
            resourceLabels: [],
            resourcePolicies: [],
            showMore: false,
            rawProperties: (successFile?.info || [])
              .filter((i) => {
                return i.insertMode === 1;
              })
              .map<NonNullable<HandleStates['dataSource'][number]['listInfo']>['rawProperties'][number]>((i) => {
                return {
                  key: i.key,
                  name: i.name,
                  value: i.valueDisplay,
                  description: i.remark,
                };
              }),
            additionalProperties: (successFile?.info || [])
              .filter((i) => {
                return i.insertMode === 2;
              })
              .map<NonNullable<HandleStates['dataSource'][number]['listInfo']>['additionalProperties'][number]>((i) => {
                return {
                  key: i.key,
                  name: i.name,
                  value: i.valueDisplay,
                  description: i.remark,
                };
              }),
            customProperties: [],
            customConfigurations: [],
            directDependencies: [],
            baseUpcastResources: [],
            resolveResources: [],
            isCompleteAuthorization: true,
          },
          localUploadInfo: null,
          errorInfo: null,
        };
        return listInfo;
      }),
    ];
    if (dataSource.length > 20) {
      fMessage('上传不能超过20个文件', 'warning');
      dataSource = dataSource.slice(0, 20);
    }
    set$dataSource(dataSource);
  }

  async function onClickRelease() {
    const createResourceObjects: {
      name: string;
      resourceTitle?: string;
      policies?: {
        policyName: string;
        policyText: string;
        status?: 1 | 0;
      }[];
      coverImages?: string[];
      intro?: string;
      tags?: string[];

      version: string;
      fileSha1: string;
      filename: string;
      description?: string;
      dependencies?: {
        resourceId: string;
        versionRange: string;
      }[];
      customPropertyDescriptors?: {
        key: string;
        name: string;
        defaultValue: string;
        type: 'editableText' | 'readonlyText' | 'radio' | 'checkbox' | 'select';
        candidateItems?: string[];
        remark?: string;
      }[];
      baseUpcastResources?: {
        resourceId: string;
      }[];
      resolveResources: {
        resourceId: string;
        contracts: {
          policyId: string;
        }[];
      }[];
      inputAttrs?: {
        key: string;
        value: string;
      }[];
    }[] = [];

    for (const data of get$dataSource()) {
      if (data.state === 'list' && data.listInfo) {
        const item = data.listInfo;
        createResourceObjects.push({
          name: item.resourceName,
          resourceTitle: item.resourceTitle,
          policies: item.resourcePolicies.map((p) => {
            return {
              policyName: p.title,
              policyText: p.text,
              status: 1,
            };
          }),
          coverImages: item.cover === '' ? [] : [item.cover],
          intro: '',
          tags: item.resourceLabels,
          version: '1.0.0',
          fileSha1: item.sha1,
          filename: item.fileName,
          description: '',
          customPropertyDescriptors: [
            ...item.customProperties
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
            ...item.customConfigurations
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
          baseUpcastResources: item.baseUpcastResources.map((r) => {
            return { resourceId: r.resourceID };
          }),
          dependencies: item.directDependencies
            .map((r) => {
              return {
                resourceId: r.id,
                versionRange: r.versionRange || '',
              };
            }),
          resolveResources: item.resolveResources,
          inputAttrs: item.additionalProperties
            .filter((ap) => {
              return ap.value !== '';
            })
            .map((ap) => {
              return {
                key: ap.key,
                value: ap.value,
              };
            }),
        });
      }
    }

    const params: Parameters<typeof FServiceAPI.Resource.createBatch>[0] = {
      resourceTypeCode: resourceCreatorBatchPage.selectedResourceType?.value || '',
      createResourceObjects: createResourceObjects,
    };
    const { data } = await FServiceAPI.Resource.createBatch(params);
    // console.log(data, 'data isdjflksjdlkfjslkdjflkjsolikfjewsoijlkj');
    const list: {
      resourceID: string;
      resourceName: string;
      resourceTitle: string;
      cover: string;
      status: 'online' | 'offline' | 'unreleased' | 'freeze';
      policies: string[];
      failReason: string;
    }[] = Object.values(data).map((d: any) => {
      const data = d.data;
      return {
        resourceID: data.resourceId,
        resourceName: data.resourceName,
        resourceTitle: data.resourceTitle,
        cover: data.coverImages,
        status: data.status === 2
          ? 'freeze'
          : data.status === 1
            ? 'online'
            : data.status === 0
              ? 'unreleased'
              : 'offline',
        policies: data.policies.map((p: any) => {
          return p.policyName;
        }),
        failReason: d.message || '',
      };
    });
    // console.log(list, 'sdiofj;sldkjflksdjfolijsdolfjlksdjlkj');
    dispatch<ChangeAction>({
      type: 'resourceCreatorBatchPage/change',
      payload: {
        showPage: 'finish',
        resultList: list,
      },
    });
  }

  if ($dataSource.length === 0) {
    return (<UploadFile
      onLocalUpload={onLocalUpload}
      onImportStorage={onImportStorage}
    />);
  }

  return (<>
    <FPrompt
      watch={$dataSource.length > 0}
      messageText={'还没有保存，现在离开会导致信息丢失'}
      onOk={(locationHref) => {
        history.push(locationHref);
      }}
    />

    <div className={styles.container3}>
      <div style={{ width: 920 }}>
        <div style={{ height: 35 }} />
        <div className={styles.nav}>
          <div className={styles.left}>{FI18n.i18nNext.t('brr_title_bulkreleaseresource')}</div>
          <div style={{ width: 10 }} />
          <div className={styles.other}>{'>'}</div>
          <div style={{ width: 7 }} />
          <div className={styles.other}>{FI18n.i18nNext.t('brr_resourcelisting_title')}</div>
        </div>
        <div style={{ height: 35 }} />
        <div className={styles.header}>
          <Space size={10}>
            <FComponentsLib.FContentText
              text={FI18n.i18nNext.t('brr_resourcelisting_label_resourcetype')}
              type={'additional2'}
            />
            <FComponentsLib.FContentText
              text={resourceCreatorBatchPage.selectedResourceType?.labels.join('/')}
              type={'highlight'}
              style={{ fontSize: 12 }}
            />
          </Space>

          <FComponentsLib.FContentText
            // text={`共 ${resourceCreatorBatchPage.resourceListInfo.length} 个资源`}
            text={FI18n.i18nNext.t('brr_resourcelisting_label_resourceqty', {
              ResourceQty: $dataSource.length,
            })}
            type={'additional2'}
          />

        </div>
        {
          $dataSource.map((r, ri) => {

            return (<React.Fragment key={r.uid}>
              <div style={{ height: 40 }} />
              {
                r.state === 'localUpload' && r.localUploadInfo && (<Task
                  order={ri + 1}
                  file={r.localUploadInfo.file}
                  resourceTypeCode={resourceCreatorBatchPage.selectedResourceType?.value || ''}
                  resourceType={resourceCreatorBatchPage.selectedResourceType?.labels || []}
                  onSuccess={(value) => {
                    set$tempLocalSuccess([
                      ...get$tempLocalSuccess(),
                      value,
                    ]);
                  }}
                  onFail={(value) => {
                    set$dataSource(get$dataSource().map((d) => {
                      if (d.uid !== value.uid) {
                        return d;
                      }
                      return {
                        uid: value.uid,
                        state: 'error',
                        errorInfo: {
                          uid: value.uid,
                          sha1: value.sha1,
                          name: value.name,
                          from: '本地上传',
                          errorText: value.errorText,
                          otherUsedResourcesAndVersions: value.otherUsedResourcesAndVersions,
                          selfUsedResourcesAndVersions: value.selfUsedResourcesAndVersions,
                        },
                        listInfo: null,
                        localUploadInfo: null,
                      };
                    }));
                  }}
                  onCancel={(value) => {
                    set$dataSource(get$dataSource().filter((d) => {
                      return d.uid !== value.uid;
                    }));
                  }}
                />)
              }
              {
                r.state === 'list' && !!r.listInfo && (<Card
                  resourceType={resourceCreatorBatchPage.selectedResourceType?.labels || []}
                  order={ri + 1}
                  username={'$username'}
                  info={r.listInfo}
                  onChange={(value) => {
                    // console.log(value, 'onChange value sidjflksdjflkjsdlkfjlksdfjlksdjlfjlksdjflkjsdlkf');
                    let dataSource: HandleStates['dataSource'] = get$dataSource().map((d) => {
                      if (d.uid !== r.uid) {
                        return d;
                      }
                      return {
                        ...d,
                        listInfo: value,
                      };
                    });
                    // console.log(dataSource, 'onChange sdfjsdalkfjlksdjflksjdlfkjlkdsjflkj');
                    set$dataSource(dataSource);
                    run();
                  }}
                  onDelete={() => {
                    const dataSource: HandleStates['dataSource'] = get$dataSource()
                      .filter((rli) => {
                        return rli.uid !== r.uid;
                      });
                    set$dataSource(dataSource);
                    run();
                  }}
                  onClickApplyPolicies={($dataSource.filter((ds) => {
                    return ds.state === 'list' && ds.listInfo;
                  }).length <= 1 || r.listInfo.resourcePolicies.length === 0) ? undefined : async () => {

                    let confirm: boolean = await fPromiseModalConfirm({
                      title: '添加策略到其它资源',
                      description: FI18n.i18nNext.t('是否将策略应用于此处发行的所有资源？'),
                      cancelText: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddtags_btn_no'),
                      okText: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddtags_btn_yes'),
                    });

                    if (!confirm) {
                      return;
                    }

                    const dataSource: HandleStates['dataSource'] = get$dataSource().map((rli) => {
                      if (r.uid === rli.uid || !rli.listInfo || !r.listInfo) {
                        return rli;
                      }
                      const usedText: string[] = rli.listInfo.resourcePolicies.map((p) => {
                        return p.text;
                      });
                      const usedTile: string[] = rli.listInfo.resourcePolicies.map((p) => {
                        return p.title;
                      });
                      const policies: {
                        title: string;
                        text: string;
                      }[] = r.listInfo.resourcePolicies.filter((p) => {
                        return !usedText.includes(p.text) && !usedTile.includes(p.title);
                      });
                      return {
                        ...rli,
                        listInfo: {
                          ...rli.listInfo,
                          resourcePolicies: [
                            ...rli.listInfo.resourcePolicies,
                            ...policies,
                          ],
                        },
                      };
                    });

                    set$dataSource(dataSource);
                  }}
                  onClickApplyLabels={($dataSource.filter((ds) => {
                    return ds.state === 'list' && ds.listInfo;
                  }).length <= 1 || r.listInfo.resourceLabels.length === 0) ? undefined : async () => {
                    let confirm: boolean = await fPromiseModalConfirm({
                      title: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddtags_title'),
                      description: FI18n.i18nNext.t('是否将标签应用于此处发行的所有资源？'),
                      cancelText: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddtags_btn_no'),
                      okText: FI18n.i18nNext.t('brr_resourcelisting_confirmation_bulkaddtags_btn_yes'),
                    });

                    if (!confirm) {
                      return;
                    }

                    const dataSource: HandleStates['dataSource'] = get$dataSource().map((rli) => {
                      if (r.uid === rli.uid || !rli.listInfo || !r.listInfo) {
                        return rli;
                      }
                      const resourceLabels: string[] = Array.from(new Set([...rli.listInfo.resourceLabels, ...r.listInfo.resourceLabels])).slice(0, 20);
                      return {
                        ...rli,
                        listInfo: {
                          ...rli.listInfo,
                          resourceLabels: resourceLabels,
                        },
                      };
                    });
                    set$dataSource(dataSource);
                  }}
                />)
              }

              {
                r.state === 'error' && !!r.errorInfo && (<ErrorCard
                  order={ri + 1}
                  errorInfo={r.errorInfo}
                  onDelete={() => {
                    const dataSource: HandleStates['dataSource'] = get$dataSource()
                      .filter((rli) => {
                        return rli.uid !== r.uid;
                      });
                    set$dataSource(dataSource);
                  }}
                  onCorrect={(value) => {
                    console.log(value, 'value sdaifj;lsdkjflksdjlfkjdslkfjlksdjl');
                  }}
                />)
              }

            </React.Fragment>);
          })
        }
        <div style={{ height: 100 }} />
      </div>

    </div>

    <div className={styles.submit}>
      <div>
        <div>
          <FComponentsLib.FIcons.FInfo style={{ fontSize: 12 }} />
          &nbsp;{FI18n.i18nNext.t('brr_resourcelisting_toggles_availabletoauth')}
        </div>
        <Space size={20}>

          {
            $dataSource.length < 20 && (<FPopover
              // open={true}
              title={null}
              overlayInnerStyle={{ padding: 0 }}
              overlayStyle={{ padding: 0 }}
              style={{ padding: 0 }}
              content={<div className={styles.continue}>
                <div onClick={() => {
                  onLocalUpload();
                }}>
                  <FComponentsLib.FIcons.FLocalUpload />
                  <div>{FI18n.i18nNext.t('brr_submitresource_btn_uploadfromlocal')}
                  </div>
                </div>
                <div onClick={() => {
                  onImportStorage();
                }}>
                  <FComponentsLib.FIcons.FStorageSpace />
                  <div>{FI18n.i18nNext.t('brr_submitresource_btn_importfromstorage')}
                  </div>
                </div>
              </div>}
            >
              <div>
                <FComponentsLib.FRectBtn
                >{FI18n.i18nNext.t('brr_resourcelisting_btn_moretoupload')}</FComponentsLib.FRectBtn></div>
            </FPopover>)
          }
          <FComponentsLib.FRectBtn
            disabled={$dataSource
              .filter((ds) => {
                return ds.state === 'list' && ds.listInfo;
              }).length === 0
            || $dataSource.some((ds) => {
              return ds.state !== 'list' || !ds.listInfo;
            })
            || $dataSource.some((r) => {
              return r.state === 'list'
                && r.listInfo
                && (r.listInfo.resourceNameError !== ''
                  || r.listInfo.resourceTitleError !== ''
                  || !r.listInfo.isCompleteAuthorization);
            })}
            onClick={() => {
              onClickRelease();
            }}
          >{FI18n.i18nNext.t('brr_resourcelisting_btn_completerelease')}</FComponentsLib.FRectBtn>
        </Space>

      </div>
    </div>
  </>);
}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(Handle);

function getARightName(name: string) {
  const newName: string = name.replace(new RegExp(/\.[\w-]+$/), '')
    .substring(0, 50)
    .replace(new RegExp(/[\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#]/g), '_');
  return newName;
}

async function occupies(sha1s: string[]): Promise<{
  [sha1: string]: {
    userId: number;
    resourceId: string;
    resourceName: string;
    resourceType: string[];
    version: string;
    resourceVersions: {
      version: string;
    }[];
  }[];
}> {
  // console.log(sha1s, 'sha1s sdifjlsdkjflkjsha1s sha1s sdfijsd;lkfjlksdjflkjlkj');
  const result: {
    [sha1: string]: {
      userId: number;
      resourceId: string;
      resourceName: string;
      resourceType: string[];
      version: string;
      resourceVersions: {
        version: string;
      }[];
    }[];
  } = {};
  for (const sha1 of sha1s) {
    const params3: Parameters<typeof FServiceAPI.Resource.getResourceBySha1>[0] = {
      fileSha1: sha1,
    };

    const { data: data_ResourcesBySha1 }: {
      data: {
        userId: number;
        resourceId: string;
        resourceName: string;
        resourceType: string[];
        version: string;
        resourceVersions: {
          version: string;
        }[];
      }[];
    } = await FServiceAPI.Resource.getResourceBySha1(params3);

    if (data_ResourcesBySha1.length > 0) {
      result[sha1] = data_ResourcesBySha1;
    }
  }
  return result;
}
