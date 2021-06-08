import moment from 'moment';

/**
 * 将对应的字节数，转换为易读单位数量
 * @param bytes
 * @return {string}
 */
export function humanizeSize(bytes: number): string {
  // console.log('dddhumanizeSizesdfsd');
  if (bytes <= 0) {
    return '0 B';
  }
  const unitArr = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = Math.round((bytes / Math.pow(1024, index)) * 100) / 100; //保留的小数位数
  return size + ' ' + unitArr[index];
}

/**
 * 格式化日期时间
 */
export function formatDateTime(date: string, showTime: boolean = false) {
  return moment(date).format('YYYY/MM/DD' + (showTime ? ' HH:mm' : ''));
}

/**
 * 根据传入的子域名拼合成完整的适合的url
 */
export function completeUrlByDomain(domain: string) {
  // if (!window.location.origin.includes('.com')) {
  //   return `http://${domain}.testfreelog.com`;
  // }
  // return `${window.location.protocol}//${domain}.${(window.location.host.match(/(?<=\.).*/) || [''])[0]}`;
  let origin = `http://${domain}.testfreelog.com`;
  if (window.location.origin.includes('.freelog.com')) {
    origin = `https://${domain}.freelog.com`;
  }
  return origin;
}
