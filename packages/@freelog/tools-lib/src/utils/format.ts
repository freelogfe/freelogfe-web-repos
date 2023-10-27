import moment from 'moment';
// import {report} from '@freelog/resource-policy-lang/dist';
// import {ContractEntity} from '@freelog/resource-policy-lang/dist/tools/ContractTool';

// const {compile} = require('@freelog/resource-policy-lang');

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
 * @param domain 要组合的三级域名
 */
export function completeUrlByDomain(domain: string): string {
  let origin: string = `https://${domain}.testfreelog.com`;

  if (window.location.origin.includes('.freelog.com')) {
    origin = `https://${domain}.freelog.com`;
  }

  return origin;
}

/**
 * 根据策略代码和标的物类型，生成对应的翻译
 * @param code 策略代码
 * @param targetType 标的物类型
 */
// export async function policyCodeTranslationToText(code: string, targetType: string): Promise<{
//   error: string[] | null;
//   text?: string;
// }> {
//   try {
//     const result = await compile(
//       code,
//       targetType,
//       completeUrlByDomain('qi'),
//       window.location.origin.endsWith('.freelog.com') ? 'prod' : 'dev',
//     );
//     const contract: ContractEntity = {
//       audiences: result.state_machine.audiences,
//       fsmStates: Object.entries<any>(result.state_machine.states)
//         .map((st) => {
//           return {
//             name: st[0],
//             serviceStates: st[1].serviceStates,
//             events: st[1].transitions.map((ts: any) => {
//
//               return {
//                 id: ts.code,
//                 name: ts.name,
//                 args: ts.args,
//                 state: ts.toState,
//               };
//             }),
//           };
//         }),
//     };
//     const rrr = report(contract);
//     return {
//       error: null,
//       text: rrr.audienceInfos[0].content + rrr.content,
//     };
//   } catch (err) {
//     return {
//       error: [err.message],
//     };
//   }
// }


/**
 * 将资源类型关键字数组,转换成标准展示文字
 * @param arr 关键字数组
 */
export function resourceTypeKeyArrToResourceType(arr: string[]): string {
  return arr.join(' / ');
}
