import * as CryptoJS from "crypto-js";

/**
 * 根据 File 获取 SHA1 Hash 字符串
 * @param file
 * @return {Promise<string>}
 */
export function getSHA1Hash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (evt) {
      const wordArray = CryptoJS.lib.WordArray.create(reader.result);
      const hash = CryptoJS.SHA1(wordArray).toString();
      resolve(hash);
    };
    reader.readAsArrayBuffer(file);
  });
}
