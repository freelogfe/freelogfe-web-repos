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
// import { history } from '@@/core/history';
// import { OnChange_IsOpenCartoon_Action } from '@/models/resourceVersionCreatorPage';
// import FPrompt from '@/components/FPrompt';
import Task from '@/pages/resource/creatorBatch/UploadFile/Task';
import { Modal } from 'antd';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { RcFile } from 'antd/lib/upload/interface';
import { getFilesSha1Info } from '@/utils/service';
import fMessage from '@/components/fMessage';
import fReadLocalFiles from '@/components/fReadLocalFiles';
import fObjectsSelectorDrawer from '@/components/fObjectsSelectorDrawer';

interface CreatorBatchProps {
  dispatch: Dispatch;
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
}

function CreatorBatch({ dispatch, resourceCreatorBatchPage }: CreatorBatchProps) {

  const [$files, set$files, get$files] = FUtil.Hook.useGetState<RcFile[]>([]);

  const [$successFiles, set$successFiles, get$successFiles] = FUtil.Hook.useGetState<{
    uid: string;
    name: string;
    sha1: string;
  }[]>([]);
  const [$failFiles, set$failFiles, get$failFiles] = FUtil.Hook.useGetState<{
    uid: string;
    name: string;
    sha1: string;
  }[]>([]);

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

  AHooks.useDebounceEffect(() => {
    if (get$files().length > 0 && (get$successFiles().length + get$failFiles().length === get$files().length)) {
      localUploadGotoList();

    }
  }, [$files, $successFiles, $failFiles], {
    wait: 300,
  });

  async function localUploadGotoList() {
    const namesMap: Map<string, number> = new Map<string, number>();

    for (const resource of resourceCreatorBatchPage.resourceListInfo) {
      if (resource.resourceName === '') {
        continue;
      }
      namesMap.set(resource.resourceName, (namesMap.get(resource.resourceName) || 0) + 1);
    }

    for (const resource of get$successFiles()) {
      if (resource.name === '') {
        continue;
      }
      const name: string = getARightName(resource.name);
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

    // console.log(copyData_ResourceNames, 'copyData_ResourceNames sdifjokwejlfjlwjflsdj');

    const { result } = await getFilesSha1Info({
      sha1: get$successFiles().map((f) => {
        return f.sha1;
      }),
      resourceTypeCode: resourceCreatorBatchPage.selectedResourceType?.value || '',
    });

    // console.log(result, 'result sdifj;lsdkjfljl');
    let resourceListInfo = [
      ...resourceCreatorBatchPage.resourceListInfo.map((resource) => {
        copyData_ResourceNames[resource.resourceName].resourceNewNames.shift();
        return resource;
      }),
      ...get$successFiles().map((f) => {
        let resourceName: string = '';
        const key: string = getARightName(f.name);
        if (key !== '') {
          resourceName = copyData_ResourceNames[getARightName(f.name)].resourceNewNames.shift() || '';
        }
        const resourceTitle: string = f.name.replace(new RegExp(/\.[\w-]+$/), '').substring(0, 100);
        // console.log(f.name, 'f.name sidfjlksdjflkjsdlkjl');
        // console.log(name, 'name sidfjlksdjflkjsdlkjl');
        const successFile = result.find((file) => {
          return f.sha1 === file.sha1;
        });
        return {
          fileUID: f.uid,
          fileName: f.name,
          sha1: f.sha1,
          cover: '',
          resourceName: resourceName,
          resourceNameError: resourceName === '' ? '请输入资源授权标识' : '',
          resourceTitle: resourceTitle === '' ? '': '',
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
      },
    });

    set$files([]);
    set$successFiles([]);
    set$failFiles([]);

  }

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

    const { data: data_ResourceNames }: {
      data: {
        [k: string]: {
          resourceNewNames: string[];
          status: 1 | 2;
        };
      }
    } = await FServiceAPI.Resource.generateResourceNames({
      data: data_objs.map((f) => {
        return {
          name: getARightName(f.objectName),
          num: 1,
        };
      }),
    });
    // console.log(data_ResourceNames, 'data_ResourceNames sdifjsa;dlkfjlsdjlfkjsldj');

    const { result } = await getFilesSha1Info({
      sha1: data_objs.map((f) => {
        return f.sha1;
      }),
      resourceTypeCode: resourceCreatorBatchPage.selectedResourceType?.value || '',
    });

    // console.log(result, 'result saedifojsdlkfjlksdjflkjlkj');

    let resourceListInfo = [
      ...resourceCreatorBatchPage.resourceListInfo,
      ...data_objs.map((f) => {
        const name: string = data_ResourceNames[getARightName(f.objectName)].resourceNewNames[0];
        const successFile = result.find((file) => {
          return f.sha1 === file.sha1;
        });
        return {
          fileUID: f.objectId,
          fileName: f.objectName,
          sha1: f.sha1,
          cover: '',
          resourceName: name,
          resourceNameError: '',
          resourceTitle: f.objectName.replace(new RegExp(/\.[\w-]+$/), '').substring(0, 100),
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
      },
    });

    // console.log('******************************************');


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

    // console.log(files, 'files 09wie3ojrflsikdjflsdjlfkjlkjlk');
    set$files(files);
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
    {/*{console.log($files, '$files sdolikfjsdlkjflkjlk')}*/}
    <Modal
      open={$files.length > 0}
      title={null}
      footer={null}
      closable={false}
      width={600}
      bodyStyle={{
        padding: 20,
      }}
    >
      {
        $files.map((file) => {
          // console.log(file, 'sdFSDFSDFSDFSAFsdfsdalkjflkjl');
          return (<Task
            resourceTypeCode={resourceCreatorBatchPage.selectedResourceType?.value || ''}
            key={file.uid}
            file={file}
            onFail={(value) => {
              set$failFiles([
                ...get$failFiles(),
                value,
              ]);
            }}
            onSuccess={(value) => {
              // console.log(value, 'value sdifjsldkfjlksdjfklsdjlkfjlkj');
              set$successFiles([
                ...get$successFiles(),
                value,
              ]);
            }}
          />);
        })
      }
    </Modal>
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
