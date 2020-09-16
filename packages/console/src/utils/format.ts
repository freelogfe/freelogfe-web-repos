/**
 * 将对应的字节数，转换为易读单位数量
 * @param bytes
 * @return {string}
 */
// export function humanizeSize(bytes: number): string {
//   // console.log('dddhumanizeSizesdfsd');
//   if (bytes === 0) {
//     return '0 B';
//   }
//
//   const k = 1024;
//
//   const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
//
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//
//   // return (bytes / Math.pow(k, i)) + ' ' + sizes[i];
//   //toPrecision(3) 后面保留一位小数，如1.0GB
//   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
// }
export function humanizeSize(bytes: number): string {
  // console.log('dddhumanizeSizesdfsd');
  if (bytes < 0) {
    return "0 B";
  }
  let unitArr = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let index = 0;
  // var srcsize = parseFloat(value);
  index = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, index)).toFixed(2); //保留的小数位数
  // size = size
  return size + ' ' + unitArr[index];
}
