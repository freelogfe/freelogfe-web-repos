import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorBatchPageState } from '@/models/connect';
import ResourceType from './ResourceType';
// import UploadFile from './UploadFile';
// import ResourceList from './ResourceList';
import Finish from './Finish';
import * as AHooks from 'ahooks';
import { Dispatch } from 'redux';
import { OnMount_Page_Action, OnUnmount_Page_Action } from '@/models/resourceCreatorBatchPage';
// import { FServiceAPI, FUtil } from '@freelog/tools-lib';
// import { RcFile } from 'antd/lib/upload/interface';
// import { getFilesSha1Info } from '@/utils/service';
// import fMessage from '@/components/fMessage';
// import fReadLocalFiles from '@/components/fReadLocalFiles';
// import fObjectsSelectorDrawer from '@/components/fObjectsSelectorDrawer';
// import { getTaskHandler } from '@/components/FResourceBatchUpload';
import Handle from '@/pages/resource/creatorBatch/Handle';

interface CreatorBatchProps {
  dispatch: Dispatch;
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
}

function CreatorBatch({ dispatch, resourceCreatorBatchPage }: CreatorBatchProps) {

  // const [$dataSource, set$dataSource, get$dataSource] = FUtil.Hook.useGetState<ResourceCreatorBatchPageState['resourceListInfo']>(resourceCreatorBatchPage.resourceListInfo);

  // React.useEffect(() => {
  //   set$dataSource(resourceCreatorBatchPage.resourceListInfo);
  // }, [resourceCreatorBatchPage.resourceListInfo]);

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

  // async function storageSpaceGotoList(objIDs: string[]) {
  //
  // }

  // async function onLocalUpload() {
  //   // console.log('onLocalUpload sdfujsdl;kfjlksdjflkjlkj');
  //   const { data: data_acceptResourceType }: {
  //     data: {
  //       formats: string[];
  //     }
  //   } = await FServiceAPI.Resource.getResourceTypeInfoByCode({
  //     code: resourceCreatorBatchPage.selectedResourceType?.value || '',
  //   });
  //   if (!data_acceptResourceType) {
  //     return;
  //   }
  //
  //   // set$accept();
  //   const files: RcFile[] | null = await fReadLocalFiles({
  //     accept: data_acceptResourceType.formats.join(','),
  //     multiple: true,
  //   });
  //
  //   if (!files) {
  //     return;
  //   }
  //   // console.log('*************************** 88888');
  //   dispatch<ChangeAction>({
  //     type: 'resourceCreatorBatchPage/change',
  //     payload: {
  //       showPage: 'resourceList',
  //       // resourceListInfo: resourceListInfo,
  //     },
  //   });
  //
  //   const handler = await getTaskHandler();
  //   // console.log(handler, 'handler sdifjlskdjflksdjlkfjlk');
  //
  //   handler.addTask(files);
  //
  // }

  // async function onImportStorage() {
  //   const objIDs: string[] | null = await fObjectsSelectorDrawer({
  //     resourceTypeCode: resourceCreatorBatchPage.selectedResourceType?.value || '',
  //   });
  //   // console.log(objIDs, 'objIDs');
  //   if (!objIDs) {
  //     return;
  //   }
  //
  //   storageSpaceGotoList(objIDs);
  // }

  return (<>

    {
      resourceCreatorBatchPage.showPage === 'resourceType' && (<ResourceType />)
    }

    {
      resourceCreatorBatchPage.showPage === 'uploadFile' && (<Handle />)
    }

    {/*{*/}
    {/*  resourceCreatorBatchPage.showPage === 'uploadFile' && (<UploadFile*/}
    {/*    onImportStorage={onImportStorage}*/}
    {/*    onLocalUpload={onLocalUpload}*/}
    {/*  />)*/}
    {/*}*/}

    {/*{*/}
    {/*  resourceCreatorBatchPage.showPage === 'resourceList' && (<ResourceList*/}
    {/*    onImportStorage={onImportStorage}*/}
    {/*    onLocalUpload={onLocalUpload}*/}
    {/*  />)*/}
    {/*}*/}

    {
      resourceCreatorBatchPage.showPage === 'finish' && (<Finish />)
    }
  </>);
}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(CreatorBatch);

// function getARightName(name: string) {
//   const newName: string = name.replace(new RegExp(/\.[\w-]+$/), '')
//     .substring(0, 50)
//     .replace(new RegExp(/[\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#]/g), '_');
//   return newName;
// }
//
// async function isOccupied(sha1s: string[]): Promise<{ [k: string]: boolean }> {
//   const result: { [k: string]: boolean } = {};
//   for (const sha1 of sha1s) {
//     const params3: Parameters<typeof FServiceAPI.Resource.getResourceBySha1>[0] = {
//       fileSha1: sha1,
//     };
//
//     const { data: data_ResourcesBySha1 }: {
//       data: {
//         userId: number;
//         resourceId: string;
//         resourceName: string;
//         resourceType: string[];
//         version: string;
//         resourceVersions: {
//           version: string;
//         }[];
//       }[];
//     } = await FServiceAPI.Resource.getResourceBySha1(params3);
//
//     result[sha1] = data_ResourcesBySha1.length > 0 && data_ResourcesBySha1[0].userId !== FUtil.Tool.getUserIDByCookies();
//   }
//
//   return result;
// }
