import FUtil from '../utils';

// interface CurrentUserInfoParamsType {
// }

export function currentUserInfo() {
  return FUtil.Axios.get(`/v1/userinfos/current`);
}
