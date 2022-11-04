/** 资源 */
export interface ResourceInEditor {
  resourceId: string;
  resourceName: string;
  coverImages: string[];
  resourceType: string[];
  latestVersion: string;
  version: string;
  policies: any[];
}

/** 对象 */
export interface ObjectInEditor {
  resourceId: string;
  resourceName: string;
  coverImages: string[];
  resourceType: string[];
  latestVersion: string;
  version: string;
  policies: any[];
  content: string; // url（媒体资源）/ 内容（文本资源）
}

/** 自定义 dom 数据 - 资源 */
export interface CustomResource {
  originType: 1 | 2; // 来源类型 1-资源 2-对象/url（这两种都输出 url）
  resourceId?: string;
  resourceName?: string;
  coverImages?: string[];
  resourceType: string[];
  latestVersion?: string;
  version?: string;
  authType?: 1 | 2 | 3 | 4; // 1-未签约；2-已签约未授权；3-已授权；4-上抛
  content: string; // url（媒体资源）/ 内容（文本资源）
  type?: 'resource';
  children?: any[];
}
