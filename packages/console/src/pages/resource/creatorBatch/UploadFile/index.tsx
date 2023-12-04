import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorBatchPageState, ResourceVersionCreatorPageModelState } from '@/models/connect';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { RcFile } from 'antd/lib/upload/interface';
import fReadLocalFiles from '@/components/fReadLocalFiles';
import { Modal } from 'antd';
import Task from './Task';
import * as AHooks from 'ahooks';
import { Dispatch } from 'redux';
import { ChangeAction } from '@/models/resourceCreatorBatchPage';
import { getFilesSha1Info } from '@/utils/service';
// import fObjectSelectorDrawer from '@/components/fObjectSelectorDrawer';
import fObjectsSelectorDrawer from '@/components/fObjectsSelectorDrawer';
import fMessage from '@/components/fMessage';

interface UploadFileProps {
  dispatch: Dispatch;
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
}

function UploadFile({ dispatch, resourceCreatorBatchPage }: UploadFileProps) {

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

  AHooks.useDebounceEffect(() => {
    if ($files.length > 0 && ($successFiles.length + $failFiles.length === $files.length)) {
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
      // data: get$successFiles().map((f) => {
      //   // console.log(f.name, getARightName(f.name), ' f.name sdfijsd;lkfjlk;sdjflksjdlkfjsdlkj');
      //   return {
      //     name: getARightName(f.name),
      //     num: 1,
      //   };
      // }),
    });

    const copyData_ResourceNames: {
      [k: string]: {
        resourceNewNames: string[];
        status: 1 | 2;
      }
    } = JSON.parse(JSON.stringify(data_ResourceNames));

    const { result } = await getFilesSha1Info({
      sha1: get$successFiles().map((f) => {
        return f.sha1;
      }),
      resourceTypeCode: resourceCreatorBatchPage.selectedResourceType?.value || '',
    });

    // console.log(result, 'result s9difjlsdkjflkdsjlfkjdslkjflkdsjfljsdlkfjlksjdkfjlksdf');
    // console.log(data_ResourceNames, 'data_ResourceNames sidfjlsdkjflksdjlfkjlkdsjlk');

    let resourceListInfo = [
      ...resourceCreatorBatchPage.resourceListInfo.map((resource) => {
        const name: string = copyData_ResourceNames[getARightName(resource.resourceName)].resourceNewNames.shift() || getARightName(resource.resourceName);
        return resource;
      }),
      ...get$successFiles().map((f) => {
        const name: string = copyData_ResourceNames[getARightName(f.name)].resourceNewNames.shift() || getARightName(f.name);
        const successFile = result.find((file) => {
          return f.sha1 === file.sha1;
        });
        return {
          fileUID: f.uid,
          fileName: f.name,
          sha1: f.sha1,
          cover: '',
          resourceName: name,
          resourceNameError: '',
          resourceTitle: f.name.replace(new RegExp(/\.[\w-]+$/), '').substring(0, 100),
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
    // console.log(data_objs, 'data_objs 是地方就是领导看见分厘卡记录 ');

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
        // const str: string = f.objectName.replace(new RegExp(/\.[\w-]+$/), '');
        // console.log(str, 'str sfdjlkfjlksdjflkjsdlkfjlksdjlfjlkj');
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
  }

  return (<div className={styles.container2}>
    <div style={{ height: 35 }} />
    <div className={styles.nav}>
      <div className={styles.left}>批量发行资源</div>
      <div style={{ width: 10 }} />
      <div className={styles.other}>{'>'}</div>
      <div style={{ width: 7 }} />
      <div className={styles.other}>上传资源文件</div>
    </div>
    <div style={{ height: 35 }} />
    <div className={styles.cards}>
      <div className={styles.localUpload}>
        <FComponentsLib.FIcons.FLocalUpload style={{ fontSize: 60 }} />
        <div style={{ height: 40 }} />
        <FComponentsLib.FContentText text={'选择本地文件作为发行对象'} type={'additional2'} />
        <div style={{ height: 40 }} />
        <FComponentsLib.FRectBtn
          type={'primary'}
          onClick={async () => {
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
          }}
        >本地上传</FComponentsLib.FRectBtn>
      </div>

      <div className={styles.storageSpace}>
        <FComponentsLib.FIcons.FStorageSpace style={{ fontSize: 60 }} />
        <div style={{ height: 40 }} />
        <FComponentsLib.FContentText
          text={'选择存储空间对象作为发行对象'}
          type={'additional2'}
        />
        <div style={{ height: 40 }} />
        <FComponentsLib.FRectBtn
          type={'primary'}
          onClick={async () => {
            const objIDs: string[] | null = await fObjectsSelectorDrawer({
              resourceTypeCode: resourceCreatorBatchPage.selectedResourceType?.value || '',
            });
            // console.log(objIDs, 'objIDs');
            if (!objIDs) {
              return;
            }

            storageSpaceGotoList(objIDs);
          }}
        >存储空间导入</FComponentsLib.FRectBtn>
      </div>
    </div>

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
  </div>);
}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(UploadFile);

function getARightName(name: string) {
  const newName: string = name.replace(new RegExp(/\.[\w-]+$/), '')
    .substring(0, 50)
    .replace(new RegExp(/[\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#]/g), '_');
  return newName || name;
}
