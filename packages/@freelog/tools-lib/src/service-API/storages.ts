import FUtil from '../utils';
import {AxiosRequestConfig, Canceler} from 'axios';

// 创建bucket(系统级的bucket不允许创建)
export interface CreateBucketParamsType {
  bucketName: string;
}

export function createBucket(params: CreateBucketParamsType) {
  // return FUtil.Axios.post(`/v1/storages/buckets`, params);
  return FUtil.Request({
    method: 'POST',
    url: `/v1/storages/buckets`,
    data: params,
  });
}

// 查看用户的bucket列表
interface BucketListParamsType {
  bucketType: 0 | 1 | 2;
}

export function bucketList(params: BucketListParamsType) {
  // return FUtil.Axios.get(`/v1/storages/buckets`, {
  //   params: params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v1/storages/buckets`,
    params: params,
  });
}

// 查询bucket使用情况
// interface SpaceStatisticsParamsType {
// }

export function spaceStatistics() {
  // return FUtil.Axios.get(`/v1/storages/buckets/spaceStatistics`);
  return FUtil.Request({
    method: 'GET',
    url: `/v1/storages/buckets/spaceStatistics`,
    // params: params,
  });
}

// 删除bucket
interface DeleteBucketParamsType {
  bucketName: string;
}

export function deleteBucket(params: DeleteBucketParamsType) {
  // return FUtil.Axios.delete(`/v1/storages/buckets/${params.bucketName}`);
  return FUtil.Request({
    method: 'DELETE',
    url: `/v1/storages/buckets/${params.bucketName}`,
    // params: params,
  });
}

// 查询bucket详情
interface BucketDetailsParamsType {
  bucketName: string;
}

export function bucketDetails({bucketName}: BucketDetailsParamsType) {
  // return FUtil.Axios.get(`/v1/storages/buckets/${bucketName}`);
  return FUtil.Request({
    method: 'GET',
    url: `/v1/storages/buckets/${bucketName}`,
    // params: params,
  });
}

// 分页查看存储对象列表
interface ObjectListParamsType {
  limit?: number;
  skip?: number;
  bucketName: string;
  resourceType?: string;
  isLoadingTypeless?: 0 | 1;
  keywords?: string;
  projection?: string;
  sort?: string;
  omitResourceType?: string;
}

export function objectList({bucketName, ...params}: ObjectListParamsType) {
  // return FUtil.Axios.get(`/v1/storages/buckets/${bucketName}/objects`, {
  //   params,
  // });

  return FUtil.Request({
    method: 'GET',
    url: `/v1/storages/buckets/${bucketName}/objects`,
    params: params,
  });
}

// 创建存储对象
interface CreateObjectParamsType {
  bucketName: string;
  objectName: string;
  sha1: string;
  resourceType?: string;
}

export function createObject({bucketName, ...params}: CreateObjectParamsType) {
  // return FUtil.Axios.post(`/v1/storages/buckets/${bucketName}/objects`, params);
  return FUtil.Request({
    method: 'POST',
    url: `/v1/storages/buckets/${bucketName}/objects`,
    data: params,
  });
}

// 查看存储对象详情
interface ObjectDetailsParamsType1 {
  bucketName: string;
  objectId: string;
}

interface ObjectDetailsParamsType2 {
  objectIdOrName: string;
}

export function objectDetails(params: ObjectDetailsParamsType1 | ObjectDetailsParamsType2) {
  if ((params as ObjectDetailsParamsType2).objectIdOrName) {
    // return FUtil.Axios.get(`/v1/storages/objects/${encodeURIComponent((params as ObjectDetailsParamsType2).objectIdOrName)}`);
    return FUtil.Request({
      method: 'GET',
      url: `/v1/storages/objects/${encodeURIComponent((params as ObjectDetailsParamsType2).objectIdOrName)}`,
      params: params,
    });
  }
  // return FUtil.Axios.get(`/v1/storages/buckets/${(params as ObjectDetailsParamsType1).bucketName}/objects/${(params as ObjectDetailsParamsType1).objectId}`);
  return FUtil.Request({
    method: 'GET',
    url: `/v1/storages/buckets/${(params as ObjectDetailsParamsType1).bucketName}/objects/${(params as ObjectDetailsParamsType1).objectId}`,
    params: params,
  });
}

// 删除存储对象
interface DeleteObjectsParamsType {
  bucketName: string;
  objectIds: string;
}

export function deleteObjects(params: DeleteObjectsParamsType) {
  // return FUtil.Axios.delete(`/v1/storages/buckets/${params.bucketName}/objects/${params.objectIds}`);
  return FUtil.Request({
    method: 'DELETE',
    url: `/v1/storages/buckets/${params.bucketName}/objects/${params.objectIds}`,
    data: params,
  });
}

// 查询bucket是否存在
interface BucketIsExistParamsType {
  bucketName: string;
}

export function bucketIsExist({bucketName}: BucketIsExistParamsType) {
  // return FUtil.Axios.get(`/v1/storages/buckets/${bucketName}/isExist`);
  return FUtil.Request({
    method: 'GET',
    url: `/v1/storages/buckets/${bucketName}/isExist`,
    // params: params,
  });
}

// 下载存储对象文件
interface DownloadObjectParamsType {
  objectIdOrName: string;
}

export function downloadObject(params: DownloadObjectParamsType) {
  return window.location.href = FUtil.Format.completeUrlByDomain('qi', true) + `/v1/storages/objects/${params.objectIdOrName}/file`;
}

// 根据sha1查询文件是否存在
interface FileIsExistParamsType {
  sha1: string;
}

export function fileIsExist(params: FileIsExistParamsType) {
  // return FUtil.Axios.get('/v1/storages/files/fileIsExist', {
  //   params: params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v1/storages/files/fileIsExist`,
    params: params,
  });
}

// 上传资源文件
interface UploadFileParamsType {
  file: File;
  resourceType?: string;
}

export function uploadFile(params: UploadFileParamsType, config?: AxiosRequestConfig, returnCancel: boolean = false): Promise<any> | [Promise<any>, Canceler] {
  const formData = new FormData();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      formData.append(key, value);
    }
  }

  if (!returnCancel) {
    // return FUtil.Axios.post('/v1/storages/files/upload', formData, config);
    return FUtil.Request({
      method: 'POST',
      url: `/v1/storages/files/upload`,
      data: formData,
      ...config,
    });
  }

  let cancel: any = null;
  // const promise = FUtil.Axios.post('/v1/storages/files/upload', formData, {
  //   cancelToken: new FUtil.Axios.CancelToken((c) => {
  //     cancel = c;
  //   }),
  // });

  const promise = FUtil.Request({
    method: 'POST',
    url: `/v1/storages/files/upload`,
    data: formData,
    cancelToken: new FUtil.Axios.CancelToken((c) => {
      cancel = c;
    }),
    ...config,
  });
  return [
    promise,
    cancel,
  ];

}

// 上传图片文件
interface UploadImageParamsType {
  file: File;
}

export function uploadImage(params: UploadImageParamsType, config?: AxiosRequestConfig) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      formData.append(key, value);
    }
  }
  // return FUtil.Axios.post('/v1/storages/files/uploadImage', formData, config);
  return FUtil.Request({
    method: 'POST',
    url: `/v1/storages/files/uploadImage`,
    data: formData,
    ...config,
  });
}

// 更新存储对象属性
interface UpdateObjectParamsType {
  objectIdOrName: string;
  customPropertyDescriptors?: {
    key: string;
    defaultValue: string;
    type: 'editableText' | 'readonlyText' | 'radio' | 'checkbox' | 'select';
    candidateItems?: string[];
    remark?: string;
  }[];
  dependencies?: {
    name: string;
    type: string;
    versionRange?: string;
  }[];
  resourceType?: string;
}

export function updateObject({objectIdOrName, ...params}: UpdateObjectParamsType) {
  // return FUtil.Axios.put(`/v1/storages/objects/${objectIdOrName}`, params);
  return FUtil.Request({
    method: 'PUT',
    url: `/v1/storages/objects/${objectIdOrName}`,
    data: params,
  });
}

// 批量查询存储对象列表
interface BatchObjectListParamsType {
  fullObjectNames?: string;
  objectIds?: string;
  projection?: string;
}

export function batchObjectList(params: BatchObjectListParamsType) {
  // return FUtil.Axios.get(`/v1/storages/objects/list`, {
  //   params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v1/storages/objects/list`,
    params: params,
  });
}

// 根据sha1和类型获取文件属性
interface FilePropertyParamsType {
  sha1: string;
  resourceType: string;
}

export function fileProperty({sha1, ...params}: FilePropertyParamsType) {
  // return FUtil.Axios.get(`/v1/storages/files/${sha1}/property`, {
  //   params,
  // });
  return FUtil.Request({
    method: 'GET',
    url: `/v1/storages/files/${sha1}/property`,
    params: params,
  });
}

// 对象依赖循环性检查
interface CycleDependencyCheckParamsType {
  objectIdOrName: string;
  dependencies: {
    name: string;
    type: 'resource' | 'object';
    versionRange?: string;
  }[];
}

export function cycleDependencyCheck({objectIdOrName, ...params}: CycleDependencyCheckParamsType) {
  // return FUtil.Axios.post(`/v1/storages/objects/${objectIdOrName}/cycleDependencyCheck`, params);
  return FUtil.Request({
    method: 'POST',
    url: `/v1/storages/objects/${objectIdOrName}/cycleDependencyCheck`,
    data: params,
  });
}
