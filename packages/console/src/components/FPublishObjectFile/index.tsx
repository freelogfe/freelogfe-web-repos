import * as React from 'react';
import styles from './index.less';
import FUpload from '@/components/FUpload';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FServiceAPI, FUtil } from '../../../../@freelog/tools-lib';
import { Space } from 'antd';
import { RcFile } from 'antd/lib/upload/interface';

interface FPublishObjectFileProps {
  fileInfo: {
    name: string;
    sha1: string;
    from: string;
  } | null;

  onSucceed_UploadFile?(file: {
    fileName: string;
    sha1: string;
  }): void;

  onSucceed_ImportObject?(obj: {
    objID: string;
    objName: string;
    sha1: string;
  }): void;
}

interface FPublishObjectFileStates {
  fInfo: {
    name: string;
    sha1: string;
    from: string;
  } | null;
  fState: 'unsuccessful' | 'uploading' | 'succeeded';
  fUploadedError: '' | 'unexpectedSize' | 'selfTakeUp' | 'othersTakeUp';
  fUsedResource: {
    resourceID: string;
    resourceName: string;
    resourceType: string;
    resourceVersion: string;
    url: string;
  }[];
  fUploadingProgress: number;
  objectDrawerVisible: boolean;
}

// selectedFileStatus: -3 /* 上传成功 */
// | -2 /* 正在上传 */
// | -1 /* 正在校验 */
// | 0 /* 未上传 */
// | 1 /* 文件太大 */
// | 2 /* 类型不符 */
// | 3 /* 自己已上传 */
// | 4 /* 他人已上传 */
// ;
// selectedFileUsedResource: {
//   resourceID: string;
//   resourceName: string;
//   resourceType: string;
//   resourceVersion: string;
//   url: string;
// }
// [];
// selectedFileObjectDrawerVisible: boolean;

const initStates: FPublishObjectFileStates = {
  fInfo: null,
  fState: 'unsuccessful',
  fUploadedError: '',
  fUsedResource: [],
  fUploadingProgress: 0,
  objectDrawerVisible: false,
};

function FPublishObjectFile({ fileInfo, onSucceed_ImportObject, onSucceed_UploadFile }: FPublishObjectFileProps) {
  const [fInfo, set_fInfo] = React.useState<FPublishObjectFileStates['fInfo']>(initStates['fInfo']);
  const [fState, set_fState] = React.useState<FPublishObjectFileStates['fState']>(initStates['fState']);
  const [fUploadedError, set_fUploadedError] = React.useState<FPublishObjectFileStates['fUploadedError']>(initStates['fUploadedError']);
  const [fUsedResource, set_fUsedResource] = React.useState<FPublishObjectFileStates['fUsedResource']>(initStates['fUsedResource']);
  const [fUploadingProgress, set_fUploadingProgress] = React.useState<FPublishObjectFileStates['fUploadingProgress']>(initStates['fUploadingProgress']);
  const [objectDrawerVisible, set_objectDrawerVisible] = React.useState<FPublishObjectFileStates['objectDrawerVisible']>(initStates['objectDrawerVisible']);

  const uploadCancelHandler = React.useRef<any>();

  React.useEffect(() => {
    set_fInfo(null);
    set_fUploadedError('');
    set_fUsedResource([]);
    set_fUploadingProgress(0);
    if (!!fileInfo) {
      set_fState('succeeded');
    } else {
      set_fState('unsuccessful');
    }
  }, [fileInfo]);

  async function onUploadFilesLocally(file: RcFile) {
    if (file.size > 200 * 1024 * 1024) {
      set_fState('unsuccessful');
      set_fUploadedError('unexpectedSize');
      return;
    }

    const sha1: string = await FUtil.Tool.getSHA1Hash(file);
    const { data: data_fileIssExists }: any = await FServiceAPI.Storage.fileIsExist({ sha1 });

    if (data_fileIssExists[0].isExisting) {
      const params3: Parameters<typeof FServiceAPI.Resource.getResourceBySha1>[0] = {
        fileSha1: sha1,
      };

      const { data: data_ResourcesBySha1 } = await FServiceAPI.Resource.getResourceBySha1(params3);

      if (data_ResourcesBySha1.length > 0) {
        if (data_ResourcesBySha1[0].userId === FUtil.Tool.getUserIDByCookies()) {
          const usedResources: FPublishObjectFileStates['fUsedResource'] = data_ResourcesBySha1.map((d: any) => {
            return d.resourceVersions.map((v: any) => {
              return {
                resourceId: d.resourceId,
                resourceName: d.resourceName,
                resourceType: d.resourceType,
                resourceVersion: v.version,
                url: FUtil.LinkTo.resourceVersion({
                  resourceID: d.resourceId,
                  version: v.version,
                }),
              };
            });
          }).flat();
          set_fUsedResource(usedResources);
          set_fState('unsuccessful');
          set_fUploadedError('selfTakeUp');
        } else {
          const usedResources: FPublishObjectFileStates['fUsedResource'] = data_ResourcesBySha1.map((d: any) => {
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
          }).flat();
          set_fUsedResource(usedResources);
          set_fState('unsuccessful');
          set_fUploadedError('othersTakeUp');
        }
      } else {
        onSucceed_UploadFile && onSucceed_UploadFile({
          sha1,
          fileName: file.name,
        });
      }
    } else {
      set_fState('uploading');
      set_fUploadedError('');
      set_fInfo({
        sha1: '',
        name: file.name,
        from: '本地上传',
      });
      const [promise, cancel] = await FServiceAPI.Storage.uploadFile({
        file: file,
        // resourceType: resourceVersionCreatorPage.resourceType,
      }, {
        onUploadProgress(progressEvent: any) {
          set_fUploadingProgress(Math.floor(progressEvent.loaded / progressEvent.total * 100));
        },
      }, true);
      uploadCancelHandler.current = cancel;
      const { data } = await promise;
      uploadCancelHandler.current = null;
      set_fUploadingProgress(0);
      onSucceed_UploadFile && onSucceed_UploadFile({
        sha1,
        fileName: file.name,
      });
    }
  }

  async function onImportObject({
                                  objectID,
                                  objectName,
                                  sha1,
                                }: { objectID: string; objectName: string; sha1: string; }) {

    const params3: Parameters<typeof FServiceAPI.Resource.getResourceBySha1>[0] = {
      fileSha1: sha1,
    };

    const { data: data_ResourcesBySha1 } = await FServiceAPI.Resource.getResourceBySha1(params3);

    if (data_ResourcesBySha1.length > 0) {
      if (data_ResourcesBySha1[0].userId === FUtil.Tool.getUserIDByCookies()) {
        const usedResources: FPublishObjectFileStates['fUsedResource'] = data_ResourcesBySha1.map((d: any) => {
          return d.resourceVersions.map((v: any) => {
            return {
              resourceId: d.resourceId,
              resourceName: d.resourceName,
              resourceType: d.resourceType,
              resourceVersion: v.version,
              url: FUtil.LinkTo.resourceVersion({
                resourceID: d.resourceId,
                version: v.version,
              }),
            };
          });
        }).flat();
        set_fUsedResource(usedResources);
        set_fState('unsuccessful');
        set_fUploadedError('selfTakeUp');
      } else {
        const usedResources: FPublishObjectFileStates['fUsedResource'] = data_ResourcesBySha1.map((d: any) => {
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
        }).flat();
        set_fUsedResource(usedResources);
        set_fState('unsuccessful');
        set_fUploadedError('othersTakeUp');
      }
    } else {
      onSucceed_ImportObject && onSucceed_ImportObject({
        sha1,
        objID: objectID,
        objName: objectName,
      });
    }
  }

  if (fState === 'unsuccessful') {
    return (<Space size={15}>
      <FUpload
        // accept={resourceType === 'image' ? 'image/*' : '*'}
        beforeUpload={(file, FileList) => {
          onUploadFilesLocally(file);
          return false;
        }}
        showUploadList={false}
      >
        <FComponentsLib.FRectBtn
          type='default'
        >{FI18n.i18nNext.t('upload_from_local')}</FComponentsLib.FRectBtn>
      </FUpload>
      <FComponentsLib.FRectBtn
        type='default'
        onClick={() => {
          set_objectDrawerVisible(true);
        }}
      >{FI18n.i18nNext.t('choose_from_storage')}</FComponentsLib.FRectBtn>
    </Space>);
  }

  return (<div></div>);
}

export default FPublishObjectFile;
