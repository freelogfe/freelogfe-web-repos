import request, {apiHost} from '@/utils/request';
import {AxiosRequestConfig} from 'axios';

// 创建bucket(系统级的bucket不允许创建)
export interface CreateBucketParamsType {
  bucketName: string;
}

export function createBucket(params: CreateBucketParamsType) {
  return request.post(`/v1/storages/buckets`, params);
}

// 查看用户的bucket列表
export interface BucketListParamsType {
  bucketType: 0 | 1 | 2;
}

export function bucketList(params: BucketListParamsType) {
  return request.get(`/v1/storages/buckets`, {
    params: params,
  });
}

// 查询bucket使用情况
export interface SpaceStatisticsParamsType {
}

export function spaceStatistics(params?: SpaceStatisticsParamsType) {
  return request.get(`/v1/storages/buckets/spaceStatistics`);
}

// 删除bucket
export interface DeleteBucketParamsType {
  bucketName: string;
}

export function deleteBucket(params: DeleteBucketParamsType) {
  return request.get(`/v1/storages/buckets/${params.bucketName}`);
}

// 删除bucket
export interface DeleteBucketsParamsType {
  bucketName: string;
}

export function deleteBuckets(params: DeleteBucketsParamsType) {
  return request.delete(`/v1/storages/buckets/${params.bucketName}`);
}

// 分页查看存储对象列表
export interface ObjectListParamsType {
  bucketName: string;
  resourceType?: string;
  isLoadingTypeless?: 0 | 1;
  keywords?: string;
  projection?: string;
  page?: number;
  pageSize?: number;
}

export function objectList({bucketName, ...params}: DeleteBucketsParamsType) {
  return request.get(`/v1/storages/buckets/${bucketName}/objects`, {
    params,
  });
}

// 创建存储对象
export interface CreateObjectParamsType {
  bucketName: string;
  objectName: string;
  sha1: string;
  resourceType?: string;
}

export function createObject({bucketName, ...params}: CreateObjectParamsType) {
  return request.post(`/v1/storages/buckets/${bucketName}/objects`, params);
}

// 查看存储对象详情
export interface ObjectDetailsParamsType1 {
  bucketName: string;
  objectId: string;
}

export interface ObjectDetailsParamsType2 {
  objectIdOrName: string;
}

export function objectDetails(params: ObjectDetailsParamsType1 | ObjectDetailsParamsType2) {
  if ((params as ObjectDetailsParamsType2).objectIdOrName) {
    return request.get(`/v1/storages/objects/${(params as ObjectDetailsParamsType2).objectIdOrName}`);
  }
  return request.get(`/v1/storages/buckets/${(params as ObjectDetailsParamsType1).bucketName}/objects/${(params as ObjectDetailsParamsType1).objectId}`);
}

// 删除存储对象
export interface DeleteObjectsParamsType {
  bucketName: string;
  objectIds: string;
}

export function deleteObjects(params: DeleteObjectsParamsType) {
  return request.delete(`/v1/storages/buckets/${params.bucketName}/objects/${params.objectIds}`);
}

// 下载存储对象文件
export interface DownloadObjectParamsType {
  objectIdOrName: string;
}

export function downloadObject(params: DownloadObjectParamsType) {
  return window.location.href = apiHost + `/v1/storages/objects/${params.objectIdOrName}/file`;
  // return request.get(`/v1/storages/objects/${params.objectIdOrName}/file`, {
  //   responseType: 'arraybuffer',
  //   // onDownloadProgress: (progressEvent: any) => {
  //   //   console.log(progressEvent, 'progressEvent230');
  //   // }
  // });
}

// 根据sha1查询文件是否存在
export interface FileIsExistParamsType {
  sha1: string;
}

export function fileIsExist(params: FileIsExistParamsType) {
  return request.get('/v1/storages/files/fileIsExist', {
    params: params,
  });
}

// 上传资源文件
interface UploadFileParamsType {
  file: File;
  resourceType?: string;
}

export function uploadFile(params: UploadFileParamsType, config?: AxiosRequestConfig) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      formData.append(key, value);
    }
  }
  return request.post('/v1/storages/files/upload', formData, config);
}

// 上传图片文件
export interface UploadImageParamsType {
  file: File;
}

export function uploadImage(params: UploadImageParamsType, config?: AxiosRequestConfig) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      formData.append(key, value);
    }
  }
  return request.post('/v1/storages/files/uploadImage', formData, config);
}

// 更新存储对象属性
export interface UpdateObjectParamsType {
  objectIdOrName: string;
  // customProperty?: [];
  dependencies?: {
    name: string;
    type: string;
    versionRange?: string;
  }[];
  resourceType?: string;
}

export function updateObject({objectIdOrName, ...params}: UpdateObjectParamsType) {
  return request.put(`/v1/storages/objects/${objectIdOrName}`, params);
}

// 批量查询存储对象列表
export interface BatchObjectListParamsType {
  fullObjectNames?: string;
  objectIds?: string;
  projection?: string;
}

export function batchObjectList(params: BatchObjectListParamsType) {
  return request.get(`/v1/storages/objects/list`, {
    params,
  });
}
