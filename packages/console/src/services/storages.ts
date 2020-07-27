import request from '@/utils/request';

interface UploadImageParamsType {
  file: File;
}

export function uploadImage(params: any) {
  return request.post('/v1/storages/files/uploadImage', params);
}
