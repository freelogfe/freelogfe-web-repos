import request from '@/utils/request';

interface CurrentUserInfoParamsType {
}

export function currentUserInfo(params: CurrentUserInfoParamsType) {
  return request.get(`/v1/userinfos/current`);
}
