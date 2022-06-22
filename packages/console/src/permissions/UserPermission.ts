import { FServiceAPI, FUtil } from '@freelog/tools-lib';

type T_StateCode = 'SUCCESS' | 'ERR_NOT_LOGIN' | 'ERR_NOT_ALPHA_TEST' | 'ERR_SWITCHED_USER';

class UserPermission {
  private _userInfo: null | {
    // status: 0;
    userId: number;
    userType: 0 | 1; // 用户类型 0:初始账户 1:内测账户
  } = null;

  constructor() {
    this._userInfo = null;
  }

  async ready(userInfo?: { userId: number; userType: 0 | 1; }): Promise<true> {
    if (!!this._userInfo) {
      return true;
    }
    if (!!userInfo) {
      this._userInfo = userInfo;
      return true;
    }
    if (FUtil.Tool.getUserIDByCookies() === -1) {
      return true;
    }
    const { data } = await FServiceAPI.User.currentUserInfo();

    this._userInfo = {
      userId: data.userId,
      userType: data.userType, // 用户类型 0:初始账户 1:内测账户
    };
    return true;
  }

  check(): T_StateCode {
    if (!this._userInfo) {
      return 'ERR_NOT_LOGIN';
    }

    if (this._userInfo.userType === 0) {
      return 'ERR_NOT_ALPHA_TEST';
    }

    return 'SUCCESS';
  }

  checkUrl(url: string): { code: T_StateCode; goToUrl?: string; } {
    const stateCode = this.check();
    if (
      stateCode === 'SUCCESS' ||
      url.startsWith(FUtil.LinkTo.market()) ||
      url.startsWith(FUtil.LinkTo.resourceDetails({ resourceID: 'resourceID' }).replace('resourceID', '')) ||
      url.startsWith(FUtil.LinkTo.exampleNodes())
    ) {
      return {
        code: stateCode,
      };
    }

    if (stateCode === 'ERR_NOT_LOGIN') {
      return {
        code: stateCode,
        goToUrl: FUtil.LinkTo.login({ goTo: url }),
      };
    }

    if (stateCode === 'ERR_NOT_ALPHA_TEST' && !url.startsWith(FUtil.LinkTo.invitation())) {
      // console.log(FUtil.LinkTo.invitation(), 'FUtil.LinkTo.invitation()90io3jsidkf;sldkfj');
      return {
        code: stateCode,
        goToUrl: FUtil.LinkTo.invitation({ goTo: url }),
      };
    }
    return {
      code: stateCode,
    };
  }
}

const userPermission = new UserPermission();
export default userPermission;
