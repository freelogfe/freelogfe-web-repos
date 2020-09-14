import request from '@/utils/request';
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
