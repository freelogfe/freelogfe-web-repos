import { FServiceAPI, FUtil } from '@freelog/tools-lib';

type T_StateCode = 'SUCCESS' | 'ERR_NOT_LOGIN' | 'ERR_FREEZE' | 'ERR_NOT_ALPHA_TEST' | 'ERR_SWITCHED_USER';

class UserPermission {

  #userId: number = -1;
  #userType: 0 | 1 = 0; // 用户类型 0:初始账户 1:内测账户
  #userInfo: null | any = null;
  #taskQueue: Function[] = [];

  #loadingData: 'NotStart' | 'Start' | 'End' = 'NotStart';

  constructor() {
    // self = this;
    this.#ready();

    this.check = this.check.bind(this);
    this.checkUrl = this.checkUrl.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  async check(this: UserPermission): Promise<T_StateCode> {
    await this.#ready();
    if (!this.#userInfo || FUtil.Tool.getUserIDByCookies() === -1) {
      return 'ERR_NOT_LOGIN';
    }

    if (this.#userInfo.userId !== FUtil.Tool.getUserIDByCookies()) {
      return 'ERR_SWITCHED_USER';
    }

    if (this.#userInfo.status === 1) {
      return 'ERR_FREEZE';
    }


    if (this.#userInfo.status === 2 || this.#userInfo.status === 3) {
      return 'ERR_NOT_ALPHA_TEST';
    }

    return 'SUCCESS';
  }

  async checkUrl(this: UserPermission, url: string): Promise<{ code: T_StateCode; goToUrl?: string; }> {
    const stateCode = await this.check();
    if (stateCode === 'SUCCESS') {
      return {
        code: stateCode,
      };
    }

    if (stateCode === 'ERR_NOT_LOGIN' && (
      !url.startsWith(FUtil.LinkTo.login()) ||
      !url.startsWith(FUtil.LinkTo.logon()) ||
      !url.startsWith(FUtil.LinkTo.retrieveUserPassword()) ||
      !url.startsWith('/bind')
    )) {
      return {
        code: stateCode,
        goToUrl: FUtil.LinkTo.login({ goTo: url }),
      };
    }

    if (stateCode === 'ERR_SWITCHED_USER') {
      return {
        code: stateCode,
        goToUrl: url,
      };
    }

    if (stateCode === 'ERR_FREEZE' && url.startsWith('/logged')) {
      // console.log(FUtil.LinkTo.invitation(), 'FUtil.LinkTo.invitation()90io3jsidkf;sldkfj');
      return {
        code: stateCode,
        goToUrl: FUtil.LinkTo.userFreeze(),
      };
    }

    return {
      code: stateCode,
    };
  }

  async getUserInfo(this: UserPermission) {
    await this.#ready();

    return this.#userInfo;
  }

  #ready(this: UserPermission): Promise<any> {
    const exc = () => {
      while (this.#taskQueue.length > 0) {
        const task = this.#taskQueue.shift();
        task && task();
      }
    };
    const handleTasks = async () => {
      if (this.#loadingData === 'End' || FUtil.Tool.getUserIDByCookies() === -1) {
        exc();
        return;
      }
      if (this.#loadingData === 'Start') {
        return;
      }

      // NO_START
      this.#loadingData = 'Start';

      const { data } = await FServiceAPI.User.currentUserInfo();

      this.#loadingData = 'End';

      this.#userInfo = data;
      this.#userId = data.userId;
      this.#userType = data.userType; // 用户类型 0:初始账户 1:内测账户

      exc();
    };
    const promise = new Promise((resolve) => {
      this.#taskQueue.push(resolve);
    });
    handleTasks();
    return promise;
  }
}

const userPermission = new UserPermission();
export default userPermission;
