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
