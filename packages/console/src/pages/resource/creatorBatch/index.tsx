import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorBatchPageState, ResourceVersionCreatorPageModelState } from '@/models/connect';
import ResourceType from './ResourceType';
import UploadFile from './UploadFile';
import ResourceList from './ResourceList';
import Finish from './Finish';
import * as AHooks from 'ahooks';
import { Dispatch } from 'redux';
import { ChangeAction, OnMount_Page_Action, OnUnmount_Page_Action } from '@/models/resourceCreatorBatchPage';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { RcFile } from 'antd/lib/upload/interface';
import { getFilesSha1Info } from '@/utils/service';
import fMessage from '@/components/fMessage';
import fReadLocalFiles from '@/components/fReadLocalFiles';
import fObjectsSelectorDrawer from '@/components/fObjectsSelectorDrawer';
import { getTaskHandler } from '@/components/FResourceBatchUpload';

interface CreatorBatchProps {
  dispatch: Dispatch;
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
}

function CreatorBatch({ dispatch, resourceCreatorBatchPage }: CreatorBatchProps) {

  const [$dataSource, set$dataSource, get$dataSource] = FUtil.Hook.useGetState<ResourceCreatorBatchPageState['resourceListInfo']>(resourceCreatorBatchPage.resourceListInfo);

  React.useEffect(() => {
    set$dataSource(resourceCreatorBatchPage.resourceListInfo);
  }, [resourceCreatorBatchPage.resourceListInfo]);

  AHooks.useMount(() => {
    dispatch<OnMount_Page_Action>({
      type: 'resourceCreatorBatchPage/onMount_Page',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmount_Page_Action>({
      type: 'resourceCreatorBatchPage/onUnmount_Page',
    });
  });

  async function storageSpaceGotoList(objIDs: string[]) {

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
      if (resource.resourceName === '') {
        continue;
      }
      namesMap.set(resource.resourceName, (namesMap.get(resource.resourceName) || 0) + 1);
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

    const data_isOccupied: { [k: string]: boolean } = await isOccupied(data_objs.map((o) => {
      return o.sha1;
    }));
    let resourceListInfo: ResourceCreatorBatchPageState['resourceListInfo'] = [
      ...get$dataSource().map((resource) => {
        const resourceName = copyData_ResourceNames[resource.resourceName].resourceNewNames.shift() || '';
        return {
          ...resource,
          resourceName,
        };
      }),
      ...data_objs.map((obj, obj_index) => {
        let resourceName: string = '';
        const key: string = getARightName(obj.objectName);
        if (key !== '') {
          resourceName = copyData_ResourceNames[key].resourceNewNames.shift() || '';
        }
        const resourceTitle: string = obj.objectName.replace(new RegExp(/\.[\w-]+$/), '').substring(0, 100);
        const successFile = result.find((file) => {
          return obj.sha1 === file.sha1;
        });
        return {
          order: resourceCreatorBatchPage.latestListIndex + obj_index + 1,
          // fileUID: String(resourceCreatorBatchPage.resourceListInfo.length + obj_index),
          fileUID: String(resourceCreatorBatchPage.latestListIndex + obj_index + 1),
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
            .map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((i) => {
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
            .map<ResourceVersionCreatorPageModelState['additionalProperties'][number]>((i) => {
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
          error: data_isOccupied[obj.sha1] ? '被他人占用' : '',
          from: '存储空间',
        };
      }),
    ];
    if (resourceListInfo.length > 20) {
      fMessage('上传不能超过20个文件', 'warning');
      resourceListInfo = resourceListInfo.slice(0, 20);
    }
    dispatch<ChangeAction>({
      type: 'resourceCreatorBatchPage/change',
      payload: {
        showPage: 'resourceList',
        resourceListInfo: resourceListInfo,
        latestListIndex: resourceListInfo[resourceListInfo.length - 1].order,
      },
    });
  }

  async function onLocalUpload() {
    // console.log('onLocalUpload sdfujsdl;kfjlksdjflkjlkj');
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
    // console.log('*************************** 88888');
    dispatch<ChangeAction>({
      type: 'resourceCreatorBatchPage/change',
      payload: {
        showPage: 'resourceList',
        // resourceListInfo: resourceListInfo,
      },
    });

    const handler = await getTaskHandler();
    // console.log(handler, 'handler sdifjlskdjflksdjlkfjlk');

    handler.addTask(files);

  }

  async function onImportStorage() {
    const objIDs: string[] | null = await fObjectsSelectorDrawer({
      resourceTypeCode: resourceCreatorBatchPage.selectedResourceType?.value || '',
    });
    // console.log(objIDs, 'objIDs');
    if (!objIDs) {
      return;
    }

    storageSpaceGotoList(objIDs);
  }

  return (<>

    {
      resourceCreatorBatchPage.showPage === 'resourceType' && (<ResourceType />)
    }

    {
      resourceCreatorBatchPage.showPage === 'uploadFile' && (<UploadFile
        onImportStorage={onImportStorage}
        onLocalUpload={onLocalUpload}
      />)
    }

    {
      resourceCreatorBatchPage.showPage === 'resourceList' && (<ResourceList
        onImportStorage={onImportStorage}
        onLocalUpload={onLocalUpload}
      />)
    }

    {
      resourceCreatorBatchPage.showPage === 'finish' && (<Finish />)
    }
  </>);
}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(CreatorBatch);

function getARightName(name: string) {
  const newName: string = name.replace(new RegExp(/\.[\w-]+$/), '')
    .substring(0, 50)
    .replace(new RegExp(/[\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#]/g), '_');
  return newName;
}

async function isOccupied(sha1s: string[]): Promise<{ [k: string]: boolean }> {
  const result: { [k: string]: boolean } = {};
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

    result[sha1] = data_ResourcesBySha1.length > 0 && data_ResourcesBySha1[0].userId !== FUtil.Tool.getUserIDByCookies();
  }

  return result;
}
