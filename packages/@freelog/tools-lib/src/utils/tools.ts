import * as CryptoJS from 'crypto-js';

/**
 * 根据 File 获取 SHA1 Hash 字符串
 * @param file
 * @return {Promise<string>}
 */
export function getSHA1Hash(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader: FileReader = new FileReader();
    reader.onload = function () {
      const wordArray = CryptoJS.lib.WordArray.create(reader.result as any);
      const hash = CryptoJS.SHA1(wordArray).toString();
      resolve(hash);
    };
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 生成随机码
 */
export function generateRandomCode(strLen: number = 5): string {
  const allStr: string = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  const newStrArr: string[] = [];
  for (let i = 0; i < strLen; i++) {
    newStrArr.push(allStr[Math.floor(Math.random() * 61)]);
  }
  return newStrArr.join('');
}

/**
 * 通过读取 cookies 获取用户 ID
 */
export function getUserIDByCookies(): number {
  const uid: string | undefined = document.cookie.split('; ').find((co) => co.startsWith('uid='));
  if (!uid) {
    return -1;
  }
  return Number(uid.replace('uid=', ''));
}


/**
 * 将服务端的合约状态转换成前端需要的状态
 */
interface TransformServerAPIContractStateParams {
  status: 0 | 1 | 2; // 合同综合状态: 0:正常 1:已终止(不接受任何事件,也不给授权,事实上无效的合约) 2:异常
  authStatus: 1 | 2 | 128 | number; // 合同授权状态 1:正式授权 2:测试授权 128:未获得授权
}

export function transformServerAPIContractState({
                                                  status,
                                                  authStatus,
                                                }: TransformServerAPIContractStateParams): 'active' | 'testActive' | 'inactive' | 'terminal' | 'exception' {
  if (status === 0) {
    if (authStatus === 1 || authStatus === 3) {
      return 'active';
    }
    if (authStatus === 2) {
      return 'testActive';
    }
    if (authStatus === 128) {
      return 'inactive';
    }
  }

  if (status === 1) {
    return 'terminal';
  }
  return 'exception';
}

/**
 * 暂时休眠
 * @param ms 休眠时常(毫秒)
 */
export function promiseSleep(ms: number = 300): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

/**
 * 获取用户头像URL
 * @param userID
 */
export function getAvatarUrl(userID: number = 0): string {
  // return `${completeUrlByDomain('image')}/avatar/${userID || getUserIDByCookies()}?t=${Date.now()}`;
  return `https://image.freelog.com/avatar/${userID || getUserIDByCookies()}?t=${Date.now()}`;
}
