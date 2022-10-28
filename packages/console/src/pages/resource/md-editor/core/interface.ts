/** 自定义 dom 数据 - 资源 */
export interface CustomResource {
  resourceId: string;
  resourceName: string;
  coverImages: string[];
  resourceType: string[];
  latestVersion: string;
  version: string;
  policies: any[];
  authType: 1 | 2 | 3 | 4; // 1-未签约；2-已签约未授权；3-已授权；4-上抛
  content: string; // url（媒体资源）/ 内容（文本资源）
  type?: 'resource';
  children?: any[];
}
