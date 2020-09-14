/**
 * 将对应的字节数，转换为易读单位数量
 * @param bytes
 * @return {string}
 */
export function humanizeSize(bytes: number): string {
  // console.log('dddhumanizeSizesdfsd');
  if (bytes === 0) {
    return '0 B';
  }

  const k = 1024;

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // return (bytes / Math.pow(k, i)) + ' ' + sizes[i];
  //toPrecision(3) 后面保留一位小数，如1.0GB
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}
