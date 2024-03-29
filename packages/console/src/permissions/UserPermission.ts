import { FServiceAPI, FUtil } from '@freelog/tools-lib';

type T_StateCode = 'SUCCESS' | 'ERR_NOT_LOGIN' | 'ERR_FREEZE' | 'ERR_NOT_ALPHA_TEST' | 'ERR_SWITCHED_USER';

class UserPermission {
  private _userId: number = -1;
  private _userType: 0 | 1 = 0; // 用户类型 0:初始账户 1:内测账户
  private _userInfo: null | any = null;
  private _taskQueue: Function[] = [];

  private _loadingData: 'NotStart' | 'Start' | 'End' = 'NotStart';

  constructor() {
    this._ready();

    this.check = this.check.bind(this);
    this.checkUrl = this.checkUrl.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  async check(this: UserPermission): Promise<T_StateCode> {
    await this._ready();
    if (!this._userInfo || FUtil.Tool.getUserIDByCookies() === -1) {
      return 'ERR_NOT_LOGIN';
    }

    if (this._userInfo.userId !== FUtil.Tool.getUserIDByCookies()) {
      return 'ERR_SWITCHED_USER';
    }

    if (this._userInfo.status === 1) {
      return 'ERR_FREEZE';
    }


    if (this._userInfo.userType === 0) {
      return 'ERR_NOT_ALPHA_TEST';
    }

    return 'SUCCESS';
  }

  async checkUrl(this: UserPermission, url: string): Promise<{ code: T_StateCode; goToUrl?: string; }> {
    const stateCode = await this.check();
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
        goToUrl: FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.login({ goTo: FUtil.Format.completeUrlByDomain('console') + url }),
      };
    }

    if (stateCode === 'ERR_SWITCHED_USER') {
      return {
        code: stateCode,
        goToUrl: url,
      };
    }

    if (stateCode === 'ERR_FREEZE') {
      // console.log(FUtil.LinkTo.invitation(), 'FUtil.LinkTo.invitation()90io3jsidkf;sldkfj');
      return {
        code: stateCode,
        goToUrl: FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.userFreeze(),
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

  async getUserInfo(this: UserPermission) {
    await this._ready();

    return this._userInfo;
  }

  private _ready(this: UserPermission): Promise<any> {
    // console.log('_ready_ready_ready32rfedwsafd');
    const exc = () => {
      while (this._taskQueue.length > 0) {
        const task = this._taskQueue.shift();
        task && task();
      }
    };
    const handleTasks = async () => {
      if (this._loadingData === 'End' || FUtil.Tool.getUserIDByCookies() === -1) {
        exc();
        return;
      }
      if (this._loadingData === 'Start') {
        return;
      }

      // NO_START
      this._loadingData = 'Start';

      const { data } = await FServiceAPI.User.currentUserInfo();

      this._loadingData = 'End';

      this._userInfo = data;
      this._userId = data.userId;
      this._userType = data.userType; // 用户类型 0:初始账户 1:内测账户

      exc();
    };
    // console.log('#####PPPPPPP23ewfds');
    const promise = new Promise((resolve) => {
      this._taskQueue.push(resolve);
    });
    handleTasks();
    // console.log('*****PPPPPPPsdf32rsedf');
    return promise;
  }
}

const userPermission = new UserPermission();
export default userPermission;
