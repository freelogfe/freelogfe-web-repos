/** 公共方法 */

/**
 * 格式化日期
 * @param time 时间戳、字符串日期等等
 * @param format 自定义输出结果格式（YYYY:年，MM:月，DD:日，hh:时，mm:分，ss:秒）
 */
export const formatDate = (time: number, format = 'YYYY-MM-DD hh:mm:ss') => {
  if (!time) return '';

  const date = new Date(time);

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const result = format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('hh', hour)
    .replace('mm', minutes)
    .replace('ss', seconds);
  return result;
};

/** 解析资源文件路径参数 */
export const hashImgUrl = (str: string) => {
  let params = str.split('#')[1];
  let param = params.split('&');
  let obj: { [key: string]: number } = {};
  for (const kv of param) {
    let [key, value] = kv.split('=');
    obj[key] = Number(value);
  }
  if (typeof obj['r'] !== 'number') {
    obj['r'] = 0;
  }
  return obj;
};
