import FUtil from '../utils';

// 列出翻译
interface ConfigsListParamsType {
  key: string;
  content: string;
  tagIds: string[];
  status: 0 | 1 | 2 | 3; // 0：全部 1：待翻译 2：待发布 3：已发布
}

export function configsList(params: ConfigsListParamsType) {
  // console.log('####@30984i2o3jdsjflfkjsdl')
  return FUtil.Request({
    method: 'POST',
    url: `/v2/i18n/configs/list`,
    data: params,
  });
}

// oss保存的翻译
// interface ConfigsListParamsType {
//   key: string;
//   content: string;
//   tagIds: string[];
//   status: 0 | 1 | 2 | 3; // 0：全部 1：待翻译 2：待发布 3：已发布
// }
//
// export function configsList(params: ConfigsListParamsType) {
//   // console.log('####@30984i2o3jdsjflfkjsdl')
//   return FUtil.Request({
//     method: 'POST',
//     url: `/v2/i18n/configs/list`,
//     data: params,
//   });
// }
