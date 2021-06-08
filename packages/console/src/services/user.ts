// import request from '@/utils/request';
import {FUtil} from '@freelog/tools-lib';
// import axios from 'axios';

interface CurrentUserInfoParamsType {
}

export function currentUserInfo(params: CurrentUserInfoParamsType) {
  return FUtil.Axios.get(`/v1/userinfos/current`);
}
