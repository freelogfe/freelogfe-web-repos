import { FServiceAPI, FUtil } from '@freelog/tools-lib';

type T_StateCode = 'SUCCESS' | 'ERR_NOT_LOGIN' | 'ERR_FREEZE' | 'ERR_NOT_ALPHA_TEST' | 'ERR_SWITCHED_USER';

let self: UserPermission;

class UserPermission {
  // private self: UserPermission = this;
  private _userId: number = -1;
  private _userType: 0 | 1 = 0; // 用户类型 0:初始账户 1:内测账户
  private _userInfo: null | any = null;
  private _taskQueue: Function[] = [];

  private _loadingData: 'NotStart' | 'Start' | 'End' = 'NotStart';

  constructor() {
    self = this;
    self._ready();
  }

  async check(): Promise<T_StateCode> {
    await self._ready();
    if (!self._userInfo || FUtil.Tool.getUserIDByCookies() === -1) {
      return 'ERR_NOT_LOGIN';
    }

    if (self._userInfo.userId !== FUtil.Tool.getUserIDByCookies()) {
      return 'ERR_SWITCHED_USER';
    }

    if (self._userInfo.status === 1) {
      return 'ERR_FREEZE';
    }


    if (self._userInfo.status === 2 || self._userInfo.status === 3) {
      return 'ERR_NOT_ALPHA_TEST';
    }

    return 'SUCCESS';
  }

  async checkUrl(url: string): Promise<{ code: T_StateCode; goToUrl?: string; }> {
    const stateCode = await self.check();
    if (stateCode === 'SUCCESS') {
      return {
        code: stateCode,
      };
    }

    if (stateCode === 'ERR_NOT_LOGIN' && (
      !url.startsWith(FUtil.LinkTo.login()) ||
      !url.startsWith(FUtil.LinkTo.logon()) ||
      !url.startsWith(FUtil.LinkTo.retrieveUserPassword())
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

  async getUserInfo() {
    // console.log('((((((((((((((((((((((((((9023ipofsd');
    await self._ready();
    // console.log('))))))))))))))))))))))))))9023ipofsd');

    return self._userInfo;
  }

  private _ready(): Promise<any> {
    // console.log('_ready_ready_ready32rfedwsafd');
    const exc = () => {
      while (self._taskQueue.length > 0) {
        const task = self._taskQueue.shift();
        task && task();
      }
    };
    const handleTasks = async () => {
      if (self._loadingData === 'End' || FUtil.Tool.getUserIDByCookies() === -1) {
        exc();
        return;
      }
      if (self._loadingData === 'Start') {
        return;
      }

      // NO_START
      self._loadingData = 'Start';

      const { data } = await FServiceAPI.User.currentUserInfo();

      self._loadingData = 'End';

      self._userInfo = data;
      self._userId = data.userId;
      self._userType = data.userType; // 用户类型 0:初始账户 1:内测账户

      exc();
    };
    // console.log('#####PPPPPPP23ewfds');
    const promise = new Promise((resolve) => {
      self._taskQueue.push(resolve);
    });
    handleTasks();
    // console.log('*****PPPPPPPsdf32rsedf');
    return promise;
  }
}

const userPermission = new UserPermission();
export default userPermission;
